import { useState, type FormEvent } from 'react'
import { supabase } from '../supabase'
import { ErrorNote } from '../ui'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function signIn(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    // One message for every failure, so the form never confirms which
    // addresses have an account.
    if (error) setError('That email and password do not match an account.')
  }

  async function resetPassword() {
    if (!email.trim()) return setError('Enter your email address first.')
    setError(null)
    await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/portal/` })
    setNotice('If that address has an account, a reset link is on its way.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={signIn} className="card w-full max-w-sm p-6 sm:p-8">
        <h1 className="text-lg font-semibold">BedRock CRM</h1>
        <p className="mt-1 text-sm text-stone-500">Sign in to see your leads.</p>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="label">Email</span>
            <input className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="block">
            <span className="label">Password</span>
            <input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <ErrorNote error={error} />
          {notice && <p className="text-sm text-emerald-700">{notice}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <button type="button" onClick={resetPassword} className="w-full text-center text-xs text-stone-500 underline-offset-4 hover:underline">
            Forgot your password?
          </button>
        </div>
      </form>
    </div>
  )
}
