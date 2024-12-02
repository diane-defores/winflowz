/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/preline/preline.js",
  ],
  darkMode: "class",
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000000",
      white: "#ffffff",
      gray: colors.gray,
      indigo: colors.indigo,
      neutral: colors.neutral,
      blue: colors.blue,
      // Used mainly for text color
      yellow: {
        50: "#fefce8",
        100: "#fef9c3",
        400: "#facc15",
        500: "#eab308",
      }, // Accent colors, used mainly for star color, heading and buttons
      orange: {
        100: "#ffedd5",
        200: "#fed7aa",
        300: "#fb713b",
        400: "#ff57db", // rose
        500: "#009427",
        600: "#ff57db",
      }, // Primary colors, used mainly for links, buttons and svg icons
      red: colors.red, // Used for bookmark icon
      zinc: colors.zinc, // Used mainly for box-shadow
    },
    extend: {
    },
  },
  plugins: [
    require("tailwindcss/nesting"),
    require("preline/plugin"),
    require("@tailwindcss/forms"),
    function({ addBase, theme }) {
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
