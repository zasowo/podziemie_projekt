// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://podziemie.com.pl',
  integrations: [mdx(), sitemap()],
  output: 'server', // enables server rendering
  adapter: node({
    mode: 'standalone',
  }),
  experimental: {
    session: true,
  },
});