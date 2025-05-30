import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/screener/', // 👈 ensures GitHub Pages loads assets correctly
  build: {
    outDir: '../screener/docs', // 👈 output goes to your existing GitHub Pages folder
    emptyOutDir: true,
  },
  plugins: [react()],
})