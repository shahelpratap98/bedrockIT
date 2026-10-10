export type Stage = 'new' | 'contacted' | 'quoted' | 'won' | 'lost'
export type Source = 'website_form' | 'google_ads' | 'meta' | 'email' | 'phone' | 'referral' | 'other'

export const STAGES: Stage[] = ['new', 'contacted', 'quoted', 'won', 'lost']
export const OPEN_STAGES: Stage[] = ['new', 'contacted', 'quoted']

export const STAGE_LABEL: Record<Stage, string> = {
  new: 'New',
  contacted: 'Contacted',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
}

export const SOURCE_LABEL: Record<Source, string> = {
  website_form: 'Website form',
  google_ads: 'Google Ads',
  meta: 'Facebook / Instagram',
  email: 'Email',
  phone: 'Phone',
  referral: 'Referral',
  other: 'Other',
}

/** A row of v_leads: the lead plus its contact and email summary. */
export interface LeadRow {
  id: string
  contact_id: string
  title: string
  service: string | null
  source: Source
  stage: Stage
  value: number | null
  monthly_value: number | null
  next_action: string | null
  next_action_on: string | null
  lost_reason: string | null
  quoted_on: string | null
  won_on: string | null
  closed_at: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  gclid: string | null
  fbclid: string | null
  landing_page: string | null
  referrer: string | null
  created_at: string
  contact_email: string
  contact_name: string | null
  contact_phone: string | null
  contact_company: string | null
  message_count: number
  last_message_at: string | null
  last_message_subject: string | null
  last_message_direction: 'in' | 'out' | null
}

export interface Message {
  id: string
  direction: 'in' | 'out'
  from_email: string | null
  from_name: string | null
  to_emails: string[]
  subject: string
  preview: string
  body_text: string
  received_at: string
  has_attachments: boolean
  is_form: boolean
  lead_id: string | null
}

export interface Activity {
  id: string
  kind: 'note' | 'call' | 'stage' | 'email' | 'system'
  body: string
  at: string
  created_by: string | null
  author: { display_name: string } | null
}

export interface TriageRow {
  id: string
  email: string
  name: string | null
  company: string | null
  first_seen_at: string
  last_inbound_at: string | null
  message_count: number
  last_subject: string | null
  last_preview: string | null
}
