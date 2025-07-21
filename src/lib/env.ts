/**
 * Environment Variable Validation
 * Validates all required environment variables at application startup
 * Uses Zod for runtime validation to ensure fail-fast behavior
 */

import { z } from 'zod';
import { dev } from '$app/environment';

/**
 * Environment variable schema definition
 * All required environment variables for the application
 */
const envSchema = z.object({
	// Application Configuration
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	PORT: z.string().regex(/^\d+$/, 'PORT must be a valid port number').default('3000'),
	
	// API Configuration
	VITE_API_BASE: z.string().url('VITE_API_BASE must be a valid URL').optional(),
	
	// Authentication Configuration (required in production)
	VITE_JWT_SECRET: dev ? z.string().optional() : z.string().min(32, 'JWT secret must be at least 32 characters in production'),
	
	// Security Configuration
	VITE_RATE_LIMIT_MAX: z.string().regex(/^\d+$/, 'Rate limit max must be a number').default('100'),
	VITE_RATE_LIMIT_WINDOW: z.string().regex(/^\d+$/, 'Rate limit window must be a number').default('60000'),
	
	// External Service Configuration (optional)
	VITE_ANALYTICS_ID: z.string().optional(),
	VITE_SENTRY_DSN: z.string().url('Sentry DSN must be a valid URL').optional(),
	
	// Development Configuration (only in dev)
	VITE_DEV_TOOLS: dev ? z.string().optional() : z.undefined(),
	
	// Database Configuration (for future backend integration)
	DATABASE_URL: z.string().url('Database URL must be a valid connection string').optional(),
	
	// Session Configuration
	VITE_SESSION_SECRET: dev ? z.string().optional() : z.string().min(32, 'Session secret must be at least 32 characters in production'),
	
	// CORS Configuration
	VITE_ALLOWED_ORIGINS: z.string().optional(),
});

/**
 * Parsed and validated environment variables
 */
export type Environment = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * @returns Validated environment configuration
 * @throws Error if validation fails
 */
function validateEnvironment(): Environment {
	try {
		// Get all environment variables
		const env = {
			NODE_ENV: process.env.NODE_ENV,
			PORT: process.env.PORT,
			VITE_API_BASE: import.meta.env.VITE_API_BASE,
			VITE_JWT_SECRET: import.meta.env.VITE_JWT_SECRET,
			VITE_RATE_LIMIT_MAX: import.meta.env.VITE_RATE_LIMIT_MAX,
			VITE_RATE_LIMIT_WINDOW: import.meta.env.VITE_RATE_LIMIT_WINDOW,
			VITE_ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
			VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
			VITE_DEV_TOOLS: import.meta.env.VITE_DEV_TOOLS,
			DATABASE_URL: process.env.DATABASE_URL,
			VITE_SESSION_SECRET: import.meta.env.VITE_SESSION_SECRET,
			VITE_ALLOWED_ORIGINS: import.meta.env.VITE_ALLOWED_ORIGINS,
		};

		// Validate against schema
		const validatedEnv = envSchema.parse(env);
		
		// Log successful validation
		console.info(`[ENV] Environment validation successful (${validatedEnv.NODE_ENV} mode)`);
		
		return validatedEnv;
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errorMessages = error.issues.map((err: z.ZodIssue) => 
				`${err.path.join('.')}: ${err.message}`
			).join('\n');
			
			console.error('[ENV] Environment validation failed:');
			console.error(errorMessages);
			
			throw new Error(`Environment validation failed:\n${errorMessages}`);
		}
		
		throw error;
	}
}

/**
 * Validated environment configuration
 * This will throw an error at module load time if validation fails
 */
export const env = validateEnvironment();

/**
 * Helper function to get typed environment values
 * @param key Environment variable key
 * @returns Environment variable value
 */
export function getEnvVar<K extends keyof Environment>(key: K): Environment[K] {
	return env[key];
}

/**
 * Check if we're in development mode
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if we're in production mode
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if we're in test mode
 */
export const isTest = env.NODE_ENV === 'test';

/**
 * Get the application port as a number
 */
export const appPort = parseInt(env.PORT, 10);

/**
 * Get rate limiting configuration
 */
export const rateLimitConfig = {
	maxRequests: parseInt(env.VITE_RATE_LIMIT_MAX, 10),
	windowMs: parseInt(env.VITE_RATE_LIMIT_WINDOW, 10),
};

/**
 * Get allowed origins for CORS
 */
export const allowedOrigins = env.VITE_ALLOWED_ORIGINS 
	? env.VITE_ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
	: [];
