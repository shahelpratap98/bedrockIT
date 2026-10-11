const NZ = 'en-NZ'
const TZ = 'Pacific/Auckland'

export function money(value: number | string | null | undefined, cents = false) {
  if (value === null || value === undefined || value === '') return '—'
  return new Intl.NumberFormat(NZ, {
    style: 'currency',
    currency: 'NZD',
    maximumFractionDigits: cents ? 2 : 0,
  }).format(Number(value))
}

export function date(value: string | null | undefined) {
  if (!value) return '—'
  // Plain dates ("2026-10-14") are calendar days, not instants.
  const d = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value)
  return d.toLocaleDateString(NZ, { day: 'numeric', month: 'short', year: 'numeric', timeZone: TZ })
}

export function dateTime(value: string | null | undefined) {
  if (!value) return '—'
  return new Date(value).toLocaleString(NZ, {
    day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: TZ,
  })
}

export function ago(value: string | null | undefined) {
  if (!value) return '—'
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} d ago`
  return date(value)
}

/** Today in New Zealand, as YYYY-MM-DD. */
export function todayNZ() {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ })
}

export function isOverdue(day: string | null) {
  return Boolean(day && day < todayNZ())
}
