import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Root by default (Vercel, custom domains). GitHub Pages project sites are
  // served from /<repo>/, so `npm run build:pages` sets BASE_PATH instead.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
