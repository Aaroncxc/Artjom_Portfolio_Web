/**
 * One-off / idempotent patch: add media captions to posts.json (e-learning blueprints + gallery).
 * Run: node scripts/patch-posts-media-captions.js
 */
const fs = require('fs');
const path = require('path');

const POSTS = path.join(__dirname, '../public/posts.json');
const data = JSON.parse(fs.readFileSync(POSTS, 'utf8'));

const E_LEARNING_SLUG = 'elearning-africa-dakar-senegal-2023';

const blueprintCaptions = {
  'https://blueprintue.com/render/el7bkue9/':
    'Reusable grab component so visitors can pick up and release interactive booth objects in VR.',
  'https://blueprintue.com/render/3tvtt5ab/':
    'In-game grab logic that wires player input, physics, and feedback for the inverter training sequence.',
  'https://blueprintue.com/render/z40q5_un/':
    'Companion bot blueprint that guides visitors through setup steps and reacts to lesson progress.',
};

const videoCaption =
  'Showreel of the VR booth experience built for E-Learning Africa Dakar 2023 — inverter training in Unreal Engine.';

const galleryCaptions = {
  '/projects/elearning-africa-dakar-senegal-2023/vr-scene-00.webp':
    'Hero view of the VR training space with the inverter and companion bot in frame.',
  '/projects/elearning-africa-dakar-senegal-2023/vr-scene-01.webp':
    'Visitor perspective during an interaction with the training hardware.',
  '/projects/elearning-africa-dakar-senegal-2023/vr-scene-02.webp':
    'Close-up of the inverter unit used for the hands-on lesson steps.',
  '/projects/elearning-africa-dakar-senegal-2023/vr-scene-03.webp':
    'Environmental lighting and booth layout inside the Unreal scene.',
  '/projects/elearning-africa-dakar-senegal-2023/vr-scene-04.webp':
    'Instruction overlay guiding the user through the current training step.',
  '/projects/elearning-africa-dakar-senegal-2023/vr-scene-05.webp':
    'Wide-angle view of the full VR booth composition.',
  '/projects/elearning-africa-dakar-senegal-2023/vr-scene-06.webp':
    'Alternate camera angle highlighting depth and scale of the stand.',
  '/projects/elearning-africa-dakar-senegal-2023/vr-scene-07.webp':
    'Detail shot of props and signage inside the experience.',
  '/projects/elearning-africa-dakar-senegal-2023/vr-scene-08.webp':
    'Step-focused framing for one stage of the inverter workflow.',
  '/projects/elearning-africa-dakar-senegal-2023/vr-scene-09.webp':
    'Follow-up step view continuing the guided training sequence.',
  '/projects/elearning-africa-dakar-senegal-2023/vr-scene-10.webp':
    'Additional step view before the lesson completes.',
  '/projects/elearning-africa-dakar-senegal-2023/vr-scene-11.webp':
    'Final pose of the scene after the training flow finishes.',
  '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Visualisation_1.webp':
    'Archicad pre-visualization of the booth layout for client review.',
  '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Visualisation_2.webp':
    'Second visualization pass refining materials and visitor flow.',
  '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_DADBBOT_1.webp':
    'DADB-Bot character render — primary hero angle.',
  '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_DADBBOT_2.webp':
    'DADB-Bot render highlighting proportions and readable silhouette.',
  '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_DADBBOT_3.webp':
    'DADB-Bot detail render for marketing and on-site signage.',
  '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_DADBBOT_5.webp':
    'Additional DADB-Bot render used across pavilion graphics.',
  '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_1.jpg':
    'On-site photo of the finished booth at the German Pavilion.',
  '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_2.jpg':
    'Visitors trying the VR experience during the event.',
  '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_3.jpg':
    'Presentation moment with partners at the stand.',
  '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_5.jpg':
    'Hardware setup and headsets ready for demos.',
  '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_Proffesional_6.jpg':
    'German Pavilion context with the project integrated into the hall.',
  '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_8.jpg':
    'Impression from Dakar — atmosphere around the conference.',
  '/projects/elearning-africa-dakar-senegal-2023/Senegal_Dakar_13.jpg':
    'Second on-location impression from the event week.',
  '/projects/elearning-africa-dakar-senegal-2023/companion-bot-blueprint.webp':
    'Editor screenshot of the companion bot blueprint graph in Unreal.',
};

let patched = 0;

for (const post of data.posts) {
  if (post.slug !== E_LEARNING_SLUG) continue;

  if (post.videoUrl) {
    post.mediaCaptions = post.mediaCaptions || {};
    post.mediaCaptions[post.videoUrl] = videoCaption;
    patched++;
  }

  if (post.unrealBlueprints?.length) {
    for (const bp of post.unrealBlueprints) {
      const cap = blueprintCaptions[bp.url?.trim()];
      if (cap) {
        bp.caption = cap;
        patched++;
      }
    }
  }

  if (post.gallery?.length) {
    for (const item of post.gallery) {
      const cap = galleryCaptions[item.src?.trim()];
      if (cap) {
        item.caption = cap;
        patched++;
      }
    }
  }
}

fs.writeFileSync(POSTS, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`Patched ${patched} caption fields on ${E_LEARNING_SLUG}`);
