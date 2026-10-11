import { useMemo, useState } from 'react'
import type { LeadRow, Payment } from './types'
import { money, todayNZ } from './format'

// Categorical slots 1 and 2 of the reference palette, validated on the white
// card surface (CVD ΔE 24.7, contrast >= 3:1). Earned is the agreed value of
// won work; received is money actually paid.
const EARNED = '#2a78d6'
const RECEIVED = '#eb6834'

const MONTHS = 12
const monthKey = (d: string) => d.slice(0, 7)

/** When a won job counts as earned: its won date, else when it came in. */
const wonDate = (r: LeadRow) => r.won_on ?? r.created_at.slice(0, 10)

function lastMonths(n: number) {
  const [y, m] = todayNZ().split('-').map(Number)
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 - (n - 1 - i), 1))
    return {
      key: d.toISOString().slice(0, 7),
      label: d.toLocaleDateString('en-NZ', { month: 'short', timeZone: 'UTC' }),
      long: d.toLocaleDateString('en-NZ', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
    }
  })
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-stone-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-stone-500">{sub}</p>}
    </div>
  )
}

export default function Money({ rows, payments }: { rows: LeadRow[]; payments: Payment[] }) {
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const [hover, setHover] = useState<string | null>(null)

  const m = useMemo(() => {
    const year = todayNZ().slice(0, 4)
    const won = rows.filter((r) => r.stage === 'won')
    const paidBy = new Map<string, number>()
    for (const p of payments) paidBy.set(p.lead_id, (paidBy.get(p.lead_id) ?? 0) + Number(p.amount))

    const value = (r: LeadRow) => Number(r.value ?? 0)
    const earnedAll = won.reduce((t, r) => t + value(r), 0)
    const earnedYear = won.filter((r) => wonDate(r).startsWith(year)).reduce((t, r) => t + value(r), 0)
    const receivedAll = payments.reduce((t, p) => t + Number(p.amount), 0)
    const receivedYear = payments.filter((p) => p.paid_on.startsWith(year)).reduce((t, p) => t + Number(p.amount), 0)
    const owed = won.reduce((t, r) => t + Math.max(value(r) - (paidBy.get(r.id) ?? 0), 0), 0)
    const owedJobs = won.filter((r) => value(r) - (paidBy.get(r.id) ?? 0) > 0.005).length
    const monthly = won.reduce((t, r) => t + Number(r.monthly_value ?? 0), 0)
    const priced = won.filter((r) => value(r) > 0)
    const unpriced = won.length - priced.length

    const months = lastMonths(MONTHS).map((mo) => ({
      ...mo,
      earned: won.filter((r) => monthKey(wonDate(r)) === mo.key).reduce((t, r) => t + value(r), 0),
      received: payments.filter((p) => monthKey(p.paid_on) === mo.key).reduce((t, p) => t + Number(p.amount), 0),
    }))
    const peak = Math.max(1, ...months.map((x) => Math.max(x.earned, x.received)))

    return { year, earnedAll, earnedYear, receivedAll, receivedYear, owed, owedJobs, monthly, priced, unpriced, wonCount: won.length, months, peak }
  }, [rows, payments])

  // Round the axis top up to a tidy figure so gridline labels read cleanly.
  const step = Math.pow(10, Math.floor(Math.log10(m.peak)))
  const top = Math.ceil(m.peak / step) * step
  const pct = (v: number) => `${(v / top) * 100}%`

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-stone-900">Money</h2>
        {m.unpriced > 0 && (
          <p className="text-xs text-stone-500">{m.unpriced} won job{m.unpriced === 1 ? ' has' : 's have'} no price yet</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label={`Earned in ${m.year}`} value={money(m.earnedYear)} sub={`${money(m.earnedAll)} all time`} />
        <Stat label={`Received in ${m.year}`} value={money(m.receivedYear)} sub={`${money(m.receivedAll)} all time`} />
        <Stat label="Owed to you" value={money(m.owed)} sub={m.owedJobs ? `across ${m.owedJobs} job${m.owedJobs === 1 ? '' : 's'}` : 'all paid'} />
        <Stat label="Monthly recurring" value={`${money(m.monthly)}/mo`} sub={`${money(m.monthly * 12)} a year`} />
        <Stat label="Average job" value={m.priced.length ? money(m.earnedAll / m.priced.length) : '—'} sub={`${m.wonCount} won job${m.wonCount === 1 ? '' : 's'}`} />
      </div>

      <div className="card mt-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-stone-600">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: EARNED }} />Earned (won work)</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: RECEIVED }} />Received</span>
          </div>
          <div className="flex gap-1 rounded-lg bg-stone-200/60 p-1 text-xs">
            {(['chart', 'table'] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`rounded-md px-2.5 py-0.5 ${view === v ? 'bg-white font-medium shadow-sm' : 'text-stone-600'}`}>
                {v === 'chart' ? 'Chart' : 'Table'}
              </button>
            ))}
          </div>
        </div>

        {view === 'chart' ? (
          <div className="mt-4 flex gap-2">
            {/* y axis */}
            <div className="relative h-44 w-12 shrink-0 text-right text-[10px] tabular-nums text-stone-400">
              {[1, 0.5, 0].map((f) => (
                <span key={f} className="absolute right-0 -translate-y-1/2" style={{ top: `${(1 - f) * 100}%` }}>{money(top * f)}</span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <div className="relative h-44">
                {[0, 0.5, 1].map((f) => (
                  <div key={f} className="absolute inset-x-0 border-t border-stone-100" style={{ top: `${f * 100}%` }} />
                ))}
                <div className="absolute inset-0 flex">
                  {m.months.map((mo, i) => (
                    <div key={mo.key} className="relative flex flex-1 items-end justify-center gap-[2px] px-[3%]"
                      onMouseEnter={() => setHover(mo.key)} onMouseLeave={() => setHover(null)}
                      aria-label={`${mo.long}: earned ${money(mo.earned)}, received ${money(mo.received)}`}>
                      {hover === mo.key && <div className="absolute inset-y-0 inset-x-[1px] rounded bg-stone-100/70" />}
                      <div className="relative w-full max-w-[14px] rounded-t" style={{ height: pct(mo.earned), background: EARNED, minHeight: mo.earned ? 2 : 0 }} />
                      <div className="relative w-full max-w-[14px] rounded-t" style={{ height: pct(mo.received), background: RECEIVED, minHeight: mo.received ? 2 : 0 }} />
                      {hover === mo.key && (
                        <div className={`pointer-events-none absolute top-1 z-10 w-max ${i >= MONTHS - 3 ? 'right-full mr-1' : 'left-full ml-1'} rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs shadow-lg`}>
                          <p className="font-medium text-stone-900">{mo.long}</p>
                          <p className="text-stone-600">Earned <span className="tabular-nums text-stone-900">{money(mo.earned)}</span></p>
                          <p className="text-stone-600">Received <span className="tabular-nums text-stone-900">{money(mo.received)}</span></p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-1 flex border-t border-stone-300">
                {m.months.map((mo) => (
                  <span key={mo.key} className="flex-1 pt-1 text-center text-[10px] text-stone-500">{mo.label}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[360px] text-sm">
              <thead className="text-left text-xs text-stone-500">
                <tr><th className="py-1.5 font-medium">Month</th><th className="py-1.5 text-right font-medium">Earned</th><th className="py-1.5 text-right font-medium">Received</th></tr>
              </thead>
              <tbody className="divide-y divide-stone-100 tabular-nums">
                {[...m.months].reverse().map((mo) => (
                  <tr key={mo.key}><td className="py-1.5">{mo.long}</td><td className="py-1.5 text-right">{money(mo.earned)}</td><td className="py-1.5 text-right">{money(mo.received)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
