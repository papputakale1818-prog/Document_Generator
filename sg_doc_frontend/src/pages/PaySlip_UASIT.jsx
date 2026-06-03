import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import bgImage from '../assets/UAS_background image_1.png'

// ─── Company Config ─────────────────────────────────────────────────────────
const CO = {
  fullName:      'UAS IT Consultancy Services Pvt. Ltd.',
  fullNameUpper: 'UAS IT CONSULTANCY SERVICES PVT. LTD.',
  website:       'www.uasit.in',
  email:         'hr@uasit.in',
  address:       'Office No. 203, Khandagale Complex<br>Behind EON Hospital, Kharadi Bypass<br>Pune MH - 411014',
  addressFooter: 'Office No. 203, Khandagale Complex, Behind EON Hospital, Kharadi Bypass, Pune MH - 411014',
  gstin:         '27ABJCS4985R1Z4',
  tan:           'PNES82511C',
  pdfColor:      '#1a3c6e',   // UASIT navy blue
}

// ─── Number Helpers ────────────────────────────────────────────────────────
const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
function toWords(n) { n=Math.round(n); if(!n) return "Zero Rupees"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim()+" Rupees" }
function fmtNum(n) { if(n===null||n===undefined||isNaN(n)) return "0"; return Math.round(n).toLocaleString("en-IN") }

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const YEARS  = Array.from({length:5},(_,i)=>(2023+i).toString())

// ─── UASIT PDF Header — company name centered at top of bg image ──────────
function pdfHeader() {
  return `
    <div style="margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid rgba(255,255,255,0.4)">
      <div style="position:relative;height:60px;">
        <!-- Company Name — centered on bg letterhead top -->
        <div style="
          position:absolute;
          top:-48mm;
          left:50%;
          transform:translateX(-50%);
          font-size:26px;
          font-weight:800;
          color:#ffffff;
          text-shadow:1px 1px 4px rgba(0,0,0,0.5);
          letter-spacing:0.04em;
          white-space:nowrap;
        ">${CO.fullName}</div>
        <!-- Address — right side -->
        <div style="
          position:absolute;
          top:-18mm;
          right:0;
          font-size:10.5px;
          color:#4a5e7a;
          text-align:right;
          line-height:1.75
        ">
          ${CO.address}<br>
          GSTIN: ${CO.gstin} | TAN: ${CO.tan}
        </div>
      </div>
    </div>`
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function PaySlip_UASIT() {
  const { selectedCompany } = useAuth()

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
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // ─── Salary Calculations ──────────────────────────────────────────────────
  const annual        = parseFloat(form.annualGross) || 0
  const monthly       = Math.round(annual / 12)
  const esiApplicable = monthly <= 21000
  const basic         = Math.round(monthly * 0.40)
  const da            = Math.round(basic * 0.50)
  const hra           = Math.round(basic * 0.40)
  const conv          = monthly > 0 ? 1600 : 0
  const med           = monthly > 0 ? 1250 : 0
  const special       = monthly - basic - da - hra - conv - med
  const pfEmpM        = form.pfEmp ? Math.round((basic + da) * Number(form.pfRate) / 100) : 0
  const esiEmpM       = (form.esiOn && esiApplicable) ? Math.round(monthly * 0.0075) : 0
  const pt            = monthly > 0 ? 200 : 0
  const loan          = parseFloat(form.loanRecovery) || 0
  const otherDed      = parseFloat(form.otherDeduction) || 0
  const tds           = parseFloat(form.tdsAmt) || 0
  const totalDed      = pfEmpM + esiEmpM + pt + loan + otherDed + tds
  const netSalary     = monthly - totalDed

  const earnRows = [
    { label: "Basic Salary",          val: basic   },
    { label: "DA",                    val: da      },
    { label: "HRA",                   val: hra     },
    { label: "Conveyance Allowances", val: conv    },
    { label: "Medical Allowances",    val: med     },
    { label: "Special Allowances",    val: special },
  ]
  const dedRows = [
    { label: "Provident Fund",        val: pfEmpM },
    { label: "ESI/Health Insurance",  val: (form.esiOn && esiApplicable) ? esiEmpM : 0 },
    { label: "Professional Tax",      val: pt },
    { label: "Loan Recovery",         val: loan },
    { label: "Other Deduction",       val: otherDed },
    { label: "TDS",                   val: tds },
  ]

  // ─── PDF Export — UASIT style (bg: UAS_background, padding:58mm, navy blue) ──
  const exportPDF = useCallback(() => {
    const bgStyle = bgImage
      ? `background-image:url('${bgImage}');background-size:cover;background-repeat:no-repeat;background-position:center top;`
      : ''

    // ── UASIT table style — blue borders, plain font ───────────────────────
    const cellBase = `padding:8px 12px;border:1px solid #a8c4e0;font-size:12.5px;font-family:'Segoe UI',Arial,sans-serif;vertical-align:middle;`

    const maxR = Math.max(earnRows.length, dedRows.length)
    const tableRowsHTML = Array.from({ length: maxR }, (_, i) => {
      const e = earnRows[i]
      const d = dedRows[i]
      return `<tr>
        <td style="${cellBase}color:#0d1f3c">${e ? e.label : ''}</td>
        <td style="${cellBase}text-align:right;color:#0d1f3c">${e ? fmtNum(e.val) : ''}</td>
        <td style="${cellBase}color:#0d1f3c">${d ? d.label : ''}</td>
        <td style="${cellBase}text-align:right;color:#0d1f3c">${d ? fmtNum(d.val) : ''}</td>
      </tr>`
    }).join('')

    const pw = window.open('', '_blank')
    pw.document.write(`<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<title>Pay Slip — ${form.empName || 'Employee'} — ${form.month} ${form.year}</title>
<style>
  * { box-sizing:border-box;margin:0;padding:0 }
  body { font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#0d1f3c }
  @page { size:A4;margin:0 }
  @media print {
    html,body { width:210mm;margin:0 }
    .no-print { display:none!important }
    * { -webkit-print-color-adjust:exact!important;print-color-adjust:exact!important }
  }

  /* ── UASIT page — 58mm top padding to clear letterhead logo ── */
  .page {
    width:210mm;min-height:297mm;margin:0 auto;
    padding:58mm 20mm 16mm;
    ${bgStyle}
    -webkit-print-color-adjust:exact;print-color-adjust:exact;
  }

  /* ── Titles ── */
  h1 { text-align:center;font-size:20px;font-weight:700;margin:10px 0 4px;color:#0d1f3c }
  h2 { text-align:center;font-size:15px;font-weight:700;letter-spacing:.5px;margin-bottom:16px;color:#0d1f3c }

  /* ── Meta grid — employee info block ── */
  .meta {
    display:grid;grid-template-columns:1fr 1fr;gap:5px 0;
    font-size:12.5px;
    border-top:1.5px solid ${CO.pdfColor};
    border-bottom:1.5px solid ${CO.pdfColor};
    padding:10px 0;margin-bottom:10px
  }
  .meta-row { display:flex;gap:4px }
  .meta-row strong { min-width:110px;color:#1a3c6e }

  /* ── Attendance bar ── */
  .att-bar {
    font-size:12px;padding:5px 0;
    border-bottom:1px solid #a8c4e0;
    margin-bottom:12px;color:#334e6a
  }

  /* ── Salary table ── */
  table { width:100%;border-collapse:collapse;font-size:12.5px }
  th {
    background:${CO.pdfColor};color:#fff;
    padding:9px 12px;font-size:12px;letter-spacing:.04em;
    font-family:'Segoe UI',Arial,sans-serif;
  }
  th:nth-child(even) { text-align:right }

  /* total row — UASIT blue highlight */
  .total-row td {
    background:#d0e4f7;font-weight:700;
    padding:9px 12px;border:1px solid #a8c4e0;
    font-size:13px;color:#0d2a5e;
    font-family:'Segoe UI',Arial,sans-serif;
  }
  .total-row td:nth-child(even) { text-align:right }

  /* net row */
  .net-row td {
    background:#b8d4f0;font-weight:700;
    padding:9px 12px;font-size:13.5px;color:#0d2a5e;
    font-family:'Segoe UI',Arial,sans-serif;
  }
  .net-row td:last-child { text-align:right }

  /* CTC in words */
  .words { margin-top:14px;font-size:12.5px;line-height:1.8;color:#0d1f3c }

  /* Save bar */
  #pbar {
    position:fixed;bottom:0;left:0;right:0;
    background:linear-gradient(135deg,#0d1f3c,#1a3c6e);
    border-top:2px solid #4a90d9;
    padding:14px 24px;
    display:flex;align-items:center;justify-content:space-between;
    z-index:9999;font-family:'Segoe UI',sans-serif
  }
</style></head><body>

<div class="page">

  ${pdfHeader()}

  <h1>Pay Slip</h1>

  <!-- Employee Meta Grid -->
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

  <!-- Attendance Bar -->
  <div class="att-bar">
    Paid Day's: <strong>${form.paidDays}</strong> &nbsp;&nbsp;
    Working Day's: <strong>${form.workingDays}</strong> &nbsp;&nbsp;&nbsp;&nbsp;
    LOP: <strong>${form.lop}</strong> &nbsp;&nbsp;
    PL: <strong>${form.pl || '—'}</strong>
  </div>

  <!-- Salary Table -->
  <table>
    <thead>
      <tr>
        <th style="text-align:left;width:30%">Components In salary</th>
        <th style="width:20%">Gross Amount</th>
        <th style="text-align:left;width:30%">Deductions &amp; Recoveries</th>
        <th style="width:20%">Gross Deductions</th>
      </tr>
    </thead>
    <tbody>${tableRowsHTML}</tbody>
    <tfoot>
      <tr class="total-row">
        <td><strong>Total Gross Salary</strong></td>
        <td style="text-align:right"><strong>${fmtNum(monthly)}</strong></td>
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

  <!-- Net in Words -->
  <div class="words"><strong>Total Amount in words: ${toWords(netSalary)} Only</strong></div>

  <!-- Note: no footer — bg image has contact/address -->

</div>

<!-- Save Bar -->
<div id="pbar" class="no-print">
  <div>
    <div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Pay Slip तयार आहे! — ${CO.fullName}</div>
    <div style="color:#8ab4d4;font-size:12px">👇 <strong style="color:#a8d4f5">"Save as PDF"</strong> click करा → Print dialog मध्ये Destination: <strong style="color:#a8d4f5">"Save as PDF"</strong> select करा</div>
  </div>
  <div style="display:flex;gap:10px">
    <button onclick="document.getElementById('pbar').style.display='none';window.print()"
      style="background:linear-gradient(135deg,#1a3c6e,#2a6bb5);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(26,60,110,0.5)">
      ⬇️ Save as PDF
    </button>
    <button onclick="window.close()"
      style="background:rgba(255,255,255,0.06);color:#8ab4d4;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">
      ✕
    </button>
  </div>
</div>

</body></html>`)
    pw.document.close()
  }, [form, monthly, basic, da, hra, conv, med, special, pfEmpM, esiEmpM, pt, loan, otherDed, tds, totalDed, netSalary, esiApplicable, earnRows, dedRows])

  // ─── UI ───────────────────────────────────────────────────────────────────
  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-blue-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">
      
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Pay Slip Generator</h1>
        <p className="text-gray-500 text-sm mb-8">{selectedCompany?.name || CO.fullName}</p>
        <div className="max-w-2xl space-y-6">

          {/* ── Pay Period ── */}
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

          {/* ── Employee Info ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-blue-400 mb-5">👤 Employee Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>EMP ID</label><input name="empId" value={form.empId} onChange={handleChange} placeholder="e.g. 18" className={inp} /></div>
                <div><label className={lbl}>Full Name</label><input name="empName" value={form.empName} onChange={handleChange} placeholder="e.g. Amit Kumar" className={inp} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Designation</label><input name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Software Developer" className={inp} /></div>
                <div><label className={lbl}>Department</label><input name="department" value={form.department} onChange={handleChange} placeholder="e.g. IT" className={inp} /></div>
              </div>
            </div>
          </div>

          {/* ── Identity & Bank ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-emerald-400 mb-5">🪪 Identity & Bank Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>UAN Number</label><input name="uanNumber" value={form.uanNumber} onChange={handleChange} placeholder="e.g. 6754324567543567" className={inp} /></div>
                <div><label className={lbl}>PF Number</label><input name="pfNumber" value={form.pfNumber} onChange={handleChange} placeholder="e.g. 234567543245678" className={inp} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>PAN Number</label><input name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="e.g. BRRPT7721C" className={inp} /></div>
                <div><label className={lbl}>Adhar Number</label><input name="adharNumber" value={form.adharNumber} onChange={handleChange} placeholder="e.g. 2345 6543 2345" className={inp} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Bank Name</label><input name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. HDFC Bank" className={inp} /></div>
                <div><label className={lbl}>Account No</label><input name="accountNo" value={form.accountNo} onChange={handleChange} placeholder="e.g. 754323456765" className={inp} /></div>
              </div>
            </div>
          </div>

          {/* ── Attendance ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-sky-400 mb-5">🗓️ Attendance</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className={lbl}>From Date</label><input type="date" name="attendFrom" value={form.attendFrom} onChange={handleChange} className={inp+" [color-scheme:dark]"} /></div>
              <div><label className={lbl}>To Date</label><input type="date" name="attendTo" value={form.attendTo} onChange={handleChange} className={inp+" [color-scheme:dark]"} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className={lbl}>Paid Days</label><input type="number" name="paidDays" value={form.paidDays} onChange={handleChange} className={inp} /></div>
              <div><label className={lbl}>Working Days</label><input type="number" name="workingDays" value={form.workingDays} onChange={handleChange} className={inp} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>LOP (Loss of Pay)</label><input type="number" name="lop" value={form.lop} onChange={handleChange} placeholder="0.00" className={inp} /></div>
              <div><label className={lbl}>PL (Leave Balance)</label><input name="pl" value={form.pl} onChange={handleChange} placeholder="e.g. 5" className={inp} /></div>
            </div>
          </div>

          {/* ── Salary ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-amber-400 mb-5">₹ Salary Details</h2>
            <div>
              <label className={lbl}>Annual Gross (₹)</label>
              <input type="number" name="annualGross" value={form.annualGross} onChange={handleChange} placeholder="e.g. 360000" className={inp+" text-amber-400 font-bold"} />
            </div>

            {/* Summary Cards — UASIT blue for CTC */}
            <div className="grid grid-cols-3 gap-3 mt-5 mb-5">
              {[
                { label:"Monthly Gross",    value:monthly,   cls:"text-amber-400",   bg:"bg-amber-500/10  border-amber-500/20" },
                { label:"Total Deductions", value:totalDed,  cls:"text-rose-400",    bg:"bg-rose-500/10   border-rose-500/20"  },
                { label:"Net Salary",       value:netSalary, cls:"text-blue-400",    bg:"bg-blue-500/10   border-blue-500/20"  },
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

            {/* Preview Table */}
            <div className="rounded-xl overflow-hidden border border-white/10 mt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600/50 to-cyan-500/30">
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
                        <td className="px-3 py-2 text-blue-200 text-xs">{d?.label??''}</td>
                        <td className="px-3 py-2 text-right text-xs text-blue-200">{d?fmtNum(d.val):''}</td>
                      </tr>
                    )
                  })}
                  <tr className="bg-blue-500/10 border-t border-white/10">
                    <td className="px-3 py-2 text-blue-300 font-bold text-xs">Total Gross Salary</td>
                    <td className="px-3 py-2 text-right text-xs text-blue-300 font-bold">{fmtNum(monthly)}</td>
                    <td className="px-3 py-2 text-gray-500 italic text-xs">N/A</td>
                    <td className="px-3 py-2 text-right text-xs text-rose-400 font-bold">{fmtNum(totalDed)}</td>
                  </tr>
                  <tr className="bg-blue-500/15">
                    <td colSpan={2} className="px-3 py-2 text-blue-200 font-bold text-xs">Net Salary</td>
                    <td className="px-3 py-2 text-gray-500 italic text-xs">N/A</td>
                    <td className="px-3 py-2 text-right text-xs text-blue-200 font-bold">{fmtNum(netSalary)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Net in Words — UASIT blue */}
            <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Net Salary in Words</div>
              <div className="text-blue-300 font-semibold text-sm">{toWords(netSalary)} Only</div>
            </div>
          </div>

          {/* ── Deductions & Settings ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-purple-400 mb-5">🛡️ Deductions & Settings</h2>
            <div className="space-y-4">
              {[
                { key:"pfEmp", label:"Employee PF",  desc:`${form.pfRate}% of (Basic + DA) — deducted from salary` },
                { key:"esiOn", label:"ESI",          desc: esiApplicable?"Applicable (Monthly ≤ ₹21,000)":"Not applicable — Monthly > ₹21,000", disabled:!esiApplicable },
              ].map(({ key, label, desc, disabled }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <div className="text-sm font-medium text-white">{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                  </div>
                  <button onClick={() => !disabled && setForm(prev=>({...prev,[key]:!prev[key]}))}
                    className={`w-11 h-6 rounded-full relative transition-all flex-shrink-0
                      ${form[key]&&!disabled?'bg-gradient-to-r from-blue-500 to-cyan-500':'bg-white/10'}
                      ${disabled?'opacity-40 cursor-not-allowed':'cursor-pointer'}`}>
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

          {/* ── Generate Button — UASIT blue gradient ── */}
          <button onClick={exportPDF}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg">
            ⬇️ Generate Pay Slip (PDF)
          </button>
          <p className="text-center text-gray-600 text-xs pb-8">Print dialog मध्ये "Save as PDF" निवडा</p>

        </div>
      </main>
    </div>
  )
}