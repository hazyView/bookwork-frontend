// Additional HTTP Security Headers
import { dev } from '$app/environment';

/**
 * Security headers for enhanced protection
 */
export const additionalSecurityHeaders = {
	// Prevent DNS prefetching
	'X-DNS-Prefetch-Control': 'off',
	
	// Download options for IE
	'X-Download-Options': 'noopen',
	
	// Prevent MIME type confusion
	'X-Content-Type-Options': 'nosniff',
	
	// Origin policy for external requests
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	
	// Remove server information
	'Server': 'Unknown',
	'X-Powered-By': '', // Remove this header
	
	// Cache control for sensitive pages
	'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
	'Pragma': 'no-cache',
	'Expires': '0',
	'Surrogate-Control': 'no-store',
	
	// Cross-Origin Resource Sharing (CORS) headers
	'Access-Control-Allow-Origin': dev ? '*' : 'https://bookwork.com', 
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token',
	'Access-Control-Allow-Credentials': 'true',
	'Access-Control-Max-Age': '86400', // 24 hours
	
	// Timing attacks prevention
	'X-Response-Time': '', // Remove timing information
	
	// Cross-Origin policies for advanced security
	'Cross-Origin-Embedder-Policy': 'require-corp',
	'Cross-Origin-Opener-Policy': 'same-origin',
	'Cross-Origin-Resource-Policy': 'same-origin',
	
	// Clear-Site-Data header for logout
	'Clear-Site-Data': '"cache", "cookies", "storage", "executionContexts"', // Use on logout
	
	// Modern Permissions Policy (replaces deprecated Feature-Policy)
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
		'autoplay=()',
		'encrypted-media=()',
		'picture-in-picture=()'
	].join(', ')
};

/**
 * Page-specific security headers
 */
export const pageSpecificHeaders = {
	// Admin pages
	admin: {
		'Cache-Control': 'no-store, no-cache, must-revalidate, private',
		'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
		'Referrer-Policy': 'no-referrer'
	},
	
	// API endpoints
	api: {
		'Cache-Control': 'no-store, no-cache, must-revalidate',
		'Content-Type': 'application/json',
		'X-API-Version': '1.0'
	},
	
	// Login/authentication pages
	auth: {
		'Cache-Control': 'no-store, no-cache, must-revalidate, private',
		'Referrer-Policy': 'no-referrer',
		'X-Frame-Options': 'DENY'
	},
	
	// Public content
	public: {
		'Cache-Control': 'public, max-age=3600', // 1 hour
		'Vary': 'Accept-Encoding'
	},
	
	// Static assets
	static: {
		'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
		'Vary': 'Accept-Encoding'
	}
};

/**
 * Security headers for specific content types
 */
export const contentTypeHeaders = {
	json: {
		'Content-Type': 'application/json; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	},
	
	html: {
		'Content-Type': 'text/html; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	},
	
	css: {
		'Content-Type': 'text/css; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	},
	
	javascript: {
		'Content-Type': 'application/javascript; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	},
	
	image: {
		'X-Content-Type-Options': 'nosniff',
		'Content-Disposition': 'inline'
	}
};

/**
 * Generate security headers based on context
 * 
 * IMPORTANT: This function NEVER sets Content-Security-Policy headers.
 * CSP is exclusively managed by security.ts to prevent conflicts.
 */
export function generateSecurityHeaders(
	context: {
		path?: string;
		contentType?: 'json' | 'html' | 'css' | 'javascript' | 'image';
		pageType?: 'admin' | 'api' | 'auth' | 'public' | 'static';
		isLogout?: boolean;
	} = {}
): Headers {
	const headers = new Headers();
	
	// Apply base security headers (excluding CSP)
	Object.entries(additionalSecurityHeaders).forEach(([key, value]) => {
		// Skip CSP-related headers - these are managed exclusively by security.ts
		if (value && key !== 'Clear-Site-Data' && key.toLowerCase() !== 'content-security-policy') {
			headers.set(key, value);
		}
	});
	
	// Apply content-type specific headers
	if (context.contentType && contentTypeHeaders[context.contentType]) {
		Object.entries(contentTypeHeaders[context.contentType]).forEach(([key, value]) => {
			headers.set(key, value);
		});
	}
	
	// Apply page-type specific headers
	if (context.pageType && pageSpecificHeaders[context.pageType]) {
		Object.entries(pageSpecificHeaders[context.pageType]).forEach(([key, value]) => {
			headers.set(key, value);
		});
	}
	
	// Apply logout-specific headers
	if (context.isLogout) {
		headers.set('Clear-Site-Data', '"cache", "cookies", "storage", "executionContexts"');
	}
	
	// Remove X-Powered-By header
	headers.delete('X-Powered-By');
	
	return headers;
}

/**
 * Middleware to apply security headers based on request
 */
export function createSecurityHeadersMiddleware() {
	return (request: Request, response: Response): Response => {
		const url = new URL(request.url);
		const path = url.pathname;
		
		// Determine page type
		let pageType: 'admin' | 'api' | 'auth' | 'public' | 'static' = 'public';
		
		if (path.startsWith('/admin')) {
			pageType = 'admin';
		} else if (path.startsWith('/api')) {
			pageType = 'api';
		} else if (path.includes('login') || path.includes('register') || path.includes('auth')) {
			pageType = 'auth';
		} else if (path.startsWith('/_app/') || path.includes('.js') || path.includes('.css')) {
			pageType = 'static';
		}
		
		// Determine content type
		let contentType: 'json' | 'html' | 'css' | 'javascript' | 'image' | undefined;
		
		if (response.headers.get('content-type')?.includes('application/json')) {
			contentType = 'json';
		} else if (response.headers.get('content-type')?.includes('text/html')) {
			contentType = 'html';
		} else if (response.headers.get('content-type')?.includes('text/css')) {
			contentType = 'css';
		} else if (response.headers.get('content-type')?.includes('application/javascript')) {
			contentType = 'javascript';
		} else if (response.headers.get('content-type')?.includes('image/')) {
			contentType = 'image';
		}
		
		// Generate and apply security headers
		const securityHeaders = generateSecurityHeaders({
			path,
			contentType,
			pageType,
			isLogout: path.includes('logout')
		});
		
		// Apply security headers to response
		securityHeaders.forEach((value, key) => {
			response.headers.set(key, value);
		});
		
		return response;
	};
}

/**
 * CORS configuration for API endpoints
 */
export function configureCORS(request: Request, response: Response): Response {
	const origin = request.headers.get('origin');
	const allowedOrigins = dev 
		? ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000']
		: ['https://bookwork.com', 'https://www.bookwork.com']; // Update with your domains
	
	// Check if origin is allowed
	if (origin && allowedOrigins.includes(origin)) {
		response.headers.set('Access-Control-Allow-Origin', origin);
	} else if (dev) {
		response.headers.set('Access-Control-Allow-Origin', '*');
	}
	
	// Handle preflight requests
	if (request.method === 'OPTIONS') {
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
		response.headers.set('Access-Control-Max-Age', '86400');
		return new Response(null, { status: 200, headers: response.headers });
	}
	
	return response;
}

/**
 * Security headers validation
 */
export function validateSecurityHeaders(headers: Headers): {
	isSecure: boolean;
	missing: string[];
	recommendations: string[];
} {
	const required = [
		'X-Frame-Options',
		'X-Content-Type-Options', 
		'Referrer-Policy',
		'Content-Security-Policy'
	];
	
	const recommended = [
		'Strict-Transport-Security',
		'X-XSS-Protection',
		'Permissions-Policy',
		'Cross-Origin-Embedder-Policy'
	];
	
	const missing = required.filter(header => !headers.has(header));
	const missingRecommended = recommended.filter(header => !headers.has(header));
	
	return {
		isSecure: missing.length === 0,
		missing,
		recommendations: missingRecommended
	};
}
