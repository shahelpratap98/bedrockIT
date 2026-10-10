import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'
import { BrowserFrame, PhoneFrame } from './SystemsShowcase'
import { SYSTEMS } from '../data/systems'

const PAGE = '/services/business-systems'

/** Home page pointer to the business systems page, led by a real screen. */
export default function SystemsTeaser() {
  const [lead, second] = SYSTEMS

  return (
    <section className="bg-black px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70">Business systems</p>
          <h2 className="mt-3 text-2xl leading-tight sm:text-3xl md:text-4xl" style={{ color: '#E1E0CC' }}>
            Outgrown the spreadsheet?{' '}
            <span className="font-serif italic text-gray-500">We build the system.</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-gray-400">
            Bookings and dispatch, timesheets and invoicing, case and document tracking. Built around
            how your team already works, used on their phones, with your old spreadsheet imported on
            day one.
          </p>

          <ul className="mt-8 flex flex-col border-t border-white/10">
            {SYSTEMS.map((system) => (
              <li key={system.id} className="border-b border-white/10">
                <Link
                  to={`${PAGE}#${system.id}`}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <span>
                    <span className="block text-sm" style={{ color: '#E1E0CC' }}>
                      {system.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-gray-500">{system.builtFor}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 -rotate-45 text-primary transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>

          <Link
            to={PAGE}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-all duration-300 hover:gap-3"
          >
            See the systems
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110">
              <ArrowRight className="h-4 w-4 text-primary" />
            </span>
          </Link>
        </div>

        <Reveal className="lg:col-span-7">
          <div className="relative pb-10 pr-6 sm:pr-10">
            <BrowserFrame shot={lead.main} />
            <PhoneFrame
              shot={second.phone}
              className="absolute bottom-0 right-0 w-[24%] min-w-[92px] max-w-[170px]"
            />
          </div>
          <p className="mt-4 text-[11px] text-gray-500">
            Real screens, shown with invented sample data.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
