// /tools/ctr-optimizer: the question Base.Tube's CTR AI will answer one day, asked with two real
// thumbnail ideas, and an honest answer: it is not good enough to trust yet, so it is not released.
// The site's NavBar and Footer frame it; inside, the type, buttons, motion and FAQ of /ai-thumbnails.
import Link from 'next/link';
import Faq from '@/components/ai-thumbnails/Faq';
import { anton, archivo } from '@/components/ai-thumbnails/fonts';
import { MotionProvider, RevealHeading } from '@/components/ai-thumbnails/motion';
import Footer from '@/components/v2/Footer';
import NavBar from '@/components/v2/NavBar';
import ClickQuestion from './ClickQuestion';
import { CTR_FAQ, FACTS } from './content';
import WaitlistForm from './WaitlistForm';
import styles from './ctr.module.css';

// Without scripts, the scroll reveals never run: show everything as it ends.
const NO_SCRIPT_STYLE =
  '<style>.lp .lp-words .lp-word,.lp .lp-reveal,.lp [data-lp-reveal]{opacity:1!important;transform:none!important;filter:none!important}</style>';

export default function CtrOptimizerPage() {
  return (
    <div className="v2-root">
      <NavBar />
      <div className={`lp ${archivo.variable} ${anton.variable} ${styles.page}`}>
        <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT_STYLE }} />
        <MotionProvider>
          <main>
            <section className={styles.hero} aria-labelledby="ctr-title">
              <RevealHeading
                as="h1"
                id="ctr-title"
                immediate
                delay={0.05}
                className={`lp-display ${styles.title}`}
                parts={['Which one gets the click?']}
              />

              <ClickQuestion />

              <div className={styles.answer}>
                <div className={styles.answerText}>
                  <h2 className={`lp-heading ${styles.answerTitle}`}>We’re teaching our own AI to answer this.</h2>
                  <p className={styles.answerBody}>
                    Base.Tube’s CTR AI isn’t good enough to trust yet, so we haven’t released it. Leave your email and we’ll tell
                    you when it’s ready.
                  </p>
                </div>
                <WaitlistForm />
              </div>
            </section>

            <div className={styles.below}>
              <section className={styles.facts} aria-labelledby="ctr-facts-title">
                <div className={styles.grid}>
                  <h2 id="ctr-facts-title" className={`lp-heading ${styles.sideTitle}`}>
                    Where it stands.
                  </h2>
                  <div className={styles.main}>
                    <ul className={styles.factList}>
                      {FACTS.map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                    <p className={styles.meanwhile}>
                      Meanwhile, you can <Link href="/youtube-channel-audit">run a free channel audit</Link>, make thumbnails
                      with <Link href="/ai-thumbnails">AI Thumbnails</Link>, or try the <Link href="/tools">free tools</Link>.
                    </p>
                  </div>
                </div>
              </section>

              <Faq items={CTR_FAQ} />
            </div>
          </main>
        </MotionProvider>
      </div>
      <Footer />
    </div>
  );
}
