import Link from 'next/link';

import { avatarAt, creatorPath } from './links';
import c from './creators.module.css';

/** Round channel avatar (YouTube CDN, resized by URL). */
export function Avatar({ src, size, className }: { src: string | null; size: number; className: string }) {
  const url = avatarAt(src, size * 2);
  if (!url) return <span className={className} aria-hidden />;
  // eslint-disable-next-line @next/next/no-img-element -- external YouTube avatar, sized through its URL
  return <img src={url} alt="" width={size} height={size} loading="lazy" decoding="async" className={className} referrerPolicy="no-referrer" />;
}

/** Compact link to a creator page: avatar, name, subscribers. */
export function PersonLink({ slug, name, avatar, subscribersText }: { slug: string; name: string; avatar: string | null; subscribersText: string | null }) {
  return (
    <Link href={creatorPath(slug)} className={c.person}>
      <Avatar src={avatar} size={48} className={c.cardAvatar} />
      <span>
        <span className={c.cardName}>{name}</span>
        {subscribersText && <span className={c.cardSubs}>{subscribersText}</span>}
      </span>
    </Link>
  );
}

/** Card with one standout thumbnail on top (hub). */
export function CreatorCard({
  slug,
  name,
  avatar,
  subscribersText,
  niche,
  thumb,
}: {
  slug: string;
  name: string;
  avatar: string | null;
  subscribersText: string | null;
  niche?: string | null;
  thumb?: { src: string; alt: string } | null;
}) {
  return (
    <Link href={creatorPath(slug)} className={c.card}>
      {thumb && (
        <span className={c.cardThumb}>
          {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail */}
          <img src={thumb.src} alt={thumb.alt} width={480} height={360} loading="lazy" decoding="async" />
        </span>
      )}
      <span className={c.cardBody}>
        <Avatar src={avatar} size={48} className={c.cardAvatar} />
        <span>
          <span className={c.cardName}>{name}</span>
          {subscribersText && <span className={c.cardSubs}>{subscribersText}</span>}
        </span>
      </span>
      {niche && <span className={c.cardNiche}>{niche}</span>}
    </Link>
  );
}
