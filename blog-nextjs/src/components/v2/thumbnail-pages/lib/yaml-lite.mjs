// @ts-check
/**
 * yaml-lite — a small, strict parser for the YAML subset used in the
 * frontmatter of content/thumbnails/*.md files.
 *
 * Why not a YAML library? The site has a "no new npm dependency" rule and the
 * frontmatter only needs a small part of YAML. Everything this parser accepts
 * is standard YAML, so the files stay readable by any YAML tool. Anything it
 * does not understand is reported as an error with a line number and a hint,
 * instead of being silently misread.
 *
 * Supported:
 *   - mappings (`key: value`), nested by indentation (spaces only)
 *   - sequences (`- item`), of plain values or of mappings (`- key: value`)
 *   - plain, "double-quoted" and 'single-quoted' values
 *   - block text: `>` (folded, joins lines with spaces) and `|` (keeps line breaks),
 *     with optional `-` / `+` chomping
 *   - flow lists of simple values: `[a, "b", c]`
 *   - comments (`# ...`), true / false / null / numbers
 *
 * Not supported (reported as errors): anchors & aliases, tags, flow mappings
 * `{...}`, multi-line quoted strings, tabs for indentation.
 */

export class YamlError extends Error {
  /**
   * @param {string} message
   * @param {number} line 1-based line number in the YAML text
   */
  constructor(message, line) {
    super(`line ${line}: ${message}`);
    this.name = 'YamlError';
    this.line = line;
    this.reason = message;
  }
}

const KEY_RE = /^([A-Za-z_][A-Za-z0-9_-]*)[ ]*:(?:[ ]+(.*))?$/;
const QUOTE_HINT = 'wrap the whole value in double quotes, e.g. caption: "Noob vs pro: the final fight"';

/**
 * @param {string} text
 * @returns {Record<string, unknown>}
 */
export function parseYaml(text) {
  /** @type {string[]} */
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  let pos = 0;

  lines.forEach((l, i) => {
    const lead = /^[ \t]*/.exec(l)?.[0] ?? '';
    if (lead.includes('\t')) throw new YamlError('tab character used for indentation; use spaces only', i + 1);
  });

  /** @param {string} l */
  const indentOf = (l) => l.length - l.trimStart().length;
  /** @param {string} l */
  const isBlank = (l) => l.trim() === '' || l.trimStart().startsWith('#');
  /** @param {string} l */
  const isSeqLine = (l) => {
    const t = l.trimStart();
    return t === '-' || t.startsWith('- ');
  };

  function skipBlank() {
    while (pos < lines.length && isBlank(lines[pos])) pos++;
  }

  /**
   * Parse the block that starts at the next content line (a mapping or a sequence).
   * @param {number} minIndent
   * @returns {unknown}
   */
  function parseNode(minIndent) {
    skipBlank();
    if (pos >= lines.length) return null;
    const ind = indentOf(lines[pos]);
    if (ind < minIndent) return null;
    return isSeqLine(lines[pos]) ? parseSequence(ind) : parseMapping(ind);
  }

  /**
   * @param {number} ind
   * @returns {Record<string, unknown>}
   */
  function parseMapping(ind) {
    /** @type {Record<string, unknown>} */
    const out = {};
    while (true) {
      skipBlank();
      if (pos >= lines.length) break;
      const line = lines[pos];
      const lineInd = indentOf(line);
      if (lineInd < ind) break;
      const lineNo = pos + 1;
      if (lineInd > ind) throw new YamlError('unexpected indentation (check the spaces at the start of this line)', lineNo);
      const content = line.slice(ind);
      if (isSeqLine(content)) {
        throw new YamlError('a list item ("- ") appears where a "key: value" line was expected', lineNo);
      }
      const m = KEY_RE.exec(content.replace(/\s+$/, ''));
      if (!m) {
        throw new YamlError(`expected "key: value" but found: ${content.trim().slice(0, 60)}`, lineNo);
      }
      const key = m[1];
      if (Object.prototype.hasOwnProperty.call(out, key)) throw new YamlError(`duplicate key "${key}"`, lineNo);
      const rest = (m[2] ?? '').trim();
      pos++;
      out[key] = parseValueAfterKey(rest, ind, lineNo);
    }
    return out;
  }

  /**
   * Value that follows `key:` or `- ` on the same line.
   * @param {string} rest
   * @param {number} parentIndent
   * @param {number} lineNo
   * @param {boolean} [allowSameIndentSeq]
   */
  function parseValueAfterKey(rest, parentIndent, lineNo, allowSameIndentSeq = true) {
    if (rest === '' || rest.startsWith('#')) {
      if (/^#[0-9a-fA-F]{3,8}\b/.test(rest)) {
        throw new YamlError(`colour codes must be quoted, e.g. hex: "${rest.split(/\s/)[0]}" (a bare # starts a comment)`, lineNo);
      }
      skipBlank();
      if (pos >= lines.length) return null;
      const next = lines[pos];
      const nInd = indentOf(next);
      if (isSeqLine(next) && (nInd > parentIndent || (allowSameIndentSeq && nInd === parentIndent))) {
        return parseSequence(nInd);
      }
      if (nInd > parentIndent) return parseMapping(nInd);
      return null;
    }
    if (/^[|>]/.test(rest)) return parseBlockScalar(rest, parentIndent, lineNo);
    return parseInline(rest, lineNo);
  }

  /**
   * @param {number} ind
   * @returns {unknown[]}
   */
  function parseSequence(ind) {
    /** @type {unknown[]} */
    const out = [];
    while (true) {
      skipBlank();
      if (pos >= lines.length) break;
      const line = lines[pos];
      const lineInd = indentOf(line);
      if (lineInd < ind) break;
      const lineNo = pos + 1;
      if (lineInd > ind) throw new YamlError('unexpected indentation inside a list', lineNo);
      if (!isSeqLine(line)) break;
      const afterDash = line.slice(ind + 1);
      const spaces = afterDash.length - afterDash.trimStart().length;
      const itemText = afterDash.trim();
      if (itemText === '' || itemText.startsWith('#')) {
        pos++;
        out.push(parseNode(ind + 1));
        continue;
      }
      if (itemText === '-' || itemText.startsWith('- ')) {
        // "- - item": a list inside a list
        const childIndent = ind + 1 + spaces;
        lines[pos] = ' '.repeat(childIndent) + itemText;
        out.push(parseSequence(childIndent));
        continue;
      }
      if (KEY_RE.test(itemText.replace(/\s+$/, '')) && !/^["']/.test(itemText)) {
        // "- key: value" starts a mapping whose keys sit at (dash indent + 1 + spaces)
        const childIndent = ind + 1 + spaces;
        lines[pos] = ' '.repeat(childIndent) + itemText;
        out.push(parseMapping(childIndent));
        continue;
      }
      pos++;
      out.push(parseValueAfterKey(itemText, ind, lineNo, false));
    }
    return out;
  }

  /**
   * @param {string} header e.g. ">", "|-", ">+"
   * @param {number} parentIndent
   * @param {number} lineNo
   * @returns {string}
   */
  function parseBlockScalar(header, parentIndent, lineNo) {
    const hm = /^([|>])([+-]?)\s*(#.*)?$/.exec(header);
    if (!hm) throw new YamlError(`unsupported block text header "${header}" (use ">" or "|")`, lineNo);
    const folded = hm[1] === '>';
    const chomp = hm[2];
    /** @type {string[]} */
    const raw = [];
    let blockIndent = -1;
    while (pos < lines.length) {
      const l = lines[pos];
      if (l.trim() === '') {
        raw.push('');
        pos++;
        continue;
      }
      const li = indentOf(l);
      if (blockIndent === -1) {
        if (li <= parentIndent) break;
        blockIndent = li;
      }
      if (li < blockIndent) break;
      raw.push(l.slice(blockIndent));
      pos++;
    }
    // trailing blank lines are handled by chomping
    let trailing = 0;
    while (raw.length && raw[raw.length - 1] === '') {
      raw.pop();
      trailing++;
    }
    let body;
    if (folded) {
      body = '';
      for (let i = 0; i < raw.length; i++) {
        const cur = raw[i];
        if (i === 0) {
          body = cur;
          continue;
        }
        const prev = raw[i - 1];
        if (cur === '') body += '\n';
        else if (prev === '' || /^\s/.test(cur) || /^\s/.test(prev)) body += (prev === '' ? '' : '\n') + cur;
        else body += ' ' + cur;
      }
    } else {
      body = raw.join('\n');
    }
    if (raw.length === 0) return '';
    if (chomp === '-') return body;
    if (chomp === '+') return body + '\n'.repeat(trailing + 1);
    return body + '\n';
  }

  return /** @type {Record<string, unknown>} */ (parseRoot());

  function parseRoot() {
    skipBlank();
    if (pos >= lines.length) return {};
    if (indentOf(lines[pos]) !== 0) throw new YamlError('the first key must start at the beginning of the line', pos + 1);
    if (isSeqLine(lines[pos])) throw new YamlError('the frontmatter must be a list of "key: value" lines, not a list', pos + 1);
    const out = parseMapping(0);
    skipBlank();
    if (pos < lines.length) throw new YamlError('could not read this line (check its indentation)', pos + 1);
    return out;
  }
}

/**
 * Parse a value written on one line.
 * @param {string} rest
 * @param {number} lineNo
 * @returns {unknown}
 */
function parseInline(rest, lineNo) {
  const first = rest[0];
  if (first === '"' || first === "'") {
    const { value, end } = readQuoted(rest, 0, lineNo);
    const after = rest.slice(end).trim();
    if (after !== '' && !after.startsWith('#')) {
      throw new YamlError(`unexpected text after the closing quote: ${after.slice(0, 30)}`, lineNo);
    }
    return value;
  }
  if (first === '[') return parseFlowSeq(rest, lineNo);
  if (first === '{') throw new YamlError('inline {...} mappings are not supported; write one "key: value" per line', lineNo);
  if ('&*!%@`'.includes(first)) {
    throw new YamlError(`values starting with "${first}" are not supported; ${QUOTE_HINT}`, lineNo);
  }
  let plain = rest;
  const hashAt = plain.search(/\s#/);
  if (hashAt !== -1) plain = plain.slice(0, hashAt);
  plain = plain.trim();
  if (/:\s/.test(plain) || plain.endsWith(':')) {
    throw new YamlError(`this value contains ": " which YAML reads as a new key; ${QUOTE_HINT}`, lineNo);
  }
  return resolvePlain(plain);
}

/**
 * @param {string} s
 * @param {number} start index of the opening quote
 * @param {number} lineNo
 * @returns {{ value: string, end: number }}
 */
function readQuoted(s, start, lineNo) {
  const q = s[start];
  let i = start + 1;
  let out = '';
  while (i < s.length) {
    const c = s[i];
    if (q === "'") {
      if (c === "'") {
        if (s[i + 1] === "'") {
          out += "'";
          i += 2;
          continue;
        }
        return { value: out, end: i + 1 };
      }
      out += c;
      i++;
      continue;
    }
    if (c === '\\') {
      const n = s[i + 1];
      /** @type {Record<string, string>} */
      const map = { n: '\n', t: '\t', '"': '"', '\\': '\\', '/': '/', r: '\r', '0': '\0', ' ': ' ' };
      if (n === 'u' && /^[0-9a-fA-F]{4}$/.test(s.slice(i + 2, i + 6))) {
        out += String.fromCharCode(parseInt(s.slice(i + 2, i + 6), 16));
        i += 6;
        continue;
      }
      if (n !== undefined && map[n] !== undefined) {
        out += map[n];
        i += 2;
        continue;
      }
      throw new YamlError(`unknown escape "\\${n ?? ''}" inside double quotes (write \\\\ for a backslash)`, lineNo);
    }
    if (c === '"') return { value: out, end: i + 1 };
    out += c;
    i++;
  }
  throw new YamlError(
    `missing closing ${q === '"' ? 'double' : 'single'} quote (quoted text must fit on one line; for long text use ">" block text)`,
    lineNo,
  );
}

/**
 * @param {string} rest
 * @param {number} lineNo
 * @returns {unknown[]}
 */
function parseFlowSeq(rest, lineNo) {
  /** @type {unknown[]} */
  const items = [];
  let i = 1;
  let token = '';
  let closed = false;
  const pushToken = () => {
    const t = token.trim();
    if (t !== '') {
      if (t.startsWith('[') || t.startsWith('{')) throw new YamlError('nested [...] or {...} are not supported', lineNo);
      items.push(resolvePlain(t));
    }
    token = '';
  };
  while (i < rest.length) {
    const c = rest[i];
    if (c === '"' || c === "'") {
      if (token.trim() !== '') throw new YamlError('a quote appears in the middle of a list item', lineNo);
      const { value, end } = readQuoted(rest, i, lineNo);
      items.push(value);
      i = end;
      while (i < rest.length && rest[i] === ' ') i++;
      if (rest[i] === ',') i++;
      else if (rest[i] === ']') {
        closed = true;
        i++;
        break;
      } else throw new YamlError('expected "," or "]" after a quoted list item', lineNo);
      continue;
    }
    if (c === ',') {
      pushToken();
      i++;
      continue;
    }
    if (c === ']') {
      pushToken();
      closed = true;
      i++;
      break;
    }
    token += c;
    i++;
  }
  if (!closed) throw new YamlError('missing closing "]" (a [...] list must fit on one line)', lineNo);
  const after = rest.slice(i).trim();
  if (after !== '' && !after.startsWith('#')) throw new YamlError('unexpected text after "]"', lineNo);
  return items;
}

/**
 * YAML 1.2 core-schema resolution for plain values.
 * Dates stay strings on purpose (YYYY-MM-DD is validated by the schema).
 * @param {string} v
 * @returns {unknown}
 */
function resolvePlain(v) {
  if (v === '' || v === '~' || /^(null|Null|NULL)$/.test(v)) return null;
  if (/^(true|True|TRUE)$/.test(v)) return true;
  if (/^(false|False|FALSE)$/.test(v)) return false;
  if (/^[-+]?[0-9]+$/.test(v)) return parseInt(v, 10);
  if (/^[-+]?(\.[0-9]+|[0-9]+(\.[0-9]*)?)([eE][-+]?[0-9]+)?$/.test(v)) return parseFloat(v);
  return v;
}

/**
 * Split a Markdown file into its YAML frontmatter and its body.
 * The file must start with a line "---" and the frontmatter ends at the next "---" line.
 * @param {string} source
 * @returns {{ data: Record<string, unknown>, body: string, bodyStartLine: number }}
 */
export function parseFrontmatter(source) {
  const text = source.replace(/^﻿/, '');
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') {
    throw new YamlError('the file must start with a line containing only "---"', 1);
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      end = i;
      break;
    }
  }
  if (end === -1) throw new YamlError('the frontmatter is not closed: add a line containing only "---" after the last field', lines.length);
  const yaml = lines.slice(1, end).join('\n');
  let data;
  try {
    data = parseYaml(yaml);
  } catch (e) {
    if (e instanceof YamlError) throw new YamlError(e.reason, e.line + 1);
    throw e;
  }
  return { data, body: lines.slice(end + 1).join('\n'), bodyStartLine: end + 2 };
}
