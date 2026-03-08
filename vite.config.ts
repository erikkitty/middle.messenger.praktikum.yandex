import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: '../static',
  build: {
    outDir: '../build',
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    port: 3000,        
    open: true,        
    strictPort: true   
  }
});
