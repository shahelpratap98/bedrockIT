import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../auth'
import { SOURCE_LABEL, STAGES, STAGE_LABEL, type Activity, type LeadRow, type Message, type Source, type Stage } from '../types'
import { dateTime, money } from '../format'
import { Empty, ErrorNote, Loading, SourceChip, StageBadge, friendly } from '../ui'

const STAGE_BUTTON: Record<Stage, string> = {
  new: 'border-sky-300 bg-sky-50 text-sky-900',
  contacted: 'border-indigo-300 bg-indigo-50 text-indigo-900',
  quoted: 'border-amber-300 bg-amber-50 text-amber-900',
  won: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  lost: 'border-stone-300 bg-stone-100 text-stone-700',
}

const num = (v: string) => (v.trim() === '' ? null : Number(v))

export default function LeadDetail() {
  const { id = '' } = useParams()
  const { session } = useAuth()
  const [lead, setLead] = useState<LeadRow | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [missing, setMissing] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('v_leads').select('*').eq('id', id).maybeSingle()
    if (error) return setError(friendly(error))
    if (!data) return setMissing(true)
    const row = data as LeadRow
    setLead(row)
    const [m, a] = await Promise.all([
      supabase.from('messages').select('*').eq('contact_id', row.contact_id).order('received_at', { ascending: false }),
      supabase.from('activities').select('*, author:profiles(display_name)').eq('lead_id', id).order('at', { ascending: false }),
    ])
    setMessages((m.data as Message[]) ?? [])
    setActivities((a.data as Activity[]) ?? [])
  }, [id])

  useEffect(() => { void load() }, [load])

  function flash(text: string) {
    setSaved(text)
    window.setTimeout(() => setSaved(null), 2500)
  }

  async function update(patch: Record<string, unknown>, done = 'Saved') {
    setError(null)
    const { error } = await supabase.from('leads').update(patch).eq('id', id)
    if (error) return setError(friendly(error))
    flash(done)
    await load()
  }

  async function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const f = new FormData(event.currentTarget)
    const s = (k: string) => String(f.get(k) ?? '').trim()
    await update({
      title: s('title') || 'Enquiry',
      service: s('service') || null,
      source: s('source'),
      value: num(s('value')),
      monthly_value: num(s('monthly_value')),
      next_action: s('next_action') || null,
      next_action_on: s('next_action_on') || null,
      lost_reason: s('lost_reason') || null,
    })
  }

  async function saveContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!lead) return
    const f = new FormData(event.currentTarget)
    const s = (k: string) => String(f.get(k) ?? '').trim() || null
    const { error } = await supabase.from('contacts').update({ name: s('name'), company: s('company'), phone: s('phone') }).eq('id', lead.contact_id)
    if (error) return setError(friendly(error))
    flash('Contact saved')
    await load()
  }

  async function addActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const f = new FormData(form)
    const body = String(f.get('body') ?? '').trim()
    if (!body || !session) return
    const kind = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value') === 'call' ? 'call' : 'note'
    const { error } = await supabase.from('activities').insert({ lead_id: id, kind, body, created_by: session.user.id })
    if (error) return setError(friendly(error))
    form.reset()
    await load()
  }

  if (missing) return <Empty>That lead no longer exists. <Link className="underline" to="/">Back to leads</Link></Empty>
  if (!lead) return <><ErrorNote error={error} /><Loading /></>

  const sourceDetails = [
    ['Campaign', lead.utm_campaign], ['Keyword', lead.utm_term],
    ['Came from', [lead.utm_source, lead.utm_medium].filter(Boolean).join(' / ')],
    ['Landing page', lead.landing_page], ['Referrer', lead.referrer],
    ['Google click ID', lead.gclid], ['Meta click ID', lead.fbclid],
  ].filter(([, v]) => v)

  return (
    <>
      <Link to="/" className="text-sm text-stone-500 hover:text-stone-900">← Leads</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{lead.contact_name || lead.contact_email || 'Unnamed contact'}</h1>
          <p className="mt-1 text-sm text-stone-600">
            {lead.contact_company && <>{lead.contact_company} · </>}
            {lead.contact_email ? <a className="underline-offset-4 hover:underline" href={`mailto:${lead.contact_email}`}>{lead.contact_email}</a> : <span className="text-stone-400">no email on file</span>}
            {lead.contact_phone && <> · <a className="underline-offset-4 hover:underline" href={`tel:${lead.contact_phone.replace(/\s/g, '')}`}>{lead.contact_phone}</a></>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-sm text-emerald-700">{saved}</span>}
          <StageBadge stage={lead.stage} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <button key={s} onClick={() => s !== lead.stage && update({ stage: s }, `Moved to ${STAGE_LABEL[s]}`)}
            className={`btn border ${s === lead.stage ? STAGE_BUTTON[s] + ' font-semibold' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}>
            {STAGE_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="mt-4"><ErrorNote error={error} /></div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card p-5">
            <h2 className="text-sm font-semibold">Notes and calls</h2>
            <form onSubmit={addActivity} className="mt-3 space-y-2">
              <textarea name="body" rows={2} className="input" placeholder="What happened? e.g. Called, wants a quote by Friday" />
              <div className="flex gap-2">
                <button className="btn-primary" value="note">Add note</button>
                <button className="btn-ghost" value="call">Log a call</button>
              </div>
            </form>
            <ul className="mt-4 space-y-3">
              {activities.map((a) => (
                <li key={a.id} className="border-l-2 border-stone-200 pl-3">
                  <p className={`text-sm ${a.kind === 'stage' || a.kind === 'system' ? 'text-stone-500' : 'text-stone-900'}`}>
                    {a.kind === 'call' && <span className="mr-1 font-medium">Call:</span>}{a.body}
                  </p>
                  <p className="text-xs text-stone-400">{dateTime(a.at)}{a.author && ` · ${a.author.display_name}`}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-5">
            <h2 className="text-sm font-semibold">Emails <span className="font-normal text-stone-400">({messages.length})</span></h2>
            {messages.length === 0 ? (
              <p className="mt-3 text-sm text-stone-500">No emails with this contact yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-stone-100">
                {messages.map((m) => (
                  <li key={m.id} className="py-3">
                    <details>
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="truncate text-sm font-medium">
                            <span className={`mr-2 rounded px-1.5 py-0.5 text-[11px] font-medium ${m.direction === 'out' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}>
                              {m.direction === 'out' ? 'You' : m.is_form ? 'Form' : 'Them'}
                            </span>
                            {m.subject || '(no subject)'}
                          </span>
                          <span className="shrink-0 text-xs text-stone-400">{dateTime(m.received_at)}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-stone-500">{m.preview}</p>
                      </summary>
                      <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-stone-50 p-3 font-sans text-sm text-stone-800">{m.body_text || m.preview}</pre>
                      {m.has_attachments && <p className="mt-2 text-xs text-stone-500">Has attachments: open it in Outlook to see them.</p>}
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <form onSubmit={saveDetails} className="card space-y-3 p-5" key={`d-${lead.id}-${lead.stage}`}>
            <h2 className="text-sm font-semibold">Deal</h2>
            <label className="block"><span className="label">What they want</span>
              <input name="title" className="input" defaultValue={lead.title} /></label>
            <label className="block"><span className="label">Service</span>
              <input name="service" className="input" defaultValue={lead.service ?? ''} placeholder="e.g. Business systems" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="label">Build price ($)</span>
                <input name="value" type="number" min="0" step="1" className="input" defaultValue={lead.value ?? ''} /></label>
              <label className="block"><span className="label">Monthly ($)</span>
                <input name="monthly_value" type="number" min="0" step="1" className="input" defaultValue={lead.monthly_value ?? ''} /></label>
            </div>
            <label className="block"><span className="label">Next action</span>
              <input name="next_action" className="input" defaultValue={lead.next_action ?? ''} placeholder="e.g. Send quote" /></label>
            <label className="block"><span className="label">By</span>
              <input name="next_action_on" type="date" className="input" defaultValue={lead.next_action_on ?? ''} /></label>
            <label className="block"><span className="label">Source</span>
              <select name="source" className="input" defaultValue={lead.source}>
                {(Object.keys(SOURCE_LABEL) as Source[]).map((s) => <option key={s} value={s}>{SOURCE_LABEL[s]}</option>)}
              </select></label>
            {lead.stage === 'lost' && (
              <label className="block"><span className="label">Why it was lost</span>
                <input name="lost_reason" className="input" defaultValue={lead.lost_reason ?? ''} placeholder="e.g. Went with an off-the-shelf app" /></label>
            )}
            <button className="btn-primary w-full">Save</button>
          </form>

          <form onSubmit={saveContact} className="card space-y-3 p-5" key={`c-${lead.contact_id}`}>
            <h2 className="text-sm font-semibold">Contact</h2>
            <label className="block"><span className="label">Name</span>
              <input name="name" className="input" defaultValue={lead.contact_name ?? ''} /></label>
            <label className="block"><span className="label">Company</span>
              <input name="company" className="input" defaultValue={lead.contact_company ?? ''} /></label>
            <label className="block"><span className="label">Phone</span>
              <input name="phone" className="input" defaultValue={lead.contact_phone ?? ''} /></label>
            <button className="btn-ghost w-full">Save contact</button>
          </form>

          <section className="card p-5">
            <h2 className="text-sm font-semibold">Where it came from</h2>
            <div className="mt-2"><SourceChip source={lead.source} /></div>
            <dl className="mt-3 space-y-2 text-sm">
              <div><dt className="text-xs text-stone-500">Enquired</dt><dd>{dateTime(lead.created_at)}</dd></div>
              {sourceDetails.map(([k, v]) => (
                <div key={k}><dt className="text-xs text-stone-500">{k}</dt><dd className="break-all">{v}</dd></div>
              ))}
              {lead.quoted_on && <div><dt className="text-xs text-stone-500">Quoted</dt><dd>{lead.quoted_on}</dd></div>}
              {lead.won_on && <div><dt className="text-xs text-stone-500">Won</dt><dd>{lead.won_on} · {money(lead.value)}{lead.monthly_value ? ` + ${money(lead.monthly_value)}/mo` : ''}</dd></div>}
            </dl>
          </section>
        </div>
      </div>
    </>
  )
}
