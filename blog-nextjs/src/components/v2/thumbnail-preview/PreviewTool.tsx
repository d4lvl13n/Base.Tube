/* eslint-disable @next/next/no-img-element */
'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import s from './thumbnail-preview.module.css';
import { Surface, SURFACES, type FeedVideo, type SurfaceKind, type Theme } from './Surfaces';
import { FILLERS } from './fillers';
import { downloadBlob, renderToPng } from './exportImage';
import {
  MAX_RIVALS,
  avatarColor,
  extractYouTubeIds,
  fakeStats,
  fetchVideoInfo,
  thumbnailUrl,
} from './youtube';

const SAMPLE_IMG = '/images/thumbnail-preview/sample-thumbnail.jpg';
const SURFACE_ORDER: SurfaceKind[] = ['home', 'search', 'sidebar', 'mobile'];

interface Rival {
  id: string;
  title: string;
  channel: string;
  titleEdited: boolean;
  channelEdited: boolean;
}

type NoticeSpot = 'thumb' | 'rivals' | 'export';

interface Notice {
  where: NoticeSpot;
  text: string;
  warn?: boolean;
}

type Positions = Record<SurfaceKind, number>;

const START_POSITIONS: Positions = { home: 1, search: 1, sidebar: 1, mobile: 1 };

function seededShuffle<T>(items: T[], seed: number): T[] {
  const out = items.slice();
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function revoke(url: string | null) {
  if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
}

/* ─── Stage: draws the mockup at real size and scales it to fit ─── */

function Stage({
  designWidth,
  fit,
  label,
  background,
  children,
}: {
  designWidth: number;
  fit: boolean;
  label: string;
  background?: string;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [avail, setAvail] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const measure = () => {
      setAvail(wrap.clientWidth);
      setHeight(inner.offsetHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  const scale = fit && avail > 0 ? Math.min(1, avail / designWidth) : 1;

  return (
    <div
      ref={wrapRef}
      className={s.stageWrap}
      data-fit={fit}
      style={background ? { background } : undefined}
      role="img"
      aria-label={label}
      tabIndex={fit ? undefined : 0}
    >
      <div className={s.sizer} style={{ width: designWidth * scale, height: height * scale }}>
        <div
          ref={innerRef}
          className={s.scaler}
          style={{ width: designWidth, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── The tool ─────────────────────────────────────────────── */

export default function PreviewTool() {
  const uid = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const mockRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<SurfaceKind, HTMLButtonElement | null>>>({});
  const thumbRef = useRef<string | null>(SAMPLE_IMG);
  const avatarRef = useRef<string | null>(null);

  // Your video
  const [thumb, setThumb] = useState<string | null>(SAMPLE_IMG);
  const [isSample, setIsSample] = useState(true);
  const [title, setTitle] = useState('We waited twelve years for this. Was it worth it?');
  const [channel, setChannel] = useState('Your Channel');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [views, setViews] = useState('12K views');
  const [age, setAge] = useState('2 days ago');
  const [duration, setDuration] = useState('12:48');
  const [dragging, setDragging] = useState(false);

  // The feed around it
  const [rivals, setRivals] = useState<Rival[]>([]);
  const [rivalText, setRivalText] = useState('');
  const [fillSamples, setFillSamples] = useState(true);
  const [positions, setPositions] = useState<Positions>(START_POSITIONS);
  const [orderSeed, setOrderSeed] = useState(0);

  // View options
  const [surface, setSurface] = useState<SurfaceKind>('home');
  const [theme, setTheme] = useState<Theme>('dark');
  const [showDuration, setShowDuration] = useState(true);
  const [outline, setOutline] = useState(false);
  const [fit, setFit] = useState(true);

  const [notice, setNotice] = useState<Notice | null>(null);
  const [busy, setBusy] = useState(false);

  // On a phone, start with the phone view: the desktop mockups are too wide to read there.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)');
    setNarrow(query.matches);
    if (query.matches) setSurface('mobile');
    const onChange = (event: MediaQueryListEvent) => setNarrow(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(
    () => () => {
      revoke(thumbRef.current);
      revoke(avatarRef.current);
    },
    [],
  );

  /* ── Images ── */

  const loadImage = useCallback((file: File | undefined, target: 'thumb' | 'avatar') => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setNotice({
        where: 'thumb',
        text: 'That file is not an image. Choose a JPG, PNG, WebP or GIF.',
        warn: true,
      });
      return;
    }
    const url = URL.createObjectURL(file);
    if (target === 'thumb') {
      revoke(thumbRef.current);
      thumbRef.current = url;
      setThumb(url);
      setIsSample(false);
    } else {
      revoke(avatarRef.current);
      avatarRef.current = url;
      setAvatar(url);
    }
    setNotice(null);
  }, []);

  const resetToSample = () => {
    revoke(thumbRef.current);
    thumbRef.current = SAMPLE_IMG;
    setThumb(SAMPLE_IMG);
    setIsSample(true);
  };

  const removeAvatar = () => {
    revoke(avatarRef.current);
    avatarRef.current = null;
    setAvatar(null);
  };

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find((f) =>
        f.type.startsWith('image/'),
      );
      if (file) {
        event.preventDefault();
        loadImage(file, 'thumb');
      }
    };
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [loadImage]);

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    loadImage(event.dataTransfer.files?.[0], 'thumb');
  };

  const onPick = (event: ChangeEvent<HTMLInputElement>, target: 'thumb' | 'avatar') => {
    loadImage(event.target.files?.[0], target);
    event.target.value = '';
  };

  /* ── Videos around yours ── */

  const addRivals = (text: string) => {
    const { ids, invalid } = extractYouTubeIds(text);
    if (ids.length === 0) {
      setNotice({
        where: 'rivals',
        text: invalid ? 'That does not look like a YouTube video link.' : 'Paste a YouTube video link first.',
        warn: true,
      });
      return;
    }
    const known = new Set(rivals.map((r) => r.id));
    const fresh = ids.filter((id) => !known.has(id));
    const room = MAX_RIVALS - rivals.length;
    const take = fresh.slice(0, Math.max(0, room));

    if (take.length === 0) {
      setNotice({
        where: 'rivals',
        text: room <= 0 ? `You can add up to ${MAX_RIVALS} videos.` : 'Those videos are already added.',
        warn: true,
      });
      return;
    }

    setRivals((prev) => [
      ...prev,
      ...take.map((id) => ({
        id,
        title: 'Untitled video',
        channel: 'Channel name',
        titleEdited: false,
        channelEdited: false,
      })),
    ]);
    setRivalText('');
    const skipped = fresh.length - take.length + invalid;
    setNotice({
      where: 'rivals',
      text:
        `Added ${take.length} video${take.length === 1 ? '' : 's'}.` +
        (skipped > 0 ? ` ${skipped} could not be added (invalid link or limit reached).` : ''),
    });

    take.forEach((id) => {
      fetchVideoInfo(id).then((info) => {
        if (!info) return;
        setRivals((prev) =>
          prev.map((r) =>
            r.id !== id
              ? r
              : {
                  ...r,
                  title: r.titleEdited ? r.title : info.title,
                  channel: r.channelEdited || !info.channel ? r.channel : info.channel,
                },
          ),
        );
      });
    });
  };

  const editRival = (id: string, field: 'title' | 'channel', value: string) => {
    setRivals((prev) =>
      prev.map((r) =>
        r.id !== id
          ? r
          : field === 'title'
            ? { ...r, title: value, titleEdited: true }
            : { ...r, channel: value, channelEdited: true },
      ),
    );
  };

  const shuffle = () => {
    const pick = (max: number, current: number) => {
      if (max <= 1) return 0;
      let next = current;
      while (next === current) next = Math.floor(Math.random() * max);
      return next;
    };
    setOrderSeed(Math.floor(Math.random() * 1_000_000) + 1);
    setPositions((prev) => ({
      home: pick(SURFACES.home.count, prev.home),
      search: pick(SURFACES.search.count, prev.search),
      sidebar: pick(SURFACES.sidebar.count, prev.sidebar),
      mobile: pick(2, prev.mobile),
    }));
  };

  /* ── The feed for the current surface ── */

  const mine: FeedVideo = useMemo(
    () => ({
      key: 'mine',
      mine: true,
      title: title.trim() || 'Your video title',
      channel: channel.trim() || 'Your channel',
      views: views.trim(),
      age: age.trim(),
      duration: duration.trim(),
      img: thumb,
      avatar,
    }),
    [title, channel, views, age, duration, thumb, avatar],
  );

  const rivalVideos: FeedVideo[] = useMemo(
    () =>
      rivals.map((r) => ({
        key: r.id,
        title: r.title.trim() || 'Untitled video',
        channel: r.channel.trim() || 'Channel name',
        ...fakeStats(r.id),
        img: thumbnailUrl(r.id),
      })),
    [rivals],
  );

  const feed = useMemo(() => {
    const count = SURFACES[surface].count;
    const pool: FeedVideo[] = [...rivalVideos, ...(fillSamples ? FILLERS : [])].slice(0, count - 1);
    const ordered = orderSeed ? seededShuffle(pool, orderSeed + count) : pool;
    const at = Math.min(positions[surface], ordered.length);
    return [...ordered.slice(0, at), mine, ...ordered.slice(at)];
  }, [surface, rivalVideos, fillSamples, orderSeed, positions, mine]);

  const query = useMemo(
    () =>
      title
        .replace(/[^\p{L}\p{N}\s'-]/gu, '')
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .join(' ')
        .toLowerCase(),
    [title],
  );

  /* ── Export ── */

  const download = async () => {
    const node = mockRef.current;
    if (!node || busy) return;
    setBusy(true);
    setNotice({ where: 'export', text: 'Preparing your image…' });
    try {
      const scale = SURFACES[surface].width > 1000 ? 2 : 3;
      const { blob, skipped } = await renderToPng(node, scale);
      downloadBlob(blob, `youtube-thumbnail-preview-${surface}-${theme}.png`);
      setNotice(
        skipped > 0
          ? {
              where: 'export',
              text: `Image saved. ${skipped} thumbnail${skipped === 1 ? '' : 's'} could not be included and appear grey.`,
              warn: true,
            }
          : { where: 'export', text: 'Image saved to your downloads.' },
      );
    } catch {
      setNotice({
        where: 'export',
        text: 'This browser could not create the image. Taking a screenshot of the preview works instead.',
        warn: true,
      });
    } finally {
      setBusy(false);
    }
  };

  /* ── Keyboard for the view tabs ── */

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const i = SURFACE_ORDER.indexOf(surface);
    let next = i;
    if (event.key === 'ArrowRight') next = (i + 1) % SURFACE_ORDER.length;
    else if (event.key === 'ArrowLeft') next = (i - 1 + SURFACE_ORDER.length) % SURFACE_ORDER.length;
    else return;
    event.preventDefault();
    setSurface(SURFACE_ORDER[next]);
    tabRefs.current[SURFACE_ORDER[next]]?.focus();
  };

  // A live region per place, so a message shows up next to the control that caused it.
  const noticeLine = (where: NoticeSpot) => (
    <p
      className={`${s.status} ${notice?.where === where && notice.warn ? s.statusWarn : ''}`}
      role="status"
      aria-live="polite"
    >
      {notice?.where === where ? notice.text : ''}
    </p>
  );

  const ids = {
    file: `${uid}-file`,
    title: `${uid}-title`,
    channel: `${uid}-channel`,
    views: `${uid}-views`,
    age: `${uid}-age`,
    duration: `${uid}-duration`,
    avatar: `${uid}-avatar`,
    links: `${uid}-links`,
    panel: `${uid}-panel`,
  };

  return (
    <div className={s.wide}>
      <div className={s.panel}>
        {/* 1 — thumbnail */}
        <div className={s.col}>
          <div className={s.colHead}>1 · Your thumbnail</div>
          <div
            className={s.dz}
            data-drag={dragging}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <div className={s.dzPreview}>
              {thumb ? (
                <img src={thumb} alt="Your thumbnail" draggable={false} />
              ) : (
                <span className={s.dzEmpty}>Drop an image here</span>
              )}
              {isSample ? <span className={s.dzTag}>Sample</span> : null}
            </div>
            <div className={s.actions}>
              <button
                type="button"
                className={`v2-btn v2-btn-primary ${s.sm}`}
                onClick={() => fileRef.current?.click()}
              >
                Choose image
              </button>
              {!isSample ? (
                <button type="button" className={`v2-btn v2-btn-ghost ${s.smGhost}`} onClick={resetToSample}>
                  Use sample
                </button>
              ) : null}
            </div>
            <p className={s.hint}>
              Drop an image, or paste one from your clipboard (Ctrl+V or Cmd+V).{' '}
              <strong>It stays in your browser. Nothing is uploaded.</strong>
            </p>
            {noticeLine('thumb')}
            <input
              ref={fileRef}
              id={ids.file}
              type="file"
              accept="image/*"
              tabIndex={-1}
              className={s.srOnly}
              aria-label="Thumbnail image file"
              onChange={(e) => onPick(e, 'thumb')}
            />
          </div>
        </div>

        {/* 2 — title and channel */}
        <div className={s.col}>
          <div className={s.colHead}>2 · Title and channel</div>
          <div className={s.field}>
            <div className={s.labelRow}>
              <label className={s.label} htmlFor={ids.title}>
                Video title
              </label>
              <span className={s.count}>{title.length}/100</span>
            </div>
            <input
              id={ids.title}
              className={s.input}
              type="text"
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your video title"
            />
          </div>
          <div className={s.field}>
            <label className={s.label} htmlFor={ids.channel}>
              Channel name
            </label>
            <input
              id={ids.channel}
              className={s.input}
              type="text"
              maxLength={60}
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="Your channel"
            />
          </div>
          <div className={s.fieldRow}>
            <div className={s.field}>
              <label className={s.label} htmlFor={ids.views}>
                Views
              </label>
              <input
                id={ids.views}
                className={s.input}
                type="text"
                maxLength={20}
                value={views}
                onChange={(e) => setViews(e.target.value)}
                placeholder="12K views"
              />
            </div>
            <div className={s.field}>
              <label className={s.label} htmlFor={ids.age}>
                Posted
              </label>
              <input
                id={ids.age}
                className={s.input}
                type="text"
                maxLength={20}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="2 days ago"
              />
            </div>
            <div className={s.field}>
              <label className={s.label} htmlFor={ids.duration}>
                Length
              </label>
              <input
                id={ids.duration}
                className={s.input}
                type="text"
                maxLength={8}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="12:48"
              />
            </div>
          </div>
          <div className={s.field}>
            <span className={s.labelText} id={ids.avatar}>
              Channel picture (optional)
            </span>
            <div className={s.avatarRow} role="group" aria-labelledby={ids.avatar}>
              <span
                className={s.avatarPreview}
                style={{ background: avatar ? 'transparent' : avatarColor(channel || 'C') }}
              >
                {avatar ? <img src={avatar} alt="" /> : (channel.trim().charAt(0) || 'C').toUpperCase()}
              </span>
              <button
                type="button"
                className={`v2-btn v2-btn-ghost ${s.smGhost}`}
                onClick={() => avatarFileRef.current?.click()}
              >
                {avatar ? 'Change' : 'Choose image'}
              </button>
              {avatar ? (
                <button type="button" className={s.link} onClick={removeAvatar}>
                  Remove
                </button>
              ) : null}
              <input
                ref={avatarFileRef}
                type="file"
                accept="image/*"
                tabIndex={-1}
                className={s.srOnly}
                aria-label="Channel picture file"
                onChange={(e) => onPick(e, 'avatar')}
              />
            </div>
          </div>
        </div>

        {/* 3 — the feed around it */}
        <div className={s.col}>
          <div className={s.colHead}>3 · Videos around yours</div>
          <form
            className={s.rivalForm}
            onSubmit={(e) => {
              e.preventDefault();
              addRivals(rivalText);
            }}
          >
            <label className={s.label} htmlFor={ids.links}>
              Paste YouTube video links
            </label>
            <textarea
              id={ids.links}
              className={s.input}
              rows={2}
              value={rivalText}
              placeholder="https://www.youtube.com/watch?v=…"
              onChange={(e) => setRivalText(e.target.value)}
              onPaste={(e) => {
                const text = e.clipboardData.getData('text');
                if (extractYouTubeIds(text).ids.length > 0) {
                  e.preventDefault();
                  addRivals(text);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addRivals(rivalText);
                }
              }}
            />
            <div className={s.actions}>
              <button type="submit" className={`v2-btn v2-btn-ghost ${s.smGhost}`}>
                Add to feed
              </button>
            </div>
          </form>
          {noticeLine('rivals')}
          <p className={s.hint}>
            Your competitors go in the feed next to your video. Their thumbnail and title are loaded
            from YouTube; nothing of yours is sent.
          </p>

          {rivals.length > 0 ? (
            <ul className={s.rivalList} aria-label="Added videos">
              {rivals.map((r, i) => (
                <li key={r.id} className={s.rival}>
                  <img
                    className={s.rivalThumb}
                    src={thumbnailUrl(r.id)}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                  <div className={s.rivalFields}>
                    <input
                      className={`${s.input} ${s.inputSm}`}
                      type="text"
                      value={r.title}
                      maxLength={100}
                      aria-label={`Title of added video ${i + 1}`}
                      onChange={(e) => editRival(r.id, 'title', e.target.value)}
                    />
                    <input
                      className={`${s.input} ${s.inputSm}`}
                      type="text"
                      value={r.channel}
                      maxLength={60}
                      aria-label={`Channel of added video ${i + 1}`}
                      onChange={(e) => editRival(r.id, 'channel', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className={s.iconBtn}
                    aria-label={`Remove added video ${i + 1}`}
                    onClick={() => setRivals((prev) => prev.filter((x) => x.id !== r.id))}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <label className={s.check}>
            <input
              type="checkbox"
              checked={fillSamples}
              onChange={(e) => setFillSamples(e.target.checked)}
            />
            <span className={s.checkBox}>
              <Tick />
            </span>
            Fill empty spots with sample videos
          </label>
        </div>
      </div>

      {/* Toolbar */}
      <div className={s.toolbar}>
        <div className={s.toolbarRow}>
          <div className={s.tabs} role="tablist" aria-label="Where to preview">
            {SURFACE_ORDER.map((kind) => (
              <button
                key={kind}
                ref={(el) => {
                  tabRefs.current[kind] = el;
                }}
                type="button"
                role="tab"
                id={`${ids.panel}-tab-${kind}`}
                aria-selected={surface === kind}
                aria-controls={`${ids.panel}-stage`}
                tabIndex={surface === kind ? 0 : -1}
                className={s.tab}
                onClick={() => setSurface(kind)}
                onKeyDown={onTabKey}
              >
                {SURFACES[kind].label}
              </button>
            ))}
          </div>

          <span className={s.spacer} />

          <div className={s.actionRow}>
            <button type="button" className={`v2-btn v2-btn-ghost ${s.smGhost}`} onClick={shuffle}>
              Shuffle position
            </button>
            <button
              type="button"
              className={`v2-btn v2-btn-primary ${s.sm}`}
              onClick={download}
              disabled={busy}
            >
              {busy ? 'Preparing…' : 'Download as image'}
            </button>
          </div>
        </div>
        {noticeLine('export')}

        <div className={s.toolbarRow}>
          <div className={s.group} role="group" aria-label="Colour mode">
            <span className={s.groupLabel}>Mode</span>
            <div className={s.segs}>
              <button type="button" className={s.seg} aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>
                Light
              </button>
              <button type="button" className={s.seg} aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>
                Dark
              </button>
            </div>
          </div>

          <label className={s.check}>
            <input
              type="checkbox"
              checked={showDuration}
              onChange={(e) => setShowDuration(e.target.checked)}
            />
            <span className={s.checkBox}>
              <Tick />
            </span>
            Length badge
          </label>

          <label className={s.check}>
            <input type="checkbox" checked={outline} onChange={(e) => setOutline(e.target.checked)} />
            <span className={s.checkBox}>
              <Tick />
            </span>
            Outline my video
          </label>

          <span className={s.spacer} />

          <div className={s.group} role="group" aria-label="Zoom">
            <span className={s.groupLabel}>Zoom</span>
            <div className={s.segs}>
              <button type="button" className={s.seg} aria-pressed={fit} onClick={() => setFit(true)}>
                Fit
              </button>
              <button type="button" className={s.seg} aria-pressed={!fit} onClick={() => setFit(false)}>
                100%
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id={`${ids.panel}-stage`} role="tabpanel" aria-labelledby={`${ids.panel}-tab-${surface}`}>
        <Stage
          designWidth={SURFACES[surface].width}
          fit={fit}
          background={surface === 'mobile' ? (theme === 'dark' ? '#1b1b1d' : '#dcdce0') : undefined}
          label={`Preview of your thumbnail and title in the ${SURFACES[surface].label.toLowerCase()} view, ${theme} mode`}
        >
          <Surface
            innerRef={mockRef}
            kind={surface}
            theme={theme}
            videos={feed}
            showDuration={showDuration}
            outline={outline}
            query={query}
          />
        </Stage>
      </div>

      <p className={s.caption}>
        {SURFACES[surface].note}
        {narrow && fit && surface !== 'mobile'
          ? ' This is a desktop layout, shrunk to fit your screen. Choose 100% and scroll sideways to see it at real size.'
          : ''}
      </p>
    </div>
  );
}

function Tick() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.5 6.2l2.4 2.4 4.6-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
