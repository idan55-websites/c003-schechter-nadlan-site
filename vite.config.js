import {defineConfig} from 'vite';
export default defineConfig({
 build:{rollupOptions:{output:{manualChunks(id){
  // The animation engine can be cached independently from changing project content.
  if(id.includes('/node_modules/gsap/'))return 'motion';
 }}}}
});
