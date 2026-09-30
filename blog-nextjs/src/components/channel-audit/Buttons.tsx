import { ArrowRight } from 'lucide-react';
import { CHANNEL_AUDIT_APP_URL } from './content';

/** The page's one main action: the channel audit in the app (the app does not take a channel from the address). */
export function AuditButton({ className = '', label = 'Audit my channel' }: { className?: string; label?: string }) {
  return (
    <a
      href={CHANNEL_AUDIT_APP_URL}
      className={`lp-btn-primary group inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-full px-8 text-base font-semibold text-white ${className}`}
    >
      {label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </a>
  );
}

/** The terms under the main button: all three are true in the app and backend. */
export function AuditTerms({ className = '' }: { className?: string }) {
  return (
    <p className={`text-sm text-zinc-400 ${className}`}>
      <span className="font-semibold text-white">Free</span>
      <span aria-hidden="true" className="px-2 text-zinc-600">
        /
      </span>
      free account: email, Google or Discord
      <span aria-hidden="true" className="px-2 text-zinc-600">
        /
      </span>
      no YouTube access needed
    </p>
  );
}
