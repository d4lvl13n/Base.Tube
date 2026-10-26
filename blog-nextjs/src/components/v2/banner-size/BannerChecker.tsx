'use client';

import { useEffect, useId, useMemo, useState, type CSSProperties, type DragEvent } from 'react';
import s from '../thumbnail-size/thumbnail-size.module.css';
import b from './banner-size.module.css';
import {
  checkBanner,
  DESKTOP_STRIP,
  formatBytes,
  formatName,
  SAFE_PCT,
  safeAreaFor,
  STATUS_LABEL,
  type Status,
} from './specs';
import type { Upload } from './useBannerUpload';

interface CheckerProps {
  upload: Upload | null;
  error: string | null;
  busy: boolean;
  onFile: (file: File) => void;
  onSample: () => void;
  onClear: () => void;
}

function StatusIcon({ status }: { status: Status }) {
  const common = { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true } as const;
  if (status === 'pass') {
    return (
      <svg {...common}>
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 10.4l2.7 2.7L14.2 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'warn') {
    return (
      <svg {...common}>
        <path d="M10 2.6l8 14H2l8-14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 8v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="10" cy="14.4" r="0.95" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function BannerChecker({ upload, error, busy, onFile, onSample, onClear }: CheckerProps) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);

  // Paste an image straight from the clipboard (screenshots, copied images).
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.files ?? []).find((f) => f.type.startsWith('image/'));
      if (file) {
        e.preventDefault();
        onFile(file);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [onFile]);

  const result = useMemo(() => (upload ? checkBanner(upload) : null), [upload]);
  const safe = upload ? safeAreaFor(upload.width, upload.height) : null;

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const safeStyle = {
    width: `${SAFE_PCT.w}%`,
    height: `${SAFE_PCT.h}%`,
    left: `${(100 - SAFE_PCT.w) / 2}%`,
    top: `${(100 - SAFE_PCT.h) / 2}%`,
  } as CSSProperties;

  return (
    <div
      id="checker"
      className={`${s.panel} ${dragging ? s.panelDrag : ''}`}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
      }}
      onDrop={handleDrop}
    >
      <div className={s.panelHead}>
        <h2 className={s.panelTitle}>Check your banner</h2>
      </div>

      {/* The file input is always mounted so "Replace" works from the results view too. */}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className={`${s.srOnly} ${s.fileInput}`}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
      />

      {error && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}

      {!upload || !result ? (
        <div className={s.dz}>
          <svg className={s.dzIcon} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className={s.dzTitle}>
            {busy ? (
              'Reading your image…'
            ) : (
              <>
                <span className={s.pointerOnly}>Drop your banner here</span>
                <span className={s.touchOnly}>Pick your banner</span>
              </>
            )}
          </p>
          <p className={`${s.dzSub} ${s.pointerOnly}`}>or paste it with Ctrl+V or Cmd+V</p>
          <div className={s.dzActions}>
            <label htmlFor={inputId} className={`v2-btn v2-btn-primary ${s.onAccent} ${s.chooseLabel}`}>
              Choose image
            </label>
            <button type="button" className={s.linkBtn} onClick={onSample}>
              or try a sample
            </button>
          </div>
          <p className={s.privacy}>Checked in your browser. Your image is never uploaded.</p>
        </div>
      ) : (
        <div className={s.result}>
          <div className={s.file}>
            <div className={s.fileMeta}>
              <p className={s.fileName} title={upload.name}>
                {upload.name}
              </p>
              <p className={s.fileFacts}>
                {upload.width} × {upload.height} · {formatBytes(upload.bytes)} · {formatName(upload.mime, upload.name)}
              </p>
            </div>
            <div className={s.fileActions}>
              <label htmlFor={inputId} className={s.smallBtn}>
                Replace
              </label>
              <button type="button" className={s.smallBtn} onClick={onClear}>
                Clear
              </button>
            </div>
          </div>

          <div className={b.checkPreview}>
            {/* Object URL from the user's own file: next/image cannot optimise it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={upload.url} alt="" />
            <div
              className={b.checkStrip}
              style={{ top: `${DESKTOP_STRIP.topPct}%`, height: `${DESKTOP_STRIP.heightPct}%` }}
              aria-hidden
            />
            <div className={b.safeBox} style={safeStyle} aria-hidden />
          </div>
          <p className={b.checkPreviewCap}>
            Orange box: safe area{safe ? `, ${safe.w} × ${safe.h} px on your image` : ''}. Dim bands: only seen on TV.
            Text and logos belong in the box.
          </p>

          <p className={s.summary} aria-live="polite">
            {result.allPass
              ? `All ${result.rows.length} checks pass`
              : `${result.passCount} of ${result.rows.length} checks pass`}
          </p>

          <ul className={s.rows}>
            {result.rows.map((r) => (
              <li key={r.id} className={`${s.row} ${s[r.status]}`}>
                <span className={s.rowIcon}>
                  <StatusIcon status={r.status} />
                </span>
                <div className={s.rowBody}>
                  <div className={s.rowTop}>
                    <span className={s.rowLabel}>{r.label}</span>
                    <span className={s.rowValue}>{r.value}</span>
                    <span className={s.rowStatus}>{STATUS_LABEL[r.status]}</span>
                  </div>
                  <p className={s.rowDetail}>{r.detail}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className={s.resultActions}>
            <a href="#devices" className={`v2-btn v2-btn-primary ${s.onAccent}`}>
              See it on TV, computer and phone
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
