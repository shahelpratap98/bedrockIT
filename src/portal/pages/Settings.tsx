import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../auth'
import { ago, dateTime } from '../format'
import { ErrorNote, Loading, PageTitle, friendly } from '../ui'

interface SyncState {
  mailbox: string | null
  subscription_expires: string | null
  last_run_at: string | null
  last_ok_at: string | null
  last_error: string | null
  messages_seen: number
}

export default function Settings() {
  const { session } = useAuth()
  const [state, setState] = useState<SyncState | null>(null)
  const [check, setCheck] = useState<{ configured: boolean; missing: string[] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('mail_sync').select('*').maybeSingle()
    if (error) setError(friendly(error))
    setState((data as SyncState) ?? null)
  }, [])

  useEffect(() => {
    void load()
    fetch('/api/crm/sync?check=1').then((r) => (r.ok ? r.json() : null)).then(setCheck).catch(() => setCheck(null))
  }, [load])

  async function syncNow() {
    setRunning(true)
    setResult(null)
    try {
      const res = await fetch('/api/crm/sync', { method: 'POST', headers: { authorization: `Bearer ${session?.access_token ?? ''}` } })
      const body = await res.json().catch(() => ({}))
      if (res.status === 501) setResult('The mailbox connection is not set up yet. See below.')
      else if (!res.ok) setResult(`Sync failed: ${body.error ?? res.status}`)
      else setResult(`Done. Read ${(body.inbox?.seen ?? 0) + (body.sent?.seen ?? 0)} new emails.`)
    } catch {
      setResult('Could not reach the sync service.')
    }
    setRunning(false)
    await load()
  }

  if (!state) return <><ErrorNote error={error} /><Loading /></>
  const healthy = state.last_ok_at && !state.last_error

  return (
    <>
      <PageTitle title="Settings" sub="The connection to the info@ mailbox." />
      <ErrorNote error={error} />
      <section className="card max-w-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Mailbox sync</h2>
            <p className={`mt-1 text-sm ${healthy ? 'text-emerald-700' : 'text-stone-600'}`}>
              {healthy ? `Working. Last checked ${ago(state.last_ok_at)}.` : state.last_ok_at ? 'Had a problem on the last run.' : 'Not run yet.'}
            </p>
          </div>
          <button className="btn-primary" onClick={syncNow} disabled={running}>{running ? 'Syncing…' : 'Sync now'}</button>
        </div>
        {result && <p className="mt-3 text-sm text-stone-700">{result}</p>}
        {state.last_error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800">{state.last_error}</p>}
        <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-xs text-stone-500">Last run</dt><dd>{dateTime(state.last_run_at)}</dd></div>
          <div><dt className="text-xs text-stone-500">Last successful run</dt><dd>{dateTime(state.last_ok_at)}</dd></div>
          <div><dt className="text-xs text-stone-500">Instant updates until</dt><dd>{dateTime(state.subscription_expires)} <span className="text-stone-400">(renews daily)</span></dd></div>
          <div><dt className="text-xs text-stone-500">Emails read so far</dt><dd>{state.messages_seen}</dd></div>
        </dl>
        {check && !check.configured && (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Still to set in Vercel: {check.missing.join(', ')}.
          </div>
        )}
      </section>
    </>
  )
}
