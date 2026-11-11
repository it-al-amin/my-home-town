import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The API is same-origin from the browser's point of view (HttpOnly SameSite=Strict cookie, no CORS needed).
  server: {
    proxy: {
      '/api': { target: process.env.API_PROXY ?? 'http://localhost:5080', changeOrigin: false },
      '/media': { target: process.env.API_PROXY ?? 'http://localhost:5080', changeOrigin: false },
    },
  },
})

