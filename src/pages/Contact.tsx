import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import QuoteForm from '../components/QuoteForm'
import { CONTACT, EMAIL_HREF, MESSENGER_URL, WHATSAPP_URL } from '../config/contact'

const DETAILS = [
  { label: 'Email', value: CONTACT.email, href: EMAIL_HREF },
  { label: 'Phone', value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
  { label: 'WhatsApp', value: 'Start a chat', href: WHATSAPP_URL, external: true },
  { label: 'Messenger', value: 'Message us on Facebook', href: MESSENGER_URL, external: true },
]

export default function Contact() {
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
          {/* Form. First on mobile so it is not below the contact details;
              not wrapped in Reveal so it is visible the moment the page opens. */}
          <div className="h-full lg:order-2 lg:col-span-2">
            <div className="h-full rounded-2xl bg-[#101010] p-6 sm:p-8 md:p-10">
              <QuoteForm />
            </div>
          </div>

          {/* Details */}
          <Reveal index={0} className="h-full lg:order-1">
            <div className="flex h-full flex-col gap-8 rounded-2xl bg-[#212121] p-6 sm:p-8">
              {DETAILS.map((detail) => (
                <div key={detail.label}>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
                    {detail.label}
                  </p>
                  <a
                    href={detail.href}
                    {...(detail.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="mt-2 block break-words text-sm transition-colors hover:text-primary sm:text-base"
                    style={{ color: '#E1E0CC' }}
                  >
                    {detail.value}
                  </a>
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
        </div>
      </section>
    </div>
  )
}
