import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://127.0.0.1:8000'

// ── 5 Companies List ────────────────────────────────────────────────────────
const ALL_COMPANIES = [
  { id: 1, name: 'SoftGrid Info Pvt. Ltd.',               code: 'SG' },
  { id: 2, name: 'UAS IT Consultancy Services Pvt. Ltd.', code: 'UA' },
  { id: 3, name: 'Iconsteam Technologies Pvt. Ltd.',       code: 'IC' },
  { id: 4, name: 'CyberTrident Solutions Pvt. Ltd.',       code: 'CT' },
  { id: 5, name: 'BitsSparrow Digital Pvt. Ltd.',          code: 'BS' },
]

const COMPANY_COLORS = {
  1: { bg: 'bg-green-500/20',  text: 'text-green-300',  border: 'border-green-500/30',  dot: 'bg-green-400'  },
  2: { bg: 'bg-blue-500/20',   text: 'text-blue-300',   border: 'border-blue-500/30',   dot: 'bg-blue-400'   },
  3: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30', dot: 'bg-purple-400' },
  4: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30', dot: 'bg-orange-400' },
  5: { bg: 'bg-pink-500/20',   text: 'text-pink-300',   border: 'border-pink-500/30',   dot: 'bg-pink-400'   },
}

// ── Spinner ──────────────────────────────────────────────────────────────────
function Spinner({ cls = 'h-6 w-6 text-indigo-400' }) {
  return (
    <svg className={`animate-spin ${cls}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  )
}

// ── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmModal({ user: target, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
        <div className="text-4xl mb-3 text-center">🗑️</div>
        <h3 className="text-lg font-semibold text-white text-center mb-1">Delete User?</h3>
        <p className="text-sm text-gray-400 text-center mb-6">
          <span className="text-white font-medium capitalize">{target?.name}</span> ला delete करायचं आहे का?
          हे action undo होणार नाही.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Edit User Modal ──────────────────────────────────────────────────────────
function EditModal({ target, onSave, onCancel, loading, error }) {
  const [form, setForm] = useState({
    name:       target?.name     || '',
    email:      target?.email    || '',
    mobile:     target?.mobile   || '',
    department: target?.department || '',
    designation:target?.designation || '',
    role:       target?.role     || 'user',
    password:   '',
  })

  const inp = "w-full mt-1 px-4 py-2.5 rounded-lg bg-slate-700/60 border border-gray-600 focus:border-indigo-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-xs text-gray-400"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-indigo-400">✏️ Edit User</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-white transition text-lg">✕</button>
        </div>

        {error && (
          <div className="mb-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Full Name</label>
              <input className={inp} value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Full name" />
            </div>
            <div>
              <label className={lbl}>Email</label>
              <input type="email" className={inp} value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="Email" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Mobile</label>
              <input className={inp} value={form.mobile}
                onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))}
                placeholder="Mobile number" />
            </div>
            <div>
              <label className={lbl}>Role</label>
              <select className={inp + ' cursor-pointer'} value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                style={{ colorScheme: 'dark', backgroundColor: '#1e293b' }}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Department</label>
              <input className={inp} value={form.department}
                onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                placeholder="e.g. Engineering" />
            </div>
            <div>
              <label className={lbl}>Designation</label>
              <input className={inp} value={form.designation}
                onChange={e => setForm(p => ({ ...p, designation: e.target.value }))}
                placeholder="e.g. Sr. Developer" />
            </div>
          </div>

          <div>
            <label className={lbl}>New Password <span className="text-gray-600">()</span></label>
            <input type="password" className={inp} value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="Leave blank to keep current" />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm transition">
            Cancel
          </button>
          <button onClick={() => onSave(form)} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Spinner cls="h-4 w-4 text-white" /> Saving...</> : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Company Assign Modal ─────────────────────────────────────────────────────
function CompanyModal({ target, currentIds, onSave, onCancel, loading, error }) {
  const [pendingIds, setPendingIds] = useState(currentIds || [])

  const toggle = (id) =>
    setPendingIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-emerald-400">🏢 Companies Update करा</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-white transition text-lg">✕</button>
        </div>
        <p className="text-xs text-gray-500 mb-5">
          User: <span className="text-white capitalize">{target?.name}</span>
        </p>

        {error && (
          <div className="mb-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-2 mb-5">
          {ALL_COMPANIES.map(co => {
            const color    = COMPANY_COLORS[co.id]
            const isActive = pendingIds.includes(co.id)
            return (
              <label key={co.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all select-none ${
                  isActive
                    ? `${color.bg} ${color.border} ring-1 ${color.border}`
                    : 'bg-white/3 border-white/10 hover:bg-white/6'
                }`}
                onClick={() => toggle(co.id)}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive ? 'bg-indigo-500 border-indigo-500' : 'border-gray-500 bg-transparent'
                }`}>
                  {isActive && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${color.bg} ${color.text} border ${color.border}`}>
                  {co.code}
                </div>
                <span className={`text-sm flex-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>{co.name}</span>
                {isActive && <span className={`text-xs px-2 py-0.5 rounded-full ${color.bg} ${color.text} border ${color.border}`}>✓</span>}
              </label>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm transition">
            Cancel
          </button>
          <button onClick={() => onSave(pendingIds)} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Spinner cls="h-4 w-4 text-white" /> Saving...</> : '💾 Update Companies'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════════════
export default function UsersPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('list')

  // ── User List State ──────────────────────────────────────────────────────
  const [users, setUsers]             = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError]     = useState('')

  // ── Per-user assigned companies cache { [userId]: [companyIds] } ─────────
  const [userCompanies, setUserCompanies] = useState({})

  // ── Edit Modal State ─────────────────────────────────────────────────────
  const [editTarget,   setEditTarget]   = useState(null)
  const [editLoading,  setEditLoading]  = useState(false)
  const [editError,    setEditError]    = useState('')

  // ── Delete Modal State ───────────────────────────────────────────────────
  const [deleteTarget,  setDeleteTarget]  = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ── Company Modal State ──────────────────────────────────────────────────
  const [companyTarget,  setCompanyTarget]  = useState(null)
  const [companyLoading, setCompanyLoading] = useState(false)
  const [companyError,   setCompanyError]   = useState('')

  // ── Add User State ───────────────────────────────────────────────────────
  const [addForm, setAddForm] = useState({
    name: '', email: '', mobile: '', password: '',
    department: '', designation: '', role: 'user',
  })
  const [addLoading, setAddLoading] = useState(false)
  const [addError,   setAddError]   = useState('')
  const [addSuccess, setAddSuccess] = useState('')

  // ── Assign Companies State (TAB) ─────────────────────────────────────────
  const [selectedUser,        setSelectedUser]        = useState(null)
  const [assignedIds,         setAssignedIds]         = useState([])
  const [pendingIds,          setPendingIds]          = useState([])
  const [assignLoading,       setAssignLoading]       = useState(false)
  const [assignFetchLoading,  setAssignFetchLoading]  = useState(false)
  const [assignError,         setAssignError]         = useState('')
  const [assignSuccess,       setAssignSuccess]       = useState('')

  // ── Token helper ─────────────────────────────────────────────────────────
  const token = () => localStorage.getItem('hr_token')

  // ── Fetch Users ──────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    setListLoading(true)
    setListError('')
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token()}` }
      })
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      setUsers(data)
      // fetch assigned companies for every user in parallel
      fetchAllUserCompanies(data)
    } catch (err) {
      setListError(err.message)
    } finally {
      setListLoading(false)
    }
  }

  // ── Fetch companies for ALL users (for the list view badges) ─────────────
  const fetchAllUserCompanies = async (userList) => {
    const results = await Promise.allSettled(
      userList.map(u =>
        fetch(`${API_URL}/admin/users/${u.id}/companies`, {
          headers: { Authorization: `Bearer ${token()}` }
        }).then(r => r.ok ? r.json() : [])
      )
    )
    const map = {}
    userList.forEach((u, i) => {
      const val = results[i].status === 'fulfilled' ? results[i].value : []
      map[u.id] = Array.isArray(val)
        ? val.map(c => typeof c === 'object' ? c.id : c)
        : []
    })
    setUserCompanies(map)
  }

  useEffect(() => {
    if (activeTab === 'list' || activeTab === 'assign') fetchUsers()
  }, [activeTab])

  // ── Delete User ───────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`${API_URL}/admin/users/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` }
      })
      if (!res.ok) throw new Error('Delete failed')
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  // ── Edit User Save ────────────────────────────────────────────────────────
  const handleEditSave = async (form) => {
    setEditLoading(true)
    setEditError('')
    try {
      const payload = { ...form }
      if (!payload.password) delete payload.password
      const res = await fetch(`${API_URL}/admin/users/${editTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Update failed')
      }
      const updated = await res.json()
      setUsers(prev => prev.map(u => u.id === editTarget.id ? { ...u, ...updated } : u))
      setEditTarget(null)
    } catch (err) {
      setEditError(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  // ── Company Modal Save ────────────────────────────────────────────────────
  const handleCompanySave = async (ids) => {
    setCompanyLoading(true)
    setCompanyError('')
    try {
      const res = await fetch(`${API_URL}/admin/users/${companyTarget.id}/companies`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ company_ids: ids }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to update companies')
      }
      setUserCompanies(prev => ({ ...prev, [companyTarget.id]: ids }))
      setCompanyTarget(null)
    } catch (err) {
      setCompanyError(err.message)
    } finally {
      setCompanyLoading(false)
    }
  }

  // ── Assign Tab — fetch companies ──────────────────────────────────────────
  const fetchAssignedCompanies = async (userId) => {
    setAssignFetchLoading(true)
    setAssignError('')
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/companies`, {
        headers: { Authorization: `Bearer ${token()}` }
      })
      if (!res.ok) throw new Error('Failed to fetch assigned companies')
      const data = await res.json()
      const ids = Array.isArray(data) ? data.map(c => typeof c === 'object' ? c.id : c) : []
      setAssignedIds(ids)
      setPendingIds(ids)
    } catch (err) {
      setAssignError(err.message)
      setAssignedIds([])
      setPendingIds([])
    } finally {
      setAssignFetchLoading(false)
    }
  }

  const handleSelectUser = (u) => {
    setSelectedUser(u)
    setAssignSuccess('')
    setAssignError('')
    fetchAssignedCompanies(u.id)
  }

  const toggleCompany = (id) =>
    setPendingIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleSaveAssign = async () => {
    if (!selectedUser) return
    setAssignLoading(true)
    setAssignError('')
    setAssignSuccess('')
    try {
      const res = await fetch(`${API_URL}/admin/users/${selectedUser.id}/companies`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ company_ids: pendingIds }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to save assignment')
      }
      setAssignedIds(pendingIds)
      setUserCompanies(prev => ({ ...prev, [selectedUser.id]: pendingIds }))
      setAssignSuccess(`✅ Companies assigned to ${selectedUser.name} successfully!`)
    } catch (err) {
      setAssignError(err.message)
    } finally {
      setAssignLoading(false)
    }
  }

  // ── Add User Submit ───────────────────────────────────────────────────────
  const handleAddUser = async (e) => {
    e.preventDefault()
    setAddLoading(true)
    setAddError('')
    setAddSuccess('')
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(addForm),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to add user')
      }
      setAddSuccess('✅ User added successfully!')
      setAddForm({ name: '', email: '', mobile: '', password: '', department: '', designation: '', role: 'user' })
      // refresh list
      fetchUsers()
    } catch (err) {
      setAddError(err.message)
    } finally {
      setAddLoading(false)
    }
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  const inp = "w-full mt-1 px-4 py-2.5 rounded-lg bg-transparent border border-gray-600 focus:border-indigo-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  const tabs = [
    { key: 'list',    label: '👥 User List'        },
    { key: 'assign',  label: '🏢 Assign Companies' },
    { key: 'add',     label: '➕ Add User'          },
    { key: 'profile', label: '👤 My Profile'       },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">

      {/* ── Modals ── */}
      {deleteTarget && (
        <ConfirmModal
          user={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {editTarget && (
        <EditModal
          target={editTarget}
          onSave={handleEditSave}
          onCancel={() => { setEditTarget(null); setEditError('') }}
          loading={editLoading}
          error={editError}
        />
      )}
      {companyTarget && (
        <CompanyModal
          target={companyTarget}
          currentIds={userCompanies[companyTarget.id] || []}
          onSave={handleCompanySave}
          onCancel={() => { setCompanyTarget(null); setCompanyError('') }}
          loading={companyLoading}
          error={companyError}
        />
      )}

      {/* ── HEADER ── */}
      <header className="backdrop-blur bg-white/5 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/companies')} className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">HR</span>
              </div>
              <span className="text-xl font-semibold">HR Portal</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              Welcome, <span className="font-semibold capitalize">{user?.name}</span>
            </span>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="text-sm text-red-400 hover:text-red-500 transition hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <button onClick={() => navigate('/companies')} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-3 transition">
            ← Back to Companies
          </button>
          <h2 className="text-3xl font-bold">User Management</h2>
          <p className="text-gray-400 text-sm mt-1">Manage users, assign companies, add new members</p>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 mb-8 bg-white/5 rounded-xl p-1 border border-white/10">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1 — User List                                                 */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'list' && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-indigo-400">
                All Users <span className="text-gray-500 font-normal text-sm ml-1">({users.length})</span>
              </h3>
              <button onClick={fetchUsers} className="text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition">
                🔄 Refresh
              </button>
            </div>

            {listLoading && <div className="flex justify-center py-10"><Spinner /></div>}

            {listError && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                ⚠️ {listError}
              </div>
            )}

            {!listLoading && !listError && users.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">No users found.</p>
            )}

            {!listLoading && users.length > 0 && (
              <div className="space-y-3">
                {users.map((u, i) => {
                  const companyIds = userCompanies[u.id] || []
                  const assignedCos = ALL_COMPANIES.filter(c => companyIds.includes(c.id))
                  return (
                    <div key={u.id}
                      className="bg-white/3 border border-white/8 rounded-xl p-4 hover:bg-white/5 transition">
                      <div className="flex items-start justify-between gap-4">

                        {/* Left: Avatar + Info */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-white capitalize">{u.name}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                u.role === 'admin'
                                  ? 'bg-indigo-500/20 text-indigo-300'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {u.role || 'user'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">{u.email}</div>
                            {(u.mobile || u.department || u.designation) && (
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                                {u.mobile     && <span className="text-xs text-gray-500">📱 {u.mobile}</span>}
                                {u.department && <span className="text-xs text-gray-500">🏷️ {u.department}</span>}
                                {u.designation && <span className="text-xs text-gray-500">💼 {u.designation}</span>}
                              </div>
                            )}
                            {/* Assigned Companies Badges */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {assignedCos.length === 0 ? (
                                <span className="text-xs text-gray-600 italic">No companies assigned</span>
                              ) : (
                                assignedCos.map(co => {
                                  const color = COMPANY_COLORS[co.id]
                                  return (
                                    <span key={co.id}
                                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${color.bg} ${color.text} border ${color.border}`}>
                                      {co.code} — {co.name}
                                    </span>
                                  )
                                })
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setCompanyTarget(u)}
                            className="text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/50 px-2.5 py-1.5 rounded-lg transition"
                            title="Update Companies"
                          >
                            🏢
                          </button>
                          <button
                            onClick={() => { setEditError(''); setEditTarget(u) }}
                            className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-400/50 px-2.5 py-1.5 rounded-lg transition"
                            title="Edit User"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 px-2.5 py-1.5 rounded-lg transition"
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2 — Assign Companies                                          */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'assign' && (
          <div className="space-y-5">
            {/* Step 1 */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-semibold text-indigo-400 mb-4">Step 1 — User Select </h3>
              {listLoading ? (
                <div className="flex justify-center py-6"><Spinner /></div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {users.map(u => (
                    <button key={u.id} onClick={() => handleSelectUser(u)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                        selectedUser?.id === u.id
                          ? 'bg-indigo-500/20 border-indigo-500/50 ring-1 ring-indigo-500/40'
                          : 'bg-white/3 border-white/10 hover:bg-white/8 hover:border-white/20'
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white capitalize">{u.name}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-gray-500/20 text-gray-400'
                        }`}>{u.role || 'user'}</span>
                        {selectedUser?.id === u.id && <span className="w-2 h-2 bg-indigo-400 rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2 */}
            {selectedUser && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-semibold text-emerald-400">Step 2 — Companies Assign </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: <span className="text-white font-medium capitalize">{selectedUser.name}</span>
                    </p>
                  </div>
                  {assignFetchLoading && <Spinner cls="h-5 w-5 text-indigo-400" />}
                </div>

                {assignError   && <div className="mb-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">⚠️ {assignError}</div>}
                {assignSuccess && <div className="mb-4 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">{assignSuccess}</div>}

                <div className="space-y-3 mb-6">
                  {ALL_COMPANIES.map(co => {
                    const color    = COMPANY_COLORS[co.id]
                    const isActive = pendingIds.includes(co.id)
                    return (
                      <label key={co.id}
                        className={`flex items-center gap-4 px-4 py-4 rounded-xl border cursor-pointer transition-all select-none ${
                          isActive
                            ? `${color.bg} ${color.border} ring-1 ${color.border}`
                            : 'bg-white/3 border-white/10 hover:bg-white/6 hover:border-white/20'
                        }`}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isActive ? 'bg-indigo-500 border-indigo-500' : 'border-gray-500 bg-transparent'
                        }`} onClick={() => toggleCompany(co.id)}>
                          {isActive && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${color.bg} ${color.text} border ${color.border}`}
                          onClick={() => toggleCompany(co.id)}>{co.code}</div>
                        <div className="flex-1 min-w-0" onClick={() => toggleCompany(co.id)}>
                          <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>{co.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">ID: <span className="font-mono text-gray-400">{co.id}</span></div>
                        </div>
                        <div className="flex-shrink-0">
                          {isActive
                            ? <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${color.bg} ${color.text} border ${color.border}`}>✓ Assigned</span>
                            : <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">Not Assigned</span>
                          }
                        </div>
                      </label>
                    )
                  })}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-5">
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Selected Companies</div>
                  {pendingIds.length === 0
                    ? <p className="text-xs text-gray-600 italic"> not company select</p>
                    : (
                      <div className="flex flex-wrap gap-2">
                        {pendingIds.sort().map(id => {
                          const co = ALL_COMPANIES.find(c => c.id === id)
                          const color = COMPANY_COLORS[id]
                          return co ? (
                            <span key={id} className={`text-xs px-2.5 py-1 rounded-full font-medium ${color.bg} ${color.text} border ${color.border}`}>
                              {co.code} — {co.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    )
                  }
                </div>

                <button onClick={handleSaveAssign} disabled={assignLoading || assignFetchLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-semibold text-white text-sm shadow-lg hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2">
                  {assignLoading
                    ? <><Spinner cls="h-4 w-4 text-white" /> Saving...</>
                    : `💾 Save — ${selectedUser.name}  Companies Assign `
                  }
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3 — Add User                                                  */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'add' && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h3 className="text-base font-semibold text-emerald-400 mb-6">➕ Add New User</h3>

            {addError   && <div className="mb-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">⚠️ {addError}</div>}
            {addSuccess && <div className="mb-4 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">{addSuccess}</div>}

            <form onSubmit={handleAddUser} className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Full Name <span className="text-red-400">*</span></label>
                  <input name="name" value={addForm.name} required
                    onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Rajendra Takale" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Email <span className="text-red-400">*</span></label>
                  <input type="email" name="email" value={addForm.email} required
                    onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="e.g. user@softgrid.in" className={inp} />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Mobile</label>
                  <input name="mobile" value={addForm.mobile}
                    onChange={e => setAddForm(p => ({ ...p, mobile: e.target.value }))}
                    placeholder="e.g. 9876543210" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Role</label>
                  <select name="role" value={addForm.role}
                    onChange={e => setAddForm(p => ({ ...p, role: e.target.value }))}
                    className={inp + ' cursor-pointer'}
                    style={{ colorScheme: 'dark', backgroundColor: '#1e293b' }}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Row 3 — new fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Department</label>
                  <input name="department" value={addForm.department}
                    onChange={e => setAddForm(p => ({ ...p, department: e.target.value }))}
                    placeholder="e.g. Engineering" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Designation</label>
                  <input name="designation" value={addForm.designation}
                    onChange={e => setAddForm(p => ({ ...p, designation: e.target.value }))}
                    placeholder="e.g. Sr. Developer" className={inp} />
                </div>
              </div>

              {/* Row 4 */}
              <div>
                <label className={lbl}>Password <span className="text-red-400">*</span></label>
                <input type="password" name="password" value={addForm.password} required
                  onChange={e => setAddForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Set a password" className={inp} />
              </div>

              <button type="submit" disabled={addLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 font-semibold text-white text-sm shadow-lg hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2 flex items-center justify-center gap-2">
                {addLoading ? <><Spinner cls="h-4 w-4 text-white" /> Adding...</> : '➕ Add User'}
              </button>
            </form>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* TAB 4 — My Profile                                                */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h3 className="text-base font-semibold text-cyan-400 mb-6">👤 My Profile</h3>
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="text-xl font-bold text-white capitalize">{user?.name}</div>
                <div className="text-sm text-gray-400">{user?.email}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                  user?.role === 'admin' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-gray-500/20 text-gray-300'
                }`}>{user?.role || 'user'}</span>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Full Name',   value: user?.name        },
                { label: 'Email',       value: user?.email       },
                { label: 'Mobile',      value: user?.mobile || '—' },
                { label: 'Department',  value: user?.department || '—' },
                { label: 'Designation', value: user?.designation || '—' },
                { label: 'Role',        value: user?.role  || 'user' },
                { label: 'User ID',     value: user?.id    || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-sm text-gray-400">{label}</span>
                  <span className="text-sm text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}