import { Check } from 'lucide-react'
import Reveal from './Reveal'
import { SYSTEMS, type BuiltSystem, type SystemShot } from '../data/systems'

const MEDIA = `${import.meta.env.BASE_URL}media/systems/`

/** Every desktop screenshot ships at 1600 and 800 wide, so phones get the small one. */
export function screenSrcSet(file: string) {
  return `${MEDIA}${file.replace('.webp', '-800.webp')} 800w, ${MEDIA}${file} 1600w`
}

/** A desktop screenshot in a minimal browser window. */
export function BrowserFrame({ shot, eager = false }: { shot: SystemShot; eager?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl bg-[#1a1a1a] ring-1 ring-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
      </div>
      <img
        src={MEDIA + shot.file}
        srcSet={screenSrcSet(shot.file)}
        sizes="(min-width: 1024px) 700px, 100vw"
        alt={shot.alt}
        width={1600}
        height={1000}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  )
}

/** A phone screenshot in a slim device frame. */
export function PhoneFrame({ shot, className = '' }: { shot: SystemShot; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[1.4rem] border-[5px] border-[#0b0b0b] bg-[#0b0b0b] ring-1 ring-white/15 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.9)] ${className}`}
    >
      <img
        src={MEDIA + shot.file}
        alt={shot.alt}
        width={585}
        height={1266}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full rounded-[1rem]"
      />
    </div>
  )
}

function SystemBlock({ system, flip }: { system: BuiltSystem; flip: boolean }) {
  return (
    <article id={system.id} className="scroll-mt-24 border-t border-white/10 py-14 md:py-20">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Text first on a phone, so the heading comes before the screens. */}
        <Reveal className={`order-2 lg:col-span-7 ${flip ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="relative pb-10 pr-6 sm:pr-10">
            <BrowserFrame shot={system.main} />
            <PhoneFrame
              shot={system.phone}
              className="absolute bottom-0 right-0 w-[24%] min-w-[92px] max-w-[170px]"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {system.more.map((shot) => (
              <a
                key={shot.file}
                href={MEDIA + shot.file}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                aria-label={`${shot.caption}, full size`}
              >
                <img
                  src={MEDIA + shot.file}
                  srcSet={screenSrcSet(shot.file)}
                  sizes="(min-width: 1024px) 340px, 50vw"
                  alt={shot.alt}
                  width={1600}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full rounded-lg ring-1 ring-white/10 transition-opacity group-hover:opacity-80"
                />
                <span className="mt-2 block text-[11px] text-gray-500">{shot.caption}</span>
              </a>
            ))}
          </div>
        </Reveal>

        <div className={`order-1 lg:col-span-5 ${flip ? 'lg:order-1' : 'lg:order-2'}`}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70">{system.builtFor}</p>
          <h3 className="mt-3 text-2xl leading-tight sm:text-3xl" style={{ color: '#E1E0CC' }}>
            {system.name}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">{system.summary}</p>
          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            <span className="text-gray-400">Replaced:</span> {system.replaced}
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {system.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="text-xs leading-snug text-gray-400 sm:text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

/** The three systems, full detail. Used on the business systems service page. */
export default function SystemsShowcase() {
  return (
    <section className="px-4 pb-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
          Systems we have built
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-gray-400 sm:text-sm">
          Real screens from systems in daily use. They are shown here with invented sample data and
          a made-up company name, because a client’s customers, staff and figures never leave their
          own system.
        </p>
        <div className="mt-10">
          {SYSTEMS.map((system, i) => (
            <SystemBlock key={system.id} system={system} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
