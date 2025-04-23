/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.ts",
    "./resources/**/*.tsx",
  ],
  theme: {
    extend: {

      screens: {
        'w-1300-1600': { raw: '(min-width: 1300px) and (max-width: 1600px)' },
        'w-1000-1300': { raw: '(min-width: 1000px) and (max-width: 1300px)' },

        'min-1300-max-1600': { raw: '(min-height: 1300px) and (max-height: 1600px)' },
        'min-1000-max-1300': { raw: '(min-height: 1000px) and (max-height: 1300px)' },
        'min-900-max-1000': { raw: '(min-height: 900px) and (max-height: 1000px)' },
        'min-850-max-900': { raw: '(min-height: 850px) and (max-height: 900px)' },
        'min-800-max-850': { raw: '(min-height: 800px) and (max-height: 850px)' },
        'min-640-max-800': { raw: '(min-height: 640px) and (max-height: 800px)' },
        'min-441-max-640': { raw: '(min-height: 441px) and (max-height: 640px)' },
        'min-300-max-441': { raw: '(min-height: 300px) and (max-height: 441px)' },
      },

      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        // Add your custom colors here if needed
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-slow-reverse': 'spin 3s linear infinite reverse',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    // Add other plugins here if needed
  ],
};