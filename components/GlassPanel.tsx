'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'heavy' | 'subtle';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | 'full';
  as?: 'div' | 'button' | 'article' | 'section';
  onClick?: () => void;
}

export function GlassPanel({
  children,
  className,
  variant = 'default',
  hover = false,
  padding = 'md',
  rounded = '2xl',
  as: Component = 'div',
  onClick,
}: GlassPanelProps) {
  const baseStyles = {
    default: 'bg-[rgba(255,255,255,0.7)] backdrop-blur-[24px] border border-[rgba(28,28,28,0.06)] shadow-[0_4px_24px_rgba(28,28,28,0.05)]',
    heavy: 'bg-[rgba(255,255,255,0.85)] backdrop-blur-[40px] border border-[rgba(28,28,28,0.08)] shadow-[0_8px_32px_rgba(28,28,28,0.08)]',
    subtle: 'bg-[rgba(255,255,255,0.5)] backdrop-blur-[16px] border border-[rgba(28,28,28,0.04)] shadow-[0_2px_12px_rgba(28,28,28,0.03)]',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  const roundedStyles = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  const hoverStyles = hover
    ? 'transition-all duration-250 hover:bg-[rgba(255,255,255,0.9)] hover:border-[rgba(28,28,28,0.10)] hover:shadow-[0_8px_32px_rgba(28,28,28,0.08)] cursor-pointer'
    : '';

  return (
    <Component
      className={clsx(
        baseStyles[variant],
        paddingStyles[padding],
        roundedStyles[rounded],
        hoverStyles,
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}
