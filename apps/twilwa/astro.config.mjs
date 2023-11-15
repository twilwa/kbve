import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import prefetch from '@astrojs/prefetch';
import { fileURLToPath } from 'node:url';


// https://astro.build/config
export default defineConfig({
	site: 'https://twilwa.github.io/kbve/',
	outDir: '../../dist/apps/twilwa',
	integrations: [
		react(),
		svelte(),
		partytown(),
		sitemap(),
		prefetch({
				throttle: 5,
			}),
		tailwind({
		configFile: fileURLToPath(
			new URL('./tailwind.config.cjs', import.meta.url)
		),
		}),
	],
	});
