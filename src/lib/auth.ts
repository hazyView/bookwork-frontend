/**
 * Authentication Service
 * Provides secure JWT-based authentication with proper token management
 */
import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { sessionManager } from './sessionManager';
import { login as apiLogin, logout as apiLogout, validateAuthToken, refreshAuthToken } from './api';
import { isDevelopment } from './env';
import CryptoUtils from './crypto.js';
import { TIME_CONSTANTS } from './constants';

// Authentication configuration
const SESSION_TIMEOUT = TIME_CONSTANTS.SESSION_TIMEOUT;
const AUTH_DEBUG = isDevelopment();

// Types - Updated to match backend User model
export interface User {
	id: string;
	name: string;
	email: string;
	phone?: string | null;
	avatar?: string | null;
	role: 'admin' | 'moderator' | 'member' | 'guest';
	isActive: boolean;
	lastLoginAt?: string | null;
	createdAt: string;
	updatedAt?: string;
	joinedDate?: string | null;
}

interface AuthTokenPayload {
	userId: string;
	email: string;
	role: string;
	iat: number;
	exp: number;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
}

// Auth store
const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	loading: false,
	error: null
};

export const authStore = writable<AuthState>(initialState);

// Secure token storage using httpOnly cookies simulation
class SecureTokenStorage {
	private static readonly TOKEN_KEY = '__auth_token';
	private static readonly REFRESH_TOKEN_KEY = '__refresh_token';
	
	static async setToken(token: string, refreshToken?: string): Promise<void> {
		if (!browser) return;
		
		// Use sessionStorage for tokens (more secure than localStorage)
		const encryptedToken = await this.encryptToken(token);
		sessionStorage.setItem(this.TOKEN_KEY, encryptedToken);
		
		if (refreshToken) {
			const encryptedRefresh = await this.encryptToken(refreshToken);
			sessionStorage.setItem(this.REFRESH_TOKEN_KEY, encryptedRefresh);
		}
	}
	
	static async getToken(): Promise<string | null> {
		if (!browser) return null;
		
		const encrypted = sessionStorage.getItem(this.TOKEN_KEY);
		return encrypted ? await this.decryptToken(encrypted) : null;
	}
	
	static async getRefreshToken(): Promise<string | null> {
		if (!browser) return null;
		
		const encrypted = sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
		return encrypted ? await this.decryptToken(encrypted) : null;
	}
	
	static removeTokens(): void {
		if (!browser) return;
		
		sessionStorage.removeItem(this.TOKEN_KEY);
		sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
		
		// Clear encryption keys
		CryptoUtils.clearKeys();
		
		// Also clear localStorage for legacy cleanup
		localStorage.removeItem('authToken');
	}
	
	private static async encryptToken(token: string): Promise<string> {
		// Production-grade encryption using AES-GCM
		try {
			const result = await CryptoUtils.encrypt(token);
			return JSON.stringify(result); // Store both data and IV
		} catch (error) {
			console.warn('Token encryption failed, using fallback:', error);
			return btoa(token); // Fallback to base64 for compatibility
		}
	}
	
	private static async decryptToken(encrypted: string): Promise<string> {
		try {
			// Try to parse as JSON (new format with IV)
			const parsed = JSON.parse(encrypted);
			if (parsed.data && parsed.iv) {
				return await CryptoUtils.decrypt(parsed.data, parsed.iv);
			}
			// Fall through to legacy decryption
		} catch {
			// Not JSON, try legacy base64 decryption
		}
		
		try {
			// Legacy base64 decryption for backward compatibility
			return atob(encrypted);
		} catch {
			return '';
		}
	}
}

// Authentication service class
export class AuthService {
	private static refreshTimeout: ReturnType<typeof setTimeout> | null = null;
	
	/**
	 * Authenticate user with email and password
	 */
	static async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
		try {
			authStore.update(state => ({ ...state, loading: true, error: null }));
			
			// Use the API login function
			const loginResponse = await apiLogin(email, password);
			const { token, user } = loginResponse;
			
			// Store tokens securely
			await SecureTokenStorage.setToken(token, token); // Using access token as refresh for now
			
			authStore.update(state => ({
				...state,
				user,
				isAuthenticated: true,
				loading: false,
				error: null
			}));
			
			this.scheduleTokenRefresh(token);
			
			if (AUTH_DEBUG) {
				console.log('User logged in successfully');
			}
			
			return { success: true };
			
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
			
			authStore.update(state => ({
				...state,
				loading: false,
				error: errorMessage
			}));
			
			return { success: false, error: errorMessage };
		}
	}
	
	/**
	 * Logout user and clear session
	 */
	static async logout(): Promise<void> {
		try {
			// Get refresh token for logout
			const refreshToken = await SecureTokenStorage.getRefreshToken();
			
			// Call backend logout
			if (refreshToken) {
				try {
					await apiLogout(refreshToken);
				} catch (error) {
					// Don't fail logout if backend call fails
					if (AUTH_DEBUG) {
						console.warn('Backend logout failed:', error);
					}
				}
			}
			
			// Clear local storage
			SecureTokenStorage.removeTokens();
			
			// Reset auth store
			authStore.set(initialState);
			
			if (AUTH_DEBUG) {
				console.log('User logged out successfully');
			}
			
		} catch (error) {
			if (AUTH_DEBUG) {
				console.error('Logout error:', error);
			}
			// Still clear local state even if backend call fails
			SecureTokenStorage.removeTokens();
			authStore.set(initialState);
		}
	}
	
	/**
	 * Validate and refresh authentication token
	 */
	static async validateToken(): Promise<boolean> {
		try {
			const token = await SecureTokenStorage.getToken();
			
			if (!token) {
				return false;
			}
			
			// Add timeout to prevent hanging
			const timeoutPromise = new Promise((_, reject) => 
				setTimeout(() => reject(new Error('Token validation timeout')), TIME_CONSTANTS.TOKEN_VALIDATION_TIMEOUT)
			);
			
			// Use the API validation function with timeout
			const user = await Promise.race([
				validateAuthToken(token),
				timeoutPromise
			]);
			
			authStore.update(state => ({
				...state,
				user: user as User,
				isAuthenticated: true,
				loading: false,
				error: null
			}));
			
			this.scheduleTokenRefresh(token);
			
			return true;
			
		} catch (error) {
			if (AUTH_DEBUG) {
				console.warn('Token validation failed or timed out:', error);
			}
			// Don't try to refresh on timeout - just return false
			if (error instanceof Error && error.message === 'Token validation timeout') {
				return false;
			}
			// Try to refresh token if validation fails for other reasons
			return await this.refreshToken();
		}
	}
	
	/**
	 * Refresh authentication token
	 */
	private static async refreshToken(): Promise<boolean> {
		try {
			const refreshToken = await SecureTokenStorage.getRefreshToken();
			
			if (!refreshToken) {
				await this.logout();
				return false;
			}
			
			// Use the API refresh function
			const refreshResponse = await refreshAuthToken(refreshToken);
			const { token, expiresAt } = refreshResponse;
			
			await SecureTokenStorage.setToken(token, refreshToken);
			this.scheduleTokenRefresh(token);
			
			return true;
			
		} catch (error) {
			if (AUTH_DEBUG) {
				console.error('Token refresh error:', error);
			}
			await this.logout();
			return false;
		}
	}
	
	/**
	 * Schedule automatic token refresh
	 */
	private static scheduleTokenRefresh(token: string): void {
		// Clear existing timeout
		if (this.refreshTimeout) {
			clearTimeout(this.refreshTimeout);
		}
		
		// Schedule refresh 5 minutes before assumed expiration (25 minutes)
		const refreshTime = TIME_CONSTANTS.TOKEN_REFRESH_TIME;
		
		this.refreshTimeout = setTimeout(() => {
			this.refreshToken();
		}, refreshTime);
	}
	
	/**
	 * Check if user has permission
	 */
	static hasPermission(permission: string): boolean {
		const state = this.getAuthState();
		// Admin users have all permissions, members have basic read permissions
		if (state.user?.role === 'admin') return true;
		if (state.user?.role === 'moderator' && ['read', 'write'].includes(permission)) return true;
		if (state.user?.role === 'member' && permission === 'read') return true;
		return false;
	}
	
	/**
	 * Check if user has role
	 */
	static hasRole(role: string): boolean {
		const state = this.getAuthState();
		return state.user?.role === role || false;
	}
	
	/**
	 * Get current auth state
	 */
	private static getAuthState(): AuthState {
		let currentState: AuthState = initialState;
		authStore.subscribe(state => {
			currentState = state;
		})();
		return currentState;
	}
}

// Initialize authentication on module load
if (browser) {
	AuthService.validateToken().catch(error => {
		if (AUTH_DEBUG) {
			console.error('Auth initialization error:', error);
		}
	});
}

// Export user store for components
export const user = writable<User | null>(null);
export const isAuthenticated = writable<boolean>(false);

// Sync auth store with component stores
authStore.subscribe(state => {
	user.set(state.user);
	isAuthenticated.set(state.isAuthenticated);
});
