import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import type { TriageRow } from '../types'
import { ago } from '../format'
import { Empty, ErrorNote, Loading, PageTitle, friendly } from '../ui'

/**
 * People who emailed info@ but are not leads yet. Website form enquiries
 * skip this and become leads straight away; newsletters and system mail
 * never get here at all.
 */
export default function Inbox() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<TriageRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('v_triage').select('*').order('last_inbound_at', { ascending: false })
    if (error) setError(friendly(error))
    setRows((data as TriageRow[]) ?? [])
  }, [])

  useEffect(() => { void load() }, [load])

  async function makeLead(row: TriageRow) {
    setBusy(row.id)
    const { data, error } = await supabase.rpc('crm_make_lead', {
      p_contact_id: row.id, p_title: row.last_subject?.replace(/^(re|fw|fwd):\s*/i, '') || 'Email enquiry',
    })
    setBusy(null)
    if (error) return setError(friendly(error))
    navigate(`/leads/${data}`)
  }

  async function ignore(row: TriageRow) {
    setBusy(row.id)
    const { error } = await supabase.from('contacts').update({ status: 'ignored' }).eq('id', row.id)
    setBusy(null)
    if (error) return setError(friendly(error))
    await load()
  }

  if (!rows) return <Loading />

  return (
    <>
      <PageTitle title="Inbox" sub="New people who emailed info@. Make them a lead, or ignore the sender and their future emails stay out of here." />
      <ErrorNote error={error} />
      {rows.length === 0 ? (
        <Empty>Nothing to sort. New senders show up here.</Empty>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {row.name || row.email}
                  {row.name && <span className="ml-2 font-normal text-stone-500">{row.email}</span>}
                </p>
                <p className="mt-1 truncate text-sm">{row.last_subject || '(no subject)'}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-stone-500">{row.last_preview}</p>
                <p className="mt-1 text-xs text-stone-400">{row.message_count} email{row.message_count === 1 ? '' : 's'} · last {ago(row.last_inbound_at)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button className="btn-primary" disabled={busy === row.id} onClick={() => makeLead(row)}>Make lead</button>
                <button className="btn-ghost" disabled={busy === row.id} onClick={() => ignore(row)}>Ignore sender</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
