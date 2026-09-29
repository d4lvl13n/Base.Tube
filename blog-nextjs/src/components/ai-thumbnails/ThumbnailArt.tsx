import Image from 'next/image';

/** A 16:9 thumbnail made with AI Thumbnails: its headline is part of the image. */
export default function ThumbnailArt({
  src,
  alt = '',
  className = '',
  sizes,
  lazy = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  /** The width it takes on screen, for the browser to pick the right file. */
  sizes: string;
  /** Below the fold: let the browser load it late. */
  lazy?: boolean;
}) {
  return (
    <div className={`relative aspect-video overflow-hidden bg-zinc-900 ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} loading={lazy ? 'lazy' : 'eager'} decoding="async" className="object-cover" />
    </div>
  );
}
