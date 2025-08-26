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
				//Set default club in dev mode
			   if (import.meta.env.DEV){
				   const { currentClub, user } = await import('$lib/stores');
				   const { mockUserClubs, mockUser } = await import('$lib/mockData');
				   currentClub.set(mockUserClubs[0]);
				   user.set(mockUser);
			   }
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
		<div class="logo-container">
			<div class="logo">
				<div class="logo-icon"></div>
			</div>
			<h1>Welcome to BookWork</h1>
		</div>
		
		<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
			<div class="form-group">
				<label for="email">Email or username</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					onkeydown={handleKeydown}
					placeholder="email or username"
					required
					disabled={loading}
					class="form-input"
				/>
			</div>
			
			<div class="form-group">
				<label for="password">Password</label>
				<div class="password-input-container">
					<input
						id="password"
						type="password"
						bind:value={password}
						onkeydown={handleKeydown}
						placeholder="password"
						required
						disabled={loading}
						class="form-input"
					/>
					<button type="button" class="password-toggle" aria-label="Toggle password visibility">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
							<circle cx="12" cy="12" r="3"/>
						</svg>
					</button>
				</div>
			</div>
			
			{#if error}
				<div class="error">{error}</div>
			{/if}
			
			<button type="submit" disabled={loading} class="btn-login">
				{loading ? 'Logging in...' : 'Log in'}
			</button>
		</form>
		
		<div class="forgot-password">
			<a href="/forgot-password">Forgot your password?</a>
		</div>
		
		<div class="divider">
			<span>or</span>
		</div>
		
		<button type="button" class="btn-github">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
			</svg>
			Sign in with GitHub
		</button>
		
		<div class="signup-link">
			<span>New to BookWork?</span>
			<a href="/signup">Sign up</a>
		</div>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem;
		background: var(--bg-gradient);
	}
	
	.login-card {
		background: var(--bg-card);
		padding: 3rem 2.5rem;
		border-radius: 8px;
		border: 1px solid var(--border-card);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
		width: 100%;
		max-width: 400px;
		color: var(--text-primary);
	}
	
	.logo-container {
		text-align: center;
		margin-bottom: 2rem;
	}
	
	.logo {
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
	}
	
	.logo-icon {
		width: 60px;
		height: 60px;
		background: var(--primary-gradient);
		border-radius: 50%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.logo-icon::before {
		content: '';
		width: 32px;
		height: 32px;
		background: var(--bg-card);
		border-radius: 50%;
		position: absolute;
	}
	
	.logo-icon::after {
		content: '';
		width: 20px;
		height: 20px;
		background: var(--primary-gradient);
		border-radius: 50%;
		position: absolute;
		z-index: 1;
	}
	
	h1 {
		font-size: 1.75rem;
		font-weight: 500;
		margin: 0;
		color: var(--text-primary);
	}
	
	.form-group {
		margin-bottom: 1.5rem;
	}
	
	label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
	}
	
	.form-input {
		width: 100%;
		padding: 0.875rem 1rem;
		background: var(--bg-tertiary);
		border: 1px solid var(--border-secondary);
		border-radius: 6px;
		font-size: 0.875rem;
		color: var(--text-primary);
		transition: all 0.2s ease;
	}
	
	.form-input:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
	}
	
	.form-input::placeholder {
		color: var(--text-tertiary);
	}
	
	.password-input-container {
		position: relative;
	}
	
	.password-toggle {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: var(--text-tertiary);
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 4px;
		transition: color 0.2s ease;
	}
	
	.password-toggle:hover {
		color: var(--text-secondary);
	}
	
	.btn-login {
		width: 100%;
		padding: 0.875rem;
		background: var(--primary-color);
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
		margin-bottom: 1rem;
	}
	
	.btn-login:hover:not(:disabled) {
		background: var(--primary-hover);
	}
	
	.btn-login:disabled {
		background: var(--text-tertiary);
		cursor: not-allowed;
	}
	
	.forgot-password {
		text-align: center;
		margin-bottom: 1.5rem;
	}
	
	.forgot-password a {
		color: var(--primary-color);
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s ease;
	}
	
	.forgot-password a:hover {
		color: var(--primary-hover);
		text-decoration: underline;
	}
	
	.divider {
		text-align: center;
		margin: 1.5rem 0;
		position: relative;
	}
	
	.divider::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--border-secondary);
	}
	
	.divider span {
		background: var(--bg-card);
		padding: 0 1rem;
		color: var(--text-tertiary);
		font-size: 0.875rem;
	}
	
	.btn-github {
		width: 100%;
		padding: 0.875rem;
		background: var(--bg-tertiary);
		color: var(--text-primary);
		border: 1px solid var(--border-secondary);
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}
	
	.btn-github:hover {
		background: var(--bg-primary);
		border-color: var(--border-primary);
	}
	
	.signup-link {
		text-align: center;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}
	
	.signup-link a {
		color: var(--primary-color);
		text-decoration: none;
		margin-left: 0.5rem;
		transition: color 0.2s ease;
	}
	
	.signup-link a:hover {
		color: var(--primary-hover);
		text-decoration: underline;
	}
	
	.error {
		background: rgba(239, 68, 68, 0.1);
		color: var(--error-color);
		padding: 0.75rem;
		border-radius: 6px;
		margin-bottom: 1rem;
		border: 1px solid rgba(239, 68, 68, 0.2);
		font-size: 0.875rem;
	}
</style>
