/**
 * Mock data service abstraction layer
 * Uses conditional imports to ensure mock data is completely tree-shaken from production builds
 * Provides a clean interface for development data that can be easily removed for production
 */

import type { IMockDataService, MockDataServiceConfig } from './mockDataService.types';
import { isMockDataEnabled } from './env';

/**
 * Create mock data service with environment-aware implementation
 * Returns active service in development, no-op service in production
 * Uses dynamic imports to ensure mock data is excluded from production bundles
 */
export async function createMockDataService(config?: Partial<MockDataServiceConfig>): Promise<IMockDataService> {
    // Check if mock data is enabled via environment variables
    const mockDataEnabled = isMockDataEnabled();
    
    if (mockDataEnabled) {
        const defaultConfig: MockDataServiceConfig = {
            enabled: true,
            responseDelay: 500
        };
        
        // Dynamic import ensures development mock code is tree-shaken in production
        const { createDevMockDataService } = await import('./mockDataService.dev');
        return createDevMockDataService({ ...defaultConfig, ...config });
    } else {
        // Lightweight production implementation
        const { createProdMockDataService } = await import('./mockDataService.prod');
        return createProdMockDataService();
    }
}

/**
 * Singleton instance of mock data service
 * Will be lazily initialized on first access
 */
let mockDataServiceInstance: IMockDataService | null = null;

/**
 * Get the singleton mock data service instance
 */
export async function getMockDataService(): Promise<IMockDataService> {
    if (!mockDataServiceInstance) {
        mockDataServiceInstance = await createMockDataService();
    }
    return mockDataServiceInstance;
}

// Legacy export for backward compatibility
// This creates a lazy-initialized service
export const mockDataService = {
    async getClubMembers(clubId: string) {
        const service = await getMockDataService();
        return service.getClubMembers(clubId);
    },
    async getScheduleEvents() {
        const service = await getMockDataService();
        return service.getScheduleEvents();
    },
    async getEventItems(eventId: string) {
        const service = await getMockDataService();
        return service.getEventItems(eventId);
    },
    async getMeetingAvailability(eventId: string) {
        const service = await getMockDataService();
        return service.getMeetingAvailability(eventId);
    },
    async addClubMember(member: any) {
        const service = await getMockDataService();
        return service.addClubMember(member);
    },
    async updateClubMember(memberId: string, member: any) {
        const service = await getMockDataService();
        return service.updateClubMember(memberId, member);
    },
    async deleteClubMember(memberId: string) {
        const service = await getMockDataService();
        return service.deleteClubMember(memberId);
    },
    async addScheduleEvent(event: any) {
        const service = await getMockDataService();
        return service.addScheduleEvent(event);
    },
    async updateScheduleEvent(eventId: string, event: any) {
        const service = await getMockDataService();
        return service.updateScheduleEvent(eventId, event);
    },
    async deleteScheduleEvent(eventId: string) {
        const service = await getMockDataService();
        return service.deleteScheduleEvent(eventId);
    },
    async addEventItem(eventId: string, item: any) {
        const service = await getMockDataService();
        return service.addEventItem(eventId, item);
    },
    async updateEventItem(eventId: string, itemId: string, item: any) {
        const service = await getMockDataService();
        return service.updateEventItem(eventId, itemId, item);
    },
    async deleteEventItem(eventId: string, itemId: string) {
        const service = await getMockDataService();
        return service.deleteEventItem(eventId, itemId);
    },
    async setMeetingAvailability(eventId: string, userId: string, availability: string) {
        const service = await getMockDataService();
        return service.setMeetingAvailability(eventId, userId, availability);
    }
};

// Re-export types for convenience
export type { IMockDataService, MockDataServiceConfig } from './mockDataService.types';
