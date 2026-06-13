
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProfileDropdown() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const [open, setOpen]  = useState(false)
  const ref              = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = user?.name?.trim().split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
  const isAdmin  = user?.role === 'admin'

  const avatarStyle = {
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 800, color: '#fff', cursor: 'pointer',
    background: isAdmin
      ? 'linear-gradient(135deg,#6366f1,#ec4899)'
      : 'linear-gradient(135deg,#10b981,#0ea5e9)',
    boxShadow: isAdmin
      ? '0 0 0 2px #6366f1'
      : '0 0 0 2px #10b981',
    transition: 'transform 0.2s',
    flexShrink: 0,
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>

      {/* Profile Icon */}
      <div
        style={avatarStyle}
        onClick={() => setOpen(p => !p)}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title={user?.name}
      >
        {initials}
      </div>

      {/* Dropdown — shifted 12mm to the right */}
      {open && (
        <div style={{
          position: 'absolute',
          right: '-12mm',   // ← 12mm right shift
          top: 46,
          width: 270,
          background: '#0f172a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          zIndex: 999,
          animation: 'pdDropIn 0.2s ease-out',
        }}>

          {/* Banner */}
          <div style={{
            height: 56,
            background: isAdmin
              ? 'linear-gradient(135deg,#4f46e5,#db2777)'
              : 'linear-gradient(135deg,#059669,#0284c7)',
          }} />

          {/* Content */}
          <div style={{ padding: '0 18px 18px' }}>

            {/* Avatar over banner */}
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: isAdmin ? 'linear-gradient(135deg,#6366f1,#ec4899)' : 'linear-gradient(135deg,#10b981,#0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, color: '#fff',
              border: '3px solid #0f172a',
              marginTop: -26, marginBottom: 10,
            }}>
              {initials}
            </div>

            {/* Name + Role */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', textTransform: 'capitalize' }}>
                {user?.name}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                background: isAdmin ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)',
                color: isAdmin ? '#818cf8' : '#34d399',
                border: `1px solid ${isAdmin ? 'rgba(99,102,241,0.3)' : 'rgba(16,185,129,0.3)'}`,
              }}>
                {isAdmin ? '👑 Admin' : '👤 User'}
              </span>
            </div>

            {/* Details */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['📧', 'Email',  user?.email],
                ['📱', 'Mobile', user?.mobile && user.mobile !== 'N/A' ? user.mobile : '—'],
                ['🆔', 'ID',     user?.id ? `#${user.id}` : '—'],
              ].map(([icon, label, val]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                marginTop: 14, width: '100%', padding: '8px',
                borderRadius: 10, fontSize: 13, fontWeight: 600,
                color: '#f87171', background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                cursor: 'pointer', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pdDropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  )
}