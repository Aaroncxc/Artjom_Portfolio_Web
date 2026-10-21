import type { Locale } from '@/lib/v3Content';

export const INDIA_JOURNEY_ID = 'creating-chances';

export type StationTone = 'modern' | 'underserved';

export type JourneyPhoto = {
  src: string | null;
  alt: { en: string; de: string };
  /** Shown in UI when src is null or mapping unverified */
  todo?: { en: string; de: string };
};

export type JourneyStation = {
  id: string;
  city: { en: string; de: string };
  tone: StationTone;
  headline: { en: string; de: string };
  body: { en: string; de: string };
  photo: JourneyPhoto;
  quoteTodo: true;
};

export type JourneyCopy = {
  eyebrow: { en: string; de: string };
  title: { en: string; de: string };
  subtitle: { en: string; de: string };
  intro: { en: string; de: string };
  roleLine: { en: string; de: string };
  quotePlaceholder: { en: string; de: string };
  elaBridge: {
    title: { en: string; de: string };
    body: { en: string; de: string };
  };
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
    en: 'I travelled through India with the CEO and a shareholder — as the media expert who conceived and built the courses. The trip was not a photo tour: it was about seeing where learning lands, and what students actually need.',
    de: 'Ich bin mit dem CEO und einem Shareholder durch Indien gereist — als Media-Experte, der die Kurse konzipiert und aufgebaut hat. Die Reise war keine Fototour: Es ging darum zu sehen, wo Lernen ankommt und was Studierende wirklich brauchen.',
  },
  roleLine: {
    en: 'Four stops only: Bangalore, Mumbai, Pune, Kerala.',
    de: 'Vier Stationen: Bangalore, Mumbai, Pune, Kerala.',
  },
  quotePlaceholder: {
    en: 'Quote pending from Artjom',
    de: 'Zitat folgt von Artjom',
  },
  elaBridge: {
    title: { en: 'From campuses to the convention floor', de: 'Von den Campuses zur Messe' },
    body: {
      en: 'What we heard in India fed the same learning mission on the road — including eLearning Africa, where hands-on VR and AR exercises made the training tangible for visitors (own booth photos below, no course footage).',
      de: 'Was wir in Indien hörten, speiste dieselbe Lernmission unterwegs — auch die eLearning Africa, wo Hands-on-VR- und AR-Übungen die Ausbildung für Besucher greifbar machten (eigene Messe-Fotos, kein Kursmaterial).',
    },
  },
  scrollHint: {
    en: 'Scroll or swipe through the route',
    de: 'Scrollen oder wischen entlang der Route',
  },
};

/**
 * India photos: filenames do not name cities — one image per station as trip photography;
 * city mapping flagged for Artjom confirmation.
 */
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
    photo: {
      src: '/about/ProductRoadshow_India_2024.jpg',
      alt: { en: 'India roadshow — campus visit', de: 'India Roadshow — Campus-Besuch' },
      todo: {
        en: 'TODO: confirm this photo is Bangalore (filename not city-specific)',
        de: 'TODO: Foto-Zuordnung Bangalore bestätigen (Dateiname ohne Stadt)',
      },
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
    photo: {
      src: '/about/ProductRoadshow1_India_2024.jpg',
      alt: { en: 'India roadshow — student exchange', de: 'India Roadshow — Austausch mit Studierenden' },
      todo: {
        en: 'TODO: confirm Mumbai assignment',
        de: 'TODO: Zuordnung Mumbai bestätigen',
      },
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
    photo: {
      src: '/about/ProductRoadshow2_India_2024.jpg',
      alt: { en: 'India roadshow — Pune region visit', de: 'India Roadshow — Besuch Region Pune' },
      todo: {
        en: 'TODO: confirm Pune assignment',
        de: 'TODO: Zuordnung Pune bestätigen',
      },
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
    photo: {
      src: '/about/ProductRoadshow3_India_2024.jpg',
      alt: { en: 'India roadshow — Kerala region visit', de: 'India Roadshow — Besuch Region Kerala' },
      todo: {
        en: 'TODO: confirm Kerala assignment',
        de: 'TODO: Zuordnung Kerala bestätigen',
      },
    },
    quoteTodo: true,
  },
];

export type ElaPhoto = JourneyPhoto;

/** Professional fair photos by Artjom — no course/trailer stills. */
export const ELA_JOURNEY_PHOTOS: ElaPhoto[] = [
  {
    src: '/projects/elearning-africa-kigali-2024/Kigali_Proffesional_1.jpg',
    alt: { en: 'eLearning Africa · Kigali · on the floor', de: 'eLearning Africa · Kigali · Messeboden' },
  },
  {
    src: '/projects/elearning-africa-kigali-2024/Kigali_Messestand_2.webp',
    alt: { en: 'German Pavilion booth · Kigali', de: 'Stand Deutscher Pavillon · Kigali' },
  },
  {
    src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_1.jpg',
    alt: { en: 'eLearning Africa · Dakar · professional', de: 'eLearning Africa · Dakar · Profi-Foto' },
  },
  {
    src: '/about/ELA_130.jpg',
    alt: { en: 'eLearning Africa · event', de: 'eLearning Africa · Veranstaltung' },
    todo: {
      en: 'TODO: confirm year/city for ELA_130.jpg',
      de: 'TODO: Jahr/Stadt für ELA_130.jpg bestätigen',
    },
  },
];

export function t<T extends { en: string; de: string }>(locale: Locale, block: T): string {
  return locale === 'de' ? block.de : block.en;
}
