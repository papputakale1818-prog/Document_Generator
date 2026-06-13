import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileDropdown from '../components/ProfileDropdown'
import softgridBg from '../assets/background.png'
import uasBg from '../assets/UAS_background image_1.png'

const API_URL = 'http://127.0.0.1:8000'

const PALETTE = [
  'from-indigo-500 to-indigo-700',
  'from-fuchsia-500 to-purple-600',
  'from-sky-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
]

const BG_MAP = { 1: softgridBg, 2: uasBg }

// ── Notification Modal ────────────────────────────────────────────────────────
function NotificationModal({ onClose, token }) {
  const [notifications, setNotifications] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [actionId, setActionId] = useState(null)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${API_URL}/notifications/`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setNotifications(data)
    } catch { setNotifications([]) }
    finally   { setLoading(false) }
  }, [token])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  const handleAction = async (id, action) => {
    setActionId(id)
    try {
      await fetch(`${API_URL}/notifications/${id}/${action}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
      await fetchNotifications()
    } catch { alert('काहीतरी चुकलं, पुन्हा try करा') }
    finally   { setActionId(null) }
  }

  const pending  = notifications.filter(n => n.status === 'pending')
  const resolved = notifications.filter(n => n.status !== 'pending')

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md h-screen bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()} style={{ animation: 'slideIn 0.25s ease-out' }}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Notifications</h2>
              {!loading && <p className="text-xs text-gray-400">{pending.length} pending request{pending.length !== 1 ? 's' : ''}</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Loading...
            </div>
          )}
          {!loading && notifications.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <div className="text-4xl mb-3">🔔</div>
              <p className="text-sm">कोणत्याही notifications नाहीत</p>
            </div>
          )}
          {!loading && pending.length > 0 && (
            <>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider px-1">Pending Requests</p>
              {pending.map(n => <NotifCard key={n.id} n={n} actionId={actionId} onApprove={() => handleAction(n.id, 'approve')} onReject={() => handleAction(n.id, 'reject')} />)}
            </>
          )}
          {!loading && resolved.length > 0 && (
            <>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mt-4">Previous</p>
              {resolved.map(n => <NotifCard key={n.id} n={n} actionId={actionId} resolved />)}
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  )
}

function NotifCard({ n, actionId, onApprove, onReject, resolved = false }) {
  const isLoading = actionId === n.id
  const statusColor = { pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30', approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', rejected: 'bg-red-500/15 text-red-400 border-red-500/30' }[n.status] || ''
  return (
    <div className={`rounded-xl border bg-white/5 p-4 space-y-3 transition ${resolved ? 'opacity-60' : 'border-white/10'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {n.full_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-white font-medium text-sm">{n.full_name}</p>
            <p className="text-gray-400 text-xs">{n.designation || '—'} · {n.department || '—'}</p>
          </div>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor} shrink-0`}>{n.status}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400">
        <span>📱 {n.mobile}</span>
        <span>👤 {n.emp_type || '—'}</span>
        {n.generated_emp_id && <span className="col-span-2 text-indigo-400 font-medium">🆔 {n.generated_emp_id}</span>}
        <span className="col-span-2 text-gray-600">{n.created_at ? new Date(n.created_at).toLocaleString('en-IN') : ''}</span>
      </div>
      {!resolved && n.status === 'pending' && (
        <div className="flex gap-2 pt-1">
          <button onClick={onApprove} disabled={isLoading} className="flex-1 text-xs font-semibold py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition disabled:opacity-50">
            {isLoading ? '⏳' : '✅ Approve'}
          </button>
          <button onClick={onReject} disabled={isLoading} className="flex-1 text-xs font-semibold py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition disabled:opacity-50">
            {isLoading ? '⏳' : '❌ Reject'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CompaniesPage() {
  const [companies,    setCompanies]    = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [showNotif,    setShowNotif]    = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  const { setSelectedCompany, user } = useAuth()
  const navigate = useNavigate()
  const token    = localStorage.getItem('hr_token')

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true); setError('')
      try {
        if (!token) { navigate('/login'); return }
        const res  = await fetch(`${API_URL}/companies/`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()
        const enriched = data.map((co, i) => ({
          ...co,
          initials: co.initials || getInitials(co.name),
          color:    co.color    || PALETTE[i % PALETTE.length],
          bgImage:  BG_MAP[co.id] || undefined,
        }))
        setCompanies(enriched)
      } catch { setError('Companies load करता आल्या नाहीत') }
      finally   { setLoading(false) }
    }
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (user?.role !== 'admin' || !token) return
    const fetchCount = async () => {
      try {
        const res  = await fetch(`${API_URL}/notifications/pending-count`, { headers: { Authorization: `Bearer ${token}` } })
        const data = await res.json()
        setPendingCount(data.count || 0)
      } catch {}
    }
    fetchCount()
    const iv = setInterval(fetchCount, 30000)
    return () => clearInterval(iv)
  }, [user, token])

  function getInitials(name) {
    const words = name.trim().split(' ')
    return words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase()
  }

  const handleSelect = (company) => { setSelectedCompany(company); navigate('/dashboard') }

  const handleCloseNotif = async () => {
    setShowNotif(false)
    if (user?.role === 'admin' && token) {
      try {
        const res  = await fetch(`${API_URL}/notifications/pending-count`, { headers: { Authorization: `Bearer ${token}` } })
        const data = await res.json()
        setPendingCount(data.count || 0)
      } catch {}
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white animate-fadeIn">

      {/* HEADER */}
      <header className="backdrop-blur bg-white/5 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Left — Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">HR</span>
            </div>
            <span className="text-xl font-semibold">HR Portal</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Admin only */}
            {user?.role === 'admin' && (
              <>
                <button onClick={() => setShowNotif(true)} className="relative text-gray-300 hover:text-white transition hover:scale-110" title="Notifications">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {pendingCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-white px-0.5">
                      {pendingCount > 99 ? '99+' : pendingCount}
                    </span>
                  )}
                </button>
                <button onClick={() => navigate('/users')} className="text-sm text-indigo-300 hover:text-white border border-indigo-500/40 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition hover:bg-indigo-500/10">
                  👥 Users
                </button>
              </>
            )}

            {/* ✅ Shared ProfileDropdown — import केलेला */}
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Select Company</h2>
          <p className="text-gray-400 text-sm mt-1">Choose a company to continue</p>
        </div>

        {loading && <div className="text-center py-24 text-gray-400"><div className="text-4xl mb-4">⏳</div><p>Loading companies...</p></div>}
        {error   && <div className="text-center py-24 text-red-400"><div className="text-4xl mb-4">⚠️</div><p>{error}</p></div>}

        {!loading && !error && companies.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Companies Assigned</h3>
            <p className="text-gray-400 text-sm">Admin ने अजून कोणती company assign केली नाही.</p>
          </div>
        )}

        {!loading && !error && companies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((co, i) => (
              <button key={co.id} onClick={() => handleSelect(co)}
                className="relative group card-hover bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-md hover:shadow-xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:to-pink-500/10 transition" />
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${co.color || PALETTE[i % PALETTE.length]} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition`}>
                  <span className="text-white font-bold">{co.initials}</span>
                </div>
                <h3 className="font-semibold text-white text-left">{co.name}</h3>
                <p className="text-xs text-gray-400 mt-1 group-hover:text-indigo-300 transition text-left">Open dashboard →</p>
              </button>
            ))}
          </div>
        )}
      </main>

      {showNotif && <NotificationModal onClose={handleCloseNotif} token={token} />}

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.7s ease-out; }
        .card-hover { transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
        .card-hover:hover { transform: translateY(-6px) scale(1.02); }
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}