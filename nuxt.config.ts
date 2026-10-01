// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-01',
  
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Private keys (server-side only)
    databaseUrl: process.env.DATABASE_URL || './data/atlas.db',
    jwtSecret: process.env.JWT_SECRET || 'change-this-in-production',
    
    // Public keys (client-side accessible)
    public: {
      appName: 'ATLAS',
      appTagline: 'Navigate the complete picture',
    },
  },

  nitro: {
    experimental: {
      database: true,
    },
    // SQLite database for server-side operations
    database: {
      default: {
        connector: 'sqlite',
        options: {
          name: process.env.DATABASE_URL || './data/atlas.db'
        }
      }
    }
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    shim: false,
  },

  // App configuration
  app: {
    head: {
      title: 'ATLAS',
      titleTemplate: '%s | ATLAS',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Population health and care intelligence platform' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // Google Fonts - Inter and IBM Plex Mono
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap' },
      ],
    },
  },

  // UI configuration (Nuxt UI with ATLAS brand colors)
  ui: {
    primary: 'teal',
    gray: 'slate',
  },

  // Build configuration
  build: {
    transpile: ['chart.js', 'vue-chartjs'],
  },

  vite: {
    optimizeDeps: {
      exclude: ['better-sqlite3'],
    },
  },
})
