// @ts-check
/**
 * markdown-lite — turns the Markdown body of a content file into a small tree
 * that React renders safely (no raw HTML is ever injected into the page).
 *
 * Supported blocks : ## and ### headings, paragraphs, "- " bullet lists,
 *                    "1. " numbered lists, "> " quotes, "---" separators.
 * Supported inline : **bold**, *italic*, `code`, [link text](/path or https://...)
 * Not rendered     : images (the gallery handles images), raw HTML, tables,
 *                    code blocks. The validator reports them.
 */

/** @typedef {import('./markdown-lite.d.mts').Inline} Inline */
/** @typedef {import('./markdown-lite.d.mts').Block} Block */
/** @typedef {import('./markdown-lite.d.mts').MarkdownProblem} MarkdownProblem */

const INLINE_RE =
  /(`[^`\n]+`)|(\[([^\]\n]+)\]\(([^)\s]+)(?:\s+"[^"\n]*")?\))|(\*\*(?=\S)([\s\S]*?\S)\*\*)|(__(?=\S)([\s\S]*?\S)__)|(\*(?=[^\s*])([^*\n]*?[^\s*])\*)|((?<![A-Za-z0-9])_(?=\S)([^_\n]*?\S)_(?![A-Za-z0-9]))/;

/**
 * @param {string} text
 * @returns {Inline[]}
 */
export function parseInline(text) {
  /** @type {Inline[]} */
  const out = [];
  let rest = text;
  while (rest.length) {
    const m = INLINE_RE.exec(rest);
    if (!m) {
      out.push({ type: 'text', value: rest });
      break;
    }
    if (m.index > 0) out.push({ type: 'text', value: rest.slice(0, m.index) });
    if (m[1]) out.push({ type: 'code', value: m[1].slice(1, -1) });
    else if (m[2]) out.push({ type: 'link', href: m[4], children: parseInline(m[3]) });
    else if (m[5]) out.push({ type: 'strong', children: parseInline(m[6]) });
    else if (m[7]) out.push({ type: 'strong', children: parseInline(m[8]) });
    else if (m[9]) out.push({ type: 'em', children: parseInline(m[10]) });
    else if (m[11]) out.push({ type: 'em', children: parseInline(m[12]) });
    rest = rest.slice(m.index + m[0].length);
  }
  return mergeText(out);
}

/** @param {Inline[]} nodes */
function mergeText(nodes) {
  /** @type {Inline[]} */
  const out = [];
  for (const n of nodes) {
    const last = out[out.length - 1];
    if (n.type === 'text' && last && last.type === 'text') last.value += n.value;
    else out.push(n);
  }
  return out;
}

/**
 * @param {string} s
 * @returns {string}
 */
export function slugifyHeading(s) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const LIST_ITEM_RE = /^([-*+])\s+(.*)$/;
const ORDERED_ITEM_RE = /^(\d{1,3})[.)]\s+(.*)$/;
const HEADING_RE = /^(#{1,6})\s+(.*?)\s*#*\s*$/;

/**
 * Parse a Markdown body.
 * @param {string} source
 * @param {number} [firstLine] line number of the first body line in the file (for messages)
 * @returns {{ blocks: Block[], problems: MarkdownProblem[] }}
 */
export function parseMarkdown(source, firstLine = 1) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  /** @type {Block[]} */
  const blocks = [];
  /** @type {MarkdownProblem[]} */
  const problems = [];
  /** @type {Set<string>} */
  const usedIds = new Set();
  let i = 0;

  const isBlank = (/** @type {string} */ l) => l.trim() === '';
  const startsBlock = (/** @type {string} */ l) => {
    const t = l.trim();
    return (
      HEADING_RE.test(t) ||
      LIST_ITEM_RE.test(t) ||
      ORDERED_ITEM_RE.test(t) ||
      t.startsWith('>') ||
      /^(-{3,}|\*{3,}|_{3,})$/.test(t) ||
      t.startsWith('```')
    );
  };

  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    const lineNo = firstLine + i;
    if (isBlank(line)) {
      i++;
      continue;
    }
    if (t.startsWith('```')) {
      problems.push({ level: 'error', line: lineNo, message: 'code blocks (```) are not supported on these pages' });
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) i++;
      i++;
      continue;
    }
    const h = HEADING_RE.exec(t);
    if (h) {
      const depth = h[1].length;
      if (depth === 1) problems.push({ level: 'error', line: lineNo, message: 'do not use "# " (H1) in the body: the page H1 comes from the "h1" field. Use "## " for sections' });
      if (depth > 4) problems.push({ level: 'warning', line: lineNo, message: 'use "## " or "### " headings; deeper levels look the same as "###"' });
      const text = h[2];
      let id = slugifyHeading(stripInline(text)) || 'section';
      let n = 2;
      while (usedIds.has(id)) id = `${slugifyHeading(stripInline(text))}-${n++}`;
      usedIds.add(id);
      blocks.push({ type: 'heading', depth: Math.min(Math.max(depth, 2), 4), id, children: parseInline(text) });
      i++;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }
    if (t.startsWith('>')) {
      /** @type {string[]} */
      const quoted = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoted.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      const inner = parseMarkdown(quoted.join('\n'), lineNo);
      problems.push(...inner.problems);
      blocks.push({ type: 'blockquote', children: inner.blocks });
      continue;
    }
    const ul = LIST_ITEM_RE.exec(t);
    const ol = ORDERED_ITEM_RE.exec(t);
    if (ul || ol) {
      const ordered = !ul;
      /** @type {Inline[][]} */
      const items = [];
      let current = '';
      const start = ol ? parseInt(ol[1], 10) : 1;
      while (i < lines.length) {
        const l = lines[i];
        const lt = l.trim();
        if (isBlank(l)) {
          // a blank line ends the list unless the next line continues it
          const next = lines[i + 1]?.trim() ?? '';
          if ((ordered ? ORDERED_ITEM_RE : LIST_ITEM_RE).test(next)) {
            i++;
            continue;
          }
          break;
        }
        const m = ordered ? ORDERED_ITEM_RE.exec(lt) : LIST_ITEM_RE.exec(lt);
        if (m) {
          if (current) items.push(parseInline(current));
          current = m[2];
          i++;
          continue;
        }
        if (/^\s{2,}/.test(l) || !startsBlock(l)) {
          current += ' ' + lt;
          i++;
          continue;
        }
        break;
      }
      if (current) items.push(parseInline(current));
      blocks.push({ type: 'list', ordered, start, items });
      continue;
    }
    // paragraph
    /** @type {string[]} */
    const para = [];
    while (i < lines.length && !isBlank(lines[i]) && (para.length === 0 || !startsBlock(lines[i]))) {
      para.push(lines[i].trim());
      i++;
    }
    const text = para.join(' ');
    if (/!\[[^\]]*\]\([^)]*\)/.test(text)) {
      problems.push({ level: 'error', line: lineNo, message: 'images in the body are not supported: add them to the "gallery" list instead' });
    }
    if (/<\/?[a-zA-Z][^>]*>/.test(text)) {
      problems.push({ level: 'error', line: lineNo, message: 'HTML tags are not supported in the body; use Markdown only' });
    }
    if (/^\|.*\|$/.test(para[0] ?? '')) {
      problems.push({ level: 'warning', line: lineNo, message: 'tables are not supported and will show as plain text' });
    }
    blocks.push({ type: 'paragraph', children: parseInline(text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')) });
  }
  return { blocks, problems };
}

/**
 * Plain text of an inline Markdown string (used for JSON-LD, meta tags, word counts).
 * @param {string} text
 * @returns {string}
 */
export function stripInline(text) {
  return inlineText(parseInline(text));
}

/**
 * @param {Inline[]} nodes
 * @returns {string}
 */
export function inlineText(nodes) {
  return nodes
    .map((n) => (n.type === 'text' || n.type === 'code' ? n.value : inlineText(n.children)))
    .join('');
}

/**
 * @param {Block[]} blocks
 * @returns {string}
 */
export function blocksText(blocks) {
  /** @type {string[]} */
  const parts = [];
  for (const b of blocks) {
    if (b.type === 'heading' || b.type === 'paragraph') parts.push(inlineText(b.children));
    else if (b.type === 'list') b.items.forEach((it) => parts.push(inlineText(it)));
    else if (b.type === 'blockquote') parts.push(blocksText(b.children));
  }
  return parts.join('\n');
}

/**
 * @param {Block[]} blocks
 * @returns {string[]} every link target used in the body
 */
export function blockLinks(blocks) {
  /** @type {string[]} */
  const out = [];
  /** @param {Inline[]} nodes */
  const walk = (nodes) => {
    for (const n of nodes) {
      if (n.type === 'link') out.push(n.href);
      if (n.type === 'link' || n.type === 'strong' || n.type === 'em') walk(n.children);
    }
  };
  for (const b of blocks) {
    if (b.type === 'heading' || b.type === 'paragraph') walk(b.children);
    else if (b.type === 'list') b.items.forEach(walk);
    else if (b.type === 'blockquote') out.push(...blockLinks(b.children));
  }
  return out;
}

/**
 * @param {string} text
 * @returns {number}
 */
export function countWords(text) {
  const m = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu);
  return m ? m.length : 0;
}
