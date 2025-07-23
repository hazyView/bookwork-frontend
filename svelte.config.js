import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
		// Note: Completely removed CSP configuration to allow manual CSP handling
		// This prevents SvelteKit from generating conflicting nonce-based CSP headers
	},
	onwarn: (warning, handler) => {
		// Suppress false positive unused CSS warnings for dynamic content
		if (warning.code === 'css-unused-selector') {
			// Check if it's a false positive from the community page
			if (warning.filename?.includes('community/+page.svelte') && 
					(warning.message.includes('.upcoming-events') || 
					 warning.message.includes('.events-grid') ||
					 warning.message.includes('.event-card') ||
					 warning.message.includes('.event-header') ||
					 warning.message.includes('.event-category') ||
					 warning.message.includes('.event-type') ||
					 warning.message.includes('.event-title') ||
					 warning.message.includes('.event-description') ||
					 warning.message.includes('.event-details') ||
					 warning.message.includes('.event-progress') ||
					 warning.message.includes('.progress-bar') ||
					 warning.message.includes('.progress-fill'))) {
				return; // Suppress these warnings
			}
		}
		// Handle other warnings normally
		handler(warning);
	}
};

export default config;
