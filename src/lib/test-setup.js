import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock SvelteKit modules
vi.mock('$app/environment', () => ({
	dev: true
}));

vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn(() => vi.fn())
	}
}));

// Global test utilities
global.ResizeObserver = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}));

global.IntersectionObserver = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}));

// Mock fetch for API tests
global.fetch = vi.fn();

// Suppress console warnings in tests
const originalConsoleWarn = console.warn;
console.warn = (message, ...args) => {
	// Suppress known warnings
	if (typeof message === 'string' && (
		message.includes('SvelteKitError') ||
		message.includes('unknown prop')
	)) {
		return;
	}
	originalConsoleWarn(message, ...args);
};
