'use client';

// "Get notified" form for the CTR AI, which is still in development.
// Posts client-side to the same Formspree endpoint the newsletter signup uses.

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import styles from './ctrWaitlist.module.css';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvgrqevw';
const LIST_ID = 'ctr-engine-waitlist';
const SUBJECT = 'CTR engine waitlist';
const REQUEST_TIMEOUT_MS = 15000;

// Deliberately simple: one "@", no spaces, and a dot in the domain.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = 'idle' | 'sending' | 'success' | 'error';
type ErrorKind = 'invalid' | 'failed';

const MESSAGES = {
  empty: 'Enter your email address.',
  invalid: 'That email address does not look right. Check it and try again.',
  failed: 'We could not save your email. Check your connection and try again.',
} as const;

export default function CtrWaitlistForm() {
  const uid = useId();
  const inputId = `${uid}-email`;
  const noteId = `${uid}-note`;
  const errorId = `${uid}-error`;

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<{ kind: ErrorKind; text: string } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // The form disappears on success and the field is disabled while sending,
  // so move focus on purpose to keep keyboard and screen reader users oriented.
  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
    if (status === 'error') inputRef.current?.focus();
  }, [status]);

  function fail(kind: ErrorKind, text: string) {
    setError({ kind, text });
    setStatus('error');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;

    const value = email.trim();
    if (!value) return fail('invalid', MESSAGES.empty);
    if (!EMAIL_PATTERN.test(value)) return fail('invalid', MESSAGES.invalid);

    setError(null);
    setStatus('sending');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: value, list: LIST_ID, _subject: SUBJECT }),
        signal: controller.signal,
      });

      if (response.ok) {
        setEmail('');
        setStatus('success');
      } else if (response.status === 422) {
        // Formspree rejected the address itself.
        fail('invalid', MESSAGES.invalid);
      } else {
        fail('failed', MESSAGES.failed);
      }
    } catch {
      fail('failed', MESSAGES.failed);
    } finally {
      clearTimeout(timer);
    }
  }

  const sending = status === 'sending';

  return (
    <div className={styles.panel} id="get-notified">
      <h2 className={styles.panelTitle}>Get notified when it launches</h2>

      {status === 'success' ? (
        <div className={styles.success} role="status" tabIndex={-1} ref={successRef}>
          <span className={styles.successDot} aria-hidden />
          <div>
            <p className={styles.successTitle}>You are on the list.</p>
            <p className={styles.successText}>We&apos;ll email you when the CTR AI launches.</p>
          </div>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={sending}>
          <input type="hidden" name="list" value={LIST_ID} />

          <label className={styles.label} htmlFor={inputId}>
            Email address
          </label>
          <div className={styles.row}>
            <input
              ref={inputRef}
              id={inputId}
              className={styles.input}
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={sending}
              aria-invalid={error?.kind === 'invalid'}
              aria-describedby={error ? `${errorId} ${noteId}` : noteId}
            />
            <button type="submit" className={`v2-btn v2-btn-primary ${styles.submit}`} disabled={sending}>
              {sending ? 'Sending…' : 'Get notified'}
            </button>
          </div>

          {error && (
            <p className={styles.error} id={errorId} role="alert">
              {error.text}
            </p>
          )}
          <p className={styles.note} id={noteId}>
            We&apos;ll only email you when it launches.
          </p>
        </form>
      )}
    </div>
  );
}
