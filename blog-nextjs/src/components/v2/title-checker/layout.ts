/**
 * Line layout for a video title, the way a browser lays out a clamped block:
 * greedy word wrap at a fixed width, then the last allowed line is cut with an
 * ellipsis. Pure and dependency free: text width comes from the `measure`
 * callback (canvas measureText in the browser, a fake in tests).
 */

export interface LayoutResult {
  /** Lines as drawn. When truncated, the last line ends with the ellipsis. */
  lines: string[];
  truncated: boolean;
  /** Part of the title that stays visible (no ellipsis, trimmed). */
  visibleText: string;
  /** Part of the title that is hidden (trimmed). Empty when not truncated. */
  hiddenText: string;
  /** Visible characters (Unicode code points). */
  visibleChars: number;
  totalChars: number;
  /** Lines the title would need with no limit. */
  naturalLines: number;
}

interface Unit {
  text: string;
  start: number;
  spaceAfter: boolean;
}

const ELLIPSIS = '…';
// Rounding slack only. Widths must come from a canvas with fontKerning = 'normal',
// which then matches the DOM to within a few hundredths of a pixel.
const EPSILON = 0.05;

const isAlnum = (ch: string | undefined) => !!ch && /[\p{L}\p{N}]/u.test(ch);

// Characters that browsers may break around even without a space: emoji and CJK.
const BREAKABLE = /[\p{Extended_Pictographic}\p{Regional_Indicator}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
// Never start a line with these, never end one with an opening bracket.
const NO_START = new RegExp('^[,.:;!?)\\]}|/%…、。，．！？）」』】ーぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ\\uFE0F\\u200D]', 'u');
const NO_END = /[([{「『【（]$/u;

function graphemes(s: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s), (g) => g.segment);
  }
  return Array.from(s);
}

/** Split a run of text where a browser may break inside it: around emoji and CJK characters. */
function breakInside(piece: string): string[] {
  if (!BREAKABLE.test(piece)) return [piece];
  const gs = graphemes(piece);
  const parts: string[] = [];
  let cur = gs[0];
  for (let i = 1; i < gs.length; i++) {
    const a = gs[i - 1];
    const b = gs[i];
    const canBreak = (BREAKABLE.test(a) || BREAKABLE.test(b)) && !NO_START.test(b) && !NO_END.test(a);
    if (canBreak) {
      parts.push(cur);
      cur = b;
    } else {
      cur += b;
    }
  }
  parts.push(cur);
  return parts;
}

/** Split into words, also allowing breaks after a hyphen or dash inside a word and around emoji/CJK. */
function toUnits(text: string): Unit[] {
  const units: Unit[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const word = m[0];
    const wordStart = m.index;
    const endsAt = wordStart + word.length;

    // First cut the word after inner hyphens and dashes.
    const pieces: { text: string; start: number }[] = [];
    let pieceStart = 0;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      const isDash = ch === '-' || ch === '–' || ch === '—';
      if (isDash && i < word.length - 1 && isAlnum(word[i - 1]) && isAlnum(word[i + 1])) {
        pieces.push({ text: word.slice(pieceStart, i + 1), start: wordStart + pieceStart });
        pieceStart = i + 1;
      }
    }
    pieces.push({ text: word.slice(pieceStart), start: wordStart + pieceStart });

    // Then cut each piece around emoji and CJK characters.
    const flat: { text: string; start: number }[] = [];
    for (const p of pieces) {
      let offset = p.start;
      for (const part of breakInside(p.text)) {
        flat.push({ text: part, start: offset });
        offset += part.length;
      }
    }
    flat.forEach((f, idx) => {
      units.push({ text: f.text, start: f.start, spaceAfter: idx === flat.length - 1 && endsAt < text.length });
    });
  }
  return units;
}

interface RawLine {
  text: string; // no trailing space
  start: number;
  end: number; // exclusive, index in source text
  trailingSpace: boolean;
}

function wrap(text: string, width: number, measure: (s: string) => number): RawLine[] {
  const units = toUnits(text);
  const lines: RawLine[] = [];
  let cur = '';
  let curStart = 0;
  let curEnd = 0;
  let curSpace = false;

  const push = () => {
    if (cur === '') return;
    lines.push({ text: cur, start: curStart, end: curEnd, trailingSpace: curSpace });
    cur = '';
    curSpace = false;
  };

  for (const unit of units) {
    const joined = cur === '' ? unit.text : cur + (curSpace ? ' ' : '') + unit.text;
    if (measure(joined) <= width + EPSILON) {
      if (cur === '') curStart = unit.start;
      cur = joined;
      curEnd = unit.start + unit.text.length;
      curSpace = unit.spaceAfter;
      continue;
    }
    // Does not fit: close the current line, then place the unit on a fresh one.
    push();
    if (measure(unit.text) <= width + EPSILON) {
      cur = unit.text;
      curStart = unit.start;
      curEnd = unit.start + unit.text.length;
      curSpace = unit.spaceAfter;
      continue;
    }
    // A single word wider than the line: break it by character.
    const chars = graphemes(unit.text);
    let chunk = '';
    let offset = unit.start;
    let chunkStart = unit.start;
    for (const ch of chars) {
      const next = chunk + ch;
      if (chunk !== '' && measure(next) > width + EPSILON) {
        lines.push({ text: chunk, start: chunkStart, end: offset, trailingSpace: false });
        chunk = ch;
        chunkStart = offset;
      } else {
        chunk = next;
      }
      offset += ch.length;
    }
    cur = chunk;
    curStart = chunkStart;
    curEnd = offset;
    curSpace = unit.spaceAfter;
  }
  push();
  return lines;
}

export function layoutTitle(
  rawText: string,
  opts: { width: number; maxLines: number; measure: (s: string) => number }
): LayoutResult {
  const text = rawText.replace(/\s+/g, ' ').trim();
  const { width, maxLines, measure } = opts;
  const totalChars = Array.from(text).length;

  if (text === '') {
    return { lines: [], truncated: false, visibleText: '', hiddenText: '', visibleChars: 0, totalChars: 0, naturalLines: 0 };
  }

  const raw = wrap(text, width, measure);
  if (raw.length <= maxLines) {
    return {
      lines: raw.map((l) => l.text),
      truncated: false,
      visibleText: text,
      hiddenText: '',
      visibleChars: totalChars,
      totalChars,
      naturalLines: raw.length,
    };
  }

  // Truncated: keep the first maxLines - 1 lines, cut the last kept line to fit the ellipsis.
  const kept = raw.slice(0, maxLines);
  const last = kept[maxLines - 1];
  // The browser keeps a trailing space before the ellipsis when the line ends on a space.
  let lastText = last.text + (last.trailingSpace ? ' ' : '');
  let cutEnd = last.end;
  if (measure(lastText + ELLIPSIS) > width + EPSILON) {
    const chars = graphemes(last.text);
    let keep = chars.length;
    while (keep > 0 && measure(chars.slice(0, keep).join('') + ELLIPSIS) > width + EPSILON) keep--;
    lastText = chars.slice(0, keep).join('');
    cutEnd = last.start + lastText.length;
  }

  const lines = kept.slice(0, maxLines - 1).map((l) => l.text);
  lines.push(lastText + ELLIPSIS);

  const visibleText = text.slice(0, cutEnd).trimEnd();
  const hiddenText = text.slice(cutEnd).trim();
  return {
    lines,
    truncated: true,
    visibleText,
    hiddenText,
    visibleChars: Array.from(visibleText).length,
    totalChars,
    naturalLines: raw.length,
  };
}
