/**
 * One-off: apply **bold** keyword markers to posts.json descriptions & explanations.
 * Run: node scripts/apply-rich-text-keywords.mjs
 */
import fs from 'fs';
import path from 'path';

const POSTS_PATH = path.join(process.cwd(), 'public', 'posts.json');

const UPDATES = {
  'dadb-course-production-trailers': {
    description:
      'Final release trailers for **DADB** courses completed and shipped during my time as **Head of Production** at the **German Academy of Digital Education** — published on DADB’s own platform and offered as **elective modules** at partner universities in **Hyderabad**, **Bangalore**, and **Mumbai**.',
    explanation: `During my tenure as **Head of Production** at the **German Academy of Digital Education (DADB)**, I led the **end-to-end delivery** of multiple digital learning courses — from **production planning** and **cross-team coordination** through final **editorial sign-off** and **platform release**.

This project collects the final release trailers for courses we were able to complete and publish on **DADB’s own learning platform**. Beyond internal rollout, several of these courses were offered as **elective modules** at partner universities in **India** — including institutions in **Hyderabad**, **Bangalore**, and **Mumbai** — extending DADB’s **technical education portfolio** into international academic partnerships.

**My role:** Head of Production owning **pipeline status**, **stakeholder alignment**, **milestone tracking**, and handoff to **platform release**. I coordinated **editorial**, **3D**, **animation**, **post-production**, and **subject-matter review** so each course could move from script and asset production to a polished, learner-ready module with a **cinematic trailer** for marketing and onboarding.

The trailers shown here represent completed releases across topics including **5G communication technology**, **e-mobility**, **hydrogen technology**, **Internet of Things**, **solar electricity systems**, and **wind power** — reflecting the breadth of DADB’s **renewable-energy** and **digital-technology curriculum** during this production cycle.

**Tools & workflow:** **Blender** and **Unreal Engine** for 3D and cinematic content, **production management** across internal teams, and close collaboration with editorial and university partners for **India elective rollout**.

**Outcome:** six course trailers documenting **shipped modules** — each marking a course that moved from production through **QA** to live availability on DADB’s platform and, where applicable, elective enrollment at **Indian partner universities**.`,
  },
  'dadb-solar-technician-digital-campus': {
    description:
      'For the **German Academy of Digital Education**, an **immersive digital campus** for the **Solar Technician** program — lecture rooms, a social hub, training areas, and a **gamified solarpark** where learners explore **photovoltaics**, **installation**, **maintenance**, and **health & safety** in a walkable **3D world**.',
    explanation: `For the **German Academy of Digital Education**, this project is a **digital campus** for the **Solar Technician** program — developed together with **editorial**, **production**, the **3D/Unreal team**, and external partners including **SMA** and **Offenburg**.

**Goal:** introduce the Solar Technician profession through an **immersive learning experience**. Students arrive in a **virtual campus**, discover learning zones step by step, and engage with **photovoltaics**, **solarpark setup**, **installation**, **maintenance**, **health & safety**, and technical fundamentals — not only as course content but as a **spatial, interactive environment**.

**My role:** **project lead** coordinating editorial, production, 3D/Unreal, subject experts, and external partners. I owned **stakeholder communication**, **content alignment**, **progress tracking**, and **cross-team delivery**. I also co-conceived and co-designed the online campus — its structure, **hub concept**, **lecture rooms**, **training areas**, and the gamified **"manage your solarpark"** idea where learners move through the world and learn via **interactive tasks**.

**Implementation:** a **3D campus** with lecture rooms, a central hub, technical training zones, solarpark scenes, and interactive elements. Learners navigate the space, spend time on-site, and discover content in a realistic setting. A key module lets users **place solar panels**, understand components, respect **safety rules**, and learn what matters for day-to-day work as a Solar Technician.

**Tools:** **Unreal Engine**, **Blender**, **3D production**, **project management**, **learning experience design**, **stakeholder communication**.

**Outcome:** a completed **digital campus prototype** combining **virtual classrooms**, campus navigation, **technical training content**, and **gamified solarpark interaction** into one immersive learning world. Trailer and in-engine footage show students entering the campus, visiting learning stations, grasping **PV basics**, and experimenting with solarpark setup and operation.

Especially notable: the blend of **digital campus design**, **learning experience design**, **vocational training**, and **gamification** — a walkable learning world where technical topics become **spatial, interactive, and playful**, built across multiple internal teams and external partners.

**Timeline:** June 2026 — prototype completed.`,
  },
  'lexsolar-digital-learning-kit': {
    description:
      'Together with **Lexsolar**, we developed a **digital prototype** based on their **physical solar learning kits**. The real kits and components were recreated in **Blender** and transformed into an **interactive browser-based learning experience**.',
    explanation: `For the **German Academy of Digital Education**, we collaborated with **Lexsolar** to explore how **physical solar learning kits** could be translated into a **digital environment**. The original kits — **solar modules**, **measuring devices**, **cables**, **plugs**, and **experiment components** — were recreated inhouse as detailed **3D assets in Blender**.

**Goal:** digitally replicate Lexsolar's physical learning case and transfer its **experiment logic** into an **interactive application** so learners could use components virtually and understand core **solar-energy relationships** hands-on.

**My role** focused on **partner communication**, **strategic preparation**, and **project coordination**. I visited Lexsolar in **Dresden** several times to understand the product, production environment, and **didactic logic** behind the kits. Together with Lexsolar, internal departments, experts, and the production team we defined an **implementation strategy** and kept partner, production, and internal teams aligned through delivery.

The physical cases and components were rebuilt as faithfully as possible in **Blender** — modules, meters, cabling, power supplies, connectors, experiment boards, and related hardware. From these assets we built a fully playable **browser prototype** where users explore and try basic **solar experiments** in a virtual learning space.

**Outcome:** a completed **digital prototype** that makes the physical learning system's core experiments tangible online — bridging **haptic education hardware** and a **playable digital learning experience**.

**Timeline:** January–May 2026 — prototype completed.`,
  },
  'elearning-africa-dakar-senegal-2023': {
    description:
      'Trade-fair project for the **German Academy of Digital Education** at **E-Learning Africa 2023** in **Dakar**: an interactive **VR experience** in the **German Pavilion** that let visitors step into a **Solar / Inverter training scenario**. Pre-visualised the booth in **Archicad**, modelled scene assets in **Blender**, built and rendered the VR experience in **Unreal Engine**, then ran the stand on-site—onboarding visitors, presenting **DADB courses** and **XR demos**, and handling hardware in real time.',
    explanation: `For the **German Academy of Digital Education**, this was the **E-Learning Africa 2023** presence in **Dakar (German Pavilion)**: an interactive **Virtual-Reality experience** built around a **Solar / Inverter training scenario**, where visitors could step into the scene, interact with components, and follow a guided task in **1:1 scale**.

**Goal:** present **DADB’s digital learning portfolio**—courses, **LMS**, and **XR applications**—to an international audience from education, technology, business, and public institutions, and demonstrate how technical content can be taught through **immersive VR**.

**Role:** I was part of the **on-site stand team**—actively running the booth, presenting the **XR applications**, onboarding visitors, handling **VR hardware**, and making sure the experiences ran reliably throughout the show. In parallel I led the **pre-show production**: pre-visualising the stand in **Archicad**, modelling props and scene elements in **Blender**, and assembling the VR experience in **Unreal Engine** (**character setup**, **grab interactions**, scene lighting, capture renders).

**Visualization:** the booth, props and visitor flow were planned and rendered in **Archicad** and **Unreal** before travel; the VR scene itself—environment, signage, the **Solar / Inverter rig** and interactive components—was authored in **Unreal Engine** with custom **Blueprints** (Grab Component, VR Character) and supported by **Blender assets**.

**Outcome:** an **international booth delivery** in Dakar with a working **VR demo** at the DADB stand, plus a set of **pre-vis renders** used to plan layout, positioning, run-of-show, and technical needs ahead of the trip.

Especially notable: combining **technical responsibility**, **content production**, and **direct visitor communication** in one role—developing the VR experience, coordinating **booth logistics**, and then presenting and supporting it live for an international, non-technical audience.

**Timeline:** 2023 — completed.`,
  },
  'elearning-africa-kigali-2024': {
    description:
      'Trade-fair project for the **German Academy of Digital Education** at **E-Learning Africa 2024** in **Kigali**: an interactive **augmented-reality experience** that teaches **inverter installation** together with **SMA experts** and course teams. Led coordination across **editorial**, **production**, internal **SMEs**, and partners; pre-visualized the booth in **Archicad** and rendered planning shots in **Unreal Engine**—with **Blender** in the 3D pipeline—so layout, visitor routing, presentation zones, and the **AR area** were validated before Rwanda.',
    explanation: `For the **German Academy of Digital Education**, this was the **E-Learning Africa 2024** presence in **Kigali (German Pavilion)**: an interactive **augmented-reality learning experience** where visitors could follow how an **inverter is installed** and what matters in each technical step.

**Editorial**, **production**, internal experts, and external **SMA stakeholders** collaborated on an **AR training application** that tied technical course content, expert knowledge, and live **trade-fair storytelling** together.

**Goal:** translate hands-on **solar and energy-training** into **AR**—visitors should repeat steps actively and learn rules, cues, and components, while the booth demonstrated how **augmented learning**, **industrial partner content**, and **digital courses** reinforce each other.

**Role:** led and coordinated the initiative—alignment across editorial, production, **SMEs**, and **SMA**; **progress control**; stakeholder, management, and executive communication; ensuring content, engineering, **booth constraints**, and presentation goals stayed aligned.

**Visualization:** modeled the booth early in **Archicad** and rendered walkthroughs in **Unreal Engine**, with **Blender** supporting the broader **3D workflow**—testing build-up, routing, presentation surfaces, the **AR zone**, and hardware placement before the show.

**Outcome:** an **international booth delivery** with an interactive **AR inverter-installation experience** at the DADB stand, plus a **digital pre-vis package** used to align build, positioning, run-of-show, and technical needs ahead of travel.

Especially notable: the mix of **project leadership**, **cross-team coordination**, **technical production**, **instructional design**, and **partner communication** required to ship course logic, **SMA expertise**, and **AR technology** as one reliable expo experience.

**Timeline:** 2024 — completed.`,
  },
  'rekuperation-education': {
    description:
      'Animated learning video on **regenerative braking** for the **German Academy of Digital Education**, developed with the **editorial team** and **Tesla expert Harald Schlarb**. **Blender** assets and **Unreal Engine** scenes turn **recuperation** into clear **3D visuals**—vehicle setups, **energy flows**, braking, and **battery cues**—for students.',
    explanation: `For the **German Academy of Digital Education**, this project is an **animated learning film** about **recuperation in electromobility**. It was produced together with the **editorial team** and **Harald Schlarb (Tesla)** so students can grasp **regenerative braking** through animated **3D scenes**, vehicle depictions, **energy flows**, and clear overlays—not only as theory but as a **visual process**.

**Goal:** translate a complex **technical topic** into a modern, easy-to-follow **learning video**.

As **Head of 3D**, responsibilities included creating assets in **Blender**, building scenes in **Unreal Engine**, breaking the script into **visual sequences**, staging processes, shooting/rendering, and integrating expert material—including vehicle and **drivetrain** shots, **energy-flow visualization**, braking, **battery states**, and technical flows.

**Outcome:** an **educational video** for an **e-mobility course** that combines **editorial learning design**, **expert contribution**, and **3D/real-time visualization** into one coherent module. Especially notable is the mix of **subject-matter depth**, **didactic structure**, and high-quality **3D staging**—the visuals had to look strong while staying accurate and understandable for learners.

**Timeline:** November 2024 — completed.`,
  },
  'multi-watch': {
    description:
      '**Product visualization** and **motion study** for the **Multi Watch** — **materials**, **lighting**, and **industrial product storytelling**.',
  },
  'multiply': {
    description:
      '**Eau de Toilette** — A conceptual **fragrance campaign** blending **industrial aesthetics** with **luxury product design**. The **MULTIPLY** project explores **mechanical precision** meeting **sensorial experience**, featuring **custom typography** and **ball bearing inspired packaging**.',
  },
  'pult-vacuum': {
    description:
      "A futuristic **vacuum cleaner concept** blending **industrial design** with **space-age aesthetics**. **PULT** features a high-caliber **drum filter system**, **organic tech components**, and multiple **cleaning modes** — engineered not just for earthly messes, but with an **astronaut's precision** and innovation.",
  },
  'rovolto-lost-files': {
    description:
      'An **interactive 3D visualization** exploring **lost digital artifacts** and **recovered file structures**. Navigate through the intricate geometry and discover the beauty hidden within **corrupted data forms**.',
  },
  'ice-gel': {
    description:
      'A conceptual **cosmetic product design** featuring surreal **3D compositions**. The **Ice Gel** series explores the boundaries between **product visualization** and **abstract art**, combining **organic blob forms** with precise **industrial design** and **dramatic lighting**. Created with **Blender** in March 2026.',
  },
  'the-house': {
    description:
      '**Architectural visualization** of a contemporary residence—modeled in **Archicad** and rendered in **Unreal Engine**. A **cinematic study** of **light**, **materials**, and **indoor–outdoor living**: the trailer explores atmosphere and movement; still frames highlight **form** and **landscape**.',
  },
  'mask-sculpture': {
    description:
      'An **interactive 3D visualization** of a **sculptural mask form**. Explore the intricate geometry through rotation and **wireframe overlay**, revealing the **mathematical beauty** hidden within **organic shapes**.',
  },
};

const MEDIA_CAPTION_UPDATES = {
  'dadb-course-production-trailers': {
    '/projects/dadb-course-production-trailers/5g-communication-technology.webm':
      'Final release trailer for the **5G Communication Technology** course — produced for **DADB’s digital learning platform** and **partner universities in India**.',
  },
  'dadb-solar-technician-digital-campus': {
    '/projects/dadb-solar-technician-digital-campus/demo-trailer.webm':
      'Trailer showing the **Solar Technician digital campus** — **lecture rooms**, **hub**, **training areas**, and **gamified solarpark interactions**.',
  },
  'lexsolar-digital-learning-kit': {
    '/projects/lexsolar-digital-learning-kit/whole-exercise-gameplay.webm':
      'Full **gameplay capture** of the **browser prototype** — virtual **solar experiments** built from **1:1 Blender recreations** of the physical **Lexsolar kit**.',
    '/projects/lexsolar-digital-learning-kit/expert-exercise-explanation.webm':
      '**Expert walkthrough** for **Exercise 9** — reference material from a specialist used to mirror the real **learning procedure** in the **Lexsolar prototype**.',
  },
  'elearning-africa-dakar-senegal-2023': {
    '/projects/elearning-africa-dakar-senegal-2023/linkedin-vr-trailer.webm':
      'Showreel of the **VR booth experience** built for **E-Learning Africa Dakar 2023** — **inverter training** in **Unreal Engine**.',
  },
};

const raw = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
const posts = Array.isArray(raw) ? raw : raw.posts;
let count = 0;

for (const post of posts) {
  const patch = UPDATES[post.slug];
  if (patch) {
    if (patch.description) post.description = patch.description;
    if (patch.explanation) post.explanation = patch.explanation;
    count++;
  }
  const captions = MEDIA_CAPTION_UPDATES[post.slug];
  if (captions) {
    post.mediaCaptions = { ...(post.mediaCaptions ?? {}), ...captions };
  }
}

const out = Array.isArray(raw) ? posts : { ...raw, posts };
fs.writeFileSync(POSTS_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(`Updated ${count} posts in posts.json`);
