import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Faqs from '../components/Faqs'
import JsonLd from '../components/JsonLd'
import BookCallButton from '../components/BookCallButton'
import { SERVICES, type Service } from '../data/services'

/** Shared layout for every service spoke, driven by src/data/services.ts. */
export default function ServicePage({ service }: { service: Service }) {
  const others = SERVICES.filter((other) => other.slug !== service.slug)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <div className="bg-black">
      <JsonLd data={faqSchema} />
      <Navbar variant="inline" />

      <PageHeader label={service.label} segments={service.headline} intro={service.intro} />

      {/* What's included */}
      <section className="px-4 pb-20 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
            What is included
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-1">
            {service.includes.map((item, i) => (
              <Reveal key={item.title} index={i % 2} className="h-full">
                <div className="h-full rounded-2xl bg-[#212121] p-6 sm:p-8">
                  <h3 className="text-base sm:text-lg" style={{ color: '#E1E0CC' }}>
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-400 sm:text-sm">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it runs */}
      {service.process && (
        <section className="px-4 pb-20 sm:px-6 md:pb-24">
          <div className="mx-auto max-w-5xl">
            <h2
              className="mb-4 text-center text-xl sm:text-2xl md:text-3xl"
              style={{ color: '#E1E0CC' }}
            >
              How it runs
            </h2>
            {service.process.map((step, i) => (
              <Reveal key={step.number} index={Math.min(i, 3)}>
                <div className="grid grid-cols-1 gap-3 border-t border-white/10 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                  <p className="text-xs text-primary md:col-span-2 md:text-sm">{step.number}</p>
                  <h3 className="text-xl md:col-span-4 md:text-2xl" style={{ color: '#E1E0CC' }}>
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-400 md:col-span-6 md:text-sm">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Outcomes */}
      <section className="px-4 pb-20 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-5xl rounded-2xl bg-[#101010] px-5 py-12 text-center sm:px-8 md:rounded-[2rem] md:px-12 md:py-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
            What you should expect
          </h2>
          <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-4 text-left">
            {service.outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="text-xs leading-snug text-gray-400 sm:text-sm">{outcome}</span>
              </li>
            ))}
          </ul>
          <BookCallButton className="mt-10" label="Talk it through" />
        </div>
      </section>

      <Faqs faqs={service.faqs} />

      {/* Sibling services */}
      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-xl sm:text-2xl" style={{ color: '#E1E0CC' }}>
            Other things we do
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-1">
            {others.map((other, i) => (
              <Reveal key={other.slug} index={i} className="h-full">
                <Link
                  to={`/services/${other.slug}`}
                  className="group flex h-full flex-col rounded-2xl bg-[#212121] p-6 transition-colors hover:bg-[#262626]"
                >
                  <h3 className="text-base sm:text-lg" style={{ color: '#E1E0CC' }}>
                    {other.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">{other.summary}</p>
                  <span className="mt-auto flex items-center gap-1.5 pt-6 text-xs text-primary">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
