import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectManifest: {
        swSrc: 'public/sw.js',
        swDest: 'sw.js',
      },
      includeAssets: [
        'favicon.ico',
            'logos/logo_circulo.png',
    'images/bg_rounded.png',
    'images/twolines.png',
    'images/bg_main.png',
    'images/pngtree-light-gray-old-paper.png',
    'logos/oficial_logo.png',
    'logos/nome_hrz.png',
      ],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        skipWaiting: true,
        clientsClaim: true,
        // Excluir Firebase Auth do cache
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/(firebase|identitytoolkit|securetoken|accounts|apis)\.googleapis\.com/,
            handler: 'NetworkOnly',
            options: {
              cacheName: 'firebase-auth',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60, // 1 hora
              },
            },
          },
        ],
      },
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
            type: 'image/x-icon',
          },
          {
            src: 'favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: 'favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: 'logos/logo_circulo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'logos/logo_circulo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
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
                sizes: '96x96',
              },
            ],
          },
          {
            name: 'Tempo Real',
            short_name: 'Tempo Real',
            description: 'Veja dados em tempo real',
            url: '/tempo-real',
            icons: [
              {
                src: 'logos/logo_circulo.png',
                sizes: '96x96',
              },
            ],
          },
          {
            name: 'Leaderboard',
            short_name: 'Ranking',
            description: 'Veja o ranking gamificado',
            url: '/leaderboard',
            icons: [
              {
                src: 'logos/logo_circulo.png',
                sizes: '96x96',
              },
            ],
          },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3002,
    open: true,
    hmr: {
      overlay: true,
      port: 3002,
    },
  },
  build: {
    // Source maps apenas em desenvolvimento
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            if (id.includes('framer-motion') || id.includes('react-router')) {
              return 'ui-vendor';
            }

            // Outros vendors
            return 'vendor';
          }
          
          // Chunks específicos da aplicação
          if (id.includes('pages/Admin') || id.includes('pages/Dev') || id.includes('pages/Marketing')) {
            return 'admin-pages';
          }
          if (id.includes('pages/Cadastro')) {
            return 'cadastro-pages';
          }
          if (id.includes('pages/audiovisual')) {
            return 'audiovisual-pages';
          }
          if (id.includes('components/')) {
            return 'components';
          }
          if (id.includes('hooks/')) {
            return 'hooks';
          }
          if (id.includes('utils/')) {
            return 'utils';
          }
        },
        // Evitar source maps em produção
        sourcemapExcludeSources: mode === 'production',
      },
    },
    chunkSizeWarningLimit: 1500, // Aumentar limite para 1.5MB
  },
  css: {
    // Source maps CSS apenas em desenvolvimento
    devSourcemap: mode === 'development',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
  },
}))
