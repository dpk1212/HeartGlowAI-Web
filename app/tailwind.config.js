/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007BFF',
        secondary: {
          start: '#FFD700', // Gold
          end: '#FF69B4',   // Pink
        },
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #FFD700 0%, #FF69B4 100%)',
      },
    },
  },
  plugins: [],
} 