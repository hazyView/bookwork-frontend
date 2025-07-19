/**
 * Secure Storage Utility
 * Provides encrypted storage for non-sensitive application data
 */
import { browser } from '$app/environment';

class SecureStorage {
	private static readonly ENCRYPTION_KEY = 'bookwork-app-data-key';
	
	/**
	 * Encrypt data using simple base64 encoding
	 * In production, use proper encryption algorithms
	 */
	private static encrypt(data: string): string {
		try {
			return btoa(unescape(encodeURIComponent(data)));
		} catch (error) {
			console.error('Encryption failed:', error);
			return data;
		}
	}
	
	/**
	 * Decrypt data
	 */
	private static decrypt(encrypted: string): string {
		try {
			return decodeURIComponent(escape(atob(encrypted)));
		} catch (error) {
			console.error('Decryption failed:', error);
			return encrypted;
		}
	}
	
	/**
	 * Set item in secure storage
	 */
	static setItem(key: string, value: any): boolean {
		if (!browser) return false;
		
		try {
			const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
			const encrypted = this.encrypt(stringValue);
			sessionStorage.setItem(`sec_${key}`, encrypted);
			return true;
		} catch (error) {
			console.error('Failed to set secure storage item:', error);
			return false;
		}
	}
	
	/**
	 * Get item from secure storage
	 */
	static getItem(key: string): string | null {
		if (!browser) return null;
		
		try {
			const encrypted = sessionStorage.getItem(`sec_${key}`);
			return encrypted ? this.decrypt(encrypted) : null;
		} catch (error) {
			console.error('Failed to get secure storage item:', error);
			return null;
		}
	}
	
	/**
	 * Get item and parse as JSON
	 */
	static getItemParsed<T>(key: string): T | null {
		const item = this.getItem(key);
		if (!item) return null;
		
		try {
			return JSON.parse(item);
		} catch (error) {
			console.error('Failed to parse stored item:', error);
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
	}
	
	/**
	 * Migrate data from localStorage to secure storage
	 */
	static migrateFromLocalStorage(key: string): void {
		if (!browser) return;
		
		try {
			const oldData = localStorage.getItem(key);
			if (oldData) {
				this.setItem(key, oldData);
				localStorage.removeItem(key);
				console.log(`Migrated ${key} from localStorage to secure storage`);
			}
		} catch (error) {
			console.error(`Failed to migrate ${key}:`, error);
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
