/**
 * The free backgrounds on /youtube-thumbnail-backgrounds. Single source of truth:
 * the gallery, the download links, the JSON-LD and the noindex rule all read this file.
 *
 * Adding the images:
 * 1. Generate each image from its `prompt` (the prompt goes to the image generator as is).
 * 2. Export it as 1280 × 720 WebP and save it as public/thumbnail-backgrounds/<file>.
 * 3. Set `placeholder: false` on that entry.
 *
 * The page stays out of Google (noindex) until EVERY entry has `placeholder: false` AND its
 * file exists in public/thumbnail-backgrounds/. See availability.ts.
 */

/** Shown on the page, in the FAQ and in the image licence data. The owner can change it here only. */
export const USAGE_TERMS =
  'Free to use in your YouTube thumbnails, including on monetised channels. Do not resell or redistribute them as a background pack.';

/** Public folder of the image files (public/thumbnail-backgrounds/). */
export const BACKGROUNDS_DIR = '/thumbnail-backgrounds';

/** Size every file is exported at. */
export const BACKGROUND_WIDTH = 1280;
export const BACKGROUND_HEIGHT = 720;

export type BackgroundGroupId = 'gaming' | 'dark' | 'bright' | 'studio' | 'sport' | 'gradient';

export interface BackgroundGroup {
  id: BackgroundGroupId;
  title: string;
  /** One or two sentences under the group heading. */
  intro: string;
}

export interface ThumbnailBackground {
  id: string;
  /** "<group>-<name>.webp", 1280 × 720, in public/thumbnail-backgrounds/ */
  file: string;
  title: string;
  alt: string;
  group: BackgroundGroupId;
  /** The side left calm for a face, a person or an object and the title. */
  space: 'left' | 'right';
  /** Sent as is to the image generator. */
  prompt: string;
  /** true until the real image has been generated and saved. */
  placeholder: boolean;
}

export const GROUPS: BackgroundGroup[] = [
  {
    id: 'gaming',
    title: 'Gaming worlds',
    intro:
      'Game-like scenery without any game art. The blocky landscape suits Minecraft videos, the cartoon island suits Fortnite and other battle royale videos.',
  },
  {
    id: 'dark',
    title: 'Dark and dramatic',
    intro: 'For stories, warnings, reveals and anything with tension. Bright text and a well-lit face stand out on them.',
  },
  {
    id: 'bright',
    title: 'Bright and fun',
    intro: 'For challenges, reactions, kids and family content. Use dark text or a thick outline on these.',
  },
  {
    id: 'studio',
    title: 'Studio and podcast',
    intro: 'Calm rooms for talking-head videos, interviews, podcasts and tutorials. Your face does the work; the room stays quiet.',
  },
  {
    id: 'sport',
    title: 'Sport',
    intro: 'Courts, pitches, lights and a track, with no team colours or logos. For highlights, training and reaction videos.',
  },
  {
    id: 'gradient',
    title: 'Abstract gradients',
    intro: 'Abstract colour and simple shapes that work for any topic. The easiest backgrounds to read text on.',
  },
];

export const BACKGROUNDS: ThumbnailBackground[] = [
  // ── Gaming worlds ───────────────────────────────────────────
  {
    id: 'gaming-voxel-landscape',
    file: 'gaming-voxel-landscape.webp',
    title: 'Blocky voxel landscape',
    alt: 'Blocky landscape made of cubes: green cube hills, square trees and a waterfall on the right, open blue sky and flat grass on the left.',
    group: 'gaming',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no characters, no user interface. A bright daytime landscape built entirely from cubes, in a blocky voxel style: grass-topped cube hills, square trees with cube leaves, a blocky waterfall pouring into a pool of square water blocks, and blocky mountains in the far distance. Colours: saturated grass green, sky blue, warm brown earth, white blocky clouds. Late-morning sunlight from the right with soft shadows; slight haze and depth of field so the distant mountains are softer. Keep all the detail (trees, waterfall, hills) in the right two thirds. Leave the left third calm: open sky above a flat, plain grass plain, no objects, room for a person and a title. Keep the bottom-right corner calm: flat grass slightly out of focus.',
  },
  {
    id: 'gaming-battle-island',
    file: 'gaming-battle-island.webp',
    title: 'Cartoon battle-royale island',
    alt: 'Cartoon tropical island seen from above with small houses and hills, a purple storm ring on the horizon, open turquoise sea and sky on the right.',
    group: 'gaming',
    space: 'right',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no characters, no weapons, no user interface. A bright, stylised cartoon island seen from a high angle, in a playful 3D animated look: green hills, a few small colourful houses, a winding dirt road, palm trees and a sandy beach, surrounded by turquoise sea. On the far horizon, a glowing purple storm wall curves around the island. Colours: saturated greens, turquoise, warm sand, purple storm glow, soft blue sky. Golden afternoon light from the left, gentle atmospheric haze for depth. Keep the island and its detail in the left two thirds. Leave the right third calm: open sea and clear sky with a soft gradient, nothing else, room for a person and a title. Keep the bottom-right corner calm: flat open water.',
  },
  {
    id: 'gaming-neon-arena',
    file: 'gaming-neon-arena.webp',
    title: 'Neon arena',
    alt: 'Low view along a dark arena floor, magenta and cyan neon strips converging to a glowing point on the right, a dark reflective floor on the left.',
    group: 'gaming',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no screens with writing. A dark futuristic gaming arena seen from just above a glossy black floor with a faint glowing grid: magenta and cyan neon light strips run along the walls and ceiling and converge towards a bright vanishing point on the right, a few light beams cutting through thin haze. Colours: deep navy and black, hot magenta, electric cyan. Strong one-point perspective, cinematic contrast, depth of field so the far end glows softly. Keep the neon lines and the vanishing point in the right two thirds. Leave the left third calm: the dark reflective floor close to the camera, slightly out of focus, with only a soft cyan sheen, room for a person and a title. Keep the bottom-right corner calm: dark floor with no bright lights.',
  },
  {
    id: 'gaming-lowpoly-forest',
    file: 'gaming-lowpoly-forest.webp',
    title: 'Low-poly forest at night',
    alt: 'Low-poly pine forest at night seen from slightly above, faceted trees and fireflies on the left, a calm moonlit clearing on the right.',
    group: 'gaming',
    space: 'right',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no characters. A low-poly 3D forest at night, seen from slightly above: faceted pine trees made of flat triangles, a few low-poly rocks, a winding path, small glowing yellow fireflies and thin blue mist between the trees. Colours: deep indigo and dark teal trees, cool moonlight blue, tiny warm firefly dots. A big pale moon off-frame to the right casts cool light and long soft shadows to the left. Keep the trees, rocks and fireflies in the left two thirds. Leave the right third calm: an open moonlit clearing of smooth blue-grey ground fading into mist, no trees, room for a person and a title. Keep the bottom-right corner calm: plain dark ground in mist.',
  },

  // ── Dark & dramatic ─────────────────────────────────────────
  {
    id: 'dark-storm-sky',
    file: 'dark-storm-sky.webp',
    title: 'Storm sky',
    alt: 'Dark storm clouds with a lightning bolt in the distance on the right, smooth dark blue sky on the left.',
    group: 'dark',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no buildings. A dramatic stormy sky over a low, dark horizon: heavy rolling clouds, one bright branching lightning bolt in the distance, faint rain streaks. Colours: deep blue-grey and charcoal clouds, cold white-violet lightning glow, a thin band of dim teal light at the horizon. Moody, cinematic, high contrast. Keep the lightning and the heaviest clouds in the right two thirds. Leave the left third calm: smooth, darker blue sky with soft cloud texture and no lightning, room for a person and a title. Keep the bottom-right corner calm: dark, plain horizon.',
  },
  {
    id: 'dark-smoke',
    file: 'dark-smoke.webp',
    title: 'Coloured smoke',
    alt: 'Orange and teal smoke rising in a diagonal plume towards the top right of a black background, the whole left half almost plain black.',
    group: 'dark',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos. Thick swirling smoke on a pure black background, lit hard from the right side: warm orange smoke curling into cool teal smoke, rising in one diagonal plume from the centre of the frame up to the top-right corner, fine wisps and soft volume. Studio photography look, sharp detail in the smoke, deep blacks. Leave the whole left half calm: almost plain black with only a faint trace of smoke, room for a person and a title. Keep the bottom-right corner calm: black with no smoke.',
  },
  {
    id: 'dark-red-alert',
    file: 'dark-red-alert.webp',
    title: 'Red alert',
    alt: 'Dark industrial corridor flooded with red emergency light and haze on the left, a plain dark red wall on the right.',
    group: 'dark',
    space: 'right',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no signs, no symbols. A dark industrial corridor under red emergency lighting: metal walls and pipes, a rotating red warning light casting a beam through thick haze, glowing red reflections on a wet floor. Colours: deep black, blood red, a hint of orange in the brightest light. Tense, cinematic, strong depth with the corridor receding into darkness. Keep the warning light, pipes and corridor in the left two thirds. Leave the right third calm: a plain, dark red wall softly lit by the haze, no details, room for a person and a title. Keep the bottom-right corner calm: dark floor.',
  },
  {
    id: 'dark-spotlight',
    file: 'dark-spotlight.webp',
    title: 'Spotlight',
    alt: 'Single spotlight beam falling on an empty dark stage on the left, with dust in the light; dark empty space on the right.',
    group: 'dark',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no objects on stage. An empty dark stage with one spotlight shining straight down from above, its beam visible in light haze with floating dust, ending in a soft round pool of light on the floor. Colours: black and very dark blue-grey, warm white beam. Theatrical, minimal, high contrast. Place the beam and its pool of light in the left third, where a person will stand: plain, no other detail there. Keep the middle and right side dark with only faint haze, room for a title. Keep the bottom-right corner calm: plain dark floor.',
  },

  // ── Bright & fun ────────────────────────────────────────────
  {
    id: 'bright-sunburst',
    file: 'bright-sunburst.webp',
    title: 'Sunburst',
    alt: 'Yellow and orange sunburst rays spreading out from a bright glow on the left, fading to smooth orange on the right.',
    group: 'bright',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos. A bold retro sunburst: alternating yellow and orange rays radiating from a bright, smooth glowing centre placed in the left third. Clean graphic style, slight paper grain, gentle vignette at the edges. Colours: sunny yellow, tangerine, warm orange. The centre of the burst in the left third is a plain, bright glow with no rays, room for a person. The rays become softer and lower in contrast towards the right side, so a title stays readable there. Keep the bottom-right corner calm: smooth orange with almost no rays.',
  },
  {
    id: 'bright-comic-halftone',
    file: 'bright-comic-halftone.webp',
    title: 'Comic halftone',
    alt: 'Pop-art comic background with red and cyan halftone dots and action lines on the left, flat yellow with faint dots on the right.',
    group: 'bright',
    space: 'right',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no speech bubbles, no people, no logos, no characters. A pop-art comic book background: bold halftone dot patterns in red and cyan, radiating black action lines, a starburst shape, flat printed colours with slight misregistration. Colours: lemon yellow base, bright red, cyan, black lines. Flat lighting, graphic print look. Keep the action lines, starburst and dense dots in the left two thirds. Leave the right third calm: flat lemon yellow with only large, faint halftone dots, room for a person and a title. Keep the bottom-right corner calm: plain yellow.',
  },
  {
    id: 'bright-confetti',
    file: 'bright-confetti.webp',
    title: 'Confetti',
    alt: 'Pink, yellow and blue confetti falling over a pastel purple background on the right, a smooth clear area on the left.',
    group: 'bright',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no balloons with writing. Colourful confetti and streamers falling through the air over a soft pastel purple background, some pieces sharp, some blurred into bokeh for depth. Colours: hot pink, sunny yellow, sky blue, mint, on lavender purple. Bright, cheerful, soft studio light. Keep the confetti in the right two thirds, heaviest at the top right. Leave the left third calm: smooth lavender with no confetti, room for a person and a title. Keep the bottom-right corner calm: plain lavender, no confetti.',
  },
  {
    id: 'bright-gradient-pop',
    file: 'bright-gradient-pop.webp',
    title: 'Gradient pop',
    alt: 'Hot pink to orange gradient with glossy 3D blobs and spheres on the left, smooth gradient on the right.',
    group: 'bright',
    space: 'right',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos. A bold, glossy background: a smooth gradient from hot pink to bright orange, with a few soft 3D shapes (rounded blobs, spheres, a ring) in matching candy colours, lit from the top with gentle reflections and soft shadows. Playful, clean, modern 3D render. Keep the shapes in the left two thirds. Leave the right third calm: plain smooth pink-orange gradient, no shapes, room for a person and a title. Keep the bottom-right corner calm: plain gradient.',
  },

  // ── Studio & podcast ────────────────────────────────────────
  {
    id: 'studio-soft-studio',
    file: 'studio-soft-studio.webp',
    title: 'Soft studio',
    alt: 'Seamless warm grey photo studio backdrop with a soft pool of light on the left and gentle shadow towards the right.',
    group: 'studio',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no equipment in frame. A seamless photo studio backdrop in warm grey, curving smoothly from wall to floor, lit by a large softbox. Colours: warm grey, soft beige highlights, gentle charcoal vignette. Smooth, clean, photographic, very fine paper texture. The brightest soft pool of light sits in the left third, plain, room for a person. The light falls off gently into darker grey towards the right, where a title can sit. Keep the bottom-right corner calm: plain darker grey.',
  },
  {
    id: 'studio-desk-set',
    file: 'studio-desk-set.webp',
    title: 'Creator desk set',
    alt: 'Blurred creator desk with a microphone arm, a glowing monitor, a plant and shelves on the left, a plain softly lit wall on the right.',
    group: 'studio',
    space: 'right',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no readable screens, no brand names on objects. A cosy content creator desk set seen at eye level with shallow depth of field: a studio microphone on a boom arm, a monitor showing only a soft abstract glow, a small plant, wooden shelves with plain books and objects, warm lamp light and soft purple-blue accent light on the wall, all softly blurred into bokeh. Colours: warm wood, cream, muted purple and blue accents. Keep the desk, microphone and shelves in the left two thirds. Leave the right third calm: a plain, softly lit wall, out of focus, room for a person and a title. Keep the bottom-right corner calm: plain blurred desk surface.',
  },
  {
    id: 'studio-brick-wall',
    file: 'studio-brick-wall.webp',
    title: 'Brick wall',
    alt: 'Red brick wall seen at an angle, receding towards a plant and warm spotlights on the right, softly lit and out of focus on the left.',
    group: 'studio',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no signs, no graffiti. An exposed red-brown brick wall in a loft room seen at a sharp angle, so the wall recedes from the left edge into the distance on the right, low in contrast, warm light washing down from a row of small spotlights that shrink with the perspective, a tall green plant where the wall meets a window on the far right, a hint of wooden floor at the bottom. Colours: warm terracotta brick, amber light, deep brown shadows. Photographic, shallow depth of field, soft and cosy. Leave the left third calm: the nearest part of the wall, evenly lit and softly out of focus with very little texture, room for a person and a title. Keep the bottom-right corner calm: plain dark floor.',
  },
  {
    id: 'studio-neon-room',
    file: 'studio-neon-room.webp',
    title: 'Neon sign room',
    alt: 'Dark room with abstract wavy neon tube shapes glowing pink and blue on the right wall, a dark plain wall on the left.',
    group: 'studio',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no letters, no words, no numbers, no symbols, no people, no logos. A dark room with a few abstract neon tube shapes on the wall: wavy lines, a circle and a zigzag, with no letters or recognisable signs, glowing pink and electric blue, casting coloured light on a dark textured wall and a shelf with blurred plants. Slight haze, shallow depth of field, cinematic. Colours: near-black wall, neon pink, electric blue, a touch of purple where they mix. Keep the neon shapes and the shelf in the right two thirds. Leave the left third calm: dark plain wall with only a faint purple glow, room for a person and a title. Keep the bottom-right corner calm: dark, no neon.',
  },

  // ── Sport ───────────────────────────────────────────────────
  {
    id: 'sport-court',
    file: 'sport-court.webp',
    title: 'Indoor court from the stands',
    alt: 'Empty indoor basketball court seen from high in the stands, a hoop and court lines on the left, plain polished wooden floor on the right.',
    group: 'sport',
    space: 'right',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no team names, no numbers, no scoreboard writing. An empty indoor basketball court seen from high up in the stands, looking down at a steep angle: glossy wooden floor with white court lines, a basketball hoop and its painted key on the left, pools of cool white light from the arena ceiling, the edge of empty dark seats blurred in the top-left foreground. Colours: honey wood, white lines, cool blue shadows. Photographic, crisp reflections on the floor. Keep the hoop, the key and the busiest lines in the left two thirds. Leave the right third calm: plain polished wooden floor with no lines, room for a person and a title. Keep the bottom-right corner calm: plain wooden floor.',
  },
  {
    id: 'sport-pitch',
    file: 'sport-pitch.webp',
    title: 'Football pitch',
    alt: 'Low-angle view across a striped grass football pitch with a goal and floodlights on the right, an evening blue sky on the left.',
    group: 'sport',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no advertising boards with writing, no team colours. A low-angle view across an empty football pitch at dusk: freshly mown grass in light and dark stripes, white pitch lines, a goal with a net and floodlight towers glowing on the right, the far stands blurred. Colours: rich green grass, deep evening blue sky, warm white floodlight glow. Photographic, shallow depth of field on the grass in front. Keep the goal and floodlights in the right two thirds. Leave the left third calm: smooth evening sky above plain grass, room for a person and a title. Keep the bottom-right corner calm: plain blurred grass.',
  },
  {
    id: 'sport-stadium-lights',
    file: 'sport-stadium-lights.webp',
    title: 'Stadium lights',
    alt: 'Night stadium floodlights flaring through haze over a crowd blurred into light dots on the left, dark blue night sky on the right.',
    group: 'sport',
    space: 'right',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no recognisable people, no logos, no screens. A stadium at night seen from the pitch: banks of bright floodlights flaring through light haze, the crowd in the stands blurred into soft points of light, light beams crossing the air. Colours: deep navy night sky, cool white and warm gold lights, blue haze. Cinematic, big atmosphere, strong bokeh. Keep the floodlights and the blurred stands in the left two thirds. Leave the right third calm: dark blue night sky with soft haze, no lights, room for a person and a title. Keep the bottom-right corner calm: dark and plain.',
  },
  {
    id: 'sport-track',
    file: 'sport-track.webp',
    title: 'Running track from above',
    alt: 'Top-down view of red running track lanes curving across the top right in hard midday light, plain green infield on the left.',
    group: 'sport',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no lane numbers, no people, no logos. An empty athletics running track seen straight down from above, like a drone shot: red rubber lanes with crisp white lines sweeping in one wide arc from the top edge down to the middle of the right edge, short hard shadows in bright midday sun. Colours: brick red track, white lines, flat fresh green infield. Clean, graphic, photographic. Keep the arc of the lanes in the upper right two thirds. Leave the left third calm: plain, evenly mown green infield with no lines, room for a person and a title. Keep the bottom-right corner calm: plain green infield, no lines.',
  },

  // ── Abstract gradient ───────────────────────────────────────
  {
    id: 'gradient-sunset',
    file: 'gradient-sunset.webp',
    title: 'Sunset paper waves',
    alt: 'Layered paper-cut waves stacked from orange to magenta to purple, rising on the right, a smooth deep purple sky on the left.',
    group: 'gradient',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos. Abstract layered paper-cut waves: five or six smooth wavy bands stacked like dunes, each a flat colour from warm orange at the front through coral and magenta to deep purple at the back, with soft drop shadows between the layers and a faint paper grain. The waves rise from low on the left to high on the right, so their crests sit in the right two thirds. Soft warm light from the right. Leave the left third calm: a smooth, even deep purple sky above the lowest wave, room for a person and a title. Keep the bottom-right corner calm: one flat orange wave with no edges or shadows.',
  },
  {
    id: 'gradient-ocean',
    file: 'gradient-ocean.webp',
    title: 'Ocean diagonal split',
    alt: 'Frame split by one clean diagonal edge: a bright teal and aqua triangle on the left, deep navy blue on the right.',
    group: 'gradient',
    space: 'right',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos. A two-tone abstract background split by one clean diagonal edge running from the top centre down to the bottom left: on the left, a bright teal-to-aqua gradient with a thin glowing line of light along the edge; on the right, an even deep navy blue. Very fine film grain to prevent banding. Graphic, calm, modern, flat lighting. Keep the teal triangle and the glowing edge in the left half. Leave the right third calm: even deep navy with no light, room for a person and a title. Keep the bottom-right corner calm: smooth, even navy.',
  },
  {
    id: 'gradient-lime',
    file: 'gradient-lime.webp',
    title: 'Lime bokeh',
    alt: 'Large soft out-of-focus circles of lime and yellow light on a dark emerald background on the right, plain dark emerald on the left.',
    group: 'gradient',
    space: 'left',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no recognisable objects. Soft abstract bokeh: large and small out-of-focus circles of light in bright lime, pale yellow and mint, floating over a dark emerald and forest green background, some circles overlapping and glowing, like city lights through a defocused lens. Fresh, energetic, photographic, very fine grain. Keep the circles in the right two thirds, the biggest ones near the top right. Leave the left third calm: even dark emerald with no circles, room for a person and a title. Keep the bottom-right corner calm: smooth dark green with no circles.',
  },
  {
    id: 'gradient-charcoal-glow',
    file: 'gradient-charcoal-glow.webp',
    title: 'Charcoal geometry',
    alt: 'Flat overlapping triangles, circles and thin lines in charcoal grey with one orange circle glowing on the left, plain near-black on the right.',
    group: 'gradient',
    space: 'right',
    placeholder: false,
    prompt:
      '16:9 YouTube thumbnail background, no text, no people, no logos, no symbols. A dark, minimal geometric composition: flat overlapping shapes (large triangles, a half circle, thin parallel lines) in slightly different shades of charcoal grey, with one solid warm orange circle that glows softly, all on a near-black background with very fine film grain. Premium, quiet, Swiss-poster style, soft light from the top left. Keep the shapes and the orange circle in the left two thirds. Leave the right third calm: even near-black charcoal with no shapes, room for a person and a title. Keep the bottom-right corner calm: smooth, even dark colour.',
  },
];

export function backgroundSrc(bg: Pick<ThumbnailBackground, 'file'>): string {
  return `${BACKGROUNDS_DIR}/${bg.file}`;
}

export function backgroundsInGroup(group: BackgroundGroupId): ThumbnailBackground[] {
  return BACKGROUNDS.filter((b) => b.group === group);
}
