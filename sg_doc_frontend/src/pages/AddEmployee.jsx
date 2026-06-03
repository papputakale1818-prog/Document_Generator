// import { useState } from 'react'

// const CO = {
//   fullName:   'SoftGrid Info Pvt. Ltd.',
//   themeColor: '#7c3aed',
// }

// const IT_DEPARTMENTS = [
//   'Select Department',
//   'Software Development',
//   'Frontend Development',
//   'Backend Development',
//   'Full Stack Development',
//   'Mobile Development',
//   'DevOps & Cloud',
//   'QA & Testing',
//   'UI/UX Design',
//   'Data Science & AI',
//   'Cybersecurity',
//   'Database Administration',
//   'Network & Infrastructure',
//   'IT Support',
//   'Product Management',
//   'Business Analysis',
//   'Project Management',
// ]

// const DESIGNATIONS = [
//   'Select Designation',
//   'Software Engineer',
//   'Senior Software Engineer',
//   'Lead Engineer',
//   'Principal Engineer',
//   'Junior Developer',
//   'Trainee Developer',
//   'Frontend Developer',
//   'Backend Developer',
//   'Full Stack Developer',
//   'Mobile Developer (Android)',
//   'Mobile Developer (iOS)',
//   'React Native Developer',
//   'DevOps Engineer',
//   'Cloud Engineer',
//   'QA Engineer',
//   'Senior QA Engineer',
//   'UI/UX Designer',
//   'Product Designer',
//   'Data Analyst',
//   'Data Scientist',
//   'ML Engineer',
//   'Database Administrator',
//   'Network Engineer',
//   'Cybersecurity Analyst',
//   'IT Support Engineer',
//   'Business Analyst',
//   'Project Manager',
//   'Product Manager',
//   'Scrum Master',
//   'Technical Lead',
//   'Engineering Manager',
// ]

// const S = {
//   page: {
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg,#0b0f1a 0%,#111827 60%,#0f172a 100%)',
//     color: '#e2e8f0',
//     fontFamily: "'Segoe UI', Arial, sans-serif",
//     padding: '32px 24px',
//   },
//   header: { maxWidth: 780, margin: '0 auto 28px' },
//   titleGrad: {
//     fontSize: 26, fontWeight: 800, marginBottom: 4,
//     background: 'linear-gradient(90deg,#a78bfa,#34d399,#60a5fa)',
//     WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//     backgroundClip: 'text',
//   },
//   subtitle: { fontSize: 12, color: '#475569', letterSpacing: '.05em', textTransform: 'uppercase' },

//   wrap: { maxWidth: 780, margin: '0 auto' },

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
//   sSub: { fontSize: 11, color: '#475569', marginTop: 1 },

//   g2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 },
//   g3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 },

//   lbl: {
//     display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8',
//     letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 5,
//   },
//   inp: {
//     background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
//     padding: '10px 14px', color: '#f1f5f9', fontSize: 13, outline: 'none',
//     fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', transition: 'border-color .2s',
//   },
//   sel: {
//     background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
//     padding: '10px 14px', color: '#f1f5f9', fontSize: 13, outline: 'none',
//     fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
//   },
//   textarea: {
//     background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
//     padding: '10px 14px', color: '#f1f5f9', fontSize: 13, outline: 'none',
//     fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', resize: 'none', minHeight: 72,
//   },

//   req: { color: '#a78bfa' },

//   submitBtn: {
//     width: '100%', padding: '13px', borderRadius: 13,
//     background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
//     border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
//     cursor: 'pointer', letterSpacing: '.02em', marginTop: 4,
//   },

//   // Pending badge
//   pendingCard: {
//     background: '#0f172a', border: '1px solid rgba(167,139,250,0.3)',
//     borderRadius: 16, padding: '28px 24px', textAlign: 'center',
//   },
//   avatarCircle: {
//     width: 64, height: 64, borderRadius: '50%', margin: '0 auto 14px',
//     background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
//     display: 'flex', alignItems: 'center', justifyContent: 'center',
//     fontSize: 22, fontWeight: 800, color: '#fff',
//   },
//   tagPurple: {
//     display: 'inline-block', padding: '3px 10px', borderRadius: 999,
//     fontSize: 11, fontWeight: 600, background: '#2e1065', color: '#c4b5fd',
//   },
//   tagAmber: {
//     display: 'inline-block', padding: '4px 14px', borderRadius: 999,
//     fontSize: 12, fontWeight: 700, background: '#451a03', color: '#fbbf24',
//     border: '1px solid rgba(251,191,36,0.3)',
//   },
//   tagGreen: {
//     display: 'inline-block', padding: '4px 14px', borderRadius: 999,
//     fontSize: 12, fontWeight: 700, background: '#14532d', color: '#86efac',
//     border: '1px solid rgba(134,239,172,0.3)',
//   },
// }

// function genTempId() {
//   return 'PENDING-' + Math.random().toString(36).substring(2,7).toUpperCase()
// }

// export default function AddEmployee() {
//   const [submitted, setSubmitted]   = useState(false)
//   const [approved,  setApproved]    = useState(false)
//   const [empId,     setEmpId]       = useState('')
//   const [pendingRef] = useState(genTempId)

//   const [form, setForm] = useState({
//     fullName: '', dob: '', gender: '', bloodGroup: '',
//     personalEmail: '', mobile: '',
//     designation: '', department: '', empType: 'Full-Time',
//     pan: '', aadhar: '', bankAcc: '', ifsc: '', bankName: '',
//     address: '', city: '', state: '', pin: '',
//   })

//   const set = e => {
//     const { name, value } = e.target
//     setForm(p => ({ ...p, [name]: value }))
//   }

//   const initials = form.fullName.trim().split(' ').filter(Boolean)
//     .map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'

//   const handleSubmit = () => {
//     if (!form.fullName || !form.mobile) {
//       alert('Please fill in Full Name and Mobile Number.')
//       return
//     }
//     setSubmitted(true)
//   }

//   const handleApprove = () => {
//     // Auto-generate Emp ID: SG + year + 4-digit seq
//     const year = new Date().getFullYear().toString().slice(-2)
//     const seq  = String(Math.floor(1000 + Math.random() * 9000))
//     setEmpId('SG' + year + seq)
//     setApproved(true)
//   }

//   // ── Pending Approval Screen ───────────────────────────────────────────────
//   if (submitted && !approved) {
//     return (
//       <div style={S.page}>
//         <div style={S.wrap}>
//           <div style={{ ...S.card, ...S.pendingCard }}>
//             <div style={S.accent} />
//             <div style={S.avatarCircle}>{initials}</div>
//             <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>
//               {form.fullName || 'New Employee'}
//             </h2>
//             <p style={{ fontSize: 12, color: '#475569', marginBottom: 16 }}>
//               {form.designation || '—'} · {form.department || '—'}
//             </p>
//             <div style={{ marginBottom: 20 }}>
//               <span style={S.tagAmber}>⏳ Admin Approval Pending</span>
//             </div>
//             <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
//               Reference ID
//             </p>
//             <div style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa',
//               fontFamily: 'monospace', letterSpacing: '.08em', marginBottom: 24 }}>
//               {pendingRef}
//             </div>
//             <p style={{ fontSize: 12, color: '#475569', marginBottom: 28, lineHeight: 1.7 }}>
//               Form submitted successfully. Employee ID will be<br/>
//               auto-generated once admin approves the request.
//             </p>

//             {/* Simulate Admin Approve button */}
//             <div style={{ background: '#111827', border: '1px dashed #334155',
//               borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
//               <p style={{ fontSize: 11, color: '#475569', marginBottom: 10,
//                 textTransform: 'uppercase', letterSpacing: '.04em' }}>
//                 Admin Panel (Simulate)
//               </p>
//               <button style={{ ...S.submitBtn, background: 'linear-gradient(135deg,#16a34a,#22c55e)', marginTop: 0 }}
//                 onClick={handleApprove}>
//                 ✓ Approve & Generate Employee ID
//               </button>
//             </div>

//             <button style={{ ...S.submitBtn, background: 'transparent',
//               border: '1px solid #1e293b', color: '#64748b' }}
//               onClick={() => setSubmitted(false)}>
//               ← Edit Form
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // ── Approved / Success Screen ─────────────────────────────────────────────
//   if (approved) {
//     return (
//       <div style={S.page}>
//         <div style={S.wrap}>
//           <div style={{ ...S.card, textAlign: 'center', padding: '36px 28px' }}>
//             <div style={S.accent} />
//             <div style={{ width: 68, height: 68, borderRadius: '50%',
//               background: 'linear-gradient(135deg,#14532d,#22c55e)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontSize: 28, margin: '0 auto 14px' }}>✓</div>
//             <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>
//               Employee Registered!
//             </h2>
//             <p style={{ fontSize: 13, color: '#475569', marginBottom: 22 }}>
//               Successfully added to {CO.fullName}.
//             </p>

//             <div style={{ background: '#0f172a', border: '1px solid rgba(34,197,94,0.2)',
//               borderRadius: 16, padding: '20px 24px', marginBottom: 20, textAlign: 'left' }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
//                 <div style={{ ...S.avatarCircle, margin: 0, width: 50, height: 50, fontSize: 18 }}>
//                   {initials}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{form.fullName || 'New Employee'}</div>
//                   <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
//                     {form.designation} · {form.department}
//                   </div>
//                 </div>
//                 <span style={S.tagGreen}>Active</span>
//               </div>
//               <div style={{ background: '#111827', borderRadius: 10, padding: '12px 16px',
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <span style={{ fontSize: 12, color: '#64748b' }}>Employee ID</span>
//                 <span style={{ fontSize: 16, fontWeight: 800, color: '#a78bfa',
//                   fontFamily: 'monospace', letterSpacing: '.08em' }}>{empId}</span>
//               </div>
//             </div>

//             <div style={{ display: 'flex', gap: 12 }}>
//               <button style={{ ...S.submitBtn, flex: 1,
//                 background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
//                 Generate Offer Letter
//               </button>
//               <button style={{ ...S.submitBtn, flex: 1, background: 'transparent',
//                 border: '1px solid #1e293b', color: '#64748b' }}
//                 onClick={() => {
//                   setSubmitted(false); setApproved(false); setEmpId('')
//                   setForm({ fullName:'', dob:'', gender:'', bloodGroup:'',
//                     personalEmail:'', mobile:'',
//                     designation:'', department:'', empType:'Full-Time',
//                     pan:'', aadhar:'', bankAcc:'', ifsc:'', bankName:'',
//                     address:'', city:'', state:'', pin:'', })
//                 }}>
//                 Add Another
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // ── Main Form ─────────────────────────────────────────────────────────────
//   return (
//     <div style={S.page}>
//       <div style={S.header}>
//         <h1 style={S.titleGrad}>Add New Employee</h1>
//         <p style={S.subtitle}>{CO.fullName} &nbsp;·&nbsp; Employee Registration</p>
//       </div>

//       <div style={S.wrap}>

//         {/* ── 1. Personal Info ── */}
//         <div style={S.card}>
//           <div style={S.accent} />
//           <div style={S.sHead}>
//             <div style={{ ...S.sIcon, background: '#1e1b4b', fontSize: 20 }}>👤</div>
//             <div>
//               <div style={S.sTitle}>Personal Information</div>
//               <div style={S.sSub}>Basic personal details</div>
//             </div>
//           </div>

//           <div style={{ marginBottom: 14 }}>
//             <label style={S.lbl}>Full Name <span style={S.req}>*</span></label>
//             <input style={S.inp} name="fullName" value={form.fullName}
//               onChange={set} placeholder="e.g. Rajendra Takale" />
//           </div>

//           <div style={S.g3}>
//             <div>
//               <label style={S.lbl}>Date of Birth</label>
//               <input type="date" style={{ ...S.inp, colorScheme: 'dark' }}
//                 name="dob" value={form.dob} onChange={set} />
//             </div>
//             <div>
//               <label style={S.lbl}>Gender</label>
//               <select style={S.sel} name="gender" value={form.gender} onChange={set}>
//                 <option value="">Select</option>
//                 <option>Male</option><option>Female</option><option>Other</option>
//               </select>
//             </div>
//             <div>
//               <label style={S.lbl}>Blood Group</label>
//               <select style={S.sel} name="bloodGroup" value={form.bloodGroup} onChange={set}>
//                 <option value="">Select</option>
//                 {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}
//               </select>
//             </div>
//           </div>

//           <div style={S.g2}>
//             <div>
//               <label style={S.lbl}>Personal Email</label>
//               <input type="email" style={S.inp} name="personalEmail"
//                 value={form.personalEmail} onChange={set} placeholder="raj@gmail.com" />
//             </div>
//             <div>
//               <label style={S.lbl}>Mobile <span style={S.req}>*</span></label>
//               <input type="tel" style={S.inp} name="mobile"
//                 value={form.mobile} onChange={set} placeholder="9876543210" maxLength={10} />
//             </div>
//           </div>

//         </div>

//         {/* ── 2. Employment Details ── */}
//         <div style={S.card}>
//           <div style={S.accent} />
//           <div style={S.sHead}>
//             <div style={{ ...S.sIcon, background: '#042c53', fontSize: 20 }}>🏢</div>
//             <div>
//               <div style={S.sTitle}>Employment Details</div>
//               <div style={S.sSub}>Role, department and work info</div>
//             </div>
//           </div>

//           <div style={S.g2}>
//             <div>
//               <label style={S.lbl}>Designation <span style={S.req}>*</span></label>
//               <select style={S.sel} name="designation" value={form.designation} onChange={set}>
//                 {DESIGNATIONS.map(d => <option key={d} value={d === 'Select Designation' ? '' : d}>{d}</option>)}
//               </select>
//             </div>
//             <div>
//               <label style={S.lbl}>Department <span style={S.req}>*</span></label>
//               <select style={S.sel} name="department" value={form.department} onChange={set}>
//                 {IT_DEPARTMENTS.map(d => <option key={d} value={d === 'Select Department' ? '' : d}>{d}</option>)}
//               </select>
//             </div>
//           </div>

//           <div style={S.g2}>
//             <div>
//               <label style={S.lbl}>Employment Type</label>
//               <select style={S.sel} name="empType" value={form.empType} onChange={set}>
//                 <option>Full-Time</option><option>Part-Time</option>
//                 <option>Contract</option><option>Intern</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* ── 3. Documents & Compliance ── */}
//         <div style={S.card}>
//           <div style={S.accent} />
//           <div style={S.sHead}>
//             <div style={{ ...S.sIcon, background: '#1a0a00', fontSize: 20 }}>📋</div>
//             <div>
//               <div style={S.sTitle}>Documents & Compliance</div>
//               <div style={S.sSub}>Identity, bank and address details</div>
//             </div>
//           </div>

//           <div style={S.g2}>
//             <div>
//               <label style={S.lbl}>PAN Number</label>
//               <input style={{ ...S.inp, textTransform: 'uppercase' }} name="pan"
//                 value={form.pan} onChange={set} placeholder="ABCDE1234F" maxLength={10} />
//             </div>
//             <div>
//               <label style={S.lbl}>Aadhar Number</label>
//               <input style={S.inp} name="aadhar" value={form.aadhar}
//                 onChange={set} placeholder="1234 5678 9012" maxLength={14} />
//             </div>
//           </div>

//           <div style={S.g3}>
//             <div>
//               <label style={S.lbl}>Bank Account No.</label>
//               <input style={S.inp} name="bankAcc" value={form.bankAcc}
//                 onChange={set} placeholder="012345678901" />
//             </div>
//             <div>
//               <label style={S.lbl}>IFSC Code</label>
//               <input style={{ ...S.inp, textTransform: 'uppercase' }} name="ifsc"
//                 value={form.ifsc} onChange={set} placeholder="HDFC0001234" />
//             </div>
//             <div>
//               <label style={S.lbl}>Bank Name</label>
//               <input style={S.inp} name="bankName" value={form.bankName}
//                 onChange={set} placeholder="HDFC Bank" />
//             </div>
//           </div>

//           <div style={{ marginBottom: 14 }}>
//             <label style={S.lbl}>Residential Address</label>
//             <textarea style={S.textarea} name="address" value={form.address}
//               onChange={set} placeholder="Flat No., Building, Street, Area" />
//           </div>

//           <div style={S.g3}>
//             <div>
//               <label style={S.lbl}>City</label>
//               <input style={S.inp} name="city" value={form.city} onChange={set} placeholder="Pune" />
//             </div>
//             <div>
//               <label style={S.lbl}>State</label>
//               <input style={S.inp} name="state" value={form.state} onChange={set} placeholder="Maharashtra" />
//             </div>
//             <div>
//               <label style={S.lbl}>PIN Code</label>
//               <input style={S.inp} name="pin" value={form.pin}
//                 onChange={set} placeholder="411014" maxLength={6} />
//             </div>
//           </div>
//         </div>

//         {/* ── Submit ── */}
//         <button style={S.submitBtn} onClick={handleSubmit}>
//           Submit for Admin Approval →
//         </button>
//         <p style={{ textAlign: 'center', color: '#1e293b', fontSize: 11, marginTop: 10, paddingBottom: 32 }}>
//           * required fields &nbsp;·&nbsp; {CO.fullName}
//         </p>

//       </div>
//     </div>
//   )
// }
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const IT_DEPARTMENTS = [
  'Select Department',
  'Software Development', 'Frontend Development', 'Backend Development',
  'Full Stack Development', 'Mobile Development', 'DevOps & Cloud',
  'QA & Testing', 'UI/UX Design', 'Data Science & AI', 'Cybersecurity',
  'Database Administration', 'Network & Infrastructure', 'IT Support',
  'Product Management', 'Business Analysis', 'Project Management',
]

const DESIGNATIONS = [
  'Select Designation',
  'Software Engineer', 'Senior Software Engineer', 'Lead Engineer',
  'Principal Engineer', 'Junior Developer', 'Trainee Developer',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Mobile Developer (Android)', 'Mobile Developer (iOS)', 'React Native Developer',
  'DevOps Engineer', 'Cloud Engineer', 'QA Engineer', 'Senior QA Engineer',
  'UI/UX Designer', 'Product Designer', 'Data Analyst', 'Data Scientist',
  'ML Engineer', 'Database Administrator', 'Network Engineer',
  'Cybersecurity Analyst', 'IT Support Engineer', 'Business Analyst',
  'Project Manager', 'Product Manager', 'Scrum Master',
  'Technical Lead', 'Engineering Manager',
]

const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0b0f1a 0%,#111827 60%,#0f172a 100%)',
    color: '#e2e8f0',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },

  // ── Navbar ──
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
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: 8 },
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
  companyBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(167,139,250,0.08)',
    border: '1px solid rgba(167,139,250,0.2)',
    borderRadius: 10,
    padding: '5px 14px',
    fontSize: 12,
    fontWeight: 600,
    color: '#a78bfa',
  },

  // ── Content ──
  content: { padding: '32px 24px' },
  header: { maxWidth: 780, margin: '0 auto 28px' },
  titleGrad: {
    fontSize: 26, fontWeight: 800, marginBottom: 4,
    background: 'linear-gradient(90deg,#a78bfa,#34d399,#60a5fa)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: { fontSize: 12, color: '#475569', letterSpacing: '.05em', textTransform: 'uppercase' },
  wrap: { maxWidth: 780, margin: '0 auto' },

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

  // ── Pending / Approved ──
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
  tagGreen: {
    display: 'inline-block', padding: '4px 14px', borderRadius: 999,
    fontSize: 12, fontWeight: 700, background: '#14532d', color: '#86efac',
    border: '1px solid rgba(134,239,172,0.3)',
  },

  // ── All Employees ──
  emptyBox: {
    textAlign: 'center', padding: '80px 24px',
    color: '#334155',
  },
}

function genTempId() {
  return 'PENDING-' + Math.random().toString(36).substring(2, 7).toUpperCase()
}

const EMPTY_FORM = {
  fullName: '', dob: '', gender: '', bloodGroup: '',
  personalEmail: '', mobile: '',
  designation: '', department: '', empType: 'Full-Time',
  pan: '', aadhar: '', bankAcc: '', ifsc: '', bankName: '',
  address: '', city: '', state: '', pin: '',
}

export default function AddEmployee() {
  const { selectedCompany } = useAuth()
  const companyName = selectedCompany?.name || 'Company'

  // ── Tab: 'list' | 'form'
  const [tab, setTab] = useState('list')

  // ── Form state ──
  const [submitted, setSubmitted] = useState(false)
  const [approved,  setApproved]  = useState(false)
  const [empId,     setEmpId]     = useState('')
  const [pendingRef] = useState(genTempId)
  const [form, setForm] = useState(EMPTY_FORM)

  const set = e => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
  }

  const initials = form.fullName.trim().split(' ').filter(Boolean)
    .map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'

  const handleSubmit = () => {
    if (!form.fullName || !form.mobile) {
      alert('Please fill in Full Name and Mobile Number.')
      return
    }
    setSubmitted(true)
  }

  const handleApprove = () => {
    const year = new Date().getFullYear().toString().slice(-2)
    const seq  = String(Math.floor(1000 + Math.random() * 9000))
    setEmpId('SG' + year + seq)
    setApproved(true)
  }

  const resetForm = () => {
    setSubmitted(false); setApproved(false); setEmpId('')
    setForm(EMPTY_FORM)
  }

  // ── Navbar ──────────────────────────────────────────────────────────────
  const Navbar = () => (
    <nav style={S.navbar}>
      <div style={S.navLeft}>
        <button style={S.navTab(tab === 'list')} onClick={() => { setTab('list'); resetForm() }}>
          👥 All Employees
        </button>
        <button style={S.navTab(tab === 'form')} onClick={() => { setTab('form'); resetForm() }}>
          ➕ Add Employee
        </button>
      </div>
      <div style={S.companyBadge}>
        🏢 {companyName}
      </div>
    </nav>
  )

  // ── All Employees Tab ────────────────────────────────────────────────────
  if (tab === 'list') {
    return (
      <div style={S.page}>
        <Navbar />
        <div style={S.content}>
          <div style={S.wrap}>
            <div style={S.emptyBox}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>👥</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
                No Employees Yet
              </h3>
              <p style={{ fontSize: 13, color: '#334155', marginBottom: 24 }}>
                {companyName} मध्ये अजून कोणताही employee add केला नाही.
              </p>
              <button
                style={{ ...S.submitBtn, width: 'auto', padding: '10px 28px' }}
                onClick={() => setTab('form')}
              >
                ➕ Add First Employee
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Pending Approval Screen ──────────────────────────────────────────────
  if (tab === 'form' && submitted && !approved) {
    return (
      <div style={S.page}>
        <Navbar />
        <div style={S.content}>
          <div style={S.wrap}>
            <div style={{ ...S.card, textAlign: 'center', padding: '36px 28px' }}>
              <div style={S.accent} />
              <div style={S.avatarCircle}>{initials}</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>
                {form.fullName || 'New Employee'}
              </h2>
              <p style={{ fontSize: 12, color: '#475569', marginBottom: 16 }}>
                {form.designation || '—'} · {form.department || '—'}
              </p>
              <div style={{ marginBottom: 20 }}>
                <span style={S.tagAmber}>⏳ Admin Approval Pending</span>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Reference ID</p>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa',
                fontFamily: 'monospace', letterSpacing: '.08em', marginBottom: 24 }}>
                {pendingRef}
              </div>
              <p style={{ fontSize: 12, color: '#475569', marginBottom: 28, lineHeight: 1.7 }}>
                Form submitted successfully. Employee ID will be<br/>
                auto-generated once admin approves the request.
              </p>
              <div style={{ background: '#111827', border: '1px dashed #334155',
                borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: '#475569', marginBottom: 10,
                  textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  Admin Panel (Simulate)
                </p>
                <button style={{ ...S.submitBtn,
                  background: 'linear-gradient(135deg,#16a34a,#22c55e)', marginTop: 0 }}
                  onClick={handleApprove}>
                  ✓ Approve & Generate Employee ID
                </button>
              </div>
              <button style={{ ...S.submitBtn, background: 'transparent',
                border: '1px solid #1e293b', color: '#64748b' }}
                onClick={() => setSubmitted(false)}>
                ← Edit Form
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Approved / Success Screen ────────────────────────────────────────────
  if (tab === 'form' && approved) {
    return (
      <div style={S.page}>
        <Navbar />
        <div style={S.content}>
          <div style={S.wrap}>
            <div style={{ ...S.card, textAlign: 'center', padding: '36px 28px' }}>
              <div style={S.accent} />
              <div style={{ width: 68, height: 68, borderRadius: '50%',
                background: 'linear-gradient(135deg,#14532d,#22c55e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, margin: '0 auto 14px' }}>✓</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>
                Employee Registered!
              </h2>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 22 }}>
                Successfully added to {companyName}.
              </p>
              <div style={{ background: '#0f172a', border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 16, padding: '20px 24px', marginBottom: 20, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div style={{ ...S.avatarCircle, margin: 0, width: 50, height: 50, fontSize: 18 }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{form.fullName}</div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                      {form.designation} · {form.department}
                    </div>
                  </div>
                  <span style={S.tagGreen}>Active</span>
                </div>
                <div style={{ background: '#111827', borderRadius: 10, padding: '12px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Employee ID</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#a78bfa',
                    fontFamily: 'monospace', letterSpacing: '.08em' }}>{empId}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{ ...S.submitBtn, flex: 1,
                  background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                  Generate Offer Letter
                </button>
                <button style={{ ...S.submitBtn, flex: 1, background: 'transparent',
                  border: '1px solid #1e293b', color: '#64748b' }}
                  onClick={resetForm}>
                  Add Another
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Main Form ────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.content}>
        <div style={S.header}>
          <h1 style={S.titleGrad}>Add New Employee</h1>
          <p style={S.subtitle}>{companyName} &nbsp;·&nbsp; Employee Registration</p>
        </div>

        <div style={S.wrap}>

          {/* ── 1. Personal Info ── */}
          <div style={S.card}>
            <div style={S.accent} />
            <div style={S.sHead}>
              <div style={{ ...S.sIcon, background: '#1e1b4b', fontSize: 20 }}>👤</div>
              <div>
                <div style={S.sTitle}>Personal Information</div>
                <div style={S.sSub}>Basic personal details</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={S.lbl}>Full Name <span style={S.req}>*</span></label>
              <input style={S.inp} name="fullName" value={form.fullName}
                onChange={set} placeholder="e.g. Rajendra Takale" />
            </div>

            <div style={S.g3}>
              <div>
                <label style={S.lbl}>Date of Birth</label>
                <input type="date" style={{ ...S.inp, colorScheme: 'dark' }}
                  name="dob" value={form.dob} onChange={set} />
              </div>
              <div>
                <label style={S.lbl}>Gender</label>
                <select style={S.sel} name="gender" value={form.gender} onChange={set}>
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label style={S.lbl}>Blood Group</label>
                <select style={S.sel} name="bloodGroup" value={form.bloodGroup} onChange={set}>
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div style={S.g2}>
              <div>
                <label style={S.lbl}>Personal Email</label>
                <input type="email" style={S.inp} name="personalEmail"
                  value={form.personalEmail} onChange={set} placeholder="raj@gmail.com" />
              </div>
              <div>
                <label style={S.lbl}>Mobile <span style={S.req}>*</span></label>
                <input type="tel" style={S.inp} name="mobile"
                  value={form.mobile} onChange={set} placeholder="9876543210" maxLength={10} />
              </div>
            </div>
          </div>

          {/* ── 2. Employment Details ── */}
          <div style={S.card}>
            <div style={S.accent} />
            <div style={S.sHead}>
              <div style={{ ...S.sIcon, background: '#042c53', fontSize: 20 }}>🏢</div>
              <div>
                <div style={S.sTitle}>Employment Details</div>
                <div style={S.sSub}>Role, department and work info</div>
              </div>
            </div>

            <div style={S.g2}>
              <div>
                <label style={S.lbl}>Designation <span style={S.req}>*</span></label>
                <select style={S.sel} name="designation" value={form.designation} onChange={set}>
                  {DESIGNATIONS.map(d => <option key={d} value={d === 'Select Designation' ? '' : d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={S.lbl}>Department <span style={S.req}>*</span></label>
                <select style={S.sel} name="department" value={form.department} onChange={set}>
                  {IT_DEPARTMENTS.map(d => <option key={d} value={d === 'Select Department' ? '' : d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div style={S.g2}>
              <div>
                <label style={S.lbl}>Employment Type</label>
                <select style={S.sel} name="empType" value={form.empType} onChange={set}>
                  <option>Full-Time</option><option>Part-Time</option>
                  <option>Contract</option><option>Intern</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── 3. Documents & Compliance ── */}
          <div style={S.card}>
            <div style={S.accent} />
            <div style={S.sHead}>
              <div style={{ ...S.sIcon, background: '#1a0a00', fontSize: 20 }}>📋</div>
              <div>
                <div style={S.sTitle}>Documents & Compliance</div>
                <div style={S.sSub}>Identity, bank and address details</div>
              </div>
            </div>

            <div style={S.g2}>
              <div>
                <label style={S.lbl}>PAN Number</label>
                <input style={{ ...S.inp, textTransform: 'uppercase' }} name="pan"
                  value={form.pan} onChange={set} placeholder="ABCDE1234F" maxLength={10} />
              </div>
              <div>
                <label style={S.lbl}>Aadhar Number</label>
                <input style={S.inp} name="aadhar" value={form.aadhar}
                  onChange={set} placeholder="1234 5678 9012" maxLength={14} />
              </div>
            </div>

            <div style={S.g3}>
              <div>
                <label style={S.lbl}>Bank Account No.</label>
                <input style={S.inp} name="bankAcc" value={form.bankAcc}
                  onChange={set} placeholder="012345678901" />
              </div>
              <div>
                <label style={S.lbl}>IFSC Code</label>
                <input style={{ ...S.inp, textTransform: 'uppercase' }} name="ifsc"
                  value={form.ifsc} onChange={set} placeholder="HDFC0001234" />
              </div>
              <div>
                <label style={S.lbl}>Bank Name</label>
                <input style={S.inp} name="bankName" value={form.bankName}
                  onChange={set} placeholder="HDFC Bank" />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={S.lbl}>Residential Address</label>
              <textarea style={S.textarea} name="address" value={form.address}
                onChange={set} placeholder="Flat No., Building, Street, Area" />
            </div>

            <div style={S.g3}>
              <div>
                <label style={S.lbl}>City</label>
                <input style={S.inp} name="city" value={form.city} onChange={set} placeholder="Pune" />
              </div>
              <div>
                <label style={S.lbl}>State</label>
                <input style={S.inp} name="state" value={form.state} onChange={set} placeholder="Maharashtra" />
              </div>
              <div>
                <label style={S.lbl}>PIN Code</label>
                <input style={S.inp} name="pin" value={form.pin}
                  onChange={set} placeholder="411014" maxLength={6} />
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <button style={S.submitBtn} onClick={handleSubmit}>
            Submit for Admin Approval →
          </button>
          <p style={{ textAlign: 'center', color: '#1e293b', fontSize: 11, marginTop: 10, paddingBottom: 32 }}>
            * required fields &nbsp;·&nbsp; {companyName}
          </p>
        </div>
      </div>
    </div>
  )
}