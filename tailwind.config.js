/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--v2-border))',
        input: 'hsl(var(--v2-input))',
        ring: 'hsl(var(--v2-ring))',
        background: 'hsl(var(--v2-background))',
        foreground: 'hsl(var(--v2-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--v2-primary))',
          foreground: 'hsl(var(--v2-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--v2-secondary))',
          foreground: 'hsl(var(--v2-secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--v2-destructive))',
          foreground: 'hsl(var(--v2-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--v2-muted))',
          foreground: 'hsl(var(--v2-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--v2-accent))',
          foreground: 'hsl(var(--v2-accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--v2-popover))',
          foreground: 'hsl(var(--v2-popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--v2-card))',
          foreground: 'hsl(var(--v2-card-foreground))',
        },
        chart: {
          '1': 'hsl(var(--v2-chart-1))',
          '2': 'hsl(var(--v2-chart-2))',
          '3': 'hsl(var(--v2-chart-3))',
          '4': 'hsl(var(--v2-chart-4))',
          '5': 'hsl(var(--v2-chart-5))',
        }
      },
      borderRadius: {
        lg: 'var(--v2-radius)',
        md: 'calc(var(--v2-radius) - 2px)',
        sm: 'calc(var(--v2-radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--reka-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--reka-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [],
}
