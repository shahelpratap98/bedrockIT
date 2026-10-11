import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { supabase } from './supabase'
import { useAuth } from './auth'

const NAV = [
  { to: '/', label: 'Leads', end: true },
  { to: '/inbox', label: 'Inbox' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
]

export default function Layout() {
  const { session } = useAuth()
  const { pathname } = useLocation()
  const [triage, setTriage] = useState(0)
  const [name, setName] = useState('')

  // Unsorted senders, shown on the Inbox tab. Refreshed on every page change.
  useEffect(() => {
    supabase.from('v_triage').select('id', { count: 'exact', head: true }).then(({ count }) => setTriage(count ?? 0))
  }, [pathname])

  useEffect(() => {
    const id = session?.user.id
    if (!id) return
    supabase.from('profiles').select('display_name').eq('user_id', id).maybeSingle()
      .then(({ data }) => setName(data?.display_name ?? session?.user.email ?? ''))
  }, [session])

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <span className="text-sm font-semibold tracking-tight text-stone-900">
            BedRock <span className="font-normal text-stone-500">CRM</span>
          </span>
          <nav className="order-last -mx-1 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm ${
                    isActive ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`
                }
              >
                {item.label}
                {item.to === '/inbox' && triage > 0 && (
                  <span className="rounded-full bg-amber-400 px-1.5 text-[11px] font-semibold leading-4 text-stone-900">{triage}</span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="hidden text-stone-500 sm:inline">{name}</span>
            <button className="text-stone-600 underline-offset-4 hover:underline" onClick={() => supabase.auth.signOut()}>
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
