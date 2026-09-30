// The home page (/): Base.Tube's conviction, "Stop renting fans. Own your audience." The hero shows
// renting against owning; the case says what renting means, with sourced numbers and creators' own
// words; then how Base.Tube gives the audience back (sell directly, know your buyers, grow with
// built-in tools), and a close on the same conviction. Same visual language as /ai-thumbnails
// (Archivo, the orange accent, near-black). All copy is in the server's HTML; motion stops under
// prefers-reduced-motion.
import { archivo } from './fonts';
import Footer from '@/components/v2/Footer';
import NavBar from '@/components/v2/NavBar';
import Case from './Case';
import { FinalCall } from './Closing';
import Hero from './Hero';
import Pillars from './Pillars';

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
        <Case />
        <Pillars />
        <FinalCall />
      </main>
      <Footer />
    </div>
  );
}
