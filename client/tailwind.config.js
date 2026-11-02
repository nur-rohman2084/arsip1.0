/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: '#07122f',
        gold: '#ffc82c',
        goldDark: '#b3830f',
        panelBg: 'rgba(16, 32, 80, 0.8)',
        panelBorder: 'rgba(70, 105, 190, 0.5)',
        cardBg: 'rgba(6, 14, 42, 0.8)',
        cardBorder: 'rgba(60, 95, 180, 0.45)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        lilita: ['Lilita One', 'Trebuchet MS', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
