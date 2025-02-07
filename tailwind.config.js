/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // enable dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#c6dcfc',
          300: '#aed1fa',
          400: '#94c6f8',
          500: '#7bbbf6',
          600: '#62aef4',
          700: '#49a1f2',
          800: '#3094f0',
          900: '#1787ee',
          950: '#087be8',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', ...require('tailwindcss/defaultTheme').fontFamily.sans],
        'serif': ['ui-serif', 'Georgia', ...require('tailwindcss/defaultTheme').fontFamily.serif],
        'mono': ['ui-monospace', 'SFMono-Regular', ...require('tailwindcss/defaultTheme').fontFamily.mono],
      },
      height: {
        'screen-minus-12': 'calc(100vh - 3rem)', // Custom height class
      },
    },
  },
  plugins: [],
};
