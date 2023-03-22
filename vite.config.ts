import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import viteCompression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte({}),
		imagetools({}),
		chunkSplitPlugin({ strategy: 'unbundle' }),
		viteCompression({ algorithm: 'brotliCompress' }),
		viteCompression({ algorithm: 'gzip' }),
		eslint(),
	],

	build: {
		minify: 'terser',
	},
});
