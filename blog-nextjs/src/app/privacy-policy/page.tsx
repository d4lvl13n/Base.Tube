import { Metadata } from 'next';
import NavBar from '@/components/v2/NavBar';
import Footer from '@/components/v2/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Base.Tube privacy policy — how we collect, use, and protect your data.',
  alternates: { canonical: 'https://base.tube/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />
      <main className="v2-legal-page">
        <div className="v2-legal-container">
          <span className="v2-legal-updated">Effective April 14, 2026</span>
          <h1>Privacy Policy</h1>

          <section>
            <h2>1. Who we are</h2>
            <p>
              Base.Tube is operated by Base Labs (incorporation in progress, United States).
              When we say "we," "us," or "our," we mean Base Labs and the Base.Tube platform.
              For questions about this policy, contact us at <a href="mailto:info@base.tube">info@base.tube</a>.
            </p>
          </section>

          <section>
            <h2>2. What we collect</h2>
            <h3>Account data</h3>
            <p>
              When you create an account, we collect your email address and, if you connect a YouTube channel,
              the OAuth token and channel metadata required to verify ownership. We do not store your Google password.
            </p>
            <h3>Payment data</h3>
            <p>
              Payments are processed by Stripe. We do not store credit card numbers, CVVs, or full payment
              credentials on our servers. Stripe handles all sensitive payment data under their own PCI-compliant
              infrastructure.
            </p>
            <h3>Blockchain data</h3>
            <p>
              Content Pass transactions are recorded on the Base blockchain (a Layer 2 Ethereum network).
              Blockchain transactions are public by design. Wallet addresses associated with pass purchases
              or resales are visible on-chain. We do not control or have the ability to delete on-chain data.
            </p>
            <h3>Usage and analytics</h3>
            <p>
              We collect anonymized usage data including IP addresses, browser type, pages visited, and
              interaction patterns. This data is used for analytics and service improvement. IP addresses
              are not linked to individual user accounts.
            </p>
            <p>We use Vercel Analytics for aggregated, privacy-friendly website analytics.</p>
          </section>

          <section>
            <h2>3. How we use your data</h2>
            <ul>
              <li>To operate the platform and provide access to Content Passes and creator tools</li>
              <li>To process payments and payouts</li>
              <li>To verify YouTube channel ownership</li>
              <li>To communicate with you about your account, transactions, and platform updates</li>
              <li>To improve the platform based on aggregated, anonymized usage patterns</li>
              <li>To prevent fraud, abuse, and unauthorized access</li>
            </ul>
            <p>We do not sell your personal data to third parties. We do not use your data for advertising.</p>
          </section>

          <section>
            <h2>4. Data sharing</h2>
            <p>We share data only with the following categories of third parties, and only as necessary:</p>
            <ul>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Google/YouTube</strong> — channel verification via OAuth</li>
              <li><strong>Vercel</strong> — website hosting and analytics</li>
              <li><strong>Hetzner</strong> — server infrastructure (EU-based)</li>
            </ul>
            <p>
              We may disclose data if required by law, regulation, or legal process, or to protect
              the rights and safety of our users and the platform.
            </p>
          </section>

          <section>
            <h2>5. Where your data is stored</h2>
            <p>
              Our servers are hosted by Hetzner in the European Union. Data may be processed
              by third-party services (Stripe, Vercel) in the United States under their respective
              data protection agreements.
            </p>
          </section>

          <section>
            <h2>6. Data retention</h2>
            <p>
              We retain account data for as long as your account is active. If you delete your account,
              we remove your personal data from our systems within 30 days, except where retention is
              required by law or for legitimate business purposes (e.g., financial records).
              Blockchain data cannot be deleted due to the immutable nature of the technology.
            </p>
          </section>

          <section>
            <h2>7. Your rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at <a href="mailto:info@base.tube">info@base.tube</a>.
              We respond to requests within 30 days.
            </p>
          </section>

          <section>
            <h2>8. Cookies</h2>
            <p>
              We use essential cookies required for the platform to function (authentication, session management).
              We do not use advertising or third-party tracking cookies.
            </p>
          </section>

          <section>
            <h2>9. Children</h2>
            <p>
              Base.Tube is not directed at children under 13. We do not knowingly collect personal data
              from children under 13. If you believe a child has provided us with personal data,
              contact us at <a href="mailto:info@base.tube">info@base.tube</a> and we will delete it.
            </p>
          </section>

          <section>
            <h2>10. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. When we do, we will revise the effective date
              at the top of this page. Continued use of the platform after changes constitutes acceptance
              of the updated policy.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              For any questions about this privacy policy or your data, contact us
              at <a href="mailto:info@base.tube">info@base.tube</a>.
            </p>
          </section>
        </div>
      </main>
      <div className="v2-sep" aria-hidden />
      <Footer />
    </div>
  );
}
