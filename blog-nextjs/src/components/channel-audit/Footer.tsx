import Image from 'next/image';
import Link from 'next/link';
import { PRICING_URL } from '@/components/ai-thumbnails/catalog';
import { LOGO_SRC } from '@/components/ai-thumbnails/content';
import { CHANNEL_AUDIT_APP_URL, THUMBNAIL_REVIEW_URL } from './content';

const footerLink = 'block text-sm text-zinc-400 transition-colors hover:text-white';
const socialLink = 'text-sm text-zinc-400 transition-colors hover:text-white';

/** Product, company and support links, in the style of the AI Thumbnails footer (every link lands somewhere real). */
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
                <p className="text-xs text-zinc-400">Channel audit</p>
              </div>
            </div>
            <p className="max-w-xs text-sm text-zinc-400">A free read of your thumbnails and titles, and the experiments worth running.</p>
          </div>

          <nav aria-label="Product">
            <p className="mb-4 text-sm font-semibold text-white">Product</p>
            <div className="space-y-2.5">
              <a href={CHANNEL_AUDIT_APP_URL} className={footerLink}>
                Run the channel audit
              </a>
              <a href={THUMBNAIL_REVIEW_URL} className={footerLink}>
                Thumbnail review
              </a>
              <Link href="/ai-thumbnails" className={footerLink}>
                AI Thumbnails
              </Link>
              <a href={PRICING_URL} className={footerLink}>
                Pricing
              </a>
            </div>
          </nav>

          <nav aria-label="Resources">
            <p className="mb-4 text-sm font-semibold text-white">Resources</p>
            <div className="space-y-2.5">
              <Link href="/tools" className={footerLink}>
                Free tools
              </Link>
              <Link href="/youtube-thumbnail-size" className={footerLink}>
                YouTube thumbnail size
              </Link>
              <Link href="/blog" className={footerLink}>
                Blog
              </Link>
              <Link href="/" className={footerLink}>
                Base.Tube Platform
              </Link>
            </div>
          </nav>

          <nav aria-label="Support">
            <p className="mb-4 text-sm font-semibold text-white">Support</p>
            <div className="space-y-2.5">
              <a href="mailto:support@base.tube" className={footerLink}>
                Contact
              </a>
              <a href="#faq" className={footerLink}>
                FAQ
              </a>
              <Link href="/privacy-policy" className={footerLink}>
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className={footerLink}>
                Terms of Service
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8">
          <p className="text-sm text-zinc-400">© 2026 Base.Tube. All rights reserved.</p>
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
