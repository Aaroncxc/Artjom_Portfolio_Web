'use client';

import type { ReactNode } from 'react';
import LightLeaksBackground from '@/components/LightLeaksBackground';
import { ProducerNav } from './ProducerNav';
import { ProducerFooter } from './ProducerFooter';

export function ProducerShell({ children }: { children: ReactNode }) {
  return (
    <>
      <LightLeaksBackground />
      <ProducerNav />
      <main className="relative z-[5] min-h-screen pt-24 sm:pt-28">{children}</main>
      <ProducerFooter />
    </>
  );
}
