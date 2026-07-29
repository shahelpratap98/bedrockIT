import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { CONTACT, EMAIL_HREF, WHATSAPP_URL } from '../config/contact'

const CHANNELS = [
  {
    title: 'Phone',
    detail: CONTACT.phoneDisplay,
    href: CONTACT.phoneHref,
    body: 'Fastest route for anything stopping you working right now. A person, not a menu tree.',
  },
  {
    title: 'WhatsApp',
    detail: CONTACT.phoneDisplay,
    href: WHATSAPP_URL,
    external: true,
    body: 'Send a photo of the error message. We can often diagnose it before calling you back.',
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

const FASTER = [
  {
    title: 'Tell us who and how many',
    body: 'One person or the whole office changes the priority, and therefore who picks it up.',
  },
  {
    title: 'Send the exact error',
    body: 'A photo or screenshot of the message beats a description of it almost every time.',
  },
  {
    title: 'Say what changed',
    body: 'New software, a moved cable, a password reset yesterday. The trigger is usually recent.',
  },
  {
    title: 'Flag a deadline',
    body: 'If payroll runs at four, say so. We sequence work around real deadlines when we know them.',
  },
]

export default function Support() {
  return (
    <div className="bg-black">
      <Navbar variant="inline" />

      <PageHeader
        label="Support"
        segments={[
          { text: 'Something broken?', className: 'font-normal' },
          { text: 'Here is how to reach us.', className: 'italic font-serif' },
        ]}
        intro="For clients on a support agreement. Pick whichever channel suits the urgency — all three reach engineers who already know your environment."
      />

      {/* How to reach us */}
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
                  {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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

      {/* Helping us help you */}
      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
            Getting a faster fix
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-xs text-gray-400 sm:text-sm">
            None of this is required. It just tends to remove a round trip.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-1 lg:grid-cols-4">
            {FASTER.map((tip, i) => (
              <Reveal key={tip.title} index={i} className="h-full">
                <div className="h-full rounded-2xl bg-[#212121] p-6">
                  <h3 className="text-base" style={{ color: '#E1E0CC' }}>
                    {tip.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-400">{tip.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-12 text-center text-xs text-gray-400 sm:text-sm">
            Not a client yet?{' '}
            <Link
              to="/services/managed-it-support"
              className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/70"
            >
              See what managed support covers
              <ArrowRight className="h-3 w-3 -rotate-45" />
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
