import { applySecurityHeaders } from '$lib/security.js';
import { dev } from '$app/environment';

/**
 * Global security hook - applies to all requests
 * Implements security headers and HTTPS enforcement
 */
export async function handle({ event, resolve }) {
	// HTTPS enforcement in production
	if (!dev && event.url.protocol !== 'https:') {
		return new Response(null, {
			status: 301,
			headers: {
				location: `https://${event.url.host}${event.url.pathname}${event.url.search}`
			}
		});
	}
	
	// Rate limiting check (basic implementation)
	const clientIP = event.getClientAddress();
	if (await isRateLimited(clientIP)) {
		return new Response('Rate limit exceeded', { status: 429 });
	}
	
	// Resolve the request
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			// Add security-related meta tags
			return html.replace(
				'%sveltekit.head%',
				`%sveltekit.head%
				<meta http-equiv="X-Content-Type-Options" content="nosniff">
				<meta http-equiv="X-Frame-Options" content="DENY">
				<meta http-equiv="X-XSS-Protection" content="1; mode=block">
				<meta name="referrer" content="strict-origin-when-cross-origin">`
			);
		}
	});
	
	// Apply security headers
	applySecurityHeaders(response.headers);
	
	return response;
}

/**
 * Basic rate limiting implementation
 * In production, use Redis or similar for distributed rate limiting
 */
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // requests per window

/**
 * @param {string} clientIP
 * @returns {Promise<boolean>}
 */
async function isRateLimited(clientIP) {
	if (dev) return false; // Disable in development
	
	const now = Date.now();
	const clientData = requestCounts.get(clientIP) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
	
	// Reset if window has passed
	if (now > clientData.resetTime) {
		clientData.count = 0;
		clientData.resetTime = now + RATE_LIMIT_WINDOW;
	}
	
	clientData.count++;
	requestCounts.set(clientIP, clientData);
	
	// Clean up old entries periodically
	if (Math.random() < 0.01) { // 1% chance
		cleanupRateLimitData();
	}
	
	return clientData.count > RATE_LIMIT_MAX_REQUESTS;
}

function cleanupRateLimitData() {
	const now = Date.now();
	for (const [ip, data] of requestCounts.entries()) {
		if (now > data.resetTime) {
			requestCounts.delete(ip);
		}
	}
}
