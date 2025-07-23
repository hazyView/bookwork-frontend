/**
 * Essential performance utilities
 * Lean implementation focusing on actually used features
 */

/**
 * Simple cache implementation for API responses and computed values
 */
interface CacheEntry<T = any> {
    value: T;
    expires: number;
}

class CacheManager {
    private cache = new Map<string, CacheEntry>();
    private maxSize: number = 100;

    set<T>(key: string, value: T, ttl: number = 300000): void { // 5 minutes default TTL
        // Simple LRU: remove oldest if at capacity
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

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;
        
        if (Date.now() > entry.expires) {
            this.cache.delete(key);
            return null;
        }
        
        return entry.value;
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;
        
        if (Date.now() > entry.expires) {
            this.cache.delete(key);
            return false;
        }
        
        return true;
    }
}

// Export a singleton cache for API responses
export const apiCache = new CacheManager();

/**
 * Simple intersection observer utility for lazy loading
 */
export function observeIntersection(
    element: Element,
    callback: (entry: IntersectionObserverEntry) => void,
    options: IntersectionObserverInit = {}
): IntersectionObserver {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(callback);
    }, {
        rootMargin: '50px',
        threshold: 0.1,
        ...options
    });
    
    observer.observe(element);
    return observer;
}

/**
 * Basic image optimization helper
 */
export function optimizeImage(src: string, options: { width?: number; height?: number; quality?: number } = {}): string {
    if (!src) return src;
    
    // For now, just return the original src
    // In the future, this could integrate with image optimization services
    const { width, height, quality = 80 } = options;
    
    // If it's already optimized or external, return as-is
    if (src.includes('?') || src.startsWith('http') || src.startsWith('data:')) {
        return src;
    }
    
    // Add optimization parameters if specified
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality !== 80) params.set('q', quality.toString());
    
    return params.toString() ? `${src}?${params.toString()}` : src;
}

/**
 * Development-only performance monitoring
 * Only active in development to avoid production overhead
 */
const isDev = process.env.NODE_ENV === 'development';

export const perfMonitor = isDev ? {
    mark: (name: string) => {
        if ('performance' in globalThis && performance.mark) {
            performance.mark(name);
        }
    },
    measure: (name: string, startMark?: string, endMark?: string) => {
        if ('performance' in globalThis && performance.measure) {
            try {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name, 'measure')[0];
                return measure?.duration || 0;
            } catch {
                return 0;
            }
        }
        return 0;
    },
    clear: () => {
        if ('performance' in globalThis && performance.clearMarks) {
            performance.clearMarks();
            performance.clearMeasures();
        }
    }
} : {
    mark: () => {},
    measure: () => 0,
    clear: () => {}
};
