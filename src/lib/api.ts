/**
 * API utilities for data fetching with comprehensive runtime validation and error handling
 * Provides a clean abstraction between frontend and backend with robust type safety
 * Uses Zod for runtime validation and implements standardized error handling
 */

import { z } from 'zod';
import { getApiConfig, isDevelopment, isMockDataEnabled } from './env';
import { TIME_CONSTANTS } from './constants';
import CryptoUtils from './crypto.js';

// Import token storage for authorization headers
import { browser } from '$app/environment';

/**
 * Get current authentication token from storage using secure encryption
 */
async function getAuthToken(): Promise<string | null> {
    if (!browser) return null;
    
    try {
        const TOKEN_KEY = '__auth_token';
        const encrypted = sessionStorage.getItem(TOKEN_KEY);
        
        if (!encrypted) return null;
        
        // Use proper AES-GCM decryption for security
        try {
            // Try to parse as JSON (new encrypted format with IV)
            const parsed = JSON.parse(encrypted);
            if (parsed.data && parsed.iv) {
                return await CryptoUtils.decrypt(parsed.data, parsed.iv);
            }
        } catch {
            // Fall back to base64 decoding for legacy tokens
            return atob(encrypted);
        }
        
        return null;
    } catch {
        return null;
    }
}

// Lazy-loaded API configuration
let _apiConfig: ReturnType<typeof getApiConfig> | null = null;
function getConfig() {
    if (!_apiConfig) {
        _apiConfig = getApiConfig();
    }
    return _apiConfig;
}

const getAPIBase = () => getConfig().baseUrl;
const getAPITimeout = () => getConfig().timeout;

/**
 * Enhanced API Error classes for specific error scenarios
 */

// Base API Error class
export class ApiError extends Error {
    public statusCode: number;
    public userMessage: string;
    public context?: Record<string, unknown>;
    public timestamp: Date;
    public code?: string;
    public details?: Record<string, unknown>;

    constructor(response?: Response, body?: any) {
        // Handle different error formats
        let message = 'An error occurred';
        let statusCode = 500;
        let code: string | undefined;
        let details: Record<string, unknown> | undefined;

        if (response) {
            statusCode = response.status;
        }

        if (body) {
            // Handle standardized backend error format
            if (body.error && body.code) {
                message = body.message || body.error;
                code = body.code;
                details = body.details;
            } 
            // Handle legacy format
            else if (body.message) {
                message = body.message;
            }
            // Handle string errors
            else if (typeof body === 'string') {
                message = body;
            }
        }

        super(message);
        
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.userMessage = this.generateUserMessage(statusCode, message);
        this.timestamp = new Date();
        this.code = code;
        this.details = details;
    }

    private generateUserMessage(statusCode: number, serverMessage?: string): string {
        // Use server message if it's user-friendly
        if (serverMessage && this.isUserFriendlyMessage(serverMessage)) {
            return serverMessage;
        }

        // Otherwise, generate a generic user-friendly message
        switch (statusCode) {
            case 400:
                return 'The request was invalid. Please check your input and try again.';
            case 401:
                return 'You need to log in to access this resource.';
            case 403:
                return 'You do not have permission to access this resource.';
            case 404:
                return 'The requested resource could not be found.';
            case 422:
                return 'The data provided is invalid. Please check and try again.';
            case 429:
                return 'Too many requests. Please wait a moment and try again.';
            case 500:
                return 'An internal server error occurred. Please try again later.';
            case 502:
                return 'The server is temporarily unavailable. Please try again later.';
            case 503:
                return 'The service is temporarily unavailable. Please try again later.';
            default:
                return 'An unexpected error occurred. Please try again later.';
        }
    }

    private isUserFriendlyMessage(message: string): boolean {
        const technicalTerms = ['null', 'undefined', 'exception', 'stack', 'trace', 'sql', 'database'];
        return !technicalTerms.some(term => message.toLowerCase().includes(term)) && message.length < 200;
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            userMessage: this.userMessage,
            code: this.code,
            details: this.details,
            timestamp: this.timestamp.toISOString(),
        };
    }
}

// Network-related errors
export class NetworkError extends ApiError {
    constructor(originalError?: Error) {
        super(new Response(null, { status: 0 }), {
            error: 'Network error',
            message: 'Unable to connect to the server. Please check your internet connection.',
            code: 'NETWORK_ERROR'
        });
        this.name = 'NetworkError';
        if (originalError) {
            this.context = { originalError: originalError.message };
        }
    }
}

// Authentication-related errors
export class AuthenticationError extends ApiError {
    constructor(response: Response, body?: any) {
        super(response, body);
        this.name = 'AuthenticationError';
        this.userMessage = 'Your session has expired. Please log in again.';
    }
}

// Authorization-related errors
export class AuthorizationError extends ApiError {
    constructor(response: Response, body?: any) {
        super(response, body);
        this.name = 'AuthorizationError';
        this.userMessage = 'You do not have permission to perform this action.';
    }
}

// Validation-related errors
export class ValidationError extends ApiError {
    constructor(validationIssues: any[], message?: string) {
        super(new Response(null, { status: 422 }), {
            error: 'Validation error',
            message: message || 'The data provided is invalid',
            code: 'VALIDATION_ERROR',
            details: { validationErrors: validationIssues }
        });
        this.name = 'ValidationError';
        this.userMessage = 'Please check your input and try again.';
    }
}

// Rate limiting errors
export class RateLimitError extends ApiError {
    constructor(response: Response, body?: any) {
        super(response, body);
        this.name = 'RateLimitError';
        this.userMessage = 'Too many requests. Please wait a moment and try again.';
    }
}

// Server-related errors
export class ServerError extends ApiError {
    constructor(response: Response, body?: any) {
        super(response, body);
        this.name = 'ServerError';
        this.userMessage = 'A server error occurred. Our team has been notified.';
    }
}

// Timeout errors
export class TimeoutError extends ApiError {
    constructor() {
        super(new Response(null, { status: 408 }), {
            error: 'Request timeout',
            message: 'The request took too long to complete',
            code: 'TIMEOUT_ERROR'
        });
        this.name = 'TimeoutError';
        this.userMessage = 'The request timed out. Please try again.';
    }
}

/**
 * Zod schemas for API response validation
 */

// User schema - matches Go User model
const UserSchema = z.object({
    id: z.string().uuid('User ID must be a valid UUID'),
    name: z.string().min(1, 'User name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().nullable().optional(),
    avatar: z.string().url('Avatar must be a valid URL').nullable().optional(),
    role: z.enum(['admin', 'moderator', 'member', 'guest']),
    isActive: z.boolean(),
    lastLoginAt: z.string().datetime('Invalid last login date').nullable().optional(),
    createdAt: z.string().datetime('Invalid creation date'),
    updatedAt: z.string().datetime('Invalid update date').optional(),
    joinedDate: z.string().datetime('Invalid join date').nullable().optional(), // For API compatibility
});

// Club member schema - extends User with club-specific data
const ClubMemberSchema = UserSchema.extend({
    joinDate: z.string().datetime('Invalid join date format'),
    status: z.enum(['active', 'inactive', 'pending']),
    permissions: z.array(z.string()).optional(),
    booksRead: z.number().int().min(0).optional(),
    clubRole: z.enum(['admin', 'moderator', 'member', 'guest']).optional(),
});

// Event schema
const EventSchema = z.object({
    id: z.string().min(1, 'Event ID is required'),
    title: z.string().min(1, 'Event title is required'),
    description: z.string().optional(),
    date: z.string().datetime('Invalid event date format'),
    location: z.string().optional(),
    type: z.enum(['meeting', 'training', 'social', 'other']),
    status: z.enum(['scheduled', 'cancelled', 'completed']),
    organizerId: z.string().min(1, 'Organizer ID is required'),
});

// Event item schema
const EventItemSchema = z.object({
    id: z.string().min(1, 'Item ID is required'),
    title: z.string().min(1, 'Item title is required'),
    description: z.string().optional(),
    type: z.enum(['agenda', 'material', 'task', 'note']),
    status: z.enum(['pending', 'completed', 'cancelled']),
    assigneeId: z.string().optional(),
    dueDate: z.string().datetime('Invalid due date format').optional(),
});

// Availability schema
const AvailabilitySchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    status: z.enum(['available', 'unavailable', 'maybe']),
    note: z.string().optional(),
    updatedAt: z.string().datetime('Invalid update timestamp'),
});

// Authentication schemas
const LoginRequestSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

const AuthResponseSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    user: UserSchema,
    expiresAt: z.string().datetime('Invalid expiration date').optional(),
});

/**
 * Mock data adapters to convert legacy mock data to schema-compliant format
 */

// Convert mock club members to schema format
async function adaptMockClubMembers(clubId: string): Promise<z.infer<typeof ClubMemberSchema>[]> {
    const mockDataService = await import('./mockDataService');
    const mockService = await mockDataService.getMockDataService();
    const mockMembers = await mockService.getClubMembers(clubId);
    return mockMembers.map((member: any) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        phone: null,
        avatar: member.avatar,
        role: (member.role === 'admin' || member.role === 'moderator' || member.role === 'guest') ? member.role as 'admin' | 'moderator' | 'guest' : 'member' as const,
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(Date.now() - Math.random() * TIME_CONSTANTS.MOCK_DATA_DATE_RANGE_DAYS * 24 * 60 * 60 * 1000).toISOString(), // Random date in last 30 days
        updatedAt: new Date().toISOString(),
        joinedDate: new Date(member.joinedDate || Date.now()).toISOString(),
        joinDate: new Date(member.joinedDate || Date.now()).toISOString(),
        status: 'active' as const,
        permissions: member.role === 'admin' ? ['read', 'write', 'delete'] : ['read'],
        booksRead: Math.floor(Math.random() * 50),
        clubRole: (member.role === 'admin' || member.role === 'moderator' || member.role === 'guest') ? member.role as 'admin' | 'moderator' | 'guest' : 'member' as const,
    }));
}

// Convert mock events to schema format
async function adaptMockEvents(): Promise<z.infer<typeof EventSchema>[]> {
    const mockDataService = await import('./mockDataService');
    const mockService = await mockDataService.getMockDataService();
    const mockEvents = await mockService.getScheduleEvents();
    return mockEvents.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        date: new Date(event.date).toISOString(),
        location: event.location,
        type: event.type || 'meeting',
        status: event.status || 'scheduled',
        organizerId: event.organizerId || '1',
        attendees: Array.isArray(event.attendees) ? [...event.attendees] : [],
        time: event.time || '',
        book: event.book || undefined
    }));
}

// Convert mock event items to schema format
async function adaptMockEventItems(eventId: string): Promise<z.infer<typeof EventItemSchema>[]> {
    const mockDataService = await import('./mockDataService');
    const mockService = await mockDataService.getMockDataService();
    const items = await mockService.getEventItems(eventId);
    return items.map((item: any) => ({
        id: item.id,
        title: item.name || item.title,
        description: item.notes || item.description,
        type: 'task' as const,
        status: (item.status === 'completed' || item.status === 'cancelled') ? item.status : 'pending' as const,
        assigneeId: item.assignedTo || item.assigneeId,
        dueDate: item.dueDate ? new Date(item.dueDate).toISOString() : undefined,
    }));
}

// Convert mock availability to schema format
async function adaptMockAvailability(eventId: string): Promise<Record<string, z.infer<typeof AvailabilitySchema>>> {
    const mockDataService = await import('./mockDataService');
    const mockService = await mockDataService.getMockDataService();
    const availability = await mockService.getMeetingAvailability(eventId);
    const adapted: Record<string, z.infer<typeof AvailabilitySchema>> = {};
    
    Object.entries(availability).forEach(([userId, status]) => {
        adapted[userId] = {
            userId,
            status: (status === 'available' || status === 'unavailable' || status === 'maybe') 
                ? status 
                : 'maybe' as const,
            updatedAt: new Date().toISOString(),
            note: undefined,
        };
    });
    
    return adapted;
}

/**
 * Circuit breaker state tracking
 */
interface CircuitBreakerState {
    failures: number;
    lastFailTime: number;
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

const circuitBreakers = new Map<string, CircuitBreakerState>();

/**
 * Circuit breaker configuration
 */
const CIRCUIT_BREAKER_CONFIG = {
    failureThreshold: 5, // Open circuit after 5 consecutive failures
    timeout: 30000, // 30 seconds before trying half-open
    successThreshold: 2 // Close circuit after 2 consecutive successes in half-open
};

/**
 * Get circuit breaker state for an endpoint
 */
function getCircuitBreakerState(endpoint: string): CircuitBreakerState {
    if (!circuitBreakers.has(endpoint)) {
        circuitBreakers.set(endpoint, {
            failures: 0,
            lastFailTime: 0,
            state: 'CLOSED'
        });
    }
    return circuitBreakers.get(endpoint)!;
}

/**
 * Update circuit breaker on success
 */
function onCircuitBreakerSuccess(endpoint: string) {
    const state = getCircuitBreakerState(endpoint);
    if (state.state === 'HALF_OPEN') {
        // Reset to closed after successful half-open request
        state.state = 'CLOSED';
        state.failures = 0;
    } else if (state.state === 'CLOSED') {
        // Reset failure count on successful closed request
        state.failures = 0;
    }
}

/**
 * Update circuit breaker on failure
 */
function onCircuitBreakerFailure(endpoint: string) {
    const state = getCircuitBreakerState(endpoint);
    state.failures++;
    state.lastFailTime = Date.now();
    
    if (state.failures >= CIRCUIT_BREAKER_CONFIG.failureThreshold) {
        state.state = 'OPEN';
    }
}

/**
 * Check if circuit breaker allows request
 */
function canMakeRequest(endpoint: string): boolean {
    const state = getCircuitBreakerState(endpoint);
    
    switch (state.state) {
        case 'CLOSED':
            return true;
        case 'OPEN':
            // Check if timeout has passed to move to half-open
            if (Date.now() - state.lastFailTime > CIRCUIT_BREAKER_CONFIG.timeout) {
                state.state = 'HALF_OPEN';
                return true;
            }
            return false;
        case 'HALF_OPEN':
            return true;
        default:
            return true;
    }
}

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second base delay
    maxDelay: 10000, // 10 second max delay
    retryableStatus: [408, 429, 500, 502, 503, 504], // HTTP status codes to retry
    retryableErrors: ['NetworkError', 'TimeoutError'] // Error types to retry
};

/**
 * Calculate exponential backoff delay
 */
function calculateRetryDelay(attempt: number): number {
    const delay = RETRY_CONFIG.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 0.1 * delay; // Add 10% jitter
    return Math.min(delay + jitter, RETRY_CONFIG.maxDelay);
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: any): boolean {
    if (error instanceof ApiError) {
        return RETRY_CONFIG.retryableStatus.includes(error.statusCode);
    }
    return RETRY_CONFIG.retryableErrors.includes(error.name);
}

/**
 * Creates a fetch request with timeout, retry logic, and circuit breaker
 */
function createResilientFetch(timeout: number = getAPITimeout()) {
    return async function(url: string, options: RequestInit = {}, retryAttempt = 0): Promise<Response> {
        const endpoint = new URL(url).pathname;
        
        // Circuit breaker check
        if (!canMakeRequest(endpoint)) {
            throw new ServerError(
                new Response(null, { status: 503 }), 
                {
                    error: 'Circuit breaker open',
                    message: 'Service temporarily unavailable due to repeated failures',
                    code: 'CIRCUIT_BREAKER_OPEN'
                }
            );
        }
        
        try {
            const response = await new Promise<Response>((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new TimeoutError());
                }, timeout);

                fetch(url, options)
                    .then(response => {
                        clearTimeout(timeoutId);
                        resolve(response);
                    })
                    .catch(error => {
                        clearTimeout(timeoutId);
                        reject(error);
                    });
            });
            
            // Success - update circuit breaker
            onCircuitBreakerSuccess(endpoint);
            return response;
            
        } catch (error) {
            // Update circuit breaker on failure
            onCircuitBreakerFailure(endpoint);
            
            // Retry logic
            if (retryAttempt < RETRY_CONFIG.maxRetries && isRetryableError(error)) {
                const delay = calculateRetryDelay(retryAttempt);
                
                if (isDevelopment()) {
                    console.warn(`[API] Retrying request to ${url} in ${delay}ms (attempt ${retryAttempt + 1}/${RETRY_CONFIG.maxRetries})`);
                }
                
                await new Promise(resolve => setTimeout(resolve, delay));
                return createResilientFetch(timeout)(url, options, retryAttempt + 1);
            }
            
            throw error;
        }
    };
}

// Lazy-loaded fetch function to avoid module-time evaluation
let _resilientFetch: ReturnType<typeof createResilientFetch> | null = null;
function getResilientFetch() {
    if (!_resilientFetch) {
        _resilientFetch = createResilientFetch();
    }
    return _resilientFetch;
}

/**
 * Generic API request function with comprehensive error handling and validation
 * @param url - The API endpoint URL
 * @param options - Fetch options (method, headers, body, etc.)
 * @param schema - Zod schema for response validation
 * @returns Validated response data
 */
/**
 * Generic API request function with comprehensive error handling and validation
 * @param url - The API endpoint URL
 * @param options - Fetch options (method, headers, body, etc.)
 * @param schema - Zod schema for response validation
 * @returns Validated response data
 */
async function apiRequest<T>(
    url: string,
    options: RequestInit = {},
    schema?: z.ZodSchema<T>
): Promise<T> {
    try {
        // Get authentication token and build headers
        const token = await getAuthToken();
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>,
        };
        
        // Add authorization header if token is available
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            // Debug logging in development to verify token is being sent
            if (isDevelopment()) {
                console.log('[API] Request with token:', url, 'Token length:', token.length);
            }
        } else {
            // Debug logging in development to identify missing tokens
            if (isDevelopment()) {
                console.log('[API] Request without token:', url);
            }
        }
        
        const response = await getResilientFetch()(url, {
            ...options,
            headers,
        });

        // Check if response is OK
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                // If JSON parsing fails, create appropriate error based on status
                const errorData = {
                    error: `HTTP ${response.status}: ${response.statusText}`,
                    message: `Request failed with status ${response.status}`,
                    code: 'HTTP_ERROR'
                };
                
                // Create specific error types based on status code
                switch (response.status) {
                    case 401:
                        throw new AuthenticationError(response, errorData);
                    case 403:
                        throw new AuthorizationError(response, errorData);
                    case 429:
                        throw new RateLimitError(response, errorData);
                    case 422:
                        throw new ValidationError([], errorData.message);
                    case 500:
                    case 502:
                    case 503:
                        throw new ServerError(response, errorData);
                    default:
                        throw new ApiError(response, errorData);
                }
            }

            // Create specific error types based on status code and response data
            switch (response.status) {
                case 401:
                    throw new AuthenticationError(response, errorData);
                case 403:
                    throw new AuthorizationError(response, errorData);
                case 429:
                    throw new RateLimitError(response, errorData);
                case 422:
                    throw new ValidationError(errorData.details?.validationErrors || [], errorData.message);
                case 500:
                case 502:
                case 503:
                    throw new ServerError(response, errorData);
                default:
                    throw new ApiError(response, errorData);
            }
        }

        // Parse response body
        const data = await response.json();

        // Validate response with schema if provided
        if (schema) {
            try {
                return schema.parse(data.data || data);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    throw new ValidationError((error as z.ZodError).issues, 'The server returned data in an unexpected format');
                }
                throw error;
            }
        }

        return data.data || data;
    } catch (error) {
        // Handle AbortController timeout
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new TimeoutError();
        }

        // Handle network errors (fetch failures)
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new NetworkError(error as Error);
        }

        // Re-throw specific error types
        if (error instanceof ApiError || 
            error instanceof NetworkError || 
            error instanceof ValidationError || 
            error instanceof AuthenticationError || 
            error instanceof AuthorizationError || 
            error instanceof RateLimitError || 
            error instanceof ServerError || 
            error instanceof TimeoutError) {
            throw error;
        }

        // Handle unknown errors - log for debugging in development
        if (isDevelopment()) {
            console.error('Unknown API error:', error);
        }

        throw new ServerError(new Response(null, { status: 500 }), {
            error: 'Unknown error occurred',
            message: 'An unexpected error occurred. Please try again.',
            code: 'UNKNOWN_ERROR'
        });
    }
}

/**
 * Club Members API
 */

/**
 * Fetch club members with validation
 * @param clubId - The club identifier
 * @returns Promise with validated club members array
 */
export async function fetchClubMembers(clubId: string): Promise<z.infer<typeof ClubMemberSchema>[]> {
    if (isMockDataEnabled()) {
        // Return adapted mock data when mock data is enabled
        const mockMembers = await adaptMockClubMembers(clubId);
        if (!mockMembers || !Array.isArray(mockMembers)) {
            throw new ApiError(undefined, {
                error: 'No club members found',
                message: 'Failed to load club members (mock data returned null)',
                code: 'NO_CLUB_MEMBERS'
            });
        }
        return mockMembers;
    }

    const membersSchema = z.array(ClubMemberSchema);
    const members = await apiRequest(
        `${getAPIBase()}/club/${clubId}/members`,
        {},
        membersSchema
    );
    if (!members || !Array.isArray(members)) {
        throw new ApiError(undefined, {
            error: 'No club members found',
            message: 'Failed to load club members (API returned null)',
            code: 'NO_CLUB_MEMBERS'
        });
    }
    return members;
}

/**
 * Schedule Events API
 */

/**
 * Fetch schedule events with validation
 * @param clubId - The club identifier
 * @returns Promise with validated events array
 */
export async function fetchScheduleEvents(clubId: string): Promise<z.infer<typeof EventSchema>[]> {
    // Always use mock data in development or when mock data is enabled
    if (isDevelopment() || isMockDataEnabled()) {
        return adaptMockEvents();
    }

    const eventsSchema = z.array(EventSchema);
    return apiRequest(
        `${getAPIBase()}/club/${clubId}/events`,
        {},
        eventsSchema
    );
}

/**
 * Availability Management API
 */

/**
 * Update member availability for an event
 * @param eventId - The event identifier
 * @param userId - The user identifier
 * @param status - Availability status
 * @returns Promise with update confirmation
 */
export async function updateAvailability(
    eventId: string, 
    userId: string, 
    status: 'available' | 'unavailable' | 'maybe'
): Promise<{ success: boolean; eventId: string; userId: string; status: string }> {
    if (isMockDataEnabled()) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ success: true, eventId, userId, status });
            }, 300);
        });
    }
    
    const updateSchema = z.object({
        success: z.boolean(),
        eventId: z.string(),
        userId: z.string(),
        status: z.string(),
    });

    return apiRequest(
        `${getAPIBase()}/events/${eventId}/availability`,
        {
            method: 'POST',
            body: JSON.stringify({ userId, status })
        },
        updateSchema
    );
}

/**
 * Fetch availability data for an event
 * @param eventId - The event identifier
 * @returns Promise with availability data
 */
export async function fetchAvailability(eventId: string): Promise<Record<string, z.infer<typeof AvailabilitySchema>>> {
    if (isMockDataEnabled()) {
        return adaptMockAvailability(eventId);
    }
    
    const availabilitySchema = z.record(z.string(), AvailabilitySchema);
    return apiRequest(
        `${getAPIBase()}/events/${eventId}/availability`,
        {},
        availabilitySchema
    );
}

/**
 * Event Items API
 */

/**
 * Add an item to an event
 * @param eventId - The event identifier
 * @param item - Item data to add
 * @returns Promise with created item
 */
export async function addEventItem(
    eventId: string, 
    item: Omit<z.infer<typeof EventItemSchema>, 'id'>
): Promise<z.infer<typeof EventItemSchema>> {
    if (isMockDataEnabled()) {
        return new Promise(resolve => {
            setTimeout(() => {
                const newItem = {
                    id: `item-${Date.now()}`,
                    ...item,
                    status: 'pending' as const
                };
                resolve(newItem);
            }, 500);
        });
    }
    
    return apiRequest(
        `${getAPIBase()}/events/${eventId}/items`,
        {
            method: 'POST',
            body: JSON.stringify({ item })
        },
        EventItemSchema
    );
}

/**
 * Fetch items for an event
 * @param eventId - The event identifier
 * @returns Promise with event items array
 */
export async function fetchEventItems(eventId: string): Promise<z.infer<typeof EventItemSchema>[]> {
    if (isMockDataEnabled()) {
        return adaptMockEventItems(eventId);
    }
    
    const itemsSchema = z.array(EventItemSchema);
    return apiRequest(
        `${getAPIBase()}/events/${eventId}/items`,
        {},
        itemsSchema
    );
}

/**
 * Authentication API
 */

/**
 * User login
 * @param email - User email
 * @param password - User password
 * @returns Promise with authentication response
 */
export async function login(email: string, password: string): Promise<z.infer<typeof AuthResponseSchema>> {
    if (isMockDataEnabled()) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'demo@bookwork.com' && password === 'password') {
                    resolve({
                        token: 'demo-token',
                        user: {
                            id: '550e8400-e29b-41d4-a716-446655440000',
                            name: 'Demo User',
                            email: 'demo@bookwork.com',
                            phone: null,
                            avatar: '/default-avatar.png',
                            role: 'member' as const,
                            isActive: true,
                            lastLoginAt: null,
                            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                            updatedAt: new Date().toISOString(),
                            joinedDate: null
                        }
                    });
                } else {
                    reject(new ApiError(new Response(null, { status: 401 }), {
                        error: 'Invalid credentials',
                        message: 'Invalid email or password. Please try again.',
                        code: 'INVALID_CREDENTIALS'
                    }));
                }
            }, TIME_CONSTANTS.LOGIN_SIMULATION_DELAY);
        });
    }
    
    // Production login
    const loginData = LoginRequestSchema.parse({ email, password });
    
    const response = await getResilientFetch()(`${getAPIBase()}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(response, errorData);
    }

    const data = await response.json();
    
    // Transform backend response to frontend format
    return {
        token: data.data.token,
        user: {
            id: data.data.user.id,
            name: data.data.user.name,
            email: data.data.user.email,
            phone: data.data.user.phone,
            avatar: data.data.user.avatar,
            role: data.data.user.role,
            isActive: data.data.user.isActive,
            lastLoginAt: data.data.user.lastLoginAt,
            createdAt: data.data.user.createdAt,
            updatedAt: data.data.user.updatedAt,
            joinedDate: data.data.user.joinedDate
        }
    };
}

/**
 * User logout
 * @param refreshToken - Refresh token to revoke
 * @returns Promise with logout confirmation
 */
export async function logout(refreshToken: string): Promise<{ success: boolean }> {
    if (isMockDataEnabled()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true }), 200);
        });
    }
    
    const response = await getResilientFetch()(`${getAPIBase()}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(response, errorData);
    }

    return { success: true };
}

/**
 * Validate authentication token
 * @param token - JWT token to validate
 * @returns Promise with user data if token is valid
 */
export async function validateAuthToken(token: string): Promise<z.infer<typeof UserSchema>> {
    if (isMockDataEnabled()) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (token === 'demo-token') {
                    resolve({
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        name: 'Demo User',
                        email: 'demo@bookwork.com',
                        phone: null,
                        avatar: '/default-avatar.png',
                        role: 'member' as const,
                        isActive: true,
                        lastLoginAt: null,
                        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                        updatedAt: new Date().toISOString(),
                        joinedDate: null
                    });
                } else {
                    reject(new ApiError(new Response(null, { status: 401 }), {
                        error: 'Invalid token',
                        message: 'Your session has expired. Please log in again.',
                        code: 'INVALID_TOKEN'
                    }));
                }
            }, 500);
        });
    }
    
    const response = await getResilientFetch()(`${getAPIBase()}/auth/validate`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(response, errorData);
    }

    const data = await response.json();
    return data.data.user;
}

/**
 * Refresh authentication token
 * @param refreshToken - Refresh token
 * @returns Promise with new token data
 */
export async function refreshAuthToken(refreshToken: string): Promise<{ token: string; expiresAt: string }> {
    if (isMockDataEnabled()) {
        return new Promise(resolve => {
            setTimeout(() => {
                const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
                resolve({
                    token: 'demo-token-refreshed',
                    expiresAt
                });
            }, 500);
        });
    }

    const response = await getResilientFetch()(`${getAPIBase()}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(response, errorData);
    }

    const data = await response.json();
    return {
        token: data.data.token,
        expiresAt: data.data.expiresAt
    };
}

/**
 * Type exports for API consumers
 */
export type User = z.infer<typeof UserSchema>;
export type ClubMember = z.infer<typeof ClubMemberSchema>;
export type Event = z.infer<typeof EventSchema>;
export type EventItem = z.infer<typeof EventItemSchema>;
export type Availability = z.infer<typeof AvailabilitySchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
