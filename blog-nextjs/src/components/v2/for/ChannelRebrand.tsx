'use client';

import Image from 'next/image';
import { useState } from 'react';

import { archivo } from '@/components/ai-thumbnails/fonts';
import { LOGO_SRC } from '@/components/ai-thumbnails/content';

import type { ForChannel } from './content';
import f from './for.module.css';

type View = 'after' | 'before';

const TABS = ['Home', 'Videos', 'Shorts', 'Playlists'];

/**
 * A creator's private page: a mock of their channel's Videos tab, showing the same videos with their
 * current thumbnails or the new consistent style. One switch, so it can be judged in two seconds on a
 * phone. No views, no dates, no numbers about clicks: only what the JSON file gives.
 */
export default function ChannelRebrand({
  page,
  href,
  terms,
  monthly,
}: {
  page: ForChannel;
  href: string;
  terms: string | null;
  monthly: { href: string; label: string } | null;
}) {
  const [view, setView] = useState<View>('after');
  const option = (value: View, label: string) => (
    <button type="button" aria-pressed={view === value} onClick={() => setView(value)} className={`${f.option} ${view === value ? f.optionOn : ''}`}>
      {label}
    </button>
  );

  return (
    <div className={`${archivo.variable} ${f.page}`}>
      <div className={f.inner}>
        <div className={f.brand}>
          <Image src={LOGO_SRC} alt="" width={28} height={28} />
          <span className={f.wordmark}>Base.Tube</span>
          <span className={f.product}>AI Thumbnails</span>
        </div>

        <header className={f.head}>
          <p className={f.eyebrow}>For {page.channelName}</p>
          <h1 className={f.title}>Your channel, rebranded.</h1>
          <p className={f.idea}>{page.styleIdea}</p>
        </header>

        <div role="group" aria-label="Which thumbnails to show" className={f.switch}>
          {option('before', 'Your thumbnails today')}
          {option('after', 'New style')}
        </div>

        <section className={f.channel} aria-label={`${page.channelName}'s Videos tab`}>
          <div className={f.channelHead}>
            <Image src={page.avatar} alt="" width={72} height={72} className={f.avatar} />
            <div className={f.channelText}>
              <h2 className={f.channelName}>{page.channelName}</h2>
              <p className={f.channelMeta}>
                <a href={page.channelUrl} target="_blank" rel="noopener noreferrer">
                  {page.handle}
                </a>{' '}
                · {page.subscribersLabel}
              </p>
            </div>
          </div>
          <div className={f.tabs} aria-hidden>
            {TABS.map((tab) => (
              <span key={tab} className={tab === 'Videos' ? f.tabOn : undefined}>
                {tab}
              </span>
            ))}
          </div>
          <ul className={f.grid}>
            {page.videos.map((video, i) => (
              <li key={video.after}>
                <span className={f.thumb}>
                  <Image
                    src={video.before}
                    alt={view === 'before' ? `Current thumbnail: ${video.title}` : ''}
                    fill
                    sizes="(max-width: 700px) 50vw, 340px"
                    priority={i < 2}
                    className={view === 'before' ? f.imgOn : f.imgOff}
                  />
                  <Image
                    src={video.after}
                    alt={view === 'after' ? `New style: ${video.title}` : ''}
                    fill
                    sizes="(max-width: 700px) 50vw, 340px"
                    priority={i < 2}
                    className={view === 'after' ? f.imgOn : f.imgOff}
                  />
                </span>
                <p className={f.videoTitle}>{video.title}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className={f.action}>
          <a href={href} className={f.button}>
            Get these thumbnails
          </a>
          {terms && <p className={f.terms}>{terms}</p>}
          {monthly && (
            <p className={f.monthly}>
              <a href={monthly.href}>{monthly.label}</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
