<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { clubMembers, membersLoading, membersError, currentClub } from '$lib/stores';
	import type { Member } from '$lib/stores';
	import { fetchClubMembers } from '$lib/api';
	import { handleAsyncOperation, handleStoreError } from '$lib/components/StandardErrorHandler';
	import { Crown, Mail, Calendar, Users, User } from 'lucide-svelte';

	let unsubscribes: Array<() => void> = [];

	onMount(async () => {
		if ($currentClub) {
			await handleAsyncOperation(
				() => fetchClubMembers($currentClub.id),
				{
					setLoading: (loading) => membersLoading.set(loading),
					setError: (error) => membersError.set(error),
					showToast: false,
					context: 'load club members'
				}
			).then((members) => {
				if (members) {
					clubMembers.set(members);
				}
			});
		}

		// Set up store subscriptions with explicit cleanup
		unsubscribes = [
			currentClub.subscribe(club => {
				if (club && $clubMembers.length === 0) {
					// Reload members if club changes and we don't have members
					handleAsyncOperation(
						() => fetchClubMembers(club.id),
						{
							setError: (error) => {
								if (error) {
									handleStoreError(error, 'club members', (err) => membersError.set(err));
								} else {
									membersError.set('Failed to update club members');
								}
							},
							showToast: false,
							context: 'reload club members'
						}
					).then((members) => {
						if (members) {
							clubMembers.set(members);
						}
					});
				}
			})
		];
	});

	onDestroy(() => {
		// Cleanup store subscriptions
		unsubscribes.forEach(unsub => unsub());
	});

	function getRoleIcon(role) {
		return role.includes('Lead') ? Crown : User;
	}

	function getRoleBadgeClass(role) {
		if (role.includes('Lead')) return 'role-badge-lead';
		if (role === 'Co-Lead') return 'role-badge-co-lead';
		return 'role-badge-member';
	}
</script>

<svelte:head>
	<title>Club Roster - BookWorm</title>
</svelte:head>

<div class="container">
	<div class="page-header">
		<h1 class="page-title">Club Roster</h1>
		{#if $currentClub}
			<p class="page-subtitle">{$currentClub.name}</p>
		{/if}
	</div>

	{#if $membersLoading}
		<div class="loading-container">
			<div class="spinner"></div>
			<p>Loading club members...</p>
		</div>
	{:else if $membersError}
		<div class="alert alert-error">
			<p>Error loading club members: {$membersError}</p>
		</div>
	{:else if $clubMembers.length === 0}
		<div class="empty-state card">
			<div class="card-body text-center">
				<User size={48} />
				<h3>No Members Found</h3>
				<p>This club doesn't have any members yet.</p>
			</div>
		</div>
	{:else}
		<div class="members-grid">
			{#each $clubMembers as member (member.id)}
				<div class="member-card card">
					<div class="card-body">
						<div class="member-header">
							<div class="member-avatar">
								<img src={member.avatar} alt="{member.name}" />
							</div>
							<div class="member-info">
								<h3 class="member-name">{member.name}</h3>
								<div class="member-role">
									<span class="role-badge {getRoleBadgeClass(member.role)}">
										<svelte:component this={getRoleIcon(member.role)} size={14} />
										{member.role}
									</span>
								</div>
							</div>
						</div>

						<div class="member-details">
							<div class="detail-item">
								<Mail size={16} />
								<a href="mailto:{member.email}" class="detail-link">
									{member.email}
								</a>
							</div>
							{#if member.phone}
								<div class="detail-item">
									<Phone size={16} />
									<a href="tel:{member.phone}" class="detail-link">
										{member.phone}
									</a>
								</div>
							{/if}
						</div>

						<div class="member-stats">
							<div class="stat">
								<span class="stat-label">Books Read</span>
								<span class="stat-value">{member.booksRead}</span>
							</div>
							<div class="stat">
								<span class="stat-label">Joined</span>
								<span class="stat-value">
									{new Date(member.joinedDate).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="roster-summary card">
			<div class="card-header">
				<h2>Club Summary</h2>
			</div>
			<div class="card-body">
				<div class="summary-stats">
					<div class="summary-stat">
						<span class="summary-number">{$clubMembers.length}</span>
						<span class="summary-label">Total Members</span>
					</div>
					<div class="summary-stat">
						<span class="summary-number">
							{$clubMembers.filter(m => m.role.includes('Lead')).length}
						</span>
						<span class="summary-label">Club Leaders</span>
					</div>
					<div class="summary-stat">
						<span class="summary-number">
							{Math.round($clubMembers.reduce((acc, m) => acc + m.booksRead, 0) / $clubMembers.length)}
						</span>
						<span class="summary-label">Avg. Books Read</span>
					</div>
				</div>
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

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		text-align: center;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
	}

	.empty-state h3 {
		margin: 1rem 0 0.5rem;
		color: #6b7280;
	}

	.members-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.member-card {
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.member-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.member-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.member-avatar {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		overflow: hidden;
		background: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.member-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.member-info {
		flex: 1;
	}

	.member-name {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
		color: #1f2937;
	}

	.member-role {
		display: flex;
		align-items: center;
	}

	.role-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.role-badge-lead {
		background-color: #fef3c7;
		color: #92400e;
	}

	.role-badge-co-lead {
		background-color: #ddd6fe;
		color: #5b21b6;
	}

	.role-badge-member {
		background-color: #e5e7eb;
		color: #374151;
	}

	.member-details {
		margin-bottom: 1rem;
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.detail-link {
		color: #3b82f6;
		text-decoration: none;
	}

	.detail-link:hover {
		text-decoration: underline;
	}

	.member-stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
	}

	.stat {
		text-align: center;
	}

	.stat-label {
		display: block;
		font-size: 0.75rem;
		color: #6b7280;
		margin-bottom: 0.25rem;
	}

	.stat-value {
		display: block;
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
	}

	.roster-summary {
		margin-top: 2rem;
	}

	.summary-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 2rem;
		text-align: center;
	}

	.summary-stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.summary-number {
		font-size: 2rem;
		font-weight: 700;
		color: #3b82f6;
		margin-bottom: 0.25rem;
	}

	.summary-label {
		font-size: 0.875rem;
		color: #6b7280;
	}

	@media (max-width: 768px) {
		.members-grid {
			grid-template-columns: 1fr;
		}

		.member-stats {
			grid-template-columns: 1fr;
		}

		.summary-stats {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
	}
</style>
