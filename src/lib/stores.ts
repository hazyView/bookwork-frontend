/**
 * @fileoverview Global application stores for BookWork frontend using Svelte stores
 * @module Stores
 * @description Centralized state management using Svelte's reactive stores.
 * Provides type-safe interfaces and store definitions for user data, club management,
 * events, navigation state, and UI interactions. All stores are reactive and
 * automatically update subscribed components.
 * 
 * @author BookWork State Management Team
 * @version 2.0.0
 * @since 2024-01-15
 * @requires svelte/store
 * 
 * @architecture
 * - Uses Svelte's built-in reactive store system
 * - Implements TypeScript interfaces for type safety
 * - Provides both readable and writable stores as needed
 * - Supports derived stores for computed values
 * - Includes persistence layer integration points
 */

import { writable, derived, type Writable, type Readable } from 'svelte/store';

/**
 * Type Definitions and Interfaces
 */

/**
 * User account information and profile data
 * 
 * @interface User
 * @property {string} id - Unique user identifier (UUID format)
 * @property {string} email - User's email address (validated format)
 * @property {string} name - User's display name or full name
 * @property {string} [role] - User role (e.g., 'admin', 'member', 'moderator')
 * @property {string} [avatar] - URL to user's profile avatar image
 * 
 * @example
 * ```typescript
 * const user: User = {
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   email: 'john.doe@example.com',
 *   name: 'John Doe',
 *   role: 'member',
 *   avatar: 'https://cdn.example.com/avatars/john.jpg'
 * };
 * ```
 */
export interface User {
	id: string;
	email: string;
	name: string;
	role?: string;
	avatar?: string;
}

/**
 * Book club information and metadata
 * 
 * @interface Club
 * @property {string} id - Unique club identifier (UUID format)
 * @property {string} name - Club display name
 * @property {string} description - Club description and purpose
 * @property {number} memberCount - Current number of active members
 * @property {string} createdAt - ISO date string of club creation
 * 
 * @example
 * ```typescript
 * const club: Club = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   name: 'Classic Literature Society',
 *   description: 'A club dedicated to reading and discussing classic literature',
 *   memberCount: 25,
 *   createdAt: '2024-01-15T10:30:00Z'
 * };
 * ```
 */
export interface Club {
	id: string;
	name: string;
	description: string;
	memberCount: number;
	createdAt: string;
}

/**
 * Individual club member profile and activity data
 * 
 * @interface ClubMember
 * @property {string} id - Unique member identifier (UUID format)
 * @property {string} name - Member's display name
 * @property {string} email - Member's contact email address
 * @property {string} phone - Member's phone number (formatted)
 * @property {string} role - Member's role within the club
 * @property {string} avatar - URL to member's profile picture
 * @property {string} joinedDate - ISO date string when member joined
 * @property {number} booksRead - Total number of books read in the club
 * 
 * @example
 * ```typescript
 * const member: ClubMember = {
 *   id: '987fcdeb-51d2-4c8f-b9a7-123456789abc',
 *   name: 'Jane Smith',
 *   email: 'jane.smith@example.com',
 *   phone: '+1 (555) 123-4567',
 *   role: 'member',
 *   avatar: 'https://cdn.example.com/avatars/jane.jpg',
 *   joinedDate: '2024-02-01T08:00:00Z',
 *   booksRead: 12
 * };
 * ```
 */
export interface ClubMember {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: string;
	avatar: string;
	joinedDate: string;
	booksRead: number;
}

/**
 * Scheduled event information for club activities
 * 
 * @interface ScheduleEvent
 * @property {string} id - Unique event identifier (UUID format)
 * @property {string} title - Event title/name
 * @property {string} description - Detailed event description
 * @property {string} date - ISO date string for event date
 * @property {string} time - Time in HH:MM format
 * @property {string} location - Event location or virtual meeting link
 * @property {string[]} attendees - Array of attendee IDs
 * @property {'meeting' | 'discussion' | 'social' | 'other'} type - Event category
 */
export interface ScheduleEvent {
	id: string;
	title: string;
	description: string;
	date: string;
	time: string;
	location: string;
	attendees: string[];
	type: 'meeting' | 'discussion' | 'social' | 'other';
}

export interface MeetingAvailability {
	[memberId: string]: {
		[date: string]: boolean;
	};
}

export interface EventItem {
	id: string;
	name: string;
	assignedTo: string;
	status: 'pending' | 'confirmed' | 'completed';
	category: string;
}

export interface WebsiteModule {
	id: string;
	name: string;
	description: string;
	component: string;
	category: string;
	settings: Record<string, unknown>;
}

// User authentication stores
export const user: Writable<User | null> = writable(null);
export const isAuthenticated: Readable<boolean> = derived(user, $user => !!$user);

// Current club store
export const currentClub: Writable<Club | null> = writable(null);

// Club members stores
export const clubMembers: Writable<ClubMember[]> = writable([]);
export const membersLoading: Writable<boolean> = writable(false);
export const membersError: Writable<string | null> = writable(null);

// Schedule stores
export const scheduleEvents: Writable<ScheduleEvent[]> = writable([]);
export const scheduleLoading: Writable<boolean> = writable(false);
export const scheduleError: Writable<string | null> = writable(null);

// Meeting availability store
export const meetingAvailability: Writable<MeetingAvailability> = writable({});

// Event tracker store
export const eventItems: Writable<Record<string, EventItem[]>> = writable({});

// Website builder stores
export const builderModules: Writable<WebsiteModule[]> = writable([]);
export const selectedModule: Writable<WebsiteModule | null> = writable(null);

// Support chat stores
export const chatOpen: Writable<boolean> = writable(false);
export const chatMessages: Writable<Array<{
	id: string;
	message: string;
	sender: 'user' | 'support';
	timestamp: string;
}>> = writable([]);

// UI state stores
export const sidebarOpen: Writable<boolean> = writable(false);
export const mobileMenuOpen: Writable<boolean> = writable(false);

// Navigation store
export const currentRoute: Writable<string> = writable('/');

// Theme store
export const darkMode: Writable<boolean> = writable(false);

// Notification store
export const notifications: Writable<Array<{
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	title: string;
	message: string;
	timestamp: string;
	read: boolean;
}>> = writable([]);

// Loading states
export const globalLoading: Writable<boolean> = writable(false);

// Error handling
export const globalError: Writable<string | null> = writable(null);
