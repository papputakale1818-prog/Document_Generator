import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState('')
  const [showPass, setShowPass]   = useState(false)
  const { login, loading }        = useAuth()
  const navigate                  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const success = await login(email, password)
    if (success) {
      navigate('/companies')
    } else {
      setError('Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-900 p-4">
      <div className="w-full max-w-md relative">

        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-3xl blur opacity-30"></div>

        {/* Card */}
        <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              HR
            </div>
            <h1 className="text-2xl text-white font-semibold mt-4">Welcome Back</h1>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="relative">
              <input
                type="email" required value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                className="peer w-full bg-transparent border border-gray-600 rounded-lg px-3 pt-5 pb-2 text-white focus:outline-none focus:border-pink-400"
              />
              <label className="absolute left-3 top-2 text-xs text-gray-400 peer-focus:text-pink-400 transition">
                Email Address
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} required value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                className="peer w-full bg-transparent border border-gray-600 rounded-lg px-3 pt-5 pb-2 pr-11 text-white focus:outline-none focus:border-pink-400"
              />
              <label className="absolute left-3 top-2 text-xs text-gray-400 peer-focus:text-pink-400 transition">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400 transition"
              >
                {showPass ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-medium relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  <span className="relative z-10">Login</span>
                  <span className="absolute left-[-100%] top-0 w-full h-full bg-white/20 transform skew-x-[-20deg] group-hover:left-[100%] transition-all duration-700"></span>
                </>
              )}
            </button>
          </form>

          {/* ✅ Forgot Password link — route बरोबर केला */}
          <p className="text-center text-gray-400 text-sm mt-6">
            <Link to="/forgot-password" className="text-pink-400 hover:underline">
              Forgot Password?
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}