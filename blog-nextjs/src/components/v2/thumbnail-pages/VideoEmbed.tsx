'use client';

import { useState } from 'react';

import s from './thumbnails.module.css';

/**
 * YouTube video that only loads YouTube when the visitor presses play
 * (keeps the page fast and sets no YouTube cookies before that).
 */
export default function VideoEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className={s.video}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button type="button" className={`${s.video} ${s.videoFacade}`} onClick={() => setPlaying(true)}>
      {/* The video's own YouTube thumbnail; a plain <img> because next/image is not configured for i.ytimg.com. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />
      <span className={s.videoPlay} aria-hidden>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span className={s.srOnly}>Play video: {title}</span>
    </button>
  );
}
