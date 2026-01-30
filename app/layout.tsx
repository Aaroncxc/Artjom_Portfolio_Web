import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'multikunst | Art Collective',
  description: 'A creative collective bringing together artists, designers, and makers.',
  keywords: ['art', 'collective', 'design', 'creative', 'multikunst'],
  authors: [{ name: 'multikunst' }],
  openGraph: {
    title: 'multikunst | Art Collective',
    description: 'A creative collective bringing together artists, designers, and makers.',
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
      <body className="bg-mk-dark-1 text-mk-text min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
