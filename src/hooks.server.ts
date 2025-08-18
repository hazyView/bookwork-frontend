import type { Handle } from '@sveltejs/kit';
import { applySecurityHeaders, validateSvelteKitCSP, validateCSPForAPI } from '$lib/security';
import { createRateLimitMiddleware } from '$lib/rateLimit';
import { generateSecurityHeaders, configureCORS } from '$lib/httpHeaders';
import { detectMixedContent, fixMixedContent } from '$lib/httpsEnforcement';
import { createSessionMiddleware } from '$lib/sessionManager';
import type { SessionData } from '$lib/sessionManager';
import { getApiConfig } from '$lib/env';
import { dev } from '$app/environment';
import { ApplicationMetrics } from '$lib/metrics';

// Create rate limiting middleware
const rateLimitMiddleware = createRateLimitMiddleware();

/**
 * Global SvelteKit hook that applies security middleware to all requests
 * Implements comprehensive security headers, rate limiting, HTTPS enforcement, and session management
 */
export const handle: Handle = async ({ event, resolve }) => {
	const start = Date.now(); // Track request start time
	const url = new URL(event.request.url);
	const path = url.pathname;
	const method = event.request.method;

	// Skip metrics collection for the metrics endpoint itself to avoid recursion
	const skipMetrics = path === '/metrics';

	// Create session middleware instance for this request
	const sessionMiddleware = createSessionMiddleware();

	// Apply rate limiting to all requests
	const rateLimitResponse = await rateLimitMiddleware(event, async () => {
		// Validate session for this request
		const sessionData = await sessionMiddleware.validateRequest(event.request);
		if (sessionData) {
			// Make session data available to the app
			event.locals.session = sessionData;
		}
		
		// Get URL information for routing decisions
		const url = new URL(event.request.url);
		const path = url.pathname;
		
		// HTTPS enforcement in production (skip for metrics endpoint and localhost)
		if (!dev && url.protocol !== 'https:' && path !== '/metrics' && !url.hostname.includes('localhost')) {
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
				// Check and fix mixed content in production
				if (!dev) {
					const mixedContent = detectMixedContent(html);
					if (mixedContent.hasIssues) {
						return fixMixedContent(html);
					}
				}
				
				// In development, add security meta tags
				if (dev) {
					return html.replace(
						'%sveltekit.head%',
						`%sveltekit.head%
					<meta http-equiv="X-Content-Type-Options" content="nosniff">
					<meta http-equiv="X-Frame-Options" content="DENY">
					<meta http-equiv="X-XSS-Protection" content="1; mode=block">
					<meta name="referrer" content="strict-origin-when-cross-origin">`
					);
				}
				
				return html;
			}
		});
		
		// Determine page context for appropriate headers
		let pageType: 'admin' | 'api' | 'auth' | 'public' | 'static' = 'public';
		if (path.startsWith('/admin')) pageType = 'admin';
		else if (path.startsWith('/api')) pageType = 'api';
		else if (path.includes('login') || path.includes('register') || path.includes('auth')) pageType = 'auth';
		else if (path.startsWith('/_app/') || path.includes('.js') || path.includes('.css')) pageType = 'static';
		
		// Apply base security headers (includes CSP with 'unsafe-inline' for SvelteKit compatibility)
		applySecurityHeaders(response.headers);
		
		// Apply additional security headers based on context (excluding CSP to prevent conflicts)
		const additionalHeaders = generateSecurityHeaders({
			path,
			pageType,
			isLogout: path.includes('logout')
		});
		
		// Apply additional headers but skip CSP to avoid overriding the correct one
		additionalHeaders.forEach((value, key) => {
			// Skip Content-Security-Policy to prevent conflict with the one set by applySecurityHeaders
			if (key.toLowerCase() !== 'content-security-policy') {
				response.headers.set(key, value);
			}
		});
		
		// Validate CSP in development for debugging
		if (dev) {
			const cspValidation = validateSvelteKitCSP(response.headers);
			if (!cspValidation.isValid) {
				console.warn('[CSP VALIDATION] Issues detected:', cspValidation.issues);
				console.warn('[CSP VALIDATION] Has unsafe-inline:', cspValidation.hasUnsafeInline);
				console.warn('[CSP VALIDATION] Has nonces:', cspValidation.hasNonces);
			} else {
				console.log('[CSP VALIDATION] ✅ CSP is correctly configured for SvelteKit');
			}

			// Validate CSP allows API communication
			const apiConfig = getApiConfig();
			const wsBaseUrl = process.env.VITE_WS_BASE || 'ws://localhost:8000/ws';
			const currentCSP = response.headers.get('content-security-policy') || '';
			const cspAllowsAPI = validateCSPForAPI(currentCSP, apiConfig.baseUrl, wsBaseUrl);
			if (!cspAllowsAPI) {
				console.error('[CSP VALIDATION] ❌ CSP blocks API communication!');
				console.error('[CSP VALIDATION] API Base:', apiConfig.baseUrl);
				console.error('[CSP VALIDATION] WS Base:', wsBaseUrl);
				console.error('[CSP VALIDATION] Current CSP:', currentCSP);
			} else {
				console.log('[CSP VALIDATION] ✅ CSP allows API communication');
			}
		}
		
		// Apply HTTPS security headers in production
		if (!dev) {
			response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
			response.headers.set('Upgrade-Insecure-Requests', '1');
		}
		
		// Configure CORS for API endpoints
		if (path.startsWith('/api')) {
			return configureCORS(event.request, response);
		}

		// Record metrics for this request (skip for metrics endpoint to avoid recursion)
		if (!skipMetrics) {
			const duration = Date.now() - start;
			ApplicationMetrics.recordHttpRequest(method, path, response.status, duration);
			
			// Record page loads for HTML responses
			if (response.headers.get('content-type')?.includes('text/html')) {
				ApplicationMetrics.recordPageLoad(path);
			}
		}

		return response;
	});
	
	return rateLimitResponse;
};
