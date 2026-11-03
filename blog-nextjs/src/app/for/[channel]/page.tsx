import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  DEFAULT_INTERVAL,
  monthlyChoiceLabel,
  PRICING_URL,
  signUpUrl,
  startOffer,
  startOfferTerms,
} from '@/components/ai-thumbnails/catalog';
import { getCatalog } from '@/components/ai-thumbnails/data';
import ChannelRebrand from '@/components/v2/for/ChannelRebrand';
import { getForChannel, getForChannels } from '@/components/v2/for/content';

// The trial's terms follow the app's plan catalog: read again every hour.
export const revalidate = 3600;

// One static page per file in content/for/. Unknown channels return 404. These pages are private: not
// in the sitemap, not linked from anywhere, and marked noindex here and in next.config.ts.
export const dynamicParams = false;

type Params = { params: Promise<{ channel: string }> };

export function generateStaticParams() {
  return getForChannels().map((c) => ({ channel: c.channel }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { channel } = await params;
  const page = getForChannel(channel);
  if (!page) return {};
  const title = `${page.channelName}: your channel, rebranded`;
  const image = { url: page.videos[0].after, width: 1280, height: 720 };
  return {
    title,
    description: page.styleIdea,
    robots: { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } },
    // The preview when the link is pasted in a chat, instead of the site's default card.
    openGraph: { type: 'website', siteName: 'Base.Tube', title, description: page.styleIdea, images: [image] },
    twitter: { card: 'summary_large_image', title, description: page.styleIdea, images: [image] },
  };
}

export default async function ForChannelRoute({ params }: Params) {
  const { channel } = await params;
  const page = getForChannel(channel);
  if (!page) notFound();

  // `ref` is what the outreach links are meant to carry. Today the app reads it as a referral code; the
  // app's conversion events read `site_ref`, so both are sent.
  const withRef = (url: string) => {
    const link = new URL(url);
    link.searchParams.set('ref', `for-${channel}`);
    link.searchParams.set('site_ref', `for-${channel}`);
    return link.toString();
  };
  const offer = startOffer(await getCatalog());
  const plan = offer.kind === 'unavailable' ? null : offer.plan;
  const trial = offer.kind === 'trial';

  return (
    <ChannelRebrand
      page={page}
      href={withRef(plan ? signUpUrl(plan.id, DEFAULT_INTERVAL, trial) : PRICING_URL)}
      terms={startOfferTerms(offer)}
      monthly={plan && { href: withRef(signUpUrl(plan.id, 'month', trial)), label: monthlyChoiceLabel(plan, trial) }}
    />
  );
}
