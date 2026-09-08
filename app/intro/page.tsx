'use client';

import { Suspense } from 'react';
import { PitchDeck } from '@/components/intro/PitchDeck';

function IntroFallback() {
  return (
    <div className="flex h-[100dvh] items-center justify-center bg-mk-bg-1 text-mk-text-secondary">
      Loading intro…
    </div>
  );
}

export default function IntroPage() {
  return (
    <Suspense fallback={<IntroFallback />}>
      <PitchDeck />
    </Suspense>
  );
}
