import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7f9',
          100: '#e8eff3',
          200: '#d1dfe7',
          300: '#b0c9d6',
          400: '#90afc5',
          500: '#7499b3',
          600: '#5c82a0',
          700: '#4a6b83',
          800: '#3e576c',
          900: '#336b87',
        },
        secondary: {
          50: '#f8f9f9',
          100: '#f1f2f2',
          200: '#e4e6e6',
          300: '#d1d4d4',
          400: '#b8bcbc',
          500: '#9ca0a0',
          600: '#7d8181',
          700: '#646868',
          800: '#525656',
          900: '#2a3132',
        },
        accent: {
          50: '#f4f7f9',
          100: '#e8eff3',
          200: '#d1dfe7',
          300: '#b0c9d6',
          400: '#90afc5',
          500: '#7499b3',
          600: '#5c82a0',
          700: '#4a6b83',
          800: '#3e576c',
          900: '#336b87',
        },
        mist: '#90AFC5',
        stone: '#336B87',
        shadow: '#2A3132',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
} satisfies Config; 