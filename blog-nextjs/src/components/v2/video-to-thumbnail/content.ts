// Copy shared by the page (visible text) and the route (JSON-LD).
// Keep FAQ answers as plain strings so the markup always matches what people read.

export const PAGE_URL = 'https://base.tube/tools/video-to-thumbnail';

export const PAGE_TITLE = 'Video to Thumbnail: Extract the Best Frame, Free';

export const PAGE_DESCRIPTION =
  'Turn any video into a YouTube thumbnail. Step frame by frame, auto-pick the sharpest shots, export 1280×720 JPG or PNG. Runs in your browser, no upload.';

export const STUDIO_GENERATE_URL = '/ai-thumbnails';
export const STUDIO_AUDIT_URL = '/youtube-channel-audit';

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: 'How do I extract a frame from a video?',
    a: 'Open the video in the tool above, pause on the moment you want (the arrow keys move one frame at a time), and press Capture frame. Then download that frame as a JPG or PNG. You can take it at the video\'s full resolution or as a 1280×720 thumbnail. There is nothing to install.',
  },
  {
    q: 'How do I make a thumbnail from a video?',
    a: 'Capture the frame, then export it as a 1280×720 image, the size YouTube recommends for thumbnails. Use the crop frame to move or zoom into the part of the picture you want, and leave a quiet area for a title. If you want text and graphics on top, you can finish it in the Base.Tube Studio.',
  },
  {
    q: 'Is my video uploaded anywhere?',
    a: 'No. The video is opened and read inside your browser. Nothing is sent to Base.Tube or to any other server, and there is no account. Close the tab and it is gone. It also means a large file is not slow to start: it opens straight from your disk.',
  },
  {
    q: 'Which video files work?',
    a: 'MP4, MOV and WebM, as long as your browser can play them. H.264 MP4 works everywhere. Some files use formats a browser cannot decode, such as ProRes, or HEVC on some computers. If that happens the tool tells you, and converting the file to H.264 MP4 with a free app such as HandBrake fixes it.',
  },
  {
    q: 'How does Auto-pick choose frames?',
    a: 'It samples 12 moments spread evenly across the video and ranks them with simple image measures: sharpness (to avoid motion blur), brightness, contrast, and whether a cut or fade is happening nearby. It cannot see faces or emotion and it does not predict clicks. Treat the top results as sharp starting points and choose with your own eyes. The only real test of a thumbnail is how it performs on YouTube.',
  },
  {
    q: 'Can I make a thumbnail from a vertical video or a Short?',
    a: 'Yes. For a normal YouTube thumbnail, choose 16:9: you get a wide slice of the vertical frame that you can move up and down. For a Shorts-shaped image, choose 9:16 and export a 1080×1920 vertical frame.',
  },
];

export interface Step {
  n: string;
  title: string;
  desc: string;
}

export const STEPS: Step[] = [
  {
    n: '01',
    title: 'Open your video',
    desc: 'Choose an MP4, MOV or WebM file. It opens in your browser and nothing is uploaded, so a large file opens straight from your disk instead of waiting for an upload.',
  },
  {
    n: '02',
    title: 'Find the frame',
    desc: 'Play the video or drag the timeline, then use the arrow keys to move one frame at a time. Or press Auto-pick to see 12 sampled moments ranked by sharpness.',
  },
  {
    n: '03',
    title: 'Crop and export',
    desc: 'Press Capture, move the crop frame, and download a 1280×720 JPG or PNG. Or take the whole frame at the video\'s native resolution.',
  },
];

export const CRITERIA: { label: string; text: string }[] = [
  {
    label: 'Face',
    text: 'Look for a face that fills a good part of the picture, with both eyes visible and in focus. A large face is still readable when the thumbnail shrinks to phone size.',
  },
  {
    label: 'Emotion',
    text: 'Pick the peak of a reaction, not the moment before or after it. Step back and forth a few frames: an expression often peaks for only a short moment.',
  },
  {
    label: 'Sharpness',
    text: 'Motion blur ruins a thumbnail. Around fast movement, step frame by frame until the motion settles. Auto-pick ranks sampled frames by sharpness to save you the search.',
  },
  {
    label: 'Space for text',
    text: 'Leave a quiet area, away from the face, where a few words can go later. A frame packed edge to edge leaves no room for a title.',
  },
  {
    label: 'Small size',
    text: 'Check that the frame still reads when it is tiny. If you cannot tell who or what it shows at feed size, choose a closer or simpler frame.',
  },
];

export const REAL_FRAME_WHEN: string[] = [
  'A person or subject is clear, well lit and sharp at some moment',
  'The thumbnail should show what the video really contains',
  'You want something fast and free, with no licence to check',
  'The footage is your own, so faces and places are yours to use',
];

export const DESIGN_WHEN: string[] = [
  'The video is a screen recording or slides with no strong moment',
  'Every shot has motion blur, poor light or a half-closed eye',
  'The idea needs something never on screen, like a result, a comparison or a big number',
  'You need a wide image and the video is vertical',
];

export const RELATED_LINKS: { href: string; label: string; desc: string }[] = [
  {
    href: '/tools/youtube-thumbnail-resizer',
    label: 'Thumbnail resizer',
    desc: 'Fit any image to 1280×720 and keep the file small.',
  },
  {
    href: '/tools/youtube-thumbnail-preview',
    label: 'Thumbnail preview',
    desc: 'See how the frame looks in a YouTube feed.',
  },
  {
    href: '/tools/youtube-thumbnail-tester',
    label: 'Thumbnail tester',
    desc: 'Put candidate thumbnails next to each other.',
  },
  {
    href: '/tools/youtube-title-checker',
    label: 'Title checker',
    desc: 'Check the title that goes with the thumbnail.',
  },
  {
    href: '/youtube-thumbnail-size',
    label: 'Thumbnail size guide',
    desc: 'Dimensions, file size and format rules in one place.',
  },
];
