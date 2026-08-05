import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

/** SPA routes that should work on direct load / refresh (GitHub Pages has no server router). */
const SPA_ROUTE_DIRS = [
  'about',
  'timeline',
  'labs',
  'minecraft',
  'sources',
  'music',
  'now-playing',
  'projects',
] as const

/** Copy index.html into each route folder. Do NOT use root 404.html — that rewrites every unknown URL to the app. */
function spaRouteHtml() {
  return {
    name: 'spa-route-html',
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      const index = resolve(dist, 'index.html')
      for (const route of SPA_ROUTE_DIRS) {
        const dir = resolve(dist, route)
        mkdirSync(dir, { recursive: true })
        copyFileSync(index, resolve(dir, 'index.html'))
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png', 'images/**/*'],
      manifest: {
        name: 'Lukasz26671',
        short_name: 'L26671',
        description:
          'Lukasz26671 — full-stack .NET / Blazor / React. Portfolio, projekty i muzyka.',
        theme_color: '#040b14',
        background_color: '#040b14',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        lang: 'pl',
        categories: ['portfolio', 'music', 'entertainment'],
        icons: [
          {
            src: 'icons/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [
          /^\/$/,
          /^\/about\/?$/,
          /^\/timeline\/?$/,
          /^\/labs\/?$/,
          /^\/minecraft\/?$/,
          /^\/sources\/?$/,
          /^\/music\/?$/,
          /^\/now-playing\/?$/,
          /^\/projects\/?$/,
        ],
        navigateFallbackDenylist: [
          /^\/api\//,
          /^\/HackerTyper2(\/|$)/i,
          /^\/Kalkulator(\/|$)/i,
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/lrclib\.net\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'lyrics-cache',
              expiration: {
                maxEntries: 64,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
          {
            urlPattern: /^https:\/\/lukasz26671\.duckdns\.org:9975\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
    spaRouteHtml(),
  ],
  base: '/',
})
