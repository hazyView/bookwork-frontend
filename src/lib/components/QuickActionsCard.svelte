<script lang="ts">
	import { fly } from 'svelte/transition';
	
	interface QuickAction {
		icon: string;
		title: string;
		description: string;
		href: string;
		color: string;
	}
	
	const quickActions: QuickAction[] = [
		{
			icon: '�',
			title: 'ArgoCD',
			description: 'Access ArgoCD dashboard',
			href: 'https://argocd.bookwork-demo.com',
			color: '#3b82f6'
		},
		{
			icon: '�',
			title: 'Grafana',
			description: 'View application metrics and dashboards',
			href: 'https://grafana.bookwork-demo.com',
			color: '#f97316'
		},
		{
			icon: '�',
			title: 'Prometheus',
			description: 'Explore raw metrics data',
			href: 'https://prometheus.bookwork-demo.com',
			color: '#eab308'
		},
		{
			icon: '�',
			title: 'Slack',
			description: 'Slack Channel - Env/App Alerts',
			href: 'https://fredapitesting.slack.com/archives/C0958PSUQ74',
			color: '#2c60ab'
		}
	];
</script>

<div class="quick-actions-card" in:fly={{ y: 20, duration: 200 }}>
	<div class="card-header">
		<span class="card-subtitle">Requires Personal Github account.</span>
	</div>
	
	<div class="actions-grid">
		{#each quickActions as action}
			<a 
				href={action.href} 
				class="action-item"
				style="--action-color: {action.color}"
				target="_blank"
				rel="noopener noreferrer"
			>
				<div class="action-icon">{action.icon}</div>
				<div class="action-content">
					<h4 class="action-title">{action.title}</h4>
					<p class="action-description">{action.description}</p>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.quick-actions-card {
		background: white;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
		padding: 1.5rem;
		margin-top: 1rem;
		min-width: 320px;
		max-width: 400px;
	}

	.card-header {
		margin-bottom: 1.25rem;
	}

	.card-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: rgb(44, 96, 171);
		margin: 0 0 0.25rem 0;
	}

	.card-subtitle {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.actions-grid {
		display: grid;
		gap: 0.75rem;
	}

	.action-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
		border: 1px solid #e5e7eb;
	}

	.action-item:hover {
		background: #f9fafb;
		border-color: var(--action-color);
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.action-icon {
		font-size: 1.5rem;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--action-color);
		border-radius: 6px;
		color: white;
		flex-shrink: 0;
	}

	.action-content {
		flex: 1;
		min-width: 0;
	}

	.action-title {
		font-size: 0.95rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 0.25rem 0;
	}

	.action-description {
		font-size: 0.8rem;
		color: #6b7280;
		margin: 0;
		line-height: 1.3;
	}

	@media (max-width: 768px) {
		.quick-actions-card {
			min-width: 280px;
			max-width: 100%;
		}
		
		.action-item {
			padding: 0.625rem;
		}
		
		.action-icon {
			width: 2.25rem;
			height: 2.25rem;
			font-size: 1.25rem;
		}
	}
</style>
