/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    fontSize: {
      'xs': '0.694rem',
      'sm': '0.833rem',
      'base': '1rem',
      'xl': '1.2rem',
      '2xl': '1.44rem',
      '3xl': '1.728rem',
      '4xl': '2.074rem',
      '5xl': '2.448rem',
    },
    extend: {
      colors: {
        'primary': '#26263F',
        'action': '#406BF5',
        'actiongradient' : '#1C46CD',
        'info': '#94C121',
        'mention': '#5ac8fa',
        'success': '#28a745',
        'waiting': '#ffc107',
        'error': '#ef4444',
        'dark' : '#080A1D'
      },
    },
  },
  plugins: [],
}
