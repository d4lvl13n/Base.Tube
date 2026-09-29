// /ai-thumbnails: the AI Thumbnails landing page (ported from the app's ThumbnailLanding). Only true
// claims: prices, videos and the free trial come from the plan catalog; the Reddit quotes and the
// example images are in content.ts with their source. For visitors only: every action links to the app.
import { landingFaq, startOffer, type SubscriptionCatalog } from './catalog';
import ChannelMemory from './ChannelMemory';
import CreatorQuotes from './CreatorQuotes';
import Faq from './Faq';
import Features from './Features';
import FinalCTA from './FinalCTA';
import Footer from './Footer';
import { anton, archivo } from './fonts';
import Header from './Header';
import Hero from './Hero';
import { MotionProvider } from './motion';
import Pricing from './Pricing';
import ProductVideo from './ProductVideo';
import ReviewSection from './ReviewSection';
import ScrollProgress from './ScrollProgress';
import StudioDemo from './StudioDemo';

// Without scripts, the reveals never run: show everything as it ends.
const NO_SCRIPT_STYLE =
  '<style>.lp .lp-words .lp-word,.lp .lp-reveal,.lp [data-lp-reveal]{opacity:1!important;transform:none!important;filter:none!important}</style>';

export default function Landing({ catalog, freeReviews }: { catalog: SubscriptionCatalog | null; freeReviews: number | null }) {
  const offer = startOffer(catalog);
  return (
    <div className={`lp ${archivo.variable} ${anton.variable} min-h-screen`}>
      <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT_STYLE }} />
      <MotionProvider>
        <ScrollProgress />
        <Header offer={offer} />
        <main>
          <Hero offer={offer} />
          <ProductVideo />
          <StudioDemo />
          <ChannelMemory catalog={catalog} />
          <CreatorQuotes />
          <ReviewSection freeReviews={freeReviews} />
          <Features />
          <Pricing catalog={catalog} />
          <Faq items={landingFaq(catalog)} />
          <FinalCTA offer={offer} />
        </main>
        <Footer />
      </MotionProvider>
    </div>
  );
}
