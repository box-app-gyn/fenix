import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'images/splash/apple-touch-icon.png',
        'images/splash/masked-icon.svg',
        'images/splash/favicon-16x16.png',
        'images/splash/favicon-32x32.png'
      ],
      manifest: {
        name: 'CERRADØ INTERBOX 2025',
        short_name: 'CERRADØ',
        description: 'O maior evento de times da América Latina. Eternize a intensidade.',
        theme_color: '#ec4899',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'favicon.ico',
            sizes: 'any',
            type: 'image/x-icon'
          },
          {
            src: 'images/splash/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png'
          },
          {
            src: 'images/splash/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: 'images/splash/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: 'images/splash/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/splash/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 3002,
    open: true,
    hmr: {
      overlay: true,
      port: 3002
    }
  }
}) 