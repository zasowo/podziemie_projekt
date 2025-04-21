// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import react from '@astrojs/react'
import path from 'path'

// https://astro.build/config
export default defineConfig({
  site: 'https://podziemie.com.pl',
  integrations: [mdx(), sitemap(), react()],
  output: 'server', // enables server rendering
  adapter: node({
    mode: 'standalone',
  }),
  experimental: {
    session: true,
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
});