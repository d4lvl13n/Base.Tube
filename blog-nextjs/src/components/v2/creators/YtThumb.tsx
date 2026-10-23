'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A YouTube thumbnail in high resolution (maxresdefault) that falls back to the standard one
 * (hqdefault) when the video has no HD version. YouTube answers a missing HD thumbnail with a
 * 120 × 90 grey placeholder (or an error), so both cases switch to the fallback.
 */
export default function YtThumb({
  src,
  fallback,
  alt,
  className,
  eager = false,
}: {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [current, setCurrent] = useState(src);
  const ref = useRef<HTMLImageElement>(null);

  const check = () => {
    const img = ref.current;
    if (img && current !== fallback && img.complete && img.naturalWidth > 0 && img.naturalWidth <= 120) setCurrent(fallback);
  };

  // The image may have finished loading before React attached the handlers.
  useEffect(check);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external YouTube CDN image, already sized by YouTube
    <img
      ref={ref}
      src={current}
      alt={alt}
      width={1280}
      height={720}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      onLoad={check}
      onError={() => current !== fallback && setCurrent(fallback)}
    />
  );
}
