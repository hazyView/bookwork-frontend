/**
 * Performance optimization utilities
 * Implements caching, image optimization, and bundle optimization
 */
// @ts-nocheck

/**
 * Cache utility for storing and retrieving data
 */
class CacheManager {
	constructor() {
		this.cache = new Map();
		this.maxSize = 100; // Maximum cache entries
		this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
	}
	
	/**
	 * Set cache entry with TTL
	 * @param {string} key
	 * @param {any} value
	 * @param {number} ttl - Time to live in milliseconds
	 */
	set(key, value, ttl = this.defaultTTL) {
		// Evict oldest entries if cache is full
		if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;
			this.cache.delete(firstKey);
		}
		
		this.cache.set(key, {
			value,
			expires: Date.now() + ttl
		});
	}
	
	/**
	 * Get cache entry if not expired
	 * @param {string} key
	 * @returns {any|null}
	 */
	get(key) {
		const entry = this.cache.get(key);
		if (!entry) return null;
		
		if (Date.now() > entry.expires) {
			this.cache.delete(key);
			return null;
		}
		
		return entry.value;
	}
	
	/**
	 * Clear expired entries
	 */
	cleanup() {
		const now = Date.now();
		for (const [key, entry] of this.cache.entries()) {
			if (now > entry.expires) {
				this.cache.delete(key);
			}
		}
	}
	
	/**
	 * Clear all cache entries
	 */
	clear() {
		this.cache.clear();
	}
}

export const apiCache = new CacheManager();

/**
 * Debounce function calls
 * @param {Function} func
 * @param {number} delay
 * @returns {Function}
 */
export function debounce(func, delay) {
	/** @type {number|undefined} */
	let timeoutId;
	return function (...args) {
		clearTimeout(timeoutId);
		// @ts-ignore
		timeoutId = setTimeout(() => func.apply(this, args), delay);
	};
}

/**
 * Throttle function calls
 * @param {Function} func
 * @param {number} delay
 * @returns {Function}
 */
export function throttle(func, delay) {
	let lastCall = 0;
	return function (...args) {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			// @ts-ignore
			func.apply(this, args);
		}
	};
}

/**
 * Lazy loading intersection observer
 * @param {Element} target
 * @param {Function} callback
 * @param {{root?: Element|null, rootMargin?: string, threshold?: number}} options
 */
export function observeIntersection(target, callback, options = {}) {
	const defaultOptions = {
		root: null,
		rootMargin: '50px',
		threshold: 0.1
	};
	
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				callback(entry.target);
				observer.unobserve(entry.target);
			}
		});
	}, { ...defaultOptions, ...options });
	
	observer.observe(target);
	return observer;
}

/**
 * Image optimization utility
 * @param {string} src
 * @param {{width?: number, height?: number, quality?: number, format?: string}} options
 * @returns {string}
 */
export function optimizeImage(src, options = {}) {
	const {
		width = 800,
		height = 600,
		quality = 85,
		format = 'webp'
	} = options;
	
	// In production, this would integrate with an image CDN like Cloudinary
	// For now, return original src with parameters for future implementation
	const params = new URLSearchParams({
		w: width.toString(),
		h: height.toString(),
		q: quality.toString(),
		f: format
	});
	
	// If using a CDN, would return: `https://cdn.example.com/image?${params}&src=${encodeURIComponent(src)}`
	return src; // Return original for now
}

/**
 * Preload critical resources
 * @param {Array<{href: string, as: string, type?: string}>} resources
 */
export function preloadResources(resources) {
	if (typeof window === 'undefined') return;
	
	resources.forEach(resource => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.href = resource.href;
		link.as = resource.as;
		if (resource.type) link.type = resource.type;
		
		document.head.appendChild(link);
	});
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
	constructor() {
		this.marks = new Map();
		this.measures = new Map();
	}
	
	/**
	 * Start performance mark
	 * @param {string} name
	 */
	mark(name) {
		if (typeof performance !== 'undefined') {
			performance.mark(`${name}-start`);
			this.marks.set(name, Date.now());
		}
	}
	
	/**
	 * End performance mark and measure
	 * @param {string} name
	 * @returns {number|null} Duration in milliseconds
	 */
	measure(name) {
		if (typeof performance !== 'undefined') {
			performance.mark(`${name}-end`);
			try {
				performance.measure(name, `${name}-start`, `${name}-end`);
				const measure = performance.getEntriesByName(name)[0];
				const duration = measure.duration;
				this.measures.set(name, duration);
				return duration;
			} catch (error) {
				console.warn(`Failed to measure ${name}:`, error);
			}
		}
		
		// Fallback measurement
		const startTime = this.marks.get(name);
		if (startTime) {
			const duration = Date.now() - startTime;
			this.measures.set(name, duration);
			return duration;
		}
		
		return null;
	}
	
	/**
	 * Get all measurements
	 * @returns {Object}
	 */
	getReport() {
		return Object.fromEntries(this.measures);
	}
}

export const perfMonitor = new PerformanceMonitor();

// Cleanup cache periodically
if (typeof window !== 'undefined') {
	setInterval(() => {
		apiCache.cleanup();
	}, 5 * 60 * 1000); // Every 5 minutes
}
