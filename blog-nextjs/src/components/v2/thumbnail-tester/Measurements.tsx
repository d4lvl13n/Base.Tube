'use client';

import type { CSSProperties } from 'react';
import styles from './ThumbnailTester.module.css';
import { buildObservations, type Variant, type VariantStats } from './analysis';
import { METHOD } from './content';

interface Row {
  key: keyof VariantStats;
  label: string;
  sub: string;
  format: (n: number) => string;
  /** Value that fills the bar completely. */
  full: number;
}

const ROWS: Row[] = [
  {
    key: 'brightness',
    label: 'Average brightness',
    sub: '0% is black, 100% is white.',
    format: (n) => `${Math.round(n)}%`,
    full: 100,
  },
  {
    key: 'tonalRange',
    label: 'Contrast: light to dark',
    sub: 'Gap between the lightest and darkest parts.',
    format: (n) => `${Math.round(n)}%`,
    full: 100,
  },
  {
    key: 'glanceRange',
    label: 'Contrast after a blur',
    sub: 'The same gap once fine detail is lost.',
    format: (n) => `${Math.round(n)}%`,
    full: 100,
  },
  {
    key: 'saturation',
    label: 'Colour: average saturation',
    sub: '0% is grey, 100% is pure colour.',
    format: (n) => `${Math.round(n)}%`,
    full: 100,
  },
  {
    key: 'edgeDark',
    label: 'Outline blends into a dark feed',
    sub: 'Share of the outer edge within 1.5:1 contrast of #0f0f0f.',
    format: (n) => `${Math.round(n)}%`,
    full: 100,
  },
  {
    key: 'edgeLight',
    label: 'Outline blends into a light feed',
    sub: 'Share of the outer edge within 1.5:1 contrast of white.',
    format: (n) => `${Math.round(n)}%`,
    full: 100,
  },
  {
    key: 'badgeDetail',
    label: 'Detail under the duration badge',
    sub: 'Edge strength in the badge corner, against the image average.',
    format: (n) => `${n.toFixed(1)}x`,
    full: 3,
  },
];

function fileSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function Measurements({ variants }: { variants: Variant[] }) {
  const observations = buildObservations(variants);

  return (
    <div>
      <p className={styles.notice}>
        These describe the images. They are not predictions of clicks, and nothing here ranks your variants. Real
        viewers, on real impressions, decide which one works.
      </p>

      {observations.length > 0 ? (
        <ul className={styles.obs}>
          {observations.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      ) : (
        <p className={styles.stepHint}>Add a second variant to see how they compare. The numbers for this one are below.</p>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table} style={{ ...({ '--n': variants.length } as CSSProperties) }}>
          <caption className={styles.srOnly}>Measurements for each thumbnail variant</caption>
          <thead>
            <tr>
              <th scope="col">Measure</th>
              {variants.map((v) => (
                <th scope="col" key={v.id}>
                  <span className={styles.colHeadCell}>
                    <span className={styles.chip}>{v.id}</span>
                    Variant {v.id}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <div className={styles.rowLabel}>File</div>
                <div className={styles.rowSub}>Size and shape of the image you added.</div>
              </th>
              {variants.map((v) => (
                <td key={v.id} data-v={v.id}>
                  <div className={styles.val}>
                    {v.sourceWidth} × {v.sourceHeight}
                  </div>
                  <div className={styles.valSub}>
                    {v.aspectOk ? '16:9' : 'Not 16:9'} · {fileSize(v.fileBytes)}
                  </div>
                </td>
              ))}
            </tr>
            {ROWS.map((r) => (
              <tr key={r.key}>
                <th scope="row">
                  <div className={styles.rowLabel}>{r.label}</div>
                  <div className={styles.rowSub}>{r.sub}</div>
                </th>
                {variants.map((v) => {
                  const n = v.stats[r.key];
                  return (
                    <td key={v.id} data-v={v.id}>
                      <div className={styles.val}>{r.format(n)}</div>
                      <div className={styles.barTrack} aria-hidden>
                        <div className={styles.barFill} style={{ width: `${Math.min(100, (n / r.full) * 100)}%` }} />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className={styles.method}>
        <summary>How these are measured</summary>
        <div className={styles.methodList}>
          {METHOD.map((m) => (
            <div className={styles.dlRow} key={m.name}>
              <div className={styles.dlTerm}>{m.name}</div>
              <div className={styles.dlBody}>{m.body}</div>
            </div>
          ))}
          <div className={styles.dlRow}>
            <div className={styles.dlTerm}>Where it runs</div>
            <div className={styles.dlBody}>
              Every number comes from plain arithmetic on a 320 × 180 copy of your image, inside this browser tab. There
              is no model, no AI and no upload.
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
