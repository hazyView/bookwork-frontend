import type { Handle } from '@sveltejs/kit';
import { generateNonce, applySecurityHeaders } from '$lib/security';
import { createRateLimitMiddleware } from '$lib/rateLimit';
import { generateSecurityHeaders, configureCORS } from '$lib/httpHeaders';
import { detectMixedContent, fixMixedContent } from '$lib/httpsEnforcement';
import { createSessionMiddleware } from '$lib/sessionManager';
import type { SessionData } from '$lib/sessionManager';
import { dev } from '$app/environment';

// Create rate limiting middleware
const rateLimitMiddleware = createRateLimitMiddleware();

/**
 * Global SvelteKit hook that applies security middleware to all requests
 * Implements comprehensive security headers, rate limiting, HTTPS enforcement, and session management
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Create session middleware instance for this request
	const sessionMiddleware = createSessionMiddleware();

	// Apply rate limiting to all requests
	const rateLimitResponse = await rateLimitMiddleware(event, async () => {
		// Generate nonce for CSP
		const nonce = generateNonce();
		
		// Make nonce available to the app
		event.locals.nonce = nonce;
		
		// Validate session for this request
		const sessionData = await sessionMiddleware.validateRequest(event.request);
		if (sessionData) {
			// Make session data available to the app
			event.locals.session = sessionData;
		}
		
		// Get URL information for routing decisions
		const url = new URL(event.request.url);
		const path = url.pathname;
		
		// HTTPS enforcement in production
		if (!dev && url.protocol !== 'https:') {
			return new Response(null, {
				status: 301,
				headers: {
					'Location': url.toString().replace('http:', 'https:'),
					'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
				}
			});
		}
		
		// Resolve the response with security transformations
		const response = await resolve(event, {
			transformPageChunk: ({ html }) => {
				// In production, replace style blocks with nonce and fix mixed content
				if (!dev) {
					let processedHtml = html.replace(/<style>/g, `<style nonce="${nonce}">`);
					
					// Check and fix mixed content
					const mixedContent = detectMixedContent(processedHtml);
					if (mixedContent.hasIssues) {
						processedHtml = fixMixedContent(processedHtml);
					}
					
					return processedHtml;
				}
				
				// In development, add security meta tags
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
		
		// Determine page context for appropriate headers
		let pageType: 'admin' | 'api' | 'auth' | 'public' | 'static' = 'public';
		if (path.startsWith('/admin')) pageType = 'admin';
		else if (path.startsWith('/api')) pageType = 'api';
		else if (path.includes('login') || path.includes('register') || path.includes('auth')) pageType = 'auth';
		else if (path.startsWith('/_app/') || path.includes('.js') || path.includes('.css')) pageType = 'static';
		
		// Apply base security headers with nonce
		applySecurityHeaders(response.headers, nonce);
		
		// Apply additional security headers based on context
		const additionalHeaders = generateSecurityHeaders({
			path,
			pageType,
			isLogout: path.includes('logout')
		});
		
		additionalHeaders.forEach((value, key) => {
			response.headers.set(key, value);
		});
		
		// Apply HTTPS security headers in production
		if (!dev) {
			response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
			response.headers.set('Upgrade-Insecure-Requests', '1');
		}
		
		// Configure CORS for API endpoints
		if (path.startsWith('/api')) {
			return configureCORS(event.request, response);
		}

		return response;
	});
	
	return rateLimitResponse;
};
