<script lang="ts">
	import { onMount } from 'svelte';
	import { getApiConfig, isDevelopment, isMockDataEnabled } from '$lib/env';
	
	let envTest = '';
	let errorMessage = '';
	
	onMount(() => {
		try {
			// Test environment variable access
			const apiConfig = getApiConfig();
			envTest = `
				API Base: ${apiConfig.apiBase}
				API Timeout: ${apiConfig.timeout}
				Development Mode: ${isDevelopment()}
				Mock Data Enabled: ${isMockDataEnabled()}
				Vite Mode: ${import.meta.env.MODE}
				Vite Dev: ${import.meta.env.DEV}
			`;
		} catch (error) {
			errorMessage = `Environment error: ${error}`;
			if (import.meta.env.DEV) {
				console.error('Environment test error:', error);
			}
		}
	});
</script>

<svelte:head>
	<title>Environment Test - BookWork</title>
</svelte:head>

<div class="container">
	<h1>Environment Variable Test</h1>
	
	{#if errorMessage}
		<div class="error">
			<h2>Error:</h2>
			<p>{errorMessage}</p>
		</div>
	{:else}
		<div class="success">
			<h2>Environment Variables:</h2>
			<pre>{envTest}</pre>
		</div>
	{/if}
	
	<a href="/" class="back-link">← Back to Dashboard</a>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}
	
	.error {
		background: #fee;
		border: 1px solid #fcc;
		padding: 1rem;
		border-radius: 4px;
		margin: 1rem 0;
	}
	
	.success {
		background: #efe;
		border: 1px solid #cfc;
		padding: 1rem;
		border-radius: 4px;
		margin: 1rem 0;
	}
	
	pre {
		background: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		margin: 1rem 0;
	}
	
	.back-link {
		display: inline-block;
		margin-top: 2rem;
		color: #3b82f6;
		text-decoration: none;
	}
	
	.back-link:hover {
		text-decoration: underline;
	}
</style>
