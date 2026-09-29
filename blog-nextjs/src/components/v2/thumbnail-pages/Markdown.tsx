import Link from 'next/link';
import type { ReactNode } from 'react';

import { parseInline, type Block, type Inline } from './lib/markdown-lite.mjs';

/** Renders parsed Markdown as React elements (no raw HTML is ever injected). */

function renderLink(href: string, children: ReactNode, key: number) {
  if (href.startsWith('/')) {
    return (
      <Link key={key} href={href}>
        {children}
      </Link>
    );
  }
  if (href.startsWith('#')) {
    return (
      <a key={key} href={href}>
        {children}
      </a>
    );
  }
  if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href)) {
    return (
      <a key={key} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <span key={key}>{children}</span>;
}

export function Inlines({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.type) {
          case 'text':
            return n.value;
          case 'code':
            return <code key={i}>{n.value}</code>;
          case 'strong':
            return (
              <strong key={i}>
                <Inlines nodes={n.children} />
              </strong>
            );
          case 'em':
            return (
              <em key={i}>
                <Inlines nodes={n.children} />
              </em>
            );
          case 'link':
            return renderLink(n.href, <Inlines nodes={n.children} />, i);
          default:
            return null;
        }
      })}
    </>
  );
}

/** Inline Markdown from a frontmatter field (intro, FAQ answers, do/don't items...). */
export function InlineText({ text }: { text: string }) {
  return <Inlines nodes={parseInline(text)} />;
}

export function MarkdownBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'heading': {
            const content = <Inlines nodes={b.children} />;
            if (b.depth === 2) return <h2 key={i} id={b.id}>{content}</h2>;
            if (b.depth === 3) return <h3 key={i} id={b.id}>{content}</h3>;
            return <h4 key={i} id={b.id}>{content}</h4>;
          }
          case 'paragraph':
            return (
              <p key={i}>
                <Inlines nodes={b.children} />
              </p>
            );
          case 'list': {
            const items = b.items.map((it, j) => (
              <li key={j}>
                <Inlines nodes={it} />
              </li>
            ));
            return b.ordered ? (
              <ol key={i} start={b.start}>
                {items}
              </ol>
            ) : (
              <ul key={i}>{items}</ul>
            );
          }
          case 'blockquote':
            return (
              <blockquote key={i}>
                <MarkdownBlocks blocks={b.children} />
              </blockquote>
            );
          case 'hr':
            return <hr key={i} />;
          default:
            return null;
        }
      })}
    </>
  );
}
