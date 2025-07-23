/**
 * Mock data service type definitions
 * Shared between development and production implementations
 */

export interface MockDataServiceConfig {
    enabled: boolean;
    responseDelay: number;
}

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
