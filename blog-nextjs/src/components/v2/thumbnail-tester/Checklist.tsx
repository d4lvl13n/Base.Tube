'use client';

import { useState, type CSSProperties } from 'react';
import styles from './ThumbnailTester.module.css';
import type { Variant } from './analysis';

const ITEMS = [
  { key: 'focal', label: 'One clear focal point', hint: 'One thing your eye lands on first. The Squint test shows it.' },
  {
    key: 'text',
    label: 'Five words of text or fewer',
    hint: 'Or no text at all. A common rule of thumb, not a YouTube rule.',
  },
  { key: 'small', label: 'Still readable when tiny', hint: 'Check the Tiny test: subject and words both survive.' },
  { key: 'face', label: 'Face and emotion are clear', hint: 'Skip this if there is no face in the thumbnail.' },
  { key: 'title', label: 'Works with the title', hint: 'The thumbnail and the title each add something, and neither repeats the other.' },
];

export default function Checklist({ variants }: { variants: Variant[] }) {
  const [ticks, setTicks] = useState<Record<string, boolean>>({});

  return (
    <div>
      <p className={styles.stepHint}>
        Some things a computer cannot judge for you. Tick what is true for each variant. This is your own note; it is not
        saved anywhere and it is not a score.
      </p>
      <div className={styles.tableWrap}>
        <table className={`${styles.table} ${styles.matrix}`} style={{ ...({ '--n': variants.length } as CSSProperties) }}>
          <caption className={styles.srOnly}>Manual checklist for each thumbnail variant</caption>
          <thead>
            <tr>
              <th scope="col">Check</th>
              {variants.map((v) => (
                <th scope="col" key={v.id} className={`${styles.matrixCell} ${styles.matrixHead}`}>
                  <span className={styles.colHeadCell}>
                    <span className={styles.chip}>{v.id}</span>
                  </span>
                  <span className={styles.srOnly}>Variant {v.id}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((it) => (
              <tr key={it.key}>
                <th scope="row">
                  <div className={styles.rowLabel}>{it.label}</div>
                  <div className={styles.rowSub}>{it.hint}</div>
                </th>
                {variants.map((v) => {
                  const k = `${v.id}:${it.key}`;
                  return (
                    <td key={v.id} className={styles.matrixCell} data-v={v.id}>
                      <input
                        type="checkbox"
                        checked={!!ticks[k]}
                        aria-label={`Variant ${v.id}: ${it.label}`}
                        onChange={(e) => setTicks((t) => ({ ...t, [k]: e.target.checked }))}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <th scope="row">
                <div className={styles.tally}>Ticked</div>
              </th>
              {variants.map((v) => (
                <td key={v.id} className={styles.matrixCell} data-v={v.id}>
                  <span className={styles.tally}>
                    {ITEMS.filter((it) => ticks[`${v.id}:${it.key}`]).length} of {ITEMS.length}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
