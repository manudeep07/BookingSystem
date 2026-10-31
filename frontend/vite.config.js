import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/movies': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/theaters': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/screens': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/languages': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/seats': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/shows': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/showSeats': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/bookings': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/payments': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
