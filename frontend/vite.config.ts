import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Options pour les chunks et le découpage de code
        manualChunks: {
          vendor: ['react', 'react-dom'], // Exemple : créer un chunk séparé pour les bibliothèques communes
        },
      },
    },
  },
  server: {
    proxy: {
      '/api' : {
        target: 'http://firefly.local/',
        changeOrigin : true
      }
    }
  }
})
