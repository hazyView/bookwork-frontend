// HTTPS enforcement and secure transport utilities
import { dev } from '$app/environment';

/**
 * HTTPS enforcement configuration
 */
export interface HTTPSConfig {
	enforceHTTPS: boolean;
	hstsEnabled: boolean;
	hstsMaxAge: number;
	hstsIncludeSubDomains: boolean;
	hstsPreload: boolean;
	upgradeInsecureRequests: boolean;
	mixedContentBlocking: boolean;
	redirectToHTTPS: boolean;
}

// Default HTTPS configuration
const defaultConfig: HTTPSConfig = {
	enforceHTTPS: !dev, // Enforce HTTPS in production
	hstsEnabled: !dev,
	hstsMaxAge: 31536000, // 1 year
	hstsIncludeSubDomains: true,
	hstsPreload: true,
	upgradeInsecureRequests: true,
	mixedContentBlocking: true,
	redirectToHTTPS: !dev
};

/**
 * Check if request is using HTTPS
 */
export function isHTTPS(request: Request): boolean {
	const url = new URL(request.url);
	
	// Check direct HTTPS
	if (url.protocol === 'https:') {
		return true;
	}
	
	// Check forwarded protocol from reverse proxy
	const forwardedProto = request.headers.get('x-forwarded-proto');
	if (forwardedProto === 'https') {
		return true;
	}
	
	// Check CloudFlare headers
	const cfVisitor = request.headers.get('cf-visitor');
	if (cfVisitor && cfVisitor.includes('https')) {
		return true;
	}
	
	return false;
}

/**
 * Generate HTTPS redirect response
 */
export function createHTTPSRedirect(request: Request): Response {
	const url = new URL(request.url);
	url.protocol = 'https:';
	
	// Use 301 (permanent) redirect for SEO benefits
	return new Response(null, {
		status: 301,
		headers: {
			'Location': url.toString(),
			'Strict-Transport-Security': generateHSTSHeader()
		}
	});
}

/**
 * Generate HSTS header
 */
export function generateHSTSHeader(config: Partial<HTTPSConfig> = {}): string {
	const fullConfig = { ...defaultConfig, ...config };
	
	if (!fullConfig.hstsEnabled) {
		return '';
	}
	
	const directives = [`max-age=${fullConfig.hstsMaxAge}`];
	
	if (fullConfig.hstsIncludeSubDomains) {
		directives.push('includeSubDomains');
	}
	
	if (fullConfig.hstsPreload) {
		directives.push('preload');
	}
	
	return directives.join('; ');
}

/**
 * Apply HTTPS security headers
 */
export function applyHTTPSHeaders(headers: Headers, config: Partial<HTTPSConfig> = {}): void {
	const fullConfig = { ...defaultConfig, ...config };
	
	// HSTS header
	if (fullConfig.hstsEnabled) {
		const hstsHeader = generateHSTSHeader(fullConfig);
		if (hstsHeader) {
			headers.set('Strict-Transport-Security', hstsHeader);
		}
	}
	
	// Upgrade insecure requests
	if (fullConfig.upgradeInsecureRequests) {
		// This is handled in CSP, but we can add additional headers
		headers.set('Content-Security-Policy-Report-Only', 
			'upgrade-insecure-requests; report-uri /csp-violation');
	}
}

/**
 * HTTPS enforcement middleware
 */
export function createHTTPSEnforcementMiddleware(config: Partial<HTTPSConfig> = {}) {
	const fullConfig = { ...defaultConfig, ...config };
	
	return async (request: Request, response: Response): Promise<Response> => {
		// Skip enforcement in development
		if (dev || !fullConfig.enforceHTTPS) {
			return response;
		}
		
		// Check if request is already HTTPS
		if (isHTTPS(request)) {
			// Apply HTTPS security headers
			applyHTTPSHeaders(response.headers, fullConfig);
			return response;
		}
		
		// Redirect to HTTPS if configured
		if (fullConfig.redirectToHTTPS) {
			return createHTTPSRedirect(request);
		}
		
		// Otherwise, reject insecure requests
		return new Response('HTTPS Required', {
			status: 426, // Upgrade Required
			headers: {
				'Upgrade': 'TLS/1.2, HTTP/1.1',
				'Connection': 'Upgrade',
				'Content-Type': 'text/plain'
			}
		});
	};
}

/**
 * Check for mixed content issues
 */
export function detectMixedContent(html: string): {
	hasIssues: boolean;
	issues: Array<{
		type: 'image' | 'script' | 'link' | 'iframe' | 'form';
		url: string;
		line?: number;
	}>;
} {
	const issues: Array<{
		type: 'image' | 'script' | 'link' | 'iframe' | 'form';
		url: string;
		line?: number;
	}> = [];
	
	// Patterns to detect insecure resources
	const patterns = [
		{ type: 'image' as const, regex: /<img[^>]+src=["']http:\/\/[^"']*["']/gi },
		{ type: 'script' as const, regex: /<script[^>]+src=["']http:\/\/[^"']*["']/gi },
		{ type: 'link' as const, regex: /<link[^>]+href=["']http:\/\/[^"']*["']/gi },
		{ type: 'iframe' as const, regex: /<iframe[^>]+src=["']http:\/\/[^"']*["']/gi },
		{ type: 'form' as const, regex: /<form[^>]+action=["']http:\/\/[^"']*["']/gi }
	];
	
	// Check each pattern
	patterns.forEach(({ type, regex }) => {
		let match;
		while ((match = regex.exec(html)) !== null) {
			const urlMatch = match[0].match(/http:\/\/[^"']*/);
			if (urlMatch) {
				issues.push({
					type,
					url: urlMatch[0]
				});
			}
		}
	});
	
	return {
		hasIssues: issues.length > 0,
		issues
	};
}

/**
 * Fix mixed content by upgrading HTTP URLs to HTTPS
 */
export function fixMixedContent(html: string): string {
	// Upgrade HTTP URLs to HTTPS for common patterns
	return html
		.replace(/src=["']http:\/\//g, 'src="https://')
		.replace(/href=["']http:\/\//g, 'href="https://')
		.replace(/action=["']http:\/\//g, 'action="https://')
		.replace(/url\(http:\/\//g, 'url(https://');
}

/**
 * Validate HTTPS configuration
 */
export function validateHTTPSConfig(config: HTTPSConfig): {
	isValid: boolean;
	warnings: string[];
	errors: string[];
} {
	const warnings: string[] = [];
	const errors: string[] = [];
	
	// Check HSTS configuration
	if (config.hstsEnabled) {
		if (config.hstsMaxAge < 300) { // 5 minutes minimum
			warnings.push('HSTS max-age should be at least 300 seconds (5 minutes)');
		}
		
		if (config.hstsMaxAge < 31536000) { // 1 year recommended
			warnings.push('HSTS max-age should be at least 31536000 seconds (1 year) for security');
		}
		
		if (!config.hstsIncludeSubDomains) {
			warnings.push('Consider enabling includeSubDomains for comprehensive HSTS coverage');
		}
	}
	
	// Check production settings
	if (!dev) {
		if (!config.enforceHTTPS) {
			errors.push('HTTPS enforcement should be enabled in production');
		}
		
		if (!config.hstsEnabled) {
			errors.push('HSTS should be enabled in production');
		}
		
		if (!config.upgradeInsecureRequests) {
			warnings.push('Upgrade insecure requests should be enabled in production');
		}
	}
	
	return {
		isValid: errors.length === 0,
		warnings,
		errors
	};
}

/**
 * Certificate validation utilities
 */
export interface CertificateInfo {
	valid: boolean;
	issuer?: string;
	subject?: string;
	validFrom?: Date;
	validTo?: Date;
	fingerprint?: string;
	san?: string[];
	errors: string[];
}

/**
 * Basic certificate check (client-side)
 */
export async function checkCertificate(hostname: string): Promise<CertificateInfo> {
	try {
		// This is a basic check - in a real implementation, you'd use proper certificate APIs
		const response = await fetch(`https://${hostname}`, { 
			method: 'HEAD',
			mode: 'no-cors' // Avoid CORS issues
		});
		
		// Basic validation - certificate is valid if HTTPS request succeeds
		return {
			valid: true,
			errors: []
		};
	} catch (error) {
		return {
			valid: false,
			errors: [`Certificate validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
		};
	}
}

/**
 * Security transport test
 */
export async function testSecureTransport(url: string): Promise<{
	https: boolean;
	hsts: boolean;
	certificate: boolean;
	redirectsToHTTPS: boolean;
	errors: string[];
}> {
	const results = {
		https: false,
		hsts: false,
		certificate: false,
		redirectsToHTTPS: false,
		errors: [] as string[]
	};
	
	try {
		// Test HTTPS availability
		const httpsResponse = await fetch(url.replace('http:', 'https:'), { 
			method: 'HEAD',
			mode: 'no-cors'
		});
		results.https = true;
		
		// Check HSTS header
		const hstsHeader = httpsResponse.headers.get('strict-transport-security');
		results.hsts = !!hstsHeader;
		
		// Test HTTP redirect to HTTPS
		if (url.startsWith('http:')) {
			try {
				const httpResponse = await fetch(url, { 
					method: 'HEAD',
					redirect: 'manual'
				});
				
				const location = httpResponse.headers.get('location');
				results.redirectsToHTTPS = !!(location && location.startsWith('https:'));
			} catch (error) {
				results.errors.push(`HTTP redirect test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}
		
	} catch (error) {
		results.errors.push(`HTTPS test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
	
	return results;
}
