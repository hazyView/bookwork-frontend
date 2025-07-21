import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		// Optimize chunk sizes
		chunkSizeWarningLimit: 600,
		// Minimal source maps for production
		sourcemap: false
	},
	// Performance optimizations
	optimizeDeps: {
		include: [
			'lucide-svelte',
			'zod',
			'dompurify',
			'jsonwebtoken',
			'uuid'
		]
	}
});
