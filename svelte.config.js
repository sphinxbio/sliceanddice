

import path from 'path'

import { mdsvex } from 'mdsvex'
import adapter_vercel from '@sveltejs/adapter-vercel'
// import adapter_node from '@sveltejs/adapter-node'
import preprocess from 'svelte-preprocess'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


// doesn't work w/ vercel-edge
// import { config as dotenvconf } from "dotenv"
// dotenvconf()

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.svx', '.md', '.mdoc', '.markdoc'], // adding .md here screws up vite meta glob import
  preprocess: [
    mdsvex({
      extensions: ['.md', '.svx'],
    }),
    vitePreprocess(),
    preprocess({
      postcss: true,
    }),
  ],

  kit: {
    adapter: adapter_vercel({
      runtime: 'edge'
    }),
    // adapter: adapter_node(),
    alias: {
      $src: './src',
      $lib: './src/lib',
      $components: './src/lib/components',

      $plasmid: process.env.PUBLIC_LOCAL == 'local' ? path.resolve('/src/plasmid') : path.resolve('/node_modules/plasmid'), // dynamic linked
      $stores: './src/lib/stores',
      $utils: './src/lib/utils',
      $routes: './src/routes',
      $static: './static',
    },
  },
};

export default config;

