/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#ffffff',
      
      // Vivid Modernity Brand Colors
      primary: {
        DEFAULT: '#b3193d',
        hover: '#961130',
        light: '#ffe9e9',
      },
      secondary: {
        DEFAULT: '#6d4e9f',
        hover: '#5c3f8a',
        light: '#f3e8ff',
      },
      tertiary: {
        DEFAULT: '#006a42',
        hover: '#005735',
        light: '#e8f5e9',
      },
      surface: {
        DEFAULT: '#fff8f7',
        container: '#ffe9e9',
        'container-high': '#fde2e2',
      },
      error: {
        DEFAULT: '#ba1a1a',
        light: '#ffebee',
      },
      'on-surface': '#261819',
      outline: '#8e7071',

      // Warm Gray scale mapping to outline/on-surface to maintain styling compatibility
      gray: {
        50: '#fcfaf9',
        100: '#f8f4f3',
        200: '#f1ebea',
        300: '#e3d9d8',
        400: '#c9b9b8',
        500: '#a79594',
        600: '#8e7071',
        700: '#5b4a49',
        800: '#3d2f30',
        900: '#261819',
      }
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Outfit', 'system-ui', 'sans-serif'],
    },
    extend: {
      borderRadius: {
        'card': '8px',
        'input': '8px',
        'modal': '12px',
        'chip': '9999px',
      }
    },
  },
  plugins: [],
}
