

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'

const API_URL = 'http://127.0.0.1:8000'

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // ── State ──────────────────────────────────────────────────────────────
  const [users,     setUsers]     = useState([])
  const [companies, setCompanies] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [msg,       setMsg]       = useState({ text: '', type: '' })

  // Create user form
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user', company_id: '' })
  const [creating, setCreating] = useState(false)

  // Assign company
  const [assignMap, setAssignMap] = useState({})   // { userId: companyId }
  const [assigning, setAssigning] = useState({})   // { userId: bool }

  // ── Flash message ──────────────────────────────────────────────────────
  const flash = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 3500)
  }

  // ── Fetch users ────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      setUsers(data)
      // init assignMap
      const map = {}
      data.forEach(u => { map[u.id] = u.company_id || '' })
      setAssignMap(map)
    } catch (e) {
      flash(e.message, 'error')
    }
  }

  // ── Fetch companies ────────────────────────────────────────────────────
  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${API_URL}/companies`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      })
      if (!res.ok) throw new Error('Failed to fetch companies')
      const data = await res.json()
      setCompanies(data)
    } catch (e) {
      flash(e.message, 'error')
    }
  }

  useEffect(() => {
    Promise.all([fetchUsers(), fetchCompanies()]).finally(() => setLoading(false))
  }, [])

  // ── Create user ────────────────────────────────────────────────────────
  const handleCreateUser = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const body = {
        name:       newUser.name,
        email:      newUser.email,
        password:   newUser.password,
        role:       newUser.role,
        company_id: newUser.company_id ? parseInt(newUser.company_id) : null,
      }
      const res = await fetch(`${API_URL}/admin/users`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to create user')
      flash(`✅ ${data.message}`)
      setNewUser({ name: '', email: '', password: '', role: 'user', company_id: '' })
      fetchUsers()
    } catch (e) {
      flash(e.message, 'error')
    } finally {
      setCreating(false)
    }
  }

  // ── Assign company ─────────────────────────────────────────────────────────
  const handleAssign = async (userId) => {
    const companyId = assignMap[userId]
    if (!companyId) return flash('Company निवडा', 'error')
    setAssigning(prev => ({ ...prev, [userId]: true }))
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/companies`, {
        method:  'PUT',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ company_id: parseInt(companyId) }),
      })
      const data = await res.json()
      if (!res.ok) {
        // 422 detail array असतो — string मध्ये convert करा
        const errMsg = Array.isArray(data.detail)
          ? data.detail.map(e => `${e.loc?.join('.')} — ${e.msg}`).join(', ')
          : (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail))
        throw new Error(errMsg)
      }
      flash(`✅ ${data.message}`)
      fetchUsers()
    } catch (e) {
      flash(e.message, 'error')
    } finally {
      setAssigning(prev => ({ ...prev, [userId]: false }))
    }
  }

  // ── Remove company ─────────────────────────────────────────────────────
  const handleRemove = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/admin/remove-company/${userId}`, {
        method:  'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Remove failed')
      flash(`✅ ${data.message}`)
      fetchUsers()
    } catch (e) {
      flash(e.message, 'error')
    }
  }

  // ── Make admin ─────────────────────────────────────────────────────────
  const handleMakeAdmin = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/admin/make-admin/${userId}`, {
        method:  'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      flash(`✅ ${data.message}`)
      fetchUsers()
    } catch (e) {
      flash(e.message, 'error')
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  const companyName = (id) => companies.find(c => c.id === id)?.name || '—'
  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-pink-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-xs text-gray-400 uppercase tracking-wider"

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-950 text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-gray-500 text-sm mt-1">Users manage करा, companies assign करा</p>
        </div>

        {/* Flash Message */}
        {msg.text && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium border ${
            msg.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            {msg.text}
          </div>
        )}

        <div className="max-w-5xl space-y-8">

          {/* ── Create User ── */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-pink-400 mb-5">➕ नवीन User बनवा</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Name</label>
                  <input
                    value={newUser.name}
                    onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
                    placeholder="Full Name" required className={inp}
                  />
                </div>
                <div>
                  <label className={lbl}>Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com" required className={inp}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••" required className={inp}
                  />
                </div>
                <div>
                  <label className={lbl}>Role</label>
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
                    className={inp + " cursor-pointer"} style={{ colorScheme: 'dark', backgroundColor: '#111' }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Company (optional)</label>
                  <select
                    value={newUser.company_id}
                    onChange={e => setNewUser(p => ({ ...p, company_id: e.target.value }))}
                    className={inp + " cursor-pointer"} style={{ colorScheme: 'dark', backgroundColor: '#111' }}
                  >
                    <option value="">— Select —</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <button
                type="submit" disabled={creating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-sm font-semibold hover:scale-105 transition disabled:opacity-50"
              >
                {creating ? 'Creating...' : '➕ Create User'}
              </button>
            </form>
          </div>

          {/* ── Users List ── */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-indigo-400 mb-5">
              👥 सगळे Users
              <span className="ml-2 text-xs text-gray-500 font-normal">({users.length} total)</span>
            </h2>

            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading...</div>
            ) : users.length === 0 ? (
              <div className="text-center text-gray-500 py-8">कोणताही user नाही</div>
            ) : (
              <div className="space-y-3">
                {users.map(u => (
                  <div key={u.id}
                    className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white text-sm">{u.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          u.role === 'admin'
                            ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {u.role}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{u.email}</div>
                      <div className="text-xs text-indigo-400 mt-0.5">
                        🏢 {u.company_id ? companyName(u.company_id) : 'No company assigned'}
                      </div>
                    </div>

                    {/* Assign Company */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <select
                        value={assignMap[u.id] || ''}
                        onChange={e => setAssignMap(prev => ({ ...prev, [u.id]: e.target.value }))}
                        className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none cursor-pointer"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="">— Company —</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>

                      <button
                        onClick={() => handleAssign(u.id)}
                        disabled={assigning[u.id]}
                        className="text-xs px-3 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30 transition disabled:opacity-50"
                      >
                        {assigning[u.id] ? '...' : 'Assign'}
                      </button>

                      {u.company_id && (
                        <button
                          onClick={() => handleRemove(u.id)}
                          className="text-xs px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                        >
                          Remove
                        </button>
                      )}

                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleMakeAdmin(u.id)}
                          className="text-xs px-3 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:bg-pink-500/20 transition"
                        >
                          Make Admin
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}

