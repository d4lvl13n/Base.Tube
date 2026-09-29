'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type TouchEvent } from 'react';

import s from './thumbnails.module.css';

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  prompt: string;
  notes: string;
  layout: string;
  /** Link into the Studio for "Generate in this style" */
  studioHref: string;
}

interface GalleryProps {
  items: GalleryItem[];
  /** Images shown before the "Show all" button (only when the gallery is long) */
  initial: number;
  /** e.g. "Generate in this style" */
  ctaLabel: string;
}

/**
 * 16:9 thumbnail grid + keyboard-accessible lightbox (native <dialog>).
 * All images are in the server-rendered HTML (good for image search); the
 * extra ones of a long gallery are hidden until "Show all" is pressed.
 */
export default function Gallery({ items, initial, ctaLabel }: GalleryProps) {
  const collapsible = items.length > initial + 6;
  const [expanded, setExpanded] = useState(!collapsible);
  const [open, setOpen] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchX = useRef<number | null>(null);

  const count = items.length;
  const current = open === null ? null : items[open];

  const show = useCallback((i: number, trigger: HTMLElement | null) => {
    triggerRef.current = trigger;
    setCopied(false);
    setOpen(i);
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      setCopied(false);
      setOpen((o) => (o === null ? o : (o + dir + count) % count));
    },
    [count],
  );

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open !== null && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = 'hidden';
      closeRef.current?.focus();
    }
  }, [open]);

  const onDialogClose = () => {
    document.documentElement.style.overflow = '';
    const idx = open;
    setOpen(null);
    // return focus to the tile of the image that was showing (or the one that opened the viewer)
    const tile = idx !== null ? tileRefs.current[idx] : null;
    const target = tile && !tile.closest('[hidden]') ? tile : triggerRef.current;
    target?.focus();
  };

  const close = () => dialogRef.current?.close();

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  // a click on the dark area around the image (not on a control) closes the viewer
  const onDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
    const t = e.target as HTMLElement;
    if (t === e.currentTarget || t.dataset.dismiss === 'true') close();
  };

  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  const copyPrompt = async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current.prompt);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const expand = () => {
    setExpanded(true);
    // move focus to the first image that just appeared
    requestAnimationFrame(() => tileRefs.current[initial]?.focus());
  };

  useEffect(() => () => {
    document.documentElement.style.overflow = '';
  }, []);

  return (
    <>
      <ul className={s.grid}>
        {items.map((it, i) => (
          <li key={it.src} className={s.tile} hidden={!expanded && i >= initial}>
            <figure className={s.tileFigure}>
              <button
                type="button"
                ref={(el) => {
                  tileRefs.current[i] = el;
                }}
                className={s.tileButton}
                onClick={(e) => show(i, e.currentTarget)}
                aria-haspopup="dialog"
              >
                <span className={s.tileMedia}>
                  <Image
                    src={it.src}
                    alt={it.alt}
                    fill
                    sizes="(max-width: 560px) 50vw, (max-width: 900px) 45vw, 340px"
                    className={s.tileImg}
                  />
                </span>
                <span className={s.srOnly}>Open larger view</span>
              </button>
              <figcaption className={s.tileCaption}>
                <span className={s.tileIndex} aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {it.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {!expanded && (
        <div className={s.moreRow}>
          <button type="button" className="v2-btn v2-btn-ghost" onClick={expand}>
            Show all {count} examples
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        className={s.lightbox}
        aria-label="Example viewer"
        onClose={onDialogClose}
        onClick={onDialogClick}
        onKeyDown={onKeyDown}
      >
        {current && open !== null && (
          <div className={s.lbInner} data-dismiss="true" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className={s.lbTop}>
              <span className={s.lbCount} aria-live="polite">
                Example {open + 1} of {count}
              </span>
              <button ref={closeRef} type="button" className={s.lbClose} onClick={close}>
                <span aria-hidden>✕</span>
                <span className={s.srOnly}>Close</span>
              </button>
            </div>

            <div className={s.lbStage} data-dismiss="true">
              <button type="button" className={`${s.lbNav} ${s.lbPrev}`} onClick={() => step(-1)} aria-label="Previous example">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className={s.lbImage}>
                <Image key={current.src} src={current.src} alt={current.alt} fill sizes="(max-width: 900px) 100vw, 1100px" priority />
              </div>
              <button type="button" className={`${s.lbNav} ${s.lbNext}`} onClick={() => step(1)} aria-label="Next example">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className={s.lbMeta}>
              <div className={s.lbText}>
                <p className={s.lbCaption}>{current.caption}</p>
                {current.layout && <p className={s.lbLayout}>Layout: {current.layout}</p>}
                {current.notes && <p className={s.lbNotes}>{current.notes}</p>}
              </div>
              <div className={s.lbPrompt}>
                <span className={s.lbPromptLabel}>Prompt</span>
                <button type="button" className={s.lbCopy} onClick={copyPrompt} aria-live="polite">
                  {copied ? 'Copied' : 'Copy prompt'}
                </button>
                <p className={s.lbPromptText}>{current.prompt}</p>
              </div>
              <a className="v2-btn v2-btn-primary" href={current.studioHref} target="_blank" rel="noopener noreferrer">
                {ctaLabel} <span aria-hidden>→</span>
                <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
