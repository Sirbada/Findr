import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F9F4',
          100: '#E6F2EC',
          500: '#2D8A5F',
          700: '#1B5E3B',
          900: '#0D3D24',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#E8960C',
        },
        base: '#FAFAF8',
        surface: '#FFFFFF',
        subtle: '#F4F4F1',
        overlay: '#EEECEA',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
        hover: '0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        modal: '0 24px 48px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'slide-up': 'slideUp 0.6s ease-out both',
        'scale-in': 'scaleIn 0.4s ease-out both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
