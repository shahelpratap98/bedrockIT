import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth'
import { configured } from './supabase'
import Layout from './Layout'
import Login from './pages/Login'
import SetPassword from './pages/SetPassword'
import Leads from './pages/Leads'
import LeadDetail from './pages/LeadDetail'
import AddLead from './pages/AddLead'
import Inbox from './pages/Inbox'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import { Loading } from './ui'

function Gate() {
  const { session, loading, recovering } = useAuth()
  if (loading) return <Loading />
  if (recovering) return <SetPassword />
  if (!session) return <Login />
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Leads />} />
        <Route path="leads/new" element={<AddLead />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="card max-w-md p-6 text-sm text-stone-700">
          <h1 className="text-lg font-semibold text-stone-900">BedRock CRM</h1>
          <p className="mt-2">Not connected to a database yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel and redeploy.</p>
        </div>
      </div>
    )
  }
  return (
    <BrowserRouter basename="/portal">
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </BrowserRouter>
  )
}
