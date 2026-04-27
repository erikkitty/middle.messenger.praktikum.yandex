import { defineConfig } from "vite";

export default defineConfig({
  appType: "spa",
  root: "src",
  publicDir: "../static",
  build: {
    outDir: "../build",
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
  preview: {
    port: 3000,
    open: true,
    strictPort: true,
  },
});
