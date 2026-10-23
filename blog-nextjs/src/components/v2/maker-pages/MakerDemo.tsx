'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { studioPromptUrl } from '../thumbnail-pages/lib/studio-link.mjs';
import m from './maker.module.css';

export interface DemoIdea {
  label: string;
  idea: string;
  src: string;
  alt: string;
  /** Studio link with this idea. */
  href: string;
}

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const;
const TYPE_MS = 28;
const GENERATE_MS = 1100;
const HOLD_MS = 4200;

type Phase = 'typing' | 'generating' | 'done';

/**
 * The maker demo: a Studio window where an idea is typed and the thumbnail Base.Tube made from it
 * appears. It plays on its own while in view; a chip shows that idea; typing your own idea and
 * pressing Generate opens the Studio with it. The server's HTML shows the first idea finished,
 * so every word and the image are in the page without JavaScript.
 */
export default function MakerDemo({ ideas, ownRef, gameName }: { ideas: DemoIdea[]; ownRef: string; gameName: string }) {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>('done');
  const [typed, setTyped] = useState(ideas[0]?.idea ?? '');
  const [own, setOwn] = useState<string | null>(null);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const [reduce, setReduce] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = root.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // One run: type the idea, "generate", show the result.
  useEffect(() => {
    if (phase !== 'typing') return undefined;
    const text = ideas[active].idea;
    if (reduce) {
      setTyped(text);
      setPhase('done');
      return undefined;
    }
    let i = 0;
    setTyped('');
    const t = window.setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(t);
        setPhase('generating');
      }
    }, TYPE_MS);
    return () => window.clearInterval(t);
  }, [phase, active, ideas, reduce]);

  useEffect(() => {
    if (phase !== 'generating') return undefined;
    const t = window.setTimeout(() => setPhase('done'), GENERATE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Autoplay: next idea after a pause, while in view and until the visitor takes over.
  useEffect(() => {
    if (!auto || !inView || reduce || phase !== 'done') return undefined;
    const t = window.setTimeout(() => {
      setActive((a) => (a + 1) % ideas.length);
      setPhase('typing');
    }, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [auto, inView, reduce, phase, ideas.length]);

  const pick = (i: number) => {
    setAuto(false);
    setOwn(null);
    setActive(i);
    setPhase('typing');
  };

  const current = ideas[active];
  const inputValue = own ?? typed;
  const shown = phase === 'done' ? active : null;
  const goHref = own?.trim() ? studioPromptUrl(own, ownRef) : current.href;

  return (
    <div ref={root} className={m.demo}>
      <div className={m.window}>
        <div className={m.windowBar}>
          <span aria-hidden />
          <span aria-hidden />
          <span aria-hidden />
          <span className={m.windowTitle}>AI Thumbnails Studio · {gameName}</span>
        </div>

        <form
          className={m.inputRow}
          onSubmit={(e) => {
            e.preventDefault();
            window.open(goHref, '_blank', 'noopener,noreferrer');
          }}
        >
          <label htmlFor="maker-idea" className={m.inputLabel}>
            Your video
          </label>
          <input
            id="maker-idea"
            className={`${m.input} ${phase === 'typing' && own === null ? m.caret : ''}`}
            value={inputValue}
            placeholder={`Describe your ${gameName} video in one line`}
            onFocus={() => {
              setAuto(false);
              if (own === null) setOwn('');
            }}
            onChange={(e) => setOwn(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className={m.generate}>
            Generate <span aria-hidden>→</span>
            <span className={m.srOnly}> (opens the Base.Tube Studio with your idea, in a new tab)</span>
          </button>
        </form>

        <div className={m.chips}>
          <span className={m.chipsLabel} id="maker-chips-label">
            Try an idea
          </span>
          <ul aria-labelledby="maker-chips-label">
            {ideas.map((it, i) => (
              <li key={it.src}>
                <button type="button" className={`${m.chip} ${i === active && own === null ? m.chipOn : ''}`} aria-pressed={i === active && own === null} onClick={() => pick(i)}>
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={m.stage} aria-live="polite">
          {ideas.map((it, i) => (
            <span key={it.src} className={`${m.result} ${shown === i ? m.resultOn : ''}`} aria-hidden={shown !== i}>
              <Image src={it.src} alt={it.alt} fill priority={i === 0} sizes="(max-width: 980px) 100vw, 900px" className={m.resultImg} />
            </span>
          ))}
          {phase !== 'done' && (
            <span className={m.loading}>
              <span className={m.loadingDot} aria-hidden />
              {phase === 'typing' ? 'Reading your idea…' : `Making your ${gameName} thumbnail…`}
            </span>
          )}
        </div>

        <div className={m.resultBar}>
          <p className={m.resultCaption}>
            {phase === 'done' ? (
              <>
                <span className={m.ok} aria-hidden>
                  ✓
                </span>{' '}
                Made with Base.Tube. In the Studio you get three ideas per video.
              </>
            ) : (
              'Generating…'
            )}
          </p>
          <a className={m.resultCta} href={current.href} {...NEW_TAB}>
            Make one like this <span aria-hidden>→</span>
            <span className={m.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
