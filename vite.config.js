import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192x192.png', 'icon-512x512.png'],
      manifestFilename: 'manifest.json',
      manifest: {
        name: 'E-Shop',
        short_name: 'E-Shop',
        description: 'A modern e-commerce platform with Netflix-style interface',
        theme_color: '#e50914',
        background_color: '#141414',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  base: '/',
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
