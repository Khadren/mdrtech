import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// The dev server proxies /api -> the API Gateway invoke URL.
// Override locally by creating .env.local with VITE_API_TARGET=<url>.
// The fallback is the current production API Gateway invoke URL.
const DEFAULT_API_TARGET =
  'https://ksnv575wp3.execute-api.ca-central-1.amazonaws.com'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET || DEFAULT_API_TARGET,
          changeOrigin: true,
        },
      },
    },
  }
})