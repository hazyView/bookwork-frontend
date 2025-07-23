/**
 * Development-only mock data service
 * This file should only be imported in development mode
 * Production builds will exclude this via Vite tree-shaking
 */

import type { IMockDataService, MockDataServiceConfig } from './mockDataService.types';

/**
 * Development mock data service implementation
 * Only available in development builds
 */
class DevMockDataService implements IMockDataService {
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
        const { mockClubMembers } = await import('./mockData');
        return this.delay([...mockClubMembers]);
    }

    async getScheduleEvents(): Promise<any[]> {
        const { mockScheduleEvents } = await import('./mockData');
        return this.delay([...mockScheduleEvents]);
    }

    async getEventItems(eventId: string): Promise<any[]> {
        const { mockEventItems } = await import('./mockData');
        const items = mockEventItems[eventId as keyof typeof mockEventItems] || [];
        return this.delay([...items]);
    }

    async getMeetingAvailability(eventId: string): Promise<Record<string, any>> {
        const { mockMeetingAvailability } = await import('./mockData');
        const availability = mockMeetingAvailability[eventId as keyof typeof mockMeetingAvailability] || {};
        return this.delay({ ...availability });
    }

    async addClubMember(member: any): Promise<any> {
        const newMember = {
            ...member,
            id: `member-${Date.now()}`,
            joinedAt: new Date().toISOString()
        };
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
        // Mock setting availability - would update storage in real implementation
        await this.delay(undefined);
    }
}

export function createDevMockDataService(config: MockDataServiceConfig): IMockDataService {
    return new DevMockDataService(config);
}
