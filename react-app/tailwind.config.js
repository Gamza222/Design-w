/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Основная золотая палитра
        gold: {
          DEFAULT: '#C9A97A',
          light: '#D4B896',
          dark: '#B8954A',
          hover: '#F5B800',
        },
        // Тёмный фон
        dark: {
          DEFAULT: '#1A1A2E',
          light: '#16213E',
          card: '#1E2240',
          border: 'rgba(201,169,122,0.2)',
        },
        // Текст
        cream: {
          DEFAULT: '#E8E4DC',
          muted: 'rgba(232,228,220,0.6)',
          dim: 'rgba(232,228,220,0.4)',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'hero': "url('/hero-bg.jpg')",
        'gold-gradient': 'linear-gradient(135deg, #C9A97A 0%, #D4B896 50%, #B8954A 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
