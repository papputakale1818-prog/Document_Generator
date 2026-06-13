
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileDropdown from './ProfileDropdown'

const NAV = [
  { label: 'Add Employee',       path: '/dashboard/add-employee',       icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
  { label: 'Offer Letter',       path: '/dashboard/offer-letter',       icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Offer Confirmation', path: '/dashboard/offer-confirmation', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { label: 'Pay Slip',           path: '/dashboard/pay-slip',           icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { label: 'Appraisal Letter',   path: '/dashboard/salary-appraisal',  icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { label: 'Relieving Letter',   path: '/dashboard/relieving-letter',   icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' },
  { label: 'Experience Letter',  path: '/dashboard/experience-letter',  icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { label: 'My Documents',       path: '/my-documents',                 icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M10 12a1 1 0 100 2h4a1 1 0 100-2h-4z' },
]

export default function Sidebar() {
  const { selectedCompany } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/10 flex flex-col">

      {/* ── HEADER ── */}
      <div className="px-6 py-6 border-b border-white/10">

        {/* Logo + Title + ProfileDropdown — same row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white font-bold text-sm">HR</span>
          </div>
          <span className="text-lg font-semibold text-white flex-1">HR Portal</span>
          {/* Profile icon right next to HR Portal text */}
          <ProfileDropdown />
        </div>

        {/* Switch Company */}
        {selectedCompany && (
          <button
            onClick={() => navigate('/companies')}
            className="w-full flex items-center gap-2 text-white/80 hover:text-white text-xs font-medium py-1.5 px-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Switch Company
          </button>
        )}

        {/* Fallback if no company selected */}
        {!selectedCompany && (
          <button
            onClick={() => navigate('/companies')}
            className="w-full flex items-center gap-2 text-gray-400 hover:text-white text-sm py-2 px-3 rounded-xl hover:bg-white/10 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Select Company
          </button>
        )}
      </div>

      {/* ── NAV ── */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest px-2 mb-3">
          Documents
        </p>

        {NAV.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-[1.02]'
                : 'text-gray-300 hover:bg-white/10 hover:text-white hover:scale-[1.02]'
              }`
            }
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>

    </aside>
  )
}