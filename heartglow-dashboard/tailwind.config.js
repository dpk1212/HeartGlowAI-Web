/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        heartglow: {
          pink: '#FF4F81',
          violet: '#8C30F5',
          indigo: '#5B37EB',
          charcoal: '#1C1C1E',
          deepgray: '#2E2E32',
          softgray: '#E2E2E2',
          offwhite: '#F9F9F9',
          glowwhite: '#FFFFFF',
          error: '#E63946',
          success: '#00BFA6',
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(255, 79, 129, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} 