import Image from 'next/image';
import Link from 'next/link';
import { AUDIT_URL, CREATOR_HUB_URL, PRICING_URL, REFUND_URL, STUDIO_URL } from './catalog';
import { LOGO_SRC } from './content';

const footerLink = 'block text-sm text-zinc-400 transition-colors hover:text-white';
const socialLink = 'text-sm text-zinc-500 transition-colors hover:text-white';

/** Product, company and support links (the app's landing footer; the app's pages are linked on beta.base.tube). */
export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image src={LOGO_SRC} alt="Base.Tube Logo" width={36} height={36} loading="lazy" className="h-9 w-9" />
              <div className="leading-tight">
                <p className="text-base font-bold text-white">Base.Tube</p>
                <p className="text-xs text-zinc-500">AI Thumbnails</p>
              </div>
            </div>
            <p className="max-w-xs text-sm text-zinc-500">Thumbnails in your channel&apos;s style, and reviews that say what to change.</p>
          </div>

          <nav aria-label="Product">
            <p className="mb-4 text-sm font-semibold text-white">Product</p>
            <div className="space-y-2.5">
              <a href={PRICING_URL} className={footerLink}>
                Pricing
              </a>
              <a href={AUDIT_URL} className={footerLink}>
                Thumbnail review
              </a>
              <a href={STUDIO_URL} className={footerLink}>
                Studio
              </a>
              <a href="#features" className={footerLink}>
                Features
              </a>
            </div>
          </nav>

          <nav aria-label="Company">
            <p className="mb-4 text-sm font-semibold text-white">Company</p>
            <div className="space-y-2.5">
              <Link href="/" className={footerLink}>
                Base.Tube Platform
              </Link>
              <a href={CREATOR_HUB_URL} className={footerLink}>
                Creator Hub
              </a>
              <Link href="/" className={footerLink}>
                About Us
              </Link>
              <a href="mailto:support@base.tube" className={footerLink}>
                Contact
              </a>
            </div>
          </nav>

          <nav aria-label="Support">
            <p className="mb-4 text-sm font-semibold text-white">Support</p>
            <div className="space-y-2.5">
              <a href="mailto:support@base.tube" className={footerLink}>
                Help Center
              </a>
              <Link href="/privacy-policy" className={footerLink}>
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className={footerLink}>
                Terms of Service
              </Link>
              <a href={REFUND_URL} className={footerLink}>
                Refund Policy
              </a>
              <a href="#faq" className={footerLink}>
                FAQ
              </a>
            </div>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8">
          <p className="text-sm text-zinc-600">© 2026 Base.Tube. All rights reserved.</p>
          {/* The app's footer also linked youtube.com/@basetube, which is not Base.Tube's channel: left out. */}
          <div className="flex items-center gap-6">
            <a href="https://x.com/base_tube" target="_blank" rel="noopener noreferrer" className={socialLink}>
              Twitter
            </a>
            <a href="https://discord.gg/SDdDCjGZHw" target="_blank" rel="noopener noreferrer" className={socialLink}>
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
