'use client';

import { useId, useState } from 'react';
import { m } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useReducedMotionSafe } from './motion';

/**
 * One question: opens smoothly, its plus turns into a cross, orange while open. The answer is always
 * in the page (folded to zero height while closed), so search engines read the same FAQ as the
 * FAQPage data.
 */
export default function FaqRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotionSafe();
  const id = useId();
  return (
    <div className="py-1">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-lg font-medium text-white"
        >
          <span className={`transition-colors ${open ? 'text-[#ff9a3c]' : 'group-hover:text-[#ff9a3c]'}`}>{question}</span>
          <span
            aria-hidden="true"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              open ? 'rotate-45 border-[#fa7517] bg-[#fa7517] text-white' : 'border-white/15 text-zinc-400 group-hover:border-[#fa7517]/60'
            }`}
          >
            <Plus className="h-4 w-4" />
          </span>
        </button>
      </h3>
      <m.div
        id={id}
        aria-hidden={!open}
        initial={false}
        animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
        className="overflow-hidden"
      >
        <p className="max-w-2xl pb-6 pr-12 text-base text-zinc-400">{answer}</p>
      </m.div>
    </div>
  );
}
