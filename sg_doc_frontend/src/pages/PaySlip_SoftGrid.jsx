import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { BG_PAGES } from '../assets/bg_images'

// ─── Number Helpers ────────────────────────────────────────────────────────
const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
function toWords(n) { n=Math.round(n); if(!n) return "Zero Rupees"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim()+" Rupees" }
function fmtNum(n) { if(n===null||n===undefined||isNaN(n)) return "0"; return Math.round(n).toLocaleString("en-IN") }

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const YEARS  = Array.from({length:5},(_,i)=>(2023+i).toString())

// ─── Company Config ─────────────────────────────────────────────────────────
const CO = {
  fullName:      'SoftGrid Info Pvt. Ltd.',
  fullNameUpper: 'SOFTGRID INFO PVT. LTD.',
  website:       'www.softgridinfo.in',
  email:         'hr@softgridinfo.in',
  addressFooter: 'Office No. 203, Khandagale Complex, Behind EON Hospital, Kharadi Bypass, Pune MH - 411014',
  gstin:         '27ABJCS4985R1Z4',
  tan:           'PNES82511C',
  pdfColor:      '#2e7d32',
}

const API_URL = 'http://127.0.0.1:8000'

export default function PaySlip_SoftGrid() {
  const { selectedCompany } = useAuth()

  const [salaryMode, setSalaryMode] = useState('auto') // 'auto' | 'custom'
  const [aiLoading,  setAiLoading]  = useState(false)
  const [aiError,    setAiError]    = useState('')
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')
  const [saveError,   setSaveError]   = useState('')

  const [form, setForm] = useState({
    month: 'May', year: '2026',
    empId: '', empName: '', designation: '', department: '',
    uanNumber: '', pfNumber: '', panNumber: '', adharNumber: '',
    bankName: '', accountNo: '',
    attendFrom: '', attendTo: '',
    paidDays: '21', workingDays: '21', lop: '0.00', pl: '',
    annualGross: '',
    pfEmp: true, esiOn: false, pfRate: 12,
    loanRecovery: '', otherDeduction: '', tdsAmt: '',
    // custom salary fields
    customBasic: '', customDa: '', customHra: '', customConv: '', customMed: '', customSpecial: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // ─── Salary Calculations ──────────────────────────────────────────────────
  const annual        = parseFloat(form.annualGross) || 0
  const monthly       = Math.round(annual / 12)
  const esiApplicable = monthly <= 21000

  const autoBasic   = Math.round(monthly * 0.40)
  const autoDa      = Math.round(autoBasic * 0.50)
  const autoHra     = Math.round(autoBasic * 0.40)
  const autoConv    = monthly > 0 ? 1600 : 0
  const autoMed     = monthly > 0 ? 1250 : 0
  const autoSpecial = monthly - autoBasic - autoDa - autoHra - autoConv - autoMed

  const isCustom = salaryMode === 'custom'
  const basic   = isCustom ? (parseFloat(form.customBasic)   || 0) : autoBasic
  const da      = isCustom ? (parseFloat(form.customDa)      || 0) : autoDa
  const hra     = isCustom ? (parseFloat(form.customHra)     || 0) : autoHra
  const conv    = isCustom ? (parseFloat(form.customConv)    || 0) : autoConv
  const med     = isCustom ? (parseFloat(form.customMed)     || 0) : autoMed
  const special = isCustom ? (parseFloat(form.customSpecial) || 0) : autoSpecial

  const customMonthlyGross = isCustom ? (basic + da + hra + conv + med + special) : monthly
  const pfEmpM  = form.pfEmp ? Math.round((basic + da) * Number(form.pfRate) / 100) : 0
  const esiEmpM = (form.esiOn && esiApplicable) ? Math.round(customMonthlyGross * 0.0075) : 0
  const pt      = customMonthlyGross > 0 ? 200 : 0
  const loan    = parseFloat(form.loanRecovery)   || 0
  const otherDed= parseFloat(form.otherDeduction) || 0
  const tds     = parseFloat(form.tdsAmt)         || 0
  const totalDed= pfEmpM + esiEmpM + pt + loan + otherDed + tds
  const netSalary = customMonthlyGross - totalDed

  const earnRows = [
    { label: "Basic Salary",          val: basic   },
    { label: "DA",                    val: da      },
    { label: "HRA",                   val: hra     },
    { label: "Conveyance Allowances", val: conv    },
    { label: "Medical Allowances",    val: med     },
    { label: "Special Allowances",    val: special },
  ]
  const dedRows = [
    { label: "Provident Fund",       val: pfEmpM },
    { label: "ESI/Health Insurance", val: (form.esiOn && esiApplicable) ? esiEmpM : 0 },
    { label: "Professional Tax",     val: pt },
    { label: "Loan Recovery",        val: loan },
    { label: "Other Deduction",      val: otherDed },
    { label: "TDS",                  val: tds },
  ]

  // ─── AI Salary Suggestion ────────────────────────────────────────────────
  const suggestSalaryWithAI = async () => {
    if (!form.annualGross || parseFloat(form.annualGross) <= 0) {
      setAiError('आधी Annual Gross टाका'); return
    }
    setAiLoading(true); setAiError('')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are an Indian payroll expert. Given Annual Gross of ₹${form.annualGross}, suggest a realistic monthly salary breakdown.
Designation: ${form.designation || 'Software Developer'}
Department: ${form.department || 'IT'}
Return ONLY valid JSON, no markdown:
{"basic":<number>,"da":<number>,"hra":<number>,"conv":<number>,"med":<number>,"special":<number>}
All values monthly INR integers. Sum = ${Math.round(parseFloat(form.annualGross)/12)}.`
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.map(b => b.text||'').join('') || ''
      const parsed = JSON.parse(text.replace(/```json|```/g,'').trim())
      setForm(prev => ({
        ...prev,
        customBasic:   String(parsed.basic   || ''),
        customDa:      String(parsed.da      || ''),
        customHra:     String(parsed.hra     || ''),
        customConv:    String(parsed.conv    || ''),
        customMed:     String(parsed.med     || ''),
        customSpecial: String(parsed.special || ''),
      }))
      setSalaryMode('custom')
    } catch { setAiError('AI suggestion failed. पुन्हा try करा.') }
    finally   { setAiLoading(false) }
  }

  // ─── Save to Backend ──────────────────────────────────────────────────────
  const saveToDB = async () => {
    if (!form.empName) { setSaveError('⚠️ Employee चं नाव भरा!'); return }
    setSaveLoading(true); setSaveError(''); setSaveSuccess('')
    try {
      const token = localStorage.getItem('hr_token')
      const res = await fetch(`${API_URL}/payslips/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          company_id:    selectedCompany?.id || null,
          month:         form.month,
          year:          parseInt(form.year),
          emp_id:        form.empId,
          emp_name:      form.empName,
          designation:   form.designation,
          department:    form.department,
          uan_number:    form.uanNumber,
          pf_number:     form.pfNumber,
          pan_number:    form.panNumber,
          adhar_number:  form.adharNumber,
          bank_name:     form.bankName,
          account_no:    form.accountNo,
          paid_days:     parseFloat(form.paidDays)    || 0,
          working_days:  parseFloat(form.workingDays) || 0,
          lop:           parseFloat(form.lop)         || 0,
          pl:            form.pl,
          annual_gross:  annual,
          monthly_gross: customMonthlyGross,
          basic, da, hra,
          conveyance:    conv,
          medical:       med,
          special,
          pf_employee:   pfEmpM,
          esi_employee:  esiEmpM,
          prof_tax:      pt,
          loan_recovery: loan,
          other_deduction: otherDed,
          tds,
          total_deduction: totalDed,
          net_salary:    netSalary,
          salary_mode:   salaryMode,
        }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Save failed') }
      const data = await res.json()
      setSaveSuccess(`✅ Pay Slip save झाला! ID: #${data.id}`)
    } catch (err) {
      setSaveError(`⚠️ ${err.message}`)
    } finally {
      setSaveLoading(false)
    }
  }

  // ─── PDF Export (OfferLetter style — position:relative page, absolute header/footer) ──
  const exportPDF = useCallback(() => {
    const bg = BG_PAGES?.[0] || ''

    // ── Same pgStyle as OfferLetter ──
    const pgStyle = `
      position:relative;
      width:210mm;
      min-height:297mm;
      margin:0 auto;
      padding:48mm 18mm 22mm 18mm;
      font-family:'Segoe UI',Arial,sans-serif;
      font-size:13px;
      color:#1a2e1a;
      background-image:url('${bg}');
      background-size:100% 100%;
      background-repeat:no-repeat;
      background-position:center center;
      -webkit-print-color-adjust:exact;
      print-color-adjust:exact;
    `

    // ── Absolute header overlay (top-right) — same as OfferLetter ──
    const headerInfo = `
      <div style="position:absolute;top:10mm;right:8mm;text-align:right;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#1b5e20;line-height:1.9">
        <div style="font-weight:800;font-size:16px;color:#1b5e20;letter-spacing:0.3px">SOFTGRID INFO PVT. LTD.</div>
        <div><strong>GSTIN:</strong> ${CO.gstin}</div>
        <div><strong>TAN:</strong> ${CO.tan}</div>
      </div>`

    // ── Absolute footer overlay (bottom) — same as OfferLetter ──
    const footerHTML = `
      <div style="position:absolute;bottom:6mm;left:18mm;right:8mm;border-top:1px solid #999;padding-top:4px;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#000;font-family:'Segoe UI',Arial,sans-serif">
        <span>${CO.addressFooter}</span>
        <span>${CO.website} | ${CO.email}</span>
      </div>`

    // ── Salary table rows ──
    const maxR = Math.max(earnRows.length, dedRows.length)
    const tableRowsHTML = Array.from({ length: maxR }, (_, i) => {
      const e = earnRows[i]
      const d = dedRows[i]
      return `<tr>
        <td style="padding:13px 10px;border:1px solid #a5d6a7;font-size:12.5px">${e ? e.label : ''}</td>
        <td style="padding:13px 10px;border:1px solid #a5d6a7;text-align:right;font-size:12.5px">${e ? fmtNum(e.val) : ''}</td>
        <td style="padding:13px 10px;border:1px solid #a5d6a7;font-size:12.5px">${d ? d.label : ''}</td>
        <td style="padding:13px 10px;border:1px solid #a5d6a7;text-align:right;font-size:12.5px">${d ? fmtNum(d.val) : ''}</td>
      </tr>`
    }).join('')

    const pw = window.open('', '_blank')
    pw.document.write(`<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<title>Pay Slip — ${form.empName || 'Employee'} — ${form.month} ${form.year}</title>
<style>
  * { box-sizing:border-box;margin:0;padding:0 }
  body { font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#333;background:#f5f5f5 }
  @page { size:A4;margin:0 }
  @media print {
    html,body{width:210mm;margin:0;background:white}
    .no-print{display:none!important}
    *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
  }
  h1 { text-align:center;font-size:17px;font-weight:700;text-decoration:underline;margin:0 0 14px }
  .meta { display:grid;grid-template-columns:1fr 1fr;gap:6px 0;font-size:12.5px;padding:8px 0;margin-bottom:10px }
  .meta-row { display:flex;gap:4px;line-height:1.9 }
  .meta-row strong { min-width:115px;color:#333 }
  .att-bar { font-size:12px;padding:5px 0;margin-bottom:12px;color:#444 }
  table { width:100%;border-collapse:collapse;font-size:12.5px }
  th { background:#2e7d32;color:#fff;padding:9px 10px;font-size:12.5px;letter-spacing:.04em;font-weight:700 }
  th:nth-child(even) { text-align:right }
  .total-row td { background:#e8f5e9;font-weight:700;padding:9px 10px;border:1px solid #c8e6c9;font-size:12.5px;color:#1b4332 }
  .total-row td:nth-child(even) { text-align:right }
  .net-row td { background:#c8e6c9;font-weight:700;padding:9px 10px;font-size:13px;color:#1b5e20 }
  .net-row td:last-child { text-align:right }
  .words { margin-top:12px;font-size:12.5px;line-height:1.8 }
  #pbar { position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#1e293b,#0f172a);border-top:2px solid #6366f1;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:'Segoe UI',sans-serif }
</style></head><body>

<div style="${pgStyle}">
  ${headerInfo}

  <h1>Pay Slip</h1>

  <div class="meta">
    <div class="meta-row"><strong>Month:</strong> ${form.month}-${form.year}</div>
    <div class="meta-row"><strong>UAN Number:</strong> ${form.uanNumber || '—'}</div>
    <div class="meta-row"><strong>EMP ID:</strong> ${form.empId || '—'}</div>
    <div class="meta-row"><strong>PF Number:</strong> ${form.pfNumber || '—'}</div>
    <div class="meta-row"><strong>Name:</strong> ${form.empName || '—'}</div>
    <div class="meta-row"><strong>PAN Number:</strong> ${form.panNumber || '—'}</div>
    <div class="meta-row"><strong>Designation:</strong> ${form.designation || '—'}</div>
    <div class="meta-row"><strong>Adhar Number:</strong> ${form.adharNumber || '—'}</div>
    <div class="meta-row"><strong>Department:</strong> ${form.department || '—'}</div>
    <div class="meta-row"><strong>Bank Name:</strong> ${form.bankName || '—'}</div>
    <div class="meta-row"></div>
    <div class="meta-row"><strong>Account No:</strong> ${form.accountNo || '—'}</div>
  </div>

  <div class="att-bar">
    Paid Day's: <strong>${form.paidDays}</strong> &nbsp;&nbsp;
    Working Day's: <strong>${form.workingDays}</strong> &nbsp;&nbsp;&nbsp;&nbsp;
    LOP: <strong>${form.lop}</strong> &nbsp;&nbsp;
    PL: <strong>${form.pl || '—'}</strong>
  </div>

  <table>
    <thead>
      <tr>
        <th style="text-align:left;width:30%">Components In Salary</th>
        <th style="width:20%">Gross Amount</th>
        <th style="text-align:left;width:30%">Deductions &amp; Recoveries</th>
        <th style="width:20%">Gross Deductions</th>
      </tr>
    </thead>
    <tbody>${tableRowsHTML}</tbody>
    <tfoot>
      <tr class="total-row">
        <td><strong>Total Gross Salary</strong></td>
        <td style="text-align:right"><strong>${fmtNum(customMonthlyGross)}</strong></td>
        <td>N/A</td>
        <td style="text-align:right"><strong>${fmtNum(totalDed)}</strong></td>
      </tr>
      <tr class="net-row">
        <td colspan="2"><strong>Net Salary</strong></td>
        <td>N/A</td>
        <td style="text-align:right"><strong>${fmtNum(netSalary)}</strong></td>
      </tr>
    </tfoot>
  </table>

  <div class="words"><strong>Total Amount in Words: ${toWords(netSalary)} Only</strong></div>

  ${footerHTML}
</div>

<div id="pbar" class="no-print">
  <div>
    <div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Pay Slip तयार आहे!</div>
    <div style="color:#64748b;font-size:12px">👇 <strong style="color:#a5b4fc">"Save as PDF"</strong> click करा → Destination: <strong style="color:#a5b4fc">"Save as PDF"</strong></div>
  </div>
  <div style="display:flex;gap:10px">
    <button onclick="document.getElementById('pbar').style.display='none';window.print()" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(99,102,241,0.5)">⬇️ Save as PDF</button>
    <button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>
  </div>
</div>
</body></html>`)
    pw.document.close()
  }, [form, monthly, customMonthlyGross, basic, da, hra, conv, med, special, pfEmpM, esiEmpM, pt, loan, otherDed, tds, totalDed, netSalary, earnRows, dedRows])

  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-indigo-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">
      
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Pay Slip Generator</h1>
        <p className="text-gray-500 text-sm mb-8">{selectedCompany?.name || CO.fullName}</p>
        <div className="max-w-2xl space-y-6">

          {/* Pay Period */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-cyan-400 mb-5">📅 Pay Period</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Month</label>
                <select name="month" value={form.month} onChange={handleChange} className={inp} style={{colorScheme:'dark',color:'#fff',backgroundColor:'#1e293b'}}>
                  {MONTHS.map(m => <option key={m} value={m} style={{background:'#1e293b',color:'#fff'}}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Year</label>
                <select name="year" value={form.year} onChange={handleChange} className={inp} style={{colorScheme:'dark',color:'#fff',backgroundColor:'#1e293b'}}>
                  {YEARS.map(y => <option key={y} value={y} style={{background:'#1e293b',color:'#fff'}}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Employee Info */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-indigo-400 mb-5">👤 Employee Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>EMP ID</label><input name="empId" value={form.empId} onChange={handleChange} placeholder="e.g. 18" className={inp} /></div>
                <div><label className={lbl}>Full Name</label><input name="empName" value={form.empName} onChange={handleChange} placeholder="e.g. Takale Pappu Rajendra" className={inp} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Designation</label><input name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Software Developer" className={inp} /></div>
                <div><label className={lbl}>Department</label><input name="department" value={form.department} onChange={handleChange} placeholder="e.g. IT" className={inp} /></div>
              </div>
            </div>
          </div>

          {/* Identity & Bank */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-emerald-400 mb-5">🪪 Identity & Bank Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>UAN Number</label><input name="uanNumber" value={form.uanNumber} onChange={handleChange} placeholder="e.g. 6754324567543567" className={inp} /></div>
                <div><label className={lbl}>PF Number</label><input name="pfNumber" value={form.pfNumber} onChange={handleChange} placeholder="e.g. 234567543245678" className={inp} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>PAN Number</label><input name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="e.g. BRRPT7721C" className={inp} /></div>
                <div><label className={lbl}>Adhar Number</label><input name="adharNumber" value={form.adharNumber} onChange={handleChange} placeholder="e.g. 234565432345676543" className={inp} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Bank Name</label><input name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. HDFC Bank" className={inp} /></div>
                <div><label className={lbl}>Account No</label><input name="accountNo" value={form.accountNo} onChange={handleChange} placeholder="e.g. 754323456765" className={inp} /></div>
              </div>
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-sky-400 mb-5">🗓️ Attendance</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className={lbl}>From Date</label><input type="date" name="attendFrom" value={form.attendFrom} onChange={handleChange} className={inp + " [color-scheme:dark]"} style={{colorScheme:'dark'}} /></div>
              <div><label className={lbl}>To Date</label><input type="date" name="attendTo" value={form.attendTo} onChange={handleChange} className={inp + " [color-scheme:dark]"} style={{colorScheme:'dark'}} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className={lbl}>Paid Days</label><input type="number" name="paidDays" value={form.paidDays} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>Working Days</label><input type="number" name="workingDays" value={form.workingDays} onChange={handleChange} className={inp} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>LOP (Loss of Pay)</label><input type="number" name="lop" value={form.lop} onChange={handleChange} placeholder="0.00" className={inp} /></div>
              <div><label className={lbl}>PL (Leave Balance)</label><input name="pl" value={form.pl} onChange={handleChange} placeholder="e.g. 543456" className={inp} /></div>
            </div>
          </div>

          {/* Salary */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-amber-400 mb-5">₹ Salary Details</h2>

            {/* Mode Tabs */}
            <div className="flex rounded-xl overflow-hidden border border-white/10 mb-5">
              {[
                { key: 'auto',   label: '⚡ Auto Calculation', color: 'from-indigo-500 to-cyan-500' },
                { key: 'custom', label: '✏️ Custom Edit',       color: 'from-amber-500 to-orange-500' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setSalaryMode(tab.key)}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-all ${salaryMode === tab.key ? `bg-gradient-to-r ${tab.color} text-white` : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* AUTO MODE */}
            {salaryMode === 'auto' && (
              <div>
                <label className={lbl}>Annual Gross (₹)</label>
                <input type="number" name="annualGross" value={form.annualGross} onChange={handleChange} placeholder="e.g. 249996" className={inp + " text-amber-400 font-bold"} />
                <p className="text-xs text-gray-500 mt-1.5 mb-3">Basic 40% · DA 50% of Basic · HRA 40% of Basic · Conv ₹1600 · Med ₹1250 · Balance → Special</p>
                <button onClick={suggestSalaryWithAI} disabled={aiLoading}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {aiLoading
                    ? <><span className="animate-spin inline-block">⟳</span> AI Calculating...</>
                    : <>✨ AI ने Salary Breakdown Suggest करा</>}
                </button>
                {aiError && <p className="text-rose-400 text-xs mt-2">{aiError}</p>}
              </div>
            )}

            {/* CUSTOM MODE */}
            {salaryMode === 'custom' && (
              <div className="space-y-3 mb-4">
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-2 text-xs text-amber-400 mb-3">
                  ✏️ प्रत्येक component manually enter करा — automatic calculation होणार नाही
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'customBasic',   label: 'Basic Salary (₹)' },
                    { name: 'customDa',      label: 'DA (₹)' },
                    { name: 'customHra',     label: 'HRA (₹)' },
                    { name: 'customConv',    label: 'Conveyance Allowance (₹)' },
                    { name: 'customMed',     label: 'Medical Allowance (₹)' },
                    { name: 'customSpecial', label: 'Special Allowance (₹)' },
                  ].map(({ name, label }) => (
                    <div key={name}>
                      <label className={lbl}>{label}</label>
                      <input type="number" name={name} value={form[name]} onChange={handleChange} placeholder="0" className={inp} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mt-2 mb-5">
              {[
                { label: "Monthly Gross",    value: customMonthlyGross, cls: "text-amber-400",    bg: "bg-amber-500/10  border-amber-500/20"   },
                { label: "Total Deductions", value: totalDed,           cls: "text-rose-400",     bg: "bg-rose-500/10   border-rose-500/20"    },
                { label: "Net Salary",       value: netSalary,          cls: "text-emerald-400",  bg: "bg-emerald-500/10 border-emerald-500/20" },
              ].map(({ label, value, cls, bg }) => (
                <div key={label} className={`${bg} border rounded-xl p-3 text-center`}>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
                  <div className={`${cls} font-bold text-sm`}>₹ {fmtNum(value)}</div>
                </div>
              ))}
            </div>

            {!esiApplicable && monthly > 0 && (
              <p className="text-amber-400 text-xs bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mb-4">
                ⚠️ ESI not applicable — Monthly Gross ₹{fmtNum(monthly)} &gt; ₹21,000
              </p>
            )}

            <div className="rounded-xl overflow-hidden border border-white/10 mt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500/50 to-cyan-500/30">
                    {["Components In Salary","Gross Amt","Deductions & Recoveries","Gross Ded."].map((h,i) => (
                      <th key={h} className={`px-3 py-3 text-xs font-bold uppercase tracking-wider text-white ${i%2===0?"text-left":"text-right"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({length:Math.max(earnRows.length,dedRows.length)},(_,i)=>{
                    const e=earnRows[i]; const d=dedRows[i]
                    return (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-3 py-2 text-gray-300 text-xs">{e?.label??''}</td>
                        <td className="px-3 py-2 text-right text-xs text-gray-300">{e?fmtNum(e.val):''}</td>
                        <td className="px-3 py-2 text-rose-300 text-xs">{d?.label??''}</td>
                        <td className="px-3 py-2 text-right text-xs text-rose-300">{d?fmtNum(d.val):''}</td>
                      </tr>
                    )
                  })}
                  <tr className="bg-cyan-500/10 border-t border-white/10">
                    <td className="px-3 py-2 text-cyan-300 font-bold text-xs">Total Gross Salary</td>
                    <td className="px-3 py-2 text-right text-xs text-cyan-300 font-bold">{fmtNum(customMonthlyGross)}</td>
                    <td className="px-3 py-2 text-gray-500 italic text-xs">N/A</td>
                    <td className="px-3 py-2 text-right text-xs text-rose-400 font-bold">{fmtNum(totalDed)}</td>
                  </tr>
                  <tr className="bg-amber-500/10">
                    <td colSpan={2} className="px-3 py-2 text-amber-300 font-bold text-xs">Net Salary</td>
                    <td className="px-3 py-2 text-gray-500 italic text-xs">N/A</td>
                    <td className="px-3 py-2 text-right text-xs text-amber-300 font-bold">{fmtNum(netSalary)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Net Salary in Words</div>
              <div className="text-indigo-300 font-semibold text-sm">{toWords(netSalary)} Only</div>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-purple-400 mb-5">🛡️ Deductions & Settings</h2>
            <div className="space-y-4">
              {[
                { key:"pfEmp", label:"Employee PF", desc:`${form.pfRate}% of (Basic + DA) — deducted from salary` },
                { key:"esiOn", label:"ESI", desc: esiApplicable?"Applicable (Monthly ≤ ₹21,000)":"Not applicable — Monthly > ₹21,000", disabled:!esiApplicable },
              ].map(({ key, label, desc, disabled }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <div className="text-sm font-medium text-white">{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                  </div>
                  <button onClick={() => !disabled && setForm(prev=>({...prev,[key]:!prev[key]}))}
                    className={`w-11 h-6 rounded-full relative transition-all flex-shrink-0 ${form[key]&&!disabled?'bg-gradient-to-r from-indigo-500 to-cyan-500':'bg-white/10'} ${disabled?'opacity-40 cursor-not-allowed':'cursor-pointer'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form[key]&&!disabled?'left-5':'left-0.5'}`} />
                  </button>
                </div>
              ))}
              <div>
                <label className={lbl}>Employee PF Rate (%)</label>
                <input type="number" name="pfRate" value={form.pfRate} onChange={handleChange} min={0} max={12} className={inp} />
              </div>
              <div className="flex items-center justify-between bg-amber-500/5 border border-amber-500/10 rounded-xl px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-white">Maharashtra Professional Tax</div>
                  <div className="text-xs text-gray-500 mt-0.5">Fixed monthly deduction</div>
                </div>
                <div className="text-amber-400 font-bold text-lg">₹200<span className="text-xs font-normal text-gray-500">/mo</span></div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div><label className={lbl}>Loan Recovery (₹)</label><input type="number" name="loanRecovery" value={form.loanRecovery} onChange={handleChange} placeholder="0" className={inp} /></div>
                <div><label className={lbl}>Other Deduction (₹)</label><input type="number" name="otherDeduction" value={form.otherDeduction} onChange={handleChange} placeholder="0" className={inp} /></div>
                <div><label className={lbl}>TDS (₹)</label><input type="number" name="tdsAmt" value={form.tdsAmt} onChange={handleChange} placeholder="0" className={inp} /></div>
              </div>
            </div>
          </div>

          {saveError   && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{saveError}</div>}
          {saveSuccess && <div className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">{saveSuccess}</div>}

          {/* Save + Generate */}
          <div className="pb-8">
            <button
              onClick={async () => { await saveToDB(); exportPDF() }}
              disabled={saveLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-semibold hover:scale-105 active:scale-95 transition text-white text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {saveLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving...
                </>
              ) : '💾 Save & Generate Pay Slip PDF'}
            </button>
            <p className="text-center text-gray-600 text-xs mt-3">Print dialog मध्ये "Save as PDF" निवडा</p>
          </div>

        </div>
      </main>
    </div>
  )
}
 