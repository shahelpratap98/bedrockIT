import type { ReactNode } from 'react'
import { SOURCE_LABEL, STAGE_LABEL, type Source, type Stage } from './types'

const STAGE_STYLE: Record<Stage, string> = {
  new: 'bg-sky-50 text-sky-800 ring-sky-200',
  contacted: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
  quoted: 'bg-amber-50 text-amber-800 ring-amber-200',
  won: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  lost: 'bg-stone-100 text-stone-600 ring-stone-200',
}

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STAGE_STYLE[stage]}`}>
      {STAGE_LABEL[stage]}
    </span>
  )
}

export function SourceChip({ source }: { source: Source }) {
  return (
    <span className="inline-flex items-center rounded-md bg-stone-100 px-1.5 py-0.5 text-xs text-stone-700">
      {SOURCE_LABEL[source] ?? source}
    </span>
  )
}

export function PageTitle({ title, sub, actions }: { title: string; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">{title}</h1>
        {sub && <p className="mt-1 text-sm text-stone-500">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function ErrorNote({ error }: { error: string | null }) {
  if (!error) return null
  return <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="card px-6 py-12 text-center text-sm text-stone-500">{children}</div>
}

export function Loading() {
  return <p className="py-12 text-center text-sm text-stone-400">Loading…</p>
}

/** Turn a Supabase/PostgREST error into something a person can act on. */
export function friendly(error: { message?: string; code?: string } | null | undefined) {
  if (!error) return null
  if (error.code === '42501' || /permission|not allowed/i.test(error.message ?? '')) return 'You do not have access to do that.'
  if (/fetch|network/i.test(error.message ?? '')) return 'Could not reach the server. Check your connection and try again.'
  return error.message ?? 'Something went wrong.'
}
