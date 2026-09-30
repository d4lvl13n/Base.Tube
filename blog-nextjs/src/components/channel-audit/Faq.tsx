import FaqRow from '@/components/ai-thumbnails/FaqRow';
import { RevealHeading } from '@/components/ai-thumbnails/motion';
import type { FaqItem } from './content';

/** The questions (the same list the FAQPage data uses), laid out like the AI Thumbnails FAQ; the email link is underlined. */
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section id="faq" aria-labelledby="ca-faq-title" className="scroll-mt-16 border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <RevealHeading id="ca-faq-title" className="lp-heading text-4xl text-white sm:text-5xl" parts={['Questions, ', { accent: 'answered.' }]} />
          <p className="mt-5 text-base text-zinc-400">
            Something else? Write to{' '}
            <a href="mailto:support@base.tube" className="text-[#fb923c] underline underline-offset-4 hover:text-orange-300">
              support@base.tube
            </a>
            .
          </p>
        </div>
        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08] lg:col-span-8">
          {items.map((item) => (
            <FaqRow key={item.question} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
