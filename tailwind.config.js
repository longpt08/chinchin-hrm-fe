/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#5C4033',
          primaryHover: '#4A3329',
          secondary: '#C89F7A',
          bg: '#F9F6F0',
          surface: '#FFFFFF',
          textMain: '#2C2118',
          textMuted: '#7E6C5F',
          border: '#E8E0D5',
        },
        status: {
          success: '#6B8E23',
          successBg: '#E8F5E9',
          danger: '#D32F2F',
          dangerBg: '#FFEBEE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(92, 64, 51, 0.08)',
        medium: '0 8px 30px rgba(92, 64, 51, 0.12)',
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
