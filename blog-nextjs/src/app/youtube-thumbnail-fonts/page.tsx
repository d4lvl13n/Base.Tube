import type { Metadata } from 'next';
import ThumbnailFontsPage from '@/components/v2/thumbnail-fonts/ThumbnailFontsPage';
import { CHECKED_ON_ISO, FAQ, FONTS, PAGE_URL } from '@/components/v2/thumbnail-fonts/content';

// Absolute title: the site template would add " | Base.Tube" and push it past 60 characters.
const TITLE = 'YouTube Thumbnail Fonts: 14 Best Free Fonts + Live Preview';
const DESCRIPTION =
  'The best YouTube thumbnail fonts, all free on Google Fonts. Type your text and see it in 14 fonts at real feed size, with outline and shadow.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords:
    'youtube thumbnail fonts, youtube thumbnail font, font for youtube thumbnail, best font for youtube thumbnail, thumbnail fonts, best thumbnail fonts, cool thumbnail fonts, good thumbnail fonts',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube: best fonts for YouTube thumbnails with a live preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    title: TITLE,
    description: DESCRIPTION,
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: 'en',
      dateModified: CHECKED_ON_ISO,
      isPartOf: { '@type': 'WebSite', name: 'Base.Tube', url: 'https://base.tube' },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      mainEntity: { '@id': `${PAGE_URL}#fonts` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Base.Tube', item: 'https://base.tube' },
        { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://base.tube/tools' },
        { '@type': 'ListItem', position: 3, name: 'YouTube thumbnail fonts', item: PAGE_URL },
      ],
    },
    {
      '@type': 'ItemList',
      '@id': `${PAGE_URL}#fonts`,
      name: 'Free fonts for YouTube thumbnails',
      numberOfItems: FONTS.length,
      itemListElement: FONTS.map((f, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: f.name,
        url: f.url,
      })),
    },
    {
      '@type': 'WebApplication',
      '@id': `${PAGE_URL}#app`,
      name: 'YouTube Thumbnail Font Preview',
      url: `${PAGE_URL}#preview`,
      description:
        'Type up to 20 characters and see them in 14 free fonts, with your own text, outline and background colours, at the sizes YouTube shows thumbnails. Runs in your browser; nothing is uploaded.',
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Any (web browser)',
      browserRequirements: 'Requires JavaScript',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: 'Base.Tube', url: 'https://base.tube' },
    },
    {
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
};

export default function YouTubeThumbnailFontsRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, first-party data only; "<" is escaped so it can never close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ThumbnailFontsPage />
    </>
  );
}
