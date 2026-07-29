import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { CONTACT, EMAIL_HREF, WHATSAPP_URL } from '../config/contact'

// TODO: point handleSubmit at a form endpoint (Formspree, your own API, etc.)
// instead of opening the visitor's mail client.
const CONTACT_EMAIL = CONTACT.email

const DETAILS = [
  { label: 'Email', value: CONTACT_EMAIL, href: EMAIL_HREF },
  { label: 'Phone', value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
  { label: 'WhatsApp', value: 'Start a chat', href: WHATSAPP_URL, external: true },
]

const SIZES = ['1 to 10 staff', '11 to 30 staff', '31 to 75 staff', 'More than 75 staff']

const inputClass =
  'w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-xs text-[#E1E0CC] outline-none transition-colors placeholder:text-gray-500 focus:border-primary/50 sm:text-sm'

export default function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const body = [
      `Name: ${data.get('name')}`,
      `Company: ${data.get('company')}`,
      `Email: ${data.get('email')}`,
      `Phone: ${data.get('phone')}`,
      `Team size: ${data.get('size')}`,
      '',
      `${data.get('message')}`,
    ].join('\n')

    // No backend yet — hand the enquiry to the visitor's mail client.
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      'Enquiry from bedrockit.co.nz',
    )}&body=${encodeURIComponent(body)}`

    setSent(true)
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
              {sent ? (
                <div className="flex h-full flex-col items-start justify-center py-12">
                  <h2 className="text-2xl sm:text-3xl" style={{ color: '#E1E0CC' }}>
                    Thanks — your mail client should be open.
                  </h2>
                  <p className="mt-4 max-w-md text-xs leading-relaxed text-gray-400 sm:text-sm">
                    Send the message and we will reply within one business day. If nothing opened,
                    email us directly at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-8 text-xs text-primary transition-colors hover:text-primary/70"
                  >
                    Back to the form
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

                  <button
                    type="submit"
                    className="group mt-2 inline-flex items-center gap-2 self-start rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-all duration-300 hover:gap-3"
                  >
                    Send enquiry
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110">
                      <ArrowRight className="h-4 w-4" style={{ color: '#E1E0CC' }} />
                    </span>
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
