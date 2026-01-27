/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          bg: '#0A0A0C',
          'bg-alt': '#0D0D0F',
          card: '#121316',
          border: '#1E1E24',
          text: {
            primary: '#FFFFFF',
            secondary: '#CCCCCC',
            muted: '#666666',
            subtle: '#404040',
            dim: '#333333',
          },
        },
        social: {
          kakao: '#FEE500',
          google: '#FFFFFF',
        },
        status: {
          success: '#4ADE80',
          error: '#FF6B6B',
          info: '#6BA3FF',
          warning: '#FACC15',
        }
      },
      dropShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.5)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.6)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        'wider-xl': '4px',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
