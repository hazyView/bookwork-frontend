/**
 * Input validation and sanitization utilities
 * Provides comprehensive client-side validation with security focus
 */

/**
 * Sanitize HTML content to prevent XSS
 * @param {string} input
 * @returns {string}
 */
export function sanitizeHTML(input) {
	if (typeof input !== 'string') return '';
	
	// Basic HTML entity encoding
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.replace(/\//g, '&#x2F;');
}

/**
 * Validate email address
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
	if (typeof email !== 'string') return false;
	
	const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number (basic international format)
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
	if (typeof phone !== 'string') return false;
	
	// Remove all non-digit characters for validation
	const digitsOnly = phone.replace(/\D/g, '');
	return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

/**
 * Validate and sanitize user name
 * @param {string} name
 * @returns {string|null}
 */
export function validateName(name) {
	if (typeof name !== 'string') return null;
	
	// Trim and check length
	const trimmed = name.trim();
	if (trimmed.length < 1 || trimmed.length > 100) return null;
	
	// Allow letters, spaces, hyphens, apostrophes
	const nameRegex = /^[a-zA-Z\s\-']+$/;
	if (!nameRegex.test(trimmed)) return null;
	
	return sanitizeHTML(trimmed);
}

/**
 * Validate URL
 * @param {string} url
 * @returns {boolean}
 */
export function isValidURL(url) {
	if (typeof url !== 'string') return false;
	
	try {
		const urlObj = new URL(url);
		return ['http:', 'https:'].includes(urlObj.protocol);
	} catch {
		return false;
	}
}

/**
 * Sanitize and validate form data
 * @param {Record<string, any>} formData
 * @param {Record<string, any>} schema
 * @returns {{isValid: boolean, errors: Record<string, string>, sanitized: Record<string, any>}}
 */
export function validateFormData(formData, schema) {
	/** @type {Record<string, string>} */
	const errors = {};
	/** @type {Record<string, any>} */
	const sanitized = {};
	let isValid = true;
	
	for (const [field, rules] of Object.entries(schema)) {
		const value = formData[field];
		
		// Required field check
		if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
			errors[field] = 'This field is required';
			isValid = false;
			continue;
		}
		
		// Skip validation for optional empty fields
		if (!value && !rules.required) {
			sanitized[field] = '';
			continue;
		}
		
		// Type-specific validation
		switch (rules.type) {
			case 'email':
				if (!isValidEmail(value)) {
					errors[field] = 'Please enter a valid email address';
					isValid = false;
				} else {
					sanitized[field] = value.toLowerCase().trim();
				}
				break;
				
			case 'phone':
				if (!isValidPhone(value)) {
					errors[field] = 'Please enter a valid phone number';
					isValid = false;
				} else {
					sanitized[field] = value.trim();
				}
				break;
				
			case 'name':
				const sanitizedName = validateName(value);
				if (!sanitizedName) {
					errors[field] = 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)';
					isValid = false;
				} else {
					sanitized[field] = sanitizedName;
				}
				break;
				
			case 'url':
				if (!isValidURL(value)) {
					errors[field] = 'Please enter a valid URL';
					isValid = false;
				} else {
					sanitized[field] = value.trim();
				}
				break;
				
			case 'text':
				if (rules.maxLength && value.length > rules.maxLength) {
					errors[field] = `Maximum ${rules.maxLength} characters allowed`;
					isValid = false;
				} else if (rules.minLength && value.length < rules.minLength) {
					errors[field] = `Minimum ${rules.minLength} characters required`;
					isValid = false;
				} else {
					sanitized[field] = sanitizeHTML(value.trim());
				}
				break;
				
			default:
				sanitized[field] = sanitizeHTML(String(value));
		}
	}
	
	return { isValid, errors, sanitized };
}

/**
 * Rate limiting for client actions
 */
class ClientRateLimiter {
	constructor(maxRequests = 10, windowMs = 60000) {
		this.maxRequests = maxRequests;
		this.windowMs = windowMs;
		this.requests = new Map();
	}
	
	/**
	 * Check if action is rate limited
	 * @param {string} key - Unique identifier for the action
	 * @returns {boolean}
	 */
	isLimited(key) {
		const now = Date.now();
		const userRequests = this.requests.get(key) || [];
		
		// Remove old requests outside the window
		const validRequests = userRequests.filter(/** @param {number} time */ time => now - time < this.windowMs);
		
		if (validRequests.length >= this.maxRequests) {
			return true;
		}
		
		// Add current request
		validRequests.push(now);
		this.requests.set(key, validRequests);
		
		return false;
	}
}

export const formSubmissionLimiter = new ClientRateLimiter(5, 60000); // 5 submissions per minute
export const searchLimiter = new ClientRateLimiter(30, 60000); // 30 searches per minute
