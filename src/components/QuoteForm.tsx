import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { CONTACT } from '../config/contact'
import { trackEnquiryConversion } from '../config/analytics'
import { getAttribution } from '../config/attribution'
import { SERVICES as SERVICE_PAGES } from '../data/services'

const CONTACT_EMAIL = CONTACT.email

type Status = 'idle' | 'sending' | 'sent' | 'error'

// Same names as the service pages, so /contact?service=<slug> can preselect one.
const SERVICES = [...SERVICE_PAGES.map((service) => service.name), 'Something else']

// 16px text below `sm` stops iOS Safari zooming the page when a field is focused.
const inputClass =
  'w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-base text-[#E1E0CC] outline-none transition-colors placeholder:text-gray-500 focus:border-primary/50 sm:text-sm'

const labelClass = 'text-[11px] uppercase tracking-[0.2em] text-primary'

/** Hands the enquiry to the visitor's mail client — used only if the API is unavailable. */
function openMailClient(fields: Record<string, string>) {
  const body = [
    `Name: ${fields.name}`,
    `Company: ${fields.company}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone}`,
    `Service: ${fields.service}`,
    '',
    fields.message,
  ].join('\n')

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    'Website enquiry',
  )}&body=${encodeURIComponent(body)}`
}

interface QuoteFormProps {
  /**
   * Service name to preselect. Without it the form reads ?service=<slug> from
   * the URL after mount, so the prerendered HTML (which cannot know the query
   * string) still matches what React hydrates.
   */
  service?: string
  messagePlaceholder?: string
  submitLabel?: string
}

/**
 * The enquiry form. A successful send is the Google Ads primary conversion,
 * so every page that wants enquiries uses this rather than its own form.
 */
export default function QuoteForm({
  service,
  messagePlaceholder = 'Current provider, what is working, what is not, and anything coming up — an office move, an audit, a system you know is overdue.',
  submitLabel = 'Send enquiry',
}: QuoteFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [usedMailClient, setUsedMailClient] = useState(false)
  const serviceRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (service) return
    const slug = new URLSearchParams(window.location.search).get('service')
    const match = SERVICE_PAGES.find((page) => page.slug === slug)
    if (match && serviceRef.current) serviceRef.current.value = match.name
  }, [service])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const fields = Object.fromEntries(
      ['name', 'company', 'email', 'phone', 'service', 'message', 'website'].map((key) => [
        key,
        String(data.get(key) ?? ''),
      ]),
    )

    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...fields, ...getAttribution() }),
      })

      if (res.ok) {
        trackEnquiryConversion()
        setUsedMailClient(false)
        setStatus('sent')
        return
      }

      // 501 means the mail service is not configured yet; anything else is a
      // real failure. Either way the visitor should not lose what they wrote.
      if (res.status === 501) {
        trackEnquiryConversion()
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

  if (status === 'sent') {
    return (
      <div className="flex h-full flex-col items-start justify-center py-12" role="status">
        <h2 className="text-2xl sm:text-3xl" style={{ color: '#E1E0CC' }}>
          {usedMailClient
            ? 'Thanks — your mail client should be open.'
            : 'Thanks — your enquiry is on its way.'}
        </h2>
        <p className="mt-4 max-w-md text-xs leading-relaxed text-gray-400 sm:text-sm">
          {usedMailClient ? (
            <>
              Send the message and we will reply within one business day. If nothing opened,
              email us directly at{' '}
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
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Your name</span>
          <input
            name="name"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Jordan Ellis"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
            placeholder="you@company.co.nz"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>
            Phone <span className="normal-case tracking-normal text-gray-500">(optional)</span>
          </span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
            placeholder="021 000 000"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>
            Company <span className="normal-case tracking-normal text-gray-500">(optional)</span>
          </span>
          <input
            name="company"
            autoComplete="organization"
            className={inputClass}
            placeholder="Ellis & Co"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>What do you need?</span>
        <select
          ref={serviceRef}
          name="service"
          className={inputClass}
          defaultValue={service ?? SERVICES[0]}
        >
          {SERVICES.map((name) => (
            <option key={name} value={name} className="bg-[#101010]">
              {name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>What is going on?</span>
        <textarea
          name="message"
          required
          rows={4}
          className={`${inputClass} resize-y`}
          placeholder={messagePlaceholder}
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

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group inline-flex w-full items-center justify-between gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-all duration-300 hover:gap-3 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:justify-start"
        >
          {status === 'sending' ? 'Sending…' : submitLabel}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110">
            <ArrowRight className="h-4 w-4" style={{ color: '#E1E0CC' }} />
          </span>
        </button>
        <p className="text-xs text-gray-500">Reply within one business day. No obligation.</p>
      </div>

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
  )
}
