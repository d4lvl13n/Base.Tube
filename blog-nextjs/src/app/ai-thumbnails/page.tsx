import type { Metadata } from 'next';
import Landing from '@/components/ai-thumbnails/Landing';
import { catalogTrial, landingFaq, type SubscriptionCatalog } from '@/components/ai-thumbnails/catalog';
import { OG_IMAGE_SRC } from '@/components/ai-thumbnails/content';
import { getCatalog, getFreeReviewsPerDay } from '@/components/ai-thumbnails/data';
import './ai-thumbnails.css';

// The page is built on the server and rebuilt at most once an hour with fresh plans and prices.
export const revalidate = 3600;

const PAGE_URL = 'https://base.tube/ai-thumbnails';
const TITLE = 'AI YouTube Thumbnails That Look Like Your Channel';
const OG_ALT = 'AI Thumbnails by Base.Tube: example thumbnails made with AI Thumbnails';

function describe(catalog: SubscriptionCatalog | null): string {
  const trial = catalogTrial(catalog);
  const base =
    "Paste your video link or script. Get three thumbnail ideas with your face and your channel's style, ready for YouTube Test & Compare.";
  return trial ? `${base} ${trial.days}-day free trial.` : base;
}

export async function generateMetadata(): Promise<Metadata> {
  const description = describe(await getCatalog());
  return {
    title: TITLE,
    description,
    alternates: { canonical: PAGE_URL },
    openGraph: {
      type: 'website',
      url: PAGE_URL,
      siteName: 'Base.Tube',
      locale: 'en_US',
      title: TITLE,
      description,
      images: [{ url: OG_IMAGE_SRC, width: 1200, height: 630, alt: OG_ALT, type: 'image/jpeg' }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@base_tube',
      creator: '@base_tube',
      title: TITLE,
      description,
      images: [{ url: OG_IMAGE_SRC, alt: OG_ALT }],
    },
  };
}

/** SoftwareApplication with the monthly prices from the catalog, and the visible FAQ. No rating of any kind: the product has none. */
function structuredData(catalog: SubscriptionCatalog | null) {
  const offers = (catalog?.plans ?? [])
    .filter((plan) => plan.prices.month.currency.toLowerCase() === 'usd')
    .map((plan) => {
      const price = (plan.prices.month.amountCents / 100).toFixed(2);
      return {
        '@type': 'Offer',
        name: plan.name,
        price,
        priceCurrency: 'USD',
        url: PAGE_URL,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price,
          priceCurrency: 'USD',
          unitCode: 'MON',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
        },
      };
    });
  const application = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI Thumbnails by Base.Tube',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    url: PAGE_URL,
    description: describe(catalog),
    image: `https://base.tube${OG_IMAGE_SRC}`,
    publisher: { '@type': 'Organization', name: 'Base.Tube', url: 'https://base.tube' },
    ...(offers.length ? { offers } : {}),
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: landingFaq(catalog).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
  return [application, faq];
}

const jsonLd = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });

export default async function AiThumbnailsPage() {
  const [catalog, freeReviews] = await Promise.all([getCatalog(), getFreeReviewsPerDay()]);
  const [application, faq] = structuredData(catalog);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(application)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faq)} />
      <Landing catalog={catalog} freeReviews={freeReviews} />
    </>
  );
}
