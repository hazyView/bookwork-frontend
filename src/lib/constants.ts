/**
 * Application-wide constants for consistent timeout values, delays, and configuration
 * This helps maintain consistency and makes values easier to modify across the application
 */

// Time constants in milliseconds
export const TIME_CONSTANTS = {
	// Authentication & Session
	SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
	TOKEN_REFRESH_TIME: 25 * 60 * 1000, // 25 minutes (5 minutes before expiration)
	TOKEN_VALIDATION_TIMEOUT: 5000, // 5 seconds
	
	// API & Network
	DEFAULT_API_TIMEOUT: 30000, // 30 seconds
	LOGIN_SIMULATION_DELAY: 1000, // 1 second
	LOGOUT_SIMULATION_DELAY: 200, // 200ms
	TOKEN_REFRESH_DELAY: 500, // 500ms
	AVAILABILITY_UPDATE_DELAY: 300, // 300ms
	EVENT_ITEM_ADD_DELAY: 500, // 500ms
	
	// UI Feedback & Notifications
	ERROR_TOAST_DURATION: 4000, // 4 seconds
	SUCCESS_TOAST_DURATION: 3000, // 3 seconds
	DEFAULT_RETRY_DELAY: 1000, // 1 second
	STATUS_RESET_DELAY: 3000, // 3 seconds
	LAYOUT_UPDATE_INTERVAL: 1000, // 1 second
	
	// Mock Data Generation
	MOCK_DATA_DATE_RANGE_DAYS: 30, // 30 days for random date generation
} as const;

// UI Constants
export const UI_CONSTANTS = {
	// Z-Index layers
	MODAL_Z_INDEX: 1000,
	TOAST_Z_INDEX: 1001,
	TOOLTIP_Z_INDEX: 1002,
	
	// Animation durations (in ms)
	MODAL_ANIMATION_DURATION: 200,
	TOAST_SLIDE_DURATION: 300,
	BUTTON_HOVER_DURATION: 150,
	
	// Input validation
	MIN_PASSWORD_LENGTH: 8,
	MAX_INPUT_LENGTH: 255,
	MAX_TEXTAREA_LENGTH: 1000,
	
	// Pagination
	DEFAULT_PAGE_SIZE: 20,
	MAX_PAGE_SIZE: 100,
} as const;

// API Constants
export const API_CONSTANTS = {
	// HTTP Status codes commonly handled
	HTTP_UNAUTHORIZED: 401,
	HTTP_FORBIDDEN: 403,
	HTTP_NOT_FOUND: 404,
	HTTP_VALIDATION_ERROR: 422,
	HTTP_RATE_LIMITED: 429,
	HTTP_SERVER_ERROR: 500,
	
	// Retry configuration
	MAX_RETRY_ATTEMPTS: 3,
	RETRY_BACKOFF_MULTIPLIER: 2,
	INITIAL_RETRY_DELAY: 1000,
} as const;

// Business Logic Constants
export const BUSINESS_CONSTANTS = {
	// Mock data ranges
	MAX_BOOKS_READ: 50,
	COMPANY_FOUNDATION_YEAR: 2020,
	MAX_EMPLOYEES_SMALL_OFFICE: 30,
	COUNTRIES_SERVED: 25,
	
	// User roles
	ROLES: ['admin', 'moderator', 'member', 'guest'] as const,
	AVAILABILITY_OPTIONS: ['available', 'unavailable', 'maybe'] as const,
	EVENT_TYPES: ['meeting', 'training', 'social', 'other'] as const,
	EVENT_STATUSES: ['scheduled', 'cancelled', 'completed'] as const,
} as const;

// Export commonly used time calculations as utility functions
export const timeUtils = {
	minutes: (n: number) => n * 60 * 1000,
	hours: (n: number) => n * 60 * 60 * 1000,
	days: (n: number) => n * 24 * 60 * 60 * 1000,
	weeks: (n: number) => n * 7 * 24 * 60 * 60 * 1000,
} as const;

// Type exports for type safety
export type UserRole = typeof BUSINESS_CONSTANTS.ROLES[number];
export type AvailabilityOption = typeof BUSINESS_CONSTANTS.AVAILABILITY_OPTIONS[number];
export type EventType = typeof BUSINESS_CONSTANTS.EVENT_TYPES[number];
export type EventStatus = typeof BUSINESS_CONSTANTS.EVENT_STATUSES[number];
