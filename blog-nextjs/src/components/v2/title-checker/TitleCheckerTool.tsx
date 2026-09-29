'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState, type DragEvent } from 'react';
import styles from './TitleChecker.module.css';
import { BATCH_MAX, TITLE_LIMIT, parseBatch, type Status } from './analysis';
import { checkTitle } from './compute';
import { useSurfaceMeasurers } from './useMeasurer';
import Previews, { type Theme } from './Previews';
import BatchTable from './BatchTable';

const STUDIO_GENERATE = 'https://beta.base.tube/ai-thumbnails/generate';
const STUDIO_AUDIT = 'https://beta.base.tube/ai-thumbnails/audit';

const EXAMPLE_TITLE = 'I Tried Editing YouTube Videos Only on My Phone for 30 Days (Here’s What Happened)';
const EXAMPLE_KEYWORD = 'editing youtube videos';
const EXAMPLE_BATCH = [
  'I Tried Editing YouTube Videos Only on My Phone for 30 Days (Here’s What Happened)',
  'Edit YouTube Videos on Your Phone: The 30-Day Test',
  'PHONE EDITING CHALLENGE!!! You WON’T Believe This',
  'How to edit videos on your phone (the fast way)',
].join('\n');

const STATUS_LABEL: Record<Status, string> = { ok: 'Fine', note: 'Check', problem: 'Fix', info: 'Info' };

type Mode = 'single' | 'batch';

export default function TitleCheckerTool() {
  const uid = useId();
  const ids = {
    title: `${uid}-title`,
    keyword: `${uid}-keyword`,
    thumbText: `${uid}-thumbtext`,
    file: `${uid}-file`,
    batch: `${uid}-batch`,
    tabSingle: `${uid}-tab-single`,
    tabBatch: `${uid}-tab-batch`,
  };

  const [mode, setMode] = useState<Mode>('single');
  const [title, setTitle] = useState(EXAMPLE_TITLE);
  const [keyword, setKeyword] = useState(EXAMPLE_KEYWORD);
  const [thumbText, setThumbText] = useState('');
  const [batchText, setBatchText] = useState(EXAMPLE_BATCH);
  const [theme, setTheme] = useState<Theme>('dark');
  const [thumb, setThumb] = useState<{ url: string; name: string } | null>(null);
  const [thumbError, setThumbError] = useState('');
  const [dragging, setDragging] = useState(false);
  const thumbRef = useRef<string | null>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const measurerFor = useSurfaceMeasurers();

  useEffect(
    () => () => {
      if (thumbRef.current) URL.revokeObjectURL(thumbRef.current);
    },
    []
  );

  const acceptFile = useCallback((file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setThumbError('That file is not an image. Use a JPG, PNG or WebP.');
      return;
    }
    setThumbError('');
    const url = URL.createObjectURL(file);
    if (thumbRef.current) URL.revokeObjectURL(thumbRef.current);
    thumbRef.current = url;
    setThumb({ url, name: file.name });
  }, []);

  const removeThumb = useCallback(() => {
    if (thumbRef.current) URL.revokeObjectURL(thumbRef.current);
    thumbRef.current = null;
    setThumb(null);
    setThumbError('');
  }, []);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const single = useMemo(
    () => checkTitle(title, { keyword, thumbnailText: thumbText }, measurerFor),
    [title, keyword, thumbText, measurerFor]
  );

  const batch = useMemo(() => parseBatch(batchText), [batchText]);
  const batchRows = useMemo(
    () => batch.titles.map((t) => ({ title: t, result: checkTitle(t, { keyword }, measurerFor) })),
    [batch, keyword, measurerFor]
  );

  const length = single.analysis.metrics.length;
  const over = length > TITLE_LIMIT;
  const pct = Math.min(100, (length / TITLE_LIMIT) * 100);

  const openInChecker = (t: string) => {
    setTitle(t);
    setMode('single');
    requestAnimationFrame(() => titleRef.current?.focus());
  };

  const clearAll = () => {
    setTitle('');
    setKeyword('');
    setThumbText('');
    titleRef.current?.focus();
  };

  return (
    <div className={styles.tool}>
      <div className={styles.tabs} role="tablist" aria-label="Checker mode">
        <button
          type="button"
          role="tab"
          id={ids.tabSingle}
          aria-selected={mode === 'single'}
          aria-controls={`${uid}-panel`}
          className={styles.tab}
          onClick={() => setMode('single')}
        >
          Check one title
        </button>
        <button
          type="button"
          role="tab"
          id={ids.tabBatch}
          aria-selected={mode === 'batch'}
          aria-controls={`${uid}-panel`}
          className={styles.tab}
          onClick={() => setMode('batch')}
        >
          Compare up to {BATCH_MAX}
        </button>
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={mode === 'single' ? ids.tabSingle : ids.tabBatch}
      >
        {mode === 'single' ? (
          <>
            <div className={styles.inputGrid}>
              <div className={styles.titleCol}>
                <label htmlFor={ids.title} className={styles.fieldLabel}>
                  Video title
                </label>
                <textarea
                  id={ids.title}
                  ref={titleRef}
                  className={styles.textarea}
                  rows={3}
                  value={title}
                  placeholder="Paste or type your video title"
                  spellCheck={false}
                  onChange={(e) => setTitle(e.target.value.replace(/[\r\n]+/g, ' '))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  aria-describedby={`${uid}-count`}
                />
                <div className={styles.counter} id={`${uid}-count`}>
                  <span className={`${styles.countNum} ${over ? styles.countOver : ''}`}>{length}</span>
                  <span className={styles.countOf}>
                    of {TITLE_LIMIT} characters
                    {over ? `, ${length - TITLE_LIMIT} too many` : length > 0 ? `, ${TITLE_LIMIT - length} left` : ''}
                  </span>
                  <button type="button" className={styles.linkBtn} onClick={clearAll}>
                    Clear
                  </button>
                </div>
                <div className={styles.bar} aria-hidden="true">
                  <div className={`${styles.barFill} ${over ? styles.barOver : ''}`} style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className={styles.sideCol}>
                <div>
                  <label htmlFor={ids.keyword} className={styles.fieldLabel}>
                    Main keyword <span className={styles.optional}>optional</span>
                  </label>
                  <input
                    id={ids.keyword}
                    className={styles.input}
                    type="text"
                    value={keyword}
                    placeholder="What the video is about"
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor={ids.thumbText} className={styles.fieldLabel}>
                    Words on your thumbnail <span className={styles.optional}>optional</span>
                  </label>
                  <input
                    id={ids.thumbText}
                    className={styles.input}
                    type="text"
                    value={thumbText}
                    placeholder="e.g. 30 days, phone only"
                    onChange={(e) => setThumbText(e.target.value)}
                  />
                </div>
                <div>
                  <span className={styles.fieldLabel} id={`${uid}-thumb-label`}>
                    Thumbnail <span className={styles.optional}>optional</span>
                  </span>
                  {thumb ? (
                    <div className={styles.thumbPicked}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumb.url} alt="Your uploaded thumbnail" className={styles.thumbPickedImg} />
                      <span className={styles.thumbName}>{thumb.name}</span>
                      <button type="button" className={styles.linkBtn} onClick={removeThumb}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`${styles.drop} ${dragging ? styles.dropActive : ''}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={onDrop}
                    >
                      <input
                        id={ids.file}
                        className={styles.fileInput}
                        type="file"
                        accept="image/*"
                        aria-labelledby={`${uid}-thumb-label`}
                        onChange={(e) => {
                          acceptFile(e.target.files?.[0]);
                          e.target.value = '';
                        }}
                      />
                      <label htmlFor={ids.file} className={styles.dropLabel}>
                        Choose an image or drop it here
                      </label>
                    </div>
                  )}
                  {thumbError && (
                    <p className={styles.error} role="alert">
                      {thumbError}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <p className={styles.privacy}>
              Everything runs in your browser. Your title and thumbnail never leave your device.
            </p>

            <div className={styles.results}>
              {single.layouts && title.trim() === '' ? (
                <div className={styles.previewsLoading} role="status">
                  Type a title above to see where it is cut on each screen.
                </div>
              ) : single.layouts ? (
                <Previews layouts={single.layouts} thumbUrl={thumb?.url ?? null} theme={theme} onTheme={setTheme} />
              ) : (
                <div className={styles.previewsLoading} role="status">
                  Loading the YouTube font to measure your title…
                </div>
              )}

              <div className={styles.checksBlock}>
                <h3 className={styles.blockTitle}>Checks</h3>
                <p className={styles.blockSub}>
                  Things worth a look before you publish. Not a grade: nothing here predicts how many people will click.
                </p>
                <ul className={styles.checks}>
                  {single.analysis.checks.map((c) => (
                    <li key={c.id} className={styles.check} data-status={c.status}>
                      <div className={styles.checkHead}>
                        <span className={`${styles.mark} ${styles[`mark_${c.status}` as keyof typeof styles]}`}>
                          {STATUS_LABEL[c.status]}
                        </span>
                        <span className={styles.checkLabel}>{c.label}</span>
                      </div>
                      <div className={styles.checkBody}>
                        <p>{c.summary}</p>
                        {c.detail && <p className={styles.checkDetail}>{c.detail}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.nextStep}>
                <div>
                  <p className={styles.nextTitle}>Now make the thumbnail that goes with this title</p>
                  <p className={styles.nextText}>
                    A title and a thumbnail work as one message. Generate a thumbnail that fits this title in the
                    Base.Tube Studio.
                  </p>
                </div>
                <div className={styles.nextActions}>
                  <a className="v2-btn v2-btn-primary" href={STUDIO_GENERATE} target="_blank" rel="noopener noreferrer">
                    Generate a thumbnail for this title
                    <span aria-hidden="true">{'→'}</span>
                  </a>
                  <a className="v2-btn v2-btn-ghost" href={STUDIO_AUDIT} target="_blank" rel="noopener noreferrer">
                    Audit my channel
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.batchGrid}>
              <div>
                <label htmlFor={ids.batch} className={styles.fieldLabel}>
                  Titles, one per line
                </label>
                <textarea
                  id={ids.batch}
                  className={`${styles.textarea} ${styles.batchArea}`}
                  rows={8}
                  value={batchText}
                  spellCheck={false}
                  placeholder={'Paste up to 10 alternative titles, one per line'}
                  onChange={(e) => setBatchText(e.target.value)}
                  aria-describedby={`${uid}-batchcount`}
                />
                <p className={styles.batchCount} id={`${uid}-batchcount`}>
                  {batch.titles.length} of {BATCH_MAX} titles
                  {batch.extra > 0 && (
                    <span className={styles.batchExtra}>
                      {' '}
                      · {batch.extra} more ignored: the table compares the first {BATCH_MAX}
                    </span>
                  )}
                </p>
              </div>
              <div>
                <label htmlFor={ids.keyword} className={styles.fieldLabel}>
                  Main keyword <span className={styles.optional}>optional</span>
                </label>
                <input
                  id={ids.keyword}
                  className={styles.input}
                  type="text"
                  value={keyword}
                  placeholder="What the video is about"
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <p className={styles.help}>
                  One keyword for the whole batch. The table shows where it sits in each title.
                </p>
              </div>
            </div>
            <p className={styles.privacy}>Everything runs in your browser. Your titles never leave your device.</p>

            <div className={styles.results}>
              {batchRows.length === 0 ? (
                <p className={styles.blockSub}>Paste some titles above to compare them.</p>
              ) : measurerFor ? (
                <>
                  <BatchTable rows={batchRows} hasKeyword={keyword.trim() !== ''} onOpen={openInChecker} />
                  <p className={styles.legend}>
                    <span className={styles.legendNote}>Amber</span> is worth a look.{' '}
                    <span className={styles.legendProblem}>Red</span> is something YouTube would reject. There is no total
                    score: compare the columns that matter for your video. Cut-offs use the four layouts from the single
                    checker.
                  </p>
                </>
              ) : (
                <div className={styles.previewsLoading} role="status">
                  Loading the YouTube font to measure your titles…
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
