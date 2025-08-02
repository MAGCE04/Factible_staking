import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'src/main.ts',
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});