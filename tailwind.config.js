/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: 'rgb(var(--e-surface))',
        text: 'rgb(var(--e-text))',
      },
      boxShadow: {
        glow: '0 10px 30px -10px rgba(37, 99, 235, 0.45)',
      },
    },
  },
  plugins: [],
};
