import { CREATOR_QUOTES, DIRECT_STATS, RENT_STATS, SHORTS_SOURCE, type Source } from './content';
import { CountUp, Reveal, RevealHeading, TypeIn } from './reveal';

function SourceLink({ source }: { source: Source }) {
  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer" className="hp-source">
      Source: {source.label}
    </a>
  );
}

/**
 * The case: what renting fans means, in public numbers and in creators' own words, each with its
 * source on the page. The numbers count up once in view and their source fades in after; the quotes
 * type in like incoming messages. Then the turn: fans already pay creators directly.
 */
export default function Case() {
  const [share, survey] = RENT_STATS;
  return (
    <section className="hp-section hp-case" aria-labelledby="home-case-title">
      <div className="hp-wrap">
        <RevealHeading
          id="home-case-title"
          className="lp-heading hp-h2"
          lines={[['On a platform,'], [{ accent: 'you are the tenant.' }]]}
        />
        <Reveal delay={0.1}>
          <p className="hp-case-intro">
            You bring the audience. The platform sets the cut, decides who sees your next video, and keeps the list of who watched.
          </p>
        </Reveal>

        <div className="hp-rent">
          <div className="hp-rent-item">
            <p className="hp-figure">
              <CountUp value={Number.parseInt(share.figure, 10)} suffix="%" />
            </p>
            <p className="hp-rent-text">{share.text}</p>
            <Reveal delay={1.1} y={8} className="hp-sources">
              <SourceLink source={share.source} />
              <SourceLink source={SHORTS_SOURCE} />
            </Reveal>
          </div>
          <div className="hp-rent-item">
            <p className="hp-figure">
              <CountUp value={Number.parseInt(survey.figure, 10)} suffix="%" />
            </p>
            <p className="hp-rent-text">{survey.text}</p>
            <Reveal delay={1.1} y={8} className="hp-sources">
              <SourceLink source={survey.source} />
            </Reveal>
          </div>
          <div className="hp-rent-item">
            <p className="hp-figure hp-figure--word">No list</p>
            <p className="hp-rent-text">
              The big platforms don&apos;t give you your viewers&apos; names or emails. If the channel goes, the audience goes with it.
            </p>
          </div>
        </div>

        <figure className="hp-quotes">
          <figcaption className="hp-quotes-title">Creators, in their own words:</figcaption>
          <ul>
            {CREATOR_QUOTES.map((quote, index) => (
              <li key={quote.url}>
                <blockquote cite={quote.url}>
                  <p>
                    <TypeIn text={`“${quote.text}”`} delay={index * 0.5} />
                  </p>
                </blockquote>
                <a href={quote.url} target="_blank" rel="noopener noreferrer" className="hp-source">
                  {quote.community}, on Reddit
                </a>
              </li>
            ))}
          </ul>
        </figure>

        <div className="hp-direct">
          <Reveal className="hp-direct-head">
            <p className="hp-direct-lead">
              And fans already pay creators <strong>directly.</strong>
            </p>
          </Reveal>
          {DIRECT_STATS.map((stat, index) => (
            <Reveal key={stat.figure} className="hp-direct-item" delay={0.1 * (index + 1)}>
              <p className="hp-figure hp-figure--small">{stat.figure}</p>
              <p className="hp-rent-text">{stat.text}</p>
              <p className="hp-sources">
                <SourceLink source={stat.source} />
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
