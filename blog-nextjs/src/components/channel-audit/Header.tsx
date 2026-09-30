import Image from 'next/image';
import Link from 'next/link';
import HeaderShell from '@/components/ai-thumbnails/HeaderShell';
import { LOGO_SRC } from '@/components/ai-thumbnails/content';
import { CHANNEL_AUDIT_APP_URL } from './content';

/** The header: the sections of this page, AI Thumbnails, and the audit itself (a white pill, as on /ai-thumbnails). */
export default function Header() {
  const link = 'text-sm text-white/75 transition-colors hover:text-white';
  return (
    <HeaderShell>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image src={LOGO_SRC} alt="Base.Tube Logo" width={32} height={32} loading="eager" className="h-8 w-8" />
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold text-white">Base.Tube</span>
            <span className="text-xs text-white/55">Channel audit</span>
          </span>
        </Link>

        <nav aria-label="Channel audit" className="flex items-center gap-4 sm:gap-7">
          <a href="#example" className={`${link} hidden md:inline`}>
            Example
          </a>
          <a href="#how-it-works" className={`${link} hidden md:inline`}>
            How it works
          </a>
          <a href="#faq" className={`${link} hidden md:inline`}>
            FAQ
          </a>
          <Link href="/ai-thumbnails" className={`${link} hidden lg:inline`}>
            AI Thumbnails
          </Link>
          <a
            href={CHANNEL_AUDIT_APP_URL}
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
          >
            Audit my channel
          </a>
        </nav>
      </div>
    </HeaderShell>
  );
}
