/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useEffect, useId, useRef, useState, type ClipboardEvent, type FormEvent } from 'react';
import { fetchVideoInfo } from '../thumbnail-preview/youtube';
import { PREVIEW_URL, STUDIO_GENERATE_URL } from './content';
import { SIZES, fileName, parseVideoInput, thumbUrl, type SizeName, type ThumbSize } from './sizes';
import s from './thumbnail-downloader.module.css';

type SizeState = 'loading' | 'ok' | 'missing';
type Msg = { text: string; tone: 'ok' | 'warn' | 'error' } | null;

const initialStates = (): Record<SizeName, SizeState> =>
  Object.fromEntries(SIZES.map((z) => [z.name, 'loading'])) as Record<SizeName, SizeState>;

export default function DownloaderTool() {
  const uid = useId();
  const inputId = `${uid}-url`;
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;

  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [states, setStates] = useState<Record<SizeName, SizeState>>(initialStates);
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState<SizeName | null>(null);
  const [canPaste, setCanPaste] = useState(false);
  // Bumped on every lookup so the images reload (and re-check) even for the same video.
  const [run, setRun] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanPaste(typeof navigator !== 'undefined' && !!navigator.clipboard?.readText);
  }, []);

  // Look up the title so people can confirm it is the right video. Fails soft.
  useEffect(() => {
    if (!videoId) return;
    const ctrl = new AbortController();
    setTitle('');
    fetchVideoInfo(videoId, ctrl.signal).then((info) => {
      if (info) setTitle(info.title);
    });
    return () => ctrl.abort();
  }, [videoId]);

  const load = useCallback((raw: string) => {
    const id = parseVideoInput(raw);
    if (!id) {
      setError(
        raw.trim()
          ? 'That does not look like a YouTube video link. Paste a link such as youtube.com/watch?v=… or youtu.be/…, or the 11-character video ID.'
          : 'Paste a YouTube video link first.',
      );
      return;
    }
    setError('');
    setMsg(null);
    setStates(initialStates());
    setVideoId(id);
    setRun((n) => n + 1);
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    load(value);
  };

  // A pasted link loads straight away, which saves a tap on a phone.
  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (text && parseVideoInput(text)) {
      e.preventDefault();
      setValue(text.trim());
      load(text);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue(text.trim());
      load(text);
    } catch {
      setError('Your browser did not allow reading the clipboard. Paste into the box instead (Ctrl+V, Cmd+V, or press and hold).');
    }
  };

  // YouTube answers a missing size with a 120×90 grey placeholder, so check the real width.
  const onImgLoad = (size: ThumbSize, img: HTMLImageElement) => {
    const missing = size.name !== 'default' && img.naturalWidth <= 120;
    setStates((prev) => ({ ...prev, [size.name]: missing ? 'missing' : 'ok' }));
  };
  const onImgError = (size: ThumbSize) => setStates((prev) => ({ ...prev, [size.name]: 'missing' }));

  const download = async (size: ThumbSize) => {
    if (!videoId) return;
    const url = thumbUrl(videoId, size.name);
    setBusy(size.name);
    setMsg(null);
    try {
      // i.ytimg.com sends Access-Control-Allow-Origin: *, so the browser can save the file directly.
      const res = await fetch(url, { mode: 'cors', referrerPolicy: 'no-referrer' });
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = fileName(videoId, size);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 10_000);
      setMsg({ text: `Saved ${fileName(videoId, size)}.`, tone: 'ok' });
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
      setMsg({
        text: 'The direct download did not work in this browser, so the image opened in a new tab. Right-click it and choose Save image as. On a phone, press and hold the image and choose Save.',
        tone: 'warn',
      });
    } finally {
      setBusy(null);
    }
  };

  const copyUrl = async (size: ThumbSize) => {
    if (!videoId) return;
    const url = thumbUrl(videoId, size.name);
    try {
      await navigator.clipboard.writeText(url);
      setMsg({ text: `Copied the ${size.width}×${size.height} image link.`, tone: 'ok' });
    } catch {
      setMsg({ text: `Copy did not work in this browser. The link is: ${url}`, tone: 'warn' });
    }
  };

  const reset = () => {
    setVideoId(null);
    setValue('');
    setError('');
    setMsg(null);
    document.getElementById(inputId)?.focus();
  };

  const settled = SIZES.every((z) => states[z.name] !== 'loading');
  const notFound = settled && states.hqdefault === 'missing' && states.mqdefault === 'missing';
  const best = settled && SIZES.find((z) => states[z.name] === 'ok')?.name;
  const missingCount = SIZES.filter((z) => states[z.name] === 'missing').length;

  let summary = '';
  if (videoId && settled) {
    summary = notFound
      ? 'No thumbnail found for this video. Check the link: the video may be private, deleted or mistyped.'
      : `${SIZES.length - missingCount} of ${SIZES.length} sizes available${
          missingCount ? `. YouTube has no ${SIZES.filter((z) => states[z.name] === 'missing').map((z) => `${z.width}×${z.height}`).join(' or ')} version of this video` : ''
        }.`;
  }

  return (
    <div className={s.tool}>
      <form className={s.form} onSubmit={onSubmit} noValidate>
        <label htmlFor={inputId} className={s.label}>
          YouTube video link or ID
        </label>
        <div className={s.inputRow}>
          <input
            id={inputId}
            className={s.input}
            type="text"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            placeholder="https://www.youtube.com/watch?v=…"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            onPaste={onPaste}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${errorId} ${hintId}` : hintId}
          />
          {canPaste ? (
            <button type="button" className={`v2-btn v2-btn-ghost ${s.btn}`} onClick={pasteFromClipboard}>
              Paste
            </button>
          ) : null}
          <button type="submit" className={`v2-btn v2-btn-primary ${s.btn}`}>
            Get thumbnails
          </button>
        </div>
        <p id={hintId} className={s.hint}>
          Works with watch, youtu.be, Shorts, live and embed links, with or without extra parameters.
        </p>
        <p id={errorId} className={s.error} role="alert">
          {error}
        </p>
      </form>

      <div ref={resultsRef} className={s.results} hidden={!videoId}>
        {videoId ? (
          <>
            <div className={s.resultsHead}>
              <div className={s.videoMeta}>
                <span className={s.videoTitle}>{title || 'Video'}</span>
                <span className={s.videoId}>ID {videoId}</span>
              </div>
              <button type="button" className={s.linkBtn} onClick={reset}>
                Try another video
              </button>
            </div>

            <p className={notFound ? s.summaryWarn : s.summary} role="status" aria-live="polite">
              {summary}
            </p>

            {!notFound ? (
              <ul className={s.grid}>
                {SIZES.map((size) => {
                  const state = states[size.name];
                  const url = thumbUrl(videoId, size.name);
                  return (
                    <li
                      key={`${run}-${videoId}-${size.name}`}
                      className={`${s.card} ${size.name === 'maxresdefault' ? s.cardWide : ''}`}
                      data-state={state}
                    >
                      <div className={s.frame} style={{ aspectRatio: `${size.width} / ${size.height}` }}>
                        <img
                          src={url}
                          alt={state === 'missing' ? '' : `Thumbnail at ${size.width}×${size.height}${title ? ` for ${title}` : ''}`}
                          width={size.width}
                          height={size.height}
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onLoad={(e) => onImgLoad(size, e.currentTarget)}
                          onError={() => onImgError(size)}
                        />
                        {state === 'missing' ? (
                          <span className={s.missing}>Not available for this video</span>
                        ) : null}
                      </div>
                      <div className={s.cardBody}>
                        <div className={s.cardHead}>
                          <h3 className={s.cardTitle}>
                            {size.width}×{size.height}
                            <span className={s.cardLabel}>{size.label}</span>
                          </h3>
                          {best === size.name ? <span className={s.badge}>Best available</span> : null}
                        </div>
                        <p className={s.cardNote}>
                          {size.note} <code className={s.code}>{size.name}.jpg</code>
                        </p>
                        {state === 'ok' ? (
                          <div className={s.cardActions}>
                            <button
                              type="button"
                              className={`v2-btn v2-btn-primary ${s.btn}`}
                              onClick={() => download(size)}
                              disabled={busy === size.name}
                              aria-label={`Download ${size.width}×${size.height} JPG`}
                            >
                              {busy === size.name ? 'Saving…' : 'Download'}
                            </button>
                            <button
                              type="button"
                              className={`v2-btn v2-btn-ghost ${s.btn}`}
                              onClick={() => copyUrl(size)}
                              aria-label={`Copy the ${size.width}×${size.height} image link`}
                            >
                              Copy image URL
                            </button>
                          </div>
                        ) : state === 'loading' ? (
                          <p className={s.cardNote}>Checking…</p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            <p className={msg?.tone === 'warn' ? s.msgWarn : s.msgOk} role="status" aria-live="polite">
              {msg?.text ?? ''}
            </p>

            {!notFound && settled ? (
              <div className={s.bridge}>
                <p className={s.bridgeText}>
                  <strong>Want a better one?</strong> Make your own thumbnail from your idea, or see how
                  this one looks at phone size next to other videos.
                </p>
                <div className={s.bridgeLinks}>
                  <a href={STUDIO_GENERATE_URL} className="v2-btn v2-btn-primary">
                    Make your own thumbnail →
                  </a>
                  <a href={PREVIEW_URL} className="v2-btn v2-btn-ghost">
                    Check it at phone size
                  </a>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
