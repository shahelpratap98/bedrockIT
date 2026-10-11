import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { SOURCE_LABEL, type Source } from '../types'
import { money, todayNZ } from '../format'
import { Empty, ErrorNote, Loading, PageTitle, friendly } from '../ui'

interface Row {
  source: Source
  leads: number
  quoted: number
  won: number
  lost: number
  open: number
  won_value: number
  won_monthly: number
  quoted_value: number
}

function rangeFor(key: string): [string, string] {
  const today = todayNZ()
  const [y, m] = today.split('-').map(Number)
  const back = (months: number) => new Date(Date.UTC(y, m - 1 - months, 1)).toISOString().slice(0, 10)
  if (key === 'month') return [back(0), today]
  if (key === '3m') return [back(2), today]
  if (key === 'year') return [`${y}-01-01`, today]
  return ['2000-01-01', today]
}

const RANGES = [
  { key: 'month', label: 'This month' },
  { key: '3m', label: 'Last 3 months' },
  { key: 'year', label: 'This year' },
  { key: 'all', label: 'All time' },
]

const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : '—')

export default function Reports() {
  const [range, setRange] = useState('3m')
  const [rows, setRows] = useState<Row[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setRows(null)
    const [from, to] = rangeFor(range)
    supabase.rpc('crm_report', { p_from: from, p_to: to }).then(({ data, error }) => {
      if (error) setError(friendly(error))
      setRows(((data as Row[]) ?? []).map((r) => ({ ...r, won_value: Number(r.won_value), won_monthly: Number(r.won_monthly), quoted_value: Number(r.quoted_value) })))
    })
  }, [range])

  const total = (rows ?? []).reduce(
    (t, r) => ({ leads: t.leads + r.leads, quoted: t.quoted + r.quoted, won: t.won + r.won, open: t.open + r.open, won_value: t.won_value + r.won_value, won_monthly: t.won_monthly + r.won_monthly }),
    { leads: 0, quoted: 0, won: 0, open: 0, won_value: 0, won_monthly: 0 },
  )

  return (
    <>
      <PageTitle
        title="Reports"
        sub="Where enquiries come from and which ones turn into paying work, by the date each enquiry arrived. Set ad spend beside these to see your real cost per client."
        actions={
          <div className="flex gap-1 rounded-lg bg-stone-200/60 p-1">
            {RANGES.map((r) => (
              <button key={r.key} onClick={() => setRange(r.key)}
                className={`rounded-md px-3 py-1 text-sm ${range === r.key ? 'bg-white font-medium shadow-sm' : 'text-stone-600'}`}>{r.label}</button>
            ))}
          </div>
        }
      />
      <ErrorNote error={error} />
      {!rows ? <Loading /> : rows.length === 0 ? <Empty>No enquiries in this period.</Empty> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-stone-50 text-left text-xs text-stone-500">
              <tr>
                <th className="px-4 py-2 font-medium">Came from</th>
                <th className="px-4 py-2 text-right font-medium">Leads</th>
                <th className="px-4 py-2 text-right font-medium">Quoted</th>
                <th className="px-4 py-2 text-right font-medium">Won</th>
                <th className="px-4 py-2 text-right font-medium">Win rate</th>
                <th className="px-4 py-2 text-right font-medium">Still open</th>
                <th className="px-4 py-2 text-right font-medium">Won $</th>
                <th className="px-4 py-2 text-right font-medium">Won monthly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((r) => (
                <tr key={r.source}>
                  <td className="px-4 py-2.5">{SOURCE_LABEL[r.source] ?? r.source}</td>
                  <td className="px-4 py-2.5 text-right">{r.leads}</td>
                  <td className="px-4 py-2.5 text-right">{r.quoted}</td>
                  <td className="px-4 py-2.5 text-right">{r.won}</td>
                  <td className="px-4 py-2.5 text-right">{pct(r.won, r.leads)}</td>
                  <td className="px-4 py-2.5 text-right">{r.open}</td>
                  <td className="px-4 py-2.5 text-right">{money(r.won_value)}</td>
                  <td className="px-4 py-2.5 text-right">{r.won_monthly ? money(r.won_monthly) : '—'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-stone-200 font-medium">
              <tr>
                <td className="px-4 py-2.5">Total</td>
                <td className="px-4 py-2.5 text-right">{total.leads}</td>
                <td className="px-4 py-2.5 text-right">{total.quoted}</td>
                <td className="px-4 py-2.5 text-right">{total.won}</td>
                <td className="px-4 py-2.5 text-right">{pct(total.won, total.leads)}</td>
                <td className="px-4 py-2.5 text-right">{total.open}</td>
                <td className="px-4 py-2.5 text-right">{money(total.won_value)}</td>
                <td className="px-4 py-2.5 text-right">{total.won_monthly ? money(total.won_monthly) : '—'}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </>
  )
}
