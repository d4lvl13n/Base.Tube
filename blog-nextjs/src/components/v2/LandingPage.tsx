import NavBar from './NavBar';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import HowItWorksSection from './HowItWorksSection';
import FeaturesSection from './FeaturesSection';
import ComparisonSection from './ComparisonSection';
import GenesisSection from './GenesisSection';
import CTASection from './CTASection';
import Footer from './Footer';

/** Gradient line divider — fades at edges, Resend-style */
function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

export default function V2LandingPage() {
  return (
    <div className="v2-root">
      {/* Film grain texture — depth layer */}
      <div className="v2-grain" aria-hidden />

      <NavBar />
      <main>
        <HeroSection />
        <Sep />
        <ProblemSection />
        <Sep />
        <HowItWorksSection />
        <Sep />
        <FeaturesSection />
        <Sep />
        <ComparisonSection />
        <Sep />
        <GenesisSection />
        <Sep />
        <CTASection />
      </main>
      <Sep />
      <Footer />
    </div>
  );
}
