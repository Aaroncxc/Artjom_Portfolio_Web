import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://artjomnaninjan.vercel.app'),
  title: 'Artjom Naninjan | E-Learning Production & Product Lead',
  description:
    'Course production that delivers: 23 direct reports, six 30-hour courses per year, €380k saved annually through AI avatars. Head of Production in e-learning.',
  keywords: [
    'Artjom Naninjan',
    'Senior Production Lead',
    'Learning Content',
    'Content Production',
    'Production PM',
    'Technical Project Manager',
    'Delivery Lead',
    'Course Production',
    'Portfolio',
  ],
  authors: [{ name: 'Artjom Naninjan' }],
  openGraph: {
    title: 'Artjom Naninjan | E-Learning Production & Product Lead',
    description:
      'Head of Production in e-learning — team of 23, six 30-hour courses per year, AI avatar workflow saving €380k annually.',
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
