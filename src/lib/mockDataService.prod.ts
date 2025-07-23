/**
 * Production mock data service
 * No-op implementation that does nothing and takes up minimal space
 */

import type { IMockDataService } from './mockDataService.types';

/**
 * Production no-op mock data service
 * Returns empty data and does no processing
 */
class ProdMockDataService implements IMockDataService {
    async getClubMembers(): Promise<any[]> {
        return [];
    }

    async getScheduleEvents(): Promise<any[]> {
        return [];
    }

    async getEventItems(eventId: string): Promise<any[]> {
        return [];
    }

    async getMeetingAvailability(eventId: string): Promise<Record<string, any>> {
        return {};
    }

    async addClubMember(member: any): Promise<any> {
        return null;
    }

    async updateClubMember(memberId: string, member: any): Promise<any> {
        return null;
    }

    async deleteClubMember(memberId: string): Promise<void> {
        // No-op
    }

    async addScheduleEvent(event: any): Promise<any> {
        return null;
    }

    async updateScheduleEvent(eventId: string, event: any): Promise<any> {
        return null;
    }

    async deleteScheduleEvent(eventId: string): Promise<void> {
        // No-op
    }

    async addEventItem(eventId: string, item: any): Promise<any> {
        return null;
    }

    async updateEventItem(eventId: string, itemId: string, item: any): Promise<any> {
        return null;
    }

    async deleteEventItem(eventId: string, itemId: string): Promise<void> {
        // No-op
    }

    async setMeetingAvailability(eventId: string, userId: string, availability: string): Promise<void> {
        // No-op
    }
}

export function createProdMockDataService(): IMockDataService {
    return new ProdMockDataService();
}
