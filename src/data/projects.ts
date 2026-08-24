export interface Project {
  name: string
  domain: string
  url: string
  /** Screenshot in public/media/projects, captured at 1440x900 @2x. */
  image: string
  sector: string
  summary: string
  /** Short, checkable statements about what was built — no invented metrics. */
  highlights: string[]
}

export const PROJECTS: Project[] = [
  {
    name: 'CoolMaster Services',
    domain: 'coolmaster.co.nz',
    url: 'https://coolmaster.co.nz',
    image: 'coolmaster.jpg',
    sector: 'Commercial HVAC and refrigeration',
    summary:
      'A quote-focused site for an Auckland HVAC contractor, built around the two things customers actually do: request a quote or call. Service pages cover air conditioning, refrigeration, heat pumps and BWoF compliance.',
    highlights: [
      'Service pages structured around what people search for',
      'Quote request and click-to-call on every screen',
      'Hosted on Vercel with a hardened security policy',
    ],
  },
  {
    name: 'Stable Structure',
    domain: 'stablestructure.co.nz',
    url: 'https://stablestructure.co.nz',
    image: 'stable-structure.jpg',
    sector: 'Structural engineering',
    summary:
      'A credibility-first site for an Auckland structural engineering practice, where the work is technical and the buying decision rests on trust. Clear service breakdown, straightforward enquiry path.',
    highlights: [
      'Written for homeowners and builders, not engineers',
      'Fast static build, no page-load spinner',
      'Hosted on Vercel with automatic HTTPS',
    ],
  },
  {
    name: 'PPIM Consulting',
    domain: 'ppimconsulting.co.nz',
    url: 'https://ppimconsulting.co.nz',
    image: 'ppim-consulting.jpg',
    sector: 'Licensed immigration advice',
    summary:
      'A site for a licensed immigration adviser, where visitors arrive anxious and need clarity fast. Visa pathways are laid out plainly, with an enquiry form that captures what the adviser needs up front.',
    highlights: [
      'Visa pathways explained in plain language',
      'Enquiry form that gathers the right detail first time',
      'Hosted on Vercel with a strict content security policy',
    ],
  },
]
