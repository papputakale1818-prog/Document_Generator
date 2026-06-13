
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'

const MODULES = [
  { label: 'Offer Letter', path: '/dashboard/offer-letter', color: 'from-blue-500 to-indigo-600', desc: 'Generate offer letters for new hires' },
  { label: 'Offer Confirmation Letter', path: '/dashboard/offer-confirmation', color: 'from-violet-500 to-purple-600', desc: 'Confirm accepted job offers' },
  { label: 'Pay Slip', path: '/dashboard/pay-slip', color: 'from-emerald-500 to-teal-600', desc: 'Generate monthly salary slips' },
  { label: 'Relieving Letter', path: '/dashboard/relieving-letter', color: 'from-rose-500 to-pink-600', desc: 'Issue relieving letters on resignation' },
  { label: 'Experience Letter', path: '/dashboard/experience-letter', color: 'from-amber-500 to-orange-600', desc: 'Provide experience certificates' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedCompany, user } = useAuth()

  const isHome = location.pathname === '/dashboard'

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">

      <Sidebar />

      <main className="flex-1 overflow-auto animate-fadeIn">

        {!isHome && <Outlet />}

        {isHome && (
          <div className="p-8">
            <div className="mb-10">
              <h1 className="text-3xl font-bold">{selectedCompany?.name}</h1>
              <p className="text-gray-400 mt-1">
                Hello, <span className="text-white font-medium capitalize">{user?.name}</span> — select a module
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MODULES.map(mod => (
                <button
                  key={mod.path}
                  onClick={() => navigate(mod.path)}
                  className="relative group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-left shadow-md hover:shadow-xl card-hover"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:to-pink-500/10 transition"></div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white text-base">{mod.label}</h3>
                  <p className="text-gray-400 text-xs mt-1 group-hover:text-indigo-300 transition">{mod.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

      </main>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.7s ease-out; }
        .card-hover { transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
        .card-hover:hover { transform: translateY(-6px) scale(1.02); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  )
}
