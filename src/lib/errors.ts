// Error handling utilities to prevent information disclosure
import { dev } from '$app/environment';
import { v4 as uuidv4 } from 'uuid';

export interface AppError {
	id: string;
	message: string;
	type: 'validation' | 'authentication' | 'authorization' | 'not_found' | 'server' | 'rate_limit' | 'network';
	statusCode: number;
	timestamp: Date;
	userAgent?: string;
	ip?: string;
	url?: string;
	stack?: string;
	originalError?: unknown;
}

// Error logging (in production, send to external service)
const errorLog: AppError[] = [];

/**
 * Generic error messages for production to prevent information disclosure
 */
const PRODUCTION_ERROR_MESSAGES = {
	validation: 'The submitted information is invalid. Please check your input and try again.',
	authentication: 'Authentication failed. Please check your credentials and try again.',
	authorization: 'You do not have permission to access this resource.',
	not_found: 'The requested resource could not be found.',
	server: 'An unexpected error occurred. Please try again later.',
	rate_limit: 'Too many requests. Please wait before trying again.',
	network: 'A network error occurred. Please check your connection and try again.'
} as const;

/**
 * Create a standardized error object
 */
export function createAppError(
	type: AppError['type'],
	message: string,
	statusCode: number,
	originalError?: unknown,
	context?: { userAgent?: string; ip?: string; url?: string }
): AppError {
	const errorId = uuidv4();
	const error: AppError = {
		id: errorId,
		message: dev ? message : PRODUCTION_ERROR_MESSAGES[type],
		type,
		statusCode,
		timestamp: new Date(),
		...context
	};
	
	// Include stack trace and original error only in development
	if (dev && originalError instanceof Error) {
		error.stack = originalError.stack;
		error.originalError = originalError;
	}
	
	// Log the error
	logError(error);
	
	return error;
}

/**
 * Log error for monitoring and debugging
 */
function logError(error: AppError): void {
	// In development, log to console
	if (dev) {
		console.error(`[ERROR ${error.id}] ${error.type}:`, {
			message: error.message,
			statusCode: error.statusCode,
			timestamp: error.timestamp,
			stack: error.stack,
			originalError: error.originalError
		});
	}
	
	// Store in memory (in production, send to logging service)
	errorLog.push(error);
	
	// Keep only last 1000 errors in memory
	if (errorLog.length > 1000) {
		errorLog.shift();
	}
	
	// In production, you would send this to a logging service like:
	// - Sentry
	// - LogRocket
	// - DataDog
	// - Custom logging endpoint
	if (!dev) {
		// Example: sendToLoggingService(error);
		// In production, send to logging service instead of console
		// console.error(`[ERROR ${error.id}] ${error.type} - ${error.statusCode}`);
	}
}

/**
 * Validation error builder
 */
export function createValidationError(
	message: string,
	field?: string,
	context?: { userAgent?: string; ip?: string; url?: string }
): AppError {
	const fullMessage = field ? `Validation failed for field "${field}": ${message}` : message;
	return createAppError('validation', fullMessage, 400, undefined, context);
}

/**
 * Authentication error builder
 */
export function createAuthenticationError(
	message: string = 'Invalid credentials',
	context?: { userAgent?: string; ip?: string; url?: string }
): AppError {
	return createAppError('authentication', message, 401, undefined, context);
}

/**
 * Authorization error builder
 */
export function createAuthorizationError(
	message: string = 'Insufficient permissions',
	context?: { userAgent?: string; ip?: string; url?: string }
): AppError {
	return createAppError('authorization', message, 403, undefined, context);
}

/**
 * Not found error builder
 */
export function createNotFoundError(
	resource: string = 'resource',
	context?: { userAgent?: string; ip?: string; url?: string }
): AppError {
	return createAppError('not_found', `The ${resource} was not found`, 404, undefined, context);
}

/**
 * Server error builder
 */
export function createServerError(
	message: string,
	originalError?: unknown,
	context?: { userAgent?: string; ip?: string; url?: string }
): AppError {
	return createAppError('server', message, 500, originalError, context);
}

/**
 * Rate limit error builder
 */
export function createRateLimitError(
	retryAfter: number,
	context?: { userAgent?: string; ip?: string; url?: string }
): AppError {
	return createAppError(
		'rate_limit',
		`Rate limit exceeded. Try again in ${retryAfter} seconds`,
		429,
		undefined,
		context
	);
}

/**
 * Network error builder
 */
export function createNetworkError(
	message: string = 'Network request failed',
	context?: { userAgent?: string; ip?: string; url?: string }
): AppError {
	return createAppError('network', message, 503, undefined, context);
}

/**
 * Convert any error to AppError
 */
export function normalizeError(
	error: unknown,
	context?: { userAgent?: string; ip?: string; url?: string }
): AppError {
	if (error && typeof error === 'object' && 'id' in error && 'type' in error) {
		return error as AppError;
	}
	
	if (error instanceof Error) {
		// Check for specific error types
		if (error.name === 'ValidationError') {
			return createValidationError(error.message, undefined, context);
		}
		
		if (error.message.toLowerCase().includes('unauthorized') || 
			error.message.toLowerCase().includes('authentication')) {
			return createAuthenticationError(error.message, context);
		}
		
		if (error.message.toLowerCase().includes('forbidden') || 
			error.message.toLowerCase().includes('permission')) {
			return createAuthorizationError(error.message, context);
		}
		
		if (error.message.toLowerCase().includes('not found')) {
			return createNotFoundError('resource', context);
		}
		
		return createServerError(error.message, error, context);
	}
	
	// Handle non-Error objects
	const message = typeof error === 'string' ? error : 'An unknown error occurred';
	return createServerError(message, error, context);
}

/**
 * Error response helper for API routes
 */
export function createErrorResponse(error: AppError): Response {
	const body = {
		error: {
			id: error.id,
			message: error.message,
			type: error.type,
			timestamp: error.timestamp.toISOString(),
			...(dev && error.stack ? { stack: error.stack } : {})
		}
	};
	
	return new Response(JSON.stringify(body), {
		status: error.statusCode,
		headers: {
			'Content-Type': 'application/json',
			'X-Error-ID': error.id
		}
	});
}

/**
 * Global error handler for unhandled errors
 */
export function setupGlobalErrorHandling(): void {
	// Handle unhandled promise rejections
	if (typeof process !== 'undefined') {
		process.on('unhandledRejection', (reason, promise) => {
			const error = createServerError(
				'Unhandled promise rejection',
				reason
			);
			if (dev) {
				console.error('Unhandled Promise Rejection:', error);
			}
		});
		
		process.on('uncaughtException', (error) => {
			const appError = createServerError(
				'Uncaught exception',
				error
			);
			if (dev) {
				console.error('Uncaught Exception:', appError);
			}
			// In production, you might want to exit gracefully
			if (!dev) {
				process.exit(1);
			}
		});
	}
}

/**
 * Get error statistics (for admin/monitoring)
 */
export function getErrorStatistics(): {
	total: number;
	byType: Record<AppError['type'], number>;
	recent: AppError[];
} {
	const byType: Record<AppError['type'], number> = {
		validation: 0,
		authentication: 0,
		authorization: 0,
		not_found: 0,
		server: 0,
		rate_limit: 0,
		network: 0
	};
	
	errorLog.forEach(error => {
		byType[error.type]++;
	});
	
	// Get recent errors (last 10)
	const recent = errorLog.slice(-10);
	
	return {
		total: errorLog.length,
		byType,
		recent
	};
}

/**
 * Clear error log (for testing/admin use)
 */
export function clearErrorLog(): void {
	errorLog.length = 0;
}

/**
 * Sanitize error for client response
 * Removes sensitive information that shouldn't be exposed to clients
 */
export function sanitizeErrorForClient(error: AppError): Partial<AppError> {
	return {
		id: error.id,
		message: error.message,
		type: error.type,
		timestamp: error.timestamp
	};
}

// Initialize global error handling
setupGlobalErrorHandling();
