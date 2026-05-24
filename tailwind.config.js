/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0F2437',
        olive: '#5E7A6A',
        clay: '#C89B7B',
        paper: '#F5F3EE',
        graphite: '#262626',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 22px 70px rgba(6, 18, 30, 0.28)',
        insetCalm: 'inset 0 1px 0 rgba(245, 243, 238, 0.16)',
      },
      keyframes: {
        settle: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.72' },
          '50%': { transform: 'scale(1.04)', opacity: '0.9' },
        },
      },
      animation: {
        settle: 'settle 680ms cubic-bezier(0.16, 1, 0.3, 1) both',
        breathe: 'breathe 7s cubic-bezier(0.16, 1, 0.3, 1) infinite',
      },
    },
  },
  plugins: [],
};
