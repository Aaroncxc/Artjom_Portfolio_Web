import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://artjomnaninjan.vercel.app'),
  title: 'Artjom Naninjan | AI Portfolio Lead · Learning Content & Production',
  description:
    'Production PM for learning content and AI-enabled course production — 35 people, six parallel course productions, four sites and three continents at DADB.',
  keywords: [
    'Artjom Naninjan',
    'Learning Content',
    'Production PM',
    'AI Portfolio Lead',
    'Course Production',
    'Technical Project Manager',
    'Delivery Lead',
    'AI Authoring',
    'Portfolio',
  ],
  authors: [{ name: 'Artjom Naninjan' }],
  openGraph: {
    title: 'Artjom Naninjan | AI Portfolio Lead · Learning Content & Production',
    description:
      'Production PM for learning content: 35 people, six parallel course productions, four sites and three continents.',
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

const themeBootScript = `(function(){try{var t=localStorage.getItem('artjom-theme');if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.style.colorScheme='light';}}catch(e){}})();`;

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
