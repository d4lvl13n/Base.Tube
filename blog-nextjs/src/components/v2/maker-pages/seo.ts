import type { Metadata } from 'next';

import { SITE_URL } from '../thumbnail-pages/lib/config.mjs';
import type { ThumbnailPage } from '../thumbnail-pages/lib/schema.mjs';
import { makerIsLive, makerPath, type MakerContent } from './makers';

const NOINDEX = { index: false, follow: true, googleBot: { index: false, follow: true } } as const;

/** The three steps of the Studio, shown on the page and sent as HowTo data. */
export const MAKER_STEPS = [
  {
    name: 'Describe your video',
    text: 'Paste the video link or the script, or write one line about what happens: "I won with 1 HP", "Bronze to Unreal".',
  },
  {
    name: 'Get three ideas',
    text: 'Base.Tube makes three thumbnails in your channel’s style, with your face if you add a photo to your profile once.',
  },
  {
    name: 'Change, review, download',
    text: 'Change anything in plain words, get a review of each idea, then download all three for YouTube Test & Compare.',
  },
];

const url = (m: MakerContent) => `${SITE_URL}${makerPath(m.game)}`;
const absolute = (src: string) => (src.startsWith('http') ? src : `${SITE_URL}${src}`);

export function buildMakerMetadata(m: MakerContent, p: ThumbnailPage): Metadata {
  const first = p.gallery.find((g) => !g.placeholder);
  const og = first ? { url: absolute(first.src), width: 1280, height: 720, alt: first.alt } : undefined;
  return {
    title: m.title,
    description: m.description,
    keywords: [m.primaryKeyword, `${p.name.toLowerCase()} thumbnail generator`, `ai ${p.name.toLowerCase()} thumbnail`],
    alternates: { canonical: url(m) },
    openGraph: { type: 'website', url: url(m), siteName: 'Base.Tube', title: m.title, description: m.description, ...(og ? { images: [og] } : {}) },
    twitter: { card: 'summary_large_image', site: '@base_tube', title: m.title, description: m.description, ...(og ? { images: [og.url] } : {}) },
    ...(makerIsLive(m) ? {} : { robots: NOINDEX }),
  };
}

export function buildMakerJsonLd(m: MakerContent, p: ThumbnailPage) {
  const pageUrl = url(m);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${pageUrl}#app`,
        name: `${p.name} Thumbnail Maker by Base.Tube`,
        url: pageUrl,
        description: m.description,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        publisher: { '@type': 'Organization', name: 'Base.Tube', url: SITE_URL },
      },
      {
        '@type': 'HowTo',
        name: `How to make a ${p.name} thumbnail`,
        step: MAKER_STEPS.map((st, i) => ({ '@type': 'HowToStep', position: i + 1, name: st.name, text: st.text })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: m.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'AI thumbnails', item: `${SITE_URL}/ai-thumbnails` },
          { '@type': 'ListItem', position: 3, name: `${p.name} thumbnail maker`, item: pageUrl },
        ],
      },
    ],
  };
}
