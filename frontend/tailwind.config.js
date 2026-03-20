/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6B35',
          red: '#E63946',
          yellow: '#FFD60A',
          dark: '#1A1A2E',
          card: '#16213E',
        },
      },
      fontFamily: {
        kiosk: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
