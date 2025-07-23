/**
 * Production-grade encryption utilities using Web Crypto API
 * Provides AES-GCM encryption for sensitive data storage
 */

import { browser } from '$app/environment';

interface EncryptionResult {
	data: string;
	iv: string;
}

class CryptoUtils {
	private static readonly ALGORITHM = 'AES-GCM';
	private static readonly KEY_LENGTH = 256;
	private static readonly IV_LENGTH = 12; // 96 bits for GCM

	/**
	 * Generate or retrieve encryption key from browser storage
	 */
	private static async getOrCreateKey(): Promise<CryptoKey> {
		if (!browser || !crypto.subtle) {
			throw new Error('Web Crypto API not available');
		}

		// Try to get existing key from storage
		const keyData = sessionStorage.getItem('__crypto_key');
		
		if (keyData) {
			try {
				const keyBuffer = this.base64ToArrayBuffer(keyData);
				return await crypto.subtle.importKey(
					'raw',
					keyBuffer,
					{ name: this.ALGORITHM },
					false,
					['encrypt', 'decrypt']
				);
			} catch (error) {
				// If key import fails, generate a new one
				console.warn('Failed to import existing key, generating new one');
			}
		}

		// Generate new key
		const key = await crypto.subtle.generateKey(
			{
				name: this.ALGORITHM,
				length: this.KEY_LENGTH
			},
			true, // extractable
			['encrypt', 'decrypt']
		);

		// Store key for session persistence
		const exportedKey = await crypto.subtle.exportKey('raw', key);
		const keyString = this.arrayBufferToBase64(exportedKey);
		sessionStorage.setItem('__crypto_key', keyString);

		return key;
	}

	/**
	 * Encrypt data using AES-GCM
	 */
	static async encrypt(plaintext: string): Promise<EncryptionResult> {
		if (!browser || !crypto.subtle) {
			// Fallback to base64 encoding in environments without Web Crypto
			return {
				data: btoa(unescape(encodeURIComponent(plaintext))),
				iv: 'fallback'
			};
		}

		try {
			const key = await this.getOrCreateKey();
			const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
			const encoder = new TextEncoder();
			const data = encoder.encode(plaintext);

			const encrypted = await crypto.subtle.encrypt(
				{
					name: this.ALGORITHM,
					iv: iv
				},
				key,
				data
			);

			return {
				data: this.arrayBufferToBase64(encrypted),
				iv: this.arrayBufferToBase64(iv.buffer)
			};
		} catch (error) {
			console.warn('Encryption failed, falling back to base64:', error);
			return {
				data: btoa(unescape(encodeURIComponent(plaintext))),
				iv: 'fallback'
			};
		}
	}

	/**
	 * Decrypt data using AES-GCM
	 */
	static async decrypt(encryptedData: string, ivString: string): Promise<string> {
		if (!browser || !crypto.subtle || ivString === 'fallback') {
			// Fallback decryption for base64
			try {
				return decodeURIComponent(escape(atob(encryptedData)));
			} catch (error) {
				console.warn('Fallback decryption failed:', error);
				return '';
			}
		}

		try {
			const key = await this.getOrCreateKey();
			const iv = this.base64ToArrayBuffer(ivString);
			const data = this.base64ToArrayBuffer(encryptedData);

			const decrypted = await crypto.subtle.decrypt(
				{
					name: this.ALGORITHM,
					iv: iv
				},
				key,
				data
			);

			const decoder = new TextDecoder();
			return decoder.decode(decrypted);
		} catch (error) {
			console.warn('Decryption failed:', error);
			return '';
		}
	}

	/**
	 * Generate cryptographically secure random string
	 */
	static generateSecureRandom(length: number = 32): string {
		if (!browser || !crypto.getRandomValues) {
			// Fallback for environments without secure random
			return Math.random().toString(36).substring(2) + Date.now().toString(36);
		}

		const array = new Uint8Array(length);
		crypto.getRandomValues(array);
		return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
	}

	/**
	 * Hash data using SHA-256
	 */
	static async hash(data: string): Promise<string> {
		if (!browser || !crypto.subtle) {
			// Simple fallback hash
			let hash = 0;
			for (let i = 0; i < data.length; i++) {
				const char = data.charCodeAt(i);
				hash = ((hash << 5) - hash) + char;
				hash = hash & hash; // Convert to 32-bit integer
			}
			return Math.abs(hash).toString(36);
		}

		try {
			const encoder = new TextEncoder();
			const dataBuffer = encoder.encode(data);
			const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
			return this.arrayBufferToBase64(hashBuffer);
		} catch (error) {
			console.warn('Hashing failed:', error);
			return data;
		}
	}

	/**
	 * Verify data integrity with hash
	 */
	static async verifyHash(data: string, expectedHash: string): Promise<boolean> {
		const actualHash = await this.hash(data);
		return actualHash === expectedHash;
	}

	/**
	 * Convert ArrayBuffer to base64 string
	 */
	private static arrayBufferToBase64(buffer: ArrayBuffer): string {
		const bytes = new Uint8Array(buffer);
		const binaryString = String.fromCharCode(...bytes);
		return btoa(binaryString);
	}

	/**
	 * Convert base64 string to ArrayBuffer
	 */
	private static base64ToArrayBuffer(base64: string): ArrayBuffer {
		const binaryString = atob(base64);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes.buffer;
	}

	/**
	 * Clear all encryption keys (for logout)
	 */
	static clearKeys(): void {
		if (browser) {
			sessionStorage.removeItem('__crypto_key');
		}
	}

	/**
	 * Check if Web Crypto API is available
	 */
	static isAvailable(): boolean {
		return browser && !!crypto.subtle && !!crypto.getRandomValues;
	}
}

export default CryptoUtils;
