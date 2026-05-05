export type ServiceAccent =
  | 'cyan'
  | 'indigo'
  | 'amber'
  | 'rose'
  | 'emerald'
  | 'violet'
  | 'slate'
  | 'pink';

export interface ServiceMedia {
  type: 'image' | 'video';
  src: string;
  alt?: string;
}

export interface Service {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  hero: ServiceMedia;
  samples: ServiceMedia[];
  mailtoSubject: string;
  accent: ServiceAccent;
  /** Mark contact-style tiles that go straight to mailto without opening the regular modal */
  contactTile?: boolean;
}

const CONTACT_EMAIL = 'hello@multikunst.com';

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

export function buildServiceMailto(service: Service) {
  const subject = encodeURIComponent(service.mailtoSubject);
  const body = encodeURIComponent(
    `Hi Multikunst team,\n\n` +
      `I'm interested in your "${service.title}" service.\n\n` +
      `Quick project outline:\n` +
      `\u2022 Goal / concept:\n` +
      `\u2022 Timeline:\n` +
      `\u2022 Budget range:\n\n` +
      `Looking forward to your feedback.\n\n` +
      `Best,\n`
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export const services: Service[] = [
  {
    slug: 'architectural-visualisation',
    title: 'Architectural Visualisation',
    tagline: 'Photorealistic 3D for spaces that don\u2019t exist yet.',
    description:
      'We translate plans, sketches, and moodboards into photoreal stills, motion clips, and immersive previews. Perfect for architecture studios, interior teams, and real-estate communication.',
    bullets: [
      'Stills, Loops & Cinematic Walkthroughs',
      'Realtime web tours & VR previews',
      '3D configurators for material and layout variants',
      'Sun studies, lighting & mood explorations',
    ],
    hero: {
      type: 'video',
      src: '/videos/thehouse.mp4',
      alt: 'The House — cinematic architectural visualization',
    },
    samples: [
      { type: 'image', src: '/services/architectural-visualisation/samples/sample-1.png' },
      { type: 'image', src: '/services/architectural-visualisation/samples/sample-2.png' },
      { type: 'image', src: '/services/architectural-visualisation/samples/sample-3.png' },
      { type: 'image', src: '/services/architectural-visualisation/samples/sample-4.png' },
      { type: 'image', src: '/services/architectural-visualisation/samples/sample-5.png' },
    ],
    mailtoSubject: 'Inquiry: Architectural Visualisation',
    accent: 'indigo',
  },
  {
    slug: 'content-creation',
    title: 'Content Creation',
    tagline: 'Photo, video, and social formats with identity.',
    description:
      'From brand shoots to event reels, we handle concept, production, and edit. You get delivery-ready assets for social, web, and pitch environments.',
    bullets: [
      'Photo & video production',
      'Social-First Reels & Shorts',
      'Event and stage coverage',
      'Styling, location scouting & production design',
    ],
    hero: { type: 'video', src: '/services/content-creation/samples/sample-3.mov' },
    samples: [
      { type: 'image', src: '/services/content-creation/samples/sample-1.jpeg' },
      { type: 'image', src: '/services/content-creation/samples/sample-2.jpeg' },
      { type: 'video', src: '/services/content-creation/samples/sample-3.mov' },
    ],
    mailtoSubject: 'Inquiry: Content Creation',
    accent: 'rose',
  },
  {
    slug: 'corporate-identity',
    title: 'Corporate Identity',
    tagline: 'Brand systems with character.',
    description:
      'Logo systems, brand guidelines, pitch decks, and launch assets. We create coherent visual identities that scale from one-pagers to campaigns.',
    bullets: [
      'Logo systems & wordmarks',
      'Brand Guidelines & Design Tokens',
      'Pitch Decks & Sales Material',
      'Social templates & launch assets',
    ],
    hero: {
      type: 'video',
      src: '/services/corporate-identity/hero.mov',
      alt: 'Solara corporate identity — brand intro film',
    },
    samples: [
      { type: 'image', src: '/projects/rovolto-lost-files/render-1.png' },
      { type: 'image', src: '/projects/rovolto-lost-files/render-2.png' },
      { type: 'image', src: '/projects/rovolto-lost-files/render-3.png' },
    ],
    mailtoSubject: 'Inquiry: Corporate Identity',
    accent: 'amber',
  },
  {
    slug: 'audio-production',
    title: 'Audio Production',
    tagline: 'Sound that supports visual storytelling.',
    description:
      'We produce sound design, score foundations, and final mixes for digital projects, installations, and short-form media with clear sonic direction.',
    bullets: [
      'Original Score & Sounddesign',
      'Voice-Over & Foley',
      'Mixing & Mastering',
      'Interactive audio for games & apps',
    ],
    hero: {
      type: 'image',
      src: '/services/audio-production/hero.png',
      alt: 'MINICOMP V2 tube compressor — 3D product render',
    },
    samples: [],
    mailtoSubject: 'Inquiry: Audio Production',
    accent: 'violet',
  },
  {
    slug: 'post-production',
    title: 'Post Production',
    tagline: 'From raw footage to final master.',
    description:
      'Editing, color, VFX, and motion design from rough cut to final export. We can run full post-production or plug into your existing pipeline.',
    bullets: [
      'Editing & Storytelling',
      'Color Grading (DaVinci)',
      'Motion Graphics & VFX (After Effects, Nuke)',
      'Delivery in any target format / codec',
    ],
    hero: {
      type: 'video',
      src: '/services/post-production/hero.webm',
      alt: 'GADE — trailer (ASA)',
    },
    samples: [
      { type: 'image', src: '/projects/pocket-multipass/front_top.png' },
      { type: 'image', src: '/projects/pocket-multipass/front_top_2.png' },
      { type: 'image', src: '/projects/pocket-multipass/perspective.png' },
    ],
    mailtoSubject: 'Inquiry: Post Production',
    accent: 'cyan',
  },
  {
    slug: 'automations',
    title: 'Automations',
    tagline: 'Custom tools that remove repetitive work.',
    description:
      'We build internal tools, AI workflows, and integration layers that cut manual overhead and help creative teams ship faster.',
    bullets: [
      'Workflow & pipeline automation',
      'Custom Web-Apps & Dashboards',
      'AI / LLM integrations',
      'API bridges between your tools',
    ],
    hero: {
      type: 'image',
      src: '/services/automations/hero.png',
      alt: 'OCCUPIED VFX — browser-based real-time visual effects engine',
    },
    samples: [
      { type: 'image', src: '/tools/Multiview_Multikunst.png' },
      { type: 'image', src: '/tools/coincraft-thumb.png' },
    ],
    mailtoSubject: 'Inquiry: Automations',
    accent: 'emerald',
  },
  {
    slug: 'product-development',
    title: 'Product Development',
    tagline: 'From concept to prototype.',
    description:
      'We support product ideas from early concept to production-ready prototype across 3D, industrial form studies, and interactive web surfaces.',
    bullets: [
      'Concept work & industrial design',
      '3D prototyping & renderings',
      'Web apps, configurators, microsites',
      'Pitchready Decks & Demo-Builds',
    ],
    hero: {
      type: 'video',
      src: '/services/product-development/hero.mp4',
      alt: 'Product demo trailer — solar configurator',
    },
    samples: [
      { type: 'image', src: '/projects/jan-helm/helmet3.png' },
      { type: 'image', src: '/projects/jan-helm/render6.png' },
      { type: 'image', src: '/projects/multiconcert/konzuert-23.png' },
    ],
    mailtoSubject: 'Inquiry: Product Development',
    accent: 'pink',
  },
  {
    slug: 'more',
    title: 'Let\u2019s build something else.',
    tagline: 'Something not listed here?',
    description:
      'We love projects outside standard packages. Send us your concept and we will come back within 48 hours with a clear recommendation.',
    bullets: [
      'Creative consulting & pitch support',
      'Cross-disciplinary Collaborations',
      'Workshops & training',
      'Residencies, Speaking, Curation',
    ],
    hero: { type: 'image', src: '/projects/multiconcert/konzuert181.png' },
    samples: [],
    mailtoSubject: 'Inquiry: Collaboration',
    accent: 'slate',
    contactTile: true,
  },
];

// Tailwind-friendly color tokens used across the grid + modal.
export const accentTokens: Record<
  ServiceAccent,
  { rgb: string; ring: string; chip: string; glow: string }
> = {
  cyan: {
    rgb: '20, 184, 166',
    ring: 'hover:border-[rgba(20,184,166,0.45)]',
    chip: 'bg-[rgba(20,184,166,0.12)] text-[#0d9488]',
    glow: 'from-[rgba(20,184,166,0.18)] to-[rgba(20,184,166,0)]',
  },
  indigo: {
    rgb: '99, 102, 241',
    ring: 'hover:border-[rgba(99,102,241,0.45)]',
    chip: 'bg-[rgba(99,102,241,0.12)] text-[rgb(79,70,229)]',
    glow: 'from-[rgba(99,102,241,0.20)] to-[rgba(99,102,241,0)]',
  },
  amber: {
    rgb: '245, 158, 11',
    ring: 'hover:border-[rgba(245,158,11,0.5)]',
    chip: 'bg-[rgba(245,158,11,0.12)] text-[rgb(180,83,9)]',
    glow: 'from-[rgba(245,158,11,0.20)] to-[rgba(245,158,11,0)]',
  },
  rose: {
    rgb: '244, 63, 94',
    ring: 'hover:border-[rgba(244,63,94,0.45)]',
    chip: 'bg-[rgba(244,63,94,0.12)] text-[rgb(225,29,72)]',
    glow: 'from-[rgba(244,63,94,0.20)] to-[rgba(244,63,94,0)]',
  },
  emerald: {
    rgb: '16, 185, 129',
    ring: 'hover:border-[rgba(16,185,129,0.45)]',
    chip: 'bg-[rgba(16,185,129,0.12)] text-[rgb(5,150,105)]',
    glow: 'from-[rgba(16,185,129,0.20)] to-[rgba(16,185,129,0)]',
  },
  violet: {
    rgb: '139, 92, 246',
    ring: 'hover:border-[rgba(139,92,246,0.45)]',
    chip: 'bg-[rgba(139,92,246,0.12)] text-[rgb(124,58,237)]',
    glow: 'from-[rgba(139,92,246,0.20)] to-[rgba(139,92,246,0)]',
  },
  slate: {
    rgb: '71, 85, 105',
    ring: 'hover:border-[rgba(71,85,105,0.45)]',
    chip: 'bg-[rgba(71,85,105,0.10)] text-[rgb(51,65,85)]',
    glow: 'from-[rgba(71,85,105,0.18)] to-[rgba(71,85,105,0)]',
  },
  pink: {
    rgb: '236, 72, 153',
    ring: 'hover:border-[rgba(236,72,153,0.45)]',
    chip: 'bg-[rgba(236,72,153,0.12)] text-[rgb(219,39,119)]',
    glow: 'from-[rgba(236,72,153,0.20)] to-[rgba(236,72,153,0)]',
  },
};
