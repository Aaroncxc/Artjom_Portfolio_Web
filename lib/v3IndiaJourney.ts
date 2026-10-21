import type { Locale } from '@/lib/v3Content';

export const INDIA_JOURNEY_ID = 'creating-chances';

export type StationTone = 'modern' | 'underserved';

export type JourneyPhoto = {
  src: string;
  alt: { en: string; de: string };
};

export type JourneyStation = {
  id: string;
  city: { en: string; de: string };
  tone: StationTone;
  headline: { en: string; de: string };
  body: { en: string; de: string };
  quoteTodo: true;
};

export type JourneyCopy = {
  eyebrow: { en: string; de: string };
  title: { en: string; de: string };
  subtitle: { en: string; de: string };
  intro: { en: string; de: string };
  roleLine: { en: string; de: string };
  quotePlaceholder: { en: string; de: string };
  indiaGalleryTitle: { en: string; de: string };
  indiaGalleryNote: { en: string; de: string };
  cityPhotoTodo: { en: string; de: string };
  elaBridge: {
    title: { en: string; de: string };
    body: { en: string; de: string };
  };
  elaGalleryTitle: { en: string; de: string };
  scrollHint: { en: string; de: string };
};

export const INDIA_JOURNEY_COPY: JourneyCopy = {
  eyebrow: { en: 'Field chapter · India', de: 'Feld-Kapitel · Indien' },
  title: { en: 'Creating Chances', de: 'Creating Chances' },
  subtitle: {
    en: 'University to university — listening before scaling courses',
    de: 'Uni zu Uni — zuhören, bevor Kurse skaliert werden',
  },
  intro: {
    en: 'For the German Academy of Digital Education (DADB), I travelled through India with the CEO and a shareholder — as the media expert who conceived and built the courses. The trip was not a photo tour: it was about seeing where learning lands, and what students actually need.',
    de: 'Für die Deutsche Akademie für Digitale Bildung (DADB) bin ich mit dem CEO und einem Shareholder durch Indien gereist — als Media-Experte, der die Kurse konzipiert und aufgebaut hat. Die Reise war keine Fototour: Es ging darum zu sehen, wo Lernen ankommt und was Studierende wirklich brauchen.',
  },
  roleLine: {
    en: 'Four stops only: Bangalore, Mumbai, Pune, Kerala.',
    de: 'Vier Stationen: Bangalore, Mumbai, Pune, Kerala.',
  },
  quotePlaceholder: {
    en: 'Quote pending from Artjom',
    de: 'Zitat folgt von Artjom',
  },
  indiaGalleryTitle: {
    en: 'India · impressions from the road',
    de: 'Indien · Eindrücke von der Reise',
  },
  indiaGalleryNote: {
    en: 'Trip-wide gallery — city assignment open (see TODO below).',
    de: 'Galerie der gesamten Reise — Stadt-Zuordnung offen (siehe TODO).',
  },
  cityPhotoTodo: {
    en: 'TODO · City assignment by Artjom (photos are not mapped to Bangalore / Mumbai / Pune / Kerala yet)',
    de: 'TODO · Stadt-Zuordnung durch Artjom (Fotos noch keiner Stadt zugeordnet)',
  },
  elaBridge: {
    title: { en: 'From campuses to the convention floor', de: 'Von den Campuses zur Messe' },
    body: {
      en: 'What we heard in India fed the same learning mission on the road — eLearning Africa, with hands-on VR demos on the floor (fair photos below).',
      de: 'Was wir in Indien hörten, speiste dieselbe Lernmission — eLearning Africa mit Hands-on-VR-Demos auf der Messe (Messe-Fotos unten).',
    },
  },
  elaGalleryTitle: {
    en: 'eLearning Africa · fair photography',
    de: 'eLearning Africa · Messe-Fotografie',
  },
  scrollHint: {
    en: 'Scroll or swipe through the route',
    de: 'Scrollen oder wischen entlang der Route',
  },
};

export const INDIA_JOURNEY_STATIONS: JourneyStation[] = [
  {
    id: 'bangalore',
    city: { en: 'Bangalore', de: 'Bangalore' },
    tone: 'modern',
    headline: {
      en: 'Modern campuses, confident students',
      de: 'Moderne Campuses, selbstbewusste Studierende',
    },
    body: {
      en: 'Students here were very modern in how they learn and what they expect from digital education — a sharp baseline for what “job-ready” can mean in India’s tech hubs.',
      de: 'Studierende hier waren sehr modern in Lernstil und Erwartungen an digitale Bildung — ein klares Bild, was „jobready“ in Indiens Tech-Hubs bedeuten kann.',
    },
    quoteTodo: true,
  },
  {
    id: 'mumbai',
    city: { en: 'Mumbai', de: 'Mumbai' },
    tone: 'modern',
    headline: {
      en: 'Scale, ambition, and clear voices',
      de: 'Größe, Ambition und klare Stimmen',
    },
    body: {
      en: 'Another modern environment — conversations with students surfaced different wishes and career perspectives, even within the same national rollout.',
      de: 'Wieder ein modernes Umfeld — Gespräche mit Studierenden zeigten unterschiedliche Wünsche und Karriereperspektiven, selbst innerhalb derselben nationalen Ausrollung.',
    },
    quoteTodo: true,
  },
  {
    id: 'pune',
    city: { en: 'Pune', de: 'Pune' },
    tone: 'underserved',
    headline: {
      en: 'Strong need for support and investment',
      de: 'Dringender Bedarf an Unterstützung und Investitionen',
    },
    body: {
      en: 'Schools and universities here were strongly under-resourced compared with the coastal hubs — infrastructure and access lagged behind what the course promise required on the ground.',
      de: 'Schulen und Unis hier waren im Vergleich zu den Küsten-Hubs stark unterversorgt — Infrastruktur und Zugang hinterliegen dem, was das Kursversprechen vor Ort braucht.',
    },
    quoteTodo: true,
  },
  {
    id: 'kerala',
    city: { en: 'Kerala', de: 'Kerala' },
    tone: 'underserved',
    headline: {
      en: 'Listening where investment matters most',
      de: 'Zuhören, wo Investitionen am nötigsten sind',
    },
    body: {
      en: 'Again schools and universities that urgently need support and investment — the contrast to Bangalore and Mumbai was visible in facilities and day-to-day learning conditions.',
      de: 'Erneut Schulen und Unis, die dringend Unterstützung und Investitionen brauchen — der Kontrast zu Bangalore und Mumbai zeigte sich in Ausstattung und Lernalltag.',
    },
    quoteTodo: true,
  },
];

/** City ↔ photo mapping intentionally open until Artjom assigns. */
export const INDIA_PHOTO_CITY_ASSIGNMENT_OPEN = true;

/** Chapter gallery — not mapped to cities (Artjom, 2026). */
export const INDIA_JOURNEY_PHOTOS: JourneyPhoto[] = [
  {
    src: '/about/ProductRoadshow1_India_2024.jpg',
    alt: {
      en: 'Students outdoors in front of campus',
      de: 'Studierende draußen vor dem Campus',
    },
  },
  {
    src: '/about/ProductRoadshow2_India_2024.jpg',
    alt: {
      en: 'Artjom with students at a table',
      de: 'Artjom mit Studierenden am Tisch',
    },
  },
  {
    src: '/about/ProductRoadshow_India_2024.jpg',
    alt: {
      en: 'Group at an on-campus event',
      de: 'Gruppe bei einer Veranstaltung auf dem Campus',
    },
  },
  {
    src: '/about/ProductRoadshow3_India_2024.jpg',
    alt: {
      en: 'Delegation in front of REVA University',
      de: 'Delegation vor der REVA University',
    },
  },
];

export const ELA_JOURNEY_PHOTOS: JourneyPhoto[] = [
  {
    src: '/about/E-Learning_Africa_2024.jpg',
    alt: { en: 'Fair hall with VR demo', de: 'Messehalle mit VR-Demo' },
  },
  {
    src: '/about/ELA_130.jpg',
    alt: { en: 'VR demo with visitors', de: 'VR-Demo mit Besuchern' },
  },
  {
    src: '/projects/elearning-africa-kigali-2024/Kigali_Messestand_2.webp',
    alt: { en: 'Booth · Kigali 2024', de: 'Messestand · Kigali 2024' },
  },
  {
    src: '/projects/elearning-africa-kigali-2024/Kigali_Messestand_3.jpg',
    alt: { en: 'Booth detail · Kigali', de: 'Stand-Detail · Kigali' },
  },
  {
    src: '/projects/elearning-africa-kigali-2024/Kigali_Proffesional_1.jpg',
    alt: { en: 'On the floor · Kigali', de: 'Messeboden · Kigali' },
  },
  {
    src: '/projects/elearning-africa-kigali-2024/Kigali_Proffesional_2.jpg',
    alt: { en: 'On the floor · Kigali', de: 'Messeboden · Kigali' },
  },
  {
    src: '/projects/elearning-africa-kigali-2024/Kigali_Proffesional_3.jpg',
    alt: { en: 'On the floor · Kigali', de: 'Messeboden · Kigali' },
  },
  {
    src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_1.jpg',
    alt: { en: 'On the floor · Dakar 2023', de: 'Messeboden · Dakar 2023' },
  },
  {
    src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_2.jpg',
    alt: { en: 'On the floor · Dakar 2023', de: 'Messeboden · Dakar 2023' },
  },
  {
    src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_3.jpg',
    alt: { en: 'On the floor · Dakar 2023', de: 'Messeboden · Dakar 2023' },
  },
  {
    src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_4.jpg',
    alt: { en: 'On the floor · Dakar 2023', de: 'Messeboden · Dakar 2023' },
  },
  {
    src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_5.jpg',
    alt: { en: 'On the floor · Dakar 2023', de: 'Messeboden · Dakar 2023' },
  },
  {
    src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_6.jpg',
    alt: { en: 'On the floor · Dakar 2023', de: 'Messeboden · Dakar 2023' },
  },
];

export function t<T extends { en: string; de: string }>(locale: Locale, block: T): string {
  return locale === 'de' ? block.de : block.en;
}
