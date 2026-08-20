import { Link } from 'react-router-dom'
import { NAV_ITEMS } from './Navbar'
import BookCallButton from './BookCallButton'
import { CONTACT, EMAIL_HREF, WHATSAPP_URL } from '../config/contact'
import { SERVICES } from '../data/services'

export default function Footer() {
  return (
    <footer className="bg-black px-4 pb-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Closing call to action */}
        <div className="rounded-2xl bg-[#101010] px-6 py-14 text-center md:rounded-[2rem] md:px-12 md:py-20">
          <h2
            className="mx-auto max-w-2xl text-2xl leading-[0.95] sm:text-3xl md:text-4xl lg:text-5xl"
            style={{ color: '#E1E0CC' }}
          >
            Tired of IT that only gets attention{' '}
            <span className="font-serif italic">when it breaks?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-xs text-primary/70 sm:text-sm">
            Tell us what you are running today. We will tell you honestly what we would change, and
            what we would leave alone.
          </p>
          <BookCallButton className="mt-8" />
        </div>

        {/* Footer columns */}
        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link to="/" className="text-base font-bold" style={{ color: '#E1E0CC' }}>
              BedRock IT
            </Link>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-gray-400">
              Managed IT, cloud and security for businesses that cannot afford downtime.
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary">Pages</p>
            <ul className="mt-4 flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-xs text-gray-400 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary">Services</p>
            <ul className="mt-4 flex flex-col gap-2">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-xs text-gray-400 transition-colors hover:text-primary"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary">Get in touch</p>
            <ul className="mt-4 flex flex-col gap-2 text-xs text-gray-400">
              <li>
                <a href={EMAIL_HREF} className="transition-colors hover:text-primary">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className="transition-colors hover:text-primary">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  Message us on WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary">Support hours</p>
            <ul className="mt-4 flex flex-col gap-2 text-xs text-gray-400">
              <li>Helpdesk — Mon to Fri, 7am to 6pm</li>
              <li>Critical incidents — 24/7</li>
              <li>Scheduled work — outside your hours</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
          <span>© {new Date().getFullYear()} BedRock IT. All rights reserved.</span>
          <Link to="/privacy" className="transition-colors hover:text-primary">
            Privacy policy
          </Link>
        </p>
      </div>
    </footer>
  )
}
