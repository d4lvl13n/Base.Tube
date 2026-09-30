import type { Metadata } from 'next';
import { getFreeReviewsPerDay } from '@/components/ai-thumbnails/data';
import Landing from '@/components/channel-audit/Landing';
import { channelAuditFaq, CHANNEL_AUDIT_APP_URL, OG_IMAGE_SRC, PAGE_URL } from '@/components/channel-audit/content';
import '../ai-thumbnails/ai-thumbnails.css';
import './channel-audit.css';

// Built on the server; rebuilt at most once an hour with the app's current free thumbnail reviews a day.
export const revalidate = 3600;

// 46 characters before the site's " | Base.Tube".
const TITLE = 'Free YouTube Channel Audit & Thumbnail Checker';
const DESCRIPTION =
  'A free YouTube channel audit of your thumbnails and titles: what is on each one, what to test next, and your real CTR when you connect YouTube.';
const OG_ALT = 'Free YouTube channel audit by Base.Tube: an example report of three thumbnails with their observed facts';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'youtube channel audit',
    'free youtube channel audit',
    'thumbnail checker',
    'youtube thumbnail checker',
    'youtube thumbnail analyzer',
    'thumbnail rater',
    'thumbnail analyzer',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'Base.Tube',
    locale: 'en_US',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE_SRC, width: 1200, height: 630, alt: OG_ALT, type: 'image/jpeg' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    creator: '@base_tube',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE_SRC, alt: OG_ALT }],
  },
};

/**
 * WebApplication with a price of 0 (the audit is free during the beta: no credits, see the backend's
 * ChannelAuditController), the visible FAQ, and the breadcrumb. No rating of any kind.
 */
function structuredData(freeReviews: number | null) {
  const application = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Base.Tube YouTube Channel Audit',
    url: PAGE_URL,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires a free Base.Tube account.',
    description: DESCRIPTION,
    image: `https://base.tube${OG_IMAGE_SRC}`,
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', url: CHANNEL_AUDIT_APP_URL },
    publisher: { '@type': 'Organization', name: 'Base.Tube', url: 'https://base.tube' },
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: channelAuditFaq(freeReviews).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Base.Tube', item: 'https://base.tube' },
      { '@type': 'ListItem', position: 2, name: 'YouTube Channel Audit', item: PAGE_URL },
    ],
  };
  return [application, faq, breadcrumb];
}

const jsonLd = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });

export default async function YouTubeChannelAuditPage() {
  const freeReviews = await getFreeReviewsPerDay();
  return (
    <>
      {structuredData(freeReviews).map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />
      ))}
      <Landing freeReviews={freeReviews} />
    </>
  );
}
