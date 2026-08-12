import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          redDark: '#B00710',
          black: '#141414',
          gray: '#222',
          lightgray: '#808080',
        },
      },
      fontFamily: {
        sans: ['"Netflix Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
