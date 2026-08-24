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
    name: 'Bsmart Eco Products',
    domain: 'bsmarteco.co.nz',
    url: 'https://bsmarteco.co.nz',
    image: 'bsmart-eco.jpg',
    sector: 'Wholesale packaging and hygiene supplies',
    summary:
      'A trade storefront for an Auckland wholesaler, where the buyer is a cafe or facilities manager reordering the same items. Product browsing, trade accounts and repeat ordering are the whole job.',
    highlights: [
      'Product catalogue with cart and trade accounts',
      'Reorder in one click from a previous order',
      'Hosted on Vercel, built to grow with the catalogue',
    ],
  },
  {
    name: 'Jai Civil',
    domain: 'jaicivil.com',
    url: 'https://jaicivil.com',
    image: 'jai-civil.jpg',
    sector: 'Earthworks and civil construction',
    summary:
      'A site for a Papakura civil contractor bidding for work that starts with a phone call. Built to answer the first questions a project manager asks: what do you do, where do you work, and can you handle this job.',
    highlights: [
      'Service pages for each type of civil work',
      'Prerendered for search, so every page can rank',
      'Hosted on Vercel with automatic HTTPS',
    ],
  },
  {
    name: 'Canopy Property Services',
    domain: 'canopypropertyservices.co.nz',
    url: 'https://www.canopypropertyservices.co.nz',
    image: 'canopy-property.jpg',
    sector: 'Landscaping and grounds maintenance',
    summary:
      'A quote-first site for an Auckland landscaping and grounds team. The enquiry form sits in the hero rather than a page away, capturing the suburb and the job type before anyone has to scroll.',
    highlights: [
      'Quote form in the hero, not buried on a contact page',
      'Service pages covering lawns, gardens and outdoor cleaning',
      'Hosted on Vercel with automatic HTTPS',
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
  {
    name: 'Kinderland Educare',
    domain: 'kinderland-educare.vercel.app',
    url: 'https://kinderland-educare.vercel.app',
    image: 'kinderland-educare.jpg',
    sector: 'Early childhood education',
    summary:
      'A site for a Māngere early childhood centre, where parents are choosing who to trust with their child. Warm, clear and easy to navigate, with enrolment enquiries as the obvious next step.',
    highlights: [
      'Written for parents comparing centres',
      'Enrolment enquiry as the clear next step',
      'Hosted on Vercel with automatic HTTPS',
    ],
  },
]
