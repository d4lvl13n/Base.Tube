'use client';

// A client component only so its 150-odd images are not described twice in the page (HTML and
// React payload); it has no state and renders the same on the server.
import { getImageProps } from 'next/image';
import { EXAMPLE_THUMBNAILS, type ExampleThumbnail } from './content';

function rotate<T>(list: readonly T[], by: number): T[] {
  return [...list.slice(by), ...list.slice(0, by)];
}

/**
 * The wall of thumbnails drifting on a tilted plane (behind the final call to action).
 * Each row is its set twice so the loop is seamless; decorative, hidden from screen readers.
 */
export default function ThumbnailWall({ rows = 4, lazy = false, className = '' }: { rows?: number; lazy?: boolean; className?: string }) {
  const lines: ExampleThumbnail[][] = Array.from({ length: rows }, (_, row) => rotate(EXAMPLE_THUMBNAILS, (row * 5) % EXAMPLE_THUMBNAILS.length));
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="lp-wall-plane absolute inset-x-[-20%] top-[-10%] flex flex-col gap-4">
        {lines.map((line, row) => (
          <div key={row} className={`lp-drift ${row % 2 ? 'lp-reverse' : ''}`} style={{ ['--lp-drift' as string]: `${110 + row * 18}s` }}>
            {[...line, ...line].map((thumb, index) => {
              const { props: image } = getImageProps({
                src: thumb.src,
                alt: '',
                width: 340,
                height: 191,
                loading: lazy ? 'lazy' : 'eager',
                decoding: 'async',
              });
              return (
                <div key={`${row}-${index}`} className="relative mr-4 aspect-video w-[300px] shrink-0 overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 sm:w-[340px]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- next/image's getImageProps: an optimized <img> without a client component per thumbnail */}
                  <img {...image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
