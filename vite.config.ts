import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    inject({
      Buffer: ['buffer', 'Buffer'],
      process: 'process',
    }),
  ],
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process',
      util: 'util',
      stream: 'stream-browserify',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.js$/,
    },
  },
})