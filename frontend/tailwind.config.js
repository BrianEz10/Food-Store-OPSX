/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { 
          50: '#fdf3f4',
          100: '#fce5e8',
          500: '#e94560', 
          900: '#881b2b'
        },
        secondary: {
          50: '#f8f9fa',
          500: '#533483',
        },
        surface: {
          50: '#ffffff',
          100: '#f3f4f6',
          900: '#1a1a2e',
        },
        danger: {
          500: '#ef4444',
        },
        success: {
          500: '#22c55e',
        },
        warning: {
          500: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
