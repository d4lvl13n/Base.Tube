'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import styles from './ThumbnailResizer.module.css';
import YouTubePreviews from './YouTubePreviews';
import {
  ASPECT,
  LoadError,
  averageColor,
  clampPlacement,
  exportImage,
  imageFractions,
  loadImageFile,
  placementRect,
  releaseImage,
  renderFrame,
} from './imageEngine';
import type {
  BackgroundKind,
  ExportResult,
  FitMode,
  LoadedImage,
  OutputFormat,
  Placement,
} from './imageEngine';

const SIZES = [
  { id: '1280', w: 1280, h: 720, label: '1280×720' },
  { id: '1920', w: 1920, h: 1080, label: '1920×1080' },
  { id: '3840', w: 3840, h: 2160, label: '3840×2160' },
] as const;

const LIMITS = [
  { id: '2', label: '2 MB (mobile app upload limit)', short: '2 MB', bytes: 2_000_000 },
  { id: '50', label: '50 MB (computer upload limit)', short: '50 MB', bytes: 50_000_000 },
  { id: 'none', label: 'No limit', short: '', bytes: null },
] as const;

const START: Placement = { zoom: 1, cx: 0.5, cy: 0.5 };
const STAGE_MAX_PX = 1920;

type ExportView = ExportResult & { url: string };

function ratioLabel(w: number, h: number): string {
  const a = w / h;
  if (Math.abs(a / ASPECT - 1) < 0.01) return '16:9';
  if (Math.abs(a - 1) < 0.01) return '1:1';
  if (Math.abs(a - 4 / 3) < 0.01) return '4:3';
  if (Math.abs(a - 3 / 2) < 0.01) return '3:2';
  if (Math.abs(a - 3 / 4) < 0.01) return '3:4';
  if (Math.abs(a - 2 / 3) < 0.01) return '2:3';
  if (Math.abs(a - 9 / 16) < 0.01) return '9:16';
  return `${a.toFixed(2)}:1`;
}

function defaultMode(img: LoadedImage): FitMode {
  const a = img.width / img.height;
  // Crop is the natural choice for most images. Very tall or very wide images
  // would lose too much, so they start on Fit.
  return a < 1 || a > 2.6 ? 'fit' : 'crop';
}

function fmtKB(bytes: number): string {
  return Math.round(bytes / 1000).toLocaleString('en-US');
}

function fileBase(name: string): string {
  const base = name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  return base.slice(0, 60) || 'thumbnail';
}

function Segmented<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className={styles.seg}>
      {options.map((o) => (
        <label key={o.id} className={styles.segItem}>
          <input
            type="radio"
            name={name}
            value={o.id}
            checked={value === o.id}
            onChange={() => onChange(o.id)}
          />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

export default function ResizerTool() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const imageRef = useRef<LoadedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [over, setOver] = useState(false);

  const [mode, setMode] = useState<FitMode>('crop');
  const [background, setBackground] = useState<BackgroundKind>('blur');
  const [solid, setSolid] = useState('#000000');
  const [placement, setPlacement] = useState<Placement>(START);
  const [sizeId, setSizeId] = useState<(typeof SIZES)[number]['id']>('1280');
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [quality, setQuality] = useState(92);
  const [limitId, setLimitId] = useState<(typeof LIMITS)[number]['id']>('2');
  const [showBadge, setShowBadge] = useState(true);

  const [result, setResult] = useState<ExportView | null>(null);
  const [busy, setBusy] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);
  const stageWrap = useRef<HTMLDivElement>(null);
  const stageCanvas = useRef<HTMLCanvasElement>(null);
  const [stageSize, setStageSize] = useState({ w: 960, h: 540 });
  const [dragging, setDragging] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const runId = useRef(0);

  const size = SIZES.find((s) => s.id === sizeId)!;
  const limit = LIMITS.find((l) => l.id === limitId)!;

  /* ── Loading ───────────────────────────────────────────── */
  const loadFile = useCallback(async (file: File | undefined | null) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const img = await loadImageFile(file);
      releaseImage(imageRef.current);
      imageRef.current = img;
      setImage(img);
      setMode(defaultMode(img));
      setPlacement(START);
      setResult(null);
      setExportError(null);
    } catch (e) {
      setError(e instanceof LoadError ? e.message : 'Something went wrong opening that image. Try another file.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => releaseImage(imageRef.current);
  }, []);

  // Paste an image from the clipboard.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const f = Array.from(e.clipboardData?.files ?? []).find((x) => x.type.startsWith('image/'));
      if (f) {
        e.preventDefault();
        void loadFile(f);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [loadFile]);

  /* ── Stage canvas ──────────────────────────────────────── */
  useEffect(() => {
    const el = stageWrap.current;
    if (!el) return;
    const measure = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.min(STAGE_MAX_PX, Math.max(160, Math.round(el.clientWidth * dpr)));
      setStageSize((s) => (s.w === w ? s : { w, h: Math.round(w / ASPECT) }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [image]);

  const renderState = useMemo(
    () => ({ mode, background, solid, placement }),
    [mode, background, solid, placement],
  );

  useEffect(() => {
    const canvas = stageCanvas.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    renderFrame(ctx, canvas.width, canvas.height, image, renderState, 'stage');
  }, [image, renderState, stageSize]);

  /* ── Export (debounced, drives the live KB readout) ────── */
  useEffect(() => {
    if (!image) return;
    const id = ++runId.current;
    setBusy(true);
    const t = window.setTimeout(async () => {
      try {
        const res = await exportImage(
          image,
          renderState,
          {
            width: size.w,
            height: size.h,
            format,
            quality: quality / 100,
            limitBytes: limit.bytes,
          },
          () => runId.current !== id,
        );
        if (!res || runId.current !== id) return;
        setResult({ ...res, url: URL.createObjectURL(res.blob) });
        setExportError(null);
        setBusy(false);
      } catch (e) {
        if (runId.current !== id) return;
        setExportError(e instanceof Error ? e.message : 'Could not create the image.');
        setBusy(false);
      }
    }, 220);
    return () => window.clearTimeout(t);
  }, [image, renderState, size.w, size.h, format, quality, limit.bytes]);

  // Free the previous file's object URL once the new one has rendered.
  useEffect(() => {
    if (!result) return;
    const url = result.url;
    return () => URL.revokeObjectURL(url);
  }, [result]);

  /* ── Moving and zooming the image ──────────────────────── */
  const updatePlacement = useCallback(
    (fn: (p: Placement) => Placement) => {
      const img = imageRef.current;
      if (!img) return;
      setPlacement((p) => clampPlacement(img.width, img.height, mode, fn(p)));
    },
    [mode],
  );

  const panBy = useCallback(
    (dxFrame: number, dyFrame: number) => {
      const img = imageRef.current;
      if (!img) return;
      updatePlacement((p) => {
        const f = imageFractions(img.width, img.height, mode, p.zoom);
        return { ...p, cx: p.cx - dxFrame / f.w, cy: p.cy - dyFrame / f.h };
      });
    },
    [mode, updatePlacement],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Capture is only a convenience; dragging still works without it.
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setDragging(true);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const others = [...pointers.current.entries()].filter(([id]) => id !== e.pointerId);
    if (others.length === 0) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      panBy((e.clientX - prev.x) / rect.width, (e.clientY - prev.y) / rect.height);
    } else {
      // Two fingers: pinch to zoom, and pan with the midpoint.
      const other = others[0][1];
      const d0 = Math.hypot(prev.x - other.x, prev.y - other.y);
      const d1 = Math.hypot(e.clientX - other.x, e.clientY - other.y);
      const mx0 = (prev.x + other.x) / 2;
      const my0 = (prev.y + other.y) / 2;
      const mx1 = (e.clientX + other.x) / 2;
      const my1 = (e.clientY + other.y) / 2;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const img = imageRef.current;
      if (!img || d0 < 4) return;
      const scale = d1 / d0;
      updatePlacement((p) => {
        const zoom = p.zoom * scale;
        const f = imageFractions(img.width, img.height, mode, Math.min(5, Math.max(1, zoom)));
        return {
          zoom,
          cx: p.cx - (mx1 - mx0) / rect.width / f.w,
          cy: p.cy - (my1 - my0) / rect.height / f.h,
        };
      });
    }
  };

  const onPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) setDragging(false);
  };

  const onStageKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 0.1 : 0.03;
    switch (e.key) {
      case 'ArrowLeft': panBy(-step, 0); break;
      case 'ArrowRight': panBy(step, 0); break;
      case 'ArrowUp': panBy(0, -step); break;
      case 'ArrowDown': panBy(0, step); break;
      case '+':
      case '=': updatePlacement((p) => ({ ...p, zoom: p.zoom + 0.1 })); break;
      case '-':
      case '_': updatePlacement((p) => ({ ...p, zoom: p.zoom - 0.1 })); break;
      case '0': setPlacement(START); break;
      default: return;
    }
    e.preventDefault();
  };

  // Ctrl/Cmd + wheel (and trackpad pinch) zooms. Plain wheel still scrolls the page.
  useEffect(() => {
    const el = stageWrap.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      updatePlacement((p) => ({ ...p, zoom: p.zoom * Math.exp(-e.deltaY * 0.01) }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [image, updatePlacement]);

  const changeMode = (m: FitMode) => {
    setMode(m);
    setPlacement(START);
  };

  /* ── Drag and drop a file onto the tool ────────────────── */
  const dropProps = {
    onDragOver: (e: React.DragEvent) => {
      if (!Array.from(e.dataTransfer.types).includes('Files')) return;
      e.preventDefault();
      setOver(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setOver(false);
      void loadFile(e.dataTransfer.files?.[0]);
    },
  };

  const openPicker = () => fileInput.current?.click();

  const fileInputEl = (
    <input
      ref={fileInput}
      type="file"
      accept="image/*"
      hidden
      aria-label="Choose an image file"
      onChange={(e) => {
        void loadFile(e.target.files?.[0]);
        e.target.value = '';
      }}
    />
  );

  /* ── Empty state ───────────────────────────────────────── */
  if (!image) {
    return (
      <div>
        <div className={`${styles.tool} ${over ? styles.over : ''}`} {...dropProps}>
          <div className={styles.dropWrap}>
            <div className={`${styles.drop} ${over ? styles.over : ''}`}>
              <div className={`v2-tool-dropzone-icon ${styles.dropIcon}`}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="v2-tool-dropzone-title">Drop an image here</p>
              <p className="v2-tool-dropzone-sub">JPG, PNG or WebP · any size · or paste with Ctrl/Cmd + V</p>
              <div className={styles.dropActions}>
                <button type="button" className="v2-btn v2-btn-primary" onClick={openPicker} disabled={loading}>
                  {loading ? 'Opening…' : 'Choose an image'}
                </button>
              </div>
            </div>
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
          </div>
          {fileInputEl}
        </div>
        <p className={styles.privacy}>
          <strong>Your image never leaves your device.</strong> Everything happens in your browser. Nothing is uploaded or stored.
        </p>
      </div>
    );
  }

  /* ── Working state ─────────────────────────────────────── */
  const a = image.width / image.height;
  const isSixteenNine = Math.abs(a / ASPECT - 1) < 0.005;
  // Is the image drawn larger than its own pixels? Then it gets enlarged and looks soft.
  const drawnWidth = placementRect(image.width, image.height, mode, placement).w * size.w;
  const enlarged = drawnWidth > image.width * 1.3;
  const usedQ = result?.quality != null ? Math.round(result.quality * 100) : null;
  const ext = format === 'jpeg' ? 'jpg' : 'png';
  const fileName = `${fileBase(image.name)}-${size.w}x${size.h}.${ext}`;
  const swatches: { label: string; value: string }[] = [
    { label: 'Black', value: '#000000' },
    { label: 'White', value: '#ffffff' },
    { label: 'Match the image', value: averageColor(image) },
  ];

  let status: React.ReactNode = null;
  let statusClass = styles.status;
  if (exportError) {
    status = exportError;
    statusClass = `${styles.status} ${styles.warn}`;
  } else if (busy && !result) {
    status = 'Working…';
  } else if (result) {
    const lim = result.limitBytes !== null ? limit.short : '';
    if (result.overLimit) {
      statusClass = `${styles.status} ${styles.warn}`;
      status =
        result.format === 'png' ? (
          <>
            This PNG is over the {lim} limit.{' '}
            <button type="button" onClick={() => setFormat('jpeg')}>
              Switch to JPG
            </button>{' '}
            or choose a smaller size.
          </>
        ) : (
          <>Even at the lowest quality this is over the {lim} limit. Choose a smaller size.</>
        );
    } else if (result.lowered && usedQ !== null) {
      statusClass = `${styles.status} ${styles.ok}`;
      status = `Quality lowered from ${Math.round(result.requestedQuality * 100)} to ${usedQ} to fit under ${lim}.`;
    } else if (lim) {
      statusClass = `${styles.status} ${styles.ok}`;
      status = `Under the ${lim} limit.`;
    }
  }

  const resultBar = (
    <div className={styles.result}>
      <div className={styles.resultMain}>
        <div className={`${styles.size} ${busy ? styles.dim : ''}`}>
          <span>
            <span className={styles.sizeNum}>{result ? fmtKB(result.blob.size) : '—'}</span>
            <span className={styles.sizeUnit}>KB</span>
          </span>
          {result && (
            <span className={styles.sizeMeta}>
              {result.width} × {result.height} · {ext.toUpperCase()}
              {usedQ !== null ? ` · quality ${usedQ}` : ''}
            </span>
          )}
        </div>
        <div className={statusClass} aria-live="polite">
          {status}
        </div>
      </div>
      <a
        className={`v2-btn v2-btn-primary ${styles.downloadBtn}`}
        href={result?.url ?? '#'}
        download={fileName}
        aria-disabled={!result}
        onClick={(e) => {
          if (!result) e.preventDefault();
        }}
      >
        Download {ext.toUpperCase()}
      </a>
    </div>
  );

  return (
    <div>
      <div className={`${styles.tool} ${over ? styles.over : ''}`} {...dropProps}>
        <div className={styles.workspace}>
          <div className={styles.stageCol}>
            <div
              ref={stageWrap}
              className={`${styles.stageWrap} ${dragging ? styles.dragging : ''}`}
              tabIndex={0}
              role="group"
              aria-label="Thumbnail frame. Drag to move the image, use the arrow keys to nudge it, plus and minus to zoom."
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerEnd}
              onPointerCancel={onPointerEnd}
              onKeyDown={onStageKey}
            >
              <canvas ref={stageCanvas} className={styles.stage} width={stageSize.w} height={stageSize.h} />
              {showBadge && <span className={styles.badge} aria-hidden>12:34</span>}
            </div>
            <div className={styles.stageMeta}>
              <span>
                <span className={styles.fileName}>{image.name}</span> · {image.width} × {image.height} ·{' '}
                {ratioLabel(image.width, image.height)}
              </span>
              <span className={styles.linkRow}>
                <button type="button" className={styles.linkBtn} onClick={() => setPlacement(START)}>
                  Reset position
                </button>
                <button type="button" className={styles.linkBtn} onClick={openPicker}>
                  Change image
                </button>
              </span>
            </div>
            <p className={`${styles.stageMeta} ${styles.stageHint}`}>
              Drag the image to move it. Pinch, use the slider, or press + and − to zoom.
            </p>
            {enlarged && (
              <p className={styles.warnNote}>
                This image is small for this output size, so it is enlarged and may look soft. Try a smaller output
                size, or start from a larger original.
              </p>
            )}
            {error && (
              <p className={styles.error} role="alert" style={{ margin: 0 }}>
                {error}
              </p>
            )}
            {resultBar}
          </div>

          <div className={styles.controls}>
            <fieldset className={styles.group}>
              <legend>Framing</legend>
              <Segmented
                name="fit-mode"
                value={mode}
                onChange={changeMode}
                options={[
                  { id: 'crop', label: 'Crop to fill' },
                  { id: 'fit', label: 'Fit whole image' },
                ]}
              />
              {isSixteenNine && mode === 'fit' && (
                <p className={styles.note}>This image is already 16:9, so both options look the same until you zoom.</p>
              )}
            </fieldset>

            {mode === 'fit' && (
              <fieldset className={styles.group}>
                <legend>Background</legend>
                <Segmented
                  name="bg-kind"
                  value={background}
                  onChange={setBackground}
                  options={[
                    { id: 'blur', label: 'Blurred image' },
                    { id: 'solid', label: 'Solid colour' },
                  ]}
                />
                {background === 'solid' && (
                  <div className={styles.swatches}>
                    {swatches.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        className={styles.swatch}
                        style={{ background: s.value }}
                        aria-label={s.label}
                        title={s.label}
                        aria-pressed={solid.toLowerCase() === s.value.toLowerCase()}
                        onClick={() => setSolid(s.value)}
                      />
                    ))}
                    <label className={styles.colorPick} title="Pick a colour">
                      <span className={styles.sr}>Pick a custom colour</span>
                      <input type="color" value={solid} onChange={(e) => setSolid(e.target.value)} />
                    </label>
                  </div>
                )}
              </fieldset>
            )}

            <div className={styles.group}>
              <div className={styles.groupLabel}>
                <label htmlFor="rz-zoom">Zoom</label>
                <output htmlFor="rz-zoom">{placement.zoom.toFixed(2)}×</output>
              </div>
              <input
                id="rz-zoom"
                className={styles.range}
                type="range"
                min={1}
                max={5}
                step={0.01}
                value={placement.zoom}
                onChange={(e) => updatePlacement((p) => ({ ...p, zoom: Number(e.target.value) }))}
              />
            </div>

            <fieldset className={styles.group}>
              <legend>Output size</legend>
              <Segmented
                name="out-size"
                value={sizeId}
                onChange={setSizeId}
                options={SIZES.map((s) => ({ id: s.id, label: s.label }))}
              />
            </fieldset>

            <fieldset className={styles.group}>
              <legend>Format</legend>
              <Segmented
                name="out-format"
                value={format}
                onChange={setFormat}
                options={[
                  { id: 'jpeg', label: 'JPG' },
                  { id: 'png', label: 'PNG' },
                ]}
              />
            </fieldset>

            <div className={styles.group}>
              <div className={styles.groupLabel}>
                <label htmlFor="rz-quality">JPG quality</label>
                <output htmlFor="rz-quality">{format === 'jpeg' ? quality : 'n/a'}</output>
              </div>
              <input
                id="rz-quality"
                className={styles.range}
                type="range"
                min={50}
                max={100}
                step={1}
                value={quality}
                disabled={format === 'png'}
                onChange={(e) => setQuality(Number(e.target.value))}
              />
              {format === 'png' && <p className={styles.note}>PNG is lossless, so it has no quality setting.</p>}
            </div>

            <div className={styles.group}>
              <div className={styles.groupLabel}>
                <label htmlFor="rz-limit">Keep file under</label>
              </div>
              <select
                id="rz-limit"
                className={styles.select}
                value={limitId}
                onChange={(e) => setLimitId(e.target.value as (typeof LIMITS)[number]['id'])}
              >
                {LIMITS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <label className={styles.checkRow}>
              <input type="checkbox" checked={showBadge} onChange={(e) => setShowBadge(e.target.checked)} />
              Show the duration badge (preview only)
            </label>
          </div>
        </div>

        {fileInputEl}
      </div>
      <p className={styles.privacy}>
        <strong>Your image never leaves your device.</strong> Everything happens in your browser. Nothing is uploaded or stored.
      </p>

      {result && <YouTubePreviews src={result.url} />}
    </div>
  );
}
