/** Game Producer track — site copy & links (architecture v2, confirmed facts only). */

export const SKYHAVEN_LANDING = 'https://coincraft-skyhaven.vercel.app';
export const REPO_SKYHAVEN = 'https://github.com/Aaroncxc/Coincraft_Skyhaven';
export const REPO_VFX_STUDIO = 'https://github.com/Aaroncxc/skyhaven-vfx-studio';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/artjom-naninjan-5136b1203';

export const PRODUCER_NAV = [
  { href: '/work/skyhaven', label: 'Skyhaven' },
  { href: '/work/dadb-production', label: 'DADB' },
  { href: '/tools', label: 'Tools' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const HOME = {
  headline: 'Producer — scope locks, playable systems, and the tools that keep them shipping.',
  oneLiner:
    'Skyhaven: Arena → Coins → Build on the desktop edge. DADB: Head of Production across ~30–35 people and ~4 sites. Systems exist because the game needed them; tools exist because the systems needed them.',
  proofChips: [
    'Arena + Build Companion · NOW',
    '~30–35 · ~4 sites · DADB',
    'IHK Projektleiter 88/100 (2024)',
  ],
  trailerCaption:
    'Portfolio trailer preview (v4.2) — Arena combat capture still upgrading; coins + build beats reflect the playable NOW lock.',
} as const;

export const MAILTO_SUBJECTS = {
  producer: 'Producer / Skyhaven — Artjom Naninjan',
  technical: 'Technical Producer / Tools — Artjom Naninjan',
  dadb: 'Production Lead background (DADB) — Artjom Naninjan',
} as const;

export const MEDIA = {
  trailerPreview: '/producer/trailer/skyhaven-preview-v4-20s.mp4',
  skyhaven: {
    hub: '/producer/skyhaven/hero-hub.webp',
    arenaDash: '/producer/skyhaven/hero-arena-dash.webp',
    bow: '/producer/skyhaven/hero-bow.webp',
    buildJump: '/producer/skyhaven/build-jump.webp',
    vfxStudio: '/producer/skyhaven/vfx-studio-ui.webp',
    arenaShop: '/producer/skyhaven/arena-shop.jpg',
  },
  dadb: {
    kigali: '/producer/dadb-xr-kigali.jpg',
    senegal: '/producer/Senegal_Dakar_Proffesional_2.jpg',
  },
} as const;
