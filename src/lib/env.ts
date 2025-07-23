/**
 * Environment Variable Access
 * Simplified SSR-safe environment variable access
 * No validation to avoid SSR issues
 */

/**
 * Check if we're in development mode (SSR-safe)
 */
function isDev(): boolean {
	// Use import.meta.env.MODE instead of $app/environment to avoid SSR issues
	return import.meta.env.MODE === 'development' || import.meta.env.DEV === true;
}

/**
 * Environment configuration type
 */
export interface Environment {
	VITE_API_BASE: string;
	VITE_API_TIMEOUT: string;
	VITE_ENABLE_MOCK_DATA: boolean;
	VITE_ENABLE_DEBUG_MODE: boolean;
	VITE_RATE_LIMIT_MAX: string;
	VITE_RATE_LIMIT_WINDOW: string;
	VITE_ENABLE_ANALYTICS: boolean;
	VITE_WS_BASE?: string;
	VITE_ALLOWED_ORIGINS?: string;
}

/**
 * Get environment variables (SSR-safe)
 * @returns Environment configuration with defaults
 */
function getEnvironment(): Environment {
	// Direct access to avoid validation issues during SSR
	return {
		VITE_API_BASE: import.meta.env.VITE_API_BASE || 'http://localhost:8000/api',
		VITE_API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT || '30000',
		VITE_ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
		VITE_ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
		VITE_RATE_LIMIT_MAX: import.meta.env.VITE_RATE_LIMIT_MAX || '100',
		VITE_RATE_LIMIT_WINDOW: import.meta.env.VITE_RATE_LIMIT_WINDOW || '60000',
		VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
		VITE_WS_BASE: import.meta.env.VITE_WS_BASE,
		VITE_ALLOWED_ORIGINS: import.meta.env.VITE_ALLOWED_ORIGINS,
	};
}

/**
 * Cached environment configuration
 */
let _env: Environment | null = null;

function getEnv(): Environment {
	if (!_env) {
		_env = getEnvironment();
	}
	return _env;
}

/**
 * Force environment reload (useful for testing)
 */
export function forceEnvValidation(): Environment {
	_env = getEnvironment();
	return _env;
}

/**
 * Helper function to get typed environment values
 * @param key Environment variable key
 * @returns Environment variable value
 */
export function getEnvVar<K extends keyof Environment>(key: K): Environment[K] {
	return getEnv()[key];
}

/**
 * Check if we're in development mode  
 */
export function isDevelopment(): boolean {
	return isDev();
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
	return import.meta.env.PROD === true;
}

/**
 * Check if we're in test mode
 */
export function isTest(): boolean {
	return import.meta.env.MODE === 'test';
}

/**
 * Get the application port as a number
 */
export function getAppPort(): number {
	return 5173; // Default Vite dev server port
}

/**
 * Get rate limiting configuration
 */
export function getRateLimitConfig() {
	const env = getEnv();
	return {
		maxRequests: parseInt(env.VITE_RATE_LIMIT_MAX, 10),
		windowMs: parseInt(env.VITE_RATE_LIMIT_WINDOW, 10),
	};
}

/**
 * Get API configuration
 */
export function getApiConfig() {
	const env = getEnv();
	return {
		baseUrl: env.VITE_API_BASE,
		timeout: parseInt(env.VITE_API_TIMEOUT, 10),
	};
}

/**
 * Get allowed origins for CORS
 */
export function getAllowedOrigins(): string[] {
	const env = getEnv();
	return env.VITE_ALLOWED_ORIGINS 
		? env.VITE_ALLOWED_ORIGINS.split(',').map((origin: string) => origin.trim())
		: [];
}

/**
 * Check if mock data is enabled
 */
export function isMockDataEnabled(): boolean {
	const env = getEnv();
	return env.VITE_ENABLE_MOCK_DATA === true;
}

/**
 * Check if debug mode is enabled
 */
export function isDebugModeEnabled(): boolean {
	const env = getEnv();
	return env.VITE_ENABLE_DEBUG_MODE === true;
}

/**
 * Check if analytics is enabled
 */
export function isAnalyticsEnabled(): boolean {
	const env = getEnv();
	return env.VITE_ENABLE_ANALYTICS === true;
}
