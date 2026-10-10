import { useState, type FormEvent } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../auth'
import { ErrorNote } from '../ui'

/** Shown after following a password-reset link. */
export default function SetPassword() {
  const { doneRecovering } = useAuth()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save(event: FormEvent) {
    event.preventDefault()
    if (password.length < 10) return setError('Use at least 10 characters.')
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) return setError(error.message)
    doneRecovering()
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={save} className="card w-full max-w-sm p-6 sm:p-8">
        <h1 className="text-lg font-semibold">Choose a new password</h1>
        <label className="mt-6 block">
          <span className="label">New password</span>
          <input className="input" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <div className="mt-4 space-y-4">
          <ErrorNote error={error} />
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Saving…' : 'Save password'}</button>
        </div>
      </form>
    </div>
  )
}
