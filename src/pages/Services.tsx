import { Link } from 'react-router-dom'
import { ArrowRight, Check, CloudCog, Globe, Headset, Network, ShieldCheck, Wrench } from 'lucide-react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { SERVICES } from '../data/services'

const ICONS: Record<string, typeof Globe> = {
  'website-development': Globe,
  'managed-it-support': Headset,
  'cyber-security': ShieldCheck,
  'cloud-migration': CloudCog,
}

/** Services without enough depth for their own page live here. */
const ALSO = [
  {
    title: 'Networks and connectivity',
    Icon: Network,
    items: [
      'Site surveys and Wi-Fi design',
      'Firewall configuration and review',
      'VPN and secure remote access',
      'Failover so one outage is not an outage',
    ],
  },
  {
    title: 'Projects and rollouts',
    Icon: Wrench,
    items: [
      'Office relocations planned to the hour',
      'Device procurement and staged builds',
      'Onboarding and offboarding runbooks',
      'Documentation you keep, even if we part ways',
    ],
  },
]

export default function Services() {
  return (
    <div className="bg-black">
      <Navbar variant="inline" />

      <PageHeader
        label="Services"
        segments={[
          { text: 'Everything your business runs on,', className: 'font-normal' },
          { text: 'under one agreement.', className: 'italic font-serif' },
        ]}
        intro="Most clients take the lot. Some start with one piece and add the rest once they trust us. Either way, the scope is written down and the price is fixed before any work begins."
      />

      {/* The four main services, each with its own page */}
      <section className="px-4 pb-20 sm:px-6 md:pb-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 md:grid-cols-2 md:gap-1">
          {SERVICES.map((service, i) => {
            const Icon = ICONS[service.slug] ?? Globe
            return (
              <Reveal key={service.slug} index={i % 2} className="h-full">
                <Link
                  to={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-2xl bg-[#212121] p-6 transition-colors hover:bg-[#262626] sm:p-8"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-white/[0.09] to-white/[0.02] ring-1 ring-white/10 sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" strokeWidth={1.5} />
                  </span>

                  <h2 className="mt-5 text-lg sm:text-xl" style={{ color: '#E1E0CC' }}>
                    {service.name}
                  </h2>

                  <p className="mt-3 text-xs leading-relaxed text-gray-400 sm:text-sm">
                    {service.intro}
                  </p>

                  <span className="mt-auto flex items-center gap-1.5 pt-8 text-xs text-primary">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Everything else, kept here rather than split into thin pages */}
      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
            Also part of the job
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-1">
            {ALSO.map((item, i) => (
              <Reveal key={item.title} index={i} className="h-full">
                <div className="flex h-full flex-col rounded-2xl bg-[#212121] p-6 sm:p-8">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-white/[0.09] to-white/[0.02] ring-1 ring-white/10 sm:h-12 sm:w-12">
                    <item.Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" strokeWidth={1.5} />
                  </span>

                  <h3 className="mt-5 text-lg sm:text-xl" style={{ color: '#E1E0CC' }}>
                    {item.title}
                  </h3>

                  <ul className="mt-5 flex flex-col gap-3">
                    {item.items.map((line) => (
                      <li key={line} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="text-xs leading-snug text-gray-400">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
