import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { CONTACT, EMAIL_HREF, WHATSAPP_URL } from '../config/contact'

const CHANNELS = [
  {
    title: 'Phone',
    detail: CONTACT.phoneDisplay,
    href: CONTACT.phoneHref,
    body: 'A person, not a menu tree. Best for anything stopping you working right now.',
  },
  {
    title: 'WhatsApp',
    detail: CONTACT.phoneDisplay,
    href: WHATSAPP_URL,
    external: true,
    body: 'Send a photo of the error and we can often diagnose it before we call you back.',
  },
  {
    title: 'Email',
    detail: CONTACT.email,
    href: EMAIL_HREF,
    body: 'Best for anything that is not urgent, and for keeping a written trail.',
  },
]

const SLA = [
  { priority: 'P1', label: 'Business down', response: '15 minutes', target: '4 hours' },
  { priority: 'P2', label: 'Team blocked', response: '1 hour', target: '8 hours' },
  { priority: 'P3', label: 'One user affected', response: '4 hours', target: '2 business days' },
  { priority: 'P4', label: 'Request or change', response: '1 business day', target: 'By agreement' },
]

const INCLUDED = [
  'Unlimited helpdesk contacts — no per-ticket charging',
  'Remote and on-site attendance where it is needed',
  'Monitoring that raises tickets before your team notices',
  'Monthly reporting on volume, causes and repeat faults',
]

export default function Support() {
  return (
    <div className="bg-black">
      <Navbar variant="inline" />

      <PageHeader
        label="Support"
        segments={[
          { text: 'When something breaks,', className: 'font-normal' },
          { text: 'you get a person.', className: 'italic font-serif' },
        ]}
        intro="Our helpdesk is staffed by engineers who already know your setup. No scripts read aloud, no escalation queue to climb before someone competent picks up."
      />

      {/* Channels */}
      <section className="px-4 pb-20 sm:px-6 md:pb-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 md:grid-cols-3 md:gap-1">
          {CHANNELS.map((channel, i) => (
            <Reveal key={channel.title} index={i} className="h-full">
              <div className="h-full rounded-2xl bg-[#212121] p-6 sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
                  {channel.title}
                </p>
                <a
                  href={channel.href}
                  {...(channel.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="mt-4 block break-words text-base transition-colors hover:text-primary sm:text-lg"
                  style={{ color: '#E1E0CC' }}
                >
                  {channel.detail}
                </a>
                <p className="mt-3 text-xs leading-relaxed text-gray-400">{channel.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Response targets */}
      <section className="px-4 pb-20 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-5xl rounded-2xl bg-[#101010] px-5 py-12 sm:px-8 md:rounded-[2rem] md:px-12 md:py-16">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
            Response targets
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-xs text-primary/70 sm:text-sm">
            These sit in the agreement, and we report against them every month.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-[10px] uppercase tracking-[0.2em] text-primary">
                    Priority
                  </th>
                  <th className="pb-3 text-[10px] uppercase tracking-[0.2em] text-primary">
                    Impact
                  </th>
                  <th className="pb-3 text-[10px] uppercase tracking-[0.2em] text-primary">
                    First response
                  </th>
                  <th className="pb-3 text-[10px] uppercase tracking-[0.2em] text-primary">
                    Resolution target
                  </th>
                </tr>
              </thead>
              <tbody>
                {SLA.map((row) => (
                  <tr key={row.priority} className="border-b border-white/5">
                    <td className="py-4 text-xs sm:text-sm" style={{ color: '#E1E0CC' }}>
                      {row.priority}
                    </td>
                    <td className="py-4 text-xs text-gray-400 sm:text-sm">{row.label}</td>
                    <td className="py-4 text-xs text-gray-400 sm:text-sm">{row.response}</td>
                    <td className="py-4 text-xs text-gray-400 sm:text-sm">{row.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What is included */}
      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
              What the agreement covers
            </h2>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-gray-400 sm:text-sm">
              One monthly fee, scoped to your headcount and systems. No surprise invoices for a bad
              month — a bad month is precisely when you should be calling us.
            </p>
            <Link
              to="/contact"
              className="group mt-8 inline-flex items-center gap-1.5 text-xs text-primary transition-colors hover:text-primary/70"
            >
              Get a scoped quote
              <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <ul className="flex flex-col gap-4">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="text-xs leading-snug text-gray-400 sm:text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
