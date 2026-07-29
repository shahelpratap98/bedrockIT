import { Check } from 'lucide-react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'

const PHASES = [
  {
    number: '01',
    title: 'Discovery',
    body: 'We audit what you are running, what it costs and what depends on it. You get the findings whether or not you engage us for the move.',
  },
  {
    number: '02',
    title: 'Design',
    body: 'Tenant structure, licensing, security baseline and data layout, agreed in writing before anything moves.',
  },
  {
    number: '03',
    title: 'Pilot',
    body: 'A small group moves first. We fix what the plan missed while the stakes are still low.',
  },
  {
    number: '04',
    title: 'Migration',
    body: 'The bulk move runs outside your trading hours, in stages, with a tested rollback at every step.',
  },
  {
    number: '05',
    title: 'Aftercare',
    body: 'Two weeks of heightened support, then into the standard agreement. Documentation handed over either way.',
  },
]

const OUTCOMES = [
  'No working day lost to the migration itself',
  'Licensing reviewed — most clients cut unused seats',
  'Backups tested by restore, not assumed',
  'Security baseline applied as part of the move, not after',
]

export default function Cloud() {
  return (
    <div className="bg-black">
      <Navbar variant="inline" />

      <PageHeader
        label="Cloud"
        segments={[
          { text: 'Move to the cloud without', className: 'font-normal' },
          { text: 'losing a working day.', className: 'italic font-serif' },
        ]}
        intro="Migrations go wrong when they are treated as a single weekend. We run them in stages, with a rollback at every step, so the worst case is a delay rather than a disaster."
      />

      {/* Phased process */}
      <section className="px-4 pb-20 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-5xl">
          {PHASES.map((phase, i) => (
            <Reveal key={phase.number} index={i}>
              <div className="grid grid-cols-1 gap-3 border-t border-white/10 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <p className="text-xs text-primary md:col-span-2 md:text-sm">{phase.number}</p>
                <h3 className="text-xl md:col-span-4 md:text-2xl" style={{ color: '#E1E0CC' }}>
                  {phase.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-400 md:col-span-6 md:text-sm">
                  {phase.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-5xl rounded-2xl bg-[#101010] px-5 py-12 text-center sm:px-8 md:rounded-[2rem] md:px-12 md:py-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
            What you should expect
          </h2>
          <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-4 text-left">
            {OUTCOMES.map((item) => (
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
