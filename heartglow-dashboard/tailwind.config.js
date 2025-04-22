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
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		animation: {
  			'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'subtle-bounce': 'subtle-bounce 2s ease-in-out infinite',
  			fadeIn: 'fadeIn 0.5s ease-out forwards',
  			shimmer: 'shimmer 3s infinite',
  			wiggle: 'wiggle 1.5s ease-in-out infinite',
  			'shadow-glow': 'shadow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
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
  			}
  		},
  		borderRadius: {
  			xl: '1rem',
  			'2xl': '1.5rem',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			glow: '0 0 20px 0 rgba(255, 79, 129, 0.3)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
  darkMode: ['class', "class"],
} 