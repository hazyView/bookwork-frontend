import type { RequestHandler } from '@sveltejs/kit';
import { ApplicationMetrics } from '$lib/metrics';

/**
 * Prometheus metrics endpoint
 * Serves application metrics in Prometheus format for scraping
 */
export const GET: RequestHandler = async () => {
  try {
    // Get metrics in Prometheus format
    const metrics = await ApplicationMetrics.getMetrics();
    
    return new Response(metrics, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('[METRICS] Error generating metrics:', error);
    
    return new Response('Error generating metrics', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
};
