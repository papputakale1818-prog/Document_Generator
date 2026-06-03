
// import { createContext, useContext, useState } from 'react'

// // ─── API URL ───────────────────────────────────────────────────────────────
// const API_URL = 'http://127.0.0.1:8000'

// const AuthContext = createContext(null)

// export function AuthProvider({ children }) {
//   const [user, setUser]                       = useState(null)
//   const [selectedCompany, setSelectedCompany] = useState(null)
//   const [loading, setLoading]                 = useState(false)

//   // ─── Login — FastAPI POST /auth/login ─────────────────────────────────────
//   const login = async (email, password) => {
//     setLoading(true)
//     try {
//       const formData = new URLSearchParams()
//       formData.append('username', email)
//       formData.append('password', password)

//       const res = await fetch(`${API_URL}/auth/login`, {
//         method:  'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body:    formData,
//       })

//       if (!res.ok) {
//         const err = await res.json()
//         throw new Error(err.detail || 'Invalid credentials')
//       }

//       const data = await res.json()
//       // data = { access_token, token_type, user: { id, name, email, mobile } }

//       setUser({
//         token:  data.access_token,
//         name:   data.user?.name   || email.split('@')[0],
//         email:  data.user?.email  || email,
//         mobile: data.user?.mobile || 'N/A',
//         id:     data.user?.id     || null,
//       })

//       localStorage.setItem('hr_token', data.access_token)
//       return true

//     } catch (err) {
//       console.error('Login error:', err.message)
//       return false
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ─── Register — FastAPI POST /auth/register ───────────────────────────────
//   const register = async (name, email, mobile, password) => {
//     setLoading(true)
//     try {
//       const res = await fetch(`${API_URL}/auth/register`, {
//         method:  'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body:    JSON.stringify({ name, email, mobile, password }),
//       })

//       if (!res.ok) {
//         const err = await res.json()
//         throw new Error(err.detail || 'Registration failed')
//       }

//       return true
//     } catch (err) {
//       console.error('Register error:', err.message)
//       return false
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ─── Logout ───────────────────────────────────────────────────────────────
//   const logout = () => {
//     setUser(null)
//     setSelectedCompany(null)
//     localStorage.removeItem('hr_token')
//   }

//   return (
//     <AuthContext.Provider value={{
//       user,
//       selectedCompany,
//       setSelectedCompany,
//       login,
//       register,
//       logout,
//       loading,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)

import { createContext, useContext, useState } from 'react'

const API_URL = 'http://127.0.0.1:8000'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]                       = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [loading, setLoading]                 = useState(false)

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    setLoading(true)
    try {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const res = await fetch(`${API_URL}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Invalid credentials')
      }

      const data = await res.json()

      // ← role पण store करतो
      setUser({
        token:  data.access_token,
        name:   data.user?.name   || email.split('@')[0],
        email:  data.user?.email  || email,
        mobile: data.user?.mobile || 'N/A',
        id:     data.user?.id     || null,
        role:   data.user?.role   || 'user',  // ← हे add केलं
      })

      localStorage.setItem('hr_token', data.access_token)
      return true

    } catch (err) {
      console.error('Login error:', err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = async (name, email, mobile, password) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, mobile, password }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Registration failed')
      }

      return true
    } catch (err) {
      console.error('Register error:', err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null)
    setSelectedCompany(null)
    localStorage.removeItem('hr_token')
  }

  return (
    <AuthContext.Provider value={{
      user,
      selectedCompany,
      setSelectedCompany,
      login,
      register,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)