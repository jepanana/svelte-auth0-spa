// This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
// For client work, contact us at hello@jepanana.com.

import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			files: { src: 'client' },
			adapter: adapter()
		})
	]
});
