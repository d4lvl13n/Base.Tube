'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * The Meta pixel base code counts the first page view; pages opened afterwards without a reload
 * (client-side navigation) are counted here.
 */
export function MetaPixelPageView() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.('track', 'PageView');
  }, [pathname]);
  return null;
}
