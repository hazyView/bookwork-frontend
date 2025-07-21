/**
 * Test setup configuration for Vitest
 * TypeScript version with proper type definitions
 */

import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// Mock SvelteKit modules
vi.mock('$app/environment', () => ({
	dev: true,
	building: false,
	version: 'test'
}));

vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn(() => vi.fn())
	},
	navigating: {
		subscribe: vi.fn(() => vi.fn())
	},
	updated: {
		subscribe: vi.fn(() => vi.fn())
	}
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
	invalidate: vi.fn(),
	invalidateAll: vi.fn(),
	preloadData: vi.fn(),
	preloadCode: vi.fn(),
	beforeNavigate: vi.fn(),
	afterNavigate: vi.fn()
}));

// Global test utilities with proper types
(globalThis as any).ResizeObserver = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}));

(globalThis as any).IntersectionObserver = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
	root: null,
	rootMargin: '',
	thresholds: []
}));

// Mock Performance API
Object.defineProperty(window, 'performance', {
	value: {
		now: vi.fn(() => Date.now()),
		mark: vi.fn(),
		measure: vi.fn(),
		getEntriesByName: vi.fn(() => []),
		getEntriesByType: vi.fn(() => [])
	},
	writable: true
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
	value: {
		getItem: vi.fn((key: string) => null),
		setItem: vi.fn((key: string, value: string) => {}),
		removeItem: vi.fn((key: string) => {}),
		clear: vi.fn(() => {}),
		length: 0,
		key: vi.fn((index: number) => null)
	},
	writable: true
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
	value: {
		getItem: vi.fn((key: string) => null),
		setItem: vi.fn((key: string, value: string) => {}),
		removeItem: vi.fn((key: string) => {}),
		clear: vi.fn(() => {}),
		length: 0,
		key: vi.fn((index: number) => null)
	},
	writable: true
});

// Mock fetch for API tests
(globalThis as any).fetch = vi.fn();

// Mock crypto.randomUUID for ID generation
Object.defineProperty(globalThis, 'crypto', {
	value: {
		randomUUID: vi.fn(() => 'mock-uuid-' + Math.random().toString(36).substr(2, 9))
	}
});

// Mock URL constructor for browser compatibility
Object.defineProperty(globalThis, 'URL', {
	value: class MockURL {
		constructor(public href: string, base?: string) {}
		toString() { return this.href; }
	}
});

// Suppress console warnings in tests
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = (message: any, ...args: any[]) => {
	// Suppress known warnings
	if (typeof message === 'string' && (
		message.includes('SvelteKitError') ||
		message.includes('unknown prop') ||
		message.includes('Unused CSS selector') ||
		message.includes('deprecated')
	)) {
		return;
	}
	originalConsoleWarn(message, ...args);
};

console.error = (message: any, ...args: any[]) => {
	// Suppress known test errors
	if (typeof message === 'string' && (
		message.includes('Not implemented: HTMLCanvasElement') ||
		message.includes('Not implemented: navigation')
	)) {
		return;
	}
	originalConsoleError(message, ...args);
};

// Test utilities
export const createMockEvent = (type: string, eventInit?: EventInit) => {
	return new Event(type, eventInit);
};

export const createMockKeyboardEvent = (type: string, key: string, eventInit?: KeyboardEventInit) => {
	return new KeyboardEvent(type, { key, ...eventInit });
};

export const createMockMouseEvent = (type: string, eventInit?: MouseEventInit) => {
	return new MouseEvent(type, eventInit);
};

// Mock API responses
export const mockApiResponse = <T>(data: T, status = 200, ok = true) => ({
	ok,
	status,
	json: vi.fn().mockResolvedValue(data),
	text: vi.fn().mockResolvedValue(JSON.stringify(data)),
	headers: new Headers(),
	statusText: ok ? 'OK' : 'Error'
});

// Reset all mocks after each test
export const resetAllMocks = () => {
	vi.clearAllMocks();
	const globalAny = globalThis as any;
	if (globalAny.fetch?.mockClear) globalAny.fetch.mockClear();
	if (globalAny.localStorage?.getItem?.mockClear) globalAny.localStorage.getItem.mockClear();
	if (globalAny.localStorage?.setItem?.mockClear) globalAny.localStorage.setItem.mockClear();
	if (globalAny.sessionStorage?.getItem?.mockClear) globalAny.sessionStorage.getItem.mockClear();
	if (globalAny.sessionStorage?.setItem?.mockClear) globalAny.sessionStorage.setItem.mockClear();
};

// Test environment setup
beforeEach(() => {
	// Reset DOM
	document.head.innerHTML = '';
	document.body.innerHTML = '';
	
	// Reset mocks
	resetAllMocks();
});

afterEach(() => {
	// Cleanup after each test
	vi.clearAllTimers();
});
