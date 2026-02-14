import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { markdownPlugin } from './vite-plugin-markdown'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), markdownPlugin()],
})
