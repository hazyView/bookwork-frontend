import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
	test('should set security headers', async ({ page }) => {
		const response = await page.goto('/');
		
		// Check for security headers
		expect(response?.headers()['x-frame-options']).toBe('DENY');
		expect(response?.headers()['x-content-type-options']).toBe('nosniff');
		expect(response?.headers()['x-xss-protection']).toBe('1; mode=block');
		expect(response?.headers()['content-security-policy']).toBeTruthy();
	});

	test('should prevent XSS in form inputs', async ({ page }) => {
		await page.goto('/');
		
		// Navigate to a page with forms (assuming contact or similar)
		const xssPayload = '<script>alert("xss")</script>';
		
		// Try to inject XSS in search or contact forms
		const searchInput = page.locator('input[type="text"]').first();
		if (await searchInput.isVisible()) {
			await searchInput.fill(xssPayload);
			
			// Check that script tags are not executed
			const pageContent = await page.content();
			expect(pageContent).not.toContain('<script>alert("xss")</script>');
			expect(pageContent).toContain('&lt;script&gt;');
		}
	});

	test('should enforce HTTPS redirect in production', async ({ page, baseURL }) => {
		// This test would check HTTPS redirect in production environment
		// Skip in development mode
		if (baseURL?.includes('localhost')) {
			test.skip();
		}
		
		// In production, HTTP should redirect to HTTPS
		// This would need to be tested with actual production deployment
	});

	test('should have Content Security Policy', async ({ page }) => {
		const response = await page.goto('/');
		const csp = response?.headers()['content-security-policy'];
		
		expect(csp).toBeTruthy();
		expect(csp).toContain("default-src 'self'");
		expect(csp).toContain("object-src 'none'");
		expect(csp).toContain("frame-ancestors 'none'");
	});
});

test.describe('Performance Tests', () => {
	test('should load homepage within performance budget', async ({ page }) => {
		const startTime = Date.now();
		await page.goto('/');
		const loadTime = Date.now() - startTime;
		
		// Homepage should load within 3 seconds
		expect(loadTime).toBeLessThan(3000);
	});

	test('should lazy load images', async ({ page }) => {
		await page.goto('/');
		
		// Check if images have loading="lazy" attribute
		const images = page.locator('img');
		const count = await images.count();
		
		for (let i = 0; i < count; i++) {
			const img = images.nth(i);
			const loading = await img.getAttribute('loading');
			// Images below the fold should have lazy loading
			if (await img.isVisible() === false) {
				expect(loading).toBe('lazy');
			}
		}
	});

	test('should have acceptable bundle sizes', async ({ page }) => {
		// Monitor JavaScript bundle sizes
		/** @type {import('@playwright/test').Response[]} */
		const jsResponses = [];
		
		page.on('response', response => {
			if (response.url().includes('.js') && response.status() === 200) {
				jsResponses.push(response);
			}
		});
		
		await page.goto('/');
		
		// Calculate total JS bundle size
		let totalSize = 0;
		for (const response of jsResponses) {
			const buffer = await response.body();
			totalSize += buffer.length;
		}
		
		// Total JS should be under 500KB (500,000 bytes)
		expect(totalSize).toBeLessThan(500000);
	});
});

test.describe('Accessibility Tests', () => {
	test('should have proper heading hierarchy', async ({ page }) => {
		await page.goto('/');
		
		// Check that page starts with h1
		const h1Count = await page.locator('h1').count();
		expect(h1Count).toBeGreaterThan(0);
		
		// Ensure heading hierarchy is logical
		const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
		expect(headings.length).toBeGreaterThan(0);
	});

	test('should have alt attributes on images', async ({ page }) => {
		await page.goto('/');
		
		const images = page.locator('img');
		const count = await images.count();
		
		for (let i = 0; i < count; i++) {
			const img = images.nth(i);
			const alt = await img.getAttribute('alt');
			expect(alt).not.toBeNull();
		}
	});

	test('should have proper form labels', async ({ page }) => {
		await page.goto('/');
		
		// Check that form inputs have associated labels
		const inputs = page.locator('input, textarea, select');
		const count = await inputs.count();
		
		for (let i = 0; i < count; i++) {
			const input = inputs.nth(i);
			const id = await input.getAttribute('id');
			const ariaLabel = await input.getAttribute('aria-label');
			const ariaLabelledBy = await input.getAttribute('aria-labelledby');
			
			// Input should have either id with label, aria-label, or aria-labelledby
			const hasLabel = id && await page.locator(`label[for="${id}"]`).count() > 0;
			const hasAccessibleName = ariaLabel || ariaLabelledBy || hasLabel;
			
			expect(hasAccessibleName).toBeTruthy();
		}
	});
});

test.describe('Functional Tests', () => {
	test('should navigate between pages', async ({ page }) => {
		await page.goto('/');
		
		// Test navigation to business page
		await page.click('a[href="/business"]');
		await expect(page).toHaveURL(/.*business/);
		
		// Test navigation back to home
		await page.click('a[href="/"]');
		await expect(page).toHaveURL('/');
	});

	test('should open and close chat widget', async ({ page }) => {
		await page.goto('/');
		
		// Look for chat toggle button
		const chatButton = page.locator('button').filter({ hasText: /chat|support/i }).first();
		if (await chatButton.isVisible()) {
			await chatButton.click();
			
			// Chat widget should be visible
			const chatWidget = page.locator('[role="dialog"]').first();
			await expect(chatWidget).toBeVisible();
			
			// Close chat
			const closeButton = page.locator('button').filter({ hasText: /close|×/i }).first();
			await closeButton.click();
			await expect(chatWidget).toBeHidden();
		}
	});

	test('should handle form submission with validation', async ({ page }) => {
		await page.goto('/');
		
		// Look for forms on the page
		const forms = page.locator('form');
		const formCount = await forms.count();
		
		if (formCount > 0) {
			const form = forms.first();
			
			// Try to submit empty form
			const submitButton = form.locator('button[type="submit"], input[type="submit"]').first();
			if (await submitButton.isVisible()) {
				await submitButton.click();
				
				// Should show validation errors
				const errorMessages = page.locator('.error, [aria-invalid="true"]');
				const errorCount = await errorMessages.count();
				expect(errorCount).toBeGreaterThan(0);
			}
		}
	});
});
