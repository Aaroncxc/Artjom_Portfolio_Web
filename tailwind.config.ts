import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Theme tokens — values live in CSS variables (:root / html.dark)
        'mk-bg-1': 'var(--color-bg-1)',
        'mk-bg-2': 'var(--color-bg-2)',
        'mk-bg-3': 'var(--color-bg-3)',
        'mk-surface': 'var(--color-surface)',
        'mk-dark': 'var(--color-dark)',

        glass: {
          bg: 'var(--glass-bg)',
          border: 'var(--glass-border)',
          highlight: 'var(--glass-border)',
        },

        // Use color-mix so utilities stay variable-based (not baked to :root rgba).
        'mk-text': 'color-mix(in srgb, var(--text-primary) 100%, transparent)',
        'mk-text-secondary':
          'color-mix(in srgb, var(--text-secondary) 100%, transparent)',
        'mk-text-muted': 'color-mix(in srgb, var(--text-muted) 100%, transparent)',

        'accent-cyan': 'var(--accent-cyan)',
        'accent-violet': 'var(--accent-violet)',
        'accent-coral': 'var(--accent-coral)',
        // Apple-style semantic tokens (HIG-aligned; use for sober system UI chrome)
        'system-blue': '#007AFF',
        'system-blue-pressed': '#0062CC',
        'system-gray': {
          '1': '#8E8E93',
          '2': '#AEAEB2',
          '3': '#C7C7CC',
          '4': '#D1D1D6',
          '5': '#E5E5EA',
          '6': '#F2F2F7',
        },
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      backdropBlur: {
        'glass': '24px',
        'glass-heavy': '40px',
      },
      transitionDuration: {
        '175': '175ms',
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
        '700': '700ms',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'apple-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(28, 28, 28, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        'glass-hover': '0 8px 32px rgba(28, 28, 28, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        'glow-cyan': '0 0 20px rgba(20, 184, 166, 0.25)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.25)',
        'soft': '0 2px 12px rgba(28, 28, 28, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'aurora': 'aurora 20s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'marquee': 'marquee 55s linear infinite',
        'highlight-bento-glow-spin': 'highlightBentoGlowSpin 26s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(5%, 5%) rotate(90deg)' },
          '50%': { transform: 'translate(-5%, 10%) rotate(180deg)' },
          '75%': { transform: 'translate(10%, -5%) rotate(270deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        highlightBentoGlowSpin: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

