import type { MakerContent } from '../makers';

export const minecraft: MakerContent = {
  game: 'minecraft',
  status: 'published',
  updated: '2026-10-23',
  title: 'Minecraft Thumbnail Maker: AI Thumbnails for YouTube',
  description:
    'Make a Minecraft thumbnail from one line about your video: 100 days, a mob battle, a boss with no armour. Get three ideas in your style, ready for YouTube.',
  primaryKeyword: 'minecraft thumbnail maker',
  h1: 'Minecraft thumbnail maker',
  h1Accent: 'from one line about your video.',
  intro:
    'Say what happens in your video: "100 days on one block", "iron golem vs the Warden", "I beat the Wither with no armour". Base.Tube turns it into three Minecraft thumbnails with real mobs, biomes and the game’s blocky look, in your channel’s style.',
  ideas: [
    { label: 'One block', idea: 'I survived 100 days starting on one block', file: '03-100-days.webp' },
    { label: 'Nether only', idea: 'I survived 100 days in the Nether only', file: '04-100-days.webp' },
    { label: 'Golem vs Warden', idea: 'Iron golem vs the Warden: who wins?', file: '07-versus.webp' },
    { label: 'No armour', idea: 'Surviving with no armour until the Wither shows up', file: '10-boss-fight.webp' },
    { label: 'Creaking secret', idea: 'I found the secret block the creaking comes from', file: '15-updates-secrets.webp' },
    { label: 'Eiffel Tower', idea: 'I built the Eiffel Tower at 1:1 scale in Minecraft', file: '18-real-life.webp' },
  ],
  videoTypesTitle: 'A thumbnail for every kind of Minecraft video',
  videoTypes: [
    {
      name: '100 days and survival challenges',
      text: 'Say where you started and the one rule: one block, Nether only, hardcore. The Studio shows the tiny start next to what it became, with the rule as the big word.',
      idea: 'I survived 100 days starting on one block',
      file: '03-100-days.webp',
    },
    {
      name: 'Mob battles and versus',
      text: 'Name the two sides: two mobs, two builds, two armour sets. You get a split frame with each side in its own colour, so the viewer picks one before clicking.',
      idea: 'Iron golem vs the Warden: who wins?',
      file: '07-versus.webp',
    },
    {
      name: 'Boss fights and hardcore runs',
      text: 'Type the boss and what makes the run hard: no armour, one heart, wooden tools only. The Studio puts the boss in the frame and shows the handicap as an icon or two words.',
      idea: 'Surviving with no armour until the Wither shows up',
      file: '10-boss-fight.webp',
    },
    {
      name: 'Updates, mobs and secrets',
      text: 'Name the new mob, biome or hidden mechanic you show in the video. It becomes the subject of the thumbnail, with circles and arrows on the one detail that matters.',
      idea: 'I found the secret block the creaking comes from',
      file: '15-updates-secrets.webp',
    },
    {
      name: 'Builds and real life',
      text: 'Say what you built or which real place you copied. You get the real thing next to the Minecraft version, so the size of the project reads in one glance.',
      idea: 'I built the Eiffel Tower at 1:1 scale in Minecraft',
      file: '18-real-life.webp',
    },
  ],
  faq: [
    {
      q: 'What should I type to get a good Minecraft thumbnail?',
      a: 'One line about what happens in the video, with the detail that makes it different: "100 days Nether only", "iron golem vs the Warden", "the Wither with no armour". You can also paste the video link or the script. Name a mob, a biome or a boss if it matters.',
    },
    {
      q: 'Can it show real Minecraft mobs, bosses and biomes?',
      a: 'Yes. Name them in your idea, for example Steve, Alex, the Warden, the Wither, a creaking, hoglins or a crimson forest. Every example on this page shows the game’s own characters, mobs and places, with the blocky look players recognise at a glance.',
    },
    {
      q: 'Can I put my own face next to the game?',
      a: 'Yes. Add a photo to your channel profile once; it is used in every idea you ask for. Cube heads cannot show much emotion, so your face reacting next to the new mob or the boss adds what the blocks cannot.',
    },
    {
      q: 'What if the ideas are not quite right?',
      a: 'Change anything in plain words, like "make the Warden bigger", "night instead of day" or "shorter text". You can also get a review of each idea, then download all three.',
    },
    {
      q: 'Why not a Minecraft thumbnail template?',
      a: 'A template gives you the same grass background and layout everyone else downloaded, and you still have to pose the characters and fit the text. Here you get three finished ideas made for your video, in your channel’s style.',
    },
    {
      q: 'Will a better thumbnail get my Minecraft videos more views?',
      a: 'Nobody can promise that. A clearer thumbnail gives the video a better chance in a feed full of green blocks. Connect your YouTube channel to see each video’s real click-through rate, and download all three ideas to test them with YouTube Test & Compare.',
    },
  ],
};
