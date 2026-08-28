import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://artjomnaninjan.vercel.app'),
  title: 'Artjom Naninjan | Senior Production & Project Lead',
  description:
    'Senior production and project lead for digital, creative and technical productions — 35 people, six parallel productions, four sites and three continents.',
  keywords: [
    'Artjom Naninjan',
    'Senior Production Lead',
    'Technical Project Manager',
    'Creative Operations',
    'Delivery Lead',
    'Realtime 3D',
    'XR Production',
    'AI Operations',
    'Portfolio',
  ],
  authors: [{ name: 'Artjom Naninjan' }],
  openGraph: {
    title: 'Artjom Naninjan | Senior Production & Project Lead',
    description:
      'Production leadership for interdisciplinary digital teams: 35 people, six parallel productions, four sites and three continents.',
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
