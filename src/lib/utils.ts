/**
 * @fileoverview Comprehensive utility functions for the BookWork frontend application
 * @module Utils
 * @description Provides date/time formatting, debouncing, throttling, array manipulation,
 * string utilities, and file handling functions for consistent usage across the application.
 * 
 * @author BookWork Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

/**
 * Date and time formatting utilities
 */

/**
 * Format a date string or Date object to a readable format
 * @param {string | Date} date - Date string (ISO format) or Date object to format
 * @returns {string} Formatted date string in "Month Day, Year" format (e.g., "January 15, 2024")
 * @throws {Error} Throws error if date is invalid or cannot be parsed
 * @example
 * ```typescript
 * formatDate('2024-01-15') // Returns "January 15, 2024"
 * formatDate(new Date(2024, 0, 15)) // Returns "January 15, 2024"
 * ```
 */
export function formatDate(date: string | Date): string {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(new Date(date));
}

/**
 * Format a date string or Date object to a readable time format
 * @param {string | Date} date - Date string (ISO format) or Date object to format
 * @returns {string} Formatted time string in 12-hour format (e.g., "2:30 PM")
 * @throws {Error} Throws error if date is invalid or cannot be parsed
 * @example
 * ```typescript
 * formatTime('2024-01-15T14:30:00') // Returns "2:30 PM"
 * formatTime(new Date(2024, 0, 15, 14, 30)) // Returns "2:30 PM"
 * ```
 */
export function formatTime(date: string | Date): string {
	return new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	}).format(new Date(date));
}

/**
 * Format a date string or Date object to a readable date and time format
 * @param {string | Date} date - Date string (ISO format) or Date object to format
 * @returns {string} Formatted date and time string (e.g., "January 15, 2024 at 2:30 PM")
 * @throws {Error} Throws error if date is invalid or cannot be parsed
 * @example
 * ```typescript
 * formatDateTime('2024-01-15T14:30:00') // Returns "January 15, 2024 at 2:30 PM"
 * formatDateTime(new Date(2024, 0, 15, 14, 30)) // Returns "January 15, 2024 at 2:30 PM"
 * ```
 */
export function formatDateTime(date: string | Date): string {
	return `${formatDate(date)} at ${formatTime(date)}`;
}

/**
 * Performance and Event Handling Utilities
 */

/**
 * Debounce function to limit the rate at which a function can fire.
 * Delays function execution until after a specified wait time has elapsed
 * since the last time it was invoked. Useful for handling rapid user input.
 * 
 * @template T - The type of function being debounced
 * @param {T} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds before function execution
 * @returns {(...args: Parameters<T>) => void} Debounced function that delays execution
 * @example
 * ```typescript
 * // Create debounced search function that waits 300ms after user stops typing
 * const debouncedSearch = debounce((query: string) => {
 *   performSearch(query);
 * }, 300);
 * 
 * // Use in input handler
 * input.addEventListener('input', (e) => {
 *   debouncedSearch(e.target.value);
 * });
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;
	return function executedFunction(...args: Parameters<T>): void {
		const later = (): void => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

/**
 * Throttle function to ensure a function doesn't run more than once in a specified time period.
 * Unlike debounce, throttle ensures the function executes at regular intervals during 
 * continuous invocation. Ideal for scroll handlers and resize events.
 * 
 * @template T - The type of function being throttled
 * @param {T} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds between function executions
 * @returns {(...args: Parameters<T>) => void} Throttled function that executes at most once per limit period
 * @example
 * ```typescript
 * // Create throttled scroll handler that runs at most once every 100ms
 * const throttledScrollHandler = throttle((event: Event) => {
 *   handleScroll(event);
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScrollHandler);
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	return function executedFunction(...args: Parameters<T>): void {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
}

/**
 * Identifier Generation Utilities
 */

/**
 * Generate a cryptographically secure random UUID v4.
 * Uses the Web Crypto API for secure random number generation.
 * 
 * @returns {string} UUID string in standard format (e.g., "550e8400-e29b-41d4-a716-446655440000")
 * @throws {Error} Throws error if crypto.randomUUID is not supported in the environment
 * @example
 * ```typescript
 * const userId = generateId(); // "550e8400-e29b-41d4-a716-446655440000"
 * const sessionId = generateId(); // "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
 * ```
 */
export function generateId(): string {
	return crypto.randomUUID();
}

/**
 * String Manipulation Utilities
 */

/**
 * Capitalize the first letter of a string while keeping the rest unchanged.
 * 
 * @param {string} str - String to capitalize
 * @returns {string} String with first letter capitalized
 * @example
 * ```typescript
 * capitalize('hello world') // Returns "Hello world"
 * capitalize('HELLO WORLD') // Returns "HELLO WORLD"
 * capitalize('') // Returns ""
 * ```
 */
export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a string to title case where each word's first letter is capitalized.
 * Handles multiple whitespace characters and preserves word boundaries.
 * 
 * @param {string} str - String to convert to title case
 * @returns {string} String in title case format
 * @example
 * ```typescript
 * toTitleCase('hello world') // Returns "Hello World"
 * toTitleCase('the quick brown fox') // Returns "The Quick Brown Fox"
 * toTitleCase('  multiple   spaces  ') // Returns "Multiple Spaces"
 * ```
 */
export function toTitleCase(str: string): string {
	return str.replace(/\w\S*/g, (txt) => 
		txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	);
}

/**
 * Truncate text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, length: number): string {
	if (text.length <= length) return text;
	return text.slice(0, length) + '...';
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param value - Value to check
 * @returns True if empty
 */
export function isEmpty(value: unknown): boolean {
	if (value === null || value === undefined) return true;
	if (typeof value === 'string' && value.trim() === '') return true;
	if (Array.isArray(value) && value.length === 0) return true;
	if (typeof value === 'object' && Object.keys(value as Record<string, unknown>).length === 0) return true;
	return false;
}

/**
 * Deep clone an object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') return obj;
	if (obj instanceof Date) return new Date(obj.getTime()) as T;
	if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as T;
	
	const cloned = {} as T;
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			cloned[key] = deepClone(obj[key]);
		}
	}
	return cloned;
}

/**
 * Sort an array of objects by a property
 * @param array - Array to sort
 * @param property - Property to sort by
 * @param direction - Sort direction
 * @returns Sorted array
 */
export function sortBy<T>(
	array: T[], 
	property: keyof T, 
	direction: 'asc' | 'desc' = 'asc'
): T[] {
	return [...array].sort((a, b) => {
		const aVal = a[property];
		const bVal = b[property];
		
		if (aVal < bVal) return direction === 'asc' ? -1 : 1;
		if (aVal > bVal) return direction === 'asc' ? 1 : -1;
		return 0;
	});
}

/**
 * Group an array of objects by a property
 * @param array - Array to group
 * @param property - Property to group by
 * @returns Grouped object
 */
export function groupBy<T>(array: T[], property: keyof T): Record<string, T[]> {
	return array.reduce((groups, item) => {
		const key = String(item[property]);
		if (!groups[key]) {
			groups[key] = [];
		}
		groups[key].push(item);
		return groups;
	}, {} as Record<string, T[]>);
}

/**
 * Calculate the difference between two dates in days
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in days
 */
export function daysDifference(date1: string | Date, date2: string | Date): number {
	const d1 = new Date(date1);
	const d2 = new Date(date2);
	const diffTime = Math.abs(d2.getTime() - d1.getTime());
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export function isToday(date: string | Date): boolean {
	const today = new Date();
	const checkDate = new Date(date);
	return checkDate.toDateString() === today.toDateString();
}

/**
 * Format file size in bytes to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate a slug from a string
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Remove special characters
		.replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
		.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Check if an item with the given name already exists in the list
 * @param items - Array of items with name property
 * @param itemName - Name to check for duplicates
 * @returns True if duplicate exists, false otherwise
 */
export function isDuplicateItem(items: { name: string }[], itemName: string): boolean {
	const trimmedName = itemName.trim().toLowerCase();
	return items.some(item => item.name.trim().toLowerCase() === trimmedName);
}
