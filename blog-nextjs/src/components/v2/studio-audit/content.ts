// Shared, honest copy for the three existing tool pages
// (/tools, /tools/ctr-optimizer).
//
// Position: Base.Tube does NOT predict or score click-through rate.
// What is true and live on the beta: AI Thumbnail Studio, a free channel audit
// (thumbnails + titles, evidence-based critique) and, once a creator connects
// YouTube, their real impressions and real click-through rate.

export const AUDIT_URL = 'https://beta.base.tube/ai-thumbnails/audit';
export const STUDIO_URL = '/ai-thumbnails';

export interface Faq {
  q: string;
  a: string;
}

export const auditFaqs: Faq[] = [
  {
    q: 'What does the free YouTube channel audit check?',
    a: 'It reviews your thumbnails and titles together, the packaging viewers see before they click. You get a written critique tied to evidence from your own videos: what reads clearly, what is confusing, and what to change first.',
  },
  {
    q: 'Does the audit give my thumbnail a CTR score?',
    a: 'No, on purpose. A predicted click-through rate is a guess, and we will not hand you a number we cannot stand behind. The only real test of a thumbnail is how many people click it on YouTube.',
  },
  {
    q: 'How do I know if a thumbnail change worked?',
    a: 'Connect YouTube. Base.Tube then shows your real impressions and your real click-through rate, so you can compare the same video before and after you change its thumbnail or title. Give each version enough time and views before you judge it.',
  },
  {
    q: 'What does connecting my YouTube channel add?',
    a: 'Your real impressions and your real click-through rate, straight from YouTube. That is what turns "I think this is better" into a measured before and after.',
  },
  {
    q: 'Is the channel audit free?',
    a: 'Yes. The channel audit of your thumbnails and titles is free. You read the results on Base.Tube.',
  },
  {
    q: 'Can I just check how one thumbnail will look on YouTube?',
    a: 'Yes. Base.Tube also has free tools that show how a thumbnail looks and reads in the real YouTube feed, and how a title fits. They show the look; the audit reviews the thinking behind it.',
  },
];

export const studioFaqs: Faq[] = [
  {
    q: 'What is the AI Thumbnail Studio?',
    a: 'A tool that makes YouTube thumbnails in your channel\'s saved style. It uses your brand kit and your own face, makes 3 variants for each video, and lets you change any of them with a one-sentence edit. It is live on the Base.Tube beta.',
  },
  {
    q: 'How is it different from a general AI image generator?',
    a: 'A general image generator starts from zero every time. The Studio remembers your channel\'s look, your brand kit and your face, so thumbnails stay consistent from one video to the next.',
  },
  {
    q: 'Can I use my own face in the thumbnails?',
    a: 'Yes. You save your face once as part of your channel style, and the Studio uses it when it makes thumbnails for your videos.',
  },
  {
    q: 'How do I change a thumbnail I do not quite like?',
    a: 'Write one sentence that says what to change, for example "warmer light, more steam". The Studio applies the edit to that thumbnail.',
  },
  {
    q: 'Will an AI thumbnail get me more clicks?',
    a: 'We do not predict click-through rate, so we do not promise a lift. The Studio helps you make thumbnails you are happy with, fast. To learn what works for your audience, connect YouTube: Base.Tube shows your real impressions and click-through rate so you can compare before and after.',
  },
];

const SITE = 'https://base.tube';

export function faqJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function auditAppJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Base.Tube YouTube Thumbnail & Channel Audit',
    url: `${SITE}/tools/ctr-optimizer`,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    description:
      'A free audit of your YouTube thumbnails and titles with an evidence-based written critique. Connect YouTube to see your real impressions and click-through rate.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

