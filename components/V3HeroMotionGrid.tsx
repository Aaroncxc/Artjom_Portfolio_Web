'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const NODES = [
  { x: 12, y: 18 },
  { x: 28, y: 42 },
  { x: 45, y: 22 },
  { x: 62, y: 55 },
  { x: 78, y: 30 },
  { x: 88, y: 68 },
  { x: 18, y: 72 },
  { x: 55, y: 82 },
];

export function V3HeroMotionGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const fineY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 48]);
  const coarseY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -32]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [0.35, 0.65, 0.45, 0.2]);
  const nodeOpacity = useTransform(scrollYProgress, [0, 0.25, 0.6, 1], [0.35, 0.85, 0.55, 0.25]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-[-10%] opacity-[0.22] dark:opacity-[0.14]"
        style={{
          y: coarseY,
          backgroundImage: `
            linear-gradient(to right, rgb(115 115 115 / 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(115 115 115 / 0.35) 1px, transparent 1px)
          `,
          backgroundSize: '96px 96px',
        }}
      />
      <motion.div
        className="absolute inset-[-5%] opacity-[0.4] dark:opacity-[0.25]"
        style={{
          y: fineY,
          backgroundImage: `
            linear-gradient(to right, rgb(163 163 163 / 0.28) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(163 163 163 / 0.28) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />
      <motion.div
        className="absolute left-1/4 top-1/5 h-1/2 w-1/2 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-400/10"
        style={{ opacity: reduceMotion ? 0.35 : glowOpacity }}
      />
      {NODES.map((n, i) => (
        <motion.span
          key={i}
          className="absolute text-[10px] font-light text-sky-600/70 dark:text-sky-400/50"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            opacity: reduceMotion ? 0.4 : nodeOpacity,
          }}
        >
          +
        </motion.span>
      ))}
    </div>
  );
}
