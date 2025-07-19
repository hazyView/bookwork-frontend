import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sanitizeHTML, isValidEmail, isValidPhone, validateName, validateFormData, formSubmissionLimiter } from './validation.js';

describe('Input Validation and Sanitization', () => {
	describe('sanitizeHTML', () => {
		it('should sanitize HTML entities', () => {
			const input = '<script>alert("xss")</script>';
			const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;';
			expect(sanitizeHTML(input)).toBe(expected);
		});

		it('should handle empty strings', () => {
			expect(sanitizeHTML('')).toBe('');
		});

		it('should handle non-string inputs', () => {
			// @ts-ignore - Testing invalid inputs
			expect(sanitizeHTML(null)).toBe('');
			// @ts-ignore - Testing invalid inputs
			expect(sanitizeHTML(undefined)).toBe('');
			// @ts-ignore - Testing invalid inputs
			expect(sanitizeHTML(123)).toBe('');
		});
	});

	describe('isValidEmail', () => {
		it('should validate correct email addresses', () => {
			expect(isValidEmail('test@example.com')).toBe(true);
			expect(isValidEmail('user.name+tag@example.org')).toBe(true);
			expect(isValidEmail('x@example.co.uk')).toBe(true);
		});

		it('should reject invalid email addresses', () => {
			expect(isValidEmail('invalid-email')).toBe(false);
			expect(isValidEmail('@example.com')).toBe(false);
			expect(isValidEmail('test@')).toBe(false);
			expect(isValidEmail('')).toBe(false);
			// @ts-ignore - Testing invalid inputs
			expect(isValidEmail(null)).toBe(false);
		});

		it('should reject emails that are too long', () => {
			const longEmail = 'a'.repeat(250) + '@example.com';
			expect(isValidEmail(longEmail)).toBe(false);
		});
	});

	describe('isValidPhone', () => {
		it('should validate correct phone numbers', () => {
			expect(isValidPhone('(555) 123-4567')).toBe(true);
			expect(isValidPhone('555-123-4567')).toBe(true);
			expect(isValidPhone('+1 555 123 4567')).toBe(true);
			expect(isValidPhone('5551234567')).toBe(true);
		});

		it('should reject invalid phone numbers', () => {
			expect(isValidPhone('123')).toBe(false);
			expect(isValidPhone('abc-def-ghij')).toBe(false);
			expect(isValidPhone('')).toBe(false);
			// @ts-ignore - Testing invalid inputs
			expect(isValidPhone(null)).toBe(false);
		});
	});

	describe('validateName', () => {
		it('should validate and sanitize correct names', () => {
			expect(validateName('John Doe')).toBe('John Doe');
			expect(validateName("O'Connor")).toBe("O&#x27;Connor");
			expect(validateName('Mary-Jane')).toBe('Mary-Jane');
		});

		it('should reject invalid names', () => {
			expect(validateName('John123')).toBe(null);
			expect(validateName('<script>')).toBe(null);
			expect(validateName('')).toBe(null);
			expect(validateName('a'.repeat(101))).toBe(null);
			// @ts-ignore - Testing invalid inputs
			expect(validateName(null)).toBe(null);
		});

		it('should trim whitespace', () => {
			expect(validateName('  John Doe  ')).toBe('John Doe');
		});
	});

	describe('validateFormData', () => {
		const schema = {
			name: { type: 'name', required: true },
			email: { type: 'email', required: true },
			phone: { type: 'phone', required: false },
			message: { type: 'text', required: true, maxLength: 500 }
		};

		it('should validate correct form data', () => {
			const formData = {
				name: 'John Doe',
				email: 'john@example.com',
				phone: '555-123-4567',
				message: 'Hello world'
			};

			const result = validateFormData(formData, schema);
			expect(result.isValid).toBe(true);
			expect(result.errors).toEqual({});
			expect(result.sanitized.name).toBe('John Doe');
			expect(result.sanitized.email).toBe('john@example.com');
		});

		it('should catch validation errors', () => {
			const formData = {
				name: '',
				email: 'invalid-email',
				message: 'a'.repeat(501)
			};

			const result = validateFormData(formData, schema);
			expect(result.isValid).toBe(false);
			expect(result.errors.name).toBe('This field is required');
			expect(result.errors.email).toBe('Please enter a valid email address');
			expect(result.errors.message).toBe('Maximum 500 characters allowed');
		});

		it('should handle optional fields', () => {
			const formData = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Hello'
			};

			const result = validateFormData(formData, schema);
			expect(result.isValid).toBe(true);
			expect(result.sanitized.phone).toBe('');
		});
	});

	describe('Rate Limiting', () => {
		beforeEach(() => {
			formSubmissionLimiter.requests.clear();
		});

		it('should allow requests under the limit', () => {
			expect(formSubmissionLimiter.isLimited('user1')).toBe(false);
			expect(formSubmissionLimiter.isLimited('user1')).toBe(false);
		});

		it('should block requests over the limit', () => {
			// Make maximum allowed requests
			for (let i = 0; i < 5; i++) {
				formSubmissionLimiter.isLimited('user1');
			}
			// Next request should be blocked
			expect(formSubmissionLimiter.isLimited('user1')).toBe(true);
		});

		it('should handle different users separately', () => {
			for (let i = 0; i < 5; i++) {
				formSubmissionLimiter.isLimited('user1');
			}
			expect(formSubmissionLimiter.isLimited('user1')).toBe(true);
			expect(formSubmissionLimiter.isLimited('user2')).toBe(false);
		});
	});
});
