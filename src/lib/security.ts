// Security middleware and headers configuration
import { dev } from '$app/environment';

// Generate nonce for inline styles
export function generateNonce(): string {
	return Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64');
}

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
 * Content Security Policy configuration
 * Implements strict CSP to prevent XSS and other injection attacks
 */
export const cspDirectives: CSPDirectives = {
	'default-src': ["'self'"],
	'script-src': [
		"'self'",
		...(dev ? ["'unsafe-eval'"] : []),
		// Remove unsafe-inline in production, use nonces instead
		// Add trusted CDNs if needed
		// 'https://cdn.jsdelivr.net'
	],
	'style-src': [
		"'self'",
		...(dev ? ["'unsafe-inline'"] : []), // Only allow in development
		// In production, use nonces: "'nonce-{NONCE}'"
		// Add trusted CSS CDNs if needed
		'https://fonts.googleapis.com'
	],
	'img-src': [
		"'self'",
		'data:', // For base64 images
		'https:', // Allow HTTPS images
		'blob:', // For generated images
	],
	'font-src': [
		"'self'",
		'https://fonts.gstatic.com',
		'data:'
	],
	'connect-src': [
		"'self'",
		// Add your API endpoints here when backend is integrated
		...(dev ? ['ws://localhost:*', 'ws://127.0.0.1:*'] : []), // WebSocket for HMR in dev
	],
	'media-src': ["'self'", 'blob:', 'data:'],
	'object-src': ["'none'"],
	'base-uri': ["'self'"],
	'form-action': ["'self'"],
	'frame-ancestors': ["'none'"],
	'frame-src': ["'none'"],
	'worker-src': ["'self'"],
	'manifest-src': ["'self'"],
	'upgrade-insecure-requests': !dev ? [] : undefined,
	'block-all-mixed-content': !dev ? [] : undefined,
};

/**
 * Security headers configuration
 */
export const securityHeaders = {
	// Prevent clickjacking
	'X-Frame-Options': 'DENY',
	
	// Prevent MIME type sniffing
	'X-Content-Type-Options': 'nosniff',
	
	// XSS Protection (legacy but still useful)
	'X-XSS-Protection': '1; mode=block',
	
	// Referrer Policy
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	
	// Permissions Policy (formerly Feature Policy)
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
		'clipboard-read=()'
	].join(', '),
	
	// HTTPS Strict Transport Security (only for production)
	...(dev ? {} : {
		'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
	}),
	
	// Cross-Origin policies
	'Cross-Origin-Embedder-Policy': 'require-corp',
	'Cross-Origin-Opener-Policy': 'same-origin',
	'Cross-Origin-Resource-Policy': 'same-origin',
};

/**
 * Generate CSP header string with nonce support
 */
export function generateCSPHeader(directives: CSPDirectives = cspDirectives, nonce?: string): string {
	const updatedDirectives = { ...directives };
	
	// Add nonce to style-src in production
	if (!dev && nonce) {
		updatedDirectives['style-src'] = [
			"'self'",
			`'nonce-${nonce}'`,
			'https://fonts.googleapis.com'
		];
	}
	
	return Object.entries(updatedDirectives)
		.filter(([_, value]) => value !== undefined && Array.isArray(value))
		.map(([key, values]) => `${key} ${(values as string[]).join(' ')}`)
		.join('; ');
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(headers = new Headers(), nonce?: string): Headers {
	// Apply CSP
	headers.set('Content-Security-Policy', generateCSPHeader(cspDirectives, nonce));
	
	// Apply other security headers
	Object.entries(securityHeaders).forEach(([key, value]) => {
		headers.set(key, value);
	});
	
	// Add additional security headers for enhanced protection
	if (!dev) {
		// Expect-CT header for certificate transparency
		headers.set('Expect-CT', 'max-age=86400, enforce');
		
		// Report-To header for security reporting
		headers.set('Report-To', JSON.stringify({
			"group": "default",
			"max_age": 31536000,
			"endpoints": [{"url": "/security-reports"}]
		}));
		
		// CSP reporting
		headers.set('Content-Security-Policy-Report-Only', 
			generateCSPHeader(cspDirectives, nonce) + "; report-uri /csp-reports; report-to default");
	}
	
	return headers;
}

/**
 * Validate CSP configuration
 */
export function validateCSP(): { isValid: boolean; warnings: string[] } {
	const warnings: string[] = [];
	
	// Check for unsafe directives
	Object.entries(cspDirectives).forEach(([directive, values]) => {
		if (Array.isArray(values)) {
			const stringValues = values as string[];
			if (stringValues.includes("'unsafe-inline'")) {
				warnings.push(`${directive} contains 'unsafe-inline' which reduces security`);
			}
			if (stringValues.includes("'unsafe-eval'")) {
				warnings.push(`${directive} contains 'unsafe-eval' which reduces security`);
			}
			if (stringValues.includes('*')) {
				warnings.push(`${directive} contains wildcard '*' which reduces security`);
			}
		}
	});
	
	return {
		isValid: warnings.length === 0,
		warnings
	};
}
