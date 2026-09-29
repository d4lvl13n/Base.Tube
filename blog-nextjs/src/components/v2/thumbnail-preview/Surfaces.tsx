/* eslint-disable @next/next/no-img-element */
import { useState, type ReactNode, type Ref } from 'react';
import s from './thumbnail-preview.module.css';
import { avatarColor } from './youtube';

// Generic recreations of the places a viewer meets a video.
// No YouTube logo or icons are used; the layout proportions follow the real thing.

export type Theme = 'dark' | 'light';
export type SurfaceKind = 'home' | 'search' | 'sidebar' | 'mobile';

export interface FeedVideo {
  key: string;
  title: string;
  channel: string;
  views: string;
  age: string;
  duration: string;
  img: string | null;
  avatar?: string | null;
  mine?: boolean;
}

export const SURFACES: Record<
  SurfaceKind,
  { label: string; count: number; width: number; note: string }
> = {
  home: {
    label: 'Desktop home',
    count: 12,
    width: 1440,
    note: 'Desktop home on a 1440 px wide screen. Thumbnails are 318 × 179 px here.',
  },
  search: {
    label: 'Search results',
    count: 5,
    width: 1440,
    note: 'Search results on a 1440 px wide screen. Thumbnails are 360 × 202 px here.',
  },
  sidebar: {
    label: 'Up next',
    count: 8,
    width: 1440,
    note: 'The up-next list beside a video on a 1440 px wide screen. Thumbnails are only 168 × 94 px here.',
  },
  mobile: {
    label: 'Mobile feed',
    count: 3,
    width: 438,
    note: 'Mobile home feed on a 390 px wide phone. Thumbnails are 366 × 206 px, and the screen is small.',
  },
};

/* ─── Small building blocks ─────────────────────────────── */

function joinMeta(...parts: string[]): string {
  return parts.filter((part) => part.trim()).join(' • ');
}

function Icon({ children, size = 24 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const Menu = () => (
  <Icon>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Icon>
);
const SearchIcon = ({ size = 20 }: { size?: number }) => (
  <Icon size={size}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </Icon>
);
const Kebab = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <circle cx="12" cy="5" r="1.7" />
    <circle cx="12" cy="12" r="1.7" />
    <circle cx="12" cy="19" r="1.7" />
  </svg>
);
const HomeIcon = () => (
  <Icon>
    <path d="M4 11l8-7 8 7v9H4z" />
  </Icon>
);
const CompassIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </Icon>
);
const StackIcon = () => (
  <Icon>
    <rect x="4" y="9" width="16" height="11" rx="2" />
    <path d="M7 5h10" />
  </Icon>
);
const FolderIcon = () => (
  <Icon>
    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </Icon>
);
const BellIcon = () => (
  <Icon>
    <path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15z" />
    <path d="M10 20a2 2 0 004 0" />
  </Icon>
);

function Avatar({ video, size }: { video: FeedVideo; size: number }) {
  const name = video.channel || 'C';
  return (
    <span
      className={s.avatar}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.46),
        background: video.avatar ? 'transparent' : avatarColor(name),
      }}
    >
      {video.avatar ? (
        <img src={video.avatar} alt="" draggable={false} />
      ) : (
        name.trim().charAt(0).toUpperCase()
      )}
    </span>
  );
}

function Thumb({
  video,
  showDuration,
  outline,
  className,
}: {
  video: FeedVideo;
  showDuration: boolean;
  outline: boolean;
  className: string;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  const broken = failed !== null && failed === video.img;
  const remote = video.img?.startsWith('http');
  return (
    <div className={`${s.thumb} ${className} ${video.mine && outline ? s.mine : ''}`}>
      {video.img && !broken ? (
        <img
          src={video.img}
          alt={video.mine ? 'Your thumbnail' : ''}
          draggable={false}
          crossOrigin={remote ? 'anonymous' : undefined}
          referrerPolicy="no-referrer"
          onError={() => setFailed(video.img)}
        />
      ) : (
        <span className={s.thumbEmpty}>{video.mine ? 'Your thumbnail' : 'Thumbnail unavailable'}</span>
      )}
      {showDuration && video.duration ? <span className={s.dur}>{video.duration}</span> : null}
    </div>
  );
}

function TopBar({ query }: { query?: string }) {
  return (
    <div className={s.top}>
      <div className={s.topL}>
        <Menu />
      </div>
      <div className={s.searchBox}>
        <span className={query ? s.query : s.placeholder}>{query || 'Search'}</span>
        <SearchIcon />
      </div>
      <div className={s.topR}>
        <BellIcon />
        <span className={s.meDot} />
      </div>
    </div>
  );
}

function Rail() {
  const items: [string, ReactNode][] = [
    ['Home', <HomeIcon key="h" />],
    ['Explore', <CompassIcon key="e" />],
    ['Following', <StackIcon key="f" />],
    ['Library', <FolderIcon key="l" />],
  ];
  return (
    <div className={s.rail}>
      {items.map(([label, icon]) => (
        <div key={label} className={s.railItem}>
          {icon}
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Chips({ labels, className }: { labels: string[]; className?: string }) {
  return (
    <div className={`${s.chips} ${className ?? ''}`}>
      {labels.map((label, i) => (
        <span key={label} className={`${s.chip} ${i === 0 ? s.chipOn : ''}`}>
          {label}
        </span>
      ))}
    </div>
  );
}

const CHIPS = ['All', 'Music', 'Gaming', 'Live', 'Podcasts', 'Cooking', 'Recently uploaded', 'Watched'];

interface SurfaceProps {
  kind: SurfaceKind;
  theme: Theme;
  videos: FeedVideo[];
  showDuration: boolean;
  outline: boolean;
  query: string;
  innerRef: Ref<HTMLDivElement>;
}

/* ─── The four surfaces ─────────────────────────────────── */

export function Surface({ kind, theme, videos, showDuration, outline, query, innerRef }: SurfaceProps) {
  const width = SURFACES[kind].width;
  const common = { 'data-theme': theme, 'data-kind': kind, style: { width } } as const;

  if (kind === 'home') {
    return (
      <div ref={innerRef} className={s.mock} {...common}>
        <TopBar />
        <div className={s.homeBody}>
          <Rail />
          <div className={s.homeMain}>
            <Chips labels={CHIPS} />
            <div className={s.grid}>
              {videos.map((v) => (
                <div key={v.key} className={s.card}>
                  <Thumb video={v} showDuration={showDuration} outline={outline} className={s.cardThumb} />
                  <div className={s.cardMeta}>
                    <Avatar video={v} size={36} />
                    <div className={s.cardText}>
                      <div className={s.cardTitle}>{v.title}</div>
                      <div className={s.sub}>{v.channel}</div>
                      <div className={s.sub}>{joinMeta(v.views, v.age)}</div>
                    </div>
                    <span className={s.kebab}>
                      <Kebab />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'search') {
    return (
      <div ref={innerRef} className={s.mock} {...common}>
        <TopBar query={query} />
        <div className={s.homeBody}>
          <Rail />
          <div className={s.results}>
            <Chips labels={['All', 'Videos', 'Unwatched', 'Recently uploaded', 'Live']} />
            {videos.map((v) => (
              <div key={v.key} className={s.row}>
                <Thumb video={v} showDuration={showDuration} outline={outline} className={s.rowThumb} />
                <div className={s.rowText}>
                  <div className={s.rowTitle}>{v.title}</div>
                  <div className={s.sub}>{joinMeta(v.views, v.age)}</div>
                  <div className={s.rowChannel}>
                    <Avatar video={v} size={24} />
                    <span>{v.channel}</span>
                  </div>
                </div>
                <span className={s.kebab}>
                  <Kebab />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'sidebar') {
    return (
      <div ref={innerRef} className={s.mock} {...common}>
        <TopBar />
        <div className={s.watch}>
          <div className={s.primary}>
            <div className={s.player}>
              <span className={s.playGlyph}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className={s.progress}>
                <span />
              </span>
            </div>
            <div className={s.skel} style={{ width: '62%', height: 24, marginTop: 16 }} />
            <div className={s.skelRow}>
              <span className={s.skelDot} />
              <span className={s.skelCol}>
                <span className={s.skel} style={{ width: 180, height: 14 }} />
                <span className={s.skel} style={{ width: 110, height: 12 }} />
              </span>
            </div>
            <div className={s.skel} style={{ width: '100%', height: 84, marginTop: 16, borderRadius: 12 }} />
          </div>
          <div className={s.secondary}>
            <Chips labels={['All', 'From this channel', 'Related']} className={s.sideChips} />
            {videos.map((v) => (
              <div key={v.key} className={s.side}>
                <Thumb video={v} showDuration={showDuration} outline={outline} className={s.sideThumb} />
                <div className={s.sideText}>
                  <div className={s.sideTitle}>{v.title}</div>
                  <div className={s.sideSub}>{v.channel}</div>
                  <div className={s.sideSub}>{joinMeta(v.views, v.age)}</div>
                </div>
                <span className={s.kebabSm}>
                  <Kebab />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // mobile
  return (
    <div ref={innerRef} className={s.mock} {...common}>
      <div className={s.phone}>
        <div className={s.screen}>
          <div className={s.mStatus}>
            <span>9:41</span>
            <span className={s.mStatusIcons}>
              <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
                <rect x="0" y="8" width="3" height="4" rx="1" />
                <rect x="5" y="5" width="3" height="7" rx="1" />
                <rect x="10" y="2" width="3" height="10" rx="1" />
                <rect x="15" y="0" width="3" height="12" rx="1" />
              </svg>
              <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden>
                <rect x="0.5" y="0.5" width="22" height="11" rx="3.5" stroke="currentColor" opacity="0.5" />
                <rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" />
                <rect x="24" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.5" />
              </svg>
            </span>
          </div>
          <div className={s.mTop}>
            <span className={s.mTopIcons}>
              <BellIcon />
              <SearchIcon size={24} />
              <span className={s.meDot} />
            </span>
          </div>
          <Chips labels={CHIPS} className={s.mChips} />
          {videos.map((v) => (
            <div key={v.key} className={s.mCard}>
              <Thumb video={v} showDuration={showDuration} outline={outline} className={s.mThumb} />
              <div className={s.mMeta}>
                <Avatar video={v} size={36} />
                <div className={s.mText}>
                  <div className={s.mTitle}>{v.title}</div>
                  <div className={s.mSub}>{joinMeta(v.channel, v.views, v.age)}</div>
                </div>
                <span className={s.kebab}>
                  <Kebab />
                </span>
              </div>
            </div>
          ))}
          <div className={s.mNav}>
            {[
              ['Home', <HomeIcon key="h" />],
              ['Explore', <CompassIcon key="e" />],
              ['Following', <StackIcon key="f" />],
              ['Library', <FolderIcon key="l" />],
            ].map(([label, icon]) => (
              <div key={label as string} className={s.mNavItem}>
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
