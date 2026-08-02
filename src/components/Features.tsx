import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, CloudCog, Globe, ShieldCheck, type LucideIcon } from 'lucide-react'
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle'

// Generated server-room clip, self-hosted from public/media. Swap the file to
// change the footage. BASE_URL keeps subpath builds (GitHub Pages) working.
const CARD_VIDEO = `${import.meta.env.BASE_URL}media/card-systems.mp4`

interface FeatureCard {
  number: string
  title: string
  Icon: LucideIcon
  to: string
  items: string[]
}

const CARDS: FeatureCard[] = [
  {
    number: '01',
    title: 'Website Development.',
    Icon: Globe,
    to: '/services/website-development',
    items: [
      'SEO optimised sites built to rank, not just to look good.',
      'Monthly reporting on traffic, rankings and enquiries.',
      'DNS management — records, email routing and certificates.',
      'Hosting with backups, monitoring and uptime included.',
    ],
  },
  {
    number: '02',
    title: 'Cloud & Migration.',
    Icon: CloudCog,
    to: '/services/cloud-migration',
    items: [
      'Microsoft 365 and Azure set up the way it should be.',
      'Server and file migrations planned around your hours.',
      'Backup and recovery tested, not just configured.',
    ],
  },
  {
    number: '03',
    title: 'Cyber Security.',
    Icon: ShieldCheck,
    to: '/services/cyber-security',
    items: [
      'Multi-factor and endpoint protection across every device.',
      'Phishing simulations and training for your staff.',
      'Patching and hardening on a schedule you can audit.',
    ],
  },
]

const CARD_EASE = [0.22, 1, 0.36, 1] as const

const cardVariant = {
  initial: { opacity: 0, scale: 0.95 },
  animate: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: i * 0.15, ease: CARD_EASE },
  }),
}

export default function Features() {
  const gridRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(gridRef, { once: true, margin: '-100px' })

  return (
    <section className="relative bg-black px-4 py-20 sm:px-6 md:py-28">
      {/* Faded at both edges so the grain does not butt up against the pure
          black of the next section as a visible seam. */}
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.12] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]" />

      <div className="relative mx-auto w-full max-w-7xl">
        <WordsPullUpMultiStyle
          as="h2"
          className="mx-auto max-w-3xl text-center text-xl font-normal leading-tight sm:text-2xl md:text-3xl lg:text-4xl"
          style={{ color: '#E1E0CC' }}
          segments={[
            {
              text: 'Enterprise-grade IT for growing businesses.',
              className: '',
              breakAfter: true,
            },
            { text: 'Built to stay up. Backed by people who answer.', className: 'text-gray-500' },
          ]}
        />

        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 gap-3 sm:gap-2 md:mt-20 md:grid-cols-2 md:gap-1 lg:h-[480px] lg:grid-cols-4"
        >
          {/* Card 1 — full-bleed video */}
          <motion.div
            custom={0}
            variants={cardVariant}
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            className="relative h-72 overflow-hidden rounded-2xl lg:h-full"
          >
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={CARD_VIDEO}
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <p
              className="absolute bottom-5 left-5 right-5 text-base font-medium sm:text-lg"
              style={{ color: '#E1E0CC' }}
            >
              Your systems, always on.
            </p>
          </motion.div>

          {CARDS.map((card, i) => (
            <motion.div
              key={card.number}
              custom={i + 1}
              variants={cardVariant}
              initial="initial"
              animate={isInView ? 'animate' : 'initial'}
              className="flex h-full flex-col rounded-2xl bg-[#212121] p-5 sm:p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-white/[0.09] to-white/[0.02] ring-1 ring-white/10 sm:h-12 sm:w-12">
                <card.Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" strokeWidth={1.5} />
              </span>

              <h3
                className="mt-5 text-base font-medium sm:text-lg"
                style={{ color: '#E1E0CC' }}
              >
                {card.title}{' '}
                <span className="align-super text-[10px] text-primary/70">{card.number}</span>
              </h3>

              <ul className="mt-5 flex flex-col gap-3">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="text-xs leading-snug text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={card.to}
                className="group mt-auto flex items-center gap-1.5 pt-8 text-xs text-primary transition-colors hover:text-primary/70"
              >
                Learn more
                <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
