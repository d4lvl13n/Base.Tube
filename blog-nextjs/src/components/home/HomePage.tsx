// The home page (/): Base.Tube as a creator hub, where creators publish, sell their work directly to
// fans (Content Pass), keep the relationship with their buyers, and grow with built-in tools (AI
// Thumbnails, the free tools, the channel audit). Same visual language as /ai-thumbnails (Archivo,
// the orange accent, near-black, real example thumbnails), its own compositions. All copy is in the
// server's HTML; motion stops under prefers-reduced-motion.
import { archivo } from '@/components/ai-thumbnails/fonts';
import Footer from '@/components/v2/Footer';
import NavBar from '@/components/v2/NavBar';
import { FinalCall, WhyBaseTube } from './Closing';
import Hero from './Hero';
import Pillars from './Pillars';
import ProofWall from './ProofWall';

// Without scripts, the scroll reveals never run: show everything as it ends.
const NO_SCRIPT_STYLE =
  '<style>.hp .lp-words .lp-word,.hp .lp-reveal{opacity:1!important;transform:none!important;filter:none!important}</style>';

export default function HomePage() {
  return (
    <div className={`v2-root hp ${archivo.variable}`}>
      <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT_STYLE }} />
      <NavBar />
      <main>
        <Hero />
        <Pillars />
        <ProofWall />
        <WhyBaseTube />
        <FinalCall />
      </main>
      <Footer />
    </div>
  );
}
