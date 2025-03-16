import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ],
  build: {
    chunkSizeWarningLimit: 600,
    outDir: 'build',
  },
})

const loadComponent = async () => {
    const module = await import('src/components/Cursor.jsx');
    return module.default;
};
