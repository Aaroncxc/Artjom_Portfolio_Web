import type { Metadata } from 'next';
import { INTRO_META } from '@/lib/introCopy';

export const metadata: Metadata = {
  title: INTRO_META.title.en,
  description: INTRO_META.description.en,
  openGraph: {
    title: INTRO_META.title.en,
    description: INTRO_META.description.en,
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
  },
};

export default function IntroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
