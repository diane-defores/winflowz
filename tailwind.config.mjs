/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/preline/preline.js",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000000",
      white: "#ffffff",
      gray: colors.gray,
      neutral: colors.neutral,
      // Rainbow gradient colors from logo - PRIMARY BRAND COLORS
      red: "#ff0033",       // Rainbow gradient red
      magenta: "#ff00c8",   // Rainbow gradient magenta  
      yellow: "#ffe500",    // Rainbow gradient yellow
      green: "#00ff44",     // Rainbow gradient green
      cyan: "#00c8ff",      // Rainbow gradient cyan
      // Keep zinc for subtle UI elements
      zinc: colors.zinc,
      emerald: colors.emerald,
    },
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        // Mobile-optimized font sizes (16px base minimum for readability)
        'xs': ['0.8125rem', { lineHeight: '1.5' }],     // 13px
        'sm': ['0.9375rem', { lineHeight: '1.5' }],     // 15px
        'base': ['1rem', { lineHeight: '1.6' }],        // 16px
        'lg': ['1.125rem', { lineHeight: '1.6' }],      // 18px
        'xl': ['1.25rem', { lineHeight: '1.5' }],       // 20px
        '2xl': ['1.5rem', { lineHeight: '1.4' }],       // 24px
        '3xl': ['1.875rem', { lineHeight: '1.3' }],     // 30px
        '4xl': ['2.25rem', { lineHeight: '1.2' }],      // 36px
        '5xl': ['3rem', { lineHeight: '1.1' }],         // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1' }],      // 60px
        '7xl': ['4.5rem', { lineHeight: '1' }],         // 72px
        '8xl': ['6rem', { lineHeight: '1' }],           // 96px
        '9xl': ['8rem', { lineHeight: '1' }],           // 128px
      },
      backgroundImage: {
        'gradient-rainbow': 'linear-gradient(45deg, #ff0033, #ff00c8, #ffe500, #00ff44, #00c8ff, #ff0033)',
        'gradient-rainbow-horizontal': 'linear-gradient(90deg, #ff0033, #ff00c8, #ffe500, #00ff44, #00c8ff, #ff0033)',
      },
    },
  },
  plugins: [
    require("tailwindcss/nesting"),
    require("preline/plugin"),
    require("@tailwindcss/forms"),
    function({ addBase }) {
      addBase({
        'a': { 
          position: 'relative',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: '3px',
            backgroundImage: 'linear-gradient(90deg, #ff0033ff, #ff00c8ff, #ffe500ff, #00ff44ff, #00c8ffff, #ff0033ff)',
          },
          '&::before': {
            width: '0%',
            transition: 'width 0.3s ease-in-out',
          },
          '&::after': {
            opacity: 0,
            backgroundSize: '200% 3px',
            animation: 'gradient-animation 3s linear infinite',
          },
          '&:hover::before': {
            width: '100%',
          },
          '&:hover::after': {
            opacity: 1,
          },
        },
        '.no-hover-animation': {
          '&::before, &::after': {
            display: 'none',
          },
          textDecoration: 'none',
        },
        '@keyframes gradient-animation': {
          '0%': { backgroundPosition: '0% 100%' },
          '100%': { backgroundPosition: '200% 100%' },
        },
      });
    }
  ],
};
