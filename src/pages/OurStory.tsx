import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'

const TIMELINE = [
  {
    year: '2019',
    title: 'Two engineers and a van.',
    body: 'We started fixing what other providers had walked away from — ageing servers, tangled networks, businesses stuck on contracts nobody could explain.',
  },
  {
    year: '2021',
    title: 'The move to managed.',
    body: 'Break-fix work punished clients for having problems. We rebuilt the business around fixed monthly agreements and monitoring that catches faults first.',
  },
  {
    year: '2023',
    title: 'Cloud practice established.',
    body: 'Migrations became half our work. We built a repeatable process for moving businesses onto Microsoft 365 and Azure without losing a working day.',
  },
  {
    year: 'Today',
    title: 'A team that answers.',
    body: 'Engineers, not a ticket queue. Every client has a named contact who knows their environment before anything goes wrong.',
  },
]

const PRINCIPLES = [
  {
    title: 'No jargon as a shield.',
    body: 'If we cannot explain a recommendation in plain language, it is probably not the right recommendation.',
  },
  {
    title: 'Boring is the goal.',
    body: 'Good IT is uneventful. We measure ourselves on how rarely you need to think about us.',
  },
  {
    title: 'We own the whole problem.',
    body: 'No handing you back to a vendor. If it touches your systems, chasing it down is our job.',
  },
]

export default function OurStory() {
  return (
    <div className="bg-black">
      <Navbar variant="inline" />

      <PageHeader
        label="Our story"
        segments={[
          { text: 'We built the IT company', className: 'font-normal' },
          { text: 'we wanted to hire.', className: 'italic font-serif' },
        ]}
        intro="BedRock IT exists because too many businesses are told their technology is fine right up until the morning it isn't. We wanted to run the opposite kind of practice — one where the quiet months are the point."
      />

      {/* Timeline */}
      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-5xl">
          {TIMELINE.map((entry, i) => (
            <Reveal key={entry.year} index={i}>
              <div className="grid grid-cols-1 gap-3 border-t border-white/10 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <p className="text-xs text-primary md:col-span-2 md:text-sm">{entry.year}</p>
                <h3
                  className="text-xl md:col-span-4 md:text-2xl"
                  style={{ color: '#E1E0CC' }}
                >
                  {entry.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-400 md:col-span-6 md:text-sm">
                  {entry.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <h2
            className="text-center text-xl sm:text-2xl md:text-3xl"
            style={{ color: '#E1E0CC' }}
          >
            How we work
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-1">
            {PRINCIPLES.map((principle, i) => (
              <Reveal key={principle.title} index={i} className="h-full">
                <div className="h-full rounded-2xl bg-[#212121] p-6">
                  <h3 className="text-base sm:text-lg" style={{ color: '#E1E0CC' }}>
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-400">{principle.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
