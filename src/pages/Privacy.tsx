import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import { CONTACT, EMAIL_HREF } from '../config/contact'

const LAST_UPDATED = '21 August 2026'

interface Section {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

const SECTIONS: Section[] = [
  {
    title: 'Who we are',
    paragraphs: [
      `BedRock IT is a managed IT services provider based in New Zealand. This policy explains what personal information we collect through this website, why we collect it, and the choices you have. It is written to comply with the New Zealand Privacy Act 2020.`,
    ],
  },
  {
    title: 'What we collect',
    paragraphs: [`We collect personal information in three ways:`],
    bullets: [
      'Contact form — when you send an enquiry we receive the details you type: your name, company, email address, phone number, team size and message.',
      'Direct contact — if you phone, email or message us on WhatsApp, we receive whatever you choose to share, handled under that platform’s own terms.',
      'Technical data — like most websites, our hosting provider records standard server logs (IP address, browser type, pages requested) and our advertising tags set cookies and similar identifiers, described below.',
    ],
  },
  {
    title: 'How we use it',
    paragraphs: [
      `Enquiry details are used to respond to you and, if we end up working together, to set up your account and agreement. We do not sell personal information, and we do not add you to a mailing list because you asked us a question.`,
    ],
  },
  {
    title: 'Advertising and analytics',
    paragraphs: [
      `We use Google’s tag (gtag.js) to measure how the site is used and whether our advertising leads to enquiries. It records page views and fires an event when the contact form is submitted successfully. We do not pass the details you type into the form to Google.`,
      `We may also use similar measurement tools from Meta (Facebook and Instagram) when we advertise on those platforms, which collect page-view data and set cookies to measure ad performance and build advertising audiences.`,
      `You can limit this measurement through your browser’s cookie controls, Google’s Ads Settings (adssettings.google.com), and Meta’s Ad Preferences.`,
    ],
  },
  {
    title: 'Who we share it with',
    paragraphs: [
      `We use a small number of service providers to run this site, and information passes through them only to the extent needed to do their job:`,
    ],
    bullets: [
      'Vercel — hosts the website and processes standard server logs.',
      'Resend — delivers contact form enquiries to our inbox as email.',
      'Google — advertising measurement, as described above.',
      'Meta — advertising measurement, when in use, as described above.',
    ],
  },
  {
    title: 'How long we keep it',
    paragraphs: [
      `Enquiries stay in our email for as long as they are useful for responding to you and keeping a record of our correspondence. If you would like an enquiry deleted, ask and we will remove it.`,
    ],
  },
  {
    title: 'Your rights',
    paragraphs: [
      `Under the Privacy Act 2020 you can ask us for a copy of the personal information we hold about you, and ask us to correct it. Contact us using the details below and we will respond promptly.`,
      `If you are not satisfied with how we have handled your information, you can complain to the Office of the Privacy Commissioner at privacy.org.nz.`,
    ],
  },
  {
    title: 'Changes to this policy',
    paragraphs: [
      `If we change how we handle personal information, we will update this page. The date at the top reflects the latest revision.`,
    ],
  },
]

export default function Privacy() {
  return (
    <div className="bg-black">
      <Navbar variant="inline" />

      <PageHeader
        label={`Last updated ${LAST_UPDATED}`}
        segments={[
          { text: 'Privacy', className: 'font-normal' },
          { text: 'policy.', className: 'italic font-serif' },
        ]}
        intro="The short version: we collect what you give us so we can reply to you, our advertising tags measure whether the site works, and we do not sell your information to anyone."
      />

      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-3xl">
          {SECTIONS.map((section) => (
            <div key={section.title} className="border-t border-white/10 py-8 md:py-10">
              <h2 className="text-lg sm:text-xl" style={{ color: '#E1E0CC' }}>
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-4 text-xs leading-relaxed text-gray-400 sm:text-sm"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-4 flex list-disc flex-col gap-2 pl-5">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet.slice(0, 40)}
                      className="text-xs leading-relaxed text-gray-400 sm:text-sm"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="border-t border-white/10 py-8 md:py-10">
            <h2 className="text-lg sm:text-xl" style={{ color: '#E1E0CC' }}>
              Contact us about privacy
            </h2>
            <p className="mt-4 text-xs leading-relaxed text-gray-400 sm:text-sm">
              Email{' '}
              <a href={EMAIL_HREF} className="text-primary">
                {CONTACT.email}
              </a>{' '}
              or call{' '}
              <a href={CONTACT.phoneHref} className="text-primary">
                {CONTACT.phoneDisplay}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
