export type ClientLogo = {
  id: string;
  name: string;
  src: string;
  href: string;
  /** Soft invert in dark mode for dark wordmarks */
  invertInDark?: boolean;
};

/**
 * Partners Artjom delivered for while at DADB — not a freelance client list.
 * Academic: MASTER_PROFIL + About. Industry: MASTER Satz 10 / About.
 * Siemens + Telekom: confirmed by Artjom for this strip.
 * India: public DADB India MoUs (not the full 150-college network).
 */
export const DADB_CLIENT_LOGOS: ClientLogo[] = [
  {
    id: 'hs-offenburg',
    name: 'Hochschule Offenburg',
    src: '/client-logos/hs-offenburg.svg',
    href: 'https://www.hs-offenburg.de/',
  },
  {
    id: 'tu-berlin',
    name: 'TU Berlin',
    src: '/client-logos/tu-berlin.svg',
    href: 'https://www.tu.berlin/',
  },
  {
    id: 'sma',
    name: 'SMA',
    src: '/client-logos/sma.svg',
    href: 'https://www.sma.de/',
  },
  {
    id: 'sunotec',
    name: 'Sunotec',
    src: '/client-logos/sunotec.svg',
    href: 'https://www.sunotec-group.com/',
  },
  {
    id: 'tesla',
    name: 'Tesla',
    src: '/client-logos/tesla.svg',
    href: 'https://www.tesla.com/',
  },
  {
    id: 'siemens',
    name: 'Siemens',
    src: '/client-logos/siemens.svg',
    href: 'https://www.siemens.com/',
  },
  {
    id: 'telekom',
    name: 'Deutsche Telekom',
    src: '/client-logos/telekom.svg',
    href: 'https://www.telekom.com/',
  },
  {
    id: 'adbu',
    name: 'Assam Don Bosco University',
    src: '/client-logos/adbu.svg',
    href: 'https://www.dbuniversity.ac.in/',
  },
  {
    id: 'iftm',
    name: 'IFTM University',
    src: '/client-logos/iftm.svg',
    href: 'https://www.iftmuniversity.ac.in/',
  },
  {
    id: 'sbu',
    name: 'Sarala Birla University',
    src: '/client-logos/sbu.svg',
    href: 'https://www.sbu.ac.in/',
  },
];
