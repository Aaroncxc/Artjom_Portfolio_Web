import type { Metadata, Viewport } from 'next';
import './career.css';

export const metadata: Metadata = {
  title: 'Artjom Naninjan | Production & AI Learning Lead',
  description:
    'Production & AI Learning Lead — ~35 people, six parallel productions, four sites. eLearning, creative production, and gaming leadership.',
  openGraph: {
    title: 'Artjom Naninjan | Production & AI Learning Lead',
    description:
      'Production systems for interdisciplinary teams — pipeline, staffing, launch, and AI tooling. Open to eLearning, creative, and gaming leadership roles.',
    type: 'website',
    locale: 'en_US',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
};

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="career-theme min-h-screen" data-career-portfolio>
      {children}
    </div>
  );
}
