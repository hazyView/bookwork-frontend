// Session management utilities with secure configurations
import { dev } from '$app/environment';
import SecureStorage from './secureStorage';

export interface SessionConfig {
	maxAge: number; // Session timeout in milliseconds
	renewalThreshold: number; // Renewal threshold (percentage of maxAge)
	maxConcurrentSessions: number; // Max concurrent sessions per user
	inactivityTimeout: number; // Inactivity timeout in milliseconds
	secureTransport: boolean; // Require HTTPS
	preventConcurrentLogins: boolean; // Prevent multiple logins
}

export interface SessionData {
	id: string;
	userId: string;
	createdAt: Date;
	lastActivity: Date;
	expiresAt: Date;
	ipAddress?: string;
	userAgent?: string;
	deviceFingerprint?: string;
	isActive: boolean;
	metadata?: Record<string, unknown>;
}

// Default session configuration
const defaultConfig: SessionConfig = {
	maxAge: dev ? 8 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000, // 8h dev, 4h prod
	renewalThreshold: 0.75, // Renew at 75% of session lifetime
	maxConcurrentSessions: 3,
	inactivityTimeout: 30 * 60 * 1000, // 30 minutes
	secureTransport: !dev,
	preventConcurrentLogins: false
};

class SessionManager {
	private config: SessionConfig;
	private sessions: Map<string, SessionData> = new Map();
	private userSessions: Map<string, Set<string>> = new Map();
	private cleanupInterval: ReturnType<typeof setInterval> | null = null;

	constructor(config: Partial<SessionConfig> = {}) {
		this.config = { ...defaultConfig, ...config };
		this.startCleanup();
	}

	/**
	 * Create a new session
	 */
	async createSession(
		userId: string,
		options: {
			ipAddress?: string;
			userAgent?: string;
			deviceFingerprint?: string;
			metadata?: Record<string, unknown>;
		} = {}
	): Promise<SessionData> {
		const sessionId = await this.generateSessionId();
		const now = new Date();
		const expiresAt = new Date(now.getTime() + this.config.maxAge);

		// Check concurrent session limits
		if (this.config.preventConcurrentLogins) {
			await this.invalidateUserSessions(userId);
		} else {
			await this.enforceConcurrentSessionLimit(userId);
		}

		const session: SessionData = {
			id: sessionId,
			userId,
			createdAt: now,
			lastActivity: now,
			expiresAt,
			ipAddress: options.ipAddress,
			userAgent: options.userAgent,
			deviceFingerprint: options.deviceFingerprint,
			isActive: true,
			metadata: options.metadata
		};

		// Store session
		this.sessions.set(sessionId, session);
		
		// Track user sessions
		if (!this.userSessions.has(userId)) {
			this.userSessions.set(userId, new Set());
		}
		this.userSessions.get(userId)!.add(sessionId);

		// Store in secure storage
		await SecureStorage.setItem(`session_${sessionId}`, session);

		return session;
	}

	/**
	 * Validate and refresh session
	 */
	async validateSession(sessionId: string, options: {
		ipAddress?: string;
		userAgent?: string;
		updateActivity?: boolean;
	} = {}): Promise<SessionData | null> {
		let session = this.sessions.get(sessionId);

		// Try to load from storage if not in memory
		if (!session) {
			const storedData = await SecureStorage.getItem(`session_${sessionId}`);
			if (storedData && typeof storedData === 'object') {
				const stored = storedData as any;
				session = {
					id: stored.id,
					userId: stored.userId,
					createdAt: new Date(stored.createdAt),
					lastActivity: new Date(stored.lastActivity),
					expiresAt: new Date(stored.expiresAt),
					ipAddress: stored.ipAddress,
					userAgent: stored.userAgent,
					deviceFingerprint: stored.deviceFingerprint,
					isActive: stored.isActive,
					metadata: stored.metadata
				};
				this.sessions.set(sessionId, session);
			}
		}

		if (!session || !session.isActive) {
			return null;
		}

		const now = new Date();

		// Check expiration
		if (now > session.expiresAt) {
			await this.invalidateSession(sessionId);
			return null;
		}

		// Check inactivity timeout
		const inactivityLimit = new Date(
			session.lastActivity.getTime() + this.config.inactivityTimeout
		);
		if (now > inactivityLimit) {
			await this.invalidateSession(sessionId);
			return null;
		}

		// Validate IP and User Agent if configured
		if (this.config.secureTransport) {
			if (options.ipAddress && session.ipAddress && options.ipAddress !== session.ipAddress) {
				// IP address changed - possible session hijacking
				await this.invalidateSession(sessionId);
				return null;
			}

			if (options.userAgent && session.userAgent && options.userAgent !== session.userAgent) {
				// User agent changed - possible session hijacking
				await this.invalidateSession(sessionId);
				return null;
			}
		}

		// Update last activity
		if (options.updateActivity !== false) {
			session.lastActivity = now;
			await SecureStorage.setItem(`session_${sessionId}`, session);
		}

		// Check if session needs renewal
		const renewalTime = new Date(
			session.createdAt.getTime() + (this.config.maxAge * this.config.renewalThreshold)
		);
		
		if (now > renewalTime) {
			// Extend session
			session.expiresAt = new Date(now.getTime() + this.config.maxAge);
			await SecureStorage.setItem(`session_${sessionId}`, session);
		}

		return session;
	}

	/**
	 * Invalidate a specific session
	 */
	async invalidateSession(sessionId: string): Promise<void> {
		const session = this.sessions.get(sessionId);
		
		if (session) {
			// Remove from user sessions tracking
			const userSessions = this.userSessions.get(session.userId);
			if (userSessions) {
				userSessions.delete(sessionId);
				if (userSessions.size === 0) {
					this.userSessions.delete(session.userId);
				}
			}
		}

		// Remove from memory and storage
		this.sessions.delete(sessionId);
		await SecureStorage.removeItem(`session_${sessionId}`);
	}

	/**
	 * Invalidate all sessions for a user
	 */
	async invalidateUserSessions(userId: string): Promise<void> {
		const sessionIds = this.userSessions.get(userId);
		if (!sessionIds) return;

		// Invalidate all sessions
		for (const sessionId of sessionIds) {
			await this.invalidateSession(sessionId);
		}
	}

	/**
	 * Get all active sessions for a user
	 */
	async getUserSessions(userId: string): Promise<SessionData[]> {
		const sessionIds = this.userSessions.get(userId);
		if (!sessionIds) return [];

		const sessions: SessionData[] = [];
		for (const sessionId of sessionIds) {
			const session = await this.validateSession(sessionId, { updateActivity: false });
			if (session) {
				sessions.push(session);
			}
		}

		return sessions;
	}

	/**
	 * Enforce concurrent session limits
	 */
	private async enforceConcurrentSessionLimit(userId: string): Promise<void> {
		const sessions = await this.getUserSessions(userId);
		
		if (sessions.length >= this.config.maxConcurrentSessions) {
			// Sort by last activity and remove oldest sessions
			sessions.sort((a, b) => a.lastActivity.getTime() - b.lastActivity.getTime());
			
			const sessionsToRemove = sessions.slice(0, sessions.length - this.config.maxConcurrentSessions + 1);
			for (const session of sessionsToRemove) {
				await this.invalidateSession(session.id);
			}
		}
	}

	/**
	 * Generate cryptographically secure session ID
	 */
	private async generateSessionId(): Promise<string> {
		if (typeof crypto !== 'undefined' && crypto.randomUUID) {
			return crypto.randomUUID();
		}
		
		// Fallback for environments without crypto.randomUUID
		const array = new Uint8Array(32);
		crypto.getRandomValues(array);
		return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
	}

	/**
	 * Start cleanup interval for expired sessions
	 */
	private startCleanup(): void {
		// Run cleanup every 15 minutes
		this.cleanupInterval = setInterval(() => {
			this.cleanupExpiredSessions();
		}, 15 * 60 * 1000);
	}

	/**
	 * Clean up expired sessions
	 */
	private async cleanupExpiredSessions(): Promise<void> {
		const now = new Date();
		const expiredSessions: string[] = [];

		for (const [sessionId, session] of this.sessions.entries()) {
			if (now > session.expiresAt || !session.isActive) {
				expiredSessions.push(sessionId);
			}
		}

		// Remove expired sessions
		for (const sessionId of expiredSessions) {
			await this.invalidateSession(sessionId);
		}
	}

	/**
	 * Get session statistics
	 */
	getSessionStats(): {
		totalSessions: number;
		activeUsers: number;
		sessionsByUser: Record<string, number>;
	} {
		const sessionsByUser: Record<string, number> = {};
		
		for (const [userId, sessions] of this.userSessions.entries()) {
			sessionsByUser[userId] = sessions.size;
		}

		return {
			totalSessions: this.sessions.size,
			activeUsers: this.userSessions.size,
			sessionsByUser
		};
	}

	/**
	 * Destroy the session manager
	 */
	destroy(): void {
		if (this.cleanupInterval) {
			clearInterval(this.cleanupInterval);
			this.cleanupInterval = null;
		}
		this.sessions.clear();
		this.userSessions.clear();
	}
}

// Export singleton instance
export const sessionManager = new SessionManager();

/**
 * Session middleware for SvelteKit
 */
export function createSessionMiddleware(config?: Partial<SessionConfig>) {
	const manager = new SessionManager(config);

	return {
		/**
		 * Validate session from request
		 */
		async validateRequest(request: Request): Promise<SessionData | null> {
			const sessionId = this.extractSessionId(request);
			if (!sessionId) return null;

			const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
						   request.headers.get('x-real-ip') || 
						   request.headers.get('cf-connecting-ip');
			
			const userAgent = request.headers.get('user-agent');

			return manager.validateSession(sessionId, {
				ipAddress: clientIP || undefined,
				userAgent: userAgent || undefined
			});
		},

		/**
		 * Extract session ID from request
		 */
		extractSessionId(request: Request): string | null {
			const cookies = request.headers.get('cookie');
			if (!cookies) return null;

			const sessionCookie = cookies
				.split(';')
				.find(c => c.trim().startsWith('sessionId='));

			return sessionCookie ? sessionCookie.split('=')[1] : null;
		},

		/**
		 * Create session response headers
		 */
		createSessionCookie(sessionId: string, secure: boolean = !dev): string {
			const cookieOptions = [
				`sessionId=${sessionId}`,
				'HttpOnly',
				'Path=/',
				`SameSite=Strict`,
				...(secure ? ['Secure'] : []),
				`Max-Age=${Math.floor(defaultConfig.maxAge / 1000)}`
			];

			return cookieOptions.join('; ');
		},

		manager
	};
}
