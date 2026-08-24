import { ArrowUpRight, Check } from 'lucide-react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import BookCallButton from '../components/BookCallButton'
import { PROJECTS } from '../data/projects'

const BASE = import.meta.env.BASE_URL

export default function Projects() {
  return (
    <div className="bg-black">
      <Navbar variant="inline" />

      <PageHeader
        label="Our projects"
        segments={[
          { text: 'Sites we built,', className: 'font-normal' },
          { text: 'still live today.', className: 'italic font-serif' },
        ]}
        intro="Every one of these is a real business running on a site we designed, built and still host. Click any tile to see it for yourself — no mockups, no case studies for work that never shipped."
      />

      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:gap-4">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.domain} index={Math.min(i, 3)}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-1 overflow-hidden rounded-2xl bg-[#212121] transition-colors hover:bg-[#262626] md:grid-cols-2"
              >
                {/* Screenshot */}
                <div className="relative overflow-hidden bg-black md:order-last">
                  <img
                    src={`${BASE}media/projects/${project.image}`}
                    alt={`The ${project.name} website homepage`}
                    loading="lazy"
                    width={1440}
                    height={900}
                    className="h-56 w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] sm:h-72 md:h-full md:min-h-[20rem]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-black/60 md:via-transparent" />
                </div>

                {/* Detail */}
                <div className="flex flex-col p-6 sm:p-8 md:p-10">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
                    {project.sector}
                  </p>

                  <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
                    {project.name}
                  </h2>

                  <p className="mt-4 text-xs leading-relaxed text-gray-400 sm:text-sm">
                    {project.summary}
                  </p>

                  <ul className="mt-6 flex flex-col gap-2.5">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="text-xs leading-snug text-gray-400">{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="mt-auto flex items-center gap-1.5 pt-8 text-xs text-primary">
                    {project.linkLabel ?? project.domain}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Close */}
      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-5xl rounded-2xl bg-[#101010] px-5 py-12 text-center sm:px-8 md:rounded-[2rem] md:px-12 md:py-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
            Yours could be next.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-gray-400 sm:text-sm">
            Tell us what your business does and we will come back with an honest view of what your
            site needs, and what it would cost.
          </p>
          <BookCallButton className="mt-8" label="Start a project" />
        </div>
      </section>
    </div>
  )
}
