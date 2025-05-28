import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ],
  build: {
    chunkSizeWarningLimit: 600,
    outDir: 'build',
    rollupOptions: {
      external: ['styled-components'],
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
