/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── ДИЗАЙН 12 МАЯ: тёмно-синий/фиолетовый + тёплое золото ──
        dark:    '#1A1A2E',   // основной тёмный фон (сине-фиолетовый)
        dark2:   '#16213E',   // вторичный тёмный
        dark3:   '#0F3460',   // глубокий синий
        accent:  '#C9A050',   // тёплое золото
        'accent-d': '#A8832E', // тёмное золото
        'accent-l': '#E8C98A', // светлое золото (градиент)
        light:   '#E8E4DC',   // светлый текст
        light2:  '#F2EFE9',   // очень светлый (секции Services)
        card:    '#FFFFFF',   // белые карточки
        'text-muted': 'rgba(232,228,220,0.6)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        // Для навбара — бургер до 1400px, десктоп от 1400px
        // (используется min-[1400px]: — работает как arbitrary value в TW v3)
      },
    },
  },
  plugins: [],
}
