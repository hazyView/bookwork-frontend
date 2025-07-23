<script>
	import { isMockDataEnabled, isDebugModeEnabled } from '$lib/env';
	
	let mockEnabled = false;
	let debugEnabled = false;
	let envVars = {};
	
	// Check environment variables on mount
	if (typeof window !== 'undefined') {
		mockEnabled = isMockDataEnabled();
		debugEnabled = isDebugModeEnabled();
		envVars = import.meta.env;
	}
</script>

<div class="debug-container">
	<h1>Environment Debug</h1>
	
	<div class="debug-section">
		<h2>Environment Functions</h2>
		<p><strong>Mock Data Enabled:</strong> {mockEnabled}</p>
		<p><strong>Debug Mode Enabled:</strong> {debugEnabled}</p>
	</div>
	
	<div class="debug-section">
		<h2>Raw Environment Variables</h2>
		<pre>{JSON.stringify(envVars, null, 2)}</pre>
	</div>
</div>

<style>
	.debug-container {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}
	
	.debug-section {
		margin-bottom: 2rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	
	pre {
		background: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
	}
</style>
