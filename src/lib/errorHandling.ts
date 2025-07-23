/**
 * Error handling utilities for the frontend application
 */

import { toasts } from './toast';
import { 
    ApiError, 
    NetworkError, 
    AuthenticationError, 
    AuthorizationError, 
    ValidationError, 
    RateLimitError, 
    ServerError, 
    TimeoutError 
} from './api';

/**
 * Handle API errors by showing appropriate toast notifications
 * @param error - The error to handle
 * @param customMessage - Optional custom message to show instead of the default
 */
export function handleApiError(error: unknown, customMessage?: string) {
    if (error instanceof AuthenticationError) {
        toasts.add({
            message: customMessage || 'Your session has expired. Please log in again.',
            type: 'error',
            duration: 5000
        });
        // Optionally redirect to login
        // window.location.href = '/login';
        return;
    }

    if (error instanceof AuthorizationError) {
        toasts.add({
            message: customMessage || 'You do not have permission to perform this action.',
            type: 'error',
            duration: 4000
        });
        return;
    }

    if (error instanceof ValidationError) {
        toasts.add({
            message: customMessage || 'Please check your input and try again.',
            type: 'error',
            duration: 4000
        });
        return;
    }

    if (error instanceof RateLimitError) {
        toasts.add({
            message: customMessage || 'Too many requests. Please wait a moment and try again.',
            type: 'warning',
            duration: 5000
        });
        return;
    }

    if (error instanceof NetworkError) {
        toasts.add({
            message: customMessage || 'Unable to connect to the server. Please check your internet connection.',
            type: 'error',
            duration: 5000
        });
        return;
    }

    if (error instanceof TimeoutError) {
        toasts.add({
            message: customMessage || 'The request timed out. Please try again.',
            type: 'error',
            duration: 4000
        });
        return;
    }

    if (error instanceof ServerError) {
        toasts.add({
            message: customMessage || 'A server error occurred. Our team has been notified.',
            type: 'error',
            duration: 4000
        });
        return;
    }

    if (error instanceof ApiError) {
        toasts.add({
            message: customMessage || error.userMessage,
            type: 'error',
            duration: 4000
        });
        return;
    }

    // Handle unknown errors
    toasts.add({
        message: customMessage || 'An unexpected error occurred. Please try again.',
        type: 'error',
        duration: 4000
    });
}

/**
 * Check if an error is a specific type
 */
export function isAuthenticationError(error: unknown): error is AuthenticationError {
    return error instanceof AuthenticationError;
}

export function isAuthorizationError(error: unknown): error is AuthorizationError {
    return error instanceof AuthorizationError;
}

export function isValidationError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
}

export function isNetworkError(error: unknown): error is NetworkError {
    return error instanceof NetworkError;
}

export function isRateLimitError(error: unknown): error is RateLimitError {
    return error instanceof RateLimitError;
}

export function isServerError(error: unknown): error is ServerError {
    return error instanceof ServerError;
}

export function isTimeoutError(error: unknown): error is TimeoutError {
    return error instanceof TimeoutError;
}

/**
 * Get user-friendly message from any error
 */
export function getUserErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        return error.userMessage;
    }
    
    if (error instanceof Error) {
        return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
}
