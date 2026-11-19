/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        toastmasters: {
          blue: '#004165',      // Loyal Blue
          maroon: '#772432',    // True Maroon
          gray: '#A9B2B1',      // Cool Gray
          yellow: '#F2DF74',    // Happy Yellow
          lightBlue: '#005580',
          darkBlue: '#002B44',
          lightMaroon: '#932C3E',
          darkMaroon: '#5A1A25',
          bgLight: '#F8FAFC',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
