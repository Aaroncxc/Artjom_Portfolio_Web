import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Artjom Naninjan | 3D Generalist & App Developer',
  description:
    'Portfolio of Artjom Naninjan — 3D generalist, architect, and app developer crafting immersive product visualisations and interactive experiences.',
  keywords: [
    'Artjom Naninjan',
    '3D Generalist',
    'Architect',
    'App Developer',
    'Product Visualisation',
    'Interactive Design',
    'Portfolio',
  ],
  authors: [{ name: 'Artjom Naninjan' }],
  openGraph: {
    title: 'Artjom Naninjan | 3D Generalist & App Developer',
    description:
      'Portfolio of Artjom Naninjan — 3D generalist, architect, and app developer crafting immersive product visualisations and interactive experiences.',
    type: 'website',
    locale: 'en_US',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B0F1A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-mk-bg-1 text-mk-text min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
