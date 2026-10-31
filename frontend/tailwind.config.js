/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4f5',
          100: '#fbe8ea',
          200: '#f7d5d8',
          300: '#f1b4ba',
          400: '#e78590',
          500: '#e50914', // Cinematic red
          600: '#cb0712',
          700: '#aa060f',
          800: '#8c0710',
          900: '#750b12',
          950: '#400207',
        },
        cinema: {
          bg: '#0a0d14',
          card: '#121722',
          surface: '#181f2e',
          border: '#242f44',
          muted: '#8e9bb0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
