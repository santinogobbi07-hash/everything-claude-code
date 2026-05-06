/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0d12',
          surface: '#11161d',
          card: '#161c25',
          elevated: '#1c2430'
        },
        accent: {
          DEFAULT: '#39ff88',
          dim: '#1ecc6c',
          glow: 'rgba(57, 255, 136, 0.35)'
        },
        edge: '#222b38',
        muted: '#7a8699'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 24px rgba(57, 255, 136, 0.25)',
        card: '0 4px 18px rgba(0, 0, 0, 0.45)'
      },
      animation: {
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
        shimmer: 'shimmer 1.4s linear infinite'
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 }
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' }
        }
      }
    }
  },
  plugins: []
};
