// Secure cookie configuration and utilities
import { dev } from '$app/environment';

export interface CookieOptions {
	name: string;
	value: string;
	domain?: string;
	path?: string;
	expires?: Date;
	maxAge?: number;
	httpOnly?: boolean;
	secure?: boolean;
	sameSite?: 'Strict' | 'Lax' | 'None';
	partitioned?: boolean; // For CHIPS (Cookies Having Independent Partitioned State)
}

/**
 * Default secure cookie options
 */
const defaultCookieOptions: Partial<CookieOptions> = {
	path: '/',
	httpOnly: true,
	secure: !dev, // HTTPS only in production
	sameSite: 'Strict' // Strict CSRF protection
};

/**
 * Cookie security levels
 */
export const CookieSecurityLevel = {
	// Maximum security - for authentication tokens
	STRICT: {
		httpOnly: true,
		secure: true,
		sameSite: 'Strict' as const,
		path: '/',
		partitioned: false
	},
	
	// High security - for session data
	HIGH: {
		httpOnly: true,
		secure: !dev,
		sameSite: 'Strict' as const,
		path: '/'
	},
	
	// Medium security - for user preferences
	MEDIUM: {
		httpOnly: false, // May need client-side access
		secure: !dev,
		sameSite: 'Lax' as const,
		path: '/'
	},
	
	// Low security - for non-sensitive data
	LOW: {
		httpOnly: false,
		secure: false,
		sameSite: 'Lax' as const,
		path: '/'
	}
} as const;

/**
 * Cookie purposes and their security requirements
 */
export const CookiePurpose = {
	AUTHENTICATION: {
		name: 'auth-token',
		...CookieSecurityLevel.STRICT,
		maxAge: 4 * 60 * 60, // 4 hours
		description: 'Authentication token'
	},
	
	SESSION: {
		name: 'session-id',
		...CookieSecurityLevel.HIGH,
		maxAge: 24 * 60 * 60, // 24 hours
		description: 'Session identifier'
	},
	
	CSRF: {
		name: 'csrf-token',
		...CookieSecurityLevel.HIGH,
		maxAge: 8 * 60 * 60, // 8 hours
		description: 'CSRF protection token'
	},
	
	PREFERENCES: {
		name: 'user-prefs',
		...CookieSecurityLevel.MEDIUM,
		maxAge: 30 * 24 * 60 * 60, // 30 days
		description: 'User preferences'
	},
	
	ANALYTICS: {
		name: 'analytics-id',
		...CookieSecurityLevel.LOW,
		maxAge: 365 * 24 * 60 * 60, // 1 year
		description: 'Analytics tracking'
	},
	
	REMEMBER_ME: {
		name: 'remember-token',
		...CookieSecurityLevel.STRICT,
		maxAge: 30 * 24 * 60 * 60, // 30 days
		description: 'Remember me token'
	}
} as const;

/**
 * Generate secure cookie string
 */
export function generateSecureCookie(options: CookieOptions): string {
	const {
		name,
		value,
		domain,
		path = '/',
		expires,
		maxAge,
		httpOnly = true,
		secure = !dev,
		sameSite = 'Strict',
		partitioned = false
	} = { ...defaultCookieOptions, ...options };

	const cookieParts = [`${name}=${encodeURIComponent(value)}`];

	if (domain) {
		cookieParts.push(`Domain=${domain}`);
	}

	if (path) {
		cookieParts.push(`Path=${path}`);
	}

	if (expires) {
		cookieParts.push(`Expires=${expires.toUTCString()}`);
	}

	if (maxAge !== undefined) {
		cookieParts.push(`Max-Age=${maxAge}`);
	}

	if (httpOnly) {
		cookieParts.push('HttpOnly');
	}

	if (secure) {
		cookieParts.push('Secure');
	}

	if (sameSite) {
		cookieParts.push(`SameSite=${sameSite}`);
	}

	if (partitioned) {
		cookieParts.push('Partitioned');
	}

	return cookieParts.join('; ');
}

/**
 * Parse cookie string into object
 */
export function parseCookie(cookieHeader: string): Record<string, string> {
	const cookies: Record<string, string> = {};
	
	if (!cookieHeader) return cookies;
	
	cookieHeader.split(';').forEach(cookie => {
		const [name, ...rest] = cookie.trim().split('=');
		if (name && rest.length > 0) {
			cookies[name] = decodeURIComponent(rest.join('='));
		}
	});
	
	return cookies;
}

/**
 * Cookie security validator
 */
export function validateCookieSecurity(cookieString: string): {
	isSecure: boolean;
	issues: string[];
	recommendations: string[];
} {
	const issues: string[] = [];
	const recommendations: string[] = [];
	
	const lowerCookie = cookieString.toLowerCase();
	
	// Check for HttpOnly
	if (!lowerCookie.includes('httponly')) {
		issues.push('Missing HttpOnly flag - cookies can be accessed via JavaScript');
	}
	
	// Check for Secure flag (in production)
	if (!dev && !lowerCookie.includes('secure')) {
		issues.push('Missing Secure flag - cookies can be transmitted over HTTP');
	}
	
	// Check for SameSite
	if (!lowerCookie.includes('samesite')) {
		issues.push('Missing SameSite attribute - vulnerable to CSRF attacks');
	} else {
		if (lowerCookie.includes('samesite=none') && !lowerCookie.includes('secure')) {
			issues.push('SameSite=None requires Secure flag');
		}
	}
	
	// Check for overly long expiration
	const maxAgeMatch = cookieString.match(/Max-Age=(\d+)/i);
	if (maxAgeMatch) {
		const maxAge = parseInt(maxAgeMatch[1], 10);
		const maxAgeYears = maxAge / (365 * 24 * 60 * 60);
		
		if (maxAgeYears > 2) {
			recommendations.push('Consider shorter Max-Age for better security');
		}
	}
	
	// Check for domain scope
	if (lowerCookie.includes('domain=.')) {
		recommendations.push('Consider limiting cookie domain scope');
	}
	
	// Check for broad path
	if (lowerCookie.includes('path=/') && !lowerCookie.includes('path=/specific')) {
		recommendations.push('Consider limiting cookie path scope if possible');
	}
	
	return {
		isSecure: issues.length === 0,
		issues,
		recommendations
	};
}

/**
 * Secure cookie manager
 */
export class SecureCookieManager {
	private domain?: string;
	private secure: boolean;

	constructor(options: { domain?: string; secure?: boolean } = {}) {
		this.domain = options.domain;
		this.secure = options.secure ?? !dev;
	}

	/**
	 * Set a secure cookie
	 */
	setCookie(
		response: Response,
		purpose: keyof typeof CookiePurpose,
		value: string,
		overrides: Partial<CookieOptions> = {}
	): void {
		const config = CookiePurpose[purpose];
		const cookieOptions: CookieOptions = {
			...config,
			name: config.name,
			value,
			domain: this.domain,
			secure: this.secure,
			...overrides
		};

		const cookieString = generateSecureCookie(cookieOptions);
		response.headers.append('Set-Cookie', cookieString);
	}

	/**
	 * Get cookie value from request
	 */
	getCookie(request: Request, purpose: keyof typeof CookiePurpose): string | null {
		const config = CookiePurpose[purpose];
		const cookies = parseCookie(request.headers.get('cookie') || '');
		return cookies[config.name] || null;
	}

	/**
	 * Delete a cookie
	 */
	deleteCookie(
		response: Response,
		purpose: keyof typeof CookiePurpose,
		options: { domain?: string; path?: string } = {}
	): void {
		const config = CookiePurpose[purpose];
		const deleteOptions: CookieOptions = {
			name: config.name,
			value: '',
			expires: new Date(0), // Expired date
			domain: options.domain || this.domain,
			path: options.path || '/',
			httpOnly: config.httpOnly,
			secure: this.secure,
			sameSite: config.sameSite
		};

		const cookieString = generateSecureCookie(deleteOptions);
		response.headers.append('Set-Cookie', cookieString);
	}

	/**
	 * Clear all application cookies
	 */
	clearAllCookies(response: Response): void {
		Object.keys(CookiePurpose).forEach(purpose => {
			this.deleteCookie(response, purpose as keyof typeof CookiePurpose);
		});
	}
}

/**
 * Cookie consent and GDPR compliance utilities
 */
export interface CookieConsentLevel {
	necessary: boolean;
	functional: boolean;
	analytics: boolean;
	marketing: boolean;
}

export const ConsentCategories = {
	necessary: {
		purposes: ['AUTHENTICATION', 'SESSION', 'CSRF'] as const,
		description: 'Required for basic site functionality',
		required: true
	},
	functional: {
		purposes: ['PREFERENCES', 'REMEMBER_ME'] as const,
		description: 'Enable enhanced functionality and personalization',
		required: false
	},
	analytics: {
		purposes: ['ANALYTICS'] as const,
		description: 'Help us understand how visitors use our site',
		required: false
	},
	marketing: {
		purposes: [] as const,
		description: 'Used to deliver personalized advertisements',
		required: false
	}
} as const;

/**
 * Check if cookie should be set based on consent
 */
export function shouldSetCookie(
	purpose: keyof typeof CookiePurpose,
	consent: CookieConsentLevel
): boolean {
	for (const [category, config] of Object.entries(ConsentCategories)) {
		const purposeList = config.purposes as readonly (keyof typeof CookiePurpose)[];
		if (purposeList.includes(purpose)) {
			const categoryKey = category as keyof CookieConsentLevel;
			return config.required || consent[categoryKey];
		}
	}
	
	// Default to not setting if purpose is unknown
	return false;
}

/**
 * Generate cookie consent headers
 */
export function generateConsentHeaders(consent: CookieConsentLevel): Headers {
	const headers = new Headers();
	
	// Clear cookies for denied categories
	Object.entries(ConsentCategories).forEach(([category, config]) => {
		const categoryKey = category as keyof CookieConsentLevel;
		
		if (!config.required && !consent[categoryKey]) {
			// Add headers to clear cookies in this category
			config.purposes.forEach(purpose => {
				const cookieConfig = CookiePurpose[purpose];
				headers.append('Set-Cookie', 
					generateSecureCookie({
						name: cookieConfig.name,
						value: '',
						expires: new Date(0),
						path: '/',
						httpOnly: cookieConfig.httpOnly,
						secure: cookieConfig.secure,
						sameSite: cookieConfig.sameSite
					})
				);
			});
		}
	});
	
	return headers;
}

/**
 * Audit cookies in response
 */
export function auditResponseCookies(response: Response): {
	cookies: Array<{
		name: string;
		security: ReturnType<typeof validateCookieSecurity>;
		purpose?: keyof typeof CookiePurpose;
	}>;
	overallSecurity: 'high' | 'medium' | 'low';
} {
	const setCookieHeaders = response.headers.getSetCookie?.() || 
		[response.headers.get('Set-Cookie')].filter(Boolean) as string[];
	
	const cookies = setCookieHeaders.map(cookieString => {
		const nameMatch = cookieString.match(/^([^=]+)=/);
		const name = nameMatch ? nameMatch[1] : 'unknown';
		
		// Find purpose
		const purpose = Object.entries(CookiePurpose).find(([_, config]) => 
			config.name === name
		)?.[0] as keyof typeof CookiePurpose | undefined;
		
		return {
			name,
			security: validateCookieSecurity(cookieString),
			purpose
		};
	});
	
	// Determine overall security level
	const hasSecurityIssues = cookies.some(cookie => !cookie.security.isSecure);
	const hasRecommendations = cookies.some(cookie => cookie.security.recommendations.length > 0);
	
	let overallSecurity: 'high' | 'medium' | 'low' = 'high';
	if (hasSecurityIssues) {
		overallSecurity = 'low';
	} else if (hasRecommendations) {
		overallSecurity = 'medium';
	}
	
	return {
		cookies,
		overallSecurity
	};
}
