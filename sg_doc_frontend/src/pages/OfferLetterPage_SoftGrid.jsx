import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { BG_PAGES } from '../assets/bg_images'
import stampImg  from '../assets/stamp.jpg'
import stamp2Img from '../assets/stamp2.jpg'

const API_URL = 'http://127.0.0.1:8000'

// ─── Company Config ─────────────────────────────────────────────────────────
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

// ─── Number Helpers ──────────────────────────────────────────────────────────
const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
function toWords(n) { n=Math.round(n); if(!n) return "Zero Rupees"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim()+" Rupees" }
function fmtNum(n) { if(n===null||n===undefined||isNaN(n)||n===0) return "—"; return Math.round(n).toLocaleString("en-IN") }
function fmtNumRaw(n) { if(n===null||n===undefined||isNaN(n)) return "0"; return Math.round(n).toLocaleString("en-IN") }
function fmtDate(d) { if(!d) return "—"; const dt=new Date(d); const day=dt.getDate(); const s=day===1?"st":day===2?"nd":day===3?"rd":"th"; return `${day}${s} ${dt.toLocaleDateString("en-IN",{month:"long",year:"numeric"})}` }
function fmtDateSimple(d) { if(!d) return "—"; return new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}) }

// ─── Page style with BG image ─────────────────────────────────────────────
function pageStyle(bgDataUrl, extraTopMm = 0) {
  return `
    position:relative;
    width:210mm;
    min-height:297mm;
    margin:0 auto;
    padding:${38 + extraTopMm}mm 18mm 22mm 18mm;
    font-family:'Segoe UI',Arial,sans-serif;
    font-size:13px;
    color:#1a2e1a;
    background-image:url('${bgDataUrl}');
    background-size:100% 100%;
    background-repeat:no-repeat;
    background-position:center center;
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;
  `
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function OfferLetterPage_SoftGrid() {
  const { selectedCompany } = useAuth()

  const [form, setForm] = useState({
    fullName: '', designation: '', department: '', manager: '',
    location: 'Remote/Hyderabad',
    offerDate: '', joiningDate: '', appointDate: '',
    contractPeriod: '12 Months',
    annualGross: '',
    withPF: true,
    pfRate: 12,
    pfEmrRate: 13,
  })

  const [saveLoading, setSaveLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')
  const [saveError,   setSaveError]   = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // ─── Salary Calculations ─────────────────────────────────────────────────
  const annual      = parseFloat(form.annualGross) || 0
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
    if (!form.fullName) { setSaveError('Please Enter Employee Name '); return }
    setSaveLoading(true); setSaveError(''); setSaveSuccess('')
    try {
      const token = localStorage.getItem('hr_token')
      const res = await fetch(`${API_URL}/offer-letters/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          company_id:     selectedCompany?.id || null,
          full_name:      form.fullName,
          designation:    form.designation,
          department:     form.department,
          manager:        form.manager,
          location:       form.location,
          offer_date:     form.offerDate,
          joining_date:   form.joiningDate,
          appoint_date:   form.appointDate,
          contract_period:form.contractPeriod,
          annual_gross:   annual,
          monthly_gross:  monthly,
          basic:          basicFinal,
          da, hra,
          conveyance:     conv,
          medical:        med,
          special:        otherAllow,
          net_monthly:    netM,
          annual_ctc:     ctcA,
          pf_employee:    form.withPF,
          pf_employer:    form.withPF,
          esi_on:         false,
          pf_rate:        Number(form.pfRate),
          pf_emr_rate:    Number(form.pfEmrRate),
        }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Save failed') }
      const data = await res.json()
      setSaveSuccess(`✅ Offer Letter save झाला! ID: #${data.id}`)
    } catch (err) {
      setSaveError(`⚠️ ${err.message}`)
    } finally {
      setSaveLoading(false)
    }
  }

  // ─── PDF Export ──────────────────────────────────────────────────────────
  const exportPDF = useCallback(() => {
    const bg1 = BG_PAGES[0]
    const bg2 = BG_PAGES[1]
    const bg3 = BG_PAGES[2]
    const bg4 = BG_PAGES[3]

    const pgStyle = (bg, extraTopMm = 0) => `
      width:210mm;
      min-height:297mm;
      margin:0 auto;
      padding:${38 + extraTopMm}mm 18mm 22mm 18mm;
      font-family:'Segoe UI',Arial,sans-serif;
      font-size:14px;
      color:#1a2e1a;
      background-image:url('${bg}');
      background-size:100% 100%;
      background-repeat:no-repeat;
      background-position:center center;
    `

    // ── Salary table rows HTML ──
    const rHTML = salaryRows.map(({ label, naNote, m, y, type }) => {
      const isTotal = type === 'gross' || type === 'net' || type === 'ctc'
      const rowBg   = isTotal ? `background:#e8f5e9;font-weight:700;color:#1a2e1a` : `background:#fff;font-weight:400;color:#1a2e1a`

      const labelHtml = naNote
        ? `<div>${label}</div><div style="color:#e53935;font-size:12px">${naNote}</div>`
        : `<div>${label}</div>`

      return `<tr style="${rowBg}">
        <td style="padding:6px 10px;border:1px solid #a5d6a7;font-size:14px">${labelHtml}</td>
        <td style="padding:6px 10px;border:1px solid #a5d6a7;text-align:right;font-size:14px;background:${isTotal ? '#e8f5e9' : '#fff'}">${m !== null ? fmtNumRaw(m) : "NA"}</td>
        <td style="padding:6px 10px;border:1px solid #a5d6a7;text-align:right;font-size:14px;background:${isTotal ? '#e8f5e9' : '#fff'}">${y !== null ? fmtNumRaw(y) : "NA"}</td>
      </tr>`
    }).join("")

    // ── Reusable header overlay (right side company details) ──
    const headerInfo = `
      <div style="position:absolute;top:10mm;right:8mm;text-align:right;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#1b5e20;line-height:1.9">
        <div style="font-weight:800;font-size:16px;color:#1b5e20;letter-spacing:0.3px">SOFTGRID INFO PVT. LTD.</div>
        <div><strong>GSTIN:</strong> 27ABJCS4985R1Z4</div>
        <div><strong>TAN:</strong> PNES82511C</div>
      </div>`

    // ── Reusable footer overlay ──
    const footerHTML = `
      <div style="position:absolute;bottom:6mm;left:18mm;right:8mm;border-top:1px solid #a5d6a7;padding-top:4px;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#000;font-family:'Segoe UI',Arial,sans-serif">
        <span>Office No. 203, Khandagale Complex, Behind EON Hospital, Kharadi Bypass, Pune MH - 411014</span>
        <span>www.softgridinfo.in | hr@softgridinfo.in</span>
      </div>`

    // ── PAGE 1 — Offer Letter ──
    const page1 = `
    <div style="position:relative;${pgStyle(bg1, 22)}">
      ${headerInfo}
      <h1 style="text-align:center;font-size:19px;font-weight:700;text-decoration:underline;margin:0 0 20px">Offer Letter</h1>
      <p style="margin-bottom:14px;font-size:14px;display:flex;justify-content:space-between;align-items:center"><strong>Dear ${form.fullName || "[Name]"},</strong><span style="color:#1a2e1a;font-size:14px">${fmtDateSimple(form.offerDate)}</span></p>
      <p style="margin-bottom:14px;line-height:1.8;font-size:14px">With reference to your Resume and subsequent interview you had with us, we are pleased to appoint you as a "<strong>${form.designation || "[Designation]"}</strong>" in our organization on the following terms and conditions:</p>
      <p style="margin-bottom:10px;font-size:14px"><strong>Date of Joining:</strong> You are expected to join duty on <strong>${fmtDate(form.joiningDate)}</strong></p>
      <p style="margin-bottom:14px;font-size:14px"><strong>Location:</strong> ${form.location}</p>
      <p style="margin-bottom:14px;line-height:1.8;font-size:14px"><strong>Remuneration:</strong> Your Annual Total Employment Cost to the company would be <strong>Rs. ${fmtNumRaw(annual)}/- Per Annum (${toWords(annual)} Only).</strong> This comprises of your salary and Performance Linked incentives and the details of which is been given in the <strong>Annexure A</strong> attached below.</p>
      <p style="margin-bottom:14px;line-height:1.8;font-size:14px">Please note that the salary will be on the basis of lump sum and taxes applicable will be deducted from your salary every month (if applicable).</p>
      <p style="margin-bottom:14px;line-height:1.8;font-size:14px">You will execute an agreement/contract of confirmed employment with us for a period of <strong>${form.contractPeriod}</strong> including the period of probation executing a bond to that effect.</p>
      <p style="margin-bottom:6px;line-height:1.8;font-size:14px">We welcome you to The <strong>SOFTGRID INFO PVT LTD</strong> family and look forward to a fruitful collaboration.</p>
      <p style="margin-bottom:20px;line-height:1.8;font-size:14px">We are confident you will be able to make a significant contribution to the success of our company and look forward to working with you.</p>
      <p style="margin-bottom:4px;font-size:14px">Yours Sincerely,</p>
      <p style="margin-bottom:4px;font-size:14px">For <strong>SOFTGRID INFO PVT. LTD.</strong></p>
      <p style="font-size:14px">HR Manager</p>
      ${footerHTML}
    </div>`

    // ── PAGE 2 — Annexure A ──
    const page2 = `
    <div style="page-break-before:always;position:relative;${pgStyle(bg2, 15)}">
      ${headerInfo}
      <h2 style="text-align:center;font-size:16px;font-weight:700;text-decoration:underline;margin:20px 0 4px">ANNEXURE 'A'</h2>
      <h3 style="text-align:center;font-size:15px;font-weight:700;margin-bottom:20px">SALARY DISTRIBUTION</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13.5px">
        <thead>
          <tr style="background:#66bb6a;color:#fff">
            <th style="padding:8px 10px;text-align:center;border:1px solid #a5d6a7;font-weight:700;font-size:14px">Particulars</th>
            <th style="padding:8px 10px;text-align:right;border:1px solid #a5d6a7;font-weight:700;font-size:14px">Monthly Salary</th>
            <th style="padding:8px 10px;text-align:right;border:1px solid #a5d6a7;font-weight:700;font-size:14px">Yearly Salary</th>
          </tr>
        </thead>
        <tbody>${rHTML}</tbody>
      </table>
      ${footerHTML}
    </div>`

    // ── PAGE 3 — Notes ──
    const page3 = `
    <div style="page-break-before:always;position:relative;${pgStyle(bg3, 22)}">
      ${headerInfo}
      <p style="font-weight:700;font-size:14px;margin-bottom:12px">Notes:</p>
      <ol style="padding-left:20px;line-height:1.9;font-size:13.5px">
        <li style="margin-bottom:10px">For claiming tax benefits in case of admissible allowance, you will have to submit supporting documents to the Company's satisfaction and within the timeline stipulated by the Company. In case of any under-withholding, you shall be responsible to pay the necessary tax and any interest/penalty thereon.</li>
        <li style="margin-bottom:10px">In case where Permanent Account Number (PAN) is not produced, highest tax rates will apply to all amounts on which tax is deductible at source under the applicable tax law.</li>
        <li style="margin-bottom:10px">The Company reserves the right to change the compensation structure and/or the compensation components from time to time.
          <ol type="a" style="padding-left:20px;margin-top:6px">
            <li style="margin-bottom:6px">50% of your Retention Bonus and the remaining 50% on your one year of completion with us (if applicable).</li>
            <li style="margin-bottom:6px">Retention Bonus - For the first six (6) months of your employment with <strong>SOFTGRID INFO PVT. LTD</strong>, you will be paid 50% of your Retention Bonus and the remaining 50% on your one year of completion with us (if applicable).</li>
          </ol>
        </li>
        <li style="margin-bottom:10px">These statutory payments are included based on current applicable practice and law and are subject to changes based on changes in law from time to time.</li>
        <li style="margin-bottom:10px">Employee's contribution towards PF and Employee's contribution towards ESIC will be made from monthly salary (if applicable).</li>
        <li style="margin-bottom:10px">For employees who are not covered under the PF Act and wish to opt for PF or in the event it becomes obligatory on the company to cover you under the Provident Fund Act or any other relevant acts or rules, as amended from time to time, the Provident Fund being paid to you will be adjusted against Special Allowance or Provident Fund contribution (if applicable).</li>
      </ol>
      ${footerHTML}
    </div>`

    // ── PAGE 4 — Terms ──
    const page4 = `
    <div style="page-break-before:always;position:relative;${pgStyle(bg4, 15)}">
      ${headerInfo}
      <p style="font-weight:700;font-size:14px;margin-bottom:14px">A. The following statutory elements are included in the compensation package stated above: (If Applicable)</p>
      <ol style="padding-left:20px;line-height:1.9;font-size:13.5px;margin-bottom:18px">
        <li style="margin-bottom:10px"><strong><u>Provident Fund</u></strong> - You will be covered under the Employee's Provident Fund (PF) scheme wherein, the Company will contribute towards PF at the statutory rate as may be defined by government from time to time.</li>
        <li style="margin-bottom:10px"><strong><u>Gratuity</u></strong> - Upon cessation of employment after completion of continuous service of at least five (5) years with the Company, you will be eligible for the gratuity as per the Payment of Gratuity Act.</li>
        <li style="margin-bottom:10px"><strong><u>ESIC</u></strong> - As per compensation mentioned above if you are eligible for ESIC then, you will be covered under Employee's State Insurance Act wherein, the Company will contribute towards statutory rate.</li>
      </ol>
      <p style="font-weight:700;font-size:14px;margin-bottom:14px">B. As an employee of the Company, you shall be entitled to the following benefits subject to any change made by the Company from time to time: (If Applicable)</p>
      <ol style="padding-left:20px;line-height:1.9;font-size:13.5px;margin-bottom:18px">
        <li style="margin-bottom:10px"><strong><u>Group Medical Insurance</u></strong> - In accordance with the Company policy you shall be covered under the Medical Insurance policy, which will be held by the Company.</li>
        <li style="margin-bottom:10px"><strong><u>Group Personal Accident Insurance</u></strong> - In accordance with the Company policy you shall be covered under the Personal Accident Insurance policy, which will be held by the Company.</li>
        <li style="margin-bottom:10px"><strong><u>Annual Leave/Public Holidays</u></strong> - You will be eligible for annual leaves and public holidays as determined by the Company's Leave Policy which is subject to change from time to time.</li>
      </ol>
      <p style="line-height:1.8;font-size:14px;margin-bottom:20px">You are required to treat this letter and its contents as strictly confidential and should not disclose same to any person or entity without our written consent.</p>
      <div style="margin-top:10mm;">
        <p style="margin-bottom:2px;font-size:14px">Regards,</p>
        <p style="margin-bottom:2px;font-size:14px">Human Resource</p>
        <p style="margin-bottom:30px;font-size:14px">For <strong>SOFTGRID INFO PVT. LTD.</strong></p>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px;padding:0 10px">
        <div style="text-align:center;min-width:200px;position:relative;left:0;bottom:7mm;">
          <img src="${stamp2Img}" alt="Company Stamp" style="width:150px;height:auto;display:block;margin:0 auto;" />
        </div>
        <div style="text-align:center;min-width:160px;">
          <div style="border-top:1.5px solid #546e54;padding-top:8px;font-size:12px;color:#546e54">
            <strong>Accepted &amp; Agreed</strong>
          </div>
        </div>
      </div>
      <img src="${stampImg}" alt="Signature" style="position:absolute;bottom:40mm;left:50%;transform:translateX(-50%);width:150px;height:auto;" />
      ${footerHTML}
    </div>`

    const pw = window.open("", "_blank")
    pw.document.write(`<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<title>Offer Letter — ${form.fullName || "Employee"} — ${CO.fullName}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#1a2e1a;font-size:13px;background:#f5f5f5}
  @page{size:A4;margin:0}
  @media print{
    html,body{width:210mm;margin:0;background:white}
    .no-print{display:none!important}
    *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
    div[style*="page-break-before"]{page-break-before:always}
  }
  p{margin-bottom:10px;line-height:1.75}
</style>
</head><body>
${page1}${page2}${page3}${page4}
<div class="no-print" style="position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#1e293b,#0f172a);border-top:2px solid #6366f1;padding:16px 28px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:'Segoe UI',sans-serif;">
  <div>
    <div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Offer Letter तयार आहे!</div>
    <div style="color:#64748b;font-size:12px">👇 <strong style="color:#a5b4fc">"Save as PDF"</strong> click करा</div>
  </div>
  <div style="display:flex;gap:10px">
    <button onclick="window.print()" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>
    <button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>
  </div>
</div>
</body></html>`)
    pw.document.close()
  }, [form, annual, monthly, basicFinal, da, hra, conv, med, otherAllow, pfEmpM, pt, netM, netY, pfEmrM, ctcM, ctcA, salaryRows])

  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-indigo-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">
      
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Offer Letter Generator</h1>
        <p className="text-gray-500 text-sm mb-8">{CO.fullName}</p>

        <div className="max-w-2xl space-y-6">

          {/* Employee Info */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-indigo-400 mb-5">👤 Employee Information</h2>
            <div className="space-y-4">
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
            <div>
              <label className={lbl}>Annual Gross (₹)</label>
              <input type="number" name="annualGross" value={form.annualGross} onChange={handleChange} placeholder="e.g. 300000" className={inp+" text-amber-400 font-bold"} />
            </div>
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
                      const cls = {
                        gross:    "bg-green-500/10 text-green-300 font-bold",
                        net:      "bg-amber-500/10 text-amber-300 font-bold",
                        ctc:      "bg-indigo-500/10 text-indigo-300 font-bold",
                        deduct:   "text-rose-300",
                        employer: "text-blue-300",
                        na:       "text-gray-600",
                      }[type] || "text-gray-300"
                      return (
                        <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${cls}`}>
                          <td className="px-3 py-2">
                            <div>{label}</div>
                            {naNote && <div className="text-red-400 text-xs ml-1">({naNote})</div>}
                          </td>
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
              <button
                onClick={() => setForm(p => ({ ...p, withPF: true }))}
                className={`py-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                  form.withPF
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/20'
                    : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="text-2xl mb-2">✅</div>
                <div>With PF</div>
                <div className="text-xs font-normal mt-1 opacity-70">PF deduction + employer contribution</div>
              </button>
              <button
                onClick={() => setForm(p => ({ ...p, withPF: false }))}
                className={`py-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                  !form.withPF
                    ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow-lg shadow-rose-500/20'
                    : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="text-2xl mb-2">❌</div>
                <div>Without PF</div>
                <div className="text-xs font-normal mt-1 opacity-70">PF Not Applicable</div>
              </button>
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
              ) : '💾 Save & Generate PDF'}
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}