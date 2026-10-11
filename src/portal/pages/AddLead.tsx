import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { SOURCE_LABEL, type Source } from '../types'
import { ErrorNote, PageTitle, friendly } from '../ui'

/** For enquiries that did not arrive by email: a call, a referral, a chat. */
export default function AddLead() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const f = new FormData(event.currentTarget)
    const s = (k: string) => String(f.get(k) ?? '').trim()
    setBusy(true)
    setError(null)
    const { data, error } = await supabase.rpc('crm_add_lead', {
      p_email: s('email'),
      p_name: s('name'),
      p_title: s('title'),
      p_phone: s('phone') || null,
      p_company: s('company') || null,
      p_service: s('service') || null,
      p_source: s('source'),
      p_value: s('value') ? Number(s('value')) : null,
    })
    setBusy(false)
    if (error) return setError(friendly(error))
    navigate(`/leads/${data}`)
  }

  return (
    <>
      <Link to="/" className="text-sm text-stone-500 hover:text-stone-900">← Leads</Link>
      <div className="mt-3"><PageTitle title="Add a lead" sub="For enquiries that came by phone, a referral or a message. Emails to info@ arrive by themselves." /></div>
      <form onSubmit={save} className="card max-w-2xl space-y-4 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block"><span className="label">Name</span><input name="name" className="input" required /></label>
          <label className="block"><span className="label">Email</span><input name="email" type="email" className="input" required /></label>
          <label className="block"><span className="label">Phone</span><input name="phone" className="input" /></label>
          <label className="block"><span className="label">Company</span><input name="company" className="input" /></label>
        </div>
        <label className="block"><span className="label">What they want</span>
          <input name="title" className="input" placeholder="e.g. Timesheet system for 8 staff" required /></label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="block"><span className="label">Service</span>
            <select name="service" className="input" defaultValue="Business systems">
              {['Business systems', 'Website development', 'Managed IT support', 'Cyber security', 'Cloud and migration', 'Something else'].map((s) => <option key={s}>{s}</option>)}
            </select></label>
          <label className="block"><span className="label">Came from</span>
            <select name="source" className="input" defaultValue="phone">
              {(Object.keys(SOURCE_LABEL) as Source[]).map((s) => <option key={s} value={s}>{SOURCE_LABEL[s]}</option>)}
            </select></label>
          <label className="block"><span className="label">Build price ($)</span><input name="value" type="number" min="0" className="input" /></label>
        </div>
        <ErrorNote error={error} />
        <button className="btn-primary" disabled={busy}>{busy ? 'Adding…' : 'Add lead'}</button>
      </form>
    </>
  )
}
