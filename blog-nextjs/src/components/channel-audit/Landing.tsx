// /youtube-channel-audit: the landing page of the free channel audit. Every claim is based on the
// app and backend code (see content.ts). For visitors only: every action opens the audit in the app
// on beta.base.tube, which asks a visitor to sign in first and does not take a channel from the address.
import { archivo } from '@/components/ai-thumbnails/fonts';
import { MotionProvider } from '@/components/ai-thumbnails/motion';
import ScrollProgress from '@/components/ai-thumbnails/ScrollProgress';
import Bridge from './Bridge';
import ConnectYouTube from './ConnectYouTube';
import { channelAuditFaq } from './content';
import ExampleAudit from './ExampleAudit';
import Faq from './Faq';
import FinalCTA from './FinalCTA';
import Footer from './Footer';
import Header from './Header';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import WhatItChecks from './WhatItChecks';
import WhatItIsNot from './WhatItIsNot';

// Without scripts, the reveals never run: show everything as it ends.
const NO_SCRIPT_STYLE =
  '<style>.lp .lp-words .lp-word,.lp .lp-reveal,.lp [data-lp-reveal],.ca .ca-strip-dot{opacity:1!important;transform:none!important;filter:none!important}.ca .ca-strike{background-size:100% .09em!important;color:#71717a!important}</style>';

export default function Landing({ freeReviews }: { freeReviews: number | null }) {
  return (
    <div className={`lp ca ${archivo.variable} min-h-screen`}>
      <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT_STYLE }} />
      <MotionProvider>
        <ScrollProgress />
        <Header />
        <main>
          <Hero />
          <ExampleAudit />
          <WhatItChecks />
          <HowItWorks />
          <ConnectYouTube />
          <WhatItIsNot />
          <Bridge freeReviews={freeReviews} />
          <Faq items={channelAuditFaq(freeReviews)} />
          <FinalCTA />
        </main>
        <Footer />
      </MotionProvider>
    </div>
  );
}
