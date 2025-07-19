// @ts-check
// API utilities for data fetching
import { 
    mockClubMembers, 
    mockScheduleEvents, 
    mockEventItems, 
    mockMeetingAvailability 
} from './mockData.js';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const IS_DEVELOPMENT = import.meta.env.MODE === 'development';

/**
 * @param {string} clubId
 * @returns {Promise<any[]>}
 */
export async function fetchClubMembers(clubId) {
    if (IS_DEVELOPMENT) {
        // Return mock data explicitly in development
        return new Promise(resolve => 
            setTimeout(() => resolve(mockClubMembers), 500)
        );
    }
    
    try {
        const response = await fetch(`${API_BASE}/club/${clubId}/members`);
        if (!response.ok) throw new Error('Failed to fetch club members');
        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching club members: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * @param {string} clubId
 * @returns {Promise<any[]>}
 */
export async function fetchScheduleEvents(clubId) {
    if (IS_DEVELOPMENT) {
        // Return mock data explicitly in development
        return new Promise(resolve => 
            setTimeout(() => resolve(mockScheduleEvents), 800)
        );
    }
    
    try {
        const response = await fetch(`${API_BASE}/club/${clubId}/events`);
        if (!response.ok) throw new Error('Failed to fetch schedule events');
        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching schedule events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * @param {string} eventId
 * @param {string} userId
 * @param {string} status
 * @returns {Promise<any>}
 */
export async function updateAvailability(eventId, userId, status) {
    if (IS_DEVELOPMENT) {
        // Update mock data in development
        return new Promise(resolve => {
            setTimeout(() => {
                // Simulate successful update
                resolve({ success: true, eventId, userId, status });
            }, 300);
        });
    }
    
    try {
        const response = await fetch(`${API_BASE}/events/${eventId}/availability`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, status })
        });
        if (!response.ok) throw new Error('Failed to update availability');
        return await response.json();
    } catch (error) {
        throw new Error(`Error updating availability: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * @param {string} eventId
 * @param {any} item
 * @returns {Promise<any>}
 */
export async function addEventItem(eventId, item) {
    if (IS_DEVELOPMENT) {
        // Simulate adding item in development
        return new Promise(resolve => {
            setTimeout(() => {
                const newItem = {
                    id: `item-${Date.now()}`,
                    ...item,
                    status: 'pending'
                };
                resolve(newItem);
            }, 500);
        });
    }
    
    try {
        const response = await fetch(`${API_BASE}/events/${eventId}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item })
        });
        if (!response.ok) throw new Error('Failed to add event item');
        return await response.json();
    } catch (error) {
        throw new Error(`Error adding event item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * @param {string} eventId
 * @returns {Promise<any[]>}
 */
export async function fetchEventItems(eventId) {
    if (IS_DEVELOPMENT) {
        // Return mock data explicitly in development
        return new Promise(resolve => {
            setTimeout(() => {
                const items = mockEventItems[/** @type {keyof typeof mockEventItems} */ (eventId)] || [];
                resolve(items);
            }, 400);
        });
    }
    
    try {
        const response = await fetch(`${API_BASE}/events/${eventId}/items`);
        if (!response.ok) throw new Error('Failed to fetch event items');
        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching event items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * @param {string} eventId
 * @returns {Promise<any>}
 */
export async function fetchAvailability(eventId) {
    if (IS_DEVELOPMENT) {
        // Return mock data explicitly in development
        return new Promise(resolve => {
            setTimeout(() => {
                const availability = mockMeetingAvailability[/** @type {keyof typeof mockMeetingAvailability} */ (eventId)] || {};
                resolve(availability);
            }, 300);
        });
    }
    
    try {
        const response = await fetch(`${API_BASE}/events/${eventId}/availability`);
        if (!response.ok) throw new Error('Failed to fetch availability');
        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching availability: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * @param {string} token
 * @returns {Promise<any>}
 */
export async function validateAuthToken(token) {
    if (IS_DEVELOPMENT) {
        // Simulate token validation in development
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
                    reject(new Error('Invalid token'));
                }
            }, 500);
        });
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/validate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Token validation failed');
        return await response.json();
    } catch (error) {
        throw new Error(`Error validating token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<any>}
 */
export async function login(email, password) {
    if (IS_DEVELOPMENT) {
        // Simulate login in development
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
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error('Login failed');
        return await response.json();
    } catch (error) {
        throw new Error(`Error during login: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
