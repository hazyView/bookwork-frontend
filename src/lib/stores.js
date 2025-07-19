import { writable, derived } from 'svelte/store';

// User authentication store
export const user = writable(null);
export const isAuthenticated = derived(user, $user => !!$user);

// Current club store
export const currentClub = writable(null);

// Club members store
export const clubMembers = writable([]);
export const membersLoading = writable(false);
export const membersError = writable(null);

// Schedule store
export const scheduleEvents = writable([]);
export const scheduleLoading = writable(false);
export const scheduleError = writable(null);

// Meeting availability store
export const meetingAvailability = writable({});

// Event tracker store
export const eventItems = writable({});

// Website builder store
export const builderModules = writable([]);
export const selectedModule = writable(null);

// Support chat store
export const chatOpen = writable(false);
export const chatMessages = writable([]);

// Navigation store
export const currentPage = writable('home');
