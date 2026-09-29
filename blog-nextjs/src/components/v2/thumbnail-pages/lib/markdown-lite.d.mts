// Type declarations for markdown-lite.mjs (the runtime is plain JavaScript so
// the validation script can run with plain `node`, without a TypeScript step).

export type Inline =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string }
  | { type: 'strong'; children: Inline[] }
  | { type: 'em'; children: Inline[] }
  | { type: 'link'; href: string; children: Inline[] };

export type Block =
  | { type: 'heading'; depth: number; id: string; children: Inline[] }
  | { type: 'paragraph'; children: Inline[] }
  | { type: 'list'; ordered: boolean; start: number; items: Inline[][] }
  | { type: 'blockquote'; children: Block[] }
  | { type: 'hr' };

export interface MarkdownProblem {
  level: 'error' | 'warning';
  line: number;
  message: string;
}

export function parseInline(text: string): Inline[];
export function parseMarkdown(source: string, firstLine?: number): { blocks: Block[]; problems: MarkdownProblem[] };
export function stripInline(text: string): string;
export function inlineText(nodes: Inline[]): string;
export function blocksText(blocks: Block[]): string;
export function blockLinks(blocks: Block[]): string[];
export function countWords(text: string): number;
export function slugifyHeading(s: string): string;
