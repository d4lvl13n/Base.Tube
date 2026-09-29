/**
 * Title checks. Plain string analysis, no network, no model.
 * Every check returns guidance in words, never a score.
 */

export const TITLE_LIMIT = 100;
export const BATCH_MAX = 10;

export type Status = 'ok' | 'note' | 'problem' | 'info';

/** What one screen does to the title, computed elsewhere from real text widths. */
export interface SurfaceCut {
  id: string;
  label: string;
  truncated: boolean;
  visibleChars: number;
  totalChars: number;
  hiddenText: string;
}

export interface Check {
  id: string;
  label: string;
  status: Status;
  summary: string;
  detail?: string;
}

export interface KeywordResult {
  keyword: string;
  found: 'phrase' | 'words' | 'missing';
  /** Code point positions, 1-based, inclusive. */
  start: number;
  end: number;
  hiddenOn: string[];
}

export interface Metrics {
  length: number;
  utf16Length: number;
  letters: number;
  capsRatio: number;
  shoutedWords: string[];
  emoji: number;
  punctuation: string[];
  repeatedWords: { word: string; count: number }[];
  adjacentRepeats: string[];
  numbers: string[];
  brackets: { text: string; start: number; end: number }[];
  unclosed: string[];
  invalid: string[];
  spacing: string[];
  keyword: KeywordResult | null;
  cutOn: string[];
}

export interface Analysis {
  title: string;
  metrics: Metrics;
  checks: Check[];
}

export interface AnalyzeOptions {
  keyword?: string;
  thumbnailText?: string;
  cuts?: SurfaceCut[];
}

const cp = (s: string) => Array.from(s);
const cpLen = (s: string) => cp(s).length;
const quote = (s: string) => `“${s}”`;
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const list = (items: string[], conj = 'and') => {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} ${conj} ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} ${conj} ${items[items.length - 1]}`;
};

const STOPWORDS = new Set(
  (
    'a an the and or but nor of to in on at for with from by as is are was were be been it its this that these those ' +
    'i me my we our you your he she they them his her their how what why when who which do does did not no so if than ' +
    'then vs via up out into over about'
  ).split(' ')
);

const WORD_RE = /[\p{L}\p{N}]+(?:['’][\p{L}]+)?/gu;
const wordsOf = (s: string) => (s.toLowerCase().match(WORD_RE) ?? []) as string[];

const VS16 = String.fromCharCode(0xfe0f); // forces emoji presentation
const KEYCAP_RE = new RegExp('^[0-9#*]\\uFE0F?\\u20E3$', 'u');

/** Count emoji as viewers see them: one per grapheme, not per code point. */
function emojiGraphemes(s: string): string[] {
  const parts: string[] =
    typeof Intl !== 'undefined' && 'Segmenter' in Intl
      ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s), (g) => g.segment)
      : cp(s);
  return parts.filter((g) => {
    if (KEYCAP_RE.test(g)) return true; // keycaps
    if (/\p{Regional_Indicator}/u.test(g)) return true; // flags
    if (!/\p{Extended_Pictographic}/u.test(g)) return false;
    const first = g.codePointAt(0) ?? 0;
    // Symbols like (c), (R), TM and plain arrows are text unless forced to emoji with VS16.
    if (first < 0x2300 && !g.includes(VS16)) return false;
    return true;
  });
}

function findRuns(title: string): string[] {
  const found = title.match(/[!?！？]{2,}|([^\p{L}\p{N}\s.])\1{2,}|\.{4,}/gu) ?? [];
  // Emoji runs are counted by the emoji check, not here.
  return Array.from(new Set(found.filter((m) => !/\p{Extended_Pictographic}/u.test(m))));
}

const OPEN = '([{【（「『《';
const CLOSE = ')]}】）」』》';

function findBrackets(title: string) {
  const chars = cp(title);
  const stack: { ch: string; idx: number }[] = [];
  const groups: { text: string; start: number; end: number }[] = [];
  const unclosed: string[] = [];
  chars.forEach((ch, idx) => {
    if (OPEN.includes(ch)) {
      stack.push({ ch, idx });
    } else if (CLOSE.includes(ch)) {
      const open = stack.pop();
      if (open && OPEN.indexOf(open.ch) === CLOSE.indexOf(ch)) {
        groups.push({ text: chars.slice(open.idx, idx + 1).join(''), start: open.idx + 1, end: idx + 1 });
      } else {
        unclosed.push(ch);
        if (open) stack.push(open);
      }
    }
  });
  stack.forEach((o) => unclosed.push(o.ch));
  groups.sort((a, b) => a.start - b.start);
  return { groups, unclosed };
}

function leadingTag(title: string): string | null {
  const re = new RegExp(
    '^(?:[\\[(\\u3010\\uFF08][^\\])\\u3011\\uFF09]{1,40}[\\])\\u3011\\uFF09]|\\p{Extended_Pictographic}+\\uFE0F?|' +
      '(?:ep(?:isode)?|part|day|vlog|#)\\s*\\.?\\s*\\d+\\s*[:|\\-\\u2013\\u2014]?)',
    'iu'
  );
  const m = title.match(re);
  return m ? m[0].trim() : null;
}

function locateKeyword(title: string, keywordRaw: string, cuts: SurfaceCut[]): KeywordResult | null {
  const keyword = keywordRaw.replace(/\s+/g, ' ').trim();
  if (!keyword) return null;
  const lower = title.toLowerCase();
  const kw = keyword.toLowerCase();
  const toCp = (utf16Index: number) => cpLen(title.slice(0, utf16Index));

  const hiddenFor = (endCp: number) => cuts.filter((c) => endCp > c.visibleChars).map((c) => c.label);

  const at = lower.indexOf(kw);
  if (at !== -1) {
    const start = toCp(at) + 1;
    const end = start + cpLen(kw) - 1;
    return { keyword, found: 'phrase', start, end, hiddenOn: hiddenFor(end) };
  }
  const parts = wordsOf(kw);
  if (parts.length > 1) {
    const spans = parts.map((p) => {
      const i = lower.indexOf(p);
      return i === -1 ? null : { start: toCp(i) + 1, end: toCp(i) + cpLen(p) };
    });
    if (spans.every(Boolean)) {
      const s = spans as { start: number; end: number }[];
      const start = Math.min(...s.map((x) => x.start));
      const end = Math.max(...s.map((x) => x.end));
      return { keyword, found: 'words', start, end, hiddenOn: hiddenFor(end) };
    }
  }
  return { keyword, found: 'missing', start: 0, end: 0, hiddenOn: [] };
}

export function normalizeTitle(raw: string): string {
  return raw.replace(/[\r\n\t]+/g, ' ').trim();
}

export function analyzeTitle(rawTitle: string, options: AnalyzeOptions = {}): Analysis {
  const title = normalizeTitle(rawTitle);
  const cuts = options.cuts ?? [];
  const length = cpLen(title);
  const utf16Length = title.length;

  // Capitals
  const letterChars = cp(title).filter((c) => c.toLowerCase() !== c.toUpperCase());
  const upperLetters = letterChars.filter((c) => c === c.toUpperCase());
  const letters = letterChars.length;
  const capsRatio = letters ? upperLetters.length / letters : 0;
  const shoutedWords = Array.from(
    new Set(
      (title.match(/[\p{L}\p{N}'’]+/gu) ?? []).filter((w) => {
        const wl = cp(w).filter((c) => c.toLowerCase() !== c.toUpperCase());
        return wl.length >= 4 && wl.every((c) => c === c.toUpperCase());
      })
    )
  );

  const emojiList = emojiGraphemes(title);
  const punctuation = findRuns(title);

  // Repeated words
  const words = wordsOf(title);
  const counts = new Map<string, number>();
  words.forEach((w) => {
    if (w.length < 3 || STOPWORDS.has(w) || /^\d+$/.test(w)) return;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  });
  const repeatedWords = Array.from(counts.entries())
    .filter(([, n]) => n > 1)
    .map(([word, count]) => ({ word, count }));
  const adjacentRepeats: string[] = [];
  for (let i = 1; i < words.length; i++) {
    if (words[i] === words[i - 1] && !/^\d+$/.test(words[i])) adjacentRepeats.push(`${words[i]} ${words[i]}`);
  }

  const numbers = title.match(/\d+(?:[.,]\d+)*/g) ?? [];
  const { groups, unclosed } = findBrackets(title);
  const invalid = Array.from(new Set(title.match(/[<>]/g) ?? []));

  const spacing: string[] = [];
  if (/ {2,}/.test(rawTitle.trim())) spacing.push('double spaces');
  if (rawTitle !== rawTitle.trim() && rawTitle.trim() !== '') spacing.push('spaces at the start or end');

  const keyword = locateKeyword(title, options.keyword ?? '', cuts);
  const cutOn = cuts.filter((c) => c.truncated).map((c) => c.label);

  const metrics: Metrics = {
    length,
    utf16Length,
    letters,
    capsRatio,
    shoutedWords,
    emoji: emojiList.length,
    punctuation,
    repeatedWords,
    adjacentRepeats,
    numbers,
    brackets: groups,
    unclosed,
    invalid,
    spacing,
    keyword,
    cutOn,
  };

  if (title === '') {
    return {
      title,
      metrics,
      checks: [
        {
          id: 'length',
          label: 'Length',
          status: 'info',
          summary: `Type or paste a title to check it. YouTube allows up to ${TITLE_LIMIT} characters.`,
        },
      ],
    };
  }

  const checks: Check[] = [];

  // 1. Length
  if (length > TITLE_LIMIT) {
    checks.push({
      id: 'length',
      label: 'Length',
      status: 'problem',
      summary: `${length} characters. That is ${plural(length - TITLE_LIMIT, 'character')} over YouTube’s ${TITLE_LIMIT}-character limit, so YouTube will not accept it as it is.`,
    });
  } else if (utf16Length > TITLE_LIMIT) {
    checks.push({
      id: 'length',
      label: 'Length',
      status: 'note',
      summary: `${length} of ${TITLE_LIMIT} characters, counting each emoji as one.`,
      detail: `YouTube does not say how it counts emoji. If it counts each one as two, this title is ${utf16Length} long and over the limit. Leave some room.`,
    });
  } else {
    checks.push({
      id: 'length',
      label: 'Length',
      status: 'ok',
      summary: `${length} of ${TITLE_LIMIT} characters. ${plural(TITLE_LIMIT - length, 'character')} to spare.`,
    });
  }

  // 2. Cut-off
  if (cuts.length) {
    const cutSurfaces = cuts.filter((c) => c.truncated);
    if (cutSurfaces.length === 0) {
      checks.push({
        id: 'cutoff',
        label: 'Cut-off',
        status: 'ok',
        summary: `Shown in full in all ${cuts.length} places above.`,
      });
    } else {
      const worst = [...cutSurfaces].sort((a, b) => a.visibleChars - b.visibleChars)[0];
      checks.push({
        id: 'cutoff',
        label: 'Cut-off',
        status: 'note',
        summary: `Cut in ${cutSurfaces.length} of ${cuts.length} places: ${list(
          cutSurfaces.map((c) => `${c.label} (after ${c.visibleChars} characters)`)
        )}.`,
        detail: `${worst.label} hides ${quote(worst.hiddenText)}. Anything a viewer needs in order to click should come before that point.`,
      });
    }
  }

  // 3. Front-loading
  const minVisible = cuts.length ? Math.min(...cuts.map((c) => c.visibleChars)) : 40;
  if (!keyword) {
    const first = cp(title).slice(0, 40).join('').trimEnd();
    const tag = leadingTag(title);
    checks.push({
      id: 'frontload',
      label: 'Front-loading',
      status: 'info',
      summary: `The first 40 characters read ${quote(first + (length > 40 ? '…' : ''))}. Add your main keyword above to check where it sits.`,
      detail: tag
        ? `The title opens with ${quote(tag)}, which uses ${plural(cpLen(tag), 'character')} before the topic starts.`
        : undefined,
    });
  } else if (keyword.found === 'missing') {
    checks.push({
      id: 'frontload',
      label: 'Front-loading',
      status: 'note',
      summary: `${quote(keyword.keyword)} is not in the title.`,
      detail: 'If it is what the video is about, viewers scanning the title will not see it.',
    });
  } else {
    const where = `characters ${keyword.start} to ${keyword.end}`;
    const asWords = keyword.found === 'words' ? ' The words are there, but not as one phrase.' : '';
    if (keyword.hiddenOn.length === 0) {
      checks.push({
        id: 'frontload',
        label: 'Front-loading',
        status: 'ok',
        summary: `${quote(keyword.keyword)} sits at ${where}, visible in all ${cuts.length || 4} places.${asWords}`,
      });
    } else {
      checks.push({
        id: 'frontload',
        label: 'Front-loading',
        status: 'note',
        summary: `${quote(keyword.keyword)} sits at ${where}, past the cut on ${list(keyword.hiddenOn)}.${asWords}`,
        detail: `Titles are cut after about ${minVisible} characters on the smallest screen here. Moving the keyword to the first 40 to 50 characters keeps it visible everywhere.`,
      });
    }
  }

  // 4. Capitals
  if (letters < 4) {
    checks.push({ id: 'caps', label: 'Capitals', status: 'info', summary: 'Too few letters to check.' });
  } else {
    const pct = Math.round(capsRatio * 100);
    if (capsRatio >= 0.5 && letters >= 8) {
      checks.push({
        id: 'caps',
        label: 'Capitals',
        status: 'note',
        summary: `${pct}% of the letters are capitals. Long stretches of capitals are harder to read and can come across as shouting.`,
        detail: shoutedWords.length ? `All-caps words: ${list(shoutedWords.map(quote))}.` : undefined,
      });
    } else if (shoutedWords.length >= 2 || capsRatio >= 0.25) {
      checks.push({
        id: 'caps',
        label: 'Capitals',
        status: 'note',
        summary: `${pct}% capitals. ${shoutedWords.length ? `All-caps words: ${list(shoutedWords.map(quote))}.` : 'Check that each capital is on purpose.'}`,
        detail: 'Short acronyms such as AI or GTA are normal.',
      });
    } else {
      checks.push({
        id: 'caps',
        label: 'Capitals',
        status: 'ok',
        summary: `${pct}% capitals.${shoutedWords.length ? ` One all-caps word: ${quote(shoutedWords[0])}.` : ' Normal capitalisation.'}`,
      });
    }
  }

  // 5. Emoji
  if (metrics.emoji === 0) {
    checks.push({ id: 'emoji', label: 'Emoji', status: 'ok', summary: 'No emoji.' });
  } else if (metrics.emoji <= 2) {
    checks.push({
      id: 'emoji',
      label: 'Emoji',
      status: 'ok',
      summary: `${plural(metrics.emoji, 'emoji', 'emoji')}: ${emojiList.join(' ')}`,
      detail: 'Emoji look slightly different on each device and take space from the words.',
    });
  } else {
    checks.push({
      id: 'emoji',
      label: 'Emoji',
      status: 'note',
      summary: `${metrics.emoji} emoji: ${emojiList.join(' ')}`,
      detail: 'Emoji are small on a phone and take space from the words. Check the previews above.',
    });
  }

  // 6. Punctuation
  if (punctuation.length === 0) {
    checks.push({ id: 'punctuation', label: 'Punctuation', status: 'ok', summary: 'No repeated punctuation.' });
  } else {
    checks.push({
      id: 'punctuation',
      label: 'Punctuation',
      status: 'note',
      summary: `Repeated punctuation: ${list(punctuation.map(quote))}.`,
      detail: 'A run like this takes room without adding information, and can look like spam.',
    });
  }

  // 7. Repeated words
  if (adjacentRepeats.length) {
    checks.push({
      id: 'repeats',
      label: 'Repeated words',
      status: 'note',
      summary: `The same word twice in a row: ${list(adjacentRepeats.map(quote))}. Probably a typo.`,
    });
  } else if (repeatedWords.length) {
    checks.push({
      id: 'repeats',
      label: 'Repeated words',
      status: 'note',
      summary: `Repeated: ${list(repeatedWords.map((r) => `${quote(r.word)} (${r.count}×)`))}.`,
      detail: 'Repeating a word costs characters. Fine if it is on purpose.',
    });
  } else {
    checks.push({ id: 'repeats', label: 'Repeated words', status: 'ok', summary: 'No repeated words.' });
  }

  // 8. Numbers
  checks.push({
    id: 'numbers',
    label: 'Numbers',
    status: 'info',
    summary: numbers.length
      ? `Has ${plural(numbers.length, 'number')}: ${list(numbers.map(quote))}.`
      : 'No number in the title.',
    detail: numbers.length ? undefined : 'A number is not required. This only tells you whether one is there.',
  });

  // 9. Brackets and symbols
  const bracketHidden = keywordFreeBracketCuts(groups, cuts);
  if (invalid.length) {
    checks.push({
      id: 'brackets',
      label: 'Brackets and symbols',
      status: 'problem',
      summary: `YouTube does not allow ${list(invalid.map(quote), 'or')} in a title. Remove ${invalid.length === 1 ? 'it' : 'them'}.`,
    });
  } else if (unclosed.length) {
    checks.push({
      id: 'brackets',
      label: 'Brackets and symbols',
      status: 'note',
      summary: `Unclosed bracket: ${list(unclosed.map(quote))}. Check for a typo.`,
    });
  } else if (groups.length) {
    checks.push({
      id: 'brackets',
      label: 'Brackets and symbols',
      status: bracketHidden.length ? 'note' : 'ok',
      summary: `${plural(groups.length, 'bracketed part')}: ${list(groups.map((g) => quote(g.text)))}.`,
      detail: bracketHidden.length
        ? `${list(bracketHidden.map((b) => quote(b.text)))} ${bracketHidden.length === 1 ? 'runs' : 'run'} past the cut on ${list(Array.from(new Set(bracketHidden.flatMap((b) => b.on))))}.`
        : undefined,
    });
  } else {
    checks.push({ id: 'brackets', label: 'Brackets and symbols', status: 'ok', summary: 'No brackets or parentheses.' });
  }
  if (spacing.length) {
    const last = checks[checks.length - 1];
    last.status = last.status === 'problem' ? 'problem' : 'note';
    last.detail = [last.detail, `Also: ${list(spacing)}. Extra spaces are trimmed or shown as one.`].filter(Boolean).join(' ');
  }

  // 10. Thumbnail words
  const thumbWords = Array.from(new Set(wordsOf(options.thumbnailText ?? '').filter((w) => !STOPWORDS.has(w) && w.length > 1)));
  if (thumbWords.length) {
    const titleWords = new Set(words);
    const shared = thumbWords.filter((w) => titleWords.has(w));
    if (shared.length === thumbWords.length) {
      checks.push({
        id: 'thumbnail',
        label: 'Thumbnail text',
        status: 'note',
        summary: 'Every word on the thumbnail is already in the title. The two say the same thing.',
        detail: 'Use the thumbnail for something the title does not say: the payoff, a number, a reaction.',
      });
    } else if (shared.length > 0) {
      checks.push({
        id: 'thumbnail',
        label: 'Thumbnail text',
        status: 'ok',
        summary: `${shared.length} of ${thumbWords.length} thumbnail words repeat the title (${list(shared.map(quote))}). The rest add something new.`,
      });
    } else {
      checks.push({
        id: 'thumbnail',
        label: 'Thumbnail text',
        status: 'ok',
        summary: 'The thumbnail text does not repeat the title. They can add to each other.',
      });
    }
  } else {
    checks.push({
      id: 'thumbnail',
      label: 'Thumbnail text',
      status: 'info',
      summary: 'Type the words on your thumbnail above to check that it does not just repeat the title.',
    });
  }

  return { title, metrics, checks };
}

function keywordFreeBracketCuts(groups: { text: string; start: number; end: number }[], cuts: SurfaceCut[]) {
  return groups
    .map((g) => ({ text: g.text, on: cuts.filter((c) => c.truncated && g.end > c.visibleChars).map((c) => c.label) }))
    .filter((g) => g.on.length > 0);
}

/** One title per line, blank lines dropped, capped at BATCH_MAX. */
export function parseBatch(text: string): { titles: string[]; extra: number } {
  const all = text
    .split(/\r?\n/)
    .map((l) => normalizeTitle(l))
    .filter(Boolean);
  return { titles: all.slice(0, BATCH_MAX), extra: Math.max(0, all.length - BATCH_MAX) };
}
