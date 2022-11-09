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
    borderRadius: {
      'none': '0',
      'sm': '0.125rem',
      'DEFAULT': '10px',
      'full': '9999px',
    },
    extend: {
      colors: {
        'dark' : '#080A1D',
        'light' : '#DDD',
        'primary': '#26263F',
        'action': '#406BF5',
        'accent': '#CA3FBD',
        'info': '#94C121',
        'mention': '#5ac8fa',
        'success': '#28a745',
        'waiting': '#ffc107',
        'error': '#ef4444',
        'actiongradient' : '#1C46CD',
      },
      backgroundImage: {
        'gradient-page-head': "linear-gradient(0.75turn, #0b0d25,rgba(15, 20, 49,1))",
        'gradient-page': "radial-gradient(at 100% 100%, rgb(36, 23, 55) 0, transparent 30%), radial-gradient(at 0% 20%, rgb(16, 21, 52) 0, transparent 100%)",
        'gradient-page-mobile': "radial-gradient(at 50% -100%, rgb(36, 23, 55) 0, transparent 50%), radial-gradient(at 0% 20%, rgb(16, 21, 52) 0, transparent 100%)",
        'gradient-modal': "radial-gradient(at 110% 110%, rgb(63, 29, 81) 0, transparent 30%), radial-gradient(at 80% 50%, rgb(15, 22, 59) 0, transparent 100%), radial-gradient(at 0% 20%, rgb(16, 21, 52) 0, transparent 100%)",
        'gradient-modal-header': "linear-gradient(0.75turn, rgba(12, 17, 46,1),rgba(12, 20, 49,1))",
        'gradient-modal-footer': "radial-gradient(circle at 0% 0%, #0A0F27, transparent 100%),radial-gradient(circle at 0% 100%, #090D23, transparent 100%),radial-gradient(circle at 100% 100%, #2B1740, transparent 100%),radial-gradient(circle at 80% 20%,#0C102C, transparent 100%)",
        'gradient-login': "radial-gradient(at 130% 130%, rgb(63, 29, 81) 0, transparent 50%), radial-gradient(at 0% 0%, rgb(15, 22, 59) 0, transparent 100%)",
        'gradient-menu': "radial-gradient(at 200% 50%, rgb(15, 22, 59), transparent 70% )",
        'gradient-menu-light': "radial-gradient(at 200% 50%, rgb(255, 255, 255), transparent 100% )",
        'gradient-menu-mobile': "radial-gradient(at 50% 0%, rgb(15, 22, 59), transparent 70% )",
        'gradient-menu-mobile-light': "radial-gradient(at 50% 0%, rgb(255, 255, 255), transparent 100% )",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem'
        },
      },
    },
  },
  plugins: [],
}
