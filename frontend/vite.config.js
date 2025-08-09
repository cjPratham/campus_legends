import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://campus-legends.onrender.com
// 'http://localhost:5000'
// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy:{
      '/api': {
        target: 'https://campus-legends.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    }
  },
  plugins: [react(),tailwindcss()],
})
