'use client';

import styles from './TitleChecker.module.css';
import { TITLE_LIMIT, type Status } from './analysis';
import type { FullResult } from './compute';

const SHORT: Record<string, string> = {
  home: 'Home',
  mobile: 'Mobile',
  suggested: 'Suggested',
  search: 'Search',
};

interface Cell {
  text: string;
  status: Status;
}

const dash = (): Cell => ({ text: '–', status: 'ok' });

function cells(result: FullResult, hasKeyword: boolean): Record<string, Cell> {
  const { analysis, layouts } = result;
  const m = analysis.metrics;

  const lengthCell: Cell = {
    text: String(m.length),
    status: m.length > TITLE_LIMIT ? 'problem' : m.utf16Length > TITLE_LIMIT ? 'note' : 'ok',
  };

  let cut: Cell = { text: '…', status: 'info' };
  if (layouts) {
    const cutIds = layouts.filter((l) => l.layout.truncated).map((l) => SHORT[l.surface.id]);
    cut = cutIds.length ? { text: cutIds.join(', '), status: 'note' } : { text: 'Nowhere', status: 'ok' };
  }

  let front: Cell = { text: hasKeyword ? '–' : 'Add a keyword', status: 'info' };
  if (m.keyword) {
    if (m.keyword.found === 'missing') front = { text: 'Not in title', status: 'note' };
    else if (m.keyword.hiddenOn.length) {
      front = { text: `At ${m.keyword.start}–${m.keyword.end}, past the cut`, status: 'note' };
    } else front = { text: `At ${m.keyword.start}–${m.keyword.end}`, status: 'ok' };
  }

  const caps: Cell =
    m.letters < 4
      ? dash()
      : {
          text: `${Math.round(m.capsRatio * 100)}%`,
          status: (m.capsRatio >= 0.5 && m.letters >= 8) || m.shoutedWords.length >= 2 || m.capsRatio >= 0.25 ? 'note' : 'ok',
        };

  const punct: Cell = m.punctuation.length ? { text: m.punctuation.join(' '), status: 'note' } : dash();
  const repeats: Cell = m.adjacentRepeats.length
    ? { text: m.adjacentRepeats.join(', '), status: 'note' }
    : m.repeatedWords.length
      ? { text: m.repeatedWords.map((r) => `${r.word} ×${r.count}`).join(', '), status: 'note' }
      : dash();
  const brackets: Cell = m.invalid.length
    ? { text: `Has ${m.invalid.join(' ')}`, status: 'problem' }
    : m.unclosed.length
      ? { text: 'Unclosed', status: 'note' }
      : m.brackets.length
        ? { text: String(m.brackets.length), status: 'ok' }
        : dash();

  return {
    length: lengthCell,
    cut,
    front,
    caps,
    emoji: m.emoji ? { text: String(m.emoji), status: m.emoji >= 3 ? 'note' : 'ok' } : dash(),
    punct,
    repeats,
    number: m.numbers.length ? { text: m.numbers.join(', '), status: 'ok' } : { text: 'No', status: 'ok' },
    brackets,
  };
}

const COLUMNS: { key: string; label: string }[] = [
  { key: 'length', label: `Length (of ${TITLE_LIMIT})` },
  { key: 'cut', label: 'Cut on' },
  { key: 'front', label: 'Keyword position' },
  { key: 'caps', label: 'Capitals' },
  { key: 'emoji', label: 'Emoji' },
  { key: 'punct', label: '!!! / ???' },
  { key: 'repeats', label: 'Repeated words' },
  { key: 'number', label: 'Number' },
  { key: 'brackets', label: 'Brackets' },
];

export default function BatchTable({
  rows,
  hasKeyword,
  onOpen,
}: {
  rows: { title: string; result: FullResult }[];
  hasKeyword: boolean;
  onOpen: (title: string) => void;
}) {
  return (
    <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Comparison table, scrolls sideways">
      <table className={styles.table}>
        <caption className={styles.srOnly}>
          Checks for each title. Amber cells are worth a look. Red cells are something YouTube would reject.
        </caption>
        <thead>
          <tr>
            <th scope="col" className={styles.thNum}>
              #
            </th>
            <th scope="col" className={styles.thTitle}>
              Title
            </th>
            {COLUMNS.map((c) => (
              <th key={c.key} scope="col">
                {c.label}
              </th>
            ))}
            <th scope="col">
              <span className={styles.srOnly}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ title, result }, i) => {
            const c = cells(result, hasKeyword);
            return (
              <tr key={`${i}-${title}`}>
                <td className={styles.tdNum}>{i + 1}</td>
                <th scope="row" className={styles.tdTitle}>
                  {title}
                </th>
                {COLUMNS.map((col) => (
                  <td key={col.key} className={styles[`cell_${c[col.key].status}` as keyof typeof styles]}>
                    {c[col.key].text}
                    {c[col.key].status === 'note' && <span className={styles.srOnly}> (worth a look)</span>}
                    {c[col.key].status === 'problem' && <span className={styles.srOnly}> (problem)</span>}
                  </td>
                ))}
                <td>
                  <button type="button" className={styles.linkBtn} onClick={() => onOpen(title)}>
                    Open<span className={styles.srOnly}> title {i + 1} in the checker</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

