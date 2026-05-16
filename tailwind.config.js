/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1C2340',
        dark2: '#243050',
        accent: '#C9A97A',
        'accent-d': '#B8852E',
        light: '#E8E4DC',
        light2: '#F7F4EF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
