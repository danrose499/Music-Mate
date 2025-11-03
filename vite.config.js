import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['pwa.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
      },
      manifest: {
        name: 'Music Mate',
        short_name: 'MusicMate',
        description: 'Chord Progressions Made Easy',
        start_url: '/Music-Mate/',
        scope: '/Music-Mate/',
        display: 'standalone',
        theme_color: '#06b6d4',
        background_color: '#0f172a',
        icons: [
          { src: 'pwa.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      }
    })
  ],
  base: '/Music-Mate/',
})
