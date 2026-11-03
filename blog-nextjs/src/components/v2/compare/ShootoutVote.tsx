'use client';

import Image from 'next/image';
import { useState } from 'react';

import s from '../thumbnail-pages/thumbnails.module.css';
import c from './compare.module.css';

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export interface VoteImage {
  src: string;
  /** Names the tool: used once the names are shown. */
  alt: string;
  toolName: string;
  toolSlug: string;
  us: boolean;
}

export interface VoteRound {
  slug: string;
  niche: string;
  video: string;
  prompt: string;
  /** "Try this prompt" in the Studio. */
  tryHref: string;
  /** Already in the page's fixed blind order (made on the server, so server and browser agree). */
  images: VoteImage[];
}

/** The tool the visitor picked in a round; null when they asked for the names without voting. */
type Choices = Record<string, string | null>;

/** The event goes to the site's GA4 tag when it has loaded. Votes are not stored or shown anywhere on the page. */
function sendVote(test: string, tool: string) {
  const { gtag } = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof gtag === 'function') gtag('event', 'shootout_vote', { test, tool });
}

/**
 * The blind test: in each round the thumbnails come without tool names. The visitor clicks the one
 * they would click on YouTube, then every name appears. At the end they see their own picks, counted
 * from their own clicks. There is no store: no totals, no percentages, nothing from other visitors.
 */
export default function ShootoutVote({ rounds, tested }: { rounds: VoteRound[]; tested: string }) {
  const [choices, setChoices] = useState<Choices>({});

  const choose = (round: VoteRound, tool: string | null) => {
    if (round.slug in choices) return;
    if (tool) sendVote(round.slug, tool);
    setChoices((current) => ({ ...current, [round.slug]: tool }));
  };

  const done = rounds.filter((r) => r.slug in choices).length;
  const voted = rounds.filter((r) => choices[r.slug]);
  const pickOf = (round: VoteRound) => round.images.find((img) => img.toolSlug === choices[round.slug]);
  const ours = voted.filter((r) => pickOf(r)?.us).length;
  const usName = rounds[0]?.images.find((img) => img.us)?.toolName ?? '';

  return (
    <>
      {rounds.map((round, ri) => {
        const revealed = round.slug in choices;
        const pick = pickOf(round);
        const next = rounds[ri + 1];
        return (
          <article key={round.slug} id={round.slug} className={c.round} aria-labelledby={`${round.slug}-h`}>
            <header className={c.roundHead}>
              <span className={c.roundNum}>
                Test {ri + 1} · {round.niche}
              </span>
              <h3 id={`${round.slug}-h`} className={c.roundTitle}>
                “{round.video}”
              </h3>
            </header>
            <figure className={c.prompt}>
              <figcaption>The exact prompt, pasted into every tool on {tested}</figcaption>
              <blockquote>{round.prompt}</blockquote>
            </figure>
            <p className={c.voteAsk} role="status">
              {!revealed && 'Which one would you click?'}
              {pick && (
                <>
                  You picked <strong>{pick.toolName}</strong>.
                </>
              )}
              {revealed && !pick && 'Here are the names.'}
            </p>
            <ul className={`${c.shotGrid} ${c.voteGrid}`}>
              {round.images.map((img, i) => {
                const label = `Thumbnail ${LETTERS[i]}`;
                const picked = pick?.src === img.src;
                return (
                  <li key={img.src} className={`${c.shotItem} ${revealed && img.us ? c.shotUs : ''}`}>
                    <button
                      type="button"
                      className={`${c.voteButton} ${picked ? c.votePicked : ''}`}
                      disabled={revealed}
                      aria-pressed={picked}
                      onClick={() => choose(round, img.toolSlug)}
                    >
                      <span className={c.demoMedia}>
                        <Image
                          src={img.src}
                          alt={revealed ? img.alt : `${label} for the video “${round.video}”`}
                          fill
                          sizes="(max-width: 900px) 50vw, 360px"
                        />
                      </span>
                    </button>
                    <span className={`${c.shotName} ${revealed ? '' : c.shotBlind}`}>
                      {revealed ? img.toolName : label}
                      {revealed && img.us && <span className={c.shotOurs}>Ours</span>}
                      {picked && <span className={c.voteYours}>Your pick</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
            {/* Without JavaScript nothing can be clicked: the names are given in the page's order. */}
            <noscript>
              <p className={c.voteAfter}>In order: {round.images.map((img, i) => `${LETTERS[i]} ${img.toolName}`).join(', ')}.</p>
            </noscript>
            {revealed ? (
              <p className={c.voteAfter}>
                <a className={c.shotTry} href={round.tryHref} {...NEW_TAB}>
                  Try this prompt in Base.Tube <span aria-hidden>→</span>
                  <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                </a>
                {next && (
                  <a className={c.voteNext} href={`#${next.slug}`}>
                    Next test <span aria-hidden>↓</span>
                  </a>
                )}
              </p>
            ) : (
              <button type="button" className={c.voteSkip} onClick={() => choose(round, null)}>
                Show the names without voting
              </button>
            )}
          </article>
        );
      })}

      <div id="your-picks" className={c.votePicks}>
        {done < rounds.length ? (
          <p className={c.votePicksWait}>
            {done} of {rounds.length} tests done. Your picks appear here after the last one.
          </p>
        ) : voted.length === 0 ? (
          <p className={c.votePicksWait}>You saw the names without voting.</p>
        ) : (
          <>
            <h3 className={c.votePicksTitle}>
              You picked {usName} {ours} of {voted.length < rounds.length ? `the ${voted.length} tests you voted on` : voted.length}.
            </h3>
            <ol className={c.votePicksList}>
              {rounds.map((round, ri) => (
                <li key={round.slug}>
                  <span>
                    Test {ri + 1} · {round.niche}
                  </span>
                  <strong>{pickOf(round)?.toolName ?? 'No vote'}</strong>
                </li>
              ))}
            </ol>
            <p className={c.votePicksNote}>This counts your own clicks only. The page shows no totals from other visitors.</p>
          </>
        )}
      </div>
    </>
  );
}
