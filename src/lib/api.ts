/**
 * API utilities for data fetching with comprehensive runtime validation and error handling
 * Provides a clean abstraction between frontend and backend with robust type safety
 * Uses Zod for runtime validation and implements standardized error handling
 */

import { z } from 'zod';
import { mockDataService } from './mockDataService';
import { env } from './env';

const API_BASE = env.VITE_API_BASE || '/api';
const IS_DEVELOPMENT = env.NODE_ENV === 'development';

/**
 * Custom API Error class for standardized error handling
 * Extends Error with additional context and HTTP status codes
 */
export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly userMessage: string;
    public readonly context?: Record<string, any>;
    public readonly timestamp: Date;

    constructor(
        message: string,
        statusCode: number = 500,
        userMessage?: string,
        context?: Record<string, any>
    ) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.userMessage = userMessage || this.getDefaultUserMessage(statusCode);
        this.context = context;
        this.timestamp = new Date();
    }

    private getDefaultUserMessage(statusCode: number): string {
        switch (statusCode) {
            case 400:
                return 'The request was invalid. Please check your input and try again.';
            case 401:
                return 'You need to log in to access this resource.';
            case 403:
                return 'You do not have permission to access this resource.';
            case 404:
                return 'The requested resource could not be found.';
            case 429:
                return 'Too many requests. Please wait a moment and try again.';
            case 500:
                return 'An internal server error occurred. Please try again later.';
            case 503:
                return 'The service is temporarily unavailable. Please try again later.';
            default:
                return 'An unexpected error occurred. Please try again later.';
        }
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            userMessage: this.userMessage,
            context: this.context,
            timestamp: this.timestamp.toISOString(),
        };
    }
}

/**
 * Zod schemas for API response validation
 */

// User schema
const UserSchema = z.object({
    id: z.string().min(1, 'User ID is required'),
    name: z.string().min(1, 'User name is required'),
    email: z.string().email('Invalid email format'),
    avatar: z.string().url('Avatar must be a valid URL').optional(),
    role: z.enum(['admin', 'member', 'guest']),
});

// Club member schema
const ClubMemberSchema = UserSchema.extend({
    joinDate: z.string().datetime('Invalid join date format'),
    status: z.enum(['active', 'inactive', 'pending']),
    permissions: z.array(z.string()).optional(),
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
async function adaptMockClubMembers(): Promise<z.infer<typeof ClubMemberSchema>[]> {
    const mockMembers = await mockDataService.getClubMembers();
    return mockMembers.map((member: any) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        avatar: member.avatar,
        role: (member.role === 'admin' || member.role === 'guest') ? member.role : 'member' as const,
        joinDate: new Date(member.joinedDate || Date.now()).toISOString(),
        status: 'active' as const,
        permissions: member.role === 'admin' ? ['read', 'write', 'delete'] : ['read'],
    }));
}

// Convert mock events to schema format
async function adaptMockEvents(): Promise<z.infer<typeof EventSchema>[]> {
    const mockEvents = await mockDataService.getScheduleEvents();
    return mockEvents.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        date: new Date(event.date).toISOString(),
        location: event.location,
        type: 'meeting' as const,
        status: 'scheduled' as const,
        organizerId: '1', // Default organizer
    }));
}

// Convert mock event items to schema format
async function adaptMockEventItems(eventId: string): Promise<z.infer<typeof EventItemSchema>[]> {
    const items = await mockDataService.getEventItems(eventId);
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
    const availability = await mockDataService.getMeetingAvailability(eventId);
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
 * Generic API request handler with runtime validation
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @param schema - Zod schema for response validation
 * @returns Promise with validated response data
 */
async function apiRequest<T>(
    url: string, 
    options: RequestInit = {}, 
    schema?: z.ZodType<T>
): Promise<T> {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            
            try {
                const errorJson = JSON.parse(errorBody);
                errorMessage = errorJson.message || errorMessage;
            } catch {
                // Use default message if JSON parsing fails
            }

            throw new ApiError(
                errorMessage,
                response.status,
                undefined,
                { url, method: options.method || 'GET' }
            );
        }

        const data = await response.json();

        // Validate response with schema if provided
        if (schema) {
            try {
                return schema.parse(data);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    throw new ApiError(
                        'Invalid response data from server',
                        500,
                        'The server returned invalid data. Please try again.',
                        { 
                            url, 
                            validationErrors: error.issues,
                            receivedData: data 
                        }
                    );
                }
                throw error;
            }
        }

        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new ApiError(
                'Network error: Unable to connect to server',
                0,
                'Unable to connect to the server. Please check your internet connection and try again.',
                { url }
            );
        }

        throw new ApiError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            500,
            'An unexpected error occurred. Please try again.',
            { url, originalError: error }
        );
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
    if (IS_DEVELOPMENT) {
        // Return adapted mock data in development
        return adaptMockClubMembers();
    }
    
    const membersSchema = z.array(ClubMemberSchema);
    return apiRequest(
        `${API_BASE}/club/${clubId}/members`,
        {},
        membersSchema
    );
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
    if (IS_DEVELOPMENT) {
        return adaptMockEvents();
    }
    
    const eventsSchema = z.array(EventSchema);
    return apiRequest(
        `${API_BASE}/club/${clubId}/events`,
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
    if (IS_DEVELOPMENT) {
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
        `${API_BASE}/events/${eventId}/availability`,
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
    if (IS_DEVELOPMENT) {
        return adaptMockAvailability(eventId);
    }
    
    const availabilitySchema = z.record(z.string(), AvailabilitySchema);
    return apiRequest(
        `${API_BASE}/events/${eventId}/availability`,
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
    if (IS_DEVELOPMENT) {
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
        `${API_BASE}/events/${eventId}/items`,
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
    if (IS_DEVELOPMENT) {
        return adaptMockEventItems(eventId);
    }
    
    const itemsSchema = z.array(EventItemSchema);
    return apiRequest(
        `${API_BASE}/events/${eventId}/items`,
        {},
        itemsSchema
    );
}

/**
 * Authentication API
 */

/**
 * Validate authentication token
 * @param token - JWT token to validate
 * @returns Promise with user data if token is valid
 */
export async function validateAuthToken(token: string): Promise<z.infer<typeof UserSchema>> {
    if (IS_DEVELOPMENT) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (token === 'demo-token') {
                    resolve({
                        id: '1',
                        name: 'John Doe',
                        email: 'john@example.com',
                        avatar: '/default-avatar.png',
                        role: 'member'
                    });
                } else {
                    reject(new ApiError('Invalid token', 401, 'Your session has expired. Please log in again.'));
                }
            }, 500);
        });
    }
    
    return apiRequest(
        `${API_BASE}/auth/validate`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        },
        UserSchema
    );
}

/**
 * User login
 * @param email - User email
 * @param password - User password
 * @returns Promise with authentication response
 */
export async function login(email: string, password: string): Promise<z.infer<typeof AuthResponseSchema>> {
    if (IS_DEVELOPMENT) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'john@example.com' && password === 'password') {
                    resolve({
                        token: 'demo-token',
                        user: {
                            id: '1',
                            name: 'John Doe',
                            email: 'john@example.com',
                            avatar: '/default-avatar.png',
                            role: 'member'
                        }
                    });
                } else {
                    reject(new ApiError('Invalid credentials', 401, 'Invalid email or password. Please try again.'));
                }
            }, 1000);
        });
    }
    
    // Validate input before sending request
    const loginData = LoginRequestSchema.parse({ email, password });
    
    return apiRequest(
        `${API_BASE}/auth/login`,
        {
            method: 'POST',
            body: JSON.stringify(loginData)
        },
        AuthResponseSchema
    );
}

/**
 * User logout
 * @param token - Authentication token to invalidate
 * @returns Promise with logout confirmation
 */
export async function logout(token: string): Promise<{ success: boolean }> {
    if (IS_DEVELOPMENT) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true }), 200);
        });
    }
    
    const logoutSchema = z.object({ success: z.boolean() });
    
    return apiRequest(
        `${API_BASE}/auth/logout`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        },
        logoutSchema
    );
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
