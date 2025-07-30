/**
 * Centralized mock data for development mode
 * TypeScript version with proper type definitions
 */

import type { ClubMember, ScheduleEvent, EventItem, MeetingAvailability, Club } from './stores.ts';

// Mock club members data
export const mockClubMembers: ClubMember[] = [
	{
		id: '1',
		name: 'John Doe',
		email: 'john@example.com',
		phone: '(555) 123-4567',
		role: 'Club Lead',
		avatar: '/default-avatar.png',
		joinedDate: '2023-01-15',
		booksRead: 12
	},
	{
		id: '2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		phone: '(555) 234-5678',
		role: 'Member',
		avatar: '/default-avatar.png',
		joinedDate: '2023-02-20',
		booksRead: 8
	},
	{
		id: '3',
		name: 'Mike Johnson',
		email: 'mike@example.com',
		phone: '(555) 345-6789',
		role: 'Member',
		avatar: '/default-avatar.png',
		joinedDate: '2023-03-10',
		booksRead: 15
	},
	{
		id: '4',
		name: 'Sarah Wilson',
		email: 'sarah@example.com',
		phone: '(555) 456-7890',
		role: 'Member',
		avatar: '/default-avatar.png',
		joinedDate: '2023-04-05',
		booksRead: 6
	},
	{
		id: '5',
		name: 'David Brown',
		email: 'david@example.com',
		phone: '(555) 567-8901',
		role: 'Co-Lead',
		avatar: '/default-avatar.png',
		joinedDate: '2023-01-25',
		booksRead: 10
	},
	{
    id: '6',
    name: 'Del Lease',
    email: 'dlease5@de.vu',
    phone: '(111)111-1111',
    role: 'Member',
    avatar: '/default-avatar.png',
    joinedDate: '2025-02-15',
    booksRead: 7
  },
  {
    id: '7',
    name: 'Brittan Ciobutaro',
    email: 'bciobutaro6@yahoo.co.jp',
    phone: '(111)111-1111',
    role: 'Club Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-05-11',
    booksRead: 63924
  },
  {
    id: '8',
    name: 'Barbette Renzullo',
    email: 'brenzullo7@com.com',
    phone: '(111)111-1111',
    role: 'Co-Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-10-13',
    booksRead: 24
  },
  {
    id: '9',
    name: 'Bonnie Littrell',
    email: 'blittrell8@purevolume.com',
    phone: '(111)111-1111',
    role: 'Club Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2025-04-29',
    booksRead: 6780
  },
  {
    id: '10',
    name: 'Shawn Chatel',
    email: 'schatel9@jiathis.com',
    phone: '(111)111-1111',
    role: 'Member',
    avatar: '/default-avatar.png',
    joinedDate: '2025-04-18',
    booksRead: 13
  },
  {
    id: '11',
    name: 'Emmott Wigzell',
    email: 'ewigzella@baidu.com',
    phone: '(111)111-1111',
    role: 'Co-Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-11-30',
    booksRead: 42
  },
  {
    id: '12',
    name: 'Nicolais Kershow',
    email: 'nkershowb@jigsy.com',
    phone: '(111)111-1111',
    role: 'Club Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-07-21',
    booksRead: 41
  },
  {
    id: '13',
    name: 'Edee Howbrook',
    email: 'ehowbrookc@google.fr',
    phone: '(111)111-1111',
    role: 'Co-Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-09-24',
    booksRead: 70108
  },
  {
    id: '14',
    name: 'Julie Drewell',
    email: 'jdrewelld@unblog.fr',
    phone: '(111)111-1111',
    role: 'Club Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2025-07-16',
    booksRead: 8566
  },
  {
    id: '15',
    name: 'Phylys Sympson',
    email: 'psympsone@github.com',
    phone: '(111)111-1111',
    role: 'Member',
    avatar: '/default-avatar.png',
    joinedDate: '2025-06-04',
    booksRead: 4842
  },
  {
    id: '16',
    name: 'Roobbie Anfossi',
    email: 'ranfossif@ameblo.jp',
    phone: '(111)111-1111',
    role: 'Member',
    avatar: '/default-avatar.png',
    joinedDate: '2025-02-24',
    booksRead: 3
  },
  {
    id: '17',
    name: 'Corina Grieves',
    email: 'cgrievesg@cnet.com',
    phone: '(111)111-1111',
    role: 'Club Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2025-02-08',
    booksRead: 4
  },
  {
    id: '18',
    name: 'Rachael Ellum',
    email: 'rellumh@cbslocal.com',
    phone: '(111)111-1111',
    role: 'Member',
    avatar: '/default-avatar.png',
    joinedDate: '2024-10-15',
    booksRead: 9341
  },
  {
    id: '19',
    name: 'Kevan Rosin',
    email: 'krosini@gravatar.com',
    phone: '(111)111-1111',
    role: 'Co-Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-10-14',
    booksRead: 0
  },
  {
    id: '20',
    name: 'Dyanne Whaley',
    email: 'dwhaleyj@spiegel.de',
    phone: '(111)111-1111',
    role: 'Co-Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-07-06',
    booksRead: 82695
  },
  {
    id: '21',
    name: 'Vance Beauchamp',
    email: 'vbeauchampk@google.es',
    phone: '(111)111-1111',
    role: 'Member',
    avatar: '/default-avatar.png',
    joinedDate: '2024-09-02',
    booksRead: 50
  },
  {
    id: '22',
    name: 'Billye Mudie',
    email: 'bmudiel@alexa.com',
    phone: '(111)111-1111',
    role: 'Member',
    avatar: '/default-avatar.png',
    joinedDate: '2025-02-27',
    booksRead: 6
  },
  {
    id: '23',
    name: 'Colline Dorkins',
    email: 'cdorkinsm@mac.com',
    phone: '(111)111-1111',
    role: 'Member',
    avatar: '/default-avatar.png',
    joinedDate: '2024-12-23',
    booksRead: 95
  },
  {
    id: '24',
    name: 'Hester Del Checolo',
    email: 'hdeln@jimdo.com',
    phone: '(111)111-1111',
    role: 'Club Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-11-28',
    booksRead: 86819
  },
  {
    id: '25',
    name: 'Fleurette Brownlow',
    email: 'fbrownlowo@miitbeian.gov.cn',
    phone: '(111)111-1111',
    role: 'Co-Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2025-01-07',
    booksRead: 256
  },
  {
    id: '26',
    name: 'Rowe Harbidge',
    email: 'rharbidgep@printfriendly.com',
    phone: '(111)111-1111',
    role: 'Club Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-10-27',
    booksRead: 658
  },
  {
    id: '27',
    name: 'Linn Ledbury',
    email: 'lledburyq@w3.org',
    phone: '(111)111-1111',
    role: 'Member',
    avatar: '/default-avatar.png',
    joinedDate: '2024-11-05',
    booksRead: 33498
  },
  {
    id: '28',
    name: 'Maggee O\'Kennedy',
    email: 'mokennedyr@creativecommons.org',
    phone: '(111)111-1111',
    role: 'Co-Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-12-05',
    booksRead: 23216
  },
  {
    id: '29',
    name: 'Floris Aplin',
    email: 'faplins@eepurl.com',
    phone: '(111)111-1111',
    role: 'Co-Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-08-27',
    booksRead: 0
  },
  {
    id: '30',
    name: 'Ilene Ellacombe',
    email: 'iellacombet@livejournal.com',
    phone: '(111)111-1111',
    role: 'Member',
    avatar: '/default-avatar.png',
    joinedDate: '2025-01-25',
    booksRead: 656
  },
  {
    id: '31',
    name: 'Lorilee Tolworth',
    email: 'ltolworthu@skype.com',
    phone: '(111)111-1111',
    role: 'Club Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-08-25',
    booksRead: 5671
  },
  {
    id: '32',
    name: 'Annetta Pietraszek',
    email: 'apietraszekv@pen.io',
    phone: '(111)111-1111',
    role: 'Club Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2025-05-26',
    booksRead: 7237
  },
  {
    id: '33',
    name: 'Arden Scottrell',
    email: 'ascottrellw@xing.com',
    phone: '(111)111-1111',
    role: 'Club Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-10-11',
    booksRead: 93409
  },
  {
    id: '34',
    name: 'Yorgo Knowles',
    email: 'yknowlesx@linkedin.com',
    phone: '(111)111-1111',
    role: 'Member',
    avatar: '/default-avatar.png',
    joinedDate: '2024-09-26',
    booksRead: 287
  },
  {
    id: '35',
    name: 'Sherrie Sharple',
    email: 'ssharpley@discuz.net',
    phone: '(111)111-1111',
    role: 'Club Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-05-09',
    booksRead: 7513
  },
  {
    id: '36',
    name: 'Reese Height',
    email: 'rheightz@dailymotion.com',
    phone: '(111)111-1111',
    role: 'Member',
    avatar: '/default-avatar.png',
    joinedDate: '2024-09-07',
    booksRead: 44303
  },
  {
    id: '37',
    name: 'Hewitt Tuting',
    email: 'htuting10@addthis.com',
    phone: '(111)111-1111',
    role: 'Club Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2025-07-04',
    booksRead: 0
  },
  {
    id: '38',
    name: 'Ella Peach',
    email: 'epeach11@jiathis.com',
    phone: '(111)111-1111',
    role: 'Co-Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2024-12-18',
    booksRead: 5
  },
  {
    id: '39',
    name: 'Den Fergie',
    email: 'dfergie12@bloomberg.com',
    phone: '(111)111-1111',
    role: 'Co-Lead',
    avatar: '/default-avatar.png',
    joinedDate: '2025-05-17',
    booksRead: 1980
  },
  {
    id: '40',
    name: 'Estell Benyon',
    email: 'ebenyon13@nature.com',
    phone: '(111)111-1111',
    role: 'Member',
    avatar: '/default-avatar.png',
    joinedDate: '2025-04-16',
    booksRead: 29
  },
  {
	id: '41',
	name: 'Demo User',
	email: 'demo@bookwork.com',
	phone: '(111)111-1111',
	role: 'Co-Lead',
	avatar: '/default-avatar.png',
	joinedDate: '2025-04-16',
	booksRead: 1000
  }
];

//Mock Club with members
export const MockClubMembersByClub: Record<string, ClubMember[]> = {
	'club-1': [
		{
			id: '1',
			name: 'John Doe',
			email: 'johndoe@example.com',
			phone: '(111)111-1111',
			role: 'Member',
			avatar: '/default-avatar.png',
			joinedDate: '2024-01-01',
			booksRead: 5
		},
		{
			id: '2',
			name: 'Jane Smith',
			email: 'janesmith@example.com',
			phone: '(111)111-1111',
			role: 'Member',
			avatar: '/default-avatar.png',
			joinedDate: '2024-01-02',
			booksRead: 10
		},
		{
    		id: '21',
    		name: 'Vance Beauchamp',
   			email: 'vbeauchampk@google.es',
    		phone: '(111)111-1111',
    		role: 'Member',
    		avatar: '/default-avatar.png',
    		joinedDate: '2024-09-02',
    		booksRead: 50
		},
		{
			id: '22',
			name: 'Billye Mudie',
			email: 'bmudiel@alexa.com',
			phone: '(111)111-1111',
			role: 'Member',
			avatar: '/default-avatar.png',
			joinedDate: '2025-02-27',
			booksRead: 6
		},
		{
			id: '23',
			name: 'Colline Dorkins',
			email: 'cdorkinsm@mac.com',
			phone: '(111)111-1111',
			role: 'Member',
			avatar: '/default-avatar.png',
			joinedDate: '2024-12-23',
			booksRead: 95
		},
		{
			id: '24',
			name: 'Hester Del Checolo',
			email: 'hdeln@jimdo.com',
			phone: '(111)111-1111',
			role: 'Club Lead',
			avatar: '/default-avatar.png',
			joinedDate: '2024-11-28',
			booksRead: 86819
		},
		{
			id: '41',
			name: 'Demo User',
			email: 'demo@bookwork.com',
			phone: '(111)111-1111',
			role: 'Co-Lead',
			avatar: '/default-avatar.png',
			joinedDate: '2025-04-16',
			booksRead: 1000
		}
		
	]
};

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
		attendees: ['1', '2', '3', '4']
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
		attendees: ['1', '2', '5']
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
		attendees: ['1', '2', '3', '4', '5']
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
			assignedTo: '1',
			status: 'assigned',
			notes: 'Prepare 5-7 thought-provoking questions'
		},
		{
			id: 'item-2',
			name: 'Refreshments',
			category: 'Food & Drink',
			assignedTo: '2',
			status: 'confirmed',
			notes: 'Light snacks and coffee'
		},
		{
			id: 'item-3',
			name: 'Book Copies',
			category: 'Materials',
			assignedTo: '3',
			status: 'pending',
			notes: 'Extra copies for new members'
		}
	],
	'event-2': [
		{
			id: 'item-4',
			name: 'Book Suggestions List',
			category: 'Discussion Material',
			assignedTo: '1',
			status: 'assigned',
			notes: 'Compiled list of member suggestions'
		},
		{
			id: 'item-5',
			name: 'Venue Reservation',
			category: 'Logistics',
			assignedTo: '5',
			status: 'confirmed',
			notes: 'Table for 6 people reserved'
		}
	],
	'event-3': [
		{
			id: 'item-6',
			name: 'Author Introduction',
			category: 'Presentation',
			assignedTo: '1',
			status: 'assigned',
			notes: 'Prepare bio and introduction speech'
		},
		{
			id: 'item-7',
			name: 'Book Signing Materials',
			category: 'Materials',
			assignedTo: '4',
			status: 'pending',
			notes: 'Pens and bookmarks for signing'
		}
	]
};

// Mock meeting availability data
export const mockMeetingAvailability: Record<string, Record<string, 'available' | 'maybe' | 'unavailable'>> = {
	'event-1': {
		'1': 'available',
		'2': 'available', 
		'3': 'available',
		'4': 'maybe',
		'5': 'unavailable'
	},
	'event-2': {
		'1': 'available',
		'2': 'available',
		'3': 'unavailable',
		'4': 'maybe',
		'5': 'available'
	},
	'event-3': {
		'1': 'available',
		'2': 'available',
		'3': 'available', 
		'4': 'available',
		'5': 'available'
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
	name: 'John Doe',
	email: 'john@example.com',
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


