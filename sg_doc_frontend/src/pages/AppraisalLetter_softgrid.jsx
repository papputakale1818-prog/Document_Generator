
import { useState } from 'react'

import { useAuth } from '../context/AuthContext'
import { openAppraisalPDF } from '../components/Appraisalletterpreviewsoftgrid'

const CO = {
  fullName: 'SoftGrid Info Pvt. Ltd.',
}

const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
function toWords(n) { n=Math.round(n); if(!n) return "Zero"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim() }
function fmtNum(n) { if(!n||isNaN(n)) return "0"; return Math.round(n).toLocaleString("en-IN") }

function calcSalary(monthly) {
  const m = parseFloat(monthly) || 0
  const a = m * 12
  const basic      = Math.round(m * 0.40)
  const da         = Math.round(basic * 0.50)
  const hra        = Math.round(basic * 0.40)
  const conv       = m > 0 ? 1600 : 0
  const med        = m > 0 ? 1250 : 0
  const special    = m - basic - da - hra - conv - med
  const pf         = Math.round((basic + da) * 0.12)
  const ctcMonthly = m + Math.round((basic + da) * 0.13)
  return {
    basic:   basic * 12,
    da:      da * 12,
    hra:     hra * 12,
    conv:    conv * 12,
    med:     med * 12,
    special: special * 12,
    pf:      pf * 12,
    gross:   a,
    ctc:     ctcMonthly * 12,
    monthly: m,
  }
}

const ROWS = [
  { label: 'Basic',                   key: 'basic'   },
  { label: 'DA',                      key: 'da'      },
  { label: 'HRA',                     key: 'hra'     },
  { label: 'Conveyance allowances',   key: 'conv'    },
  { label: 'Medical allowances',      key: 'med'     },
  { label: 'Special Allowances',      key: 'special' },
  { label: "Co.'s Contribution to PF", key: 'pf'    },
]

export default function SalaryAppraisalPage_SoftGrid() {
  const { selectedCompany } = useAuth()

  const [form, setForm] = useState({
    empName: '', empId: '', designation: '', letterDate: '', effectiveDate: '',
    curMonthly: '', newMonthly: '',
  })
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'empId') setFetchError('')
  }

  const fetchEmployee = async () => {
    const empId = form.empId.trim()
    if (!empId) { setFetchError('Please enter Emp ID first'); return }
    const companyId = selectedCompany?.id || selectedCompany?.company_id
    setFetching(true)
    setFetchError('')
    try {
      const token = localStorage.getItem('hr_token')
      const res = await fetch(
        `http://127.0.0.1:8000/employees/by-emp-id?emp_id=${encodeURIComponent(empId)}&company_id=${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setFetchError(err.detail || 'Employee not found')
        return
      }
      const data = await res.json()
      setForm(prev => ({
        ...prev,
        empName:    data.full_name      || data.name        || prev.empName,
        designation: data.designation   || data.position    || prev.designation,
        curMonthly: data.current_salary || data.monthly_salary || prev.curMonthly,
      }))
    } catch {
      setFetchError('Could not connect to server')
    } finally {
      setFetching(false)
    }
  }

  const cur = calcSalary(form.curMonthly)
  const nw  = calcSalary(form.newMonthly)

  const saveAppraisalRecord = async () => {
    try {
      const token = localStorage.getItem('hr_token')
      await fetch('http://127.0.0.1:8000/appraisal-letters/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emp_id: form.empId,
          employee_name: form.empName,
          designation: form.designation,
          old_ctc: cur.ctc,
          new_ctc: nw.ctc,
          effective_date: form.effectiveDate || null,
          company_id: selectedCompany?.id || selectedCompany?.company_id,
        }),
      })
    } catch {
      // saving is best-effort
    }
  }

  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-green-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Salary Appraisal</h1>
        <p className="text-gray-500 text-sm mb-8">{CO.fullName}</p>
        <div className="max-w-3xl space-y-6">

          {/* ── Employee Info ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-indigo-400 mb-5">👤 Employee Information</h2>
            <div className="space-y-4">

              <div>
                <label className={lbl}>Employee ID</label>
                <div className="flex gap-2 mt-1">
                  <input
                    name="empId"
                    value={form.empId}
                    onChange={handleChange}
                    onKeyDown={e => e.key === 'Enter' && fetchEmployee()}
                    placeholder="e.g. SGT1005"
                    className="flex-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-green-500 outline-none text-white text-sm transition-colors"
                  />
                  <button
                    onClick={fetchEmployee}
                    disabled={fetching}
                    className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    {fetching ? '...' : '🔍 Fetch'}
                  </button>
                </div>
                {fetchError && <p className="text-red-400 text-xs mt-1">{fetchError}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Full Name</label>
                  <input name="empName" value={form.empName} onChange={handleChange} placeholder="Auto-filled after fetch" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Designation</label>
                  <input name="designation" value={form.designation} onChange={handleChange} placeholder="Auto-filled after fetch" className={inp} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Letter Date</label>
                  <input type="date" name="letterDate" value={form.letterDate} onChange={handleChange} className={inp + " [color-scheme:dark]"} />
                </div>
                <div>
                  <label className={lbl}>Effective Date</label>
                  <input type="date" name="effectiveDate" value={form.effectiveDate} onChange={handleChange} className={inp + " [color-scheme:dark]"} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Salary Inputs (Monthly) ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-amber-400 mb-5">₹ Salary Details (Monthly Gross)</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={lbl}>Current Monthly Gross (₹)</label>
                <input
                  type="number"
                  name="curMonthly"
                  value={form.curMonthly}
                  onChange={handleChange}
                  placeholder="e.g. 30000"
                  className={inp + " text-white font-bold"}
                />
                {cur.monthly > 0 && (
                  <p className="text-xs text-gray-500 mt-1">Annual: ₹ {fmtNum(cur.gross)}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-green-400">New Monthly Gross (₹)</label>
                <input
                  type="number"
                  name="newMonthly"
                  value={form.newMonthly}
                  onChange={handleChange}
                  placeholder="e.g. 35000"
                  className={inp + " text-green-400 font-bold"}
                />
                {nw.monthly > 0 && (
                  <p className="text-xs text-green-600 mt-1">Annual: ₹ {fmtNum(nw.gross)}</p>
                )}
              </div>
            </div>

            {(cur.monthly > 0 || nw.monthly > 0) && (
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current CTC</div>
                  <div className="text-white font-bold text-lg">₹ {fmtNum(cur.ctc)}</div>
                  <div className="text-gray-400 text-xs mt-1">{toWords(cur.ctc)} Rupees</div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-4 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">New CTC</div>
                  <div className="text-emerald-400 font-bold text-lg">₹ {fmtNum(nw.ctc)}</div>
                  <div className="text-emerald-300 text-xs mt-1">{toWords(nw.ctc)} Rupees</div>
                </div>
              </div>
            )}

            {(cur.monthly > 0 || nw.monthly > 0) && (
              <div className="rounded-xl overflow-hidden border border-white/10 mt-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-600/50 to-emerald-500/30">
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white text-left">Component</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white text-right">Current (INR)</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-green-300 text-right">New (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((r, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-2 text-gray-300 text-sm">{r.label}</td>
                        <td className="px-4 py-2 text-right text-xs text-gray-300">{fmtNum(cur[r.key])}</td>
                        <td className="px-4 py-2 text-right text-xs text-green-400">{fmtNum(nw[r.key])}</td>
                      </tr>
                    ))}
                    <tr className="bg-white/5 border-t border-white/10">
                      <td className="px-4 py-2 text-white font-bold text-sm">Total Gross</td>
                      <td className="px-4 py-2 text-right text-sm text-white font-bold">{fmtNum(cur.gross)}</td>
                      <td className="px-4 py-2 text-right text-sm text-green-300 font-bold">{fmtNum(nw.gross)}</td>
                    </tr>
                    <tr className="bg-emerald-500/15 border-t border-emerald-500/30">
                      <td className="px-4 py-2 text-emerald-300 font-bold text-sm">CTC (Annual)</td>
                      <td className="px-4 py-2 text-right text-sm text-white font-bold">{fmtNum(cur.ctc)}</td>
                      <td className="px-4 py-2 text-right text-sm text-emerald-300 font-bold">{fmtNum(nw.ctc)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Preview / Save Button ── */}
          <button
            onClick={async () => {
              await saveAppraisalRecord()
              openAppraisalPDF(form)
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg"
          >
            ⬇️ Generate Salary Appraisal (PDF)
          </button>
          <p className="text-center text-gray-600 text-xs pb-8">Select "Save as PDF" in the print dialog</p>

        </div>
      </main>
    </div>
  )
}