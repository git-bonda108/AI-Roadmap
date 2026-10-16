import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE lets the same build serve from a site root (Azure) or a sub-path (GitHub Pages: /AI-Roadmap/).
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react()],
})
