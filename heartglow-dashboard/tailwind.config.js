/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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
          success: '#00BFA6'
        },
        gradientFrom: '#0D0D12',
        gradientTo: '#1B0F2B',
        plum: '#1B0F2B',
        blush: 'rgba(255, 210, 250, 0.15)',
        softGold: '#FFD700',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
      keyframes: {
        pulse: {
          '0%, 100%': {
            opacity: 1
          },
          '50%': {
            opacity: 0.7
          }
        },
        'pulse-slow': {
          '0%, 100%': {
            opacity: 0.6
          },
          '50%': {
            opacity: 0.2
          }
        },
        'subtle-bounce': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-4px)'
          }
        },
        fadeIn: {
          from: {
            opacity: 0,
            transform: 'translateY(10px)'
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)'
          }
        },
        fadeInDelay: {
          '0%, 70%': {
            opacity: 0
          },
          '100%': {
            opacity: 1
          }
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0'
          },
          '100%': {
            backgroundPosition: '200% 0'
          }
        },
        wiggle: {
          '0%, 100%': {
            transform: 'rotate(0deg)'
          },
          '25%': {
            transform: 'rotate(15deg)'
          },
          '50%': {
            transform: 'rotate(0deg)'
          },
          '75%': {
            transform: 'rotate(-15deg)'
          }
        },
        'shadow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 15px 0 rgba(255, 79, 129, 0.1)'
          },
          '50%': {
            boxShadow: '0 0 25px 5px rgba(255, 79, 129, 0.3)'
          }
        },
        'typing-animation': {
          '0%, 100%': {
            opacity: 0.2,
            transform: 'translateY(0px)'
          },
          '50%': {
            opacity: 1,
            transform: 'translateY(-2px)'
          }
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-bounce': 'subtle-bounce 2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        'fade-in-delay': 'fadeInDelay 2s ease-out forwards',
        shimmer: 'shimmer 3s infinite',
        wiggle: 'wiggle 1.5s ease-in-out infinite',
        'shadow-glow': 'shadow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing-1': 'typing-animation 1s infinite 0.1s',
        'typing-2': 'typing-animation 1s infinite 0.3s',
        'typing-3': 'typing-animation 1s infinite 0.5s',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        glow: '0 0 15px 2px rgba(255, 79, 129, 0.4)',
        'glow-md': '0 0 25px 5px rgba(255, 79, 129, 0.5)',
        'glow-panel': '0 0 20px rgba(255, 210, 250, 0.15)',
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        '2xl': "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}