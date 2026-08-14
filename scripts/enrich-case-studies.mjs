/**
 * Enrich posts.json with case-study metadata + editorial sections.
 * Run: node scripts/enrich-case-studies.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsPath = path.join(__dirname, '..', 'public', 'posts.json');

const data = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

const P = (slug, ...parts) =>
  parts.map((file) => `/projects/${slug}/${file}`);

/** @type {Record<string, object>} */
const enrichments = {
  'elearning-africa-dakar-senegal-2023': {
    order: 1,
    role: 'Mixed Reality Lead',
    client: 'DADB · E-Learning Africa 2023',
    timeframe: 'Jan–May 2023',
    team: 'Cross-discipline booth team (3D, Unreal, design, production)',
    outcomes: [
      'Shipped an interactive VR training booth for the German Pavilion in Dakar',
      'Guided visitors through a 1:1 solar / inverter scenario with live interaction',
      'Aligned architecture (Archicad), assets (Blender), and Unreal delivery under a trade-fair deadline',
    ],
    caseSections: [
      {
        heading: 'Brief & goal',
        body: 'For the **German Academy of Digital Education**, this was the **E-Learning Africa 2023** presence in **Dakar (German Pavilion)**: an interactive **Virtual-Reality experience** built around a **Solar / Inverter training scenario**, where visitors could step into the scene, interact with components, and follow a guided task in **1:1 scale**.\n\n**Goal:** present **DADB’s digital learning portfolio**—clearly, immersively, and under the pressure of a live trade-fair schedule.',
        layout: 'text-left',
      },
      {
        heading: 'VR training space',
        body: 'The experience put visitors inside a training environment with inverter hardware and a companion bot—scaled for headset use, not just a walkthrough video.',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-00.webp', title: 'VR scene — hero', caption: 'Hero view of the VR training space with the inverter and companion bot in frame.' },
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-01.webp', title: 'Interaction view', caption: 'Visitor perspective during an interaction with the training hardware.' },
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-07.webp', title: 'Scene overview', caption: 'Broader look at the authored VR environment.' },
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/vr-scene-10.webp', title: 'Detail pass', caption: 'Material and lighting detail for headset readability.' },
        ],
      },
      {
        heading: 'Booth & pavilion',
        body: 'Beyond the headset: spatial design and visualisation for how the booth sat inside the German Pavilion—so the story worked for people waiting in line as well as for those in VR.',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Visualisation_1.webp', title: 'Booth visualisation 1' },
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Visualisation_2.webp', title: 'Booth visualisation 2' },
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_8.jpg', title: 'Fair floor' },
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_13.jpg', title: 'Pavilion context' },
        ],
      },
      {
        heading: 'On the ground in Dakar',
        body: 'Professional documentation from the fair: stakeholders, demos, and the live booth under real visitor load.',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_1.jpg', title: 'Fair documentation 1' },
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_2.jpg', title: 'Fair documentation 2' },
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_3.jpg', title: 'Fair documentation 3' },
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_5.jpg', title: 'Fair documentation 4' },
        ],
      },
      {
        heading: 'Companion bot & blueprints',
        body: 'Interaction logic and companion-bot behaviour were authored in Unreal; blueprint embeds below show how guidance and tasks were structured for first-time VR users.',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_DADBBOT_1.webp', title: 'Companion bot 1' },
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_DADBBOT_2.webp', title: 'Companion bot 2' },
          { kind: 'image', src: '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_DADBBOT_3.webp', title: 'Companion bot 3' },
        ],
      },
    ],
  },

  'elearning-africa-kigali-2024': {
    order: 2,
    role: 'Head of Production',
    client: 'DADB · E-Learning Africa 2024',
    timeframe: '2024',
    team: 'Production + 3D + Unreal delivery team',
    outcomes: [
      'Delivered an AR inverter-installation experience for the Kigali fair booth',
      'Coordinated architecture, asset, and realtime pipelines into one visitor-facing demo',
      'Documented live demos at the Kigali Convention Center under fair conditions',
    ],
    caseSections: [
      {
        heading: 'Brief & goal',
        body: 'At **E-Learning Africa 2024 in Kigali**, DADB needed a booth experience that showed **hands-on AR learning**—not a slide deck. The focus was an **AR inverter installation** flow: place components, follow guidance, and understand the training logic in physical space.\n\nI led production so architecture, Blender assets, and Unreal delivery stayed aligned through the fair deadline.',
        layout: 'text-left',
      },
      {
        heading: 'AR demo in motion',
        layout: 'full-media',
        media: [
          { kind: 'video', src: '/projects/elearning-africa-kigali-2024/future-forward-ar.mp4', title: 'AR demo reel', caption: 'AR inverter installation flow captured for the Kigali booth narrative.' },
        ],
      },
      {
        heading: 'Booth & convention floor',
        body: 'Spatial setup at the Kigali Convention Center—how visitors approached the stand and where the AR demo lived in the booth.',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_ConventionCenter.jpg', title: 'Convention Center' },
          { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_Messestand_3.jpg', title: 'Booth 1' },
          { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_Messestand_2.webp', title: 'Booth 2' },
        ],
      },
      {
        heading: 'AR interaction stills',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_AR_2.webp', title: 'AR still — cables & inverter overlay', caption: 'Visitor places virtual cables while the AR inverter overlay floats above the work surface.' },
          { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_AR_5.webp', title: 'AR still — guided steps', caption: 'Guided installation steps during the booth demo.' },
          { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_AR_7.png', title: 'AR still — wide view', caption: 'Wider view of the AR training interaction on the fair floor.' },
        ],
      },
      {
        heading: 'On site',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_Proffesional_1.jpg', title: 'On-site 1' },
          { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_Proffesional_2.jpg', title: 'On-site 2' },
          { kind: 'image', src: '/projects/elearning-africa-kigali-2024/Kigali_Proffesional_3.jpg', title: 'On-site 3' },
        ],
      },
    ],
  },

  'lexsolar-digital-learning-kit': {
    order: 3,
    role: 'Head of Production / 3D Lead',
    client: 'DADB × Lexsolar',
    timeframe: '2024–2025',
    team: 'Partnership production with Lexsolar + internal 3D / Unreal',
    outcomes: [
      'Recreated Lexsolar’s physical solar kits as interactive 3D learning assets',
      'Shipped a browser prototype for virtual solar experiments',
      'Connected physical kit fidelity with digital exercise UX',
    ],
    caseSections: [
      {
        heading: 'Brief & goal',
        body: 'Together with **Lexsolar**, we explored how **physical solar learning kits** could live as a **digital environment**. Real modules, meters, cables, and experiment parts were rebuilt in **Blender** and turned into an interactive prototype learners can run without the hardware on the desk.\n\n**Goal:** keep kit fidelity high enough that instructors recognise the real Lexsolar system—while making the exercise loop clear in a browser.',
        layout: 'text-left',
      },
      {
        heading: 'Full exercise capture',
        layout: 'full-media',
        media: [
          { kind: 'video', src: '/projects/lexsolar-digital-learning-kit/whole-exercise-gameplay.webm', title: 'Gameplay', caption: 'Full gameplay capture of the browser prototype — virtual solar experiments from 1:1 Blender recreations of the physical kit.' },
        ],
      },
      {
        heading: 'In-game prototype',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/lexsolar-digital-learning-kit/ingame-01.webp', title: 'In-game 1' },
          { kind: 'image', src: '/projects/lexsolar-digital-learning-kit/ingame-02.webp', title: 'In-game 2' },
          { kind: 'image', src: '/projects/lexsolar-digital-learning-kit/ingame-03.webp', title: 'In-game 3' },
          { kind: 'image', src: '/projects/lexsolar-digital-learning-kit/ingame-04.webp', title: 'In-game 4' },
          { kind: 'image', src: '/projects/lexsolar-digital-learning-kit/ingame-05.webp', title: 'In-game 5' },
          { kind: 'image', src: '/projects/lexsolar-digital-learning-kit/ingame-06.webp', title: 'In-game 6' },
        ],
      },
      {
        heading: 'Case & UI',
        layout: 'gallery',
        media: [
          { kind: 'video', src: '/projects/lexsolar-digital-learning-kit/case-footage.webm', title: 'Case footage' },
          { kind: 'video', src: '/projects/lexsolar-digital-learning-kit/ui-examples.webm', title: 'UI examples' },
          { kind: 'video', src: '/projects/lexsolar-digital-learning-kit/expert-exercise-explanation.webm', title: 'Exercise explanation' },
        ],
      },
    ],
  },

  'dadb-course-production-trailers': {
    order: 4,
    role: 'Head of Production',
    client: 'German Academy of Digital Education (DADB)',
    timeframe: '2024–2025',
    team: 'Multi-course production (3D, editorial, partners in India)',
    outcomes: [
      'Led end-to-end delivery of multiple digital learning courses to platform release',
      'Published final course trailers for 5G, e-mobility, hydrogen, IoT, solar, and wind',
      'Kept parallel course productions sequenced so release dates stayed credible',
    ],
    caseSections: [
      {
        heading: 'Brief & goal',
        body: 'As **Head of Production** at **DADB**, I owned **end-to-end delivery** of digital learning courses—from production planning and cross-team coordination through editorial sign-off and **platform release**.\n\nThis case collects the **final release trailers** for courses we completed and published on DADB’s platform and for partner universities.',
        layout: 'text-left',
      },
      {
        heading: 'Released course trailers',
        body: 'Each trailer is a release artifact: the public face of a finished course after production, review, and platform handoff.',
        layout: 'gallery',
        media: [
          { kind: 'video', src: '/projects/dadb-course-production-trailers/5g-communication-technology.webm', title: '5G Communication Technology', caption: 'Final release trailer — 5G Communication Technology.' },
          { kind: 'video', src: '/projects/dadb-course-production-trailers/e-mobility.webm', title: 'E-Mobility', caption: 'Final release trailer — E-Mobility.' },
          { kind: 'video', src: '/projects/dadb-course-production-trailers/hydrogen-technology.webm', title: 'Hydrogen Technology', caption: 'Final release trailer — Hydrogen Technology.' },
          { kind: 'video', src: '/projects/dadb-course-production-trailers/internet-of-things.webm', title: 'Internet of Things', caption: 'Final release trailer — IoT.' },
          { kind: 'video', src: '/projects/dadb-course-production-trailers/solar-electricity-systems.webm', title: 'Solar Electricity Systems', caption: 'Final release trailer — Solar Electricity Systems.' },
          { kind: 'video', src: '/projects/dadb-course-production-trailers/wind-power.webm', title: 'Wind Power', caption: 'Final release trailer — Wind Power.' },
        ],
      },
      {
        heading: 'Key frames',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/dadb-course-production-trailers/5g-communication-technology.webp', title: '5G key frame' },
          { kind: 'image', src: '/projects/dadb-course-production-trailers/e-mobility.webp', title: 'E-Mobility key frame' },
          { kind: 'image', src: '/projects/dadb-course-production-trailers/hydrogen-technology.webp', title: 'Hydrogen key frame' },
          { kind: 'image', src: '/projects/dadb-course-production-trailers/internet-of-things.webp', title: 'IoT key frame' },
          { kind: 'image', src: '/projects/dadb-course-production-trailers/solar-electricity-systems.webp', title: 'Solar key frame' },
          { kind: 'image', src: '/projects/dadb-course-production-trailers/wind-power.webp', title: 'Wind key frame' },
        ],
      },
    ],
  },

  'dadb-solar-technician-digital-campus': {
    order: 5,
    role: 'Head of Production / Architecture–Realtime Lead',
    client: 'DADB',
    timeframe: '2024–2025',
    team: 'Architecture (Archicad) + Unreal + Blender production',
    outcomes: [
      'Built an interactive digital campus for solar-technician training scenarios',
      'Kept Archicad ↔ Unreal geometry and materials in sync for stakeholder walkthroughs',
      'Delivered hub-table and solar-park management demos for learning flows',
    ],
    caseSections: [
      {
        heading: 'Brief & goal',
        body: 'The **Solar Technician Digital Campus** turns a training site into an interactive environment: solar park management, hub-table workflows, and architecture authored in **Archicad** then carried into **Unreal Engine** for live exploration.\n\n**Goal:** let stakeholders and learners walk the space—not only watch a render.',
        layout: 'text-left',
        media: [
          { kind: 'image', src: '/projects/dadb-solar-technician-digital-campus/campus-hero.webp', title: 'Campus hero' },
        ],
      },
      {
        heading: 'Solar park management',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/dadb-solar-technician-digital-campus/solarpark-manage-01.webp', title: 'Solar park 1' },
          { kind: 'image', src: '/projects/dadb-solar-technician-digital-campus/solarpark-manage-02.webp', title: 'Solar park 2' },
          { kind: 'video', src: '/projects/dadb-solar-technician-digital-campus/solarpark-demo.webm', title: 'Solar park demo' },
        ],
      },
      {
        heading: 'Hub table & editor',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/dadb-solar-technician-digital-campus/hub-table-01.webp', title: 'Hub table 1' },
          { kind: 'image', src: '/projects/dadb-solar-technician-digital-campus/hub-table-02.webp', title: 'Hub table 2' },
          { kind: 'image', src: '/projects/dadb-solar-technician-digital-campus/hub-table-03.webp', title: 'Hub table 3' },
          { kind: 'video', src: '/projects/dadb-solar-technician-digital-campus/hub-table-editor.webm', title: 'Hub table editor' },
        ],
      },
      {
        heading: 'Archicad source',
        body: 'Architecture stayed editable in Archicad while Unreal carried the interactive pass—so design changes could still land late without restarting the whole realtime build.',
        layout: 'gallery',
        media: [
          { kind: 'video', src: '/projects/dadb-solar-technician-digital-campus/archicad-footage-01.webm', title: 'Archicad footage 1' },
          { kind: 'video', src: '/projects/dadb-solar-technician-digital-campus/archicad-footage-02.webm', title: 'Archicad footage 2' },
        ],
      },
    ],
  },

  'rekuperation-education': {
    order: 6,
    role: 'Head of Production / 3D & Motion',
    client: 'DADB · E-Mobility education',
    timeframe: '2024',
    team: '3D + editorial with subject-matter partners',
    outcomes: [
      'Produced an e-mobility education piece on recuperation for digital learning',
      'Combined explanatory animation with expert interview framing',
      'Delivered assets ready for course packaging and platform use',
    ],
    caseSections: [
      {
        heading: 'Brief & goal',
        body: '**Rekuperation** explains energy recovery in e-mobility for learners who need clarity—not marketing gloss. The piece mixes **3D animation** with expert context so the concept sticks in a course setting.',
        layout: 'text-left',
      },
      {
        heading: 'Education visuals',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/rekuperation-education/rekuperation-edu-video.webp', title: 'Visual 1' },
          { kind: 'image', src: '/projects/rekuperation-education/rekuperation-edu-video-1.webp', title: 'Visual 2' },
          { kind: 'image', src: '/projects/rekuperation-education/rekuperation-edu-video-2.webp', title: 'Visual 3' },
          { kind: 'image', src: '/projects/rekuperation-education/rekuperation-edu-video-3.webp', title: 'Visual 4' },
          { kind: 'image', src: '/projects/rekuperation-education/rekuperation-edu-video-5.webp', title: 'Visual 5' },
          { kind: 'image', src: '/projects/rekuperation-education/rekuperation-edu-video-43.webp', title: 'Visual 6' },
        ],
      },
      {
        heading: 'Production & expert framing',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/rekuperation-education/artjom-schlarp-1.jpg', title: 'Production still 1' },
          { kind: 'image', src: '/projects/rekuperation-education/artjom-schlarp-2.jpg', title: 'Production still 2' },
          { kind: 'image', src: '/projects/rekuperation-education/harald-schlarp-interview.png', title: 'Expert interview frame' },
        ],
      },
    ],
  },

  'pult-vacuum': {
    order: 7,
    role: 'Concept & 3D Product Design',
    client: 'Personal / Multikunst',
    timeframe: '2026',
    team: 'Solo',
    outcomes: [
      'Designed a futuristic vacuum concept with industrial + space-age language',
      'Built a browser presentation with interactive 3D model',
      'Produced cinematic product turns and presentation stills in Blender',
    ],
    explanation:
      '**PULT** is a vacuum cleaner concept that treats domestic hardware like industrial product design: a high-caliber drum filter system, organic tech components, and a silhouette that reads as both appliance and prop.\n\nI owned concept, modelling, materials, and the browser presentation—so recruiters can orbit the asset live instead of only watching a turntable.',
    caseSections: [
      {
        heading: 'Concept',
        body: '**PULT — Keep Cleaning** blends **industrial design** with **space-age aesthetics**. The brief I set for myself: make a vacuum that feels engineered, not cartoonish—readable from a distance, detailed up close.',
        layout: 'text-left',
      },
      {
        heading: 'Hero film',
        layout: 'full-media',
        media: [
          { kind: 'video', src: '/projects/pult-vacuum/pult-final.mp4', title: 'PULT hero', caption: 'Cinematic product film of the PULT vacuum concept.' },
        ],
      },
      {
        heading: 'Form studies',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/pult-vacuum/pult-praesentation.webp', title: 'Presentation' },
          { kind: 'image', src: '/projects/pult-vacuum/pult-90grad.webp', title: 'Orthographic 1' },
          { kind: 'image', src: '/projects/pult-vacuum/pult-90grad-2.webp', title: 'Orthographic 2' },
          { kind: 'image', src: '/projects/pult-vacuum/pult-90grad-3.webp', title: 'Orthographic 3' },
          { kind: 'image', src: '/projects/pult-vacuum/pult-90grad-4.webp', title: 'Orthographic 4' },
        ],
      },
      {
        heading: 'Try it live',
        body: 'Interactive browser build with the GLB model—orbit, inspect, and present without a heavyweight DCC install.',
        layout: 'live-embed',
        media: [
          { kind: 'html', src: '/projects/pult-vacuum/index.html', title: 'Live presentation', caption: 'Browser presentation of PULT.' },
        ],
      },
    ],
  },

  'the-house': {
    order: 8,
    role: 'Architect & Realtime Visualisation',
    client: 'Personal architecture study',
    timeframe: '2025',
    team: 'Solo',
    outcomes: [
      'Modeled a contemporary residence in Archicad with full spatial logic',
      'Brought the project into Unreal for cinematic light and material studies',
      'Published an interactive browser walkthrough of the house',
    ],
    explanation:
      '**The House** is an architectural visualisation of a contemporary residence—authored in **Archicad** and rendered / explored in **Unreal Engine**. It is a study of **light**, **materials**, and **indoor–outdoor living**: how a home reads when you can move through it, not only look at stills.\n\nThe browser build lets visitors orbit and inspect the model as a living presentation piece.',
    caseSections: [
      {
        heading: 'Brief & goal',
        body: 'Trained as an architect, I still start in **Archicad**: structure, massing, material logic. **The House** carries that model into a cinematic and interactive pass—so the design is judged as space, not as a poster.',
        layout: 'text-left',
      },
      {
        heading: 'Cinematic pass',
        layout: 'full-media',
        media: [
          { kind: 'video', src: '/projects/the-house/Thehouse%20Multi%20Portfolio(1).webm', title: 'House cinematic', caption: 'Cinematic visualisation of the residence.' },
        ],
      },
      {
        heading: 'Spaces',
        layout: 'gallery',
        media: [
          { kind: 'image', src: '/projects/the-house/architecture-enhanced-01.webp', title: 'Exterior & entrance' },
          { kind: 'image', src: '/projects/the-house/architecture-enhanced-02.webp', title: 'Pool & terrace' },
          { kind: 'image', src: '/projects/the-house/architecture-enhanced-03.webp', title: 'Interior study' },
          { kind: 'image', src: '/projects/the-house/architecture-enhanced-04.webp', title: 'Material & light' },
        ],
      },
      {
        heading: 'Interactive model',
        layout: 'live-embed',
        media: [
          { kind: 'html', src: '/projects/the-house/index.html', title: 'Live house', caption: 'Browser walkthrough / orbit of The House.' },
        ],
      },
    ],
  },

  // Compact projects
  'rovolto-lost-files': {
    order: 9,
    role: '3D Sculpture & WebGL',
    client: 'Personal',
    timeframe: '2025',
    team: 'Solo',
    outcomes: [
      'Sculpted and presented an interactive WebGL sculpture piece',
      'Shipped a browser viewer with orbitable 3D asset',
    ],
    explanation:
      '**Rovolto Lost Files** is an interactive sculpture study: form-first modelling brought into a **WebGL** viewer so the piece can be inspected live. The work sits between digital sculpture and product presentation.',
  },
  'mask-sculpture': {
    order: 10,
    role: '3D Sculpture & WebGL',
    client: 'Personal',
    timeframe: '2026',
    team: 'Solo',
    outcomes: [
      'Created a mask sculpture with interactive browser presentation',
    ],
    explanation:
      '**Mask Sculpture** continues the interactive sculpture thread: a characterful mask form authored in 3D and exposed through a lightweight browser viewer.',
  },
  'ice-gel': {
    order: 11,
    role: '3D Product Visualisation',
    client: 'Concept',
    timeframe: '2026',
    team: 'Solo',
    outcomes: [
      'Designed and rendered a cosmetic ice-gel product concept in Blender',
    ],
    explanation:
      'A **cosmetics product concept** focused on material read—cool gel, soft packaging language, and stills that sell the object without a physical prototype.',
  },
  'pocket-multipass': {
    order: 12,
    role: '3D Product Concept',
    client: 'oxxupe / concept',
    timeframe: '2026',
    team: 'Collaboration',
    outcomes: [
      'Visualised a pocket multipass hardware concept in 3D motion',
    ],
    explanation:
      '**Pocket Multipass** is a compact hardware concept told through product visualisation—silhouette, interaction affordances, and short motion for a pitch-ready look.',
  },
  'multiconcert': {
    order: 13,
    role: '3D Event Visualisation',
    client: 'Multikunst',
    timeframe: '2025',
    team: 'Multikunst collective',
    outcomes: [
      'Visualised a concert / event spatial concept in 3D',
    ],
    explanation:
      '**MultiConcert** explores event-space storytelling under the Multikunst collective—stage volume, audience read, and atmospheric lighting studies.',
  },
  'multiply': {
    order: 14,
    role: 'Motion / Product Film',
    client: 'Multikunst',
    timeframe: '2026',
    team: 'Multikunst collective',
    outcomes: [
      'Produced a motion-led product concept film',
    ],
    explanation:
      '**Multiply** is a motion-led product concept under Multikunst—short, graphic, and built to communicate an idea quickly in a portfolio context.',
  },
  'multi-watch': {
    order: 15,
    role: '3D Product Design',
    client: 'Multikunst',
    timeframe: '2026',
    team: 'Multikunst collective',
    outcomes: [
      'Designed and filmed a watch product concept in 3D',
    ],
    explanation:
      '**Multi Watch** is a product-design study: proportions, materials, and a short film pass that presents the watch as a wearable object.',
  },
  'jan-helm': {
    order: 16,
    role: '3D Design',
    client: 'JanMitGun / collaboration',
    timeframe: '2026',
    team: 'Collaboration',
    outcomes: [
      'Produced a helmet design visualisation in 3D',
    ],
    explanation:
      '**Jan Helm** is a helmet design visualisation—form language and material studies for a collaborative character / product piece.',
  },
  'tshirt-jan': {
    order: 17,
    role: 'Photography & Design',
    client: 'JanMitGun / collaboration',
    timeframe: '2026',
    team: 'Collaboration',
    outcomes: [
      'Shot and art-directed a T-shirt design presentation',
    ],
    explanation:
      '**T-Shirt Jan** is a fashion / merch presentation: photography and layout focused on how the graphic sits on the garment.',
  },
  'sticker-box': {
    order: 18,
    role: 'Print & Branding',
    client: 'Personal',
    timeframe: '2026',
    team: 'Solo',
    outcomes: [
      'Designed an analog sticker-box branding piece',
    ],
    explanation:
      '**Sticker Box** is a small analog branding exercise—print, stickers, and packaging as a tactile counterweight to the digital portfolio.',
  },
};

let updated = 0;
for (const post of data.posts) {
  const e = enrichments[post.slug];
  if (!e) continue;
  Object.assign(post, e);
  updated += 1;
}

data.lastUpdated = new Date().toISOString().slice(0, 10);
fs.writeFileSync(postsPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Enriched ${updated} / ${data.posts.length} projects → ${postsPath}`);
