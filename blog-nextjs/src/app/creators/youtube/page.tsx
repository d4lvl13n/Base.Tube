import type { Metadata } from 'next';

import { creatorsHubState, standoutsOf } from '@/components/v2/creators/creators';
import CreatorsHubPage from '@/components/v2/creators/CreatorsHubPage';
import { buildHubJsonLd, buildHubMetadata, jsonLdString } from '@/components/v2/creators/seo';

// /creators/youtube: every creator page, grouped by game. Indexed once CREATORS_HUB_MIN_LIVE
// creators are live; a noindex preview of every creator before that.

export function generateMetadata(): Metadata {
  const { isLive, creators } = creatorsHubState();
  const first = creators.map((c) => ({ c, v: standoutsOf(c)[0]?.video })).find((x) => x.v);
  return buildHubMetadata(isLive, first?.v ? { src: first.v.thumbnail, alt: `${first.v.title}: thumbnail by ${first.c.name}` } : undefined);
}

export default function CreatorsHubRoute() {
  const { isLive, creators } = creatorsHubState();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(buildHubJsonLd(creators)) }} />
      <CreatorsHubPage creators={creators} isLive={isLive} />
    </>
  );
}
