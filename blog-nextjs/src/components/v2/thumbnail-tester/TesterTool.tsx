'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './ThumbnailTester.module.css';
import { ImageLoadError, VARIANT_IDS, loadVariant, type Variant } from './analysis';
import { SAMPLE_TITLE, makeSampleFiles } from './samples';
import CompareViews from './CompareViews';
import Measurements from './Measurements';
import Checklist from './Checklist';

const TITLE_MAX = 100;
const ACCEPT = 'image/png,image/jpeg,image/webp,image/gif,image/avif';

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

interface SlotProps {
  index: number;
  variant: Variant | null;
  busy: boolean;
  error: string | null;
  dragOver: boolean;
  onFiles: (index: number, files: FileList | File[]) => void;
  onRemove: (index: number) => void;
  onDrag: (index: number | null) => void;
}

function Slot({ index, variant, busy, error, dragOver, onFiles, onRemove, onDrag }: SlotProps) {
  const id = VARIANT_IDS[index];
  const inputId = `tt-file-${index}`;
  return (
    <div className={styles.slot}>
      <div className={styles.slotHead}>
        <span className={styles.slotName}>Variant {id}</span>
        {index === 2 && <span>Optional</span>}
      </div>

      <label
        className={cx(styles.drop, variant && styles.dropLoaded, dragOver && styles.dropActive)}
        onDragOver={(e) => {
          e.preventDefault();
          onDrag(index);
        }}
        onDragLeave={() => onDrag(null)}
        onDrop={(e) => {
          e.preventDefault();
          onDrag(null);
          if (e.dataTransfer.files.length) onFiles(index, e.dataTransfer.files);
        }}
      >
        <input
          id={inputId}
          type="file"
          accept={ACCEPT}
          multiple={index < 2}
          className={styles.fileInput}
          aria-label={variant ? `Replace the image for variant ${id}` : `Choose an image for variant ${id}`}
          onChange={(e) => {
            if (e.target.files?.length) onFiles(index, e.target.files);
            e.target.value = '';
          }}
        />
        {variant ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={variant.url} alt={`Variant ${id} thumbnail`} />
          </>
        ) : busy ? (
          <span className={styles.dropTitle}>Reading image…</span>
        ) : (
          <>
            <svg
              className={styles.dropIcon}
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className={styles.dropTitle}>Drop an image or click to choose</span>
            <span className={styles.dropSub}>JPG, PNG or WebP · 16:9 works best</span>
          </>
        )}
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {variant && (
        <div className={styles.slotFoot}>
          <span className={cx(styles.fname)} title={variant.fileName}>
            {variant.fileName}
          </span>
          <span>
            {variant.sourceWidth} × {variant.sourceHeight}
          </span>
          <label htmlFor={inputId} className={styles.linkBtn}>
            Replace
          </label>
          <button type="button" className={styles.linkBtn} onClick={() => onRemove(index)} aria-label={`Remove variant ${id}`}>
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default function TesterTool() {
  const [slots, setSlots] = useState<(Variant | null)[]>([null, null, null]);
  const slotsRef = useRef<(Variant | null)[]>([null, null, null]);
  const [busy, setBusy] = useState<boolean[]>([false, false, false]);
  const [errors, setErrors] = useState<(string | null)[]>([null, null, null]);
  const tokens = useRef<number[]>([0, 0, 0]);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [loadingSamples, setLoadingSamples] = useState(false);

  const setAt = <T,>(setter: (fn: (prev: T[]) => T[]) => void, i: number, value: T) =>
    setter((prev) => prev.map((x, k) => (k === i ? value : x)));

  const put = (i: number, v: Variant | null) => {
    const prev = slotsRef.current[i];
    if (prev) URL.revokeObjectURL(prev.url);
    const next = slotsRef.current.map((x, k) => (k === i ? v : x));
    slotsRef.current = next;
    setSlots(next);
  };

  const loadInto = async (i: number, file: File) => {
    const token = ++tokens.current[i];
    setAt(setBusy, i, true);
    setAt(setErrors, i, null);
    try {
      const v = await loadVariant(file, VARIANT_IDS[i]);
      if (token !== tokens.current[i]) {
        URL.revokeObjectURL(v.url);
        return;
      }
      put(i, v);
      setStatus(`Variant ${VARIANT_IDS[i]} loaded.`);
    } catch (e) {
      if (token === tokens.current[i]) {
        setAt(setErrors, i, e instanceof ImageLoadError ? e.message : 'Something went wrong reading this image.');
      }
    } finally {
      if (token === tokens.current[i]) setAt(setBusy, i, false);
    }
  };

  const onFiles = (start: number, files: FileList | File[]) => {
    Array.from(files)
      .slice(0, 3)
      .forEach((f, k) => {
        if (start + k < 3) void loadInto(start + k, f);
      });
  };

  const onRemove = (i: number) => {
    tokens.current[i]++;
    put(i, null);
    setAt(setErrors, i, null);
    setAt(setBusy, i, false);
    setStatus(`Variant ${VARIANT_IDS[i]} removed.`);
  };

  const clearAll = () => {
    [0, 1, 2].forEach(onRemove);
    setTitle('');
  };

  const loadSamples = async () => {
    setLoadingSamples(true);
    try {
      const files = await makeSampleFiles();
      files.forEach((f, i) => void loadInto(i, f));
      setTitle((t) => t || SAMPLE_TITLE);
    } catch {
      setAt(setErrors, 0, 'The examples could not be drawn in this browser.');
    } finally {
      setLoadingSamples(false);
    }
  };

  useEffect(
    () => () => {
      slotsRef.current.forEach((v) => v && URL.revokeObjectURL(v.url));
    },
    []
  );

  const loaded = useMemo(() => slots.filter((v): v is Variant => v !== null), [slots]);

  return (
    <div className={styles.tool}>
      {/* ── 01 Add ─────────────────────────────────────── */}
      <section aria-labelledby="tt-add">
        <div className={styles.stepHead}>
          <span className={styles.stepNum}>01</span>
          <h2 id="tt-add" className={styles.stepTitle}>
            Add your variants
          </h2>
        </div>
        <p className={styles.stepHint}>
          Two or three versions of the same thumbnail, and the title you will publish with. Images that are not 16:9 are
          cropped to 16:9 for the views.
        </p>

        <div className={styles.slots}>
          {slots.map((v, i) => (
            <Slot
              key={i}
              index={i}
              variant={v}
              busy={busy[i]}
              error={errors[i]}
              dragOver={dragOver === i}
              onFiles={onFiles}
              onRemove={onRemove}
              onDrag={setDragOver}
            />
          ))}
        </div>

        <div className={styles.fields}>
          <div>
            <label htmlFor="tt-title" className={styles.fieldLabel}>
              <span>Video title</span>
              <span className={styles.fieldMeta}>
                {title.length} / {TITLE_MAX}
              </span>
            </label>
            <input
              id="tt-title"
              type="text"
              className={styles.input}
              value={title}
              maxLength={TITLE_MAX}
              placeholder="The title you will publish with"
              autoComplete="off"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={loadSamples} disabled={loadingSamples}>
            {loadingSamples ? 'Drawing examples…' : 'Try 3 example thumbnails'}
          </button>
          {loaded.length > 0 && (
            <button type="button" className={styles.btn} onClick={clearAll}>
              Clear all
            </button>
          )}
          <span className={styles.privacy}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            Your images stay on this device. Nothing is uploaded.
          </span>
        </div>
        <p className={styles.srOnly} role="status" aria-live="polite">
          {status}
        </p>
      </section>

      {loaded.length === 0 ? (
        <p className={styles.emptyNote}>
          Add at least one image to open the comparison views. Two or three is where it gets useful: the views show them
          side by side, and the measurements compare them.
        </p>
      ) : (
        <>
          {/* ── 02 Compare ───────────────────────────────── */}
          <section aria-labelledby="tt-compare">
            <div className={styles.stepHead}>
              <span className={styles.stepNum}>02</span>
              <h2 id="tt-compare" className={styles.stepTitle}>
                Compare them five ways
              </h2>
            </div>
            <CompareViews variants={loaded} title={title} />
          </section>

          {/* ── 03 Measure ───────────────────────────────── */}
          <section aria-labelledby="tt-measure">
            <div className={styles.stepHead}>
              <span className={styles.stepNum}>03</span>
              <h2 id="tt-measure" className={styles.stepTitle}>
                What the measurements show
              </h2>
            </div>
            <Measurements variants={loaded} />
          </section>

          {/* ── 04 Checklist ─────────────────────────────── */}
          <section aria-labelledby="tt-checklist">
            <div className={styles.stepHead}>
              <span className={styles.stepNum}>04</span>
              <h2 id="tt-checklist" className={styles.stepTitle}>
                Your checklist
              </h2>
            </div>
            <Checklist variants={loaded} />
          </section>
        </>
      )}
    </div>
  );
}
