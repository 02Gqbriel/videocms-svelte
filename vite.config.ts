import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';
import { defineConfig } from 'vite';
import { ViteImageOptimizer as viteImageOptimizer } from 'vite-plugin-image-optimizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
	plugins: [
		sveltekit(),
		imagetools(),
		viteImageOptimizer({
			avif: { quality: 64, chromaSubsampling: '4:2:0', effort: 2 },
			webp: { quality: 82, smartSubsample: true, effort: 2 }
		}),
		viteCompression({ algorithm: 'brotliCompress' }),
		viteCompression({ algorithm: 'gzip' })
	],

	build: {
		target: 'esnext',
		minify: 'terser'
	},

	worker: {
		format: 'es'
	}
});
