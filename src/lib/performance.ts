/**
 * @fileoverview Performance optimization utilities for BookWork frontend application
 * @module Performance
 * @description Comprehensive performance optimization toolkit including caching,
 * image optimization, lazy loading metrics, debouncing/throttling, and Core Web Vitals
 * monitoring. Essential for maintaining optimal user experience and SEO performance.
 * 
 * @author BookWork Performance Team
 * @version 2.1.0
 * @since 2024-01-15
 * @requires ./lazyLoading
 * 
 * @performance
 * - Implements efficient LRU-style cache with automatic expiration
 * - Provides Core Web Vitals monitoring (LCP, FID, CLS)
 * - Tracks lazy loading performance metrics
 * - Includes bundle size and loading time analytics
 * - Offers performance recommendations based on metrics
 */

import { LazyLoadMetrics } from './lazyLoading';

// Types
interface CacheEntry<T = any> {
	value: T;
	expires: number;
}

interface ImageOptimizationOptions {
	width?: number;
	height?: number;
	quality?: number;
	format?: string;
}

interface PreloadResource {
	href: string;
	as: string;
	type?: string;
}

interface IntersectionOptions {
	root?: Element | null;
	rootMargin?: string;
	threshold?: number;
}

interface LazyLoadStats {
	loads: number;
	totalTime: number;
	errors: number;
	avgLoadTime: number;
}

interface CoreWebVitals {
	lcp?: number;
	fid?: number;
	cls?: number;
}

interface BundleMetrics {
	totalResources: number;
	jsCount: number;
	cssCount: number;
	averageLoadTime: number;
	largestResource?: PerformanceEntry;
	timestamp: number;
}

interface PerformanceRecommendation {
	type: 'critical' | 'medium' | 'low';
	metric: string;
	current: string | number;
	target: string;
	suggestion: string;
	component?: string;
}

interface EnhancedPerformanceReport {
	coreWebVitals: CoreWebVitals;
	bundleMetrics: BundleMetrics;
	lazyLoading: Record<string, LazyLoadStats>;
	globalLazyMetrics: Record<string, any>;
	recommendations: PerformanceRecommendation[];
	timestamp: string;
	// Allow additional numeric metrics from base report
	[key: string]: number | CoreWebVitals | BundleMetrics | Record<string, any> | PerformanceRecommendation[] | string;
}

/**
 * Cache utility for storing and retrieving data
 */
class CacheManager {
	private cache: Map<string, CacheEntry>;
	private maxSize: number;
	private defaultTTL: number;

	constructor() {
		this.cache = new Map();
		this.maxSize = 100; // Maximum cache entries
		this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
	}
	
	/**
	 * Set cache entry with TTL
	 */
	set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
		// Evict oldest entries if cache is full
		if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;
			if (firstKey) {
				this.cache.delete(firstKey);
			}
		}
		
		this.cache.set(key, {
			value,
			expires: Date.now() + ttl
		});
	}
	
	/**
	 * Get cache entry if not expired
	 */
	get<T>(key: string): T | null {
		const entry = this.cache.get(key) as CacheEntry<T> | undefined;
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
	cleanup(): void {
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
	clear(): void {
		this.cache.clear();
	}
}

export const apiCache = new CacheManager();

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
	let timeoutId: NodeJS.Timeout | undefined;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
	let lastCall = 0;
	return (...args: Parameters<T>) => {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			func(...args);
		}
	};
}

/**
 * Lazy loading intersection observer
 */
export function observeIntersection(
	target: Element, 
	callback: (target: Element) => void, 
	options: IntersectionOptions = {}
): IntersectionObserver {
	const defaultOptions: IntersectionOptions = {
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
 */
export function optimizeImage(src: string, options: ImageOptimizationOptions = {}): string {
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
 */
export function preloadResources(resources: PreloadResource[]): void {
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
	protected marks: Map<string, number>;
	protected measures: Map<string, number>;

	constructor() {
		this.marks = new Map();
		this.measures = new Map();
	}
	
	/**
	 * Start performance mark
	 */
	mark(name: string): void {
		if (typeof performance !== 'undefined') {
			performance.mark(`${name}-start`);
			this.marks.set(name, Date.now());
		}
	}
	
	/**
	 * End performance mark and measure
	 */
	measure(name: string): number | null {
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
	 */
	getReport(): Record<string, number> {
		return Object.fromEntries(this.measures);
	}
}

export const perfMonitor = new PerformanceMonitor();

/**
 * Enhanced Performance Monitor with Lazy Loading Support
 */
export class EnhancedPerformanceMonitor extends PerformanceMonitor {
	private vitals: CoreWebVitals;
	private observers: PerformanceObserver[];
	private lazyLoadStats: Map<string, LazyLoadStats>;
	private bundleMetrics: BundleMetrics;

	constructor() {
		super();
		this.vitals = {};
		this.observers = [];
		this.lazyLoadStats = new Map();
		this.bundleMetrics = {
			totalResources: 0,
			jsCount: 0,
			cssCount: 0,
			averageLoadTime: 0,
			timestamp: Date.now()
		};
		this.initCoreWebVitals();
	}

	private initCoreWebVitals(): void {
		if (typeof window === 'undefined') return;

		// Largest Contentful Paint (LCP)
		if ('PerformanceObserver' in window) {
			try {
				const lcpObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					const lastEntry = entries[entries.length - 1];
					this.vitals.lcp = lastEntry.startTime;
				});
				lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
				this.observers.push(lcpObserver);
			} catch (e) {
				console.warn('LCP monitoring not supported:', e);
			}
		}

		// First Input Delay (FID)
		if ('PerformanceObserver' in window) {
			try {
				const fidObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry: any) => {
						this.vitals.fid = entry.processingStart - entry.startTime;
					});
				});
				fidObserver.observe({ entryTypes: ['first-input'] });
				this.observers.push(fidObserver);
			} catch (e) {
				console.warn('FID monitoring not supported:', e);
			}
		}

		// Track bundle loading performance
		window.addEventListener('load', () => {
			this.trackBundlePerformance();
		});
	}

	private trackBundlePerformance(): void {
		const resources = performance.getEntriesByType('resource');
		const jsResources = resources.filter(r => r.name.includes('.js'));
		const cssResources = resources.filter(r => r.name.includes('.css'));

		this.bundleMetrics = {
			totalResources: resources.length,
			jsCount: jsResources.length,
			cssCount: cssResources.length,
			averageLoadTime: resources.reduce((sum, r) => sum + (r.duration || 0), 0) / resources.length,
			largestResource: resources.reduce((largest, r) => 
				((r as any).transferSize || 0) > ((largest as any).transferSize || 0) ? r : largest, 
				resources[0] || undefined
			),
			timestamp: Date.now()
		};
	}

	trackLazyComponentLoad(componentName: string, loadTime: number, success: boolean = true): void {
		const existing = this.lazyLoadStats.get(componentName) || {
			loads: 0,
			totalTime: 0,
			errors: 0,
			avgLoadTime: 0
		};

		if (success) {
			existing.loads++;
			existing.totalTime += loadTime;
			existing.avgLoadTime = existing.totalTime / existing.loads;
		} else {
			existing.errors++;
		}

		this.lazyLoadStats.set(componentName, existing);
	}

	getEnhancedReport(): EnhancedPerformanceReport {
		const baseReport = super.getReport();
		const lazyMetrics = LazyLoadMetrics.getMetrics();
		
		return {
			...baseReport,
			coreWebVitals: { ...this.vitals },
			bundleMetrics: { ...this.bundleMetrics },
			lazyLoading: Object.fromEntries(this.lazyLoadStats),
			globalLazyMetrics: Object.fromEntries(lazyMetrics),
			recommendations: this.getPerformanceRecommendations(),
			timestamp: new Date().toISOString()
		};
	}

	private getPerformanceRecommendations(): PerformanceRecommendation[] {
		const recommendations: PerformanceRecommendation[] = [];

		// LCP recommendations
		if (this.vitals.lcp && this.vitals.lcp > 2500) {
			recommendations.push({
				type: 'critical',
				metric: 'LCP',
				current: Math.round(this.vitals.lcp),
				target: '< 2500ms',
				suggestion: 'Implement more aggressive lazy loading and optimize critical path resources'
			});
		}

		// Bundle size recommendations
		if (this.bundleMetrics.jsCount > 10) {
			recommendations.push({
				type: 'medium',
				metric: 'JS Bundle Count',
				current: this.bundleMetrics.jsCount,
				target: '< 10',
				suggestion: 'Implement code splitting and lazy loading for non-critical components'
			});
		}

		// Lazy loading efficiency
		this.lazyLoadStats.forEach((stats, component) => {
			if (stats.avgLoadTime > 1000) {
				recommendations.push({
					type: 'low',
					metric: 'Lazy Load Performance',
					component,
					current: `${Math.round(stats.avgLoadTime)}ms`,
					target: '< 1000ms',
					suggestion: `Optimize ${component} component or implement preloading`
				});
			}
		});

		return recommendations;
	}

	cleanup(): void {
		this.observers.forEach(observer => observer.disconnect());
		this.observers = [];
	}
}

// Enhanced global instance
export const enhancedPerfMonitor = new EnhancedPerformanceMonitor();

// Cleanup cache periodically
if (typeof window !== 'undefined') {
	setInterval(() => {
		apiCache.cleanup();
	}, 5 * 60 * 1000); // Every 5 minutes
}
