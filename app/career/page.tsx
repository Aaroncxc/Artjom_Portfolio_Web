import { CareerNav } from '@/components/career/CareerNav';
import { CareerHero } from '@/components/career/CareerHero';
import { CareerTracks } from '@/components/career/CareerTracks';
import { CareerSelectedWork } from '@/components/career/CareerSelectedWork';
import { CareerTimeline } from '@/components/career/CareerTimeline';
import { CareerStrengths } from '@/components/career/CareerStrengths';
import { CareerFooter } from '@/components/career/CareerFooter';

export default function CareerPage() {
  return (
    <>
      <CareerNav />
      <main>
        <CareerHero />
        <CareerTracks />
        <CareerSelectedWork />
        <CareerTimeline />
        <CareerStrengths />
      </main>
      <CareerFooter />
    </>
  );
}
