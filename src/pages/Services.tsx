import {
  Check,
  CloudCog,
  Globe,
  Headset,
  Network,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'

interface Service {
  number: string
  title: string
  Icon: LucideIcon
  body: string
  items: string[]
}

const SERVICES: Service[] = [
  {
    number: '01',
    title: 'Managed IT support',
    Icon: Headset,
    body: 'A full IT department on a fixed monthly fee, with response times written into the agreement.',
    items: [
      'Unlimited helpdesk for your whole team',
      'Named engineer who knows your environment',
      '24/7 monitoring and alerting',
      'Asset register kept current, not annually',
    ],
  },
  {
    number: '02',
    title: 'Cloud and migration',
    Icon: CloudCog,
    body: 'Microsoft 365 and Azure set up properly the first time, and migrations planned around your trading hours.',
    items: [
      'Tenant design, licensing review and clean-up',
      'File server to SharePoint migrations',
      'Backup and recovery that gets tested',
      'Cost review so you stop paying for unused seats',
    ],
  },
  {
    number: '03',
    title: 'Cyber security',
    Icon: ShieldCheck,
    body: 'Practical controls that match the threats a business your size actually faces.',
    items: [
      'Multi-factor authentication across every service',
      'Endpoint protection and device encryption',
      'Phishing simulation and staff training',
      'Patching on an auditable schedule',
    ],
  },
  {
    number: '04',
    title: 'Networks and connectivity',
    Icon: Network,
    body: 'Wired, wireless and remote access designed to hold up on your busiest day, not your quietest.',
    items: [
      'Site surveys and Wi-Fi design',
      'Firewall configuration and review',
      'VPN and secure remote access',
      'Failover so one outage is not an outage',
    ],
  },
  {
    number: '05',
    title: 'Website development',
    Icon: Globe,
    body: 'Sites built to be found and to stay up — designed, hosted and reported on by the same team that runs your IT.',
    items: [
      'SEO optimised website built to rank, not just to look good',
      'Monthly reporting on traffic, rankings and enquiries',
      'DNS management — records, email routing and certificates',
      'Hosting with backups, monitoring and uptime included',
    ],
  },
  {
    number: '06',
    title: 'Projects and rollouts',
    Icon: Wrench,
    body: 'Office moves, hardware refreshes and system replacements, scoped with a fixed price before we start.',
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

      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 md:grid-cols-2 md:gap-1">
          {SERVICES.map((service, i) => (
            <Reveal key={service.number} index={i % 2} className="h-full">
              <div className="flex h-full flex-col rounded-2xl bg-[#212121] p-6 sm:p-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-white/[0.09] to-white/[0.02] ring-1 ring-white/10 sm:h-12 sm:w-12">
                  <service.Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" strokeWidth={1.5} />
                </span>

                <h3 className="mt-5 text-lg sm:text-xl" style={{ color: '#E1E0CC' }}>
                  {service.title}{' '}
                  <span className="align-super text-[10px] text-primary/70">{service.number}</span>
                </h3>

                <p className="mt-3 text-xs leading-relaxed text-gray-400 sm:text-sm">
                  {service.body}
                </p>

                <ul className="mt-6 flex flex-col gap-3">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="text-xs leading-snug text-gray-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
