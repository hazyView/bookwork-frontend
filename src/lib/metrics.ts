/**
 * Prometheus metrics service for SvelteKit application
 * Collects and exposes application metrics for monitoring and observability
 */

import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';
import { LazyLoadMetrics } from './lazyLoading';
import { apiCache } from './performance';
import { isDevelopment } from './env';

// Initialize default metrics collection (CPU, memory, etc.)
collectDefaultMetrics({
  register,
  prefix: 'bookwork_frontend_',
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // Garbage collection duration buckets
});

/**
 * Custom application metrics
 */
export class ApplicationMetrics {
  // HTTP request metrics
  private static httpRequestsTotal = new Counter({
    name: 'bookwork_frontend_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register]
  });

  private static httpRequestDuration = new Histogram({
    name: 'bookwork_frontend_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
    registers: [register]
  });

  // SvelteKit specific metrics
  private static pageLoads = new Counter({
    name: 'bookwork_frontend_page_loads_total',
    help: 'Total number of page loads',
    labelNames: ['page'],
    registers: [register]
  });

  private static componentLoadTime = new Histogram({
    name: 'bookwork_frontend_component_load_duration_seconds',
    help: 'Time taken to load lazy components',
    labelNames: ['component'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
    registers: [register]
  });

  private static componentErrors = new Counter({
    name: 'bookwork_frontend_component_errors_total',
    help: 'Total number of component loading errors',
    labelNames: ['component'],
    registers: [register]
  });

  // Cache metrics
  private static cacheHits = new Counter({
    name: 'bookwork_frontend_cache_hits_total',
    help: 'Total number of cache hits',
    labelNames: ['cache_type'],
    registers: [register]
  });

  private static cacheMisses = new Counter({
    name: 'bookwork_frontend_cache_misses_total',
    help: 'Total number of cache misses',
    labelNames: ['cache_type'],
    registers: [register]
  });

  // Rate limiting metrics
  private static rateLimitHits = new Counter({
    name: 'bookwork_frontend_rate_limit_hits_total',
    help: 'Total number of rate limit hits',
    labelNames: ['endpoint'],
    registers: [register]
  });

  // Session metrics
  private static activeSessions = new Gauge({
    name: 'bookwork_frontend_active_sessions',
    help: 'Number of active user sessions',
    registers: [register]
  });

  // Security metrics
  private static securityEvents = new Counter({
    name: 'bookwork_frontend_security_events_total',
    help: 'Total number of security events',
    labelNames: ['event_type'],
    registers: [register]
  });

  /**
   * Record HTTP request metrics
   */
  static recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestsTotal.labels(method, route, statusCode.toString()).inc();
    this.httpRequestDuration.labels(method, route, statusCode.toString()).observe(duration / 1000);
  }

  /**
   * Record page load
   */
  static recordPageLoad(page: string) {
    this.pageLoads.labels(page).inc();
  }

  /**
   * Record component metrics from LazyLoadMetrics
   */
  static updateComponentMetrics() {
    const lazyMetrics = LazyLoadMetrics.getMetrics();
    
    lazyMetrics.forEach((metrics, componentName) => {
      if (metrics.loadTime > 0) {
        this.componentLoadTime.labels(componentName).observe(metrics.loadTime / 1000);
      }
      
      if (metrics.errorCount > 0) {
        this.componentErrors.labels(componentName).inc(metrics.errorCount);
      }
    });
  }

  /**
   * Record cache hit
   */
  static recordCacheHit(cacheType: string = 'api') {
    this.cacheHits.labels(cacheType).inc();
  }

  /**
   * Record cache miss
   */
  static recordCacheMiss(cacheType: string = 'api') {
    this.cacheMisses.labels(cacheType).inc();
  }

  /**
   * Record rate limit hit
   */
  static recordRateLimitHit(endpoint: string) {
    this.rateLimitHits.labels(endpoint).inc();
  }

  /**
   * Update active sessions count
   */
  static updateActiveSessions(count: number) {
    this.activeSessions.set(count);
  }

  /**
   * Record security event
   */
  static recordSecurityEvent(eventType: string) {
    this.securityEvents.labels(eventType).inc();
  }

  /**
   * Get all metrics in Prometheus format
   */
  static async getMetrics(): Promise<string> {
    // Update component metrics before collecting
    this.updateComponentMetrics();
    
    return await register.metrics();
  }

  /**
   * Reset all metrics (useful for testing)
   */
  static reset() {
    register.clear();
    if (isDevelopment()) {
      console.log('[METRICS] All metrics have been reset');
    }
  }
}

/**
 * Middleware for automatic HTTP request tracking
 */
export function createMetricsMiddleware() {
  return async (request: Request, next: () => Promise<Response>): Promise<Response> => {
    const start = Date.now();
    const url = new URL(request.url);
    const method = request.method;
    const route = url.pathname;

    try {
      const response = await next();
      const duration = Date.now() - start;
      
      ApplicationMetrics.recordHttpRequest(method, route, response.status, duration);
      
      return response;
    } catch (error) {
      const duration = Date.now() - start;
      ApplicationMetrics.recordHttpRequest(method, route, 500, duration);
      throw error;
    }
  };
}

export { register };
