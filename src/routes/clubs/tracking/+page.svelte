<script>
	import { onMount } from 'svelte';
	import { scheduleEvents, eventItems, user } from '$lib/stores.js';
	import { addEventItem, fetchEventItems, fetchScheduleEvents } from '$lib/api.js';
	import { isDuplicateItem, formatDate, formatTime } from '$lib/utils.js';
	import { Calendar, Clock, MapPin, Plus, AlertCircle, Package, Trash2, User } from 'lucide-svelte';

	let selectedEventId = '';
	let newItemName = '';
	let newItemBringer = '';
	let loading = false;
	let error = null;
	let duplicateWarning = '';
	let formErrors = {};

	onMount(async () => {
		try {
			// Load events from centralized data source
			if ($scheduleEvents.length === 0) {
				const events = await fetchScheduleEvents('club-1');
				scheduleEvents.set(events);
			}

			// Initialize event items using API
			const items = {};
			for (const event of $scheduleEvents) {
				try {
					const eventItemsData = await fetchEventItems(event.id);
					items[event.id] = eventItemsData.map(item => ({
						id: item.id,
						name: item.name,
						bringer: { 
							id: item.assignedTo, 
							name: getMemberName(item.assignedTo) 
						},
						addedAt: new Date().toISOString(),
						status: item.status,
						category: item.category,
						notes: item.notes
					}));
				} catch (err) {
					console.warn(`Failed to load items for event ${event.id}:`, err);
					items[event.id] = [];
				}
			}
			eventItems.set(items);

			// Auto-select the first upcoming event
			const upcomingEvents = getUpcomingEvents();
			if (upcomingEvents.length > 0) {
				selectedEventId = upcomingEvents[0].id;
			}
		} catch (err) {
			error = 'Failed to load event data';
			console.error('Error loading tracking data:', err);
		}
	});

	function getMemberName(userId) {
		// Simple mapping for demo purposes
		const memberNames = {
			'1': 'John Doe',
			'2': 'Jane Smith',
			'3': 'Mike Johnson',
			'4': 'Sarah Wilson',
			'5': 'David Brown'
		};
		return memberNames[userId] || 'Unknown Member';
	}

	function validateItemForm() {
		const errors = {};
		
		if (!newItemName?.trim()) {
			errors.name = 'Item name is required';
		} else if (newItemName.length > 100) {
			errors.name = 'Item name must be less than 100 characters';
		}
		
		if (!newItemBringer?.trim()) {
			errors.bringer = 'Please specify who will bring this item';
		}
		
		return errors;
	}

	function getUpcomingEvents() {
		const now = new Date();
		return $scheduleEvents
			.filter(event => new Date(event.date) >= now)
			.sort((a, b) => new Date(a.date) - new Date(b.date));
	}

	function getSelectedEvent() {
		return $scheduleEvents.find(event => event.id === selectedEventId);
	}

	function getItemsForEvent(eventId) {
		return $eventItems[eventId] || [];
	}

	function checkForDuplicate() {
		if (!newItemName.trim() || !selectedEventId) {
			duplicateWarning = '';
			return;
		}

		const items = getItemsForEvent(selectedEventId);
		const isDupe = isDuplicateItem(items.map(item => ({ name: item.name })), newItemName.trim());
		
		if (isDupe) {
			duplicateWarning = `"${newItemName.trim()}" is already on the list!`;
		} else {
			duplicateWarning = '';
		}
	}

	async function addItem() {
		formErrors = validateItemForm();
		
		if (Object.keys(formErrors).length > 0) {
			return;
		}

		if (!selectedEventId) {
			error = 'Please select an event first';
			return;
		}

		// Check for duplicates before adding
		const items = getItemsForEvent(selectedEventId);
		if (isDuplicateItem(items.map(item => ({ name: item.name })), newItemName.trim())) {
			formErrors.name = 'This item is already on the list. Please choose a different item.';
			return;
		}

		loading = true;
		error = null;

		try {
			const newItem = {
				name: newItemName.trim(),
				category: 'Other',
				assignedTo: $user.id,
				notes: `Brought by: ${newItemBringer.trim() || $user.name}`
			};

			const addedItem = await addEventItem(selectedEventId, newItem);

			// Update local state with the new item
			eventItems.update(items => ({
				...items,
				[selectedEventId]: [...(items[selectedEventId] || []), {
					id: addedItem.id,
					name: addedItem.name,
					bringer: { 
						id: $user.id, 
						name: newItemBringer.trim() || $user.name 
					},
					addedAt: new Date().toISOString(),
					status: addedItem.status,
					category: addedItem.category,
					notes: addedItem.notes
				}]
			}));

			// Reset form
			newItemName = '';
			newItemBringer = '';
			duplicateWarning = '';
			formErrors = {};
		} catch (err) {
			error = `Failed to add item: ${err.message}`;
		} finally {
			loading = false;
		}
	}

	async function removeItem(eventId, itemId) {
		const item = getItemsForEvent(eventId).find(i => i.id === itemId);
		if (!item || item.bringer.id !== $user.id) return;

		loading = true;
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 300));

			eventItems.update(items => ({
				...items,
				[eventId]: items[eventId].filter(i => i.id !== itemId)
			}));
		} catch (err) {
			error = `Failed to remove item: ${err.message}`;
		} finally {
			loading = false;
		}
	}

	// Reactive statement to check for duplicates as user types
	$: if (newItemName) {
		checkForDuplicate();
	}
</script>

<svelte:head>
	<title>Event Item Tracker - BookWorm</title>
</svelte:head>

<div class="container">
	<div class="page-header">
		<h1 class="page-title">Event Item Tracker</h1>
		<p class="page-subtitle">Coordinate what to bring to club meetings</p>
	</div>

	{#if error}
		<div class="alert alert-error">
			<p>{error}</p>
		</div>
	{/if}

	<!-- Event Selection -->
	<div class="event-selector card">
		<div class="card-header">
			<h2>Select Event</h2>
		</div>
		<div class="card-body">
			{#if getUpcomingEvents().length === 0}
				<div class="no-events">
					<Calendar size={24} />
					<p>No upcoming events found. <a href="/clubs/schedule">View schedule</a> to see all events.</p>
				</div>
			{:else}
				<div class="event-select-group">
					<label class="form-label" for="event-select">Choose an event:</label>
					<select 
						id="event-select"
						class="form-select" 
						bind:value={selectedEventId}
					>
						<option value="">Select an event...</option>
						{#each getUpcomingEvents() as event (event.id)}
							<option value={event.id}>
								{event.title} - {formatDate(event.date)}
							</option>
						{/each}
					</select>
				</div>
			{/if}
		</div>
	</div>

	<!-- Selected Event Details & Items -->
	{#if selectedEventId && getSelectedEvent()}
		{@const selectedEvent = getSelectedEvent()}
		{@const eventItemsList = getItemsForEvent(selectedEventId)}

		<div class="selected-event card">
			<div class="card-header">
				<h2>{selectedEvent.title}</h2>
			</div>
			<div class="card-body">
				<div class="event-details">
					<div class="detail-item">
						<Calendar size={16} />
						<span>{formatDate(selectedEvent.date)} at {formatTime(new Date(`${selectedEvent.date}T${selectedEvent.time}`))}</span>
					</div>
					{#if selectedEvent.location}
						<div class="detail-item">
							<MapPin size={16} />
							<span>{selectedEvent.location}</span>
						</div>
					{/if}
				</div>
				{#if selectedEvent.description}
					<p class="event-description">{selectedEvent.description}</p>
				{/if}
			</div>
		</div>

		<!-- Add New Item -->
		<div class="add-item-section card">
			<div class="card-header">
				<h3>Add Item to Bring</h3>
			</div>
			<div class="card-body">
				<form on:submit|preventDefault={addItem} class="add-item-form">
					<div class="form-row">
						<div class="form-group">
							<label class="form-label" for="item-name">What will you bring? *</label>
							<input 
								type="text" 
								id="item-name"
								class="form-input"
								class:error={duplicateWarning || formErrors.name}
								bind:value={newItemName}
								placeholder="e.g., snacks, drinks, discussion questions..."
								required
							>
							{#if formErrors.name}
								<span class="form-error">{formErrors.name}</span>
							{:else if duplicateWarning}
								<div class="duplicate-warning">
									<AlertCircle size={16} />
									<span>{duplicateWarning}</span>
								</div>
							{/if}
						</div>
						<div class="form-group">
							<label class="form-label" for="item-bringer">Your name (optional)</label>
							<input 
								type="text" 
								id="item-bringer"
								class="form-input"
								class:error={formErrors.bringer}
								bind:value={newItemBringer}
								placeholder="Who will bring this item?"
							>
							{#if formErrors.bringer}
								<span class="form-error">{formErrors.bringer}</span>
							{/if}
						</div>
					</div>
					<button 
						type="submit" 
						class="btn btn-primary"
						disabled={loading || !!duplicateWarning || !newItemName.trim()}
					>
						{#if loading}
							<div class="spinner"></div>
						{:else}
							<Plus size={16} />
						{/if}
						Add Item
					</button>
				</form>
			</div>
		</div>

		<!-- Items List -->
		<div class="items-list card">
			<div class="card-header">
				<h3>Items Being Brought ({eventItemsList.length})</h3>
			</div>
			<div class="card-body">
				{#if eventItemsList.length === 0}
					<div class="empty-items">
						<Package size={48} />
						<h4>No items added yet</h4>
						<p>Be the first to add something to bring to this event!</p>
					</div>
				{:else}
					<div class="items-grid">
						{#each eventItemsList as item (item.id)}
							<div class="item-card">
								<div class="item-content">
									<div class="item-header">
										<h4 class="item-name">{item.name}</h4>
										{#if item.bringer.id === $user.id}
											<button 
												class="remove-btn"
												on:click={() => removeItem(selectedEventId, item.id)}
												disabled={loading}
												title="Remove this item"
											>
												<Trash2 size={14} />
											</button>
										{/if}
									</div>
									<div class="item-bringer">
										<User size={14} />
										<span>Brought by {item.bringer.name}</span>
									</div>
									<div class="item-added">
										<span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
									</div>
								</div>
							</div>
						{/each}
					</div>

					<div class="items-summary">
						<p>
							<strong>{eventItemsList.length}</strong> 
							{eventItemsList.length === 1 ? 'item' : 'items'} being brought by 
							<strong>{new Set(eventItemsList.map(item => item.bringer.id)).size}</strong>
							{new Set(eventItemsList.map(item => item.bringer.id)).size === 1 ? 'member' : 'members'}
						</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.page-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.page-title {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: #1f2937;
	}

	.page-subtitle {
		font-size: 1.125rem;
		color: #6b7280;
	}

	.event-selector {
		margin-bottom: 2rem;
	}

	.no-events {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #6b7280;
		justify-content: center;
	}

	.no-events a {
		color: #3b82f6;
	}

	.event-select-group {
		max-width: 400px;
	}

	.selected-event {
		margin-bottom: 2rem;
	}

	.event-details {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #6b7280;
		font-size: 0.875rem;
	}

	.event-description {
		color: #4b5563;
		line-height: 1.5;
	}

	.add-item-section {
		margin-bottom: 2rem;
	}

	.add-item-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1rem;
	}

	.form-input.error {
		border-color: #dc2626;
		box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
	}

	.duplicate-warning {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		margin-top: 0.25rem;
		color: #dc2626;
		font-size: 0.875rem;
	}

	.items-list {
		margin-bottom: 2rem;
	}

	.empty-items {
		text-align: center;
		padding: 3rem;
		color: #6b7280;
	}

	.empty-items h4 {
		margin: 1rem 0 0.5rem;
	}

	.items-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.item-card {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1rem;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.item-card:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.item-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.item-name {
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0;
		flex: 1;
	}

	.remove-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border: none;
		background: transparent;
		color: #6b7280;
		cursor: pointer;
		border-radius: 0.25rem;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.remove-btn:hover {
		background: #fee2e2;
		color: #dc2626;
	}

	.remove-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.item-bringer {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		color: #4b5563;
		font-size: 0.875rem;
	}

	.item-added {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.items-summary {
		text-align: center;
		padding: 1rem;
		background: #f3f4f6;
		border-radius: 0.5rem;
		color: #4b5563;
	}

	@media (max-width: 768px) {
		.form-row {
			grid-template-columns: 1fr;
		}

		.items-grid {
			grid-template-columns: 1fr;
		}

		.event-details {
			flex-direction: column;
			gap: 0.5rem;
		}
	}

	.form-error {
		color: var(--error-color);
		font-size: 0.875rem;
		margin-top: 0.25rem;
		display: block;
	}

	.form-input.error {
		border-color: var(--error-color);
		box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
	}
</style>
