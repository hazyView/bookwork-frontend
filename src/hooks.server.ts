import type { Handle } from '@sveltejs/kit';
import { generateNonce, applySecurityHeaders } from '$lib/security';
import { createRateLimitMiddleware } from '$lib/rateLimit';
import { dev } from '$app/environment';

// Create rate limiting middleware
const rateLimitMiddleware = createRateLimitMiddleware();

export const handle: Handle = async ({ event, resolve }) => {
	// Apply rate limiting to all requests
	const rateLimitResponse = await rateLimitMiddleware(event, async () => {
		// Generate nonce for CSP
		const nonce = generateNonce();
		
		// Make nonce available to the app
		event.locals.nonce = nonce;
		
		// Resolve the response
		const response = await resolve(event, {
			transformPageChunk: ({ html }) => {
				// In production, replace style blocks with nonce
				if (!dev) {
					return html.replace(/<style>/g, `<style nonce="${nonce}">`);
				}
				return html;
			}
		});
		
		// Apply security headers including CSP with nonce
		applySecurityHeaders(response.headers, nonce);
		
		return response;
	});
	
	return rateLimitResponse;
};
