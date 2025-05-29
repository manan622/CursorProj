import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  base: '/CursorProj/',
  resolve: {
    alias: {
      'styled-components': path.resolve(__dirname, 'node_modules/styled-components'),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@mui/material',
            '@mui/icons-material',
            'styled-components',
            'framer-motion',
          ],
        },
      },
    },
  },
  server: {
    host: true, // Listen on all local IPs
    port: 5173, // Default port
    strictPort: true, // Don't try other ports if 5173 is taken
  }
})

const loadComponent = async () => {
    const module = await import('src/components/Cursor.jsx');
    return module.default;
};
