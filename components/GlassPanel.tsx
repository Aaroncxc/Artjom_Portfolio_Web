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
    default: 'glass-panel',
    heavy: 'glass-panel-heavy',
    subtle:
      'bg-[var(--glass-bg-subtle)] backdrop-blur-[16px] border border-[color:var(--glass-border)] shadow-[var(--glass-shadow)]',
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
    ? 'transition-all duration-250 hover:brightness-105 cursor-pointer'
    : '';

  return (
    <Component
      className={clsx(
        baseStyles[variant],
        paddingStyles[padding],
        roundedStyles[rounded],
        hoverStyles,
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}
