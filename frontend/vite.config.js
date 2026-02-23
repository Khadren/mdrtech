import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ksnv575wp3.execute-api.ca-central-1.amazonaws.com', 
        changeOrigin: true,
      },
    },
  },
})