import type { RequestHandler } from '@sveltejs/kit';

/**
 * Test endpoint that returns a 500 error for testing error_count metrics
 */
export const GET: RequestHandler = async () => {
  return new Response('Internal Server Error for testing metrics', {
    status: 500,
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};
