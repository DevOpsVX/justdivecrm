import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const allowed =
  process.env.RENDER_EXTERNAL_URL
    ? [new URL(process.env.RENDER_EXTERNAL_URL).hostname]
    : ['justdivecrm.onrender.com'] // fallback

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { host: true, port: 5173 },
  preview: {
    host: true, // 0.0.0.0
    port: Number(process.env.PORT) || 4173,
    allowedHosts: allowed,
  },
})
