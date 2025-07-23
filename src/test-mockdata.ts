/**
 * Simple test to verify the new mock data architecture works
 */
import { getMockDataService } from './lib/mockDataService';

async function testMockDataService() {
    console.log('Testing mock data service...');
    
    try {
        const service = await getMockDataService();
        console.log('Service created successfully');
        
        const members = await service.getClubMembers();
        console.log(`Found ${members.length} mock members`);
        
        const events = await service.getScheduleEvents();
        console.log(`Found ${events.length} mock events`);
        
        console.log('✅ Mock data service test passed!');
    } catch (error) {
        console.error('❌ Mock data service test failed:', error);
    }
}

// Run test if this is the main module
if (import.meta.env.DEV) {
    testMockDataService();
}
