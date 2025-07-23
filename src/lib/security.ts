/**
 * Security middleware and headers configuration
 * Provides comprehensive security implementation with consistent behavior
 * across development and production environments for better security testing
 */

import { dev } from '$app/environment';

// CSP Directive types
interface CSPDirectives {
	'default-src'?: string[];
	'script-src'?: string[];
	'style-src'?: string[];
	'img-src'?: string[];
	'font-src'?: string[];
	'connect-src'?: string[];
	'media-src'?: string[];
	'object-src'?: string[];
	'base-uri'?: string[];
	'form-action'?: string[];
	'frame-ancestors'?: string[];
	'frame-src'?: string[];
	'worker-src'?: string[];
	'manifest-src'?: string[];
	'upgrade-insecure-requests'?: string[] | undefined;
	'block-all-mixed-content'?: string[] | undefined;
}

/**
 * Unified Content Security Policy configuration
 * Minimizes differences between development and production for consistent security testing
 */
export const cspDirectives: CSPDirectives = {
	'default-src': ["'self'"],
	'script-src': [
		"'self'",
		// Allow unsafe-inline and unsafe-eval for SvelteKit in both dev and prod
		"'unsafe-inline'",
		...(dev ? ["'unsafe-eval'"] : []),
		// Trusted CDNs for production use
		'https://cdn.jsdelivr.net',
	],
	'style-src': [
		"'self'",
		// Allow unsafe-inline for SvelteKit SSR styles in both dev and prod
		"'unsafe-inline'",
		'https://fonts.googleapis.com',
	],
	'img-src': [
		"'self'",
		'data:', // For base64 images
		'https:', // Allow HTTPS images from any source
		'blob:', // For generated/uploaded images
	],
	'font-src': [
		"'self'",
		'https://fonts.gstatic.com',
		'data:', // For base64 fonts
	],
	'connect-src': [
		"'self'",
		...(dev ? [
			'http://localhost:8000',
			'ws://localhost:8000'
		] : [
			process.env.VITE_API_BASE || 'https://api.bookwork.com',
			process.env.VITE_WS_BASE || 'wss://ws.bookwork.com'
		]),
	],
	'media-src': ["'self'", 'blob:', 'data:'],
	'object-src': ["'none'"],
	'base-uri': ["'self'"],
	'form-action': ["'self'"],
	'frame-ancestors': ["'none'"],
	'frame-src': ["'none'"],
	'worker-src': ["'self'"],
	'manifest-src': ["'self'"],
	// Apply security directives in both dev and production
	'upgrade-insecure-requests': [],
	// Only block mixed content in production to allow dev tools
	'block-all-mixed-content': dev ? undefined : [],
};

/**
 * Security headers configuration with consistent application across environments
 */
export const securityHeaders = {
	// Prevent clickjacking
	'X-Frame-Options': 'DENY',
	
	// Prevent MIME type sniffing
	'X-Content-Type-Options': 'nosniff',
	
	// XSS Protection (legacy but still useful)
	'X-XSS-Protection': '1; mode=block',
	
	// Referrer Policy - consistent across environments
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	
	// Permissions Policy (formerly Feature Policy) - consistent security
	'Permissions-Policy': [
		'camera=()',
		'microphone=()',
		'geolocation=()',
		'payment=()',
		'usb=()',
		'magnetometer=()',
		'accelerometer=()',
		'gyroscope=()',
		'fullscreen=(self)',
		'picture-in-picture=()',
		'clipboard-write=(self)',
		'clipboard-read=()',
	].join(', '),
	
	// HTTPS Strict Transport Security - apply in development too for testing
	'Strict-Transport-Security': dev 
		? 'max-age=300; includeSubDomains' // Shorter time in dev
		: 'max-age=31536000; includeSubDomains; preload', // Full security in prod
	
	// Cross-Origin policies - consistent security
	'Cross-Origin-Embedder-Policy': 'require-corp',
	'Cross-Origin-Opener-Policy': 'same-origin',
	'Cross-Origin-Resource-Policy': 'same-origin',
	
	// Cache control for security-sensitive content
	'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
	'Pragma': 'no-cache',
	'Expires': '0',
};

/**
 * Generate CSP header string from directives
 * @param directives CSP directives configuration
 * @returns CSP header string
 */
export function generateCSPHeader(directives: CSPDirectives = cspDirectives): string {
	// For SvelteKit, we ALWAYS use the base directives that include 'unsafe-inline'
	// This ensures compatibility with SvelteKit SSR
	return Object.entries(directives)
		.filter(([_, value]) => value !== undefined && Array.isArray(value))
		.map(([key, values]) => `${key} ${(values as string[]).join(' ')}`)
		.join('; ');
}

/**
 * Apply comprehensive security headers to response
 * Consistent application across all environments
 * This is the SINGLE SOURCE for CSP generation - no other function should set CSP headers
 * @param headers Response headers object
 * @returns Headers with security headers applied
 */
export function applySecurityHeaders(headers = new Headers()): Headers {
	// Apply CSP - this is the ONLY place CSP should be set
	// Using 'unsafe-inline' for SvelteKit SSR compatibility
	headers.set('Content-Security-Policy', generateCSPHeader(cspDirectives));
	
	// Apply all other security headers
	Object.entries(securityHeaders).forEach(([key, value]) => {
		headers.set(key, value);
	});
	
	// Development-specific headers for debugging
	if (dev) {
		headers.set('X-Environment', 'development');
		headers.set('X-CSP-Source', 'security.ts-single-source');
	}
	
	return headers;
}

/**
 * Security configuration for different content types
 * Provides appropriate security settings based on content context
 */
export const securityContexts = {
	api: {
		'Content-Type': 'application/json',
		'X-Content-Type-Options': 'nosniff',
		'Cache-Control': 'no-store',
	},
	
	static: {
		'Cache-Control': dev 
			? 'no-cache' 
			: 'public, max-age=31536000, immutable',
		'X-Content-Type-Options': 'nosniff',
	},
	
	auth: {
		'Cache-Control': 'no-store, no-cache, must-revalidate',
		'Pragma': 'no-cache',
		'X-Frame-Options': 'DENY',
	},
	
	admin: {
		'Cache-Control': 'no-store',
		'X-Frame-Options': 'DENY',
		'X-Robots-Tag': 'noindex, nofollow',
	},
} as const;

/**
 * Apply context-specific security headers
 * @param headers Response headers
 * @param context Security context
 * @returns Headers with context-specific security applied
 */
export function applyContextSecurity(
	headers: Headers, 
	context: keyof typeof securityContexts
): Headers {
	const contextHeaders = securityContexts[context];
	
	Object.entries(contextHeaders).forEach(([key, value]) => {
		headers.set(key, value);
	});
	
	return headers;
}

/**
 * Validate CSP configuration for potential security issues
 * @param directives CSP directives to validate
 * @returns Validation results
 */
export function validateCSPConfig(directives: CSPDirectives): {
	isSecure: boolean;
	warnings: string[];
	errors: string[];
} {
	const warnings: string[] = [];
	const errors: string[] = [];
	
	// Check for unsafe directives
	if (directives['script-src']?.includes("'unsafe-eval'")) {
		if (!dev) {
			errors.push("'unsafe-eval' should not be used in production");
		} else {
			warnings.push("'unsafe-eval' detected in development mode");
		}
	}
	
	if (directives['script-src']?.includes("'unsafe-inline'")) {
		errors.push("'unsafe-inline' for scripts is dangerous - use nonces instead");
	}
	
	if (directives['style-src']?.includes("'unsafe-inline'") && !dev) {
		warnings.push("'unsafe-inline' for styles should be replaced with nonces in production");
	}
	
	// Check for overly permissive directives
	if (directives['default-src']?.includes('*')) {
		errors.push("Wildcard (*) in default-src is too permissive");
	}
	
	if (directives['script-src']?.includes('*')) {
		errors.push("Wildcard (*) in script-src is dangerous");
	}
	
	const isSecure = errors.length === 0;
	
	return { isSecure, warnings, errors };
}

/**
 * Validate that the current CSP header is properly configured for SvelteKit
 * This helps detect if nonce-based CSP conflicts have been introduced
 * @param headers Response headers to check
 * @returns Validation results with SvelteKit-specific checks
 */
export function validateSvelteKitCSP(headers: Headers): {
	isValid: boolean;
	issues: string[];
	hasUnsafeInline: boolean;
	hasNonces: boolean;
} {
	const issues: string[] = [];
	const csp = headers.get('content-security-policy') || '';
	
	const hasUnsafeInline = csp.includes("'unsafe-inline'");
	const hasNonces = /nonce-[A-Za-z0-9+/=]+/.test(csp);
	
	// For SvelteKit, we need 'unsafe-inline' and should NOT have nonces
	if (!hasUnsafeInline) {
		issues.push("Missing 'unsafe-inline' directive required for SvelteKit SSR");
	}
	
	if (hasNonces) {
		issues.push("CSP contains nonce directives which conflict with SvelteKit SSR");
		issues.push("Nonce-based CSP requires HTML transformation not implemented in this setup");
	}
	
	// Check for required style-src unsafe-inline
	if (!csp.match(/style-src[^;]*'unsafe-inline'/)) {
		issues.push("style-src missing 'unsafe-inline' required for SvelteKit styles");
	}
	
	// Check for required script-src unsafe-inline (in development)
	if (dev && !csp.match(/script-src[^;]*'unsafe-inline'/)) {
		issues.push("script-src missing 'unsafe-inline' required for SvelteKit in development");
	}
	
	const isValid = issues.length === 0;
	
	return { isValid, issues, hasUnsafeInline, hasNonces };
}

export function validateCSPForAPI(generatedCsp: string, apiBaseUrl: string, wsBaseUrl?: string): boolean {
    const connectSrc = generatedCsp.match(/connect-src ([^;]+)/)?.[1] || '';
    if (!connectSrc) return false;

    const apiOrigin = new URL(apiBaseUrl).origin;
    let isValid = connectSrc.includes(apiOrigin) || connectSrc.includes("'self'");

    if (wsBaseUrl) {
        const wsOrigin = new URL(wsBaseUrl).origin;
        isValid = isValid && connectSrc.includes(wsOrigin);
    }

    return isValid;
}
