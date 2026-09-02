import type { CaseSection, CaseSectionMedia, Project } from '@/lib/types';

/**
 * Narrative overrides for Drive / posts.json projects.
 * Keeps What / Why / How case studies stable even if ingest refreshes thin sections.
 * See `.cursor/rules/case-study-narrative.mdc`.
 */

function img(
  src: string,
  title?: string,
  extra?: Partial<CaseSectionMedia>,
): CaseSectionMedia {
  return { kind: 'image', src, title, fit: 'contain', ...extra };
}

function vid(src: string, title?: string, extra?: Partial<CaseSectionMedia>): CaseSectionMedia {
  return { kind: 'video', src, title, ...extra };
}

/** Required editorial spine for portfolio case studies. */
export const CASE_STUDY_NARRATIVE_SLUGS = [
  'dadb-course-production-trailers',
  'dadb-solar-technician-digital-campus',
  'lexsolar-digital-learning-kit',
  'elearning-africa-dakar-senegal-2023',
  'elearning-africa-kigali-2024',
  'rekuperation-education',
  'multi-watch',
  'jan-helm',
  'multiconcert',
  'tshirt-jan',
  'pult-vacuum',
  'multiply',
  'rovolto-lost-files',
  'ice-gel',
  'sticker-box',
  'pocket-multipass',
  'the-house',
  'mask-sculpture',
] as const;

export const CASE_STUDY_NARRATIVES: Record<string, CaseSection[]> = {
  'dadb-course-production-trailers': [
    {
      heading: 'What it is',
      body: `A collection of **final release trailers** for DADB digital learning courses shipped while I was **Head of Production** at the German Academy of Digital Education — 5G, e-mobility, hydrogen, IoT, solar, and wind.

Each trailer is a release artifact: the public face of a finished course after production, review, and platform handoff — not a pitch reel for unfinished work.`,
      layout: 'text-left',
      media: [img('/projects/dadb-course-production-trailers/5g-communication-technology.webp', '5G')],
    },
    {
      heading: 'What it is for',
      body: `DADB needed credible **course releases** on its own platform (and as elective modules elsewhere). Trailers had to sell the learning offer clearly while several productions ran in parallel — so sequencing and sign-off stayed as important as the edit.`,
      layout: 'text-right',
      media: [img('/projects/dadb-course-production-trailers/e-mobility.webp', 'E-mobility')],
    },
    {
      heading: 'How it was made',
      body: `I owned **end-to-end delivery**: production planning, cross-team coordination with 3D and editorial, and final platform release. Trailers were built in the Blender → Unreal pipeline used across DADB course work, then encoded for the platform.

The behind-the-scenes work was keeping **parallel tracks** honest — dependencies, reviews, and release dates that still held when workloads stacked.`,
      layout: 'text-left',
      media: [img('/projects/dadb-course-production-trailers/hydrogen-technology.webp', 'Hydrogen')],
    },
    {
      heading: 'More trailers',
      body: 'Additional release stills from the shipped course set.',
      layout: 'gallery',
      media: [
        img('/projects/dadb-course-production-trailers/internet-of-things.webp', 'IoT'),
        img('/projects/dadb-course-production-trailers/solar-electricity-systems.webp', 'Solar'),
        img('/projects/dadb-course-production-trailers/wind-power.webp', 'Wind'),
      ],
    },
  ],

  'dadb-solar-technician-digital-campus': [
    {
      heading: 'What it is',
      body: `An **immersive digital campus** for DADB’s Solar Technician program — lecture rooms, a social hub, training areas, and a **gamified solarpark** learners can explore as a walkable world rather than a static course shell.

Architecture started in **Archicad**; interaction and presentation lived in **Unreal**, with Blender for asset production.`,
      layout: 'text-left',
      media: [img('/projects/dadb-solar-technician-digital-campus/campus-hero.webp', 'Campus hero')],
    },
    {
      heading: 'What it is for',
      body: `The goal was to introduce the Solar Technician profession through an **immersive learning experience** — developed with editorial, production, the 3D/Unreal team, and partners including SMA and Offenburg.

Stakeholders needed to **walk the space**, not only approve stills: hub-table flows and solar-park management demos had to read as training, not as a flythrough vanity piece.`,
      layout: 'text-right',
      media: [img('/projects/dadb-solar-technician-digital-campus/solarpark-manage-01.webp', 'Solar park')],
    },
    {
      heading: 'How it was made',
      body: `As Head of Production / architecture–realtime lead, I kept **Archicad ↔ Unreal** geometry and materials in sync so design changes could still land late without rebuilding the interactive pass from scratch.

Hub-table and solar-park sequences were authored as learning flows: clear POIs, readable UI in-world, and demos stakeholders could run live.`,
      layout: 'text-left',
      media: [img('/projects/dadb-solar-technician-digital-campus/hub-table-01.webp', 'Hub table')],
    },
    {
      heading: 'More screens',
      body: 'Additional campus and management frames from the delivery.',
      layout: 'gallery',
      media: [
        img('/projects/dadb-solar-technician-digital-campus/hub-table-02.webp', 'Hub table · alt'),
        img('/projects/dadb-solar-technician-digital-campus/solarpark-manage-02.webp', 'Solar park · alt'),
        img('/projects/dadb-solar-technician-digital-campus/hub-table-03.webp', 'Hub table · editor'),
      ],
    },
  ],

  'lexsolar-digital-learning-kit': [
    {
      heading: 'What it is',
      body: `A **digital prototype** of Lexsolar’s physical solar learning kits — modules, meters, cables, plugs, and experiment parts recreated in **Blender** and turned into an interactive **Unity** learning environment for DADB × Lexsolar.`,
      layout: 'text-left',
      media: [img('/projects/lexsolar-digital-learning-kit/ingame-01.webp', 'In-game')],
    },
    {
      heading: 'What it is for',
      body: `Physical kits do not scale to every classroom. The brief was to test whether the **same exercises** could live digitally with enough fidelity that SMEs and Lexsolar still recognized the hardware — and learners could run virtual solar experiments without the full physical case.`,
      layout: 'text-right',
      media: [img('/projects/lexsolar-digital-learning-kit/ingame-03.webp', 'Exercise UI')],
    },
    {
      heading: 'How it was made',
      body: `I led production and 3D scope: kit recreation in Blender, then a Unity learning game with a programmer in the distributed team. The hard part was **matching physical kit logic** to digital exercise UX — cables, measurements, and steps that still feel like the real lab.`,
      layout: 'text-left',
      media: [img('/projects/lexsolar-digital-learning-kit/ingame-05.webp', 'Kit in scene')],
    },
    {
      heading: 'More screens',
      body: 'Additional in-game prototype frames.',
      layout: 'gallery',
      media: [
        img('/projects/lexsolar-digital-learning-kit/ingame-06.webp', 'Interaction'),
        img('/projects/lexsolar-digital-learning-kit/ingame-02.webp', 'In-game · 02'),
        img('/projects/lexsolar-digital-learning-kit/ingame-04.webp', 'In-game · 04'),
      ],
    },
  ],

  'elearning-africa-dakar-senegal-2023': [
    {
      heading: 'What it is',
      body: `An interactive **VR booth experience** for DADB at **E-Learning Africa 2023** in Dakar (German Pavilion): a 1:1 Solar / Inverter training scenario where visitors step into the scene, interact with components, and follow a guided task.`,
      layout: 'text-left',
      media: [img('/projects/elearning-africa-dakar-senegal-2023/vr-scene-00.webp', 'VR space')],
    },
    {
      heading: 'What it is for',
      body: `The fair needed more than a slide deck. The VR slice presented **DADB’s digital learning portfolio** under real visitor load — headset onboarding, companion-bot guidance, and a booth footprint that still worked inside the pavilion layout.`,
      layout: 'text-right',
      media: [img('/projects/elearning-africa-dakar-senegal-2023/vr-scene-02.webp', 'Inverter scenario')],
    },
    {
      heading: 'How it was made',
      body: `As Mixed Reality Lead I aligned **Archicad** (space), **Blender** (assets), and **Unreal** (interaction / blueprints) under a trade-fair deadline. Companion-bot behaviour and task logic were authored in Unreal so guidance stayed consistent for operators on the floor.`,
      layout: 'text-left',
      media: [img('/projects/elearning-africa-dakar-senegal-2023/vr-scene-04.webp', 'Training props')],
    },
    {
      heading: 'More frames',
      body: 'Additional VR and booth documentation stills.',
      layout: 'gallery',
      media: [
        img('/projects/elearning-africa-dakar-senegal-2023/vr-scene-06.webp', 'Guided task'),
        img('/projects/elearning-africa-dakar-senegal-2023/vr-scene-01.webp', 'VR · 01'),
        img('/projects/elearning-africa-dakar-senegal-2023/vr-scene-03.webp', 'VR · 03'),
        img('/projects/elearning-africa-dakar-senegal-2023/vr-scene-05.webp', 'VR · 05'),
        img('/projects/elearning-africa-dakar-senegal-2023/vr-scene-07.webp', 'VR · 07'),
      ],
    },
  ],

  'elearning-africa-kigali-2024': [
    {
      heading: 'What it is',
      body: `An interactive **AR inverter-installation** experience for DADB at **E-Learning Africa 2024** in Kigali — visitors follow how an inverter is installed and what matters in each technical step, developed with SMA stakeholders.`,
      layout: 'text-left',
      media: [img('/projects/elearning-africa-kigali-2024/Kigali_AR_2.webp', 'AR demo')],
    },
    {
      heading: 'What it is for',
      body: `The booth had to show **hands-on AR learning**, not a poster wall. Editorial, production, internal experts, and SMA aligned on a visitor-facing flow that still survived convention-floor conditions at the Kigali Convention Center.`,
      layout: 'text-right',
      media: [img('/projects/elearning-africa-kigali-2024/Kigali_Messestand_2.webp', 'Booth')],
    },
    {
      heading: 'How it was made',
      body: `As Head of Production I coordinated architecture, asset, and realtime pipelines into one demo: storyboarding and pacing with the exhibiting team, Unreal/AR build readiness, and live operator support on the floor.`,
      layout: 'text-left',
      media: [img('/projects/elearning-africa-kigali-2024/Kigali_AR_4.webp', 'AR step')],
    },
    {
      heading: 'More documentation',
      body: 'Booth and live-demo stills from Kigali.',
      layout: 'gallery',
      media: [
        img('/projects/elearning-africa-kigali-2024/Kigali_AR_5.webp', 'AR detail'),
        img('/projects/elearning-africa-kigali-2024/Kigali_ConventionCenter.jpg', 'Convention Center'),
        img('/projects/elearning-africa-kigali-2024/Kigali_AR_3.webp', 'AR · 03'),
        img('/projects/elearning-africa-kigali-2024/Kigali_AR_6.webp', 'AR · 06'),
        img('/projects/elearning-africa-kigali-2024/Kigali_Proffesional_1.jpg', 'Live demo'),
      ],
    },
  ],

  'rekuperation-education': [
    {
      heading: 'What it is',
      body: `A **cinematic education piece** on rekuperation in e-mobility — translating a technical script into paced 3D storytelling for learners and faculty review at DADB.`,
      layout: 'text-left',
      media: [img('/projects/rekuperation-education/rekuperation-edu-video.webp', 'Hero still')],
    },
    {
      heading: 'What it is for',
      body: `Subject-matter experts needed a film that **explains energy recovery** without drowning learners in diagrams. The piece sits inside course material: clear beats, readable motion, and stills that work in reviews and platform embeds.`,
      layout: 'text-right',
      media: [img('/projects/rekuperation-education/rekuperation-edu-video-1.webp', 'Explain beat')],
    },
    {
      heading: 'How it was made',
      body: `Production planning with SMEs, Blender-to-Unreal handoff rhythms, reviews, and sign-off for course integration. The process was editorial as much as 3D: lock the script beats, then stage camera and motion so each concept lands once.`,
      layout: 'text-left',
      media: [img('/projects/rekuperation-education/rekuperation-edu-video-2.webp', 'Motion still')],
    },
    {
      heading: 'More frames',
      body: 'Additional education stills and review frames.',
      layout: 'gallery',
      media: [
        img('/projects/rekuperation-education/artjom-schlarp-1.jpg', 'Production'),
        img('/projects/rekuperation-education/rekuperation-edu-video-3.webp', 'Still · 03'),
        img('/projects/rekuperation-education/rekuperation-edu-video-5.webp', 'Still · 05'),
      ],
    },
  ],

  'multi-watch': [
    {
      heading: 'What it is',
      body: `A Multikunst **wristwatch product film** — proportions, layered dials, and materials in a short launch-style clip. The deliverable is the motion piece itself: a wearable object that reads in a few seconds of screen time.`,
      layout: 'full-media',
      media: [vid('/projects/multi-watch/Final%20Multiwatch%20Clip.webm', 'Multi Watch film')],
    },
    {
      heading: 'What it is for',
      body: `Portfolio and brand presentation under Multikunst: show mechanical detail and material hierarchy without a physical sample set. The film has to sell the object as jewelry-grade product design, not as a tech mock.`,
      layout: 'text-left',
    },
    {
      heading: 'How it was made',
      body: `Collective production — 3D modelling, lighting, and edit for a short launch-style product clip in Blender / After Effects. Behind the scenes the work is classic product film craft: lock silhouette and dial read first, then motion that does not fight the materials.`,
      layout: 'text-left',
      media: [img('/projects/multi-watch/Thumbnail.png', 'Key art')],
    },
  ],

  'jan-helm': [
    {
      heading: 'What it is',
      body: `A **3D helmet / headgear** product study — form, materials, and presentation stills that treat the object as industrial design rather than a game prop dump.`,
      layout: 'text-left',
      media: [img('/projects/jan-helm/helmet1-alt.png', 'Helmet')],
    },
    {
      heading: 'What it is for',
      body: `Show how a hard-surface wearable reads under controlled lighting — portfolio piece for product visualisation and material storytelling.`,
      layout: 'text-right',
      media: [img('/projects/jan-helm/helmet3.png', 'Alternate angle')],
    },
    {
      heading: 'How it was made',
      body: `Modelled and rendered as a focused product study: silhouette first, then material passes until the object stays readable in stills. Process is look-dev heavy — fewer shots, higher material honesty.`,
      layout: 'text-left',
      media: [img('/projects/jan-helm/render6.webp', 'Render pass')],
    },
  ],

  multiconcert: [
    {
      heading: 'What it is',
      body: `**MultiConcert** — a visual / event-facing Multikunst piece captured as a set of concert-atmosphere stills: light, crowd scale, and graphic energy for a live-culture brief.`,
      layout: 'text-left',
      media: [img('/projects/multiconcert/konzuert-23.webp', 'Concert still')],
    },
    {
      heading: 'What it is for',
      body: `Communicate a concert or live-culture mood for Multikunst without claiming a full festival production credit — images that carry atmosphere for decks and portfolio storytelling.`,
      layout: 'text-right',
      media: [img('/projects/multiconcert/konzuert-5542.webp', 'Atmosphere')],
    },
    {
      heading: 'How it was made',
      body: `Shot and selected as a visual set: prioritize readable light and composition over volume of frames. The edit is curation — keep the images that still work small on a portfolio tile.`,
      layout: 'text-left',
      media: [img('/projects/multiconcert/konzuert161.webp', 'Frame · 161')],
    },
    {
      heading: 'More frames',
      layout: 'gallery',
      media: [
        img('/projects/multiconcert/konzuert171.webp', 'Frame · 171'),
        img('/projects/multiconcert/konzuert181.webp', 'Frame · 181'),
      ],
    },
  ],

  'tshirt-jan': [
    {
      heading: 'What it is',
      body: `A **T-shirt / merch presentation** for JanMitGun — how the graphic sits on the garment outdoors and in nature contexts, art-directed as a fashion stills set.`,
      layout: 'text-left',
      media: [img('/projects/tshirt-jan/shirt1.png', 'Garment')],
    },
    {
      heading: 'What it is for',
      body: `Sell the print on a real body and in real light — not a flat mockup. The set is for brand and merch storytelling where the environment is part of the product read.`,
      layout: 'text-right',
      media: [img('/projects/tshirt-jan/djungle.webp', 'Jungle set')],
    },
    {
      heading: 'How it was made',
      body: `Art direction and presentation: choose locations that support the graphic, keep the shirt readable at thumbnail size, and build a small outdoor sequence rather than one hero shot.`,
      layout: 'text-left',
      media: [img('/projects/tshirt-jan/outdoor1a.webp', 'Outdoor · 1')],
    },
    {
      heading: 'More stills',
      layout: 'gallery',
      media: [
        img('/projects/tshirt-jan/outdoor2.webp', 'Outdoor · 2'),
        img('/projects/tshirt-jan/outdoor2a.webp', 'Outdoor · 2a'),
        img('/projects/tshirt-jan/outdoor3.webp', 'Outdoor · 3'),
      ],
    },
  ],

  'pult-vacuum': [
    {
      heading: 'What it is',
      body: `**PULT — Keep Cleaning**: a futuristic vacuum concept that blends industrial design with space-age aesthetics — drum filter language, organic tech components, and a silhouette that reads as both appliance and prop.`,
      layout: 'text-left',
      media: [img('/projects/pult-vacuum/pult-praesentation.webp', 'Presentation')],
    },
    {
      heading: 'What it is for',
      body: `A self-briefed product concept for the portfolio: prove industrial product design storytelling in 3D — form studies and a browser presentation so recruiters can orbit the asset live.`,
      layout: 'text-right',
      media: [img('/projects/pult-vacuum/pult-90grad.webp', 'Form study')],
    },
    {
      heading: 'How it was made',
      body: `Concept, modelling, materials, and presentation owned in Blender, then shipped as an interactive browser build with the GLB. Process: lock the silhouette, refine the drum-filter read, then turntable / stills for the deck.`,
      layout: 'text-left',
      media: [img('/projects/pult-vacuum/pult-90grad-2.webp', 'Angle · 2')],
    },
    {
      heading: 'More views',
      layout: 'gallery',
      media: [
        img('/projects/pult-vacuum/pult-90grad-3.webp', 'Angle · 3'),
        img('/projects/pult-vacuum/pult-90grad-4.webp', 'Angle · 4'),
      ],
    },
  ],

  multiply: [
    {
      heading: 'What it is',
      body: `**Multiply** — a Multikunst conceptual fragrance campaign: industrial precision meets luxury product design, told as a short motion film with custom typography and ball-bearing-inspired packaging language.`,
      layout: 'full-media',
      media: [img('/projects/multiply/poster.png', 'Campaign key art', { frame: 'paper' })],
    },
    {
      heading: 'What it is for',
      body: `A motion-led product concept under Multikunst — communicate an idea quickly in a portfolio context: packaging, type, and product staging as one graphic system.`,
      layout: 'text-left',
    },
    {
      heading: 'How it was made',
      body: `Co-created under Multikunst: concept direction, 3D product staging, and cinematic trailer production. Process is campaign logic — key art that still works when the trailer is paused, type that carries the brand without a logo dump.`,
      layout: 'text-left',
    },
  ],

  'rovolto-lost-files': [
    {
      heading: 'What it is',
      body: `**Rovolto Lost Files** — an interactive 3D sculpture study about lost digital artifacts and recovered file structures: form-first modelling brought into a **WebGL** viewer.`,
      layout: 'text-left',
      media: [img('/projects/rovolto-lost-files/rovolto.webp', 'Sculpture')],
    },
    {
      heading: 'What it is for',
      body: `Sit between digital sculpture and product presentation — volume and silhouette that still read when the piece is orbitable in a browser, not only as a beauty still.`,
      layout: 'text-right',
      media: [img('/projects/rovolto-lost-files/rovolto1.webp', 'Alternate light')],
    },
    {
      heading: 'How it was made',
      body: `Sculpted in Blender, then presented through a Three.js / WebGL viewer. Look-dev stills lock the surface before the interactive pass so the live model matches the intended read.`,
      layout: 'text-left',
      media: [img('/projects/rovolto-lost-files/render-5.png', 'Render · 5')],
    },
    {
      heading: 'More frames',
      layout: 'gallery',
      media: [img('/projects/rovolto-lost-files/render-7.png', 'Render · 7')],
    },
  ],

  'ice-gel': [
    {
      heading: 'What it is',
      body: `A conceptual **cosmetic ice-gel** product visualisation — surreal 3D compositions that sit between product shot and abstract still life.`,
      layout: 'text-left',
      media: [img('/projects/ice-gel/final2.webp', 'Hero')],
    },
    {
      heading: 'What it is for',
      body: `Sell a cosmetics concept without a physical prototype: cool gel read, soft packaging language, and stills that carry material honesty for a deck or campaign mood.`,
      layout: 'text-right',
      media: [img('/projects/ice-gel/multikunst-freitag.webp', 'Packaging language')],
    },
    {
      heading: 'How it was made',
      body: `Blender look-dev focused on translucency, label language, and staging. Process: iterate materials until the gel reads cold and premium, then lock compositions that still work cropped for social or portfolio tiles.`,
      layout: 'text-left',
      media: [img('/projects/ice-gel/test-render-2-taj.webp', 'Material test')],
    },
    {
      heading: 'More stills',
      layout: 'gallery',
      media: [
        img('/projects/ice-gel/test-render-4-taj.webp', 'Material test · 2'),
        img('/projects/ice-gel/multikunst-freitag23w.webp', 'Variant'),
      ],
    },
  ],

  'sticker-box': [
    {
      heading: 'What it is',
      body: `**Sticker Box** — a small analog branding exercise: handcrafted stickers and print materials as a tactile counterweight to the digital portfolio.`,
      layout: 'full-media',
      media: [img('/projects/sticker-box/thumbnail.png', 'Sticker box', { frame: 'paper' })],
    },
    {
      heading: 'What it is for',
      body: `Show print craft and packaging as part of the practice — bold typographic treatments and expressive illustrations on natural kraft-style carriers.`,
      layout: 'text-left',
    },
    {
      heading: 'How it was made',
      body: `Designed as a collected sticker-box piece: print, cut, and photograph the set so the physical object remains the hero. Process is deliberately analog — the photo is the deliverable, not a 3D mock.`,
      layout: 'text-left',
    },
  ],

  'pocket-multipass': [
    {
      heading: 'What it is',
      body: `**Pocket Multipass** — a compact hardware concept at the intersection of retro gaming aesthetics and modern device design, told through product visualisation and short motion.`,
      layout: 'text-left',
      media: [img('/projects/pocket-multipass/front_top.webp', 'Front / top')],
    },
    {
      heading: 'What it is for',
      body: `A pitch-ready look for a pocket device concept (oxxupe / concept): silhouette, button affordances, and materials that read before anyone asks for a CAD dump.`,
      layout: 'text-right',
      media: [img('/projects/pocket-multipass/perspective.webp', 'Perspective')],
    },
    {
      heading: 'How it was made',
      body: `3D product visualisation with stills and a detail motion pass. Process: lock the form factor, then light for premium plastic / metal read, then a short motion beat for how the object feels in hand.`,
      layout: 'text-left',
      media: [img('/projects/pocket-multipass/front_top_2.webp', 'Front / top · 2')],
    },
    {
      heading: 'More frames',
      layout: 'gallery',
      media: [vid('/projects/pocket-multipass/detail.mp4', 'Detail motion')],
    },
  ],

  'the-house': [
    {
      heading: 'What it is',
      body: `**The House** — architectural visualisation of a contemporary residence, authored in **Archicad** and explored in **Unreal Engine**: cinematic light, materials, and indoor–outdoor living.`,
      layout: 'text-left',
      media: [img('/projects/the-house/architecture-enhanced-01.webp', 'Exterior / space')],
    },
    {
      heading: 'What it is for',
      body: `Show a home as something you can **move through**, not only admire as stills. Trained as an architect, I start with structure and massing — then carry that logic into a realtime presentation and browser walkthrough.`,
      layout: 'text-right',
      media: [img('/projects/the-house/architecture-enhanced-02.webp', 'Interior light')],
    },
    {
      heading: 'How it was made',
      body: `Archicad for spatial logic, Unreal for cinematic light and material studies, then an interactive browser build with the GLB so visitors can orbit and inspect. Process mirrors the education campus pipeline: keep the BIM source honest while the realtime pass sells atmosphere.`,
      layout: 'text-left',
      media: [img('/projects/the-house/architecture-enhanced-03.webp', 'Material study')],
    },
    {
      heading: 'More frames',
      layout: 'gallery',
      media: [img('/projects/the-house/architecture-enhanced-04.webp', 'Spatial beat')],
    },
  ],

  'mask-sculpture': [
    {
      heading: 'What it is',
      body: `An interactive **mask sculpture** — a characterful form authored in 3D and exposed through a lightweight browser viewer with rotation and optional wireframe read.`,
      layout: 'text-left',
      media: [img('/projects/mask-sculpture/look-mask-4.webp', 'Mask')],
    },
    {
      heading: 'What it is for',
      body: `Continue the interactive sculpture thread: explore organic geometry without a heavy DCC install — portfolio piece for form and surface craft.`,
      layout: 'text-right',
      media: [img('/projects/mask-sculpture/youtube-back-10.webp', 'Alternate view')],
    },
    {
      heading: 'How it was made',
      body: `Sculpted as a form study first, then packaged for a browser presentation. Process: lock silhouette and expression in stills, then enable orbit so the mathematical density of the mesh becomes part of the experience.`,
      layout: 'text-left',
    },
  ],
};

export function applyCaseStudyNarrative(project: Project): Project {
  const sections = CASE_STUDY_NARRATIVES[project.slug];
  if (!sections?.length) return project;
  return { ...project, caseSections: sections };
}
