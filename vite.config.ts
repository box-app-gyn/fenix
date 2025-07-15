import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectManifest: {
        swSrc: 'public/sw.js',
        swDest: 'sw.js'
      },
      includeAssets: [
        'favicon.ico',
        'logos/logo_circulo.png',
        'images/bg_rounded.png',
        'images/twolines.png'
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
        orientation: 'portrait-primary',
        lang: 'pt-BR',
        categories: ['sports', 'entertainment', 'social'],
        icons: [
          {
            src: 'favicon.ico',
            sizes: 'any',
            type: 'image/x-icon'
          },
          {
            src: 'favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png'
          },
          {
            src: 'favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: 'logos/logo_circulo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'logos/logo_circulo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Hub Principal',
            short_name: 'Hub',
            description: 'Acesse o hub principal',
            url: '/hub',
            icons: [
              {
                src: 'logos/logo_circulo.png',
                sizes: '96x96'
              }
            ]
          },
          {
            name: 'Tempo Real',
            short_name: 'Tempo Real',
            description: 'Veja dados em tempo real',
            url: '/tempo-real',
            icons: [
              {
                src: 'logos/logo_circulo.png',
                sizes: '96x96'
              }
            ]
          },
          {
            name: 'Leaderboard',
            short_name: 'Ranking',
            description: 'Veja o ranking gamificado',
            url: '/leaderboard',
            icons: [
              {
                src: 'logos/logo_circulo.png',
                sizes: '96x96'
              }
            ]
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5MB, ajuste conforme necessário
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3002,
    open: true,
    hmr: {
      overlay: true,
      port: 3002
    }
  }
}) 