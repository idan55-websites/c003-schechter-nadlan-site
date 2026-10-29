import {defineConfig} from 'vite';

// BASE_PATH lets the same build run at a domain root or a repository subdirectory.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  define: {'import.meta.env.SITE_INDEX': JSON.stringify((process.env.SITE_INDEX ?? 'true') === 'true')},
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {output: {manualChunks(id) {
      // The animation engine is cached independently of changing content.
      if (id.includes('/node_modules/gsap/')) return 'motion';
      if (id.includes('/node_modules/react')) return 'react';
    }}}
  },
  ssr: {noExternal: []}
});
