export interface FaqItem {
  q: string;
  a: string;
}

// Shared by the visible FAQ and the FAQPage JSON-LD, so the two never drift apart.
export const FAQ: FaqItem[] = [
  {
    q: 'How do I preview a YouTube thumbnail before I publish?',
    a: 'Upload your thumbnail, type your title and channel name, then choose a view: desktop home, search results, up next or the mobile feed. The tool places your video among other videos so you can judge it in context. Paste the links of videos you compete with to add them to the feed, and press Shuffle position to see your video next to different neighbours.',
  },
  {
    q: 'Is my thumbnail uploaded anywhere?',
    a: 'No. Your thumbnail, channel picture and text stay in your browser, and nothing is sent to Base.Tube. If you add other videos by link, your browser loads their public thumbnails and titles from YouTube. Those requests contain only the other video, nothing about yours.',
  },
  {
    q: 'What size should a YouTube thumbnail be?',
    a: 'The standard is 1280 × 720 pixels in a 16:9 shape. Keep important content away from the edges and away from the bottom-right corner, where the length badge sits. Our YouTube thumbnail size guide has the current file limits and formats.',
  },
  {
    q: 'Why does the length badge matter?',
    a: 'YouTube draws the video length over the bottom-right corner of the thumbnail. Any text, face or logo placed there is partly hidden. Use the Length badge switch in the tool to see exactly what it covers.',
  },
  {
    q: 'Is this exactly how YouTube looks?',
    a: 'It is a close recreation, not a copy. Proportions, colours and the two-line title cut-off follow the real layouts, but YouTube changes its design often, and the exact look depends on your device, screen size and fonts. Base.Tube is not affiliated with YouTube.',
  },
  {
    q: 'Does a good-looking preview mean more clicks?',
    a: 'No. A preview shows how your thumbnail and title look. It does not measure or predict click-through rate (CTR), which is the share of people who click after seeing your video. Only YouTube data shows that. Connect your channel to Base.Tube to see real impressions and CTR for each video.',
  },
];
