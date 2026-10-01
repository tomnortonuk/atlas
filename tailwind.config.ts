import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        // ATLAS Brand Colors
        atlas: {
          teal: {
            DEFAULT: '#0A5C5F',
            50: '#E8F4F5',
            100: '#B8D8DA',
            200: '#7EB4B7',
            300: '#3B7A7D',
            400: '#0A5C5F',
            500: '#0A5C5F',
            600: '#084649',
            700: '#063436',
            800: '#042224',
            900: '#021112',
          },
          green: '#527A6E',
          amber: {
            DEFAULT: '#D97E3F',
            dark: '#C26F35',
          },
          terracotta: '#B8654D',
          charcoal: '#2C3E42',
          slate: '#5A6C70',
          gray: {
            cool: '#8F9FA3',
            light: '#D8E1E3',
          },
          bg: '#F7F9FA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
    },
  },
}
