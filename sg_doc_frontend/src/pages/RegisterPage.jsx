// import { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'

// export default function RegisterPage() {
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [mobile, setMobile] = useState('') // ✅ NEW
//   const [password, setPassword] = useState('')
//   const [confirm, setConfirm] = useState('')
//   const [error, setError] = useState('')
//   const { register } = useAuth()
//   const navigate = useNavigate()

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     setError('')

//     if (!/^\d{10}$/.test(mobile))
//       return setError('Enter valid 10-digit mobile number')

//     if (password !== confirm)
//       return setError('Passwords do not match.')

//     if (password.length < 6)
//       return setError('Password must be at least 6 characters.')

//     if (register(name, email, mobile, password)) // ✅ UPDATED
//       navigate('/companies')
//     else
//       setError('Registration failed.')
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-900 p-4">
      
//       <div className="w-full max-w-md relative">
        
//         {/* Glow */}
//         <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-3xl blur opacity-30"></div>

//         {/* Card */}
//         <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

//           {/* Header */}
//           <div className="text-center mb-6">
//             <div className="w-14 h-14 mx-auto bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">
//               HR
//             </div>
//             <h1 className="text-2xl text-white font-semibold mt-4">Create Account</h1>
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="text-red-400 text-sm mb-4">{error}</div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">

//             {/* Name */}
//             <div className="relative">
//               <input
//                 type="text"
//                 required
//                 value={name}
//                 onChange={e => setName(e.target.value)}
//                 className="peer w-full bg-transparent border border-gray-600 rounded-lg px-3 pt-5 pb-2 text-white focus:outline-none focus:border-pink-400"
//               />
//               <label className="absolute left-3 top-2 text-xs text-gray-400 peer-focus:text-pink-400">
//                 Full Name
//               </label>
//             </div>

//             {/* Email */}
//             <div className="relative">
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 className="peer w-full bg-transparent border border-gray-600 rounded-lg px-3 pt-5 pb-2 text-white focus:outline-none focus:border-pink-400"
//               />
//               <label className="absolute left-3 top-2 text-xs text-gray-400 peer-focus:text-pink-400">
//                 Email Address
//               </label>
//             </div>

//             {/* ✅ Mobile Number (NEW) */}
//             <div className="relative">
//               <input
//                 type="tel"
//                 required
//                 value={mobile}
//                 onChange={e => setMobile(e.target.value)}
//                 className="peer w-full bg-transparent border border-gray-600 rounded-lg px-3 pt-5 pb-2 text-white focus:outline-none focus:border-pink-400"
//               />
//               <label className="absolute left-3 top-2 text-xs text-gray-400 peer-focus:text-pink-400">
//                 Mobile Number
//               </label>
//             </div>

//             {/* Password */}
//             <div className="relative">
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 className="peer w-full bg-transparent border border-gray-600 rounded-lg px-3 pt-5 pb-2 text-white focus:outline-none focus:border-pink-400"
//               />
//               <label className="absolute left-3 top-2 text-xs text-gray-400 peer-focus:text-pink-400">
//                 Password
//               </label>
//             </div>

//             {/* Confirm */}
//             <div className="relative">
//               <input
//                 type="password"
//                 required
//                 value={confirm}
//                 onChange={e => setConfirm(e.target.value)}
//                 className="peer w-full bg-transparent border border-gray-600 rounded-lg px-3 pt-5 pb-2 text-white focus:outline-none focus:border-pink-400"
//               />
//               <label className="absolute left-3 top-2 text-xs text-gray-400 peer-focus:text-pink-400">
//                 Confirm Password
//               </label>
//             </div>

//             {/* Button */}
//             <button
//               type="submit"
//               className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-medium relative overflow-hidden group"
//             >
//               <span className="relative z-10">Create Account</span>
//               <span className="absolute left-[-100%] top-0 w-full h-full bg-white/20 transform skew-x-[-20deg] group-hover:left-[100%] transition-all duration-700"></span>
//             </button>

//           </form>

//           {/* Footer */}
//           <p className="text-center text-gray-400 text-sm mt-6">
//             Already have an account?{' '}
//             <Link to="/login" className="text-pink-400 hover:underline">
//               Login
//             </Link>
//           </p>

//         </div>
//       </div>
//     </div>
//   )
// }