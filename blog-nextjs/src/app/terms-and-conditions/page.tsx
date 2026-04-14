import { Metadata } from 'next';
import NavBar from '@/components/v2/NavBar';
import Footer from '@/components/v2/Footer';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Base.Tube terms and conditions of use.',
  alternates: { canonical: 'https://base.tube/terms-and-conditions' },
};

export default function TermsPage() {
  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />
      <main className="v2-legal-page">
        <div className="v2-legal-container">
          <span className="v2-legal-updated">Effective April 14, 2026</span>
          <h1>Terms and Conditions</h1>

          <section>
            <h2>1. Agreement to terms</h2>
            <p>
              By accessing or using Base.Tube (&ldquo;the Platform&rdquo;), you agree to be bound by these
              Terms and Conditions. If you do not agree, do not use the Platform.
              The Platform is operated by Base Labs (incorporation in progress, United States).
            </p>
          </section>

          <section>
            <h2>2. Eligibility</h2>
            <p>
              You must be at least 13 years old to use the Platform. If you are under 18,
              you represent that you have your parent or guardian&apos;s consent. We reserve the right
              to request proof of age and to suspend accounts that do not meet this requirement.
            </p>
          </section>

          <section>
            <h2>3. Accounts</h2>
            <p>
              You are responsible for maintaining the security of your account credentials.
              You are responsible for all activity that occurs under your account.
              If you suspect unauthorized access, contact us immediately
              at <a href="mailto:info@base.tube">info@base.tube</a>.
            </p>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms,
              engage in fraud, or abuse the Platform.
            </p>
          </section>

          <section>
            <h2>4. Content Passes</h2>
            <h3>What a Content Pass is</h3>
            <p>
              A Content Pass is a digital access token that grants the holder access to a creator&apos;s
              exclusive content on the Platform. Content Passes are recorded on the Base blockchain
              and can be resold on the Platform&apos;s marketplace.
            </p>
            <h3>Content Passes are not securities</h3>
            <p>
              Content Passes are digital collectibles that provide access to content.
              They are not investment contracts, securities, or financial instruments.
              Purchasing a Content Pass does not entitle you to equity, dividends, profit-sharing,
              or any ownership interest in any entity. The value of a Content Pass may go up or down
              and is determined by market demand.
            </p>
            <h3>For creators</h3>
            <p>
              Creators receive 90% of the primary sale price. A 10% platform fee is deducted
              at the time of sale. Creators earn a 5% royalty on secondary market resales,
              enforced by smart contract.
            </p>
            <h3>For fans</h3>
            <p>
              Purchasing a Content Pass grants you access to all exclusive content gated behind
              that pass, for as long as you hold it. If you sell or transfer your pass,
              you lose access to that creator&apos;s gated content.
            </p>
            <h3>No guarantees</h3>
            <p>
              We do not guarantee that any Content Pass will maintain or increase in value.
              We do not guarantee that creators will continue to produce content.
              You purchase Content Passes at your own risk.
            </p>
          </section>

          <section>
            <h2>5. Marketplace</h2>
            <p>
              The Platform provides a marketplace where Content Passes can be resold.
              All marketplace transactions are subject to a 5% creator royalty.
              Sellers set their own prices. Base.Tube does not set, recommend, or guarantee
              resale prices.
            </p>
          </section>

          <section>
            <h2>6. Payments and refunds</h2>
            <p>
              Payments are processed by Stripe. All sales are final. Content Pass purchases
              are non-refundable, because access is granted immediately upon purchase.
              If you believe a transaction was made in error or is fraudulent,
              contact us at <a href="mailto:info@base.tube">info@base.tube</a>.
            </p>
          </section>

          <section>
            <h2>7. Creator responsibilities</h2>
            <p>Creators agree to:</p>
            <ul>
              <li>Only gate content they own or have the rights to distribute</li>
              <li>Not upload content that is illegal, infringing, or violates third-party rights</li>
              <li>Use only unlisted YouTube videos for gated content (not private or public)</li>
              <li>Comply with YouTube&apos;s Terms of Service when linking YouTube content</li>
            </ul>
            <p>
              We reserve the right to remove content and suspend creator accounts that violate
              these obligations, without prior notice.
            </p>
          </section>

          <section>
            <h2>8. Prohibited conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Platform for any illegal purpose</li>
              <li>Manipulate marketplace prices, engage in wash trading, or create artificial demand</li>
              <li>Distribute, share, or resell access to gated content outside the Platform</li>
              <li>Attempt to circumvent the Platform&apos;s access controls or smart contracts</li>
              <li>Impersonate other users or creators</li>
              <li>Use bots, scrapers, or automated tools to access the Platform without permission</li>
              <li>Harass, abuse, or threaten other users</li>
            </ul>
          </section>

          <section>
            <h2>9. Intellectual property</h2>
            <p>
              Creators retain full ownership of their content. By uploading content to the Platform,
              creators grant Base.Tube a limited, non-exclusive license to display and distribute
              that content to pass holders through the Platform.
            </p>
            <p>
              The Base.Tube name, logo, and platform design are the property of Base Labs.
              You may not use our branding without written permission.
            </p>
          </section>

          <section>
            <h2>10. Blockchain and smart contracts</h2>
            <p>
              Content Passes are issued as tokens on the Base blockchain.
              Blockchain transactions are irreversible. We cannot reverse, cancel, or modify
              on-chain transactions once confirmed.
            </p>
            <p>
              Smart contract logic governs royalty distribution and pass ownership.
              While we audit our contracts, we do not guarantee they are free from bugs
              or vulnerabilities. You interact with blockchain technology at your own risk.
            </p>
          </section>

          <section>
            <h2>11. Limitation of liability</h2>
            <p>
              The Platform is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We make no warranties,
              express or implied, regarding the Platform&apos;s reliability, availability,
              or fitness for a particular purpose.
            </p>
            <p>
              To the maximum extent permitted by law, Base Labs shall not be liable for any
              indirect, incidental, consequential, or punitive damages arising from your use
              of the Platform, including but not limited to loss of funds, loss of data,
              or loss of content access.
            </p>
          </section>

          <section>
            <h2>12. Beta disclaimer</h2>
            <p>
              The Platform is currently in beta. Features may change, break, or be removed
              without notice. We are building in public and iterating based on user feedback.
              By using the beta, you acknowledge this and accept the associated risks.
            </p>
          </section>

          <section>
            <h2>13. Changes to these terms</h2>
            <p>
              We may update these terms from time to time. When we do, we will revise the
              effective date at the top of this page and notify users via email or platform
              notification. Continued use of the Platform after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>14. Governing law</h2>
            <p>
              These terms are governed by the laws of the United States. Any disputes shall be
              resolved in the courts of the United States, unless otherwise required by applicable law.
            </p>
          </section>

          <section>
            <h2>15. Contact</h2>
            <p>
              For questions about these terms, contact us at <a href="mailto:info@base.tube">info@base.tube</a>.
            </p>
          </section>
        </div>
      </main>
      <div className="v2-sep" aria-hidden />
      <Footer />
    </div>
  );
}
