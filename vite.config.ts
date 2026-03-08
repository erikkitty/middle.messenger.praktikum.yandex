import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src",
  publicDir: "../static",
  build: {
    outDir: "../build",
    emptyOutDir: true,     
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["handlebars"],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});