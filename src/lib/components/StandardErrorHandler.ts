/**
 * Standardized error handling utilities for consistent error management across the application
 * Provides unified patterns for API error handling, user feedback, and retry logic
 */

import { handleApiError } from '$lib/errorHandling';
import { toasts } from '$lib/toast';
import { TIME_CONSTANTS, UI_CONSTANTS } from '$lib/constants';

/**
 * Standard error handler that provides consistent error processing
 * Safely extracts error messages with proper fallbacks
 */
export function extractErrorMessage(error: unknown, fallbackMessage: string = 'An unexpected error occurred'): string {
	if (!error) return fallbackMessage;

	if (error instanceof Error) {
		if (typeof error.message === 'string' && error.message.trim() !== '') {
			return error.message;
		}
		return fallbackMessage;
	}

	if (typeof error === 'string') {
		if (error.trim() !== '') {
			return error;
		}
		return fallbackMessage;
	}

	if (typeof error === 'object' && error !== null && 'message' in error) {
		const message = (error as { message: unknown }).message;
		if (typeof message === 'string' && message.trim() !== '') {
			return message;
		}
	}

	return fallbackMessage;
}

/**
 * Standard async operation error handler
 * Handles common patterns for loading states and error display
 */
export interface AsyncErrorHandlerOptions {
	/** Function to set loading state */
	setLoading?: (loading: boolean) => void;
	/** Function to set error state */
	setError?: (error: string | null) => void;
	/** Whether to show toast notification */
	showToast?: boolean;
	/** Custom error message for toast */
	toastMessage?: string;
	/** Context description for error logging */
	context?: string;
	/** Whether to log errors in development */
	logInDev?: boolean;
}

/**
 * Execute async operation with standardized error handling
 */
export async function handleAsyncOperation<T>(
	operation: () => Promise<T>,
	options: AsyncErrorHandlerOptions = {}
): Promise<T | null> {
	const {
		setLoading,
		setError,
		showToast = false,
		toastMessage,
		context = 'operation',
		logInDev = true
	} = options;

	try {
		setLoading?.(true);
		setError?.(null);
		
		const result = await operation();
		return result;
		
	} catch (error) {
		const errorMessage = extractErrorMessage(error, `Failed to complete ${context}`);
		
		// Set error state
		setError?.(errorMessage);
		
		// Show toast notification if requested
		if (showToast) {
			if (toastMessage) {
				toasts.add({
					message: toastMessage,
					type: 'error',
					duration: TIME_CONSTANTS.ERROR_TOAST_DURATION
				});
			} else {
				handleApiError(error, errorMessage);
			}
		}
		
		// Development logging
		if (logInDev && typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
			console.error(`[${context}] Error:`, error);
		}
		
		return null;
		
	} finally {
		setLoading?.(false);
	}
}

/**
 * Standard error handler for form validation
 */
export function handleFormError(
	error: unknown, 
	setFormErrors: (errors: Record<string, string>) => void,
	showToast: boolean = true
): void {
	const errorMessage = extractErrorMessage(error, 'Form validation failed');
	
	// If it's a validation error with field-specific messages, handle accordingly
	if (error && typeof error === 'object' && 'validationErrors' in error) {
		const validationErrors = (error as { validationErrors: Record<string, string> }).validationErrors;
		if (validationErrors && typeof validationErrors === 'object') {
			setFormErrors(validationErrors);
			return;
		}
	}
	
	// Show generic error
	if (showToast) {
		handleApiError(error, errorMessage);
	}
	
	// Clear previous form errors
	setFormErrors({});
}

/**
 * Standard error handler for store operations
 */
export function handleStoreError(
	error: unknown,
	storeName: string,
	setError?: (error: string | null) => void,
	showToast: boolean = false
): void {
	let errorMessage = extractErrorMessage(error, `Failed to update ${storeName}`);
	// Prevent setting error to null, undefined, or the string 'null'/'undefined'
	if (
		errorMessage == null ||
		errorMessage === 'null' ||
		errorMessage === 'undefined' ||
		(typeof errorMessage === 'string' && errorMessage.trim() === '')
	) {
		errorMessage = `Failed to update ${storeName}`;
	}
	setError?.(errorMessage);

	if (showToast) {
		handleApiError(error, errorMessage);
	}

	// Development logging
	if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
		console.error(`[Store: ${storeName}] Error:`, errorMessage, error);
	}
}

/**
 * Retry wrapper for operations that might fail temporarily
 */
export async function withRetry<T>(
	operation: () => Promise<T>,
	maxRetries: number = 2,
	delay: number = TIME_CONSTANTS.DEFAULT_RETRY_DELAY,
	context: string = 'operation'
): Promise<T> {
	let lastError: unknown;
	
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			return await operation();
		} catch (error) {
			lastError = error;
			
			if (attempt === maxRetries) {
				break;
			}
			
			// Wait before retry
			await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
		}
	}
	
	// All retries failed
	const errorMessage = extractErrorMessage(lastError, `${context} failed after ${maxRetries + 1} attempts`);
	throw new Error(errorMessage);
}

/**
 * Safe error boundary wrapper for component operations
 */
export function safeOperation<T extends any[], R>(
	fn: (...args: T) => R,
	fallback: R,
	errorHandler?: (error: unknown) => void
): (...args: T) => R {
	return (...args: T): R => {
		try {
			return fn(...args);
		} catch (error) {
			if (errorHandler) {
				errorHandler(error);
			} else if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
				console.error('Safe operation failed:', error);
			}
			return fallback;
		}
	};
}

/**
 * Type guard for common error checking
 */
export function isError(value: unknown): value is Error {
	return value instanceof Error;
}

/**
 * Type guard for checking if something has an error message
 */
export function hasErrorMessage(value: unknown): value is { message: string } {
	return typeof value === 'object' && 
		   value !== null && 
		   'message' in value && 
		   typeof (value as { message: unknown }).message === 'string';
}

/**
 * Standard error context for consistent error reporting
 */
export interface ErrorContext {
	component?: string;
	action?: string;
	user?: string;
	timestamp?: Date;
	additionalInfo?: Record<string, unknown>;
}

/**
 * Create error with context for better debugging
 */
export function createContextualError(
	message: string,
	context: ErrorContext,
	originalError?: unknown
): Error {
	const contextStr = JSON.stringify({
		...context,
		timestamp: context.timestamp || new Date(),
		originalError: originalError instanceof Error ? originalError.message : originalError
	});
	
	const error = new Error(`${message} | Context: ${contextStr}`);
	if (originalError instanceof Error && originalError.stack) {
		error.stack = originalError.stack;
	}
	
	return error;
}
