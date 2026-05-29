/** Short in-game role copy for Skyhaven handbook stills (keyed by models-3d basename). */

export const SKYHAVEN_ASSET_BLURBS: Record<string, string> = {
  'main-char':
    'Playable hero for focus sessions, profile preview, and walking the home island.',
  skully: 'Undead companion mascot — profile flair and light narrative beats.',
  rovolto: 'Utility robot NPC for quest hooks and island automation hints.',
  'magic-man': 'Mage NPC at shrine / rune POIs for magic progression interactions.',
  'mining-man': 'Miner guide on the mining island before combat encounters.',
  'enemy-robot':
    'Combat target on the mining slice — telegraphs, block/dodge, and loot feedback.',
  farmingChicken: 'Farming island landmark POI around till, plant, and harvest loops.',
  statueAaron: 'Decorative memorial statue for hub flair and Easter-egg discovery.',

  taverne: 'Social hub POI — ambience, quests, and future shop scaffolding.',
  magicTower: 'Shrine tower anchor for rune magic and progression beats.',
  mine: 'Mining island entrance that routes into the combat arena layout.',
  cottaTile: 'Cottage footprint tile for custom home-island build mode.',
  wellTile: 'Village well prop for decoration and path-side landmarks.',
  well2Tile: 'Alternate well variant for layout variety on home tiles.',
  kaserneTile: 'Barracks-style tile for military / training POI dressing.',
  ancientTempleTile: 'Ancient temple landmark for lore routes and shrine fantasy.',
  floatingForge: 'Floating forge POI for crafting and equipment fantasies.',
  poisFarming: 'Farming cluster tile — fields, barn, and agriculture POI grouping.',
  hangerTower: 'Airship tower structure for skyport skyline reads.',
  hangerDock: 'Primary dock piece for airship mooring and transit fantasy.',
  hangerDock2: 'Secondary dock module to extend skyport layouts.',
  hangerHanger: 'Hangar bay volume for airship storage and staging.',

  tree: 'Large canopy tree for biome framing and island shade.',
  treeMiddle: 'Mid-size tree filler between hero props and paths.',
  grass: 'Grass ground cover for plots, meadows, and edge blending.',
  dirt: 'Bare soil tile under paths, farms, and construction footprints.',
  bushTile: 'Understory bush along paths and village edges.',
  clouds: 'Atmospheric cloud layer above the floating island.',
  grasBlumen: 'Flower meadow accents for farming biome color.',
  halfGrownCropTile: 'Mid-growth crop state in the farming growth loop.',

  pathCross: 'Four-way walk-surface tile validated in Tile Lab routing.',
  pathStraight: 'Straight walk-surface segment for island path graphs.',
  farm2x2: '2×2 farm plot footprint for till, plant, grow, and harvest.',
  runeTile: 'Ground rune marker for magic POI interactions.',
  ancientStone: 'Ruin standing stone for ancient zone dressing.',
  ancientStoneWall: 'Straight ruin wall segment for enclosed zones.',
  ancientCornerWall: 'Corner ruin wall piece for closed compound shapes.',

  'prop-torch': 'Hand torch prop for equipment slots and placement decor.',
  'prop-axe': 'Axe tool prop for mining actions and combat animations.',
  'prop-shield': 'Shield prop supporting block and dodge combat feedback.',
  'prop-harke': 'Rake tool for the farming till step.',
  'prop-setzling': 'Seedling prop for the plant step in farming.',
  'prop-giesskanne': 'Watering can for grow and water beats on crops.',
  torchDecoration: 'Ambient torch decoration for tavern paths and night reads.',

  'airship-wing': 'Modular airship hull wing for sky-travel set dressing.',
  airShipPort: 'Skyport structure for docking and future transit UI.',
  airShipControl: 'Control cabin module for airship navigation hooks.',
};

export function skyhavenAssetBlurb(id: string): string {
  return (
    SKYHAVEN_ASSET_BLURBS[id] ??
    'In-world 3D asset generated from my art direction and integrated into the island sim.'
  );
}
