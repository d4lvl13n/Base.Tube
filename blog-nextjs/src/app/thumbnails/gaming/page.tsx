import type { Metadata } from 'next';

import { gamingHubState, GAMING_HUB_SLUG, realExamples } from '@/components/v2/thumbnail-pages/games';
import GamingHubPage, { GAMING_FAQ } from '@/components/v2/thumbnail-pages/GamingHubPage';
import { SITE_URL } from '@/components/v2/thumbnail-pages/lib/config.mjs';
import { jsonLdString, pageUrl } from '@/components/v2/thumbnail-pages/seo';

// /thumbnails/gaming: every game page with a strip of its examples. Indexed once
// HUB_MIN_LIVE_PAGES game pages are live; a noindex preview of all game pages before that.

const TITLE = 'Gaming Thumbnail Ideas: Real Game Examples';
const DESCRIPTION =
  'Gaming thumbnail ideas sorted by game: real examples for launch day, challenges, fails and guides, and the layouts behind each look.';

export function generateMetadata(): Metadata {
  const { isLive, pages } = gamingHubState();
  const url = pageUrl(GAMING_HUB_SLUG);
  const first = pages[0] ? realExamples(pages[0])[0] : undefined;
  const images = first ? [{ url: `${SITE_URL}${first.src}`, width: 1280, height: 720, alt: first.alt }] : undefined;
  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords: ['gaming thumbnail', 'gaming thumbnail ideas', 'game thumbnail', 'youtube gaming thumbnail'],
    alternates: { canonical: url },
    openGraph: { type: 'website', url, siteName: 'Base.Tube', title: TITLE, description: DESCRIPTION, images },
    twitter: { card: 'summary_large_image', site: '@base_tube', title: TITLE, description: DESCRIPTION },
    ...(isLive ? {} : { robots: { index: false, follow: true } }),
  };
}

export default function GamingHubRoute() {
  const { isLive, pages } = gamingHubState();
  const url = pageUrl(GAMING_HUB_SLUG);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: 'en',
        isPartOf: { '@type': 'WebSite', name: 'Base.Tube', url: SITE_URL },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: pages.length,
          itemListElement: pages.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: pageUrl(p.slug),
            name: `${p.name} thumbnails`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Thumbnail ideas', item: pageUrl() },
          { '@type': 'ListItem', position: 3, name: 'Gaming', item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: GAMING_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <GamingHubPage pages={pages} isLive={isLive} />
    </>
  );
}
