import { startOfferTerms, type StartOffer } from './catalog';
import { primaryButton, ReviewButton, StartOfferButton } from './Buttons';
import HeroStage from './HeroStage';
import { RevealHeading } from './motion';
import ThumbnailFeed from './ThumbnailFeed';

/**
 * The hero. Behind it: the owner's background video when the file exists, otherwise a YouTube feed
 * of example thumbnails. The dark veil opens where the cursor is, so the feed shows through; the
 * headline lands word by word, white then orange (on first paint: CSS, no script needed).
 */
export default function Hero({ offer }: { offer: StartOffer }) {
  const terms = startOfferTerms(offer);
  return (
    <HeroStage>
      <ThumbnailFeed className="-z-30" />
      {/* Dark in the middle for the words, open at the edges and under the cursor, fading into the page. */}
      <div
        aria-hidden="true"
        className="lp-veil absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_47%,rgba(7,7,9,0.9)_0%,rgba(7,7,9,0.68)_48%,rgba(7,7,9,0.22)_100%)]"
      />
      <div aria-hidden="true" className="lp-spot pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-b from-transparent to-[#070709]" />

      <div className="mx-auto w-full max-w-5xl px-5 pb-24 text-center sm:px-8">
        <RevealHeading
          as="h1"
          id="landing-hero-title"
          immediate
          delay={0.1}
          className="lp-display text-[2.9rem] text-white sm:text-7xl lg:text-[6.4rem]"
          parts={['AI thumbnails that look like ', { accent: 'your channel.' }]}
        />

        <div className="lp-hero-rise">
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl sm:leading-[1.75rem]">
            Paste your video link or script. Get <span className="font-semibold text-[#ff9a3c]">three thumbnail ideas</span> built from your
            video, with <span className="font-semibold text-white">your face and your channel&apos;s style</span>, ready for YouTube&apos;s Test
            &amp; Compare. Change anything in plain words.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <StartOfferButton offer={offer} className={primaryButton} />
            <ReviewButton />
          </div>
          <p className="mt-5 min-h-[1.25rem] text-sm text-zinc-400">{terms}</p>
        </div>
      </div>
    </HeroStage>
  );
}
