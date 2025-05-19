/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0056e0',
          600: '#0047AB', // Primary blue
          700: '#003380',
          800: '#001f4d',
          900: '#00101a',
        },
        accent: {
          50: '#e6fff6',
          100: '#b3ffe6',
          200: '#80ffd5',
          300: '#4dffc5',
          400: '#1affb4',
          500: '#00d699',
          600: '#00A86B', // Accent green
          700: '#007a4d',
          800: '#004d30',
          900: '#001a10',
        },
        warning: {
          50: '#fff1ee',
          100: '#ffd9cf',
          200: '#ffc0b0',
          300: '#ffa891',
          400: '#ff8f72',
          500: '#ff7f50', // Warning orange
          600: '#e66a3e',
          700: '#cc552c',
          800: '#b34021',
          900: '#992b11',
        },
        danger: {
          50: '#fee2e2',
          100: '#fecaca',
          200: '#fca5a5',
          300: '#f87171',
          400: '#ef4444',
          500: '#dc2626', // Error red
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};