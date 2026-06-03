
// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import softgridBg from '../assets/background.png'
// import uasBg from '../assets/UAS_background image_1.png'

// const API_URL = 'http://127.0.0.1:8000'

// const PALETTE = [
//   'from-indigo-500 to-indigo-700',
//   'from-fuchsia-500 to-purple-600',
//   'from-sky-500 to-cyan-600',
//   'from-emerald-500 to-teal-600',
//   'from-orange-500 to-amber-600',
// ]

// const BG_MAP = {
//   1: softgridBg,
//   2: uasBg,
// }

// export default function CompaniesPage() {
//   const [companies, setCompanies] = useState([])
//   const [loading,   setLoading]   = useState(true)
//   const [error,     setError]     = useState('')
//   const { setSelectedCompany, logout, user } = useAuth()
//   const navigate = useNavigate()

//   // ─── API वरून assigned companies fetch करा ───────────────────────────
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       setLoading(true)
//       setError('')
//       try {
//         const token = localStorage.getItem('hr_token')
//         if (!token) {
//           navigate('/login')
//           return
//         }
//         const res = await fetch(`${API_URL}/companies/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         if (!res.ok) throw new Error('Companies fetch failed')
//         const data = await res.json()

//         // Backend response मध्ये initials नसतील तर generate करा
//         const enriched = data.map((co, i) => ({
//           ...co,
//           initials: co.initials || getInitials(co.name),
//           color:    co.color    || PALETTE[i % PALETTE.length],
//           bgImage:  BG_MAP[co.id] || undefined,
//         }))
//         setCompanies(enriched)
//       } catch (e) {
//         setError('Companies load करता आल्या नाहीत')
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchCompanies()
//   }, [])

//   function getInitials(name) {
//     const words = name.trim().split(' ')
//     return words.length >= 2
//       ? (words[0][0] + words[1][0]).toUpperCase()
//       : name.substring(0, 2).toUpperCase()
//   }

//   const handleSelect = (company) => {
//     setSelectedCompany(company)
//     navigate('/dashboard')
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white animate-fadeIn">

//       {/* HEADER */}
//       <header className="backdrop-blur bg-white/5 border-b border-white/10 sticky top-0 z-40">
//         <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
//               <span className="text-white font-bold">HR</span>
//             </div>
//             <span className="text-xl font-semibold">HR Portal</span>
//           </div>
//           <div className="flex items-center gap-4">
//             <span className="text-sm text-gray-300">
//               Welcome, <span className="font-semibold capitalize">{user?.name}</span>
//             </span>
//             {user?.role === 'admin' && (
//               <button
//                 onClick={() => navigate('/users')}
//                 className="text-sm text-indigo-300 hover:text-white border border-indigo-500/40 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition hover:bg-indigo-500/10"
//               >
//                 👥 Users
//               </button>
//             )}
//             <button
//               onClick={() => { logout(); navigate('/login') }}
//               className="text-sm text-red-400 hover:text-red-500 transition hover:scale-105"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* MAIN */}
//       <main className="max-w-5xl mx-auto px-6 py-10">
//         <div className="flex items-center justify-between mb-10">
//           <div>
//             <h2 className="text-3xl font-bold">Select Company</h2>
//             <p className="text-gray-400 text-sm mt-1">Choose a company to continue</p>
//           </div>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="text-center py-24 text-gray-400">
//             <div className="text-4xl mb-4">⏳</div>
//             <p>Loading companies...</p>
//           </div>
//         )}

//         {/* Error */}
//         {error && (
//           <div className="text-center py-24 text-red-400">
//             <div className="text-4xl mb-4">⚠️</div>
//             <p>{error}</p>
//           </div>
//         )}

//         {/* No companies */}
//         {!loading && !error && companies.length === 0 && (
//           <div className="text-center py-24">
//             <div className="text-6xl mb-4">🏢</div>
//             <h3 className="text-xl font-semibold text-white mb-2">No Companies Assigned</h3>
//             <p className="text-gray-400 text-sm">Admin ने अजून कोणती company assign केली नाही.</p>
//           </div>
//         )}

//         {/* GRID */}
//         {!loading && !error && companies.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {companies.map((co, i) => (
//               <button
//                 key={co.id}
//                 onClick={() => handleSelect(co)}
//                 className="relative group card-hover bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-md hover:shadow-xl"
//               >
//                 <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:to-pink-500/10 transition"></div>
//                 <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${co.color || PALETTE[i % PALETTE.length]} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition`}>
//                   <span className="text-white font-bold">{co.initials}</span>
//                 </div>
//                 <h3 className="font-semibold text-white text-left">{co.name}</h3>
//                 <p className="text-xs text-gray-400 mt-1 group-hover:text-indigo-300 transition text-left">
//                   Open dashboard →
//                 </p>
//               </button>
//             ))}
//           </div>
//         )}
//       </main>

//       <style>{`
//         .animate-fadeIn { animation: fadeIn 0.7s ease-out; }
//         .card-hover { transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
//         .card-hover:hover { transform: translateY(-6px) scale(1.02); }
//         @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
//       `}</style>
//     </div>
//   )
// }


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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

const BG_MAP = {
  1: softgridBg,
  2: uasBg,
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const { setSelectedCompany, logout, user } = useAuth()
  const navigate = useNavigate()

  // ─── API वरून assigned companies fetch करा ───────────────────────────
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      setError('')
      try {
        const token = localStorage.getItem('hr_token')
        if (!token) {
          navigate('/login')
          return
        }
        const res = await fetch(`${API_URL}/companies/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Companies fetch failed')
        const data = await res.json()

        // Backend response मध्ये initials नसतील तर generate करा
        const enriched = data.map((co, i) => ({
          ...co,
          initials: co.initials || getInitials(co.name),
          color:    co.color    || PALETTE[i % PALETTE.length],
          bgImage:  BG_MAP[co.id] || undefined,
        }))
        setCompanies(enriched)
      } catch (e) {
        setError('Companies load करता आल्या नाहीत')
      } finally {
        setLoading(false)
      }
    }
    fetchCompanies()
  }, [])

  function getInitials(name) {
    const words = name.trim().split(' ')
    return words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase()
  }

  const handleSelect = (company) => {
    setSelectedCompany(company)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white animate-fadeIn">

      {/* HEADER */}
      <header className="backdrop-blur bg-white/5 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">HR</span>
            </div>
            <span className="text-xl font-semibold">HR Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              Welcome, <span className="font-semibold capitalize">{user?.name}</span>
            </span>

            {user?.role === 'admin' && (
              <>
                {/* 🔔 Notifications Icon */}
                <button
                  onClick={() => navigate('/notifications')}
                  className="relative text-gray-300 hover:text-white transition hover:scale-110"
                  title="Notifications"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {/* Red dot — unread notifications */}
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
                </button>

                {/* 👥 Users Button */}
                <button
                  onClick={() => navigate('/users')}
                  className="text-sm text-indigo-300 hover:text-white border border-indigo-500/40 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition hover:bg-indigo-500/10"
                >
                  👥 Users
                </button>
              </>
            )}

            <button
              onClick={() => { logout(); navigate('/login') }}
              className="text-sm text-red-400 hover:text-red-500 transition hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">Select Company</h2>
            <p className="text-gray-400 text-sm mt-1">Choose a company to continue</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-24 text-gray-400">
            <div className="text-4xl mb-4">⏳</div>
            <p>Loading companies...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-24 text-red-400">
            <div className="text-4xl mb-4">⚠️</div>
            <p>{error}</p>
          </div>
        )}

        {/* No companies */}
        {!loading && !error && companies.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Companies Assigned</h3>
            <p className="text-gray-400 text-sm">Admin ने अजून कोणती company assign केली नाही.</p>
          </div>
        )}

        {/* GRID */}
        {!loading && !error && companies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((co, i) => (
              <button
                key={co.id}
                onClick={() => handleSelect(co)}
                className="relative group card-hover bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-md hover:shadow-xl"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:to-pink-500/10 transition"></div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${co.color || PALETTE[i % PALETTE.length]} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition`}>
                  <span className="text-white font-bold">{co.initials}</span>
                </div>
                <h3 className="font-semibold text-white text-left">{co.name}</h3>
                <p className="text-xs text-gray-400 mt-1 group-hover:text-indigo-300 transition text-left">
                  Open dashboard →
                </p>
              </button>
            ))}
          </div>
        )}
      </main>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.7s ease-out; }
        .card-hover { transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
        .card-hover:hover { transform: translateY(-6px) scale(1.02); }
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}