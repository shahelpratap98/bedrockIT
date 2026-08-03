import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { CONTACT, EMAIL_HREF, WHATSAPP_URL } from '../config/contact'
import { CONVERSIONS, trackConversion } from '../config/analytics'

const CONTACT_EMAIL = CONTACT.email

type Status = 'idle' | 'sending' | 'sent' | 'error'

const DETAILS = [
  { label: 'Email', value: CONTACT_EMAIL, href: EMAIL_HREF },
  { label: 'Phone', value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
  { label: 'WhatsApp', value: 'Start a chat', href: WHATSAPP_URL, external: true },
]

const SIZES = ['1 to 10 staff', '11 to 30 staff', '31 to 75 staff', 'More than 75 staff']

const inputClass =
  'w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-xs text-[#E1E0CC] outline-none transition-colors placeholder:text-gray-500 focus:border-primary/50 sm:text-sm'

/** Hands the enquiry to the visitor's mail client — used only if the API is unavailable. */
function openMailClient(fields: Record<string, string>) {
  const body = [
    `Name: ${fields.name}`,
    `Company: ${fields.company}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone}`,
    `Team size: ${fields.size}`,
    '',
    fields.message,
  ].join('\n')

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    'Website enquiry',
  )}&body=${encodeURIComponent(body)}`
}

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [usedMailClient, setUsedMailClient] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const fields = Object.fromEntries(
      ['name', 'company', 'email', 'phone', 'size', 'message', 'website'].map((key) => [
        key,
        String(data.get(key) ?? ''),
      ]),
    )

    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(fields),
      })

      if (res.ok) {
        trackConversion(CONVERSIONS.contact)
        setUsedMailClient(false)
        setStatus('sent')
        return
      }

      // 501 means the mail service is not configured yet; anything else is a
      // real failure. Either way the visitor should not lose what they wrote.
      if (res.status === 501) {
        trackConversion(CONVERSIONS.contact)
        openMailClient(fields)
        setUsedMailClient(true)
        setStatus('sent')
        return
      }

      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-black">
      <Navbar variant="inline" />

      <PageHeader
        label="Contact"
        segments={[
          { text: 'Tell us what you are', className: 'font-normal' },
          { text: 'running today.', className: 'italic font-serif' },
        ]}
        intro="We will come back within one business day with an honest read on what we would change, what we would leave alone, and roughly what it would cost."
      />

      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-1">
          {/* Details */}
          <Reveal index={0} className="h-full">
            <div className="flex h-full flex-col gap-8 rounded-2xl bg-[#212121] p-6 sm:p-8">
              {DETAILS.map((detail) => (
                <div key={detail.label}>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
                    {detail.label}
                  </p>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      {...(detail.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="mt-2 block break-words text-sm transition-colors hover:text-primary sm:text-base"
                      style={{ color: '#E1E0CC' }}
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <p className="mt-2 text-sm sm:text-base" style={{ color: '#E1E0CC' }}>
                      {detail.value}
                    </p>
                  )}
                </div>
              ))}

              <div className="mt-auto border-t border-white/10 pt-6">
                <p className="text-xs leading-relaxed text-gray-400">
                  Existing client with something broken? Call the helpdesk rather than using this
                  form — it goes straight to an engineer.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal index={1} className="h-full lg:col-span-2">
            <div className="h-full rounded-2xl bg-[#101010] p-6 sm:p-8 md:p-10">
              {status === 'sent' ? (
                <div className="flex h-full flex-col items-start justify-center py-12">
                  <h2 className="text-2xl sm:text-3xl" style={{ color: '#E1E0CC' }}>
                    {usedMailClient
                      ? 'Thanks — your mail client should be open.'
                      : 'Thanks — your enquiry is on its way.'}
                  </h2>
                  <p className="mt-4 max-w-md text-xs leading-relaxed text-gray-400 sm:text-sm">
                    {usedMailClient ? (
                      <>
                        Send the message and we will reply within one business day. If nothing
                        opened, email us directly at{' '}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary">
                          {CONTACT_EMAIL}
                        </a>
                        .
                      </>
                    ) : (
                      <>We will come back to you within one business day.</>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-xs text-primary transition-colors hover:text-primary/70"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-primary">
                        Your name
                      </span>
                      <input name="name" required className={inputClass} placeholder="Jordan Ellis" />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-primary">
                        Company
                      </span>
                      <input name="company" className={inputClass} placeholder="Ellis & Co" />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-primary">
                        Email
                      </span>
                      <input
                        name="email"
                        type="email"
                        required
                        className={inputClass}
                        placeholder="you@company.co.nz"
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-primary">
                        Phone
                      </span>
                      <input name="phone" className={inputClass} placeholder="021 000 000" />
                    </label>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary">
                      Team size
                    </span>
                    <select name="size" className={inputClass} defaultValue={SIZES[0]}>
                      {SIZES.map((size) => (
                        <option key={size} value={size} className="bg-[#101010]">
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary">
                      What is going on?
                    </span>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      className={`${inputClass} resize-y`}
                      placeholder="Current provider, what is working, what is not, and anything coming up — an office move, an audit, a system you know is overdue."
                    />
                  </label>

                  {/* Honeypot: hidden from people, irresistible to bots. */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  />

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="group mt-2 inline-flex items-center gap-2 self-start rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-all duration-300 hover:gap-3 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send enquiry'}
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110">
                      <ArrowRight className="h-4 w-4" style={{ color: '#E1E0CC' }} />
                    </span>
                  </button>

                  {status === 'error' && (
                    <p className="text-xs leading-relaxed text-red-400" role="alert">
                      That did not go through. Please email us at{' '}
                      <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                        {CONTACT_EMAIL}
                      </a>{' '}
                      or message us on WhatsApp — your message is still in the form above.
                    </p>
                  )}
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
