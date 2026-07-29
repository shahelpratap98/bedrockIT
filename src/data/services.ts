import type { TextSegment } from '../components/WordsPullUpMultiStyle'

export interface ServiceSection {
  title: string
  body: string
}

export interface ProcessStep {
  number: string
  title: string
  body: string
}

export interface Faq {
  question: string
  answer: string
}

export interface Service {
  slug: string
  /** Short name for nav, cards and the hub. */
  name: string
  /** Small label above the heading. */
  label: string
  headline: TextSegment[]
  intro: string
  /** One-liner used on the hub and in cards. */
  summary: string
  seoTitle: string
  seoDescription: string
  includes: ServiceSection[]
  process?: ProcessStep[]
  outcomes: string[]
  faqs: Faq[]
}

export const SERVICES: Service[] = [
  {
    slug: 'website-development',
    name: 'Website development',
    label: 'Website development',
    headline: [
      { text: 'Websites built to be found,', className: 'font-normal' },
      { text: 'not just admired.', className: 'italic font-serif' },
    ],
    intro:
      'A site that looks good but never appears in search is an expensive brochure. We build fast, accessible sites with the technical groundwork search engines actually reward, then report on what they do once live.',
    summary: 'SEO-optimised sites, hosting, DNS and monthly reporting.',
    seoTitle: 'Website Development and SEO — BedRock IT',
    seoDescription:
      'Fast, SEO-optimised business websites with hosting, DNS management and monthly reporting on traffic, rankings and enquiries. Built and maintained by your IT team.',
    includes: [
      {
        title: 'Search groundwork from the first commit',
        body: 'Unique titles and meta descriptions per page, semantic headings, clean URLs, canonical tags, a generated sitemap and robots.txt. The structural work that is expensive to retrofit and cheap to do up front.',
      },
      {
        title: 'Speed treated as a feature',
        body: 'Compressed and correctly sized images, minimal JavaScript, cached static assets. Page speed affects both ranking and how many visitors stay long enough to enquire.',
      },
      {
        title: 'Content structured around real searches',
        body: 'A page per thing you sell, written for the way customers actually phrase it, rather than one page trying to rank for everything at once.',
      },
      {
        title: 'Hosting and DNS we manage',
        body: 'Records, email routing and TLS certificates handled by the same team that runs your IT, so a DNS change never becomes a three-way conversation between providers.',
      },
      {
        title: 'Monthly reporting in plain language',
        body: 'What people searched, which pages they landed on, how many enquiries came through, and what we would change next. No dashboard you have to interpret yourself.',
      },
      {
        title: 'Somewhere to send your advertising',
        body: 'Landing pages built to convert, so paid traffic arrives somewhere purpose-built rather than on the home page.',
      },
    ],
    process: [
      {
        number: '01',
        title: 'Scope',
        body: 'What you sell, who buys it, and how they search for it. We agree the page structure before any design work starts, because the structure is what determines whether it can rank.',
      },
      {
        number: '02',
        title: 'Build',
        body: 'Design and development against that structure, with the technical SEO work included rather than bolted on afterwards.',
      },
      {
        number: '03',
        title: 'Launch',
        body: 'DNS cutover planned so email keeps flowing, redirects mapped from every old URL, analytics and Search Console connected before go-live.',
      },
      {
        number: '04',
        title: 'Report and improve',
        body: 'Monthly reporting, then changes based on what the data shows rather than on opinion.',
      },
    ],
    outcomes: [
      'Every page has its own title, description and purpose',
      'Old URLs redirect instead of dying, so existing rankings survive a rebuild',
      'You can see which pages earn enquiries and which do not',
      'One provider for the site, the hosting, the DNS and the email',
    ],
    faqs: [
      {
        question: 'How long does a business website take?',
        answer:
          'A straightforward marketing site is usually a few weeks from scoped content to launch. The variable is almost never the build — it is how quickly copy, photography and approvals come back. We scope it properly and tell you the honest dependency list before starting.',
      },
      {
        question: 'Will a new site hurt our existing search rankings?',
        answer:
          'It can, if old URLs are left to 404. We map redirects from every existing page to its replacement before launch, keep the page structure at least as clear as before, and watch Search Console closely for the first few weeks after cutover.',
      },
      {
        question: 'Do you guarantee first place on Google?',
        answer:
          'No, and nobody credible does — rankings depend on competitors, search intent and factors outside anyone’s control. What we do commit to is the technical groundwork, a sensible content structure, and honest monthly reporting on what is actually happening.',
      },
      {
        question: 'Can you take over a site someone else built?',
        answer:
          'Usually. We audit what is there, tell you plainly whether it is worth improving or replacing, and give you that answer whether or not you engage us for the work.',
      },
      {
        question: 'What happens if we stop working with you?',
        answer:
          'You keep the site, the domain, the DNS and the documentation. We do not hold registrar access or source code hostage as a retention strategy.',
      },
    ],
  },
  {
    slug: 'managed-it-support',
    name: 'Managed IT support',
    label: 'Managed IT support',
    headline: [
      { text: 'An IT department', className: 'font-normal' },
      { text: 'without the headcount.', className: 'italic font-serif' },
    ],
    intro:
      'One monthly fee covering the helpdesk, the monitoring and the maintenance. Scoped to your team and systems, with response targets written into the agreement rather than implied.',
    summary: 'Unlimited helpdesk, monitoring and maintenance on a fixed fee.',
    seoTitle: 'Managed IT Support — BedRock IT',
    seoDescription:
      'Outsourced IT support on a fixed monthly fee: unlimited helpdesk, 24/7 monitoring, patching, onboarding and a named engineer who knows your environment.',
    includes: [
      {
        title: 'Unlimited helpdesk',
        body: 'Your whole team can call or email without anyone counting tickets. Charging per incident punishes people for reporting problems early, which is exactly when problems are cheapest to fix.',
      },
      {
        title: 'A named engineer',
        body: 'Someone who already knows how your environment is put together, so you are not explaining your setup from scratch every time something breaks.',
      },
      {
        title: 'Monitoring that gets there first',
        body: 'Servers, backups, disk space, certificates and critical services watched around the clock. A good month is one where we raised and closed faults you never noticed.',
      },
      {
        title: 'Patching and maintenance',
        body: 'Operating systems and key applications kept current on a schedule you can audit, applied outside your working hours wherever possible.',
      },
      {
        title: 'Onboarding and offboarding',
        body: 'A documented runbook for both. New starters have working accounts and a configured device on day one; leavers lose access the day they leave, not the week after.',
      },
      {
        title: 'An asset register that stays current',
        body: 'What you own, how old it is, what it runs and when it is due for replacement — updated continuously rather than rebuilt in a panic before budget season.',
      },
    ],
    outcomes: [
      'Predictable monthly cost instead of unpredictable invoices',
      'Response times you can hold us to, reported on monthly',
      'Fewer repeat faults, because we fix causes rather than symptoms',
      'Documentation you own, whoever supports you next',
    ],
    faqs: [
      {
        question: 'How is this priced?',
        answer:
          'Per user per month, adjusted for the complexity of what you run — a team on laptops and Microsoft 365 costs less to support than the same team with on-premise servers and line-of-business applications. We scope it before quoting so the number does not move later.',
      },
      {
        question: 'What is not included?',
        answer:
          'Hardware, software licensing and large project work are quoted separately. Day-to-day support, monitoring and maintenance are covered. We would rather draw that line clearly than surprise you with it.',
      },
      {
        question: 'Do we have to replace everything to start?',
        answer:
          'No. We take on environments as they are, tell you what genuinely needs attention and what can wait, and sequence the work around your budget.',
      },
      {
        question: 'Can you work with our existing provider during a handover?',
        answer:
          'Yes. Transitions go better when the outgoing provider is treated professionally. We handle the technical handover and documentation gathering so you are not caught in the middle.',
      },
      {
        question: 'What are your support hours?',
        answer:
          'The helpdesk is staffed during business hours, with critical incidents covered outside them. Exact hours and response targets are set out on the support page and in your agreement.',
      },
    ],
  },
  {
    slug: 'cyber-security',
    name: 'Cyber security',
    label: 'Cyber security',
    headline: [
      { text: 'Security sized for', className: 'font-normal' },
      { text: 'a real business.', className: 'italic font-serif' },
    ],
    intro:
      'Most breaches at businesses your size are not sophisticated. They are a reused password, an unpatched laptop, or someone clicking a convincing invoice. We close the ordinary gaps properly before selling you anything exotic.',
    summary: 'Multi-factor, endpoint protection, staff training and patching.',
    seoTitle: 'Cyber Security for Small Business — BedRock IT',
    seoDescription:
      'Practical cyber security for growing businesses: multi-factor authentication, endpoint protection, phishing training, patching and tested backups, on an auditable schedule.',
    includes: [
      {
        title: 'Multi-factor authentication everywhere it matters',
        body: 'Email, remote access, finance systems and admin accounts. The single highest-value control available to a business your size, and the one most often left half-finished.',
      },
      {
        title: 'Endpoint protection and encryption',
        body: 'Managed protection on every device, with disk encryption enabled so a lost laptop is an inconvenience rather than a disclosure event.',
      },
      {
        title: 'Phishing simulation and staff training',
        body: 'Short, regular, and not designed to humiliate anyone. The goal is a team that reports suspicious email quickly, not a scoreboard.',
      },
      {
        title: 'Patching on an auditable schedule',
        body: 'Known vulnerabilities closed on a documented cadence, with evidence you can hand to an insurer or a client asking about your controls.',
      },
      {
        title: 'Backups proven by restore',
        body: 'A backup nobody has restored from is a hypothesis. We test recovery on a schedule and document how long a real restore actually takes.',
      },
      {
        title: 'A written incident plan',
        body: 'Who to call, what to isolate, what to preserve and who needs telling. Decided calmly in advance rather than invented at 6am.',
      },
    ],
    outcomes: [
      'The common attack paths closed, not just monitored',
      'Evidence of your controls for insurers and enterprise clients',
      'Staff who report suspicious email instead of hiding mistakes',
      'A recovery time you know, because it has been measured',
    ],
    faqs: [
      {
        question: 'We are small. Are we actually a target?',
        answer:
          'Most attacks are not targeted at all — they are automated and indiscriminate, which makes smaller businesses with weaker controls comparatively easy. Being small reduces attention, not exposure.',
      },
      {
        question: 'Do we need this if we are fully on Microsoft 365?',
        answer:
          'Microsoft secures its platform; your tenant configuration, your devices and your staff are still yours to get right. A default 365 setup leaves meaningful gaps, and closing them is usually configuration rather than new spend.',
      },
      {
        question: 'Will security controls slow our team down?',
        answer:
          'Badly implemented ones will, and people route around friction. We aim for controls staff barely notice — single sign-on, sensible session lengths, and MFA prompts that do not fire twenty times a day.',
      },
      {
        question: 'Can you help with a cyber insurance questionnaire?',
        answer:
          'Yes. Those forms ask specific questions about MFA coverage, patching cadence, backup testing and incident response. We can answer them accurately, and tell you where an honest answer would currently be no.',
      },
      {
        question: 'What happens if we are breached?',
        answer:
          'We work the incident plan: contain, preserve evidence, restore from tested backups, and support whatever notification obligations apply. Then a written post-incident review of what allowed it and what changed as a result.',
      },
    ],
  },
  {
    slug: 'cloud-migration',
    name: 'Cloud and migration',
    label: 'Cloud',
    headline: [
      { text: 'Move to the cloud without', className: 'font-normal' },
      { text: 'losing a working day.', className: 'italic font-serif' },
    ],
    intro:
      'Migrations go wrong when they are treated as a single weekend. We run them in stages with a tested rollback at every step, so the worst case is a delay rather than a disaster.',
    summary: 'Microsoft 365 and Azure migrations, run in stages.',
    seoTitle: 'Cloud Migration and Microsoft 365 — BedRock IT',
    seoDescription:
      'Staged Microsoft 365 and Azure migrations with tested rollback at every step, licensing review and backups proven by restore — planned around your trading hours.',
    includes: [
      {
        title: 'Microsoft 365 and Azure set up properly',
        body: 'Tenant structure, identity, licensing and security baseline designed deliberately rather than accumulated over years of expedient decisions.',
      },
      {
        title: 'File server to SharePoint',
        body: 'Permissions mapped before anything moves, so the new structure reflects how your team actually works instead of importing two decades of nested folders.',
      },
      {
        title: 'Licensing review',
        body: 'Most environments we inherit are paying for seats nobody uses and the wrong tier for the ones they do. The review often offsets a meaningful share of the project cost.',
      },
      {
        title: 'Backup and recovery, tested',
        body: 'Cloud does not mean backed up. We configure backup for cloud data and prove recovery works by actually restoring.',
      },
      {
        title: 'Email continuity through cutover',
        body: 'DNS and mail flow sequenced so nothing bounces during the move — the part clients notice immediately when it goes wrong.',
      },
      {
        title: 'Documentation and handover',
        body: 'How it is built, why it was built that way, and what to do when it needs changing. Yours to keep regardless of who supports you afterwards.',
      },
    ],
    process: [
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
    ],
    outcomes: [
      'No working day lost to the migration itself',
      'Licensing reviewed, usually downwards',
      'Backups tested by restore rather than assumed',
      'A security baseline applied as part of the move, not after it',
    ],
    faqs: [
      {
        question: 'How long does a migration take?',
        answer:
          'Discovery and design usually take a couple of weeks; the move itself depends on data volume and how many systems depend on the old environment. We give you a staged plan with dates rather than a single cutover weekend.',
      },
      {
        question: 'Will anyone be unable to work during the move?',
        answer:
          'That is the constraint we design around. Bulk moves run outside trading hours in stages, and every stage has a rollback that has been tested rather than assumed.',
      },
      {
        question: 'Is our data safe in the cloud?',
        answer:
          'The platform is almost certainly more resilient than an ageing server in a cupboard. The real risks move to identity and configuration — which is why MFA and a security baseline are part of the migration rather than a later project.',
      },
      {
        question: 'Do we still need backups if we are on Microsoft 365?',
        answer:
          'Yes. Microsoft protects its infrastructure, not you from deletion, ransomware or a departing employee clearing a mailbox. Retention defaults are shorter than most businesses assume.',
      },
      {
        question: 'Can we move in stages rather than all at once?',
        answer:
          'That is our default. Hybrid states are normal for a period, and a staged plan is far easier to recover from than a single all-or-nothing cutover.',
      },
    ],
  },
]

export function serviceBySlug(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug)
}
