/** Copy that is shared between the visible page and its JSON-LD. */

export const PAGE_URL = 'https://base.tube/tools/youtube-title-checker';

export const SOURCES = {
  helpUpload: 'https://support.google.com/youtube/answer/57407',
  helpEdit: 'https://support.google.com/youtube/answer/57404',
  api: 'https://developers.google.com/youtube/v3/docs/videos',
};

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: 'What is the YouTube title character limit?',
    a: 'A YouTube video title can be up to 100 characters. YouTube Help says: "Video titles have a character limit of 100 characters and cannot include invalid characters." In YouTube’s developer documentation, the invalid characters are the angle brackets < and >. This checker counts each emoji as one character. YouTube does not say how it counts emoji, so leave a little room if your title has them.',
  },
  {
    q: 'How many characters of a YouTube title are actually visible?',
    a: 'It depends on the screen and on the letters. We measured YouTube’s layouts on 29 September 2026 (a 1440 px desktop window and a 390 px phone). A 100-character title showed about 60 to 70 characters on the desktop home feed, 70 to 85 on a mobile feed, 45 to 58 in the suggested-videos sidebar, and almost all 100 in desktop search. Capital letters and wide characters fit fewer, narrow letters fit more. Paste your own title above to see where it is cut.',
  },
  {
    q: 'Is this a YouTube SEO title checker, and does it score my title?',
    a: 'It does not give a score and it cannot predict clicks. It shows how your title reads and where it is cut, and flags things worth a second look, such as long stretches of capitals or repeated punctuation. On SEO, it checks the parts that are in your hands: length, where your main keyword sits, and how the title looks on each screen. It does not look up search volume or rankings. Keyword research tools do that. The only real test of a title and thumbnail is how they perform on YouTube, in your own impressions and click-through rate.',
  },
  {
    q: 'Can I use emoji, brackets, ALL CAPS or exclamation marks in a YouTube title?',
    a: 'Yes. YouTube only rejects the characters < and >. The checker flags the others as things to look at, not as errors, because they cost characters and look different on small screens: emoji are tiny on a phone, text in brackets at the end is the first to be cut, and long stretches of capitals are harder to read.',
  },
  {
    q: 'Should my title repeat the words on my thumbnail?',
    a: 'Usually not. Viewers see the two together, so repeating the same words wastes space. A useful split is: the title says what the video is, and the thumbnail shows the payoff, a feeling or a detail the title leaves out. Type the words from your thumbnail into the checker and it tells you how many repeat the title.',
  },
  {
    q: 'Is the checker free, and is my title private?',
    a: 'It is free, with no sign-up. Everything runs in your browser. Your titles and any thumbnail you add are never uploaded and never leave your device.',
  },
];

export const CAPACITY_ROWS = [
  { surface: 'Desktop home feed', width: '275 px', lines: '2', cut: 'about 60 to 70' },
  { surface: 'Mobile feed', width: '278 px', lines: '2', cut: 'about 70 to 85' },
  { surface: 'Suggested videos sidebar', width: '136 px', lines: '3', cut: 'about 45 to 58' },
  { surface: 'Desktop search', width: '588 px', lines: '2', cut: 'almost all 100' },
];

export const PAIRS = [
  { title: 'I Edited Only on My Phone for 30 Days', thumb: 'The phone on a desk, and one word: “Worth it?”' },
  { title: 'How I Built a Standing Desk Under $100', thumb: 'The finished desk, with “$87” in large type' },
  { title: 'Why Your Sourdough Will Not Rise', thumb: 'A flat loaf next to a tall one' },
];
