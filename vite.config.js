import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  base: '/Portfolio/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('motion') || id.includes('framer-motion') || id.includes('lenis') || id.includes('gsap')) {
              return 'vendor-motion';
            }
            if (id.includes('ogl')) {
              return 'vendor-ogl';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
