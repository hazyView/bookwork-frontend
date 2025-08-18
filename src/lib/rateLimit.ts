// Rate limiting middleware with progressive delays
import type { RequestEvent } from '@sveltejs/kit';
import { ApplicationMetrics } from './metrics';

interface RateLimitEntry {
	count: number;
	resetTime: number;
	lastAttempt: number;
	blocked: boolean;
	blockUntil?: number;
}

interface RateLimitConfig {
	windowMs: number;
	maxRequests: number;
	blockDurationMs: number;
	progressiveDelayMs: number;
	endpoints?: { [key: string]: Partial<RateLimitConfig> };
}

// In-memory storage (in production, use Redis or similar)
const rateLimitStorage = new Map<string, RateLimitEntry>();
const suspiciousIPs = new Set<string>();

// Default rate limiting configuration
const defaultConfig: RateLimitConfig = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 100, // requests per window
	blockDurationMs: 60 * 60 * 1000, // 1 hour block
	progressiveDelayMs: 1000, // 1 second initial delay
	endpoints: {
		'/api/auth/login': {
			windowMs: 15 * 60 * 1000, // 15 minutes
			maxRequests: 5, // login attempts per window
			blockDurationMs: 30 * 60 * 1000, // 30 minute block
			progressiveDelayMs: 2000, // 2 second delay
		},
		'/api/auth/register': {
			windowMs: 60 * 60 * 1000, // 1 hour
			maxRequests: 3, // registration attempts per hour
			blockDurationMs: 24 * 60 * 60 * 1000, // 24 hour block
			progressiveDelayMs: 5000, // 5 second delay
		},
		'/api/auth/reset-password': {
			windowMs: 60 * 60 * 1000, // 1 hour
			maxRequests: 3, // password reset attempts per hour
			blockDurationMs: 2 * 60 * 60 * 1000, // 2 hour block
			progressiveDelayMs: 3000, // 3 second delay
		},
		'/api/contact': {
			windowMs: 60 * 60 * 1000, // 1 hour
			maxRequests: 10, // contact form submissions per hour
			blockDurationMs: 2 * 60 * 60 * 1000, // 2 hour block
			progressiveDelayMs: 2000, // 2 second delay
		}
	}
};

/**
 * Get client IP address from request
 */
function getClientIP(event: RequestEvent): string {
	// Check various headers for real IP
	const forwarded = event.request.headers.get('x-forwarded-for');
	const realIP = event.request.headers.get('x-real-ip');
	const cfConnectingIP = event.request.headers.get('cf-connecting-ip');
	
	if (cfConnectingIP) return cfConnectingIP;
	if (realIP) return realIP;
	if (forwarded) return forwarded.split(',')[0].trim();
	
	// Fallback to connection info
	return event.getClientAddress();
}

/**
 * Get rate limit configuration for endpoint
 */
function getConfigForEndpoint(pathname: string, config: RateLimitConfig = defaultConfig): RateLimitConfig {
	// Check for exact match first
	if (config.endpoints?.[pathname]) {
		return { ...config, ...config.endpoints[pathname] };
	}
	
	// Check for pattern matches
	for (const [pattern, endpointConfig] of Object.entries(config.endpoints || {})) {
		if (pathname.startsWith(pattern.replace('*', ''))) {
			return { ...config, ...endpointConfig };
		}
	}
	
	return config;
}

/**
 * Calculate progressive delay based on attempt count
 */
function calculateDelay(attemptCount: number, baseDelayMs: number): number {
	// Exponential backoff with jitter
	const exponentialDelay = baseDelayMs * Math.pow(2, Math.min(attemptCount - 1, 10));
	const jitter = Math.random() * 0.1 * exponentialDelay;
	return Math.min(exponentialDelay + jitter, 30000); // Max 30 seconds
}

/**
 * Clean up expired entries from storage
 */
function cleanupExpiredEntries(): void {
	const now = Date.now();
	for (const [key, entry] of rateLimitStorage.entries()) {
		// Remove entries older than their reset time and not blocked
		if (!entry.blocked && now > entry.resetTime) {
			rateLimitStorage.delete(key);
		}
		// Remove blocked entries that have expired
		else if (entry.blocked && entry.blockUntil && now > entry.blockUntil) {
			rateLimitStorage.delete(key);
			// Also remove from suspicious IPs if it was there
			const ip = key.split(':')[0];
			suspiciousIPs.delete(ip);
		}
	}
}

/**
 * Check if IP should be treated as suspicious
 */
function isSuspiciousIP(ip: string): boolean {
	return suspiciousIPs.has(ip);
}

/**
 * Mark IP as suspicious
 */
function markIPAsSuspicious(ip: string): void {
	suspiciousIPs.add(ip);
	// Auto-remove after 24 hours
	setTimeout(() => suspiciousIPs.delete(ip), 24 * 60 * 60 * 1000);
}

/**
 * Rate limiting middleware
 */
export async function rateLimit(
	event: RequestEvent,
	config: RateLimitConfig = defaultConfig
): Promise<{ allowed: boolean; delay?: number; retryAfter?: number; error?: string }> {
	// Clean up expired entries periodically
	if (Math.random() < 0.01) { // 1% chance to clean up
		cleanupExpiredEntries();
	}
	
	const ip = getClientIP(event);
	const pathname = new URL(event.request.url).pathname;
	const endpointConfig = getConfigForEndpoint(pathname, config);
	
	// Create unique key for IP + endpoint combination
	const key = `${ip}:${pathname}`;
	const now = Date.now();
	
	// Get or create rate limit entry
	let entry = rateLimitStorage.get(key);
	
	if (!entry) {
		entry = {
			count: 0,
			resetTime: now + endpointConfig.windowMs,
			lastAttempt: now,
			blocked: false
		};
		rateLimitStorage.set(key, entry);
	}
	
	// Check if currently blocked
	if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
		return {
			allowed: false,
			retryAfter: Math.ceil((entry.blockUntil - now) / 1000),
			error: 'IP temporarily blocked due to rate limit violations'
		};
	}
	
	// Reset window if expired
	if (now > entry.resetTime) {
		entry.count = 0;
		entry.resetTime = now + endpointConfig.windowMs;
		entry.blocked = false;
		entry.blockUntil = undefined;
	}
	
	// Increment attempt count
	entry.count++;
	entry.lastAttempt = now;
	
	// Check if suspicious IP needs stricter limits
	const isIPSuspicious = isSuspiciousIP(ip);
	const effectiveMaxRequests = isIPSuspicious ? 
		Math.max(1, Math.floor(endpointConfig.maxRequests * 0.3)) : 
		endpointConfig.maxRequests;
	
	// Check if rate limit exceeded
	if (entry.count > effectiveMaxRequests) {
		// Block the IP
		entry.blocked = true;
		entry.blockUntil = now + endpointConfig.blockDurationMs;
		
		// Mark IP as suspicious if multiple violations
		if (entry.count > effectiveMaxRequests * 2) {
			markIPAsSuspicious(ip);
		}
		
		return {
			allowed: false,
			retryAfter: Math.ceil(endpointConfig.blockDurationMs / 1000),
			error: 'Rate limit exceeded. Access temporarily blocked.'
		};
	}
	
	// Calculate progressive delay if approaching limit
	let delay = 0;
	const threshold = Math.ceil(effectiveMaxRequests * 0.8); // 80% of limit
	
	if (entry.count > threshold) {
		delay = calculateDelay(entry.count - threshold, endpointConfig.progressiveDelayMs);
	}
	
	return {
		allowed: true,
		delay
	};
}

/**
 * Express-style middleware for SvelteKit
 */
export function createRateLimitMiddleware(config: RateLimitConfig = defaultConfig) {
	return async (event: RequestEvent, next: () => Promise<Response>): Promise<Response> => {
		const result = await rateLimit(event, config);
		
		if (!result.allowed) {
			// Record rate limit hit for metrics
			ApplicationMetrics.recordRateLimitHit(new URL(event.request.url).pathname);
			
			return new Response(
				JSON.stringify({
					error: result.error || 'Rate limit exceeded',
					retryAfter: result.retryAfter
				}),
				{
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': String(result.retryAfter || 60),
						'X-RateLimit-Limit': String(config.maxRequests),
						'X-RateLimit-Remaining': '0',
						'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + (result.retryAfter || 60))
					}
				}
			);
		}
		
		// Apply progressive delay if needed
		if (result.delay && result.delay > 0) {
			await new Promise(resolve => setTimeout(resolve, result.delay));
		}
		
		const response = await next();
		
		// Add rate limit headers to successful responses
		const entry = rateLimitStorage.get(`${getClientIP(event)}:${new URL(event.request.url).pathname}`);
		if (entry) {
			response.headers.set('X-RateLimit-Limit', String(config.maxRequests));
			response.headers.set('X-RateLimit-Remaining', String(Math.max(0, config.maxRequests - entry.count)));
			response.headers.set('X-RateLimit-Reset', String(Math.ceil(entry.resetTime / 1000)));
		}
		
		return response;
	};
}

/**
 * Get current rate limit status for debugging
 */
export function getRateLimitStatus(ip: string, pathname?: string): {
	entries: Array<{ key: string; entry: RateLimitEntry }>;
	suspicious: boolean;
} {
	const entries: Array<{ key: string; entry: RateLimitEntry }> = [];
	
	for (const [key, entry] of rateLimitStorage.entries()) {
		if (key.startsWith(`${ip}:`)) {
			if (!pathname || key.includes(pathname)) {
				entries.push({ key, entry });
			}
		}
	}
	
	return {
		entries,
		suspicious: isSuspiciousIP(ip)
	};
}

/**
 * Clear rate limit entries for IP (for testing/admin use)
 */
export function clearRateLimitForIP(ip: string): void {
	for (const key of rateLimitStorage.keys()) {
		if (key.startsWith(`${ip}:`)) {
			rateLimitStorage.delete(key);
		}
	}
	suspiciousIPs.delete(ip);
}
