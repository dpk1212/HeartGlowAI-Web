/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heartglow: {
          pink: '#FF4F81',     // HeartGlow Gradient Start
          violet: '#8C30F5',   // HeartGlow Gradient End
          indigo: '#5B37EB',   // Accent
          charcoal: '#1C1C1E', // Charcoal
          deepgray: '#2E2E32', // Deep Gray
          softgray: '#E2E2E2', // Soft Gray
          offwhite: '#F9F9F9', // Off White
          glowwhite: '#FFFFFF', // Glow White
          error: '#E63946',    // Error Red
          success: '#00BFA6',  // Success Teal
        }
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-bounce': 'subtle-bounce 2s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 3s infinite',
        'wiggle': 'wiggle 1.5s ease-in-out infinite',
        'shadow-glow': 'shadow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 0.2 },
        },
        'subtle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        fadeIn: {
          'from': { opacity: 0, transform: 'translateY(10px)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(15deg)' },
          '50%': { transform: 'rotate(0deg)' },
          '75%': { transform: 'rotate(-15deg)' },
        },
        'shadow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px 0 rgba(255, 79, 129, 0.1)' },
          '50%': { boxShadow: '0 0 25px 5px rgba(255, 79, 129, 0.3)' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'glow': '0 0 20px 0 rgba(255, 79, 129, 0.3)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 