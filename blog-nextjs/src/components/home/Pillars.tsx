import Link from 'next/link';
import { getImageProps } from 'next/image';
import { PenLine } from 'lucide-react';
import { AUDIT_URL } from '@/components/ai-thumbnails/catalog';
import { Reveal, RevealHeading } from './reveal';
import { DEMO, PASS_VS_MEMBERSHIP } from './content';

function img(src: string, sizes: string, width = 640, height = 360) {
  return getImageProps({ src, alt: '', width, height, sizes, loading: 'lazy', decoding: 'async' }).props;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** The month the fan in the picture stops paying (an illustration, not a statistic). */
const STOPS_AFTER = 7;

/** A Content Pass as a ticket: the example is the demo channel's course (invented, and labelled so). */
function PassTicket() {
  return (
    <div className="hp-ticket" aria-hidden="true">
      <div className="hp-ticket-art">
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image's getImageProps: an optimized <img> without a client component */}
        <img {...img(DEMO.ideas[2].src, '(min-width: 1024px) 400px, 86vw')} alt="" />
        <span className="hp-ticket-badge">Example pass</span>
      </div>
      <div className="hp-ticket-body">
        <p className="hp-ticket-title">Latte art at home: the full course</p>
        <p className="hp-ticket-by">{DEMO.channel}</p>
      </div>
      <div className="hp-ticket-stub">
        <span>Paid once</span>
        <span>Watch now</span>
        <span>Yours for good</span>
      </div>
    </div>
  );
}

/** A membership drawn as monthly payments that stop, next to a pass drawn as one payment that lasts; then the same in words. */
function PassVsMembership() {
  return (
    <div className="hp-compare-wrap">
      <div className="hp-bars">
        <div className="hp-bar-row" aria-hidden="true">
          <span className="hp-bar-label">Membership</span>
          <span className="hp-bar hp-bar--months">
            {MONTHS.map((month, index) => (
              <span key={month} className={`hp-month ${index < STOPS_AFTER ? 'is-paid' : 'is-gone'}`}>
                {month}
              </span>
            ))}
          </span>
          <span className="hp-bar-note">Access ends when payments stop</span>
        </div>
        <div className="hp-bar-row" aria-hidden="true">
          <span className="hp-bar-label">Content Pass</span>
          <span className="hp-bar hp-bar--pass">
            <span className="hp-pass-paid">Paid once</span>
          </span>
          <span className="hp-bar-note hp-bar-note--on">Access for good</span>
        </div>
      </div>
      <table className="hp-compare">
        <caption className="hp-sr">Membership and Content Pass compared</caption>
        <thead>
          <tr>
            <td />
            <th scope="col">Membership</th>
            <th scope="col">Content Pass</th>
          </tr>
        </thead>
        <tbody>
          {PASS_VS_MEMBERSHIP.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.membership}</td>
              <td>{row.pass}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * AI Thumbnails in one picture: the video link, the three ideas (the first large), and a one-sentence
 * edit typed over the first idea, which then changes (a CSS loop; the edited idea, still, under
 * reduced motion). The images and the channel are the AI Thumbnails page's demo (an invented channel).
 */
function StudioSketch() {
  const [first, second, third] = DEMO.ideas;
  return (
    <div className="hp-sketch" aria-hidden="true">
      <div className="hp-sketch-input">
        {/* eslint-disable-next-line @next/next/no-img-element -- see img() */}
        <img {...img(DEMO.face, '32px', 64, 64)} alt="" className="hp-sketch-face" />
        <span className="hp-sketch-channel">{DEMO.channel}</span>
        <span className="hp-sketch-link">youtube.com/watch?v=… Cafe latte art at home</span>
      </div>
      <div className="hp-sketch-ideas">
        <div className="hp-sketch-idea hp-sketch-idea--main">
          {/* eslint-disable-next-line @next/next/no-img-element -- see img() */}
          <img {...img(first.src, '(min-width: 1024px) 460px, 64vw')} alt="" />
          {'edited' in first && (
            // eslint-disable-next-line @next/next/no-img-element -- see img()
            <img {...img(first.edited, '(min-width: 1024px) 460px, 64vw')} alt="" className="hp-sketch-edited" />
          )}
          <span className="hp-sketch-edit">
            <PenLine width={14} height={14} aria-hidden="true" />
            <span className="hp-sketch-edit-text">{DEMO.edit}</span>
          </span>
          <span className="hp-sketch-num">1</span>
        </div>
        <div className="hp-sketch-idea">
          {/* eslint-disable-next-line @next/next/no-img-element -- see img() */}
          <img {...img(second.src, '(min-width: 1024px) 220px, 30vw')} alt="" />
          <span className="hp-sketch-num">2</span>
        </div>
        <div className="hp-sketch-idea">
          {/* eslint-disable-next-line @next/next/no-img-element -- see img() */}
          <img {...img(third.src, '(min-width: 1024px) 220px, 30vw')} alt="" />
          <span className="hp-sketch-num">3</span>
        </div>
      </div>
    </div>
  );
}

/** The growth tools, in plain words. */
const GROW = [
  {
    href: '/ai-thumbnails',
    name: 'AI Thumbnails',
    text: 'Three thumbnail ideas for every video, with your face and your channel’s style. Change any of them in one sentence.',
  },
  {
    href: '/tools',
    name: 'Free tools',
    text: 'Check size, crop, preview, variants, title length and the best frame before you publish. In your browser, nothing uploaded.',
  },
  {
    href: AUDIT_URL,
    name: 'Channel audit',
    tag: 'beta',
    text: 'A review of your channel’s thumbnails and titles, with what to change first.',
  },
];

/**
 * The hub's three pillars, not three equal cards: publish and sell (the pass a fan buys), know your
 * buyers (paid once, access for good, the relationship stays yours), grow (the tools).
 */
export default function Pillars() {
  return (
    <section className="hp-section hp-pillars" aria-labelledby="home-pillars-title">
      <div className="hp-wrap">
        <RevealHeading id="home-pillars-title" className="lp-heading hp-h2" lines={[['Publish, sell and grow.'], [{ accent: 'All in one hub.' }]]} />

        <article className="hp-way hp-pillar">
          <Reveal className="hp-way-text">
            <h3 className="hp-h3">Publish and sell</h3>
            <p className="hp-way-lead">
              Put your films, courses and archives on Base.Tube and sell them with a <strong>Content Pass</strong>.
            </p>
            <p className="hp-way-body">
              Your videos are hosted on Base.Tube and play in a secure player. Fans pay once by card and watch straight away.
            </p>
            <Link href="/content-pass" className="hp-link">
              How Content Pass works
            </Link>
          </Reveal>
          <Reveal delay={0.15} className="hp-way-visual hp-pillar-ticket">
            <PassTicket />
          </Reveal>
        </article>

        <article className="hp-way hp-pillar hp-pillar--wide">
          <Reveal className="hp-way-text hp-pillar-head">
            <h3 className="hp-h3">Know your buyers</h3>
            <div>
              <p className="hp-way-lead">
                Fans buy from you, not from a platform: <strong>the relationship is yours.</strong>
              </p>
              <p className="hp-way-body">
                What they buy stays in their library for good, like a film they bought. You are paid upfront and keep 90% of every sale.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} y={16}>
            <PassVsMembership />
          </Reveal>
        </article>

        <article className="hp-way hp-pillar">
          <Reveal className="hp-way-text">
            <h3 className="hp-h3">Grow</h3>
            <p className="hp-way-lead">Built-in tools to win the click on YouTube and bring viewers to your work.</p>
            <ul className="hp-grow">
              {GROW.map((tool) => (
                <li key={tool.name}>
                  <Link href={tool.href} className="hp-tool">
                    <span className="hp-tool-name">
                      {tool.name}
                      {tool.tag && <span className="hp-tag">{tool.tag}</span>}
                    </span>
                    <span className="hp-tool-text">{tool.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15} className="hp-way-visual">
            <StudioSketch />
          </Reveal>
        </article>
      </div>
    </section>
  );
}
