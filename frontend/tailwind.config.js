/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fountain': {
          'primary': '#051A2E',
          'secondary': '#0A2540',
          'accent': '#2C7A9E',
          'light': '#E8F4F8',
          'dark': '#030F1A',
          'glow': '#2C7A9E',
        },
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

