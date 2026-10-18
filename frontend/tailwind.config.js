/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paddy: {
          gold: '#C5A059',
          bisque: '#FAEDCD'
        }
      },
      fontFamily: {
        sans: ['"Hind Siliguri"', '"Inter"', 'system-ui', 'sans-serif']
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        marquee: 'marquee 32s linear infinite'
      }
    }
  },
  plugins: []
};