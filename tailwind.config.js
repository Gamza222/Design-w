/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // === ОСНОВНАЯ ПАЛИТРА ===
        cream:   '#FFF6DE',   // кремовый — светлые секции фон
        teal:    '#8BDFDD',   // бирюза — акцент, кнопки, теги
        coral:   '#F48F68',   // коралл — CTA, яркие акценты
        yellow:  '#FFE394',   // жёлтый — выделения, цифры
        // === ТЁМНЫЕ ===
        navy:    '#1C2340',   // тёмно-синий — фон Hero, dark-секции
        navy2:   '#243050',   // чуть светлее navy — подсекции
        // === ТЕКСТ ===
        ink:     '#1A120B',   // очень тёмный коричневый — текст на светлом
        'ink-2': '#3D2C1E',   // тёмно-коричневый мягкий
        // === БЕЛЫЙ ===
        canvas:  '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        // Hamburger menu breakpoint
        'nav': '1400px',
      },
    },
  },
  plugins: [],
}
