import Image from 'next/image';
import Link from 'next/link';
import { AUDIT_URL, SIGN_IN_URL, type StartOffer } from './catalog';
import { StartOfferButton } from './Buttons';
import { LOGO_SRC } from './content';
import HeaderShell from './HeaderShell';

/**
 * The landing page's header: Features, Pricing (the plans further down this page), the free review,
 * "Log in" (AI Thumbnails' own sign-in page in the app) and the short start button
 * ("Start free trial": the app's sign-up page, then Stripe Checkout).
 */
export default function Header({ offer }: { offer: StartOffer }) {
  const link = 'text-sm text-white/75 transition-colors hover:text-white';
  return (
    <HeaderShell>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image src={LOGO_SRC} alt="Base.Tube Logo" width={32} height={32} loading="eager" className="h-8 w-8" />
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold text-white">Base.Tube</span>
            <span className="text-xs text-white/55">AI Thumbnails</span>
          </span>
        </Link>

        <nav aria-label="AI Thumbnails" className="flex items-center gap-4 sm:gap-7">
          <a href="#features" className={`${link} hidden md:inline`}>
            Features
          </a>
          <a href="#pricing" className={`${link} hidden md:inline`}>
            Pricing
          </a>
          <a href={AUDIT_URL} className={`${link} hidden md:inline`}>
            Free review
          </a>
          <a href={SIGN_IN_URL} className={link}>
            Log in
          </a>
          <StartOfferButton
            offer={offer}
            short
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
          />
        </nav>
      </div>
    </HeaderShell>
  );
}
