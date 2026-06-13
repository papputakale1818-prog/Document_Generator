import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://127.0.0.1:8000'

export default function ForgotPassword() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '', oldPassword: '', newPassword: '', confirmPassword: '',
  })
  const [showOld,     setShowOld]     = useState(false)
  const [showNew,     setShowNew]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [done,        setDone]        = useState(false)

  const set = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async () => {
    const { email, oldPassword, newPassword, confirmPassword } = form

    if (!email)                          { setError('Please enter your email');                        return }
    if (!oldPassword)                    { setError('Please enter your old password');                 return }
    if (!newPassword)                    { setError('Please enter a new password');                    return }
    if (newPassword.length < 6)          { setError('New password must be at least 6 characters');    return }
    if (newPassword === oldPassword)     { setError('New password must be different from old password'); return }
    if (newPassword !== confirmPassword) { setError('New password and confirm password do not match'); return }

    setLoading(true)
    try {
      const res  = await fetch(`${API_URL}/auth/change-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          email,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Something went wrong')
      setDone(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const page = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0b0f1a 0%,#111827 60%,#0f172a 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Segoe UI', Arial, sans-serif", padding: 24,
  }
  const card = {
    width: '100%', maxWidth: 420,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid #1e293b',
    borderRadius: 24, padding: '36px 32px',
    position: 'relative', overflow: 'hidden',
  }
  const accent = {
    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
    background: 'linear-gradient(90deg,#6366f1,#ec4899,#f59e0b)',
  }
  const lbl = {
    display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8',
    letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 6,
  }
  const inp = {
    background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
    padding: '11px 14px', color: '#f1f5f9', fontSize: 13, outline: 'none',
    fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  }
  const eyeBtn = {
    position: 'absolute', right: 12, top: '50%',
    transform: 'translateY(-50%)',
    background: 'none', border: 'none',
    cursor: 'pointer', color: '#475569', fontSize: 14,
  }
  const submitBtn = (disabled) => ({
    width: '100%', padding: '12px', borderRadius: 12,
    background: disabled ? '#1e293b' : 'linear-gradient(135deg,#6366f1,#ec4899)',
    border: 'none', color: disabled ? '#475569' : '#fff',
    fontSize: 14, fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    marginTop: 8, transition: 'opacity 0.2s',
  })
  const backBtn = {
    background: 'transparent', border: 'none', color: '#64748b',
    fontSize: 12, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 4, margin: '16px auto 0',
  }

  const isDisabled = loading ||
    !form.email || !form.oldPassword || !form.newPassword || !form.confirmPassword ||
    form.newPassword !== form.confirmPassword ||
    form.newPassword === form.oldPassword

  if (done) return (
    <div style={page}>
      <div style={card}>
        <div style={accent} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Password Changed!</h2>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24 }}>
            Your password has been changed successfully.<br />Please login with your new password.
          </p>
          <button style={submitBtn(false)} onClick={() => navigate('/login')}>
            Go to Login →
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={page}>
      <div style={card}>
        <div style={accent} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: '0 auto 12px',
            background: 'linear-gradient(135deg,#6366f1,#ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>🔐</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px' }}>
            Change Password
          </h2>
          <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>HR Portal</p>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Email Address</label>
          <input
            style={inp} type="email" name="email"
            placeholder="your@email.com"
            value={form.email} onChange={set}
          />
        </div>

        {/* Old Password */}
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Old Password</label>
          <div style={{ position: 'relative' }}>
            <input
              style={inp} type={showOld ? 'text' : 'password'} name="oldPassword"
              placeholder="Enter current password"
              value={form.oldPassword} onChange={set}
            />
            <button style={eyeBtn} onClick={() => setShowOld(p => !p)} type="button">
              {showOld ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1e293b', margin: '16px 0' }} />

        {/* New Password */}
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>New Password</label>
          <div style={{ position: 'relative' }}>
            <input
              style={{
                ...inp,
                borderColor: form.newPassword && form.newPassword === form.oldPassword
                  ? '#ef4444' : '#1e293b',
              }}
              type={showNew ? 'text' : 'password'} name="newPassword"
              placeholder="Minimum 6 characters"
              value={form.newPassword} onChange={set}
            />
            <button style={eyeBtn} onClick={() => setShowNew(p => !p)} type="button">
              {showNew ? '🙈' : '👁️'}
            </button>
          </div>
          {form.newPassword && form.newPassword === form.oldPassword && (
            <p style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>
              ⚠️ New password must be different from old password
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Confirm New Password</label>
          <div style={{ position: 'relative' }}>
            <input
              style={{
                ...inp,
                borderColor: form.confirmPassword && form.newPassword !== form.confirmPassword
                  ? '#ef4444' : '#1e293b',
              }}
              type={showConfirm ? 'text' : 'password'} name="confirmPassword"
              placeholder="Re-enter new password"
              value={form.confirmPassword} onChange={set}
              onKeyDown={e => e.key === 'Enter' && !isDisabled && handleSubmit()}
            />
            <button style={eyeBtn} onClick={() => setShowConfirm(p => !p)} type="button">
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>
          {form.confirmPassword && form.newPassword !== form.confirmPassword && (
            <p style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>
              ⚠️ Passwords do not match
            </p>
          )}
          {form.confirmPassword && form.newPassword === form.confirmPassword && form.confirmPassword.length >= 6 && (
            <p style={{ color: '#34d399', fontSize: 11, marginTop: 4 }}>
              ✅ Passwords match
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8, padding: '10px 14px',
            color: '#f87171', fontSize: 12, marginBottom: 10,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <button style={submitBtn(isDisabled)} onClick={handleSubmit} disabled={isDisabled}>
          {loading ? '⏳ Changing...' : 'Change Password →'}
        </button>

        {/* Back */}
        <div style={{ textAlign: 'center' }}>
          <button style={backBtn} onClick={() => navigate('/login')}>← Back to Login</button>
        </div>
      </div>
    </div>
  )
}