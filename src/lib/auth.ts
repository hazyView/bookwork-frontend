/**
 * Authentication Service
 * Provides secure JWT-based authentication with proper token management
 */
import jwt from 'jsonwebtoken';
import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { sessionManager } from './sessionManager';

// Environment configuration
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'fallback-secret-change-in-production';
const SESSION_TIMEOUT = parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 1800000; // 30 minutes default
const AUTH_DEBUG = import.meta.env.VITE_AUTH_DEBUG === 'true';

// Types
export interface User {
	id: string;
	email: string;
	name: string;
	role: 'admin' | 'user' | 'manager';
	clubs: string[];
	permissions: string[];
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
	
	static setToken(token: string, refreshToken?: string): void {
		if (!browser) return;
		
		// Use sessionStorage for tokens (more secure than localStorage)
		sessionStorage.setItem(this.TOKEN_KEY, this.encryptToken(token));
		
		if (refreshToken) {
			sessionStorage.setItem(this.REFRESH_TOKEN_KEY, this.encryptToken(refreshToken));
		}
	}
	
	static getToken(): string | null {
		if (!browser) return null;
		
		const encrypted = sessionStorage.getItem(this.TOKEN_KEY);
		return encrypted ? this.decryptToken(encrypted) : null;
	}
	
	static getRefreshToken(): string | null {
		if (!browser) return null;
		
		const encrypted = sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
		return encrypted ? this.decryptToken(encrypted) : null;
	}
	
	static removeTokens(): void {
		if (!browser) return;
		
		sessionStorage.removeItem(this.TOKEN_KEY);
		sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
		
		// Also clear localStorage for legacy cleanup
		localStorage.removeItem('authToken');
	}
	
	private static encryptToken(token: string): string {
		// Simple encryption - in production, use proper encryption
		return btoa(token);
	}
	
	private static decryptToken(encrypted: string): string {
		try {
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
			
			// In development, simulate authentication
			if (import.meta.env.MODE === 'development' && email === 'demo@bookwork.com') {
				const mockUser: User = {
					id: 'user-1',
					email: 'demo@bookwork.com',
					name: 'Demo User',
					role: 'admin',
					clubs: ['club-1', 'club-2'],
					permissions: ['read', 'write', 'admin']
				};
				
				const token = this.generateToken(mockUser);
				const refreshToken = this.generateRefreshToken(mockUser);
				
				SecureTokenStorage.setToken(token, refreshToken);
				
				authStore.update(state => ({
					...state,
					user: mockUser,
					isAuthenticated: true,
					loading: false,
					error: null
				}));
				
				this.scheduleTokenRefresh(token);
				
				if (AUTH_DEBUG) {
					console.log('Demo authentication successful');
				}
				
				return { success: true };
			}
			
			// Production authentication
			const response = await fetch(`${import.meta.env.VITE_API_BASE}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
				credentials: 'include'
			});
			
			const data = await response.json();
			
			if (!response.ok) {
				throw new Error(data.message || 'Authentication failed');
			}
			
			const { user, token, refreshToken } = data;
			
			SecureTokenStorage.setToken(token, refreshToken);
			
			authStore.update(state => ({
				...state,
				user,
				isAuthenticated: true,
				loading: false,
				error: null
			}));
			
			this.scheduleTokenRefresh(token);
			
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
			// Clear refresh timeout
			if (this.refreshTimeout) {
				clearTimeout(this.refreshTimeout);
				this.refreshTimeout = null;
			}
			
			// Call backend logout if not in development
			if (import.meta.env.MODE !== 'development') {
				await fetch(`${import.meta.env.VITE_API_BASE}/auth/logout`, {
					method: 'POST',
					credentials: 'include'
				});
			}
			
			// Clear local storage
			SecureTokenStorage.removeTokens();
			
			// Reset auth store
			authStore.set(initialState);
			
			if (AUTH_DEBUG) {
				console.log('User logged out successfully');
			}
			
		} catch (error) {
			console.error('Logout error:', error);
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
			const token = SecureTokenStorage.getToken();
			
			if (!token) {
				return false;
			}
			
			// Verify token locally first
			const payload = this.verifyToken(token);
			if (!payload) {
				return false;
			}
			
			// Check if token is expired
			if (Date.now() >= payload.exp * 1000) {
				// Try to refresh token
				return await this.refreshToken();
			}
			
			// In development, simulate user validation
			if (import.meta.env.MODE === 'development') {
				const mockUser: User = {
					id: payload.userId,
					email: payload.email,
					name: 'Demo User',
					role: payload.role as 'admin' | 'user' | 'manager',
					clubs: ['club-1', 'club-2'],
					permissions: ['read', 'write', 'admin']
				};
				
				authStore.update(state => ({
					...state,
					user: mockUser,
					isAuthenticated: true,
					loading: false,
					error: null
				}));
				
				this.scheduleTokenRefresh(token);
				return true;
			}
			
			// Production validation
			const response = await fetch(`${import.meta.env.VITE_API_BASE}/auth/validate`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				credentials: 'include'
			});
			
			if (!response.ok) {
				return await this.refreshToken();
			}
			
			const { user } = await response.json();
			
			authStore.update(state => ({
				...state,
				user,
				isAuthenticated: true,
				loading: false,
				error: null
			}));
			
			this.scheduleTokenRefresh(token);
			
			return true;
			
		} catch (error) {
			console.error('Token validation error:', error);
			return false;
		}
	}
	
	/**
	 * Refresh authentication token
	 */
	private static async refreshToken(): Promise<boolean> {
		try {
			const refreshToken = SecureTokenStorage.getRefreshToken();
			
			if (!refreshToken) {
				return false;
			}
			
			// In development, generate new token
			if (import.meta.env.MODE === 'development') {
				const mockUser: User = {
					id: 'user-1',
					email: 'demo@bookwork.com',
					name: 'Demo User',
					role: 'admin',
					clubs: ['club-1', 'club-2'],
					permissions: ['read', 'write', 'admin']
				};
				
				const newToken = this.generateToken(mockUser);
				SecureTokenStorage.setToken(newToken, refreshToken);
				
				this.scheduleTokenRefresh(newToken);
				
				return true;
			}
			
			// Production refresh
			const response = await fetch(`${import.meta.env.VITE_API_BASE}/auth/refresh`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ refreshToken }),
				credentials: 'include'
			});
			
			if (!response.ok) {
				await this.logout();
				return false;
			}
			
			const { token: newToken, refreshToken: newRefreshToken } = await response.json();
			
			SecureTokenStorage.setToken(newToken, newRefreshToken);
			this.scheduleTokenRefresh(newToken);
			
			return true;
			
		} catch (error) {
			console.error('Token refresh error:', error);
			await this.logout();
			return false;
		}
	}
	
	/**
	 * Generate JWT token for user
	 */
	private static generateToken(user: User): string {
		const payload: AuthTokenPayload = {
			userId: user.id,
			email: user.email,
			role: user.role,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor((Date.now() + SESSION_TIMEOUT) / 1000)
		};
		
		return jwt.sign(payload, JWT_SECRET);
	}
	
	/**
	 * Generate refresh token
	 */
	private static generateRefreshToken(user: User): string {
		const payload = {
			userId: user.id,
			type: 'refresh',
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor((Date.now() + SESSION_TIMEOUT * 2) / 1000) // Longer expiration
		};
		
		return jwt.sign(payload, JWT_SECRET);
	}
	
	/**
	 * Verify JWT token
	 */
	private static verifyToken(token: string): AuthTokenPayload | null {
		try {
			return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
		} catch {
			return null;
		}
	}
	
	/**
	 * Schedule automatic token refresh
	 */
	private static scheduleTokenRefresh(token: string): void {
		const payload = this.verifyToken(token);
		if (!payload) return;
		
		// Clear existing timeout
		if (this.refreshTimeout) {
			clearTimeout(this.refreshTimeout);
		}
		
		// Schedule refresh 5 minutes before expiration
		const refreshTime = (payload.exp * 1000) - Date.now() - (5 * 60 * 1000);
		
		if (refreshTime > 0) {
			this.refreshTimeout = setTimeout(() => {
				this.refreshToken();
			}, refreshTime);
		}
	}
	
	/**
	 * Check if user has permission
	 */
	static hasPermission(permission: string): boolean {
		const state = this.getAuthState();
		return state.user?.permissions.includes(permission) || state.user?.role === 'admin' || false;
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
	AuthService.validateToken().catch(console.error);
}

// Export user store for components
export const user = writable<User | null>(null);
export const isAuthenticated = writable<boolean>(false);

// Sync auth store with component stores
authStore.subscribe(state => {
	user.set(state.user);
	isAuthenticated.set(state.isAuthenticated);
});
