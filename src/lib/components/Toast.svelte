<script lang="ts">
	import { toasts, type Toast } from '$lib/toast';
	import { X } from 'lucide-svelte';

	export let toast: Toast;

	function remove() {
		toasts.remove(toast.id);
	}
</script>

<div class="toast toast-{toast.type}" role="alert">
	<div class="toast-content">
		<p class="toast-message">{toast.message}</p>
		<button class="toast-close" on:click={remove} aria-label="Close notification">
			<X size={16} />
		</button>
	</div>
</div>

<style>
	.toast {
		display: flex;
		align-items: center;
		min-width: 300px;
		max-width: 500px;
		padding: 1rem;
		border-radius: 0.5rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		margin-bottom: 0.5rem;
		animation: slideIn 0.3s ease-out;
		border-left: 4px solid;
		background: white;
	}

	.toast-success {
		border-left-color: #10b981;
		background: #f0fdf4;
		color: #166534;
	}

	.toast-error {
		border-left-color: #ef4444;
		background: #fef2f2;
		color: #991b1b;
	}

	.toast-warning {
		border-left-color: #f59e0b;
		background: #fffbeb;
		color: #92400e;
	}

	.toast-info {
		border-left-color: #3b82f6;
		background: #eff6ff;
		color: #1e40af;
	}

	.toast-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.toast-message {
		margin: 0;
		font-weight: 500;
		flex: 1;
		margin-right: 1rem;
	}

	.toast-close {
		background: none;
		border: none;
		cursor: pointer;
		color: inherit;
		opacity: 0.7;
		transition: opacity 0.2s;
		padding: 0.25rem;
		border-radius: 0.25rem;
	}

	.toast-close:hover {
		opacity: 1;
		background: rgba(0, 0, 0, 0.05);
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}
</style>
