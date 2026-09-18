'use client';

import { CareerTrackProvider } from './CareerTrackContext';
import { CareerNav } from './CareerNav';
import { CareerHero } from './CareerHero';
import { CareerFeaturedCase } from './CareerFeaturedCase';
import { CareerStarterPaths } from './CareerStarterPaths';
import { CareerSelectedWork } from './CareerSelectedWork';
import { CareerLiveDemos } from './CareerLiveDemos';
import { CareerTimeline } from './CareerTimeline';
import { CareerStrengths } from './CareerStrengths';
import { CareerFooter } from './CareerFooter';
import { CareerHireBar } from './CareerHireBar';

export function CareerPageClient() {
  return (
    <CareerTrackProvider>
      <CareerNav />
      <CareerHireBar />
      <main className="career-main">
        <CareerHero />
        <CareerFeaturedCase />
        <CareerStarterPaths />
        <CareerSelectedWork />
        <CareerLiveDemos />
        <CareerTimeline />
        <CareerStrengths />
      </main>
      <CareerFooter />
    </CareerTrackProvider>
  );
}
