import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { OPEN_STAGES, STAGE_LABEL, type LeadRow, type Payment, type Stage } from '../types'
import Money from '../Money'
import { ago, date, isOverdue, money, todayNZ } from '../format'
import { Empty, ErrorNote, Loading, PageTitle, SourceChip, StageBadge, friendly } from '../ui'

type Filter = 'open' | Stage | 'all'
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'open', label: 'Open' },
  ...(['new', 'contacted', 'quoted', 'won', 'lost'] as Stage[]).map((s) => ({ key: s as Filter, label: STAGE_LABEL[s] })),
  { key: 'all', label: 'All' },
]

export default function Leads() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<LeadRow[] | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('open')
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('v_leads').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (error) setError(friendly(error))
      setRows((data as LeadRow[]) ?? [])
    })
    supabase.from('payments').select('id, lead_id, amount, paid_on, note').then(({ data }) => setPayments((data as Payment[]) ?? []))
  }, [])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (rows ?? [])
      .filter((r) => (filter === 'all' ? true : filter === 'open' ? OPEN_STAGES.includes(r.stage) : r.stage === filter))
      .filter((r) => !term || [r.contact_name, r.contact_email, r.contact_company, r.title, r.service]
        .some((v) => v?.toLowerCase().includes(term)))
      // Overdue and due follow-ups first, then newest.
      .sort((a, b) => {
        const da = a.next_action_on ?? '9999', db = b.next_action_on ?? '9999'
        return da !== db ? da.localeCompare(db) : b.created_at.localeCompare(a.created_at)
      })
  }, [rows, filter, search])

  const pipeline = useMemo(() => {
    const month = todayNZ().slice(0, 7)
    const by = (s: Stage) => (rows ?? []).filter((r) => r.stage === s)
    return {
      stages: OPEN_STAGES.map((s) => ({ stage: s, count: by(s).length, value: by(s).reduce((t, r) => t + Number(r.value ?? 0), 0) })),
      wonThisMonth: by('won').filter((r) => (r.won_on ?? '').startsWith(month)),
    }
  }, [rows])

  if (!rows) return <Loading />

  return (
    <>
      <PageTitle
        title="Leads"
        sub="Every enquiry from the info@ inbox, the website form and anything you add by hand."
        actions={<Link to="/leads/new" className="btn-primary">Add lead</Link>}
      />
      <ErrorNote error={error} />

      <Money rows={rows} payments={payments} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {pipeline.stages.map(({ stage, count, value }) => (
          <button key={stage} onClick={() => setFilter(stage)} className="card p-4 text-left transition-colors hover:border-stone-400">
            <p className="text-xs text-stone-500">{STAGE_LABEL[stage]}</p>
            <p className="mt-1 text-2xl font-semibold">{count}</p>
            <p className="text-xs text-stone-500">{value ? money(value) : 'no value set'}</p>
          </button>
        ))}
        <button onClick={() => setFilter('won')} className="card p-4 text-left transition-colors hover:border-stone-400">
          <p className="text-xs text-stone-500">Won this month</p>
          <p className="mt-1 text-2xl font-semibold">{pipeline.wonThisMonth.length}</p>
          <p className="text-xs text-stone-500">{money(pipeline.wonThisMonth.reduce((t, r) => t + Number(r.value ?? 0), 0))}</p>
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1 rounded-lg bg-stone-200/60 p-1">
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`rounded-md px-3 py-1 text-sm ${filter === f.key ? 'bg-white font-medium shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <input className="input max-w-xs" placeholder="Search name, company, email…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="mt-4">
        {visible.length === 0 ? (
          <Empty>{rows.length === 0 ? 'No leads yet. They appear here as enquiries reach info@.' : 'Nothing matches that filter.'}</Empty>
        ) : (
          <div className="card divide-y divide-stone-100 overflow-hidden">
            <div className="hidden grid-cols-12 gap-3 bg-stone-50 px-4 py-2 text-xs font-medium text-stone-500 md:grid">
              <span className="col-span-3">Contact</span>
              <span className="col-span-3">Enquiry</span>
              <span className="col-span-2">Next action</span>
              <span className="col-span-1 text-right">Value</span>
              <span className="col-span-1">Stage</span>
              <span className="col-span-2 text-right">Last email</span>
            </div>
            {visible.map((r) => (
              <button key={r.id} onClick={() => navigate(`/leads/${r.id}`)}
                className="grid w-full grid-cols-2 gap-x-3 gap-y-1 px-4 py-3 text-left hover:bg-stone-50 md:grid-cols-12 md:items-center">
                <span className="col-span-2 md:col-span-3">
                  <span className="block truncate text-sm font-medium text-stone-900">{r.contact_name || r.contact_email}</span>
                  <span className="block truncate text-xs text-stone-500">{r.contact_company || r.contact_email}</span>
                </span>
                <span className="col-span-2 md:col-span-3">
                  <span className="block truncate text-sm">{r.title}</span>
                  <span className="mt-0.5 block"><SourceChip source={r.source} /></span>
                </span>
                <span className={`text-xs md:col-span-2 ${isOverdue(r.next_action_on) ? 'font-medium text-red-700' : 'text-stone-600'}`}>
                  {r.next_action_on ? `${date(r.next_action_on)}${r.next_action ? ` · ${r.next_action}` : ''}` : <span className="text-stone-400">—</span>}
                </span>
                <span className="text-right text-sm md:col-span-1">{money(r.value)}</span>
                <span className="md:col-span-1"><StageBadge stage={r.stage} /></span>
                <span className="text-right text-xs text-stone-500 md:col-span-2">
                  {r.last_message_at ? `${r.last_message_direction === 'out' ? 'You · ' : ''}${ago(r.last_message_at)}` : '—'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
