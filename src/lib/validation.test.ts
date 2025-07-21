import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
	sanitizeHTML, 
	validateEmail, 
	validatePhone, 
	validateName, 
	validateFormData,
	emailSchema,
	phoneSchema,
	nameSchema
} from './validation';
import { z } from 'zod';

describe('Input Validation and Sanitization', () => {
	describe('sanitizeHTML', () => {
		it('should sanitize HTML entities', () => {
			const input = '<script>alert("xss")</script>';
			const result = sanitizeHTML(input);
			expect(result).not.toContain('<script>');
			expect(result).not.toContain('alert');
		});

		it('should handle empty strings', () => {
			expect(sanitizeHTML('')).toBe('');
		});

		it('should handle different sanitization levels', () => {
			const input = '<p><strong>Bold text</strong> and <script>alert("xss")</script></p>';
			
			// Strict mode should remove all HTML
			const strict = sanitizeHTML(input, 'strict');
			expect(strict).not.toContain('<');
			
			// Basic mode should allow basic formatting
			const basic = sanitizeHTML(input, 'basic');
			expect(basic).toContain('<strong>');
			expect(basic).not.toContain('<script>');
			
			// Rich mode should allow more HTML but still sanitize dangerous content
			const rich = sanitizeHTML(input, 'rich');
			expect(rich).toContain('<p>');
			expect(rich).not.toContain('<script>');
		});
	});

	describe('validateEmail', () => {
		it('should validate correct email addresses', () => {
			expect(validateEmail('test@example.com').isValid).toBe(true);
			expect(validateEmail('user.name+tag@example.org').isValid).toBe(true);
			expect(validateEmail('x@example.co.uk').isValid).toBe(true);
		});

		it('should reject invalid email addresses', () => {
			expect(validateEmail('invalid-email').isValid).toBe(false);
			expect(validateEmail('@example.com').isValid).toBe(false);
			expect(validateEmail('test@').isValid).toBe(false);
			expect(validateEmail('').isValid).toBe(false);
		});

		it('should use emailSchema with Zod', () => {
			expect(() => emailSchema.parse('test@example.com')).not.toThrow();
			expect(() => emailSchema.parse('invalid')).toThrow();
		});
	});

	describe('validatePhone', () => {
		it('should validate correct phone numbers', () => {
			expect(validatePhone('(555) 123-4567').isValid).toBe(true);
			expect(validatePhone('555-123-4567').isValid).toBe(true);
			expect(validatePhone('+1 555 123 4567').isValid).toBe(true);
			expect(validatePhone('5551234567').isValid).toBe(true);
		});

		it('should reject invalid phone numbers', () => {
			expect(validatePhone('123').isValid).toBe(false);
			expect(validatePhone('abc-def-ghij').isValid).toBe(false);
			expect(validatePhone('').isValid).toBe(false);
		});

		it('should use phoneSchema with Zod', () => {
			expect(() => phoneSchema.parse('555-123-4567')).not.toThrow();
			expect(() => phoneSchema.parse('123')).toThrow();
		});
	});

	describe('validateName', () => {
		it('should validate and sanitize correct names', () => {
			const result1 = validateName('John Doe');
			expect(result1.isValid).toBe(true);
			expect(result1.name).toBe('John Doe');
			
			const result2 = validateName("O'Connor");
			expect(result2.isValid).toBe(true);
			expect(result2.name).toBeDefined();
			
			const result3 = validateName('Mary-Jane');
			expect(result3.isValid).toBe(true);
			expect(result3.name).toBe('Mary-Jane');
		});

		it('should reject invalid names', () => {
			expect(validateName('John123').isValid).toBe(false);
			expect(validateName('<script>').isValid).toBe(false);
			expect(validateName('').isValid).toBe(false);
			expect(validateName('a'.repeat(101)).isValid).toBe(false);
		});

		it('should use nameSchema with Zod', () => {
			expect(() => nameSchema.parse('John Doe')).not.toThrow();
			expect(() => nameSchema.parse('')).toThrow();
		});
	});

	describe('validateFormData', () => {
		const schema = z.object({
			name: nameSchema,
			email: emailSchema,
			phone: phoneSchema.optional(),
			message: z.string().min(1, 'Message is required').max(500, 'Message too long')
		});

		it('should validate correct form data', () => {
			const formData = {
				name: 'John Doe',
				email: 'john@example.com',
				phone: '555-123-4567',
				message: 'Hello world'
			};

			const result = validateFormData(formData, schema);
			expect(result.isValid).toBe(true);
			if (result.data) {
				expect(result.data.name).toBe('John Doe');
				expect(result.data.email).toBe('john@example.com');
			}
		});

		it('should catch validation errors', () => {
			const formData = {
				name: '',
				email: 'invalid-email',
				message: 'a'.repeat(501)
			};

			const result = validateFormData(formData, schema);
			expect(result.isValid).toBe(false);
			expect(Object.keys(result.errors).length).toBeGreaterThan(0);
		});

		it('should handle optional fields', () => {
			const formData = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Hello'
			};

			const result = validateFormData(formData, schema);
			expect(result.isValid).toBe(true);
		});
	});
});
