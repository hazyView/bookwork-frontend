// Centralized mock data for development mode
export const mockClubMembers = [
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
	}
];

export const mockScheduleEvents = [
	{
		id: 'event-1',
		title: 'Monthly Book Discussion',
		date: '2025-07-25',
		time: '19:00',
		location: 'Central Library - Meeting Room A',
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
		book: 'The Thursday Murder Club',
		description: 'Special event with local author discussing mystery writing.',
		attendees: ['1', '2', '3', '4', '5']
	}
];

export const mockEventItems = {
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

export const mockMeetingAvailability = {
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

export const mockUserClubs = [
	{
		id: 'club-1',
		name: 'Downtown Book Club',
		description: 'A friendly neighborhood book club meeting every Tuesday',
		memberCount: 5,
		isOwner: true
	}
];
