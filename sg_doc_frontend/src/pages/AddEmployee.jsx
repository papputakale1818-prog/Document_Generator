// import { useState, useEffect, useCallback } from 'react'
// import { useAuth } from '../context/AuthContext'

// const API_URL = 'http://127.0.0.1:8000'

// const S = {
//   page: {
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg,#0b0f1a 0%,#111827 60%,#0f172a 100%)',
//     color: '#e2e8f0',
//     fontFamily: "'Segoe UI', Arial, sans-serif",
//   },
//   navbar: {
//     background: 'rgba(255,255,255,0.03)',
//     borderBottom: '1px solid #1e293b',
//     padding: '0 32px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     height: 56,
//     position: 'sticky',
//     top: 0,
//     zIndex: 50,
//     backdropFilter: 'blur(12px)',
//     marginTop: '10mm',
//     gap: 12,
//   },
//   navLeft: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
//   navTab: (active) => ({
//     padding: '6px 18px',
//     borderRadius: 8,
//     fontSize: 13,
//     fontWeight: 600,
//     cursor: 'pointer',
//     border: 'none',
//     transition: 'all 0.2s',
//     background: active ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'transparent',
//     color: active ? '#fff' : '#64748b',
//     letterSpacing: '.01em',
//   }),
//   searchWrap: {
//     position: 'relative',
//     display: 'flex',
//     alignItems: 'center',
//     width: 260,
//   },
//   searchIcon: {
//     position: 'absolute',
//     left: 10,
//     color: '#475569',
//     fontSize: 12,
//     pointerEvents: 'none',
//   },
//   searchInp: {
//     background: '#0f172a',
//     border: '1px solid #1e293b',
//     borderRadius: 8,
//     padding: '6px 12px 6px 28px',
//     color: '#f1f5f9',
//     fontSize: 12,
//     outline: 'none',
//     width: '100%',
//     fontFamily: 'inherit',
//   },
//   content: { padding: '20px 24px' },
//   wrap: { maxWidth: 780, margin: '0 auto' },
//   wrapWide: { maxWidth: 900, margin: '0 auto' },
//   card: {
//     background: 'rgba(255,255,255,0.04)',
//     border: '1px solid #1e293b',
//     borderRadius: 20,
//     padding: '24px 28px',
//     marginBottom: 20,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   accent: {
//     position: 'absolute', top: 0, left: 0, right: 0, height: 3,
//     background: 'linear-gradient(90deg,#a78bfa,#34d399,#60a5fa)',
//   },
//   sHead: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 },
//   sIcon: {
//     width: 38, height: 38, borderRadius: 10, display: 'flex',
//     alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
//   },
//   sTitle: { fontSize: 15, fontWeight: 700, color: '#f1f5f9' },
//   sSub:   { fontSize: 11, color: '#475569', marginTop: 1 },
//   g2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 },
//   g3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 },
//   g4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 14 },
//   lbl: {
//     display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8',
//     letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 5,
//   },
//   inp: {
//     background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
//     padding: '10px 14px', color: '#f1f5f9', fontSize: 13, outline: 'none',
//     fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
//   },
//   sel: {
//     background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
//     padding: '10px 14px', color: '#f1f5f9', fontSize: 13, outline: 'none',
//     fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
//   },
//   textarea: {
//     background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
//     padding: '10px 14px', color: '#f1f5f9', fontSize: 13, outline: 'none',
//     fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
//     resize: 'none', minHeight: 72,
//   },
//   req: { color: '#a78bfa' },
//   submitBtn: {
//     width: '100%', padding: '13px', borderRadius: 13,
//     background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
//     border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
//     cursor: 'pointer', letterSpacing: '.02em', marginTop: 4,
//   },
//   avatarCircle: {
//     width: 64, height: 64, borderRadius: '50%', margin: '0 auto 14px',
//     background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
//     display: 'flex', alignItems: 'center', justifyContent: 'center',
//     fontSize: 22, fontWeight: 800, color: '#fff',
//   },
//   tagAmber: {
//     display: 'inline-block', padding: '4px 14px', borderRadius: 999,
//     fontSize: 12, fontWeight: 700, background: '#451a03', color: '#fbbf24',
//     border: '1px solid rgba(251,191,36,0.3)',
//   },
//   emptyBox: { textAlign: 'center', padding: '80px 24px', color: '#334155' },
//   eduSection: {
//     borderTop: '1px solid #1e293b',
//     paddingTop: 18,
//     marginTop: 4,
//     marginBottom: 14,
//   },
//   eduSectionTitle: {
//     fontSize: 11, fontWeight: 700, color: '#64748b',
//     letterSpacing: '.06em', textTransform: 'uppercase',
//     marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6,
//   },
// }

// const EMPTY_FORM = {
//   empId: '',
//   fullName: '', dob: '', gender: '', bloodGroup: '',
//   personalEmail: '', mobile: '',
//   designation: '', department: '', empType: 'Full-Time',
//   pan: '', aadhar: '', uanNumber: '', pfNumber: '', bankAcc: '', ifsc: '', bankName: '',
//   address: '', city: '', state: '', pin: '',
//   gradDegree: '', gradCollege: '', gradUniversity: '', gradYear: '', gradGrade: '',
//   pgDegree: '', pgCollege: '', pgUniversity: '', pgYear: '', pgGrade: '',
// }

// async function fetchNextEmpId(companyId) {
//   try {
//     const token = localStorage.getItem('hr_token')
//     const res = await fetch(`${API_URL}/employees/last-emp-id?company_id=${companyId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//     if (!res.ok) throw new Error('fetch failed')
//     const data = await res.json()
//     const lastId = data.emp_id
//     if (!lastId) return null
//     const match = lastId.match(/^([A-Za-z]*)(\d+)$/)
//     if (!match) return null
//     const prefix = match[1]
//     const nextNum = parseInt(match[2], 10) + 1
//     const padded = String(nextNum).padStart(match[2].length, '0')
//     return `${prefix}${padded}`
//   } catch {
//     return null
//   }
// }

// // ── Edit inline fields helper ─────────────────────────────────────────────────
// function EditField({ label, name, value, onChange, type = 'text', options }) {
//   const editInp = {
//     background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
//     padding: '7px 10px', color: '#f1f5f9', fontSize: 12, outline: 'none',
//     fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
//   }
//   return (
//     <div>
//       <div style={{ fontSize: 10, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 600 }}>{label}</div>
//       {options ? (
//         <select style={{ ...editInp, colorScheme: 'dark' }} name={name} value={value || ''} onChange={onChange}>
//           {options.map(o => <option key={o} value={o}>{o}</option>)}
//         </select>
//       ) : (
//         <input type={type} style={{ ...editInp, colorScheme: type === 'date' ? 'dark' : undefined }} name={name} value={value || ''} onChange={onChange} />
//       )}
//     </div>
//   )
// }

// // ── Employee Card ─────────────────────────────────────────────────────────────
// function EmployeeCard({ emp, onSaved }) {
//   const [expanded,  setExpanded]  = useState(false)
//   const [editing,   setEditing]   = useState(false)
//   const [editData,  setEditData]  = useState({})
//   const [saving,    setSaving]    = useState(false)
//   const [saveError, setSaveError] = useState('')

//   const initials = emp.full_name?.trim().split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
//   const COLORS = [
//     'linear-gradient(135deg,#7c3aed,#a78bfa)',
//     'linear-gradient(135deg,#0ea5e9,#38bdf8)',
//     'linear-gradient(135deg,#10b981,#34d399)',
//     'linear-gradient(135deg,#f59e0b,#fbbf24)',
//     'linear-gradient(135deg,#ef4444,#f87171)',
//   ]
//   const avatarBg = COLORS[emp.id % COLORS.length]

//   const hasGrad = emp.grad_degree || emp.grad_college || emp.grad_university || emp.grad_year || emp.grad_grade
//   const hasPG   = emp.pg_degree   || emp.pg_college   || emp.pg_university   || emp.pg_year   || emp.pg_grade

//   const startEdit = () => {
//     setEditData({ ...emp })
//     setEditing(true)
//     setExpanded(true)
//     setSaveError('')
//   }

//   const cancelEdit = () => {
//     setEditing(false)
//     setSaveError('')
//   }

//   const handleEditChange = e => {
//     const { name, value } = e.target
//     setEditData(p => ({ ...p, [name]: value }))
//   }

//   const saveEdit = async () => {
//     setSaving(true)
//     setSaveError('')
//     try {
//       const token = localStorage.getItem('hr_token')
//       const payload = {
//         emp_id:          editData.emp_id         || null,
//         full_name:       editData.full_name       || null,
//         dob:             editData.dob             || null,
//         gender:          editData.gender          || null,
//         blood_group:     editData.blood_group     || null,
//         personal_email:  editData.personal_email  || null,
//         mobile:          editData.mobile          || null,
//         designation:     editData.designation     || null,
//         department:      editData.department      || null,
//         emp_type:        editData.emp_type        || null,
//         company_id:      editData.company_id      || null,
//         pan:             editData.pan             || null,
//         aadhar:          editData.aadhar          || null,
//         uan_number:      editData.uan_number      || null,
//         pf_number:       editData.pf_number       || null,
//         bank_acc:        editData.bank_acc        || null,
//         ifsc:            editData.ifsc            || null,
//         bank_name:       editData.bank_name       || null,
//         address:         editData.address         || null,
//         city:            editData.city            || null,
//         state:           editData.state           || null,
//         pin:             editData.pin             || null,
//         grad_degree:     editData.grad_degree     || null,
//         grad_college:    editData.grad_college    || null,
//         grad_university: editData.grad_university || null,
//         grad_year:       editData.grad_year       || null,
//         grad_grade:      editData.grad_grade      || null,
//         pg_degree:       editData.pg_degree       || null,
//         pg_college:      editData.pg_college      || null,
//         pg_university:   editData.pg_university   || null,
//         pg_year:         editData.pg_year         || null,
//         pg_grade:        editData.pg_grade        || null,
//       }
//       const res = await fetch(`${API_URL}/employees/${emp.id}/`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       })
//       if (!res.ok) {
//         const err = await res.json()
//         throw new Error(err.detail || 'Save failed')
//       }
//       const updated = await res.json()
//       setEditing(false)
//       onSaved(updated)
//     } catch (err) {
//       setSaveError(`⚠️ ${err.message}`)
//     } finally {
//       setSaving(false)
//     }
//   }

//   return (
//     <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${editing ? '#7c3aed55' : '#1e293b'}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s' }}>

//       {/* ── Card Header Row ── */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
//         {/* Avatar — clickable to expand */}
//         <div
//           style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0, background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer' }}
//           onClick={() => !editing && setExpanded(p => !p)}
//         >
//           {initials}
//         </div>

//         {/* Name + designation — clickable to expand */}
//         <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => !editing && setExpanded(p => !p)}>
//           <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.full_name}</div>
//           <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{emp.designation || '—'} · {emp.department || '—'}</div>
//         </div>

//         {/* Emp ID badge */}
//         <div style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)', flexShrink: 0 }}>
//           {emp.emp_id}
//         </div>

//         {/* Type badge */}
//         <div style={{ padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 600, background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)', flexShrink: 0 }}>
//           {emp.emp_type || 'Full-Time'}
//         </div>

//         {/* Edit button */}
//         {!editing ? (
//           <button
//             onClick={startEdit}
//             style={{ flexShrink: 0, padding: '5px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.08)', color: '#a78bfa', transition: 'all 0.18s' }}
//           >✏️ Edit</button>
//         ) : (
//           <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
//             <button
//               onClick={saveEdit}
//               disabled={saving}
//               style={{ padding: '5px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', border: '1px solid rgba(52,211,153,0.4)', background: 'rgba(52,211,153,0.12)', color: '#34d399', opacity: saving ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 4 }}
//             >
//               {saving ? (
//                 <svg style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}/><path fill="currentColor" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.75 }}/></svg>
//               ) : '✓'} {saving ? 'Saving...' : 'Save'}
//             </button>
//             <button
//               onClick={cancelEdit}
//               style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid #1e293b', background: 'transparent', color: '#475569' }}
//             >Cancel</button>
//           </div>
//         )}

//         {/* Expand chevron */}
//         <div
//           style={{ color: '#334155', fontSize: 11, flexShrink: 0, transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', cursor: 'pointer' }}
//           onClick={() => !editing && setExpanded(p => !p)}
//         >▼</div>
//       </div>

//       {/* ── Expanded Details ── */}
//       {expanded && (
//         <div style={{ borderTop: '1px solid #1e293b', padding: '18px 18px 14px' }}>

//           {saveError && (
//             <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '8px 14px', color: '#f87171', fontSize: 12, marginBottom: 14 }}>
//               {saveError}
//             </div>
//           )}

//           {editing ? (
//             /* ─── EDIT MODE ─── */
//             <div>
//               {/* Personal */}
//               <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12 }}>👤 Personal Info</div>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 14px', marginBottom: 16 }}>
//                 <EditField label="Full Name"      name="full_name"      value={editData.full_name}      onChange={handleEditChange} />
//                 <EditField label="Mobile"         name="mobile"         value={editData.mobile}         onChange={handleEditChange} />
//                 <EditField label="Personal Email" name="personal_email" value={editData.personal_email} onChange={handleEditChange} type="email" />
//                 <EditField label="Date of Birth"  name="dob"            value={editData.dob}            onChange={handleEditChange} type="date" />
//                 <EditField label="Gender"         name="gender"         value={editData.gender}         onChange={handleEditChange} options={['', 'Male', 'Female', 'Other']} />
//                 <EditField label="Blood Group"    name="blood_group"    value={editData.blood_group}    onChange={handleEditChange} options={['', 'A+','A-','B+','B-','O+','O-','AB+','AB-']} />
//               </div>

//               {/* Employment */}
//               <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12, borderTop: '1px solid #1e293b', paddingTop: 14 }}>🏢 Employment</div>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 14px', marginBottom: 16 }}>
//                 <EditField label="Designation"      name="designation" value={editData.designation} onChange={handleEditChange} />
//                 <EditField label="Department"       name="department"  value={editData.department}  onChange={handleEditChange} />
//                 <EditField label="Employment Type"  name="emp_type"    value={editData.emp_type}    onChange={handleEditChange} options={['Full-Time','Part-Time','Contract','Intern']} />
//               </div>

//               {/* Documents */}
//               <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12, borderTop: '1px solid #1e293b', paddingTop: 14 }}>📋 Documents & Bank</div>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 14px', marginBottom: 16 }}>
//                 <EditField label="PAN"          name="pan"        value={editData.pan}        onChange={handleEditChange} />
//                 <EditField label="Aadhar"       name="aadhar"     value={editData.aadhar}     onChange={handleEditChange} />
//                 <EditField label="UAN Number"   name="uan_number" value={editData.uan_number} onChange={handleEditChange} />
//                 <EditField label="PF Number"    name="pf_number"  value={editData.pf_number}  onChange={handleEditChange} />
//                 <EditField label="Bank Acc No." name="bank_acc"   value={editData.bank_acc}   onChange={handleEditChange} />
//                 <EditField label="IFSC Code"    name="ifsc"       value={editData.ifsc}       onChange={handleEditChange} />
//                 <EditField label="Bank Name"    name="bank_name"  value={editData.bank_name}  onChange={handleEditChange} />
//               </div>

//               {/* Address */}
//               <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12, borderTop: '1px solid #1e293b', paddingTop: 14 }}>📍 Address</div>
//               <div style={{ marginBottom: 10 }}>
//                 <div style={{ fontSize: 10, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 600 }}>Residential Address</div>
//                 <textarea
//                   name="address"
//                   value={editData.address || ''}
//                   onChange={handleEditChange}
//                   style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '7px 10px', color: '#f1f5f9', fontSize: 12, outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', resize: 'none', minHeight: 56 }}
//                 />
//               </div>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 14px', marginBottom: 16 }}>
//                 <EditField label="City"     name="city"  value={editData.city}  onChange={handleEditChange} />
//                 <EditField label="State"    name="state" value={editData.state} onChange={handleEditChange} />
//                 <EditField label="PIN Code" name="pin"   value={editData.pin}   onChange={handleEditChange} />
//               </div>

//               {/* Education */}
//               <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12, borderTop: '1px solid #1e293b', paddingTop: 14 }}>🎓 Education — Graduation</div>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '10px 14px', marginBottom: 16 }}>
//                 <EditField label="Degree"      name="grad_degree"     value={editData.grad_degree}     onChange={handleEditChange} />
//                 <EditField label="College"     name="grad_college"    value={editData.grad_college}    onChange={handleEditChange} />
//                 <EditField label="University"  name="grad_university" value={editData.grad_university} onChange={handleEditChange} />
//                 <EditField label="Pass Year"   name="grad_year"       value={editData.grad_year}       onChange={handleEditChange} />
//                 <EditField label="Grade/CGPA"  name="grad_grade"      value={editData.grad_grade}      onChange={handleEditChange} />
//               </div>

//               <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12, borderTop: '1px solid #1e293b', paddingTop: 14 }}>🎓 Education — Post Graduation</div>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '10px 14px', marginBottom: 10 }}>
//                 <EditField label="Degree"      name="pg_degree"     value={editData.pg_degree}     onChange={handleEditChange} />
//                 <EditField label="College"     name="pg_college"    value={editData.pg_college}    onChange={handleEditChange} />
//                 <EditField label="University"  name="pg_university" value={editData.pg_university} onChange={handleEditChange} />
//                 <EditField label="Pass Year"   name="pg_year"       value={editData.pg_year}       onChange={handleEditChange} />
//                 <EditField label="Grade/CGPA"  name="pg_grade"      value={editData.pg_grade}      onChange={handleEditChange} />
//               </div>

//               {/* Save/Cancel bottom row */}
//               <div style={{ display: 'flex', gap: 10, marginTop: 16, borderTop: '1px solid #1e293b', paddingTop: 14 }}>
//                 <button
//                   onClick={saveEdit}
//                   disabled={saving}
//                   style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg,#10b981,#34d399)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
//                 >
//                   {saving ? 'Saving...' : '✓ Save Changes'}
//                 </button>
//                 <button
//                   onClick={cancelEdit}
//                   style={{ padding: '10px 24px', borderRadius: 10, background: 'transparent', border: '1px solid #1e293b', color: '#475569', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
//                 >Cancel</button>
//               </div>
//             </div>

//           ) : (
//             /* ─── VIEW MODE ─── */
//             <div>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 20px', marginBottom: 12 }}>
//                 {[
//                   ['📱 Mobile', emp.mobile], ['📧 Email', emp.personal_email],
//                   ['🎂 DOB', emp.dob], ['👤 Gender', emp.gender],
//                   ['🩸 Blood Group', emp.blood_group], ['🆔 PAN', emp.pan],
//                   ['🔑 Aadhar', emp.aadhar], ['🔢 UAN Number', emp.uan_number],
//                   ['📁 PF Number', emp.pf_number], ['🏦 Bank Acc', emp.bank_acc],
//                   ['🏦 IFSC', emp.ifsc], ['🏦 Bank Name', emp.bank_name],
//                   ['🏙️ City', emp.city], ['🗺️ State', emp.state],
//                 ].map(([label, val]) => val ? (
//                   <div key={label}>
//                     <div style={{ fontSize: 10, color: '#475569', marginBottom: 2 }}>{label}</div>
//                     <div style={{ fontSize: 12, color: '#94a3b8' }}>{val}</div>
//                   </div>
//                 ) : null)}
//                 {emp.address && (
//                   <div style={{ gridColumn: '1 / -1' }}>
//                     <div style={{ fontSize: 10, color: '#475569', marginBottom: 2 }}>📍 Address</div>
//                     <div style={{ fontSize: 12, color: '#94a3b8' }}>{emp.address}{emp.pin ? ` - ${emp.pin}` : ''}</div>
//                   </div>
//                 )}
//               </div>

//               {hasGrad && (
//                 <div style={{ borderTop: '1px solid #1e293b', paddingTop: 10, marginTop: 4 }}>
//                   <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>🎓 Graduation</div>
//                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px 16px' }}>
//                     {[['Degree', emp.grad_degree], ['College', emp.grad_college], ['University', emp.grad_university], ['Pass Year', emp.grad_year], ['Grade/CGPA', emp.grad_grade]].map(([l, v]) => v ? (
//                       <div key={l}><div style={{ fontSize: 10, color: '#475569', marginBottom: 2 }}>{l}</div><div style={{ fontSize: 12, color: '#94a3b8' }}>{v}</div></div>
//                     ) : null)}
//                   </div>
//                 </div>
//               )}

//               {hasPG && (
//                 <div style={{ borderTop: '1px solid #1e293b', paddingTop: 10, marginTop: 10 }}>
//                   <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>🎓 Post Graduation</div>
//                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px 16px' }}>
//                     {[['Degree', emp.pg_degree], ['College', emp.pg_college], ['University', emp.pg_university], ['Pass Year', emp.pg_year], ['Grade/CGPA', emp.pg_grade]].map(([l, v]) => v ? (
//                       <div key={l}><div style={{ fontSize: 10, color: '#475569', marginBottom: 2 }}>{l}</div><div style={{ fontSize: 12, color: '#94a3b8' }}>{v}</div></div>
//                     ) : null)}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// // ── All Employees Tab ─────────────────────────────────────────────────────────
// function AllEmployees({ companyId, companyName, search, onAddClick }) {
//   const [employees, setEmployees] = useState([])
//   const [loading,   setLoading]   = useState(true)

//   const fetchEmployees = useCallback(async () => {
//     setLoading(true)
//     try {
//       const token = localStorage.getItem('hr_token')
//       const res   = await fetch(`${API_URL}/employees/?company_id=${companyId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       setEmployees(Array.isArray(data) ? data : [])
//     } catch { setEmployees([]) }
//     finally  { setLoading(false) }
//   }, [companyId])

//   useEffect(() => { fetchEmployees() }, [fetchEmployees])

//   // Called when an employee card saves successfully
//   const handleSaved = (updated) => {
//     setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e))
//   }

//   const filtered = employees.filter(e =>
//     !search ||
//     e.full_name?.toLowerCase().includes(search.toLowerCase()) ||
//     e.emp_id?.toLowerCase().includes(search.toLowerCase()) ||
//     e.designation?.toLowerCase().includes(search.toLowerCase()) ||
//     e.department?.toLowerCase().includes(search.toLowerCase())
//   )

//   if (loading) return (
//     <div style={{ textAlign: 'center', padding: '80px 24px', color: '#475569' }}>
//       <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div><p>Loading employees...</p>
//     </div>
//   )

//   if (employees.length === 0) return (
//     <div style={S.emptyBox}>
//       <div style={{ fontSize: 56, marginBottom: 16 }}>👥</div>
//       <h3 style={{ fontSize: 20, fontWeight: 700, color: '#475569', marginBottom: 8 }}>No Employees Yet</h3>
//       <p style={{ fontSize: 13, color: '#334155', marginBottom: 24 }}>{companyName} मध्ये अजून कोणताही employee add केला नाही.</p>
//       <button style={{ ...S.submitBtn, width: 'auto', padding: '10px 28px' }} onClick={onAddClick}>➕ Add First Employee</button>
//     </div>
//   )

//   return (
//     <div style={S.wrapWide}>
//       <p style={{ fontSize: 11, color: '#475569', marginBottom: 14, letterSpacing: '.04em', textTransform: 'uppercase' }}>
//         {companyName} · {filtered.length} / {employees.length} employee{employees.length !== 1 ? 's' : ''}
//       </p>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//         {filtered.length === 0
//           ? <div style={{ textAlign: 'center', padding: 40, color: '#475569' }}>"{search}" — कोणताही employee सापडला नाही</div>
//           : filtered.map(emp => <EmployeeCard key={emp.id} emp={emp} onSaved={handleSaved} />)
//         }
//       </div>
//     </div>
//   )
// }

// // ── Main Component ────────────────────────────────────────────────────────────
// export default function AddEmployee() {
//   const { selectedCompany } = useAuth()
//   const companyName = selectedCompany?.name || 'Company'
//   const companyId   = selectedCompany?.id

//   const [tab,        setTab]        = useState('list')
//   const [search,     setSearch]     = useState('')
//   const [submitted,  setSubmitted]  = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const [form,       setForm]       = useState(EMPTY_FORM)
//   const [empIdMode,     setEmpIdMode]     = useState('auto')
//   const [autoIdLoading, setAutoIdLoading] = useState(false)

//   const set = e => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })) }
//   const initials = form.fullName.trim().split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
//   const resetForm = () => { setSubmitted(false); setForm(EMPTY_FORM) }

//   const handleAutoGenerate = async () => {
//     setAutoIdLoading(true)
//     const nextId = await fetchNextEmpId(companyId)
//     if (nextId) {
//       setForm(p => ({ ...p, empId: nextId }))
//     } else {
//       alert('Could not fetch last Employee ID from server. Please enter manually.')
//     }
//     setAutoIdLoading(false)
//   }

//   const handleSubmit = async () => {
//     if (!form.fullName || !form.mobile) { alert('Please Enter Full Name & Mobile Number'); return }
//     setSubmitting(true)
//     try {
//       const token = localStorage.getItem('hr_token')
//       const res = await fetch(`${API_URL}/notifications/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify({
//           emp_id:          form.empId          || null,
//           full_name:       form.fullName,
//           dob:             form.dob            || null,
//           gender:          form.gender         || null,
//           blood_group:     form.bloodGroup     || null,
//           personal_email:  form.personalEmail  || null,
//           mobile:          form.mobile,
//           designation:     form.designation    || null,
//           department:      form.department     || null,
//           emp_type:        form.empType,
//           pan:             form.pan            || null,
//           aadhar:          form.aadhar         || null,
//           uan_number:      form.uanNumber      || null,
//           pf_number:       form.pfNumber       || null,
//           bank_acc:        form.bankAcc        || null,
//           ifsc:            form.ifsc           || null,
//           bank_name:       form.bankName       || null,
//           address:         form.address        || null,
//           city:            form.city           || null,
//           state:           form.state          || null,
//           pin:             form.pin            || null,
//           company_id:      companyId           || null,
//           grad_degree:     form.gradDegree     || null,
//           grad_college:    form.gradCollege    || null,
//           grad_university: form.gradUniversity || null,
//           grad_year:       form.gradYear       || null,
//           grad_grade:      form.gradGrade      || null,
//           pg_degree:       form.pgDegree       || null,
//           pg_college:      form.pgCollege      || null,
//           pg_university:   form.pgUniversity   || null,
//           pg_year:         form.pgYear         || null,
//           pg_grade:        form.pgGrade        || null,
//         }),
//       })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.detail || 'Submit failed')
//       setSubmitted(true)
//     } catch (e) { alert(e.message) }
//     finally     { setSubmitting(false) }
//   }

//   // ── Navbar: All Employees | Add Employee | [Search — right of Add Employee when list tab]

//   if (tab === 'form' && submitted) {
//     return (
//       <div style={S.page}>
//         <nav style={S.navbar}>
//           <div style={S.navLeft}>
//             <button style={S.navTab(tab === 'list')} onClick={() => { setTab('list'); resetForm() }}>👥 All Employees</button>
//             <button style={S.navTab(tab === 'form')} onClick={() => { setTab('form'); resetForm() }}>➕ Add Employee</button>
//             {tab === 'list' && (
//               <div style={S.searchWrap}>
//                 <span style={S.searchIcon}>🔍</span>
//                 <input
//                   style={S.searchInp}
//                   placeholder="Search name, ID, dept..."
//                   value={search}
//                   onChange={e => setSearch(e.target.value)}
//                 />
//                 {search && (
//                   <button
//                     onClick={() => setSearch('')}
//                     style={{ position: 'absolute', right: 8, background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 11, lineHeight: 1 }}
//                   >✕</button>
//                 )}
//               </div>
//             )}
//           </div>
//         </nav>
//         <div style={S.content}>
//           <div style={S.wrap}>
//             <div style={{ ...S.card, textAlign: 'center', padding: '48px 28px' }}>
//               <div style={S.accent} />
//               <div style={S.avatarCircle}>{initials}</div>
//               <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>{form.fullName}</h2>
//               {form.empId && (
//                 <div style={{ marginBottom: 8 }}>
//                   <span style={{ padding: '3px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
//                     {form.empId}
//                   </span>
//                 </div>
//               )}
//               <div style={{ marginBottom: 24, marginTop: 12 }}><span style={S.tagAmber}>⏳ Admin Approval Pending</span></div>
//               <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.8, marginBottom: 28 }}>
//                 तुमचा request admin कडे पाठवला आहे.<br/>Admin approve केल्यावर Employee ID generate होईल.
//               </p>
//               <button style={{ ...S.submitBtn, background: 'transparent', border: '1px solid #1e293b', color: '#64748b' }} onClick={resetForm}>← Edit Form</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div style={S.page}>
//       <nav style={S.navbar}>
//         <div style={S.navLeft}>
//           <button style={S.navTab(tab === 'list')} onClick={() => { setTab('list'); resetForm() }}>👥 All Employees</button>
//           <button style={S.navTab(tab === 'form')} onClick={() => { setTab('form'); resetForm() }}>➕ Add Employee</button>
//           {tab === 'list' && (
//             <div style={S.searchWrap}>
//               <span style={S.searchIcon}>🔍</span>
//               <input
//                 style={S.searchInp}
//                 placeholder="Search name, ID, dept..."
//                 value={search}
//                 onChange={e => setSearch(e.target.value)}
//               />
//               {search && (
//                 <button
//                   onClick={() => setSearch('')}
//                   style={{ position: 'absolute', right: 8, background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 11, lineHeight: 1 }}
//                 >✕</button>
//               )}
//             </div>
//           )}
//         </div>
//       </nav>
//       <div style={S.content}>

//         {tab === 'list' && (
//           <AllEmployees companyId={companyId} companyName={companyName} search={search} onAddClick={() => setTab('form')} />
//         )}

//         {tab === 'form' && (
//           <div style={S.wrap}>

//             {/* ── Personal Info ── */}
//             <div style={S.card}>
//               <div style={S.accent} />
//               <div style={S.sHead}>
//                 <div style={{ ...S.sIcon, background: '#1e1b4b' }}>👤</div>
//                 <div><div style={S.sTitle}>Personal Information</div><div style={S.sSub}>Basic personal details</div></div>
//               </div>

//               <div style={{ marginBottom: 14 }}>
//                 <label style={S.lbl}>Employee ID</label>
//                 <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
//                   {[
//                     { key: 'auto',   label: '⚡ Auto Generate (last ID + 1)' },
//                     { key: 'manual', label: '✏️ Enter Existing ID' },
//                   ].map(({ key, label }) => (
//                     <button
//                       key={key}
//                       type="button"
//                       onClick={() => { setEmpIdMode(key); setForm(p => ({ ...p, empId: '' })) }}
//                       style={{
//                         padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600,
//                         cursor: 'pointer',
//                         border: empIdMode === key ? '1px solid rgba(167,139,250,0.5)' : '1px solid #1e293b',
//                         background: empIdMode === key ? 'rgba(167,139,250,0.12)' : 'transparent',
//                         color: empIdMode === key ? '#a78bfa' : '#475569',
//                         transition: 'all 0.18s',
//                       }}
//                     >{label}</button>
//                   ))}
//                 </div>

//                 {empIdMode === 'auto' ? (
//                   <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
//                     <input
//                       style={{ ...S.inp, flex: 1, fontFamily: 'monospace', letterSpacing: '.05em', color: form.empId ? '#34d399' : '#475569' }}
//                       value={form.empId || 'Click Generate to fetch next ID'}
//                       readOnly
//                     />
//                     <button
//                       type="button"
//                       onClick={handleAutoGenerate}
//                       disabled={autoIdLoading}
//                       style={{ flexShrink: 0, padding: '10px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: autoIdLoading ? 'not-allowed' : 'pointer', opacity: autoIdLoading ? 0.6 : 1, whiteSpace: 'nowrap' }}
//                     >{autoIdLoading ? 'Fetching...' : '⚡ Generate'}</button>
//                   </div>
//                 ) : (
//                   <div>
//                     <input style={{ ...S.inp, fontFamily: 'monospace', letterSpacing: '.05em' }} name="empId" value={form.empId} onChange={set} placeholder="Enter existing Employee ID — e.g. SGT1005" />
//                     <p style={{ fontSize: 10, color: '#475569', marginTop: 5 }}>Use this option when the employee already exists but their information is not in the database yet.</p>
//                   </div>
//                 )}
//               </div>

//               <div style={{ marginBottom: 14 }}>
//                 <label style={S.lbl}>Full Name <span style={S.req}>*</span></label>
//                 <input style={S.inp} name="fullName" value={form.fullName} onChange={set} placeholder="e.g. Sumit Kumar" />
//               </div>
//               <div style={S.g3}>
//                 <div><label style={S.lbl}>Date of Birth</label><input type="date" style={{ ...S.inp, colorScheme: 'dark' }} name="dob" value={form.dob} onChange={set} /></div>
//                 <div><label style={S.lbl}>Gender</label><select style={S.sel} name="gender" value={form.gender} onChange={set}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
//                 <div><label style={S.lbl}>Blood Group</label><select style={S.sel} name="bloodGroup" value={form.bloodGroup} onChange={set}><option value="">Select</option>{['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}</select></div>
//               </div>
//               <div style={S.g2}>
//                 <div><label style={S.lbl}>Personal Email</label><input type="email" style={S.inp} name="personalEmail" value={form.personalEmail} onChange={set} placeholder="raj@gmail.com" /></div>
//                 <div><label style={S.lbl}>Mobile <span style={S.req}>*</span></label><input type="tel" style={S.inp} name="mobile" value={form.mobile} onChange={set} placeholder="9876543210" maxLength={10} /></div>
//               </div>
//             </div>

//             {/* ── Employment Details ── */}
//             <div style={S.card}>
//               <div style={S.accent} />
//               <div style={S.sHead}>
//                 <div style={{ ...S.sIcon, background: '#042c53' }}>🏢</div>
//                 <div><div style={S.sTitle}>Employment Details</div><div style={S.sSub}>Role, department and work info</div></div>
//               </div>
//               <div style={S.g2}>
//                 <div><label style={S.lbl}>Designation <span style={S.req}>*</span></label><input style={S.inp} name="designation" value={form.designation} onChange={set} placeholder="e.g. Software Engineer, Team Lead" /></div>
//                 <div><label style={S.lbl}>Department <span style={S.req}>*</span></label><input style={S.inp} name="department" value={form.department} onChange={set} placeholder="e.g. Backend Development, DevOps" /></div>
//               </div>
//               <div style={S.g2}>
//                 <div><label style={S.lbl}>Employment Type</label><select style={S.sel} name="empType" value={form.empType} onChange={set}><option>Full-Time</option><option>Part-Time</option><option>Contract</option><option>Intern</option></select></div>
//               </div>
//             </div>

//             {/* ── Education Details ── */}
//             <div style={S.card}>
//               <div style={S.accent} />
//               <div style={S.sHead}>
//                 <div style={{ ...S.sIcon, background: '#0c1a0e' }}>🎓</div>
//                 <div><div style={S.sTitle}>Education Details</div><div style={S.sSub}>Graduation & Post Graduation info</div></div>
//               </div>
//               <div style={{ marginBottom: 6 }}>
//                 <div style={S.eduSectionTitle}>
//                   <span style={{ display: 'inline-block', width: 20, height: 20, borderRadius: 6, background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', fontSize: 10, textAlign: 'center', lineHeight: '20px', color: '#60a5fa' }}>G</span>
//                   Graduation
//                 </div>
//               </div>
//               <div style={S.g2}>
//                 <div><label style={S.lbl}>Degree</label><input style={S.inp} name="gradDegree" value={form.gradDegree} onChange={set} placeholder="e.g. B.E. Computer, B.Sc IT, BCA" /></div>
//                 <div><label style={S.lbl}>College Name</label><input style={S.inp} name="gradCollege" value={form.gradCollege} onChange={set} placeholder="e.g. MIT College of Engineering" /></div>
//               </div>
//               <div style={S.g3}>
//                 <div><label style={S.lbl}>University</label><input style={S.inp} name="gradUniversity" value={form.gradUniversity} onChange={set} placeholder="e.g. SPPU, Mumbai University" /></div>
//                 <div><label style={S.lbl}>Passing Year</label><input style={S.inp} name="gradYear" value={form.gradYear} onChange={set} placeholder="e.g. 2021" maxLength={4} /></div>
//                 <div><label style={S.lbl}>Percentage / CGPA</label><input style={S.inp} name="gradGrade" value={form.gradGrade} onChange={set} placeholder="e.g. 72% or 7.8 CGPA" /></div>
//               </div>
//               <div style={S.eduSection}>
//                 <div style={S.eduSectionTitle}>
//                   <span style={{ display: 'inline-block', width: 20, height: 20, borderRadius: 6, background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', fontSize: 10, textAlign: 'center', lineHeight: '20px', color: '#a78bfa' }}>PG</span>
//                   Post Graduation <span style={{ color: '#334155', fontWeight: 400, fontSize: 10 }}>(optional)</span>
//                 </div>
//               </div>
//               <div style={S.g2}>
//                 <div><label style={S.lbl}>Degree</label><input style={S.inp} name="pgDegree" value={form.pgDegree} onChange={set} placeholder="e.g. M.Tech, MBA, MCA, M.Sc" /></div>
//                 <div><label style={S.lbl}>College Name</label><input style={S.inp} name="pgCollege" value={form.pgCollege} onChange={set} placeholder="e.g. Symbiosis Institute" /></div>
//               </div>
//               <div style={S.g3}>
//                 <div><label style={S.lbl}>University</label><input style={S.inp} name="pgUniversity" value={form.pgUniversity} onChange={set} placeholder="e.g. SPPU, Symbiosis University" /></div>
//                 <div><label style={S.lbl}>Passing Year</label><input style={S.inp} name="pgYear" value={form.pgYear} onChange={set} placeholder="e.g. 2023" maxLength={4} /></div>
//                 <div><label style={S.lbl}>Percentage / CGPA</label><input style={S.inp} name="pgGrade" value={form.pgGrade} onChange={set} placeholder="e.g. 80% or 8.5 CGPA" /></div>
//               </div>
//             </div>

//             {/* ── Documents & Compliance ── */}
//             <div style={S.card}>
//               <div style={S.accent} />
//               <div style={S.sHead}>
//                 <div style={{ ...S.sIcon, background: '#1a0a00' }}>📋</div>
//                 <div><div style={S.sTitle}>Documents & Compliance</div><div style={S.sSub}>Identity, bank and address details</div></div>
//               </div>
//               <div style={S.g2}>
//                 <div><label style={S.lbl}>PAN Number</label><input style={{ ...S.inp, textTransform: 'uppercase' }} name="pan" value={form.pan} onChange={set} placeholder="ABCDE1234F" maxLength={10} /></div>
//                 <div><label style={S.lbl}>Aadhar Number</label><input style={S.inp} name="aadhar" value={form.aadhar} onChange={set} placeholder="1234 5678 9012" maxLength={14} /></div>
//               </div>
//               <div style={S.g2}>
//                 <div><label style={S.lbl}>UAN Number</label><input style={S.inp} name="uanNumber" value={form.uanNumber} onChange={set} placeholder="100123456789" maxLength={12} /></div>
//                 <div><label style={S.lbl}>PF Number</label><input style={{ ...S.inp, textTransform: 'uppercase' }} name="pfNumber" value={form.pfNumber} onChange={set} placeholder="MH/PUN/1234567/000/0000001" /></div>
//               </div>
//               <div style={S.g3}>
//                 <div><label style={S.lbl}>Bank Account No.</label><input style={S.inp} name="bankAcc" value={form.bankAcc} onChange={set} placeholder="012345678901" /></div>
//                 <div><label style={S.lbl}>IFSC Code</label><input style={{ ...S.inp, textTransform: 'uppercase' }} name="ifsc" value={form.ifsc} onChange={set} placeholder="HDFC0001234" /></div>
//                 <div><label style={S.lbl}>Bank Name</label><input style={S.inp} name="bankName" value={form.bankName} onChange={set} placeholder="HDFC Bank" /></div>
//               </div>
//               <div style={{ marginBottom: 14 }}>
//                 <label style={S.lbl}>Residential Address</label>
//                 <textarea style={S.textarea} name="address" value={form.address} onChange={set} placeholder="Flat No., Building, Street, Area" />
//               </div>
//               <div style={S.g3}>
//                 <div><label style={S.lbl}>City</label><input style={S.inp} name="city" value={form.city} onChange={set} placeholder="Pune" /></div>
//                 <div><label style={S.lbl}>State</label><input style={S.inp} name="state" value={form.state} onChange={set} placeholder="Maharashtra" /></div>
//                 <div><label style={S.lbl}>PIN Code</label><input style={S.inp} name="pin" value={form.pin} onChange={set} placeholder="411014" maxLength={6} /></div>
//               </div>
//             </div>

//             <button
//               style={{ ...S.submitBtn, opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
//               onClick={handleSubmit}
//               disabled={submitting}
//             >
//               {submitting ? 'Submitting...' : 'Submit for Admin Approval →'}
//             </button>
//             <p style={{ textAlign: 'center', color: '#1e293b', fontSize: 11, marginTop: 10, paddingBottom: 32 }}>* required fields</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://127.0.0.1:8000'

const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0b0f1a 0%,#111827 60%,#0f172a 100%)',
    color: '#e2e8f0',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  navbar: {
    background: 'rgba(255,255,255,0.03)',
    borderBottom: '1px solid #1e293b',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backdropFilter: 'blur(12px)',
    marginTop: '10mm',
    gap: 12,
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  navTab: (active) => ({
    padding: '6px 18px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
    background: active ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'transparent',
    color: active ? '#fff' : '#64748b',
    letterSpacing: '.01em',
  }),
  searchWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: 260,
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    color: '#475569',
    fontSize: 12,
    pointerEvents: 'none',
  },
  searchInp: {
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 8,
    padding: '6px 12px 6px 28px',
    color: '#f1f5f9',
    fontSize: 12,
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
  },
  content: { padding: '20px 24px' },
  wrap: { maxWidth: 780, margin: '0 auto' },
  wrapWide: { maxWidth: 900, margin: '0 auto' },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid #1e293b',
    borderRadius: 20,
    padding: '24px 28px',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
    background: 'linear-gradient(90deg,#a78bfa,#34d399,#60a5fa)',
  },
  sHead: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 },
  sIcon: {
    width: 38, height: 38, borderRadius: 10, display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
  },
  sTitle: { fontSize: 15, fontWeight: 700, color: '#f1f5f9' },
  sSub:   { fontSize: 11, color: '#475569', marginTop: 1 },
  g2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 },
  g3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 },
  g4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 14 },
  lbl: {
    display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8',
    letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 5,
  },
  inp: {
    background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
    padding: '10px 14px', color: '#f1f5f9', fontSize: 13, outline: 'none',
    fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  },
  sel: {
    background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
    padding: '10px 14px', color: '#f1f5f9', fontSize: 13, outline: 'none',
    fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  },
  textarea: {
    background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
    padding: '10px 14px', color: '#f1f5f9', fontSize: 13, outline: 'none',
    fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
    resize: 'none', minHeight: 72,
  },
  req: { color: '#a78bfa' },
  submitBtn: {
    width: '100%', padding: '13px', borderRadius: 13,
    background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
    border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
    cursor: 'pointer', letterSpacing: '.02em', marginTop: 4,
  },
  avatarCircle: {
    width: 64, height: 64, borderRadius: '50%', margin: '0 auto 14px',
    background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, fontWeight: 800, color: '#fff',
  },
  tagAmber: {
    display: 'inline-block', padding: '4px 14px', borderRadius: 999,
    fontSize: 12, fontWeight: 700, background: '#451a03', color: '#fbbf24',
    border: '1px solid rgba(251,191,36,0.3)',
  },
  emptyBox: { textAlign: 'center', padding: '80px 24px', color: '#334155' },
  eduSection: {
    borderTop: '1px solid #1e293b',
    paddingTop: 18,
    marginTop: 4,
    marginBottom: 14,
  },
  eduSectionTitle: {
    fontSize: 11, fontWeight: 700, color: '#64748b',
    letterSpacing: '.06em', textTransform: 'uppercase',
    marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6,
  },
  coSwitchWrap: { position: 'relative', flexShrink: 0 },
  coSwitchBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.04)', border: '1px solid #1e293b',
    borderRadius: 10, padding: '6px 12px', cursor: 'pointer',
    color: '#e2e8f0', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
  },
  coSwitchDot: {
    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
    background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 800, color: '#fff',
  },
  coSwitchMenu: {
    position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 200,
    background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12,
    boxShadow: '0 12px 28px rgba(0,0,0,0.45)', overflow: 'hidden', zIndex: 60,
  },
  coSwitchItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 8, width: '100%',
    padding: '10px 14px', fontSize: 12, fontWeight: 600, textAlign: 'left',
    background: active ? 'rgba(167,139,250,0.12)' : 'transparent',
    color: active ? '#a78bfa' : '#cbd5e1', border: 'none', cursor: 'pointer',
  }),
}

const EMPTY_FORM = {
  empId: '',
  fullName: '', dob: '', gender: '', bloodGroup: '',
  personalEmail: '', mobile: '',
  designation: '', department: '', empType: 'Full-Time',
  pan: '', aadhar: '', uanNumber: '', pfNumber: '', bankAcc: '', ifsc: '', bankName: '',
  address: '', city: '', state: '', pin: '',
  gradDegree: '', gradCollege: '', gradUniversity: '', gradYear: '', gradGrade: '',
  pgDegree: '', pgCollege: '', pgUniversity: '', pgYear: '', pgGrade: '',
}

async function fetchNextEmpId(companyId) {
  try {
    const token = localStorage.getItem('hr_token')
    const res = await fetch(`${API_URL}/employees/last-emp-id?company_id=${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('fetch failed')
    const data = await res.json()
    const lastId = data.emp_id
    if (!lastId) return null
    const match = lastId.match(/^([A-Za-z]*)(\d+)$/)
    if (!match) return null
    const prefix = match[1]
    const nextNum = parseInt(match[2], 10) + 1
    const padded = String(nextNum).padStart(match[2].length, '0')
    return `${prefix}${padded}`
  } catch {
    return null
  }
}

// ── Edit inline fields helper ─────────────────────────────────────────────────
function EditField({ label, name, value, onChange, type = 'text', options }) {
  const editInp = {
    background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
    padding: '7px 10px', color: '#f1f5f9', fontSize: 12, outline: 'none',
    fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  }
  return (
    <div>
      <div style={{ fontSize: 10, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 600 }}>{label}</div>
      {options ? (
        <select style={{ ...editInp, colorScheme: 'dark' }} name={name} value={value || ''} onChange={onChange}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} style={{ ...editInp, colorScheme: type === 'date' ? 'dark' : undefined }} name={name} value={value || ''} onChange={onChange} />
      )}
    </div>
  )
}

// ── Employee Card ─────────────────────────────────────────────────────────────
function EmployeeCard({ emp, onSaved }) {
  const [expanded,  setExpanded]  = useState(false)
  const [editing,   setEditing]   = useState(false)
  const [editData,  setEditData]  = useState({})
  const [saving,    setSaving]    = useState(false)
  const [saveError, setSaveError] = useState('')

  const initials = emp.full_name?.trim().split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
  const COLORS = [
    'linear-gradient(135deg,#7c3aed,#a78bfa)',
    'linear-gradient(135deg,#0ea5e9,#38bdf8)',
    'linear-gradient(135deg,#10b981,#34d399)',
    'linear-gradient(135deg,#f59e0b,#fbbf24)',
    'linear-gradient(135deg,#ef4444,#f87171)',
  ]
  const avatarBg = COLORS[emp.id % COLORS.length]

  const hasGrad = emp.grad_degree || emp.grad_college || emp.grad_university || emp.grad_year || emp.grad_grade
  const hasPG   = emp.pg_degree   || emp.pg_college   || emp.pg_university   || emp.pg_year   || emp.pg_grade

  const startEdit = () => {
    setEditData({ ...emp })
    setEditing(true)
    setExpanded(true)
    setSaveError('')
  }

  const cancelEdit = () => {
    setEditing(false)
    setSaveError('')
  }

  const handleEditChange = e => {
    const { name, value } = e.target
    setEditData(p => ({ ...p, [name]: value }))
  }

  const saveEdit = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const token = localStorage.getItem('hr_token')
      const payload = {
        emp_id:          editData.emp_id         || null,
        full_name:       editData.full_name       || null,
        dob:             editData.dob             || null,
        gender:          editData.gender          || null,
        blood_group:     editData.blood_group     || null,
        personal_email:  editData.personal_email  || null,
        mobile:          editData.mobile          || null,
        designation:     editData.designation     || null,
        department:      editData.department      || null,
        emp_type:        editData.emp_type        || null,
        company_id:      editData.company_id      || null,
        pan:             editData.pan             || null,
        aadhar:          editData.aadhar          || null,
        uan_number:      editData.uan_number      || null,
        pf_number:       editData.pf_number       || null,
        bank_acc:        editData.bank_acc        || null,
        ifsc:            editData.ifsc            || null,
        bank_name:       editData.bank_name       || null,
        address:         editData.address         || null,
        city:            editData.city            || null,
        state:           editData.state           || null,
        pin:             editData.pin             || null,
        grad_degree:     editData.grad_degree     || null,
        grad_college:    editData.grad_college    || null,
        grad_university: editData.grad_university || null,
        grad_year:       editData.grad_year       || null,
        grad_grade:      editData.grad_grade      || null,
        pg_degree:       editData.pg_degree       || null,
        pg_college:      editData.pg_college      || null,
        pg_university:   editData.pg_university   || null,
        pg_year:         editData.pg_year         || null,
        pg_grade:        editData.pg_grade        || null,
      }
      const res = await fetch(`${API_URL}/employees/${emp.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Save failed')
      }
      const updated = await res.json()
      setEditing(false)
      onSaved(updated)
    } catch (err) {
      setSaveError(`⚠️ ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${editing ? '#7c3aed55' : '#1e293b'}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s' }}>

      {/* ── Card Header Row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
        {/* Avatar — clickable to expand */}
        <div
          style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0, background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer' }}
          onClick={() => !editing && setExpanded(p => !p)}
        >
          {initials}
        </div>

        {/* Name + designation — clickable to expand */}
        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => !editing && setExpanded(p => !p)}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.full_name}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{emp.designation || '—'} · {emp.department || '—'}</div>
        </div>

        {/* Emp ID badge */}
        <div style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)', flexShrink: 0 }}>
          {emp.emp_id}
        </div>

        {/* Type badge */}
        <div style={{ padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 600, background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)', flexShrink: 0 }}>
          {emp.emp_type || 'Full-Time'}
        </div>

        {/* Edit button */}
        {!editing ? (
          <button
            onClick={startEdit}
            style={{ flexShrink: 0, padding: '5px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.08)', color: '#a78bfa', transition: 'all 0.18s' }}
          >✏️ Edit</button>
        ) : (
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button
              onClick={saveEdit}
              disabled={saving}
              style={{ padding: '5px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', border: '1px solid rgba(52,211,153,0.4)', background: 'rgba(52,211,153,0.12)', color: '#34d399', opacity: saving ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              {saving ? (
                <svg style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}/><path fill="currentColor" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.75 }}/></svg>
              ) : '✓'} {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={cancelEdit}
              style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid #1e293b', background: 'transparent', color: '#475569' }}
            >Cancel</button>
          </div>
        )}

        {/* Expand chevron */}
        <div
          style={{ color: '#334155', fontSize: 11, flexShrink: 0, transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', cursor: 'pointer' }}
          onClick={() => !editing && setExpanded(p => !p)}
        >▼</div>
      </div>

      {/* ── Expanded Details ── */}
      {expanded && (
        <div style={{ borderTop: '1px solid #1e293b', padding: '18px 18px 14px' }}>

          {saveError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '8px 14px', color: '#f87171', fontSize: 12, marginBottom: 14 }}>
              {saveError}
            </div>
          )}

          {editing ? (
            /* ─── EDIT MODE ─── */
            <div>
              {/* Personal */}
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12 }}>👤 Personal Info</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 14px', marginBottom: 16 }}>
                <EditField label="Full Name"      name="full_name"      value={editData.full_name}      onChange={handleEditChange} />
                <EditField label="Mobile"         name="mobile"         value={editData.mobile}         onChange={handleEditChange} />
                <EditField label="Personal Email" name="personal_email" value={editData.personal_email} onChange={handleEditChange} type="email" />
                <EditField label="Date of Birth"  name="dob"            value={editData.dob}            onChange={handleEditChange} type="date" />
                <EditField label="Gender"         name="gender"         value={editData.gender}         onChange={handleEditChange} options={['', 'Male', 'Female', 'Other']} />
                <EditField label="Blood Group"    name="blood_group"    value={editData.blood_group}    onChange={handleEditChange} options={['', 'A+','A-','B+','B-','O+','O-','AB+','AB-']} />
              </div>

              {/* Employment */}
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12, borderTop: '1px solid #1e293b', paddingTop: 14 }}>🏢 Employment</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 14px', marginBottom: 16 }}>
                <EditField label="Designation"      name="designation" value={editData.designation} onChange={handleEditChange} />
                <EditField label="Department"       name="department"  value={editData.department}  onChange={handleEditChange} />
                <EditField label="Employment Type"  name="emp_type"    value={editData.emp_type}    onChange={handleEditChange} options={['Full-Time','Part-Time','Contract','Intern']} />
              </div>

              {/* Documents */}
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12, borderTop: '1px solid #1e293b', paddingTop: 14 }}>📋 Documents & Bank</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 14px', marginBottom: 16 }}>
                <EditField label="PAN"          name="pan"        value={editData.pan}        onChange={handleEditChange} />
                <EditField label="Aadhar"       name="aadhar"     value={editData.aadhar}     onChange={handleEditChange} />
                <EditField label="UAN Number"   name="uan_number" value={editData.uan_number} onChange={handleEditChange} />
                <EditField label="PF Number"    name="pf_number"  value={editData.pf_number}  onChange={handleEditChange} />
                <EditField label="Bank Acc No." name="bank_acc"   value={editData.bank_acc}   onChange={handleEditChange} />
                <EditField label="IFSC Code"    name="ifsc"       value={editData.ifsc}       onChange={handleEditChange} />
                <EditField label="Bank Name"    name="bank_name"  value={editData.bank_name}  onChange={handleEditChange} />
              </div>

              {/* Address */}
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12, borderTop: '1px solid #1e293b', paddingTop: 14 }}>📍 Address</div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 600 }}>Residential Address</div>
                <textarea
                  name="address"
                  value={editData.address || ''}
                  onChange={handleEditChange}
                  style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '7px 10px', color: '#f1f5f9', fontSize: 12, outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', resize: 'none', minHeight: 56 }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 14px', marginBottom: 16 }}>
                <EditField label="City"     name="city"  value={editData.city}  onChange={handleEditChange} />
                <EditField label="State"    name="state" value={editData.state} onChange={handleEditChange} />
                <EditField label="PIN Code" name="pin"   value={editData.pin}   onChange={handleEditChange} />
              </div>

              {/* Education */}
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12, borderTop: '1px solid #1e293b', paddingTop: 14 }}>🎓 Education — Graduation</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '10px 14px', marginBottom: 16 }}>
                <EditField label="Degree"      name="grad_degree"     value={editData.grad_degree}     onChange={handleEditChange} />
                <EditField label="College"     name="grad_college"    value={editData.grad_college}    onChange={handleEditChange} />
                <EditField label="University"  name="grad_university" value={editData.grad_university} onChange={handleEditChange} />
                <EditField label="Pass Year"   name="grad_year"       value={editData.grad_year}       onChange={handleEditChange} />
                <EditField label="Grade/CGPA"  name="grad_grade"      value={editData.grad_grade}      onChange={handleEditChange} />
              </div>

              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12, borderTop: '1px solid #1e293b', paddingTop: 14 }}>🎓 Education — Post Graduation</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '10px 14px', marginBottom: 10 }}>
                <EditField label="Degree"      name="pg_degree"     value={editData.pg_degree}     onChange={handleEditChange} />
                <EditField label="College"     name="pg_college"    value={editData.pg_college}    onChange={handleEditChange} />
                <EditField label="University"  name="pg_university" value={editData.pg_university} onChange={handleEditChange} />
                <EditField label="Pass Year"   name="pg_year"       value={editData.pg_year}       onChange={handleEditChange} />
                <EditField label="Grade/CGPA"  name="pg_grade"      value={editData.pg_grade}      onChange={handleEditChange} />
              </div>

              {/* Save/Cancel bottom row */}
              <div style={{ display: 'flex', gap: 10, marginTop: 16, borderTop: '1px solid #1e293b', paddingTop: 14 }}>
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg,#10b981,#34d399)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
                >
                  {saving ? 'Saving...' : '✓ Save Changes'}
                </button>
                <button
                  onClick={cancelEdit}
                  style={{ padding: '10px 24px', borderRadius: 10, background: 'transparent', border: '1px solid #1e293b', color: '#475569', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >Cancel</button>
              </div>
            </div>

          ) : (
            /* ─── VIEW MODE ─── */
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 20px', marginBottom: 12 }}>
                {[
                  ['📱 Mobile', emp.mobile], ['📧 Email', emp.personal_email],
                  ['🎂 DOB', emp.dob], ['👤 Gender', emp.gender],
                  ['🩸 Blood Group', emp.blood_group], ['🆔 PAN', emp.pan],
                  ['🔑 Aadhar', emp.aadhar], ['🔢 UAN Number', emp.uan_number],
                  ['📁 PF Number', emp.pf_number], ['🏦 Bank Acc', emp.bank_acc],
                  ['🏦 IFSC', emp.ifsc], ['🏦 Bank Name', emp.bank_name],
                  ['🏙️ City', emp.city], ['🗺️ State', emp.state],
                ].map(([label, val]) => val ? (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: '#475569', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{val}</div>
                  </div>
                ) : null)}
                {emp.address && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: 10, color: '#475569', marginBottom: 2 }}>📍 Address</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{emp.address}{emp.pin ? ` - ${emp.pin}` : ''}</div>
                  </div>
                )}
              </div>

              {hasGrad && (
                <div style={{ borderTop: '1px solid #1e293b', paddingTop: 10, marginTop: 4 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>🎓 Graduation</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px 16px' }}>
                    {[['Degree', emp.grad_degree], ['College', emp.grad_college], ['University', emp.grad_university], ['Pass Year', emp.grad_year], ['Grade/CGPA', emp.grad_grade]].map(([l, v]) => v ? (
                      <div key={l}><div style={{ fontSize: 10, color: '#475569', marginBottom: 2 }}>{l}</div><div style={{ fontSize: 12, color: '#94a3b8' }}>{v}</div></div>
                    ) : null)}
                  </div>
                </div>
              )}

              {hasPG && (
                <div style={{ borderTop: '1px solid #1e293b', paddingTop: 10, marginTop: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>🎓 Post Graduation</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px 16px' }}>
                    {[['Degree', emp.pg_degree], ['College', emp.pg_college], ['University', emp.pg_university], ['Pass Year', emp.pg_year], ['Grade/CGPA', emp.pg_grade]].map(([l, v]) => v ? (
                      <div key={l}><div style={{ fontSize: 10, color: '#475569', marginBottom: 2 }}>{l}</div><div style={{ fontSize: 12, color: '#94a3b8' }}>{v}</div></div>
                    ) : null)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── All Employees Tab ─────────────────────────────────────────────────────────
function AllEmployees({ companyId, companyName, search, onAddClick }) {
  const [employees, setEmployees] = useState([])
  const [loading,   setLoading]   = useState(true)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('hr_token')
      const res   = await fetch(`${API_URL}/employees/?company_id=${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setEmployees(Array.isArray(data) ? data : [])
    } catch { setEmployees([]) }
    finally  { setLoading(false) }
  }, [companyId])

  useEffect(() => { fetchEmployees() }, [fetchEmployees])

  // Called when an employee card saves successfully
  const handleSaved = (updated) => {
    setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e))
  }

  const filtered = employees.filter(e =>
    !search ||
    e.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.emp_id?.toLowerCase().includes(search.toLowerCase()) ||
    e.designation?.toLowerCase().includes(search.toLowerCase()) ||
    e.department?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: '#475569' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div><p>Loading employees...</p>
    </div>
  )

  if (employees.length === 0) return (
    <div style={S.emptyBox}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>👥</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#475569', marginBottom: 8 }}>No Employees Yet</h3>
      <p style={{ fontSize: 13, color: '#334155', marginBottom: 24 }}>{companyName} मध्ये अजून कोणताही employee add केला नाही.</p>
      <button style={{ ...S.submitBtn, width: 'auto', padding: '10px 28px' }} onClick={onAddClick}>➕ Add First Employee</button>
    </div>
  )

  return (
    <div style={S.wrapWide}>
      <p style={{ fontSize: 11, color: '#475569', marginBottom: 14, letterSpacing: '.04em', textTransform: 'uppercase' }}>
        {companyName} · {filtered.length} / {employees.length} employee{employees.length !== 1 ? 's' : ''}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0
          ? <div style={{ textAlign: 'center', padding: 40, color: '#475569' }}>"{search}" — कोणताही employee सापडला नाही</div>
          : filtered.map(emp => <EmployeeCard key={emp.id} emp={emp} onSaved={handleSaved} />)
        }
      </div>
    </div>
  )
}

// ── Company Switcher (dropdown in navbar) ──────────────────────────────────────
function CompanySwitcher({ selectedCompany, companies, open, setOpen, onSwitch }) {
  const name     = selectedCompany?.name || 'Company'
  const initials = name.trim().split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'

  return (
    <div style={S.coSwitchWrap}>
      <button type="button" style={S.coSwitchBtn} onClick={() => setOpen(o => !o)}>
        <span style={S.coSwitchDot}>{initials}</span>
        <span>{name}</span>
        <span style={{ fontSize: 9, color: '#475569' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 55 }} onClick={() => setOpen(false)} />
          <div style={S.coSwitchMenu}>
            {companies.length === 0 && (
              <div style={{ padding: '10px 14px', fontSize: 11, color: '#475569' }}>No companies found</div>
            )}
            {companies.map(co => (
              <button
                key={co.id}
                type="button"
                style={S.coSwitchItem(co.id === selectedCompany?.id)}
                onClick={() => onSwitch(co)}
              >
                {co.name}{co.id === selectedCompany?.id ? ' ✓' : ''}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AddEmployee() {
  const { selectedCompany, setSelectedCompany } = useAuth()
  const companyName = selectedCompany?.name || 'Company'
  const companyId   = selectedCompany?.id

  const [tab,        setTab]        = useState('list')
  const [search,     setSearch]     = useState('')
  const [submitted,  setSubmitted]  = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [empIdMode,     setEmpIdMode]     = useState('auto')
  const [autoIdLoading, setAutoIdLoading] = useState(false)

  // ── Company switcher (so user need not go back to CompaniesPage) ──────────
  const [companies,       setCompanies]       = useState([])
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('hr_token')
        const res   = await fetch(`${API_URL}/companies/`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) return
        const data = await res.json()
        setCompanies(data)
      } catch { /* silently ignore — switcher just won't show options */ }
    }
    fetchCompanies()
  }, [])

  const handleCompanySwitch = (company) => {
    setCompanyMenuOpen(false)
    if (company.id === selectedCompany?.id) return
    setSelectedCompany(company)
    // Prefix depends on company — old empId / mode no longer valid
    setForm(p => ({ ...p, empId: '' }))
    setEmpIdMode('auto')
    setTab('list')
    setSubmitted(false)
  }

  const set = e => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })) }
  const initials = form.fullName.trim().split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
  const resetForm = () => { setSubmitted(false); setForm(EMPTY_FORM) }

  const handleAutoGenerate = async () => {
    setAutoIdLoading(true)
    const nextId = await fetchNextEmpId(companyId)
    if (nextId) {
      setForm(p => ({ ...p, empId: nextId }))
    } else {
      alert('Could not fetch last Employee ID from server. Please enter manually.')
    }
    setAutoIdLoading(false)
  }

  const handleSubmit = async () => {
    if (!form.fullName || !form.mobile) { alert('Please Enter Full Name & Mobile Number'); return }
    setSubmitting(true)
    try {
      const token = localStorage.getItem('hr_token')
      const res = await fetch(`${API_URL}/notifications/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          emp_id:          form.empId          || null,
          full_name:       form.fullName,
          dob:             form.dob            || null,
          gender:          form.gender         || null,
          blood_group:     form.bloodGroup     || null,
          personal_email:  form.personalEmail  || null,
          mobile:          form.mobile,
          designation:     form.designation    || null,
          department:      form.department     || null,
          emp_type:        form.empType,
          pan:             form.pan            || null,
          aadhar:          form.aadhar         || null,
          uan_number:      form.uanNumber      || null,
          pf_number:       form.pfNumber       || null,
          bank_acc:        form.bankAcc        || null,
          ifsc:            form.ifsc           || null,
          bank_name:       form.bankName       || null,
          address:         form.address        || null,
          city:            form.city           || null,
          state:           form.state          || null,
          pin:             form.pin            || null,
          company_id:      companyId           || null,
          grad_degree:     form.gradDegree     || null,
          grad_college:    form.gradCollege    || null,
          grad_university: form.gradUniversity || null,
          grad_year:       form.gradYear       || null,
          grad_grade:      form.gradGrade      || null,
          pg_degree:       form.pgDegree       || null,
          pg_college:      form.pgCollege      || null,
          pg_university:   form.pgUniversity   || null,
          pg_year:         form.pgYear         || null,
          pg_grade:        form.pgGrade        || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Submit failed')
      setSubmitted(true)
    } catch (e) { alert(e.message) }
    finally     { setSubmitting(false) }
  }

  // ── Navbar: All Employees | Add Employee | [Search — right of Add Employee when list tab]

  if (tab === 'form' && submitted) {
    return (
      <div style={S.page}>
        <nav style={S.navbar}>
          <div style={S.navLeft}>
            <button style={S.navTab(tab === 'list')} onClick={() => { setTab('list'); resetForm() }}>👥 All Employees</button>
            <button style={S.navTab(tab === 'form')} onClick={() => { setTab('form'); resetForm() }}>➕ Add Employee</button>
            {tab === 'list' && (
              <div style={S.searchWrap}>
                <span style={S.searchIcon}>🔍</span>
                <input
                  style={S.searchInp}
                  placeholder="Search name, ID, dept..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    style={{ position: 'absolute', right: 8, background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 11, lineHeight: 1 }}
                  >✕</button>
                )}
              </div>
            )}
          </div>
          <CompanySwitcher
            selectedCompany={selectedCompany}
            companies={companies}
            open={companyMenuOpen}
            setOpen={setCompanyMenuOpen}
            onSwitch={handleCompanySwitch}
          />
        </nav>
        <div style={S.content}>
          <div style={S.wrap}>
            <div style={{ ...S.card, textAlign: 'center', padding: '48px 28px' }}>
              <div style={S.accent} />
              <div style={S.avatarCircle}>{initials}</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>{form.fullName}</h2>
              {form.empId && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ padding: '3px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
                    {form.empId}
                  </span>
                </div>
              )}
              <div style={{ marginBottom: 24, marginTop: 12 }}><span style={S.tagAmber}>⏳ Admin Approval Pending</span></div>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.8, marginBottom: 28 }}>
                तुमचा request admin कडे पाठवला आहे.<br/>Admin approve केल्यावर Employee ID generate होईल.
              </p>
              <button style={{ ...S.submitBtn, background: 'transparent', border: '1px solid #1e293b', color: '#64748b' }} onClick={resetForm}>← Edit Form</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={S.page}>
      <nav style={S.navbar}>
        <div style={S.navLeft}>
          <button style={S.navTab(tab === 'list')} onClick={() => { setTab('list'); resetForm() }}>👥 All Employees</button>
          <button style={S.navTab(tab === 'form')} onClick={() => { setTab('form'); resetForm() }}>➕ Add Employee</button>
          {tab === 'list' && (
            <div style={S.searchWrap}>
              <span style={S.searchIcon}>🔍</span>
              <input
                style={S.searchInp}
                placeholder="Search name, ID, dept..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: 8, background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 11, lineHeight: 1 }}
                >✕</button>
              )}
            </div>
          )}
        </div>
        <CompanySwitcher
          selectedCompany={selectedCompany}
          companies={companies}
          open={companyMenuOpen}
          setOpen={setCompanyMenuOpen}
          onSwitch={handleCompanySwitch}
        />
      </nav>
      <div style={S.content}>

        {tab === 'list' && (
          <AllEmployees companyId={companyId} companyName={companyName} search={search} onAddClick={() => setTab('form')} />
        )}

        {tab === 'form' && (
          <div style={S.wrap}>

            {/* ── Personal Info ── */}
            <div style={S.card}>
              <div style={S.accent} />
              <div style={S.sHead}>
                <div style={{ ...S.sIcon, background: '#1e1b4b' }}>👤</div>
                <div><div style={S.sTitle}>Personal Information</div><div style={S.sSub}>Basic personal details</div></div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={S.lbl}>Employee ID</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  {[
                    { key: 'auto',   label: '⚡ Auto Generate (last ID + 1)' },
                    { key: 'manual', label: '✏️ Enter Existing ID' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setEmpIdMode(key); setForm(p => ({ ...p, empId: '' })) }}
                      style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                        cursor: 'pointer',
                        border: empIdMode === key ? '1px solid rgba(167,139,250,0.5)' : '1px solid #1e293b',
                        background: empIdMode === key ? 'rgba(167,139,250,0.12)' : 'transparent',
                        color: empIdMode === key ? '#a78bfa' : '#475569',
                        transition: 'all 0.18s',
                      }}
                    >{label}</button>
                  ))}
                </div>

                {empIdMode === 'auto' ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      style={{ ...S.inp, flex: 1, fontFamily: 'monospace', letterSpacing: '.05em', color: form.empId ? '#34d399' : '#475569' }}
                      value={form.empId || 'Click Generate to fetch next ID'}
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={handleAutoGenerate}
                      disabled={autoIdLoading}
                      style={{ flexShrink: 0, padding: '10px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: autoIdLoading ? 'not-allowed' : 'pointer', opacity: autoIdLoading ? 0.6 : 1, whiteSpace: 'nowrap' }}
                    >{autoIdLoading ? 'Fetching...' : '⚡ Generate'}</button>
                  </div>
                ) : (
                  <div>
                    <input style={{ ...S.inp, fontFamily: 'monospace', letterSpacing: '.05em' }} name="empId" value={form.empId} onChange={set} placeholder="Enter existing Employee ID — e.g. SGT1005" />
                    <p style={{ fontSize: 10, color: '#475569', marginTop: 5 }}>Use this option when the employee already exists but their information is not in the database yet.</p>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={S.lbl}>Full Name <span style={S.req}>*</span></label>
                <input style={S.inp} name="fullName" value={form.fullName} onChange={set} placeholder="e.g. Sumit Kumar" />
              </div>
              <div style={S.g3}>
                <div><label style={S.lbl}>Date of Birth</label><input type="date" style={{ ...S.inp, colorScheme: 'dark' }} name="dob" value={form.dob} onChange={set} /></div>
                <div><label style={S.lbl}>Gender</label><select style={S.sel} name="gender" value={form.gender} onChange={set}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
                <div><label style={S.lbl}>Blood Group</label><select style={S.sel} name="bloodGroup" value={form.bloodGroup} onChange={set}><option value="">Select</option>{['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}</select></div>
              </div>
              <div style={S.g2}>
                <div><label style={S.lbl}>Personal Email</label><input type="email" style={S.inp} name="personalEmail" value={form.personalEmail} onChange={set} placeholder="raj@gmail.com" /></div>
                <div><label style={S.lbl}>Mobile <span style={S.req}>*</span></label><input type="tel" style={S.inp} name="mobile" value={form.mobile} onChange={set} placeholder="9876543210" maxLength={10} /></div>
              </div>
            </div>

            {/* ── Employment Details ── */}
            <div style={S.card}>
              <div style={S.accent} />
              <div style={S.sHead}>
                <div style={{ ...S.sIcon, background: '#042c53' }}>🏢</div>
                <div><div style={S.sTitle}>Employment Details</div><div style={S.sSub}>Role, department and work info</div></div>
              </div>
              <div style={S.g2}>
                <div><label style={S.lbl}>Designation <span style={S.req}>*</span></label><input style={S.inp} name="designation" value={form.designation} onChange={set} placeholder="e.g. Software Engineer, Team Lead" /></div>
                <div><label style={S.lbl}>Department <span style={S.req}>*</span></label><input style={S.inp} name="department" value={form.department} onChange={set} placeholder="e.g. Backend Development, DevOps" /></div>
              </div>
              <div style={S.g2}>
                <div><label style={S.lbl}>Employment Type</label><select style={S.sel} name="empType" value={form.empType} onChange={set}><option>Full-Time</option><option>Part-Time</option><option>Contract</option><option>Intern</option></select></div>
              </div>
            </div>

            {/* ── Education Details ── */}
            <div style={S.card}>
              <div style={S.accent} />
              <div style={S.sHead}>
                <div style={{ ...S.sIcon, background: '#0c1a0e' }}>🎓</div>
                <div><div style={S.sTitle}>Education Details</div><div style={S.sSub}>Graduation & Post Graduation info</div></div>
              </div>
              <div style={{ marginBottom: 6 }}>
                <div style={S.eduSectionTitle}>
                  <span style={{ display: 'inline-block', width: 20, height: 20, borderRadius: 6, background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', fontSize: 10, textAlign: 'center', lineHeight: '20px', color: '#60a5fa' }}>G</span>
                  Graduation
                </div>
              </div>
              <div style={S.g2}>
                <div><label style={S.lbl}>Degree</label><input style={S.inp} name="gradDegree" value={form.gradDegree} onChange={set} placeholder="e.g. B.E. Computer, B.Sc IT, BCA" /></div>
                <div><label style={S.lbl}>College Name</label><input style={S.inp} name="gradCollege" value={form.gradCollege} onChange={set} placeholder="e.g. MIT College of Engineering" /></div>
              </div>
              <div style={S.g3}>
                <div><label style={S.lbl}>University</label><input style={S.inp} name="gradUniversity" value={form.gradUniversity} onChange={set} placeholder="e.g. SPPU, Mumbai University" /></div>
                <div><label style={S.lbl}>Passing Year</label><input style={S.inp} name="gradYear" value={form.gradYear} onChange={set} placeholder="e.g. 2021" maxLength={4} /></div>
                <div><label style={S.lbl}>Percentage / CGPA</label><input style={S.inp} name="gradGrade" value={form.gradGrade} onChange={set} placeholder="e.g. 72% or 7.8 CGPA" /></div>
              </div>
              <div style={S.eduSection}>
                <div style={S.eduSectionTitle}>
                  <span style={{ display: 'inline-block', width: 20, height: 20, borderRadius: 6, background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', fontSize: 10, textAlign: 'center', lineHeight: '20px', color: '#a78bfa' }}>PG</span>
                  Post Graduation <span style={{ color: '#334155', fontWeight: 400, fontSize: 10 }}>(optional)</span>
                </div>
              </div>
              <div style={S.g2}>
                <div><label style={S.lbl}>Degree</label><input style={S.inp} name="pgDegree" value={form.pgDegree} onChange={set} placeholder="e.g. M.Tech, MBA, MCA, M.Sc" /></div>
                <div><label style={S.lbl}>College Name</label><input style={S.inp} name="pgCollege" value={form.pgCollege} onChange={set} placeholder="e.g. Symbiosis Institute" /></div>
              </div>
              <div style={S.g3}>
                <div><label style={S.lbl}>University</label><input style={S.inp} name="pgUniversity" value={form.pgUniversity} onChange={set} placeholder="e.g. SPPU, Symbiosis University" /></div>
                <div><label style={S.lbl}>Passing Year</label><input style={S.inp} name="pgYear" value={form.pgYear} onChange={set} placeholder="e.g. 2023" maxLength={4} /></div>
                <div><label style={S.lbl}>Percentage / CGPA</label><input style={S.inp} name="pgGrade" value={form.pgGrade} onChange={set} placeholder="e.g. 80% or 8.5 CGPA" /></div>
              </div>
            </div>

            {/* ── Documents & Compliance ── */}
            <div style={S.card}>
              <div style={S.accent} />
              <div style={S.sHead}>
                <div style={{ ...S.sIcon, background: '#1a0a00' }}>📋</div>
                <div><div style={S.sTitle}>Documents & Compliance</div><div style={S.sSub}>Identity, bank and address details</div></div>
              </div>
              <div style={S.g2}>
                <div><label style={S.lbl}>PAN Number</label><input style={{ ...S.inp, textTransform: 'uppercase' }} name="pan" value={form.pan} onChange={set} placeholder="ABCDE1234F" maxLength={10} /></div>
                <div><label style={S.lbl}>Aadhar Number</label><input style={S.inp} name="aadhar" value={form.aadhar} onChange={set} placeholder="1234 5678 9012" maxLength={14} /></div>
              </div>
              <div style={S.g2}>
                <div><label style={S.lbl}>UAN Number</label><input style={S.inp} name="uanNumber" value={form.uanNumber} onChange={set} placeholder="100123456789" maxLength={12} /></div>
                <div><label style={S.lbl}>PF Number</label><input style={{ ...S.inp, textTransform: 'uppercase' }} name="pfNumber" value={form.pfNumber} onChange={set} placeholder="MH/PUN/1234567/000/0000001" /></div>
              </div>
              <div style={S.g3}>
                <div><label style={S.lbl}>Bank Account No.</label><input style={S.inp} name="bankAcc" value={form.bankAcc} onChange={set} placeholder="012345678901" /></div>
                <div><label style={S.lbl}>IFSC Code</label><input style={{ ...S.inp, textTransform: 'uppercase' }} name="ifsc" value={form.ifsc} onChange={set} placeholder="HDFC0001234" /></div>
                <div><label style={S.lbl}>Bank Name</label><input style={S.inp} name="bankName" value={form.bankName} onChange={set} placeholder="HDFC Bank" /></div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.lbl}>Residential Address</label>
                <textarea style={S.textarea} name="address" value={form.address} onChange={set} placeholder="Flat No., Building, Street, Area" />
              </div>
              <div style={S.g3}>
                <div><label style={S.lbl}>City</label><input style={S.inp} name="city" value={form.city} onChange={set} placeholder="Pune" /></div>
                <div><label style={S.lbl}>State</label><input style={S.inp} name="state" value={form.state} onChange={set} placeholder="Maharashtra" /></div>
                <div><label style={S.lbl}>PIN Code</label><input style={S.inp} name="pin" value={form.pin} onChange={set} placeholder="411014" maxLength={6} /></div>
              </div>
            </div>

            <button
              style={{ ...S.submitBtn, opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit for Admin Approval →'}
            </button>
            <p style={{ textAlign: 'center', color: '#1e293b', fontSize: 11, marginTop: 10, paddingBottom: 32 }}>* required fields</p>
          </div>
        )}
      </div>
    </div>
  )
}