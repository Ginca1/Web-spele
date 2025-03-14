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
        fontFamily: {
          nunito: ['Nunito', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };
  