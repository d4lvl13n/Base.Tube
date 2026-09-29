'use client';

import Link from 'next/link';
import { useEffect, useId, useMemo, useState, type DragEvent } from 'react';
import s from './thumbnail-size.module.css';
import { RESIZER_URL } from './content';
import { checkImage, formatBytes, formatName, STATUS_LABEL, type Mode, type Status } from './specs';
import type { Upload } from './useThumbnailUpload';

interface CheckerProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
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

export default function Checker({ mode, onModeChange, upload, error, busy, onFile, onSample, onClear }: CheckerProps) {
  const inputId = useId();
  const groupName = useId();
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

  const result = useMemo(() => (upload ? checkImage(upload, mode) : null), [upload, mode]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const fmt = upload ? formatName(upload.mime, upload.name) : null;

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
        <h2 className={s.panelTitle}>Check your thumbnail</h2>
        <fieldset className={s.seg}>
          <legend className={s.srOnly}>Thumbnail type</legend>
          <label className={s.segOption}>
            <input
              type="radio"
              name={groupName}
              value="video"
              checked={mode === 'video'}
              onChange={() => onModeChange('video')}
              className={s.segInput}
            />
            <span className={s.segLabel}>
              Video <small>16:9</small>
            </span>
          </label>
          <label className={s.segOption}>
            <input
              type="radio"
              name={groupName}
              value="short"
              checked={mode === 'short'}
              onChange={() => onModeChange('short')}
              className={s.segInput}
            />
            <span className={s.segLabel}>
              Short <small>9:16</small>
            </span>
          </label>
        </fieldset>
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
                <span className={s.pointerOnly}>Drop your thumbnail here</span>
                <span className={s.touchOnly}>Pick your thumbnail</span>
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
            <div className={s.fileThumb}>
              {/* Object URL from the user's own file: next/image cannot optimise it. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={upload.url} alt="" />
            </div>
            <div className={s.fileMeta}>
              <p className={s.fileName} title={upload.name}>
                {upload.name}
              </p>
              <p className={s.fileFacts}>
                {upload.width} × {upload.height} · {formatBytes(upload.bytes)} · {fmt?.label}
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

          <p className={s.summary} aria-live="polite">
            {result.allPass
              ? `All ${result.rows.length} checks pass`
              : `${result.passCount} of ${result.rows.length} checks pass`}
            <span className={s.summaryMode}>{mode === 'short' ? 'Checked as a Short' : 'Checked as a long video'}</span>
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
            {result.allPass ? (
              <>
                <a href="#real-size" className={`v2-btn v2-btn-primary ${s.onAccent}`}>
                  See it at real size
                </a>
                <Link href={RESIZER_URL} className={s.textLink}>
                  Need another size? Open the resizer
                </Link>
              </>
            ) : (
              <>
                <Link href={RESIZER_URL} className={`v2-btn v2-btn-primary ${s.onAccent}`}>
                  Fix it in the resizer
                </Link>
                <a href="#real-size" className={s.textLink}>
                  See it at real size
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
