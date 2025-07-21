/**
 * Mock data service abstraction layer
 * Provides a clean interface for development data that can be easily removed for production
 * Decouples the main API layer from mock data dependencies
 */

import { 
    mockClubMembers, 
    mockScheduleEvents, 
    mockEventItems, 
    mockMeetingAvailability 
} from './mockData.js';

import type { z } from 'zod';

/**
 * Type definitions for mock data service
 */
export interface MockDataServiceConfig {
    enabled: boolean;
    responseDelay: number;
}

/**
 * Mock data service interface
 * Provides consistent API for mock data operations
 */
export interface IMockDataService {
    getClubMembers(): Promise<any[]>;
    getScheduleEvents(): Promise<any[]>;
    getEventItems(eventId: string): Promise<any[]>;
    getMeetingAvailability(eventId: string): Promise<Record<string, any>>;
    addClubMember(member: any): Promise<any>;
    updateClubMember(memberId: string, member: any): Promise<any>;
    deleteClubMember(memberId: string): Promise<void>;
    addScheduleEvent(event: any): Promise<any>;
    updateScheduleEvent(eventId: string, event: any): Promise<any>;
    deleteScheduleEvent(eventId: string): Promise<void>;
    addEventItem(eventId: string, item: any): Promise<any>;
    updateEventItem(eventId: string, itemId: string, item: any): Promise<any>;
    deleteEventItem(eventId: string, itemId: string): Promise<void>;
    setMeetingAvailability(eventId: string, userId: string, availability: string): Promise<void>;
}

/**
 * Mock data service implementation
 * Handles all mock data operations with realistic API simulation
 */
class MockDataService implements IMockDataService {
    private config: MockDataServiceConfig;

    constructor(config: MockDataServiceConfig) {
        this.config = config;
    }

    private async delay<T>(data: T): Promise<T> {
        if (this.config.responseDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, this.config.responseDelay));
        }
        return data;
    }

    async getClubMembers(): Promise<any[]> {
        return this.delay([...mockClubMembers]);
    }

    async getScheduleEvents(): Promise<any[]> {
        return this.delay([...mockScheduleEvents]);
    }

    async getEventItems(eventId: string): Promise<any[]> {
        const items = mockEventItems[eventId as keyof typeof mockEventItems] || [];
        return this.delay([...items]);
    }

    async getMeetingAvailability(eventId: string): Promise<Record<string, any>> {
        const availability = mockMeetingAvailability[eventId as keyof typeof mockMeetingAvailability] || {};
        return this.delay({ ...availability });
    }

    async addClubMember(member: any): Promise<any> {
        const newMember = {
            ...member,
            id: `member-${Date.now()}`,
            joinedAt: new Date().toISOString()
        };
        // Note: In real implementation, this would persist to storage
        // For mock, we just return the new member with generated ID
        return this.delay(newMember);
    }

    async updateClubMember(memberId: string, member: any): Promise<any> {
        const updatedMember = {
            ...member,
            id: memberId,
            updatedAt: new Date().toISOString()
        };
        return this.delay(updatedMember);
    }

    async deleteClubMember(memberId: string): Promise<void> {
        // Mock deletion - in real implementation would remove from storage
        await this.delay(undefined);
    }

    async addScheduleEvent(event: any): Promise<any> {
        const newEvent = {
            ...event,
            id: `event-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        return this.delay(newEvent);
    }

    async updateScheduleEvent(eventId: string, event: any): Promise<any> {
        const updatedEvent = {
            ...event,
            id: eventId,
            updatedAt: new Date().toISOString()
        };
        return this.delay(updatedEvent);
    }

    async deleteScheduleEvent(eventId: string): Promise<void> {
        await this.delay(undefined);
    }

    async addEventItem(eventId: string, item: any): Promise<any> {
        const newItem = {
            ...item,
            id: `item-${Date.now()}`,
            eventId,
            createdAt: new Date().toISOString()
        };
        return this.delay(newItem);
    }

    async updateEventItem(eventId: string, itemId: string, item: any): Promise<any> {
        const updatedItem = {
            ...item,
            id: itemId,
            eventId,
            updatedAt: new Date().toISOString()
        };
        return this.delay(updatedItem);
    }

    async deleteEventItem(eventId: string, itemId: string): Promise<void> {
        await this.delay(undefined);
    }

    async setMeetingAvailability(eventId: string, userId: string, availability: string): Promise<void> {
        // Mock setting availability - in real implementation would persist to storage
        await this.delay(undefined);
    }
}

/**
 * No-op mock data service for production
 * Throws errors when accessed to ensure production doesn't use mock data
 */
class NoOpMockDataService implements IMockDataService {
    private throwProductionError(): never {
        throw new Error('Mock data service should not be used in production');
    }

    async getClubMembers(): Promise<any[]> { return this.throwProductionError(); }
    async getScheduleEvents(): Promise<any[]> { return this.throwProductionError(); }
    async getEventItems(eventId: string): Promise<any[]> { return this.throwProductionError(); }
    async getMeetingAvailability(eventId: string): Promise<Record<string, any>> { return this.throwProductionError(); }
    async addClubMember(member: any): Promise<any> { return this.throwProductionError(); }
    async updateClubMember(memberId: string, member: any): Promise<any> { return this.throwProductionError(); }
    async deleteClubMember(memberId: string): Promise<void> { return this.throwProductionError(); }
    async addScheduleEvent(event: any): Promise<any> { return this.throwProductionError(); }
    async updateScheduleEvent(eventId: string, event: any): Promise<any> { return this.throwProductionError(); }
    async deleteScheduleEvent(eventId: string): Promise<void> { return this.throwProductionError(); }
    async addEventItem(eventId: string, item: any): Promise<any> { return this.throwProductionError(); }
    async updateEventItem(eventId: string, itemId: string, item: any): Promise<any> { return this.throwProductionError(); }
    async deleteEventItem(eventId: string, itemId: string): Promise<void> { return this.throwProductionError(); }
    async setMeetingAvailability(eventId: string, userId: string, availability: string): Promise<void> { return this.throwProductionError(); }
}

/**
 * Create mock data service instance based on environment
 * Returns active service in development, no-op service in production
 */
export function createMockDataService(config?: Partial<MockDataServiceConfig>): IMockDataService {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
        const defaultConfig: MockDataServiceConfig = {
            enabled: true,
            responseDelay: 500
        };
        return new MockDataService({ ...defaultConfig, ...config });
    } else {
        return new NoOpMockDataService();
    }
}

/**
 * Default mock data service instance
 * Can be imported and used directly in development
 */
export const mockDataService = createMockDataService();
