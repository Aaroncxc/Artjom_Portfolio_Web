'use client';

import { motion } from 'framer-motion';
import type { ServiceAccent } from '@/lib/services';
import { accentTokens } from '@/lib/services';

interface ServicePlaceholderProps {
  accent: ServiceAccent;
  variant?: 'default' | 'mini';
  className?: string;
}

/**
 * CSS-only animated placeholder used for service samples that have no real media yet.
 * Renders a soft accent gradient with two slow-moving blurred blobs, plus a subtle
 * "Coming soon" hint on the default variant.
 */
export function ServicePlaceholder({
  accent,
  variant = 'default',
  className = '',
}: ServicePlaceholderProps) {
  const tokens = accentTokens[accent];
  const rgb = tokens.rgb;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, rgba(${rgb}, 0.18) 0%, rgba(${rgb}, 0.04) 60%, rgba(255,255,255,0.6) 100%)`,
      }}
    >
      {/* Animated blob 1 */}
      <motion.div
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: '70%',
          height: '70%',
          top: '-15%',
          left: '-10%',
          background: `radial-gradient(circle at center, rgba(${rgb}, 0.55) 0%, rgba(${rgb}, 0) 70%)`,
          filter: 'blur(28px)',
        }}
        animate={{
          x: [0, 18, -12, 0],
          y: [0, 10, -16, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Animated blob 2 */}
      <motion.div
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: '60%',
          height: '60%',
          bottom: '-15%',
          right: '-15%',
          background: `radial-gradient(circle at center, rgba(${rgb}, 0.40) 0%, rgba(${rgb}, 0) 70%)`,
          filter: 'blur(36px)',
        }}
        animate={{
          x: [0, -14, 8, 0],
          y: [0, -10, 14, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grain overlay (CSS only) */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>\")",
        }}
      />

      {/* Centered hint (default variant only) */}
      {variant === 'default' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-1.5 px-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: `rgba(${rgb}, 0.18)`,
                color: `rgb(${rgb})`,
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-[11px] uppercase tracking-[0.22em] text-mk-text-muted">
              Sample soon
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
