/**
 * Business systems we have built, shown on /services/business-systems and
 * teased on the home page.
 *
 * Every screenshot is the real application running on invented sample data
 * under a made-up company name. No client's customers, staff or figures
 * appear anywhere, and the clients are described rather than named. Keep it
 * that way: these are other businesses' internal tools.
 */

export interface SystemShot {
  file: string
  alt: string
  caption: string
}

export interface BuiltSystem {
  /** In-page anchor, e.g. /services/business-systems#bookings */
  id: string
  name: string
  builtFor: string
  /** What it replaced. One sentence. */
  replaced: string
  summary: string
  features: string[]
  main: SystemShot
  phone: SystemShot
  more: SystemShot[]
}

export const SYSTEMS: BuiltSystem[] = [
  {
    id: 'bookings',
    name: 'Bookings, dispatch and driver app',
    builtFor: 'An airport shuttle operator',
    replaced: 'A monthly booking spreadsheet, a WhatsApp group and a lot of phone calls.',
    summary:
      'Every booking in one place, a dispatch board that shows who is driving when, and an app on each driver’s phone with only their own jobs.',
    features: [
      'Week dispatch board: drivers down the side, days across the top, unassigned jobs flagged',
      'Drivers see where to go, who to call and what to collect, then mark the job done',
      'Return trips linked, shared rides allowed, clashes and time off flagged before they happen',
      'Dashboard and month-by-month totals: charges, driver pay and what the business keeps',
      'Past bookings imported straight from the old spreadsheet, tab by tab',
    ],
    main: {
      file: 'bookings-calendar.webp',
      alt: 'Week dispatch calendar with each driver’s jobs shown as coloured blocks across Monday to Sunday',
      caption: 'Week dispatch board',
    },
    phone: {
      file: 'bookings-phone.webp',
      alt: 'Driver’s phone view of today’s job with pick-up, drop-off, call and directions buttons',
      caption: 'Driver’s phone',
    },
    more: [
      { file: 'bookings-dashboard.webp', alt: 'Owner dashboard with weekly bookings, charges and driver pay', caption: 'Owner dashboard' },
      { file: 'bookings-list.webp', alt: 'Bookings waiting for a driver, each with an assign button', caption: 'Jobs to assign' },
    ],
  },
  {
    id: 'timesheets',
    name: 'Timesheets, invoicing and leave',
    builtFor: 'A structural engineering firm with 15 staff',
    replaced: 'A macro-heavy Excel timesheet workbook passed around by email.',
    summary:
      'Staff enter their day against a project, a manager approves it, and approved time becomes a GST invoice in a couple of clicks. Leave requests, balances and a team calendar sit alongside.',
    features: [
      'Daily time entry by project and work type, from a desk or a phone on site',
      'Approval queue that freezes each project’s charge-out rate at sign-off',
      'GST invoices built from approved time, with PDF download and Excel export',
      'Annual and sick leave requests, NZ balances and a team calendar',
      'Charge-out rates and invoice values hidden from staff who should not see them',
    ],
    main: {
      file: 'timesheets-approvals.webp',
      alt: 'Approvals screen listing each staff member’s submitted time by project, with hours and value',
      caption: 'Approving the week',
    },
    phone: {
      file: 'timesheets-phone.webp',
      alt: 'Phone view of a staff member’s week with hours entered per day',
      caption: 'Staff on their phone',
    },
    more: [
      { file: 'timesheets-invoice.webp', alt: 'Tax invoice built from approved time, with hours, rates, GST and total due', caption: 'Invoice from approved time' },
      { file: 'timesheets-leave.webp', alt: 'Leave page with requests waiting for approval, a team calendar and leave balances', caption: 'Leave and balances' },
    ],
  },
  {
    id: 'cases',
    name: 'Case management and document checklists',
    builtFor: 'A licensed immigration advisory practice',
    replaced: 'Folders, email threads and a checklist kept in someone’s head.',
    summary:
      'Every client matter is a case with its own document checklist, fee stages and time. Staff tick documents off as they arrive; the adviser sees what is missing across every file at a glance.',
    features: [
      'Document checklist per visa pathway, with received, missing and flagged at a glance',
      'Fixed fees split into stages and invoiced as each stage is reached',
      'Time tracked against each case, so you can see what a fixed fee really earned',
      'Staff can update documents but never see fees or invoices',
      'Client data stays in an account the practice owns, not ours',
    ],
    main: {
      file: 'cases-checklist.webp',
      alt: 'A case with its document checklist showing which documents are received, flagged or missing',
      caption: 'A case and its checklist',
    },
    phone: {
      file: 'cases-phone.webp',
      alt: 'Phone view of a case checklist with documents marked received',
      caption: 'Ticking off documents',
    },
    more: [
      { file: 'cases-list.webp', alt: 'List of open cases with each one’s pathway, adviser and document progress', caption: 'Every open case' },
      { file: 'cases-invoices.webp', alt: 'Invoices page showing fee stages ready to bill per case, invoices awaiting payment and paid this year', caption: 'Fee stages ready to bill' },
    ],
  },
]
