// pwa-corrected/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const allowed =
  process.env.RENDER_EXTERNAL_URL
    ? [new URL(process.env.RENDER_EXTERNAL_URL).hostname]
    : ['justdivecrm.onrender.com']  // fallback

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // facilita dev local em rede
    port: 5173,
  },
  preview: {
    host: true,          // = '0.0.0.0'
    port: Number(process.env.PORT) || 4173,
    allowedHosts: allowed,
  },
})
