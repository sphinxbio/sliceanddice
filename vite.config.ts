
import path from 'path'
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      // always use svelte.config.js for aliases
      // they're processed for more use cases / packaging
      // $src: path.resolve('./src'),
      // $routes: path.resolve('./src/routes'),
    }
  }
});



