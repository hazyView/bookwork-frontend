/**
 * Centralized mock data for development mode
 * TypeScript version with proper type definitions
 */

import type { ClubMember, ScheduleEvent, EventItem, MeetingAvailability, Club } from './stores.ts';

// Mock club members data
export const mockClubMembers: ClubMember[] = [
  // All entries now have required ClubMember fields for Zod and TS
  {
    id: 'b3b1c2d3-4e5f-6789-0123-456789abcdef',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    role: 'member',
    avatar: 'https://www.bookwork-demo.com/default-avatar.png',
    joinedDate: '2023-01-15T12:00:00.000Z',
    booksRead: 12,
    isActive: true,
    createdAt: '2023-01-15T12:00:00.000Z',
    joinDate: '2023-01-15T12:00:00.000Z',
    status: 'active',
    permissions: [],
    clubRole: 'member'
  },
  {
    id: 'c4c2d3e4-5f6a-7890-1234-567890abcdef',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '(555) 234-5678',
    role: 'member',
    avatar: 'https://www.bookwork-demo.com/default-avatar.png',
    joinedDate: '2023-02-20T12:00:00.000Z',
    booksRead: 8,
    isActive: true,
    createdAt: '2023-02-20T12:00:00.000Z',
    joinDate: '2023-02-20T12:00:00.000Z',
    status: 'active',
    permissions: [],
    clubRole: 'member'
  },
  {
    id: 'd5d3e4f5-6a7b-8901-2345-678901abcdef',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '(555) 345-6789',
    role: 'member',
    avatar: 'https://www.bookwork-demo.com/default-avatar.png',
    joinedDate: '2023-03-10T12:00:00.000Z',
    booksRead: 15,
    isActive: true,
    createdAt: '2023-03-10T12:00:00.000Z',
    joinDate: '2023-03-10T12:00:00.000Z',
    status: 'active',
    permissions: [],
    clubRole: 'member'
  },
  {
    id: 'e6e4f5g6-7b8c-9012-3456-789012abcdef',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '(555) 456-7890',
    role: 'member',
    avatar: 'https://www.bookwork-demo.com/default-avatar.png',
    joinedDate: '2023-04-05T12:00:00.000Z',
    booksRead: 6,
    isActive: true,
    createdAt: '2023-04-05T12:00:00.000Z',
    joinDate: '2023-04-05T12:00:00.000Z',
    status: 'active',
    permissions: [],
    clubRole: 'member'
  },
  {
    id: 'f7f5g6h7-8c9d-0123-4567-890123abcdef',
    name: 'David Brown',
    email: 'david@example.com',
    phone: '(555) 567-8901',
    role: 'moderator',
    avatar: 'https://www.bookwork-demo.com/default-avatar.png',
    joinedDate: '2023-01-25T12:00:00.000Z',
    booksRead: 10,
    isActive: true,
    createdAt: '2023-01-25T12:00:00.000Z',
    joinDate: '2023-01-25T12:00:00.000Z',
    status: 'active',
    permissions: [],
    clubRole: 'moderator'
  },
  {
    id: 'a8a6h7i8-9d0e-1234-5678-901234abcdef',
    name: 'Hester Del Checolo',
    email: 'hdeln@jimdo.com',
    phone: '(555) 678-9012',
    role: 'admin',
    avatar: 'https://www.bookwork-demo.com/default-avatar.png',
    joinedDate: '2023-05-10T12:00:00.000Z',
    booksRead: 86819,
    isActive: true,
    createdAt: '2023-05-10T12:00:00.000Z',
    joinDate: '2023-05-10T12:00:00.000Z',
    status: 'active',
    permissions: [],
    clubRole: 'admin'
  },
  {
    id: 'b9b7i8j9-0e1f-2345-6789-012345abcdef',
    name: 'Demo User',
    email: 'demo@bookwork.com',
    phone: '(555) 789-0123',
    role: 'moderator',
    avatar: 'https://www.bookwork-demo.com/default-avatar.png',
    joinedDate: '2023-06-15T12:00:00.000Z',
    booksRead: 1000,
    isActive: true,
    createdAt: '2023-06-15T12:00:00.000Z',
    joinDate: '2023-06-15T12:00:00.000Z',
    status: 'active',
    permissions: [],
    clubRole: 'moderator'
  },
  {
    id: 'c1c2d3e4-5f6a-7890-1234-567890abcdef',
    name: 'Billye Mudie',
    email: 'bmudiel@alexa.com',
    phone: '(555) 890-1234',
    role: 'member',
    avatar: 'https://www.bookwork-demo.com/default-avatar.png',
    joinedDate: '2023-07-20T12:00:00.000Z',
    booksRead: 6,
    isActive: true,
    createdAt: '2023-07-20T12:00:00.000Z',
    joinDate: '2023-07-20T12:00:00.000Z',
    status: 'active',
    permissions: [],
    clubRole: 'member'
  },
  {
    id: 'd2d3e4f5-6a7b-8901-2345-678901abcdef',
    name: 'Colline Dorkins',
    email: 'cdorkinsm@mac.com',
    phone: '(555) 901-2345',
    role: 'member',
    avatar: 'https://www.bookwork-demo.com/default-avatar.png',
    joinedDate: '2023-08-25T12:00:00.000Z',
    booksRead: 95,
    isActive: true,
    createdAt: '2023-08-25T12:00:00.000Z',
    joinDate: '2023-08-25T12:00:00.000Z',
    status: 'active',
    permissions: [],
    clubRole: 'member'
  },
  {
    id: 'e3e4f5g6-7b8c-9012-3456-789012abcdef',
    name: 'Vance Beauchamp',
    email: 'vbeauchampk@google.es',
    phone: '(555) 012-3456',
    role: 'member',
    avatar: 'https://www.bookwork-demo.com/default-avatar.png',
    joinedDate: '2023-09-30T12:00:00.000Z',
    booksRead: 50,
    isActive: true,
    createdAt: '2023-09-30T12:00:00.000Z',
    joinDate: '2023-09-30T12:00:00.000Z',
    status: 'active',
    permissions: [],
    clubRole: 'member'
  }
];

// Mock Club with members
export const MockClubMembersByClub: Record<string, ClubMember[]> = {
    'club-1': [
        {
            id: 'b3b1c2d3-4e5f-6789-0123-456789abcdef',
            name: 'John Doe',
            email: 'johndoe@example.com',
            phone: '(111)111-1111',
            role: 'member',
            avatar: 'https://www.bookwork-demo.com/default-avatar.png',
            joinedDate: '2024-01-01T12:00:00.000Z',
            booksRead: 5,
            isActive: true,
            createdAt: '2024-01-01T12:00:00.000Z',
            joinDate: '2024-01-01T12:00:00.000Z',
            status: 'active',
            permissions: [],
            clubRole: 'member'
        },
        {
            id: 'c4c2d3e4-5f6a-7890-1234-567890abcdef',
            name: 'Jane Smith',
            email: 'janesmith@example.com',
            phone: '(111)111-1111',
            role: 'member',
            avatar: 'https://www.bookwork-demo.com/default-avatar.png',
            joinedDate: '2024-01-02T12:00:00.000Z',
            booksRead: 10,
            isActive: true,
            createdAt: '2024-01-02T12:00:00.000Z',
            joinDate: '2024-01-02T12:00:00.000Z',
            status: 'active',
            permissions: [],
            clubRole: 'member'
        },
        {
            id: 'd5d3e4f5-6a7b-8901-2345-678901abcdef',
            name: 'Vance Beauchamp',
            email: 'vbeauchampk@google.es',
            phone: '(111)111-1111',
            role: 'member',
            avatar: 'https://www.bookwork-demo.com/default-avatar.png',
            joinedDate: '2024-09-02T12:00:00.000Z',
            booksRead: 50,
            isActive: true,
            createdAt: '2024-09-02T12:00:00.000Z',
            joinDate: '2024-09-02T12:00:00.000Z',
            status: 'active',
            permissions: [],
            clubRole: 'member'
        },
        {
            id: 'e6e4f5g6-7b8c-9012-3456-789012abcdef',
            name: 'Billye Mudie',
            email: 'bmudiel@alexa.com',
            phone: '(111)111-1111',
            role: 'member',
            avatar: 'https://www.bookwork-demo.com/default-avatar.png',
            joinedDate: '2025-02-27T12:00:00.000Z',
            booksRead: 6,
            isActive: true,
            createdAt: '2025-02-27T12:00:00.000Z',
            joinDate: '2025-02-27T12:00:00.000Z',
            status: 'active',
            permissions: [],
            clubRole: 'member'
        },
        {
            id: 'f7f5g6h7-8c9d-0123-4567-890123abcdef',
            name: 'Colline Dorkins',
            email: 'cdorkinsm@mac.com',
            phone: '(111)111-1111',
            role: 'member',
            avatar: 'https://www.bookwork-demo.com/default-avatar.png',
            joinedDate: '2024-12-23T12:00:00.000Z',
            booksRead: 95,
            isActive: true,
            createdAt: '2024-12-23T12:00:00.000Z',
            joinDate: '2024-12-23T12:00:00.000Z',
            status: 'active',
            permissions: [],
            clubRole: 'member'
        },
        {
            id: 'a8a6h7i8-9d0e-1234-5678-901234abcdef',
            name: 'Hester Del Checolo',
            email: 'hdeln@jimdo.com',
            phone: '(111)111-1111',
            role: 'admin',
            avatar: 'https://www.bookwork-demo.com/default-avatar.png',
            joinedDate: '2024-11-28T12:00:00.000Z',
            booksRead: 86819,
            isActive: true,
            createdAt: '2024-11-28T12:00:00.000Z',
            joinDate: '2024-11-28T12:00:00.000Z',
            status: 'active',
            permissions: [],
            clubRole: 'admin'
        },
        {
            id: 'b9b7i8j9-0e1f-2345-6789-012345abcdef',
            name: 'Demo User',
            email: 'demo@bookwork.com',
            phone: '(111)111-1111',
            role: 'moderator',
            avatar: 'https://www.bookwork-demo.com/default-avatar.png',
            joinedDate: '2025-04-16T12:00:00.000Z',
            booksRead: 1000,
            isActive: true,
            createdAt: '2025-04-16T12:00:00.000Z',
            joinDate: '2025-04-16T12:00:00.000Z',
            status: 'active',
            permissions: [],
            clubRole: 'moderator'
        }
    ]
};

// Helper to safely get club members by club ID (returns [] if not found)
export function getMockClubMembersByClubId(clubId: string): ClubMember[] {
  return MockClubMembersByClub[clubId] || [];
}

// Mock schedule events data
export const mockScheduleEvents: (ScheduleEvent & { book?: string; attendees: string[] })[] = [
  {
    id: 'event-1',
    title: 'Monthly Book Discussion',
    date: '2025-07-25',
    time: '19:00',
    location: 'Central Library - Meeting Room A',
    type: 'discussion',
    book: 'The Seven Husbands of Evelyn Hugo',
    description: 'Our monthly discussion of this captivating novel about a reclusive Hollywood icon.',
    attendees: [
      'b3b1c2d3-4e5f-6789-0123-456789abcdef',
      'c4c2d3e4-5f6a-7890-1234-567890abcdef',
      'd5d3e4f5-6a7b-8901-2345-678901abcdef',
      'e6e4f5g6-7b8c-9012-3456-789012abcdef'
    ]
  },
  {
    id: 'event-2',
    title: 'Book Selection Meeting',
    date: '2025-08-08',
    time: '18:30',
    location: 'Coffee Corner Café',
    type: 'meeting',
    book: '',
    description: 'Choose our next book and discuss reading timeline.',
    attendees: [
      'b3b1c2d3-4e5f-6789-0123-456789abcdef',
      'c4c2d3e4-5f6a-7890-1234-567890abcdef',
      'f7f5g6h7-8c9d-0123-4567-890123abcdef'
    ]
  },
  {
    id: 'event-3',
    title: 'Author Meet & Greet',
    date: '2025-08-15',
    time: '15:00',
    location: 'Downtown Bookstore',
    type: 'social',
    book: 'The Thursday Murder Club',
    description: 'Special event with local author discussing mystery writing.',
    attendees: [
      'b3b1c2d3-4e5f-6789-0123-456789abcdef',
      'c4c2d3e4-5f6a-7890-1234-567890abcdef',
      'd5d3e4f5-6a7b-8901-2345-678901abcdef',
      'e6e4f5g6-7b8c-9012-3456-789012abcdef',
      'f7f5g6h7-8c9d-0123-4567-890123abcdef'
    ]
  }
];

// Extended EventItem interface for mock data
interface MockEventItem extends Omit<EventItem, 'status'> {
  status: 'assigned' | 'confirmed' | 'pending';
  notes: string;
}

// Mock event items data
export const mockEventItems: Record<string, MockEventItem[]> = {
  'event-1': [
    {
      id: 'item-1',
      name: 'Discussion Questions',
      category: 'Discussion Material',
      assignedTo: 'b3b1c2d3-4e5f-6789-0123-456789abcdef',
      status: 'assigned',
      notes: 'Prepare 5-7 thought-provoking questions'
    },
    {
      id: 'item-2',
      name: 'Refreshments',
      category: 'Food & Drink',
      assignedTo: 'c4c2d3e4-5f6a-7890-1234-567890abcdef',
      status: 'confirmed',
      notes: 'Light snacks and coffee'
    },
    {
      id: 'item-3',
      name: 'Book Copies',
      category: 'Materials',
      assignedTo: 'd5d3e4f5-6a7b-8901-2345-678901abcdef',
      status: 'pending',
      notes: 'Extra copies for new members'
    }
  ],
  'event-2': [
    {
      id: 'item-4',
      name: 'Book Suggestions List',
      category: 'Discussion Material',
      assignedTo: 'b3b1c2d3-4e5f-6789-0123-456789abcdef',
      status: 'assigned',
      notes: 'Compiled list of member suggestions'
    },
    {
      id: 'item-5',
      name: 'Venue Reservation',
      category: 'Logistics',
      assignedTo: 'f7f5g6h7-8c9d-0123-4567-890123abcdef',
      status: 'confirmed',
      notes: 'Table for 6 people reserved'
    }
  ],
  'event-3': [
    {
      id: 'item-6',
      name: 'Author Introduction',
      category: 'Presentation',
      assignedTo: 'b3b1c2d3-4e5f-6789-0123-456789abcdef',
      status: 'assigned',
      notes: 'Prepare bio and introduction speech'
    },
    {
      id: 'item-7',
      name: 'Book Signing Materials',
      category: 'Materials',
      assignedTo: 'e6e4f5g6-7b8c-9012-3456-789012abcdef',
      status: 'pending',
      notes: 'Pens and bookmarks for signing'
    }
  ]
};

// Mock meeting availability data
export const mockMeetingAvailability: Record<string, Record<string, 'available' | 'maybe' | 'unavailable'>> = {
  'event-1': {
    'b3b1c2d3-4e5f-6789-0123-456789abcdef': 'available',
    'c4c2d3e4-5f6a-7890-1234-567890abcdef': 'available',
    'd5d3e4f5-6a7b-8901-2345-678901abcdef': 'available',
    'e6e4f5g6-7b8c-9012-3456-789012abcdef': 'maybe',
    'f7f5g6h7-8c9d-0123-4567-890123abcdef': 'unavailable'
  },
  'event-2': {
    'b3b1c2d3-4e5f-6789-0123-456789abcdef': 'available',
    'c4c2d3e4-5f6a-7890-1234-567890abcdef': 'available',
    'd5d3e4f5-6a7b-8901-2345-678901abcdef': 'unavailable',
    'e6e4f5g6-7b8c-9012-3456-789012abcdef': 'maybe',
    'f7f5g6h7-8c9d-0123-4567-890123abcdef': 'available'
  },
  'event-3': {
    'b3b1c2d3-4e5f-6789-0123-456789abcdef': 'available',
    'c4c2d3e4-5f6a-7890-1234-567890abcdef': 'available',
    'd5d3e4f5-6a7b-8901-2345-678901abcdef': 'available',
    'e6e4f5g6-7b8c-9012-3456-789012abcdef': 'available',
    'f7f5g6h7-8c9d-0123-4567-890123abcdef': 'available'
  }
};

// Mock user clubs data
export const mockUserClubs: (Club & { isOwner: boolean })[] = [
  {
    id: 'club-1',
    name: 'Downtown Book Club',
    description: 'A friendly neighborhood book club meeting every Tuesday',
    memberCount: 7,
    createdAt: '2023-01-01',
    isOwner: true
  }
];

// Mock user data for authentication
export const mockUser = {
  id: 'user-1',
  name: 'Demo User',
  email: 'demo@bookwork.com',
  role: 'Club Lead',
  avatar: '/default-avatar.png'
};

// Mock website builder modules
export const mockBuilderModules = [
  {
    id: 'hero-1',
    name: 'Hero Section',
    description: 'Eye-catching header with title and call-to-action',
    component: 'HeroModule',
    category: 'Headers',
    settings: {
      title: 'Welcome to Our Book Club',
      subtitle: 'Join passionate readers in meaningful discussions',
      buttonText: 'Join Now',
      backgroundImage: '/hero-bg.jpg'
    }
  },
  {
    id: 'about-1',
    name: 'About Section',
    description: 'Information about your book club',
    component: 'AboutModule',
    category: 'Content',
    settings: {
      title: 'About Our Club',
      content: 'We are a diverse group of book lovers who meet monthly to discuss our latest reads.',
      image: '/about-image.jpg'
    }
  },
  {
    id: 'events-1',
    name: 'Upcoming Events',
    description: 'Display upcoming book club events',
    component: 'EventsModule',
    category: 'Content',
    settings: {
      title: 'Upcoming Events',
      showLimit: 3,
      includeLocation: true,
      includeDescription: true
    }
  }
];

// Mock chat messages
export const mockChatMessages = [
  {
    id: 'msg-1',
    message: 'Hello! How can I help you today?',
    sender: 'support' as const,
    timestamp: new Date().toISOString()
  }
];

// Mock notifications
export const mockNotifications = [
  {
    id: 'notif-1',
    type: 'info' as const,
    title: 'Welcome to BookWork!',
    message: 'Thanks for joining our community of readers.',
    timestamp: new Date().toISOString(),
    read: false
  },
  {
    id: 'notif-2',
    type: 'success' as const,
    title: 'Profile Updated',
    message: 'Your profile information has been successfully updated.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true
  }
];

// Helper function to get mock data based on environment
export function getMockData<T>(data: T): T {
  // Use safe environment detection that works with both Vite and standard TypeScript
  if (import.meta.env?.MODE === 'development' || process.env.NODE_ENV === 'development') {
    return data;
  }
  return {} as T;
}

// Export all mock data in a single object for easy access
export const mockData = {
  clubMembers: mockClubMembers,
  scheduleEvents: mockScheduleEvents,
  eventItems: mockEventItems,
  meetingAvailability: mockMeetingAvailability,
  userClubs: mockUserClubs,
  user: mockUser,
  builderModules: mockBuilderModules,
  chatMessages: mockChatMessages,
  notifications: mockNotifications
};


