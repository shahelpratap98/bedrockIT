import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Faqs from '../components/Faqs'
import JsonLd from '../components/JsonLd'
import BookCallButton from '../components/BookCallButton'
import SystemsShowcase from '../components/SystemsShowcase'
import QuoteForm from '../components/QuoteForm'
import StickyQuoteBar from '../components/StickyQuoteBar'
import { SERVICES, type Service } from '../data/services'
import { PROJECTS } from '../data/projects'

const BASE = import.meta.env.BASE_URL
const QUOTE_ID = 'quote'

/**
 * Jumps to the quote form further down this page. The form is the main action
 * because a sent form is the Google Ads conversion; a WhatsApp chat on its own
 * records nothing.
 */
function QuoteLink() {
  return (
    <a
      href={`#${QUOTE_ID}`}
      className="group inline-flex items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-all duration-300 hover:gap-3"
    >
      Get a fixed quote
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110">
        <ArrowRight className="h-4 w-4" style={{ color: '#E1E0CC' }} />
      </span>
    </a>
  )
}

/** Shared layout for every service spoke, driven by src/data/services.ts. */
export default function ServicePage({ service }: { service: Service }) {
  const others = SERVICES.filter((other) => other.slug !== service.slug)
  const proof = (service.relatedProjects ?? [])
    .map((name) => PROJECTS.find((project) => project.name === name))
    .filter((project): project is (typeof PROJECTS)[number] => Boolean(project))

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

      {/*
        The only CTA used to be the one in the outcomes block, roughly six
        screens down on mobile. This puts one in the first viewport on all four
        spokes.
      */}
      <div className="-mt-10 flex flex-col items-center gap-6 pb-14">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <QuoteLink />
          <BookCallButton secondary label="Chat on WhatsApp" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
          Last updated {service.lastUpdated}
        </p>
      </div>

      {/* Screens first: for a system, seeing it is the argument. */}
      {service.showcase && <SystemsShowcase />}

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

      {/*
        The quote form itself, on the page the ads land on, so nobody has to
        go to /contact first. Not wrapped in Reveal: when the hero button or
        the sticky bar jumps here it must already be visible.
      */}
      <section id={QUOTE_ID} className="scroll-mt-6 px-4 pb-20 sm:px-6 md:pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-1">
          <div className="rounded-2xl bg-[#212121] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
              Get a fixed quote
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                'We reply within one business day',
                'A fixed price, agreed in writing before any work',
                'No obligation to go ahead',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="text-xs leading-snug text-gray-400 sm:text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-[#101010] p-6 sm:p-8 md:p-10 lg:col-span-2">
            <QuoteForm
              service={service.name}
              submitLabel="Get my fixed quote"
              messagePlaceholder="What you use today, what you want it to do, and roughly when you need it."
            />
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
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <QuoteLink />
            <BookCallButton secondary label="Talk it through" />
          </div>
        </div>
      </section>

      {/*
        Proof, immediately before the FAQ. Only rendered where the work
        actually evidences this service — see relatedProjects in the data.
      */}
      {proof.length > 0 && (
        <section className="px-4 pb-20 sm:px-6 md:pb-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
              Sites we have built
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-xs leading-relaxed text-gray-400 sm:text-sm">
              Every one of these is live today. Open them and judge the work yourself.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-1">
              {proof.map((project, i) => (
                <Reveal key={project.name} index={i} className="h-full">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-[#212121] transition-colors hover:bg-[#262626]"
                  >
                    <img
                      src={`${BASE}media/projects/${project.image}`}
                      alt={`The ${project.name} website homepage`}
                      loading="lazy"
                      width={1440}
                      height={900}
                      className="h-40 w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] sm:h-44"
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base sm:text-lg" style={{ color: '#E1E0CC' }}>
                        {project.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">{project.sector}</p>
                      <span className="mt-auto flex items-center gap-1.5 pt-5 text-xs text-primary">
                        {project.linkLabel ?? project.domain}
                        <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>

            <p className="mt-8 text-center text-xs text-gray-400 sm:text-sm">
              <Link to="/projects" className="text-primary underline-offset-4 hover:underline">
                See every site we have built
              </Link>
            </p>
          </div>
        </section>
      )}

      <Faqs faqs={service.faqs} />

      {/* Sibling services */}
      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-xl sm:text-2xl" style={{ color: '#E1E0CC' }}>
            Other things we do
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-1 lg:grid-cols-4">
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

      <StickyQuoteBar targetId={QUOTE_ID} />
    </div>
  )
}
