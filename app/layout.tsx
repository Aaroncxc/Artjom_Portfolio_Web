import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://artjomnaninjan.vercel.app'),
  title: 'Artjom Naninjan | Game Producer · Technical Producer',
  description:
    'Game Producer portfolio — Skyhaven (Arena → Coins → Build), tooling with ship:ingame, and DADB Head of Production (~30–35, multi-site).',
  keywords: [
    'Artjom Naninjan',
    'Game Producer',
    'Associate Producer',
    'Technical Producer',
    'Production Lead',
    'Skyhaven',
    'CoinCraft',
    'Tauri',
    'VFX Studio',
    'Portfolio',
  ],
  authors: [{ name: 'Artjom Naninjan' }],
  openGraph: {
    title: 'Artjom Naninjan | Game Producer · Technical Producer',
    description:
      'Producer — scope locks, playable systems, and the tools that keep them shipping. Skyhaven + DADB production leadership.',
    type: 'website',
    locale: 'en_US',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0b0a' },
  ],
};

const themeBootScript = `(function(){try{var k='artjom-theme';var t=localStorage.getItem(k);var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.style.colorScheme='light';}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="bg-mk-bg-1 text-mk-text min-h-screen overflow-x-hidden">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
