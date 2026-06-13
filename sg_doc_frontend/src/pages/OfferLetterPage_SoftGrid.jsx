
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import OfferLetterPDFViewer from '../components/Offerletterpdfviewer'

const API_URL = 'http://127.0.0.1:8000'

const CO = {
  fullName:      'SoftGrid Info Pvt. Ltd.',
  fullNameUpper: 'SOFTGRID INFO PVT. LTD.',
  initials:      'SG',
  website:       'www.softgridinfo.in',
  email:         'hr@softgridinfo.in',
  address:       'Office No. 203, Khandagale Complex<br>Behind EON Hospital, Kharadi Bypass<br>Pune MH - 411014',
  addressFooter: 'Office No. 203, Khandagale Complex, Behind EON Hospital, Kharadi Bypass, Pune MH -411014',
  gstin:         '27ABJCS4985R1Z4',
  tan:           'PNES82511C',
  themeColor:    '#2e7d32',
  headerColor:   '#2e7d32',
}

const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
function toWords(n) { n=Math.round(n); if(!n) return "Zero Rupees"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim()+" Rupees" }
function fmtNum(n) { if(n===null||n===undefined||isNaN(n)||n===0) return "—"; return Math.round(n).toLocaleString("en-IN") }
function fmtNumRaw(n) { if(n===null||n===undefined||isNaN(n)) return "0"; return Math.round(n).toLocaleString("en-IN") }
function fmtDate(d) { if(!d) return "—"; const dt=new Date(d); const day=dt.getDate(); const s=day===1?"st":day===2?"nd":day===3?"rd":"th"; return `${day}${s} ${dt.toLocaleDateString("en-IN",{month:"long",year:"numeric"})}` }
function fmtDateSimple(d) { if(!d) return "—"; return new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}) }

export default function OfferLetterPage_SoftGrid() {
  const { selectedCompany } = useAuth()

  const [form, setForm] = useState({
    empId: '',
    fullName: '', designation: '', department: '', manager: '',
    location: 'Pune , Maharashtra ',
    offerDate: '', joiningDate: '', appointDate: '',
    contractPeriod: '12 Months',
    annualGross: '',
    monthlyGrossInput: '',
    salaryInputMode: 'monthly',
    withPF: true,
    pfRate: 12,
    pfEmrRate: 13,
  })

  const [saveLoading,      setSaveLoading]      = useState(false)
  const [saveSuccess,      setSaveSuccess]       = useState('')
  const [saveError,        setSaveError]         = useState('')
  const [empLookupLoading, setEmpLookupLoading]  = useState(false)
  const [empLookupError,   setEmpLookupError]    = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => {
      const next = { ...prev, [name]: value }
      if (name === 'monthlyGrossInput') {
        const m = parseFloat(value) || 0
        next.annualGross = m > 0 ? String(Math.round(m * 12)) : ''
      }
      if (name === 'annualGross') {
        const a = parseFloat(value) || 0
        next.monthlyGrossInput = a > 0 ? String(Math.round(a / 12)) : ''
      }
      return next
    })
  }

  const fetchEmployeeById = async (empId) => {
    if (!empId.trim()) return
    setEmpLookupLoading(true)
    setEmpLookupError('')
    try {
      const token = localStorage.getItem('hr_token')
      const res = await fetch(`${API_URL}/employees/${empId.trim()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        if (res.status === 404) throw new Error(`Employee ID "${empId}" not found`)
        throw new Error('Lookup failed')
      }
      const emp = await res.json()
      setForm(prev => {
        const annual = emp.annual_gross ? String(Math.round(emp.annual_gross)) : prev.annualGross
        const monthly = annual ? String(Math.round(parseFloat(annual) / 12)) : prev.monthlyGrossInput
        return {
          ...prev,
          fullName:          emp.full_name        || emp.name              || prev.fullName,
          designation:       emp.designation      || emp.position          || prev.designation,
          department:        emp.department                                || prev.department,
          manager:           emp.manager          || emp.reporting_manager || prev.manager,
          location:          emp.location         || emp.work_location     || prev.location,
          annualGross:       annual,
          monthlyGrossInput: monthly,
        }
      })
    } catch (err) {
      setEmpLookupError(`⚠️ ${err.message}`)
    } finally {
      setEmpLookupLoading(false)
    }
  }

  const annual  = form.salaryInputMode === 'monthly'
    ? (parseFloat(form.monthlyGrossInput) || 0) * 12
    : parseFloat(form.annualGross) || 0
  const monthly     = Math.round(annual / 12)
  const basicFinal  = monthly > 0 ? Math.round(monthly * 0.40) : 0
  const da          = monthly > 0 ? Math.round(basicFinal * 0.50) : 0
  const hra         = monthly > 0 ? Math.round(basicFinal * 0.40) : 0
  const conv        = monthly > 0 ? 1600 : 0
  const med         = monthly > 0 ? 1250 : 0
  const otherAllow  = monthly > 0 ? (monthly - basicFinal - da - hra - conv - med) : 0
  const grossM      = monthly
  const grossY      = annual
  const pfEmpM      = form.withPF ? Math.round((basicFinal + da) * Number(form.pfRate) / 100) : 0
  const pfEmrM      = form.withPF ? Math.round((basicFinal + da) * Number(form.pfEmrRate) / 100) : 0
  const pt          = monthly > 0 ? 200 : 0
  const netM        = monthly - pfEmpM - pt
  const netY        = netM * 12
  const ctcM        = monthly + pfEmrM
  const ctcA        = ctcM * 12

  const salaryRows = [
    { label: "Basic Salary (Basic)",                                     m: basicFinal,  y: basicFinal*12, type: ""        },
    { label: "Dearness Allowance (DA)",                                  m: da,          y: da*12,         type: ""        },
    { label: "House Rent Allowance (HRA)",                               m: hra,         y: hra*12,        type: ""        },
    { label: "Conveyance Allowance",                                     m: conv,        y: conv*12,       type: ""        },
    { label: "Medical Allowance",                                        m: med,         y: med*12,        type: ""        },
    { label: "Incentives",                                               m: null,        y: null,          type: "na"      },
    { label: "Other Allowance",                                          m: otherAllow,  y: otherAllow*12, type: ""        },
    { label: "Gross Salary",                                             m: grossM,      y: grossY,        type: "gross"   },
    { label: "Provident Fund (Employee Deduction)",  naNote: form.withPF ? null : "Not Applicable*",
      m: form.withPF ? pfEmpM : null, y: form.withPF ? pfEmpM*12 : null,                type: "deduct"  },
    { label: "ESIC (Employee Deduction)",            naNote: "Not Applicable*",
      m: null,        y: null,                                                           type: "deduct"  },
    { label: "Professional Tax (Employee Deduction)", naNote: null,
      m: pt,          y: pt*12,                                                          type: "deduct"  },
    { label: "TDS (Depends on IT Slabs & Exemptions/Loan Recovery)",     m: null,        y: null,          type: "na"      },
    { label: "Net Salary",                                               m: netM,        y: netY,          type: "net"     },
    { label: "Provident Fund (Employer Contribution)", naNote: form.withPF ? null : "Not Applicable*",
      m: form.withPF ? pfEmrM : null, y: form.withPF ? pfEmrM*12 : null,                type: "employer"},
    { label: "ESIC (Employer Contribution)",                             m: null,        y: null,          type: "na"      },
    { label: "Gratuity (Employer Contribution)",                         m: null,        y: null,          type: "na"      },
    { label: "Bonus (Employer Contribution)",                            m: null,        y: null,          type: "na"      },
    { label: "Variable Pay (Employer Contribution)",                     m: null,        y: null,          type: "na"      },
    { label: "Cost To Company (CTC)",                                    m: ctcM,        y: ctcA,          type: "ctc"     },
  ]

  // ─── Save to DB ───────────────────────────────────────────────────────────
  const saveToDB = async () => {
    if (!form.empId.trim()) { setSaveError('Please Enter Employee ID'); return }
    if (!form.fullName)     { setSaveError('Please Enter Employee Name'); return }
    setSaveLoading(true); setSaveError(''); setSaveSuccess('')
    try {
      const token = localStorage.getItem('hr_token')
      const res = await fetch(`${API_URL}/offer-letters/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          emp_id:          form.empId.trim(),       // ✅ emp_id added
          company_id:      selectedCompany?.id || null,
          full_name:       form.fullName,
          designation:     form.designation,
          department:      form.department,
          manager:         form.manager,
          location:        form.location,
          offer_date:      form.offerDate,
          joining_date:    form.joiningDate,
          appoint_date:    form.appointDate,
          contract_period: form.contractPeriod,
          annual_gross:    annual,
          monthly_gross:   monthly,
          basic:           basicFinal,
          da, hra,
          conveyance:      conv,
          medical:         med,
          special:         otherAllow,
          net_monthly:     netM,
          annual_ctc:      ctcA,
          pf_employee:     form.withPF,
          pf_employer:     form.withPF,
          esi_on:          false,
          pf_rate:         Number(form.pfRate),
          pf_emr_rate:     Number(form.pfEmrRate),
        }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Save failed') }
      const data = await res.json()
      setSaveSuccess(`✅ Offer Letter save झाला! EMP ID: ${data.emp_id}`)
    } catch (err) {
      setSaveError(`⚠️ ${err.message}`)
    } finally {
      setSaveLoading(false)
    }
  }

  const [showViewer, setShowViewer] = useState(false)

  // ─── form → letter shape (for OfferLetterPDFViewer) ──────────────────────
  const letterData = {
    emp_id:          form.empId,
    full_name:       form.fullName,
    designation:     form.designation,
    department:      form.department,
    location:        form.location,
    offer_date:      form.offerDate,
    joining_date:    form.joiningDate,
    contract_period: form.contractPeriod,
    annual_gross:    annual,
    monthly_gross:   monthly,
    basic:           basicFinal,
    da,
    hra,
    conveyance:      conv,
    medical:         med,
    special:         otherAllow,
    net_monthly:     netM,
    annual_ctc:      ctcA,
    pf_employee:     form.withPF,
    pf_employer:     form.withPF,
    pf_rate:         Number(form.pfRate),
    pf_emr_rate:     Number(form.pfEmrRate),
  }


  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-indigo-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">

      {/* ── PDF Viewer ── */}
      {showViewer && (
        <OfferLetterPDFViewer
          letter={letterData}
          onClose={() => setShowViewer(false)}
        />
      )}

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Offer Letter Generator</h1>
        <p className="text-gray-500 text-sm mb-8">{CO.fullName}</p>

        <div className="max-w-2xl space-y-6">

          {/* Employee Info */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-indigo-400 mb-5">👤 Employee Information</h2>
            <div className="space-y-4">
              <div>
                <label className={lbl}>Employee ID <span className="text-red-400 text-xs">*Required</span> <span className="text-gray-500 text-xs">(Enter ID → auto-fill)</span></label>
                <div className="flex gap-2 mt-1">
                  <input
                    name="empId"
                    value={form.empId}
                    onChange={handleChange}
                    onKeyDown={e => e.key === 'Enter' && fetchEmployeeById(form.empId)}
                    placeholder="e.g. SG264527"
                    className={inp + " flex-1"}
                  />
                  <button
                    onClick={() => fetchEmployeeById(form.empId)}
                    disabled={empLookupLoading || !form.empId.trim()}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    {empLookupLoading
                      ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      : '🔍'}
                    {empLookupLoading ? 'Fetching...' : 'Fetch'}
                  </button>
                </div>
                {empLookupError && <div className="mt-1 text-red-400 text-xs">{empLookupError}</div>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Full Name</label><input name="fullName" value={form.fullName} onChange={handleChange} placeholder="e.g. Kiran Sharma" className={inp} /></div>
                <div><label className={lbl}>Designation</label><input name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Test Engineer" className={inp} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Department</label><input name="department" value={form.department} onChange={handleChange} placeholder="e.g. QA" className={inp} /></div>
                <div><label className={lbl}>Reporting Manager</label><input name="manager" value={form.manager} onChange={handleChange} className={inp} /></div>
              </div>
              <div><label className={lbl}>Work Location</label><input name="location" value={form.location} onChange={handleChange} className={inp} /></div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-cyan-400 mb-5">📅 Important Dates</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Offer Date</label><input type="date" name="offerDate" value={form.offerDate} onChange={handleChange} className={inp+" [color-scheme:dark]"} /></div>
                <div><label className={lbl}>Date of Joining</label><input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} className={inp+" [color-scheme:dark]"} /></div>
              </div>
              <div>
                <label className={lbl}>Appointment Date</label>
                <input type="date" name="appointDate" value={form.appointDate} onChange={handleChange} className={inp+" [color-scheme:dark]"} />
              </div>
              <div>
                <label className={lbl}>Contract Period</label>
                <select name="contractPeriod" value={form.contractPeriod} onChange={handleChange} className={inp+" cursor-pointer"} style={{colorScheme:'dark',backgroundColor:'#1e293b'}}>
                  <option value="3 Months">3 Months Probation</option>
                  <option value="6 Months">6 Months Probation</option>
                  <option value="12 Months">12 Months (incl. probation)</option>
                  <option value="24 Months">24 Months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-amber-400 mb-5">₹ Salary Details</h2>
            <div className="flex gap-2 mb-4">
              <button onClick={() => setForm(p => ({ ...p, salaryInputMode: 'monthly' }))} className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${form.salaryInputMode === 'monthly' ? 'border-amber-500 bg-amber-500/20 text-amber-300' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>Enter Monthly</button>
              <button onClick={() => setForm(p => ({ ...p, salaryInputMode: 'annual' }))}  className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${form.salaryInputMode === 'annual'  ? 'border-amber-500 bg-amber-500/20 text-amber-300' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>Enter Annual</button>
            </div>
            {form.salaryInputMode === 'monthly' ? (
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Monthly Gross (₹)</label><input type="number" name="monthlyGrossInput" value={form.monthlyGrossInput} onChange={handleChange} placeholder="e.g. 25000" className={inp+" text-amber-400 font-bold"} /></div>
                <div><label className={lbl}>Annual Gross (₹) <span className="text-gray-500 text-xs">auto</span></label><input type="number" name="annualGross" value={form.annualGross} onChange={handleChange} placeholder="Auto calculated" className={inp+" text-amber-300 opacity-70"} /></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Annual Gross (₹)</label><input type="number" name="annualGross" value={form.annualGross} onChange={handleChange} placeholder="e.g. 300000" className={inp+" text-amber-400 font-bold"} /></div>
                <div><label className={lbl}>Monthly Gross (₹) <span className="text-gray-500 text-xs">auto</span></label><input type="number" name="monthlyGrossInput" value={form.monthlyGrossInput} onChange={handleChange} placeholder="Auto calculated" className={inp+" text-amber-300 opacity-70"} /></div>
              </div>
            )}
            {monthly > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-5 mb-5">
                {[
                  { label:"Annual Gross", value:annual,  cls:"text-amber-400",   bg:"bg-amber-500/10 border-amber-500/20" },
                  { label:"Net / Month",  value:netM,    cls:"text-emerald-400", bg:"bg-emerald-500/10 border-emerald-500/20" },
                  { label:"Annual CTC",   value:ctcA,    cls:"text-indigo-400",  bg:"bg-indigo-500/10 border-indigo-500/20" },
                ].map(({ label, value, cls, bg }) => (
                  <div key={label} className={`${bg} border rounded-xl p-3 text-center`}>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
                    <div className={`${cls} font-bold text-sm`}>₹ {fmtNumRaw(value)}</div>
                  </div>
                ))}
              </div>
            )}
            {monthly > 0 && (
              <div className="rounded-xl overflow-hidden border border-white/10 mt-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-700/60 to-green-600/40">
                      {["Particulars","Monthly (₹)","Annual (₹)"].map((h,i) => (
                        <th key={h} className={`px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white ${i===0?"text-left":"text-right"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {salaryRows.map(({ label, naNote, m, y, type }, i) => {
                      const cls = { gross:"bg-green-500/10 text-green-300 font-bold", net:"bg-amber-500/10 text-amber-300 font-bold", ctc:"bg-indigo-500/10 text-indigo-300 font-bold", deduct:"text-rose-300", employer:"text-blue-300", na:"text-gray-600" }[type] || "text-gray-300"
                      return (
                        <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${cls}`}>
                          <td className="px-3 py-2"><div>{label}</div>{naNote && <div className="text-red-400 text-xs ml-1">({naNote})</div>}</td>
                          <td className="px-3 py-2 text-right font-mono">{m!==null ? fmtNumRaw(m) : <span className="text-gray-600">NA</span>}</td>
                          <td className="px-3 py-2 text-right font-mono">{y!==null ? fmtNumRaw(y) : <span className="text-gray-600">NA</span>}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* PF Option */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-purple-400 mb-2">🛡️ PF Option</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setForm(p => ({ ...p, withPF: true }))}  className={`py-4 rounded-xl border-2 font-semibold text-sm transition-all ${form.withPF  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/20' : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20'}`}><div className="text-2xl mb-2">✅</div><div>With PF</div><div className="text-xs font-normal mt-1 opacity-70">PF deduction + employer contribution</div></button>
              <button onClick={() => setForm(p => ({ ...p, withPF: false }))} className={`py-4 rounded-xl border-2 font-semibold text-sm transition-all ${!form.withPF ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow-lg shadow-rose-500/20'     : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20'}`}><div className="text-2xl mb-2">❌</div><div>Without PF</div><div className="text-xs font-normal mt-1 opacity-70">PF Not Applicable</div></button>
            </div>
            {form.withPF && (
              <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/10">
                <div><label className={lbl}>Employee PF Rate (%)</label><input type="number" name="pfRate" value={form.pfRate} onChange={handleChange} min={0} max={12} className={inp} /></div>
                <div><label className={lbl}>Employer PF Rate (%)</label><input type="number" name="pfEmrRate" value={form.pfEmrRate} onChange={handleChange} min={0} max={13} className={inp} /></div>
              </div>
            )}
          </div>

          {saveError   && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{saveError}</div>}
          {saveSuccess && <div className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">{saveSuccess}</div>}

          <div className="pb-8">
            <button
              onClick={async () => { await saveToDB(); setShowViewer(true) }}
              disabled={saveLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-semibold hover:scale-105 active:scale-95 transition text-white text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {saveLoading ? (
                <><svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving...</>
              ) : '💾 Save & Generate PDF'}
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}