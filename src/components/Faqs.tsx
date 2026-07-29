import type { Faq } from '../data/services'
import Reveal from './Reveal'

/**
 * Questions and answers stay in the markup rather than hiding behind a click —
 * it is the content most likely to match how someone phrases a search.
 */
export default function Faqs({ faqs }: { faqs: Faq[] }) {
  return (
    <section className="px-4 pb-20 sm:px-6 md:pb-28">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
          Common questions
        </h2>

        <dl className="mt-10">
          {faqs.map((faq, i) => (
            <Reveal key={faq.question} index={Math.min(i, 3)}>
              <div className="border-t border-white/10 py-7 md:py-8">
                <dt className="text-base sm:text-lg" style={{ color: '#E1E0CC' }}>
                  {faq.question}
                </dt>
                <dd className="mt-3 text-xs leading-relaxed text-gray-400 sm:text-sm">
                  {faq.answer}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
