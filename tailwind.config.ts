import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#B8A574',
          light: '#C9BC96',
          dark: '#9E8E63',
        },
        gold: {
          DEFAULT: '#B8A574',
          light: '#C9BC96',
          dark: '#9E8E63',
        },
        // Sıcak şampanya zemin — Pomelli'nin okuyacağı marka paleti
        cream: {
          DEFAULT: '#FAF8F5',
          deep: '#F2EDE4',
          deeper: '#EAE1D1',
        },
        pill: {
          DEFAULT: '#F2EDE4',
          hover: '#EAE1D1',
        },
        border: {
          DEFAULT: '#E8E0D2',
          dark: '#D6C9AF',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Inter', 'sans-serif'],
        serif: ['var(--font-heading)', 'Cormorant Garamond', 'serif'],
      },
      fontSize: {
        'display-lg': [
          'clamp(3rem, 6vw, 5rem)',
          { lineHeight: '1.05', letterSpacing: '-0.03em' },
        ],
        display: [
          'clamp(2.5rem, 5.5vw, 4.5rem)',
          { lineHeight: '1.1', letterSpacing: '-0.03em' },
        ],
        'display-sm': [
          'clamp(2rem, 4vw, 3.5rem)',
          { lineHeight: '1.15', letterSpacing: '-0.025em' },
        ],
        eyebrow: ['13px', { lineHeight: '1', letterSpacing: '0' }],
      },
      boxShadow: {
        xs: '0 1px 2px rgba(0,0,0,0.03)',
        sm: '0 2px 8px rgba(0,0,0,0.05)',
        md: '0 4px 16px rgba(0,0,0,0.07)',
        lg: '0 8px 24px rgba(0,0,0,0.09)',
        xl: '0 12px 32px rgba(0,0,0,0.11)',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
