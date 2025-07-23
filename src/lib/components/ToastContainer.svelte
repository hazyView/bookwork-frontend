<script lang="ts">
	import { toasts } from '$lib/toast';
	import Toast from './Toast.svelte';
</script>

<div class="toast-container">
	{#each $toasts as toast (toast.id)}
		<Toast {toast} />
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 1000;
		pointer-events: none;
	}

	.toast-container :global(.toast) {
		pointer-events: auto;
	}
</style>
