<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	
	let email = 'demo@bookwork.com';
	let password = 'password';
	let loading = false;
	let error = '';
	
	async function handleLogin() {
		if (!browser) return; // Skip on server-side
		
		if (!email || !password) {
			error = 'Please enter both email and password';
			return;
		}

		loading = true;
		error = '';
		
		try {
			// Dynamic import to avoid SSR issues
			const { AuthService } = await import('$lib/auth');
			const result = await AuthService.login(email, password);
			
			if (result.success) {
				// Redirect to dashboard
				goto('/');
			} else {
				error = result.error || 'Login failed';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Login failed';
			if (import.meta.env.DEV) {
				console.error('Login error:', err);
			}
		} finally {
			loading = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!browser) return; // Skip on server-side
		if (event.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<div class="login-container">
	<div class="login-card">
		<h1>Login to BookWorm</h1>
		
		<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
			<div class="form-group">
				<label for="email">Email:</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					onkeydown={handleKeydown}
					placeholder="Enter your email"
					required
					disabled={loading}
				/>
			</div>
			
			<div class="form-group">
				<label for="password">Password:</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					onkeydown={handleKeydown}
					placeholder="Enter your password"
					required
					disabled={loading}
				/>
			</div>
			
			{#if error}
				<div class="error">{error}</div>
			{/if}
			
			<button type="submit" disabled={loading}>
				{loading ? 'Logging in...' : 'Login'}
			</button>
		</form>
		
		<div class="demo-info">
			<p><strong>Demo Credentials:</strong></p>
			<p>Email: demo@bookwork.com</p>
			<p>Password: password</p>
		</div>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 80vh;
		padding: 2rem;
	}
	
	.login-card {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
	}
	
	h1 {
		text-align: center;
		margin-bottom: 2rem;
		color: #333;
	}
	
	.form-group {
		margin-bottom: 1rem;
	}
	
	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #555;
	}
	
	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}
	
	input:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
	}
	
	button {
		width: 100%;
		padding: 0.75rem;
		background: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	button:hover:not(:disabled) {
		background: #0056b3;
	}
	
	button:disabled {
		background: #6c757d;
		cursor: not-allowed;
	}
	
	.error {
		background: #f8d7da;
		color: #721c24;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
		border: 1px solid #f5c6cb;
	}
	
	.demo-info {
		margin-top: 2rem;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 4px;
		text-align: center;
	}
	
	.demo-info p {
		margin: 0.25rem 0;
		font-size: 0.875rem;
		color: #666;
	}
	
	.demo-info strong {
		color: #333;
	}
</style>
