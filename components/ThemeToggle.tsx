'use client';

import clsx from 'clsx';
import { useThemeOptional } from '@/components/ThemeProvider';

type ThemeToggleProps = {
  className?: string;
  /** Larger hit target / inverted colors for dark chrome bars */
  inverted?: boolean;
};

export function ThemeToggle({ className, inverted }: ThemeToggleProps) {
  const themeCtx = useThemeOptional();
  if (!themeCtx) return null;

  const { theme, toggleTheme, ready } = themeCtx;
  const isDark = ready && theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={!ready}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={clsx(
        'inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full transition-colors',
        inverted
          ? 'text-white/75 hover:bg-white/10 hover:text-white'
          : 'text-mk-text-secondary hover:bg-black/[0.04] hover:text-accent-cyan dark:hover:bg-white/10',
        className,
      )}
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M20.5 14.2A7.8 7.8 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
