import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import viteCompression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte({}),
		imagetools({}),
		viteCompression({ algorithm: 'brotliCompress' }),
		viteCompression({ algorithm: 'gzip' }),
	],
});
