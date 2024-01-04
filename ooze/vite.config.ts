import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    mkcert()
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  worker: {
    format: 'iife',
    rollupOptions: {
      output: {
        format: 'iife',
      },
    },
  }
})
