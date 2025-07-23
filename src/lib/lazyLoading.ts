/**
 * Lazy Loading Utilities for SvelteKit
 * Performance optimization for reducing initial bundle size
 */

import type { ComponentType } from 'svelte';
import { isDevelopment } from './env';

interface LazyComponentOptions {
  fallback?: ComponentType;
  errorComponent?: ComponentType;
  loadingDelay?: number;
  retryCount?: number;
  retryDelay?: number;
}

interface LazyLoadResult<T = ComponentType> {
  component: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Lazy load a Svelte component with error handling and retry logic
 */
export function lazyLoad<T extends ComponentType>(
  loader: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): Promise<LazyLoadResult<T>> {
  const {
    loadingDelay = 0,
    retryCount = 3,
    retryDelay = 1000
  } = options;

  let attempts = 0;

  const loadComponent = async (): Promise<LazyLoadResult<T>> => {
    try {
      // Add artificial delay if specified (useful for testing)
      if (loadingDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, loadingDelay));
      }

      const module = await loader();
      return {
        component: module.default,
        loading: false,
        error: null
      };
    } catch (error) {
      attempts++;
      
      if (attempts < retryCount) {
        if (isDevelopment()) {
          console.warn(`Component lazy load attempt ${attempts} failed, retrying...`, error);
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return loadComponent();
      }

      if (isDevelopment()) {
        console.error('Component lazy load failed after all retries:', error);
      }
      return {
        component: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown loading error')
      };
    }
  };

  return loadComponent();
}

/**
 * Create a lazy-loaded route component
 */
export function createLazyRoute<T extends ComponentType>(
  loader: () => Promise<{ default: T }>,
  options?: LazyComponentOptions
) {
  return {
    load: () => lazyLoad(loader, options)
  };
}

/**
 * Preload a component for better perceived performance
 */
export function preloadComponent(loader: () => Promise<any>): void {
  // Only preload on idle or when prefetch is supported
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      loader().catch(() => {
        // Silently ignore preload failures
      });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      loader().catch(() => {
        // Silently ignore preload failures
      });
    }, 100);
  }
}

/**
 * Intersection Observer based lazy loading for components
 */
export class IntersectionLazyLoader {
  private observer: IntersectionObserver;
  private loadedComponents = new Set<string>();

  constructor(
    private options: IntersectionObserverInit = {
      rootMargin: '50px',
      threshold: 0.1
    }
  ) {
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), options);
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        const componentId = element.dataset.lazyComponent;
        
        if (componentId && !this.loadedComponents.has(componentId)) {
          this.loadedComponents.add(componentId);
          element.dispatchEvent(new CustomEvent('lazy-load', {
            detail: { componentId }
          }));
          this.observer.unobserve(element);
        }
      }
    });
  }

  observe(element: HTMLElement, componentId: string) {
    element.dataset.lazyComponent = componentId;
    this.observer.observe(element);
  }

  disconnect() {
    this.observer.disconnect();
    this.loadedComponents.clear();
  }
}

/**
 * Route-based code splitting helpers
 */
export const lazyRoutes = {
  // Business routes
  business: () => import('../routes/business/+page.svelte'),
  businessServices: () => import('../routes/business/services/+page.svelte'),
  businessCommunity: () => import('../routes/business/community/+page.svelte'),
  businessCompany: () => import('../routes/business/company/+page.svelte'),
  businessWebsiteBuilder: () => import('../routes/business/website-builder/+page.svelte'),
  businessAbout: () => import('../routes/business/about/+page.svelte'),

  // Club routes
  clubs: () => import('../routes/clubs/+page.svelte'),
  clubsSchedule: () => import('../routes/clubs/schedule/+page.svelte'),
  clubsRoster: () => import('../routes/clubs/roster/+page.svelte'),
  clubsTracking: () => import('../routes/clubs/tracking/+page.svelte'),
  clubsAvailability: () => import('../routes/clubs/availability/+page.svelte'),
};

/**
 * Component-based lazy loading
 */
export const lazyComponents = {
  // Heavy components that benefit from lazy loading
  ChatWidget: () => import('../lib/components/ChatWidget.svelte'),
  
  // Future heavy components can be added here
  // DataVisualization: () => import('../lib/components/DataVisualization.svelte'),
  // ReportGenerator: () => import('../lib/components/ReportGenerator.svelte'),
};

/**
 * Bundle splitting priorities
 */
export const bundlePriorities = {
  critical: [
    'Navigation',
    'ErrorBoundary',
    'ValidatedInput',
    'ValidatedForm'
  ],
  high: [
    'auth',
    'stores',
    'utils'
  ],
  medium: [
    'ChatWidget',
    'api',
    'mockData'
  ],
  low: [
    'performance',
    'validation'
  ]
};

/**
 * Performance monitoring for lazy loaded components
 */
export class LazyLoadMetrics {
  private static metrics = new Map<string, {
    loadTime: number;
    errorCount: number;
    retryCount: number;
  }>();

  static recordLoad(componentName: string, loadTime: number) {
    const existing = this.metrics.get(componentName) || { loadTime: 0, errorCount: 0, retryCount: 0 };
    this.metrics.set(componentName, {
      ...existing,
      loadTime
    });
  }

  static recordError(componentName: string) {
    const existing = this.metrics.get(componentName) || { loadTime: 0, errorCount: 0, retryCount: 0 };
    this.metrics.set(componentName, {
      ...existing,
      errorCount: existing.errorCount + 1
    });
  }

  static recordRetry(componentName: string) {
    const existing = this.metrics.get(componentName) || { loadTime: 0, errorCount: 0, retryCount: 0 };
    this.metrics.set(componentName, {
      ...existing,
      retryCount: existing.retryCount + 1
    });
  }

  static getMetrics() {
    return new Map(this.metrics);
  }

  static reset() {
    this.metrics.clear();
  }
}
