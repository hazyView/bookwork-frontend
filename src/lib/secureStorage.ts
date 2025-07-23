/**
 * Secure Storage Utility
 * Provides encrypted storage for non-sensitive application data
 */
import { browser } from '$app/environment';
import CryptoUtils from './crypto.js';

class SecureStorage {
	private static readonly ENCRYPTION_KEY = 'bookwork-app-data-key';
	
	/**
	 * Encrypt data using production-grade AES-GCM encryption
	 */
	private static async encrypt(data: string): Promise<string> {
		try {
			const result = await CryptoUtils.encrypt(data);
			return JSON.stringify(result); // Store both data and IV
		} catch (error) {
			if (import.meta.env.DEV) {
				console.warn('Encryption failed, using fallback:', error);
			}
			// Fallback to base64 for compatibility
			try {
				return btoa(unescape(encodeURIComponent(data)));
			} catch {
				return data;
			}
		}
	}
	
	/**
	 * Decrypt data
	 */
	private static async decrypt(encrypted: string): Promise<string> {
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
			return decodeURIComponent(escape(atob(encrypted)));
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error('Decryption failed:', error);
			}
			return encrypted;
		}
	}
	
	/**
	 * Set item in secure storage
	 */
	static async setItem(key: string, value: any): Promise<boolean> {
		if (!browser) return false;
		
		try {
			const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
			const encrypted = await this.encrypt(stringValue);
			sessionStorage.setItem(`sec_${key}`, encrypted);
			return true;
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error('Failed to set secure storage item:', error);
			}
			return false;
		}
	}
	
	/**
	 * Get item from secure storage
	 */
	static async getItem(key: string): Promise<string | null> {
		if (!browser) return null;
		
		try {
			const encrypted = sessionStorage.getItem(`sec_${key}`);
			return encrypted ? await this.decrypt(encrypted) : null;
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error('Failed to get secure storage item:', error);
			}
			return null;
		}
	}
	
	/**
	 * Get item and parse as JSON
	 */
	static async getItemParsed<T>(key: string): Promise<T | null> {
		const item = await this.getItem(key);
		if (!item) return null;
		
		try {
			return JSON.parse(item);
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error('Failed to parse stored item:', error);
			}
			return null;
		}
	}
	
	/**
	 * Remove item from secure storage
	 */
	static removeItem(key: string): void {
		if (!browser) return;
		
		sessionStorage.removeItem(`sec_${key}`);
		
		// Also remove from localStorage for migration
		localStorage.removeItem(key);
	}
	
	/**
	 * Clear all secure storage items
	 */
	static clear(): void {
		if (!browser) return;
		
		const keys = Object.keys(sessionStorage);
		keys.forEach(key => {
			if (key.startsWith('sec_')) {
				sessionStorage.removeItem(key);
			}
		});
		
		// Clear encryption keys
		CryptoUtils.clearKeys();
	}
	
	/**
	 * Migrate data from localStorage to secure storage
	 */
	static async migrateFromLocalStorage(key: string): Promise<void> {
		if (!browser) return;
		
		try {
			const oldData = localStorage.getItem(key);
			if (oldData) {
				await this.setItem(key, oldData);
				localStorage.removeItem(key);
				// Migration completed successfully
			}
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error(`Failed to migrate ${key}:`, error);
			}
		}
	}
	
	/**
	 * Check if storage is available
	 */
	static isAvailable(): boolean {
		if (!browser) return false;
		
		try {
			const test = '__storage_test__';
			sessionStorage.setItem(test, 'test');
			sessionStorage.removeItem(test);
			return true;
		} catch {
			return false;
		}
	}
}

export default SecureStorage;
