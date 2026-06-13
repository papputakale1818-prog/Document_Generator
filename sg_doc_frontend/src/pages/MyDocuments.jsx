import { openPaySlipPDF } from '../components/Payslippdfviewer'

 
import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { BG_PAGES } from '../assets/bg_images'
import stampImg  from '../assets/stamp.jpg'
import stamp2Img from '../assets/stamp2.jpg'
import OfferLetterPDFViewer from '../components/Offerletterpdfviewer'
import { openAppraisalPDF } from '../components/Appraisalletterpreviewsoftgrid'

const API_URL = 'http://127.0.0.1:8000'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtNum(n) { if (n===null||n===undefined||isNaN(n)) return '0'; return Math.round(n).toLocaleString('en-IN') }
function fmtNumRaw(n) { if (n===null||n===undefined||isNaN(n)) return '0'; return Math.round(n).toLocaleString('en-IN') }
function fmtDate(d) { if (!d) return '—'; return new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) }
function fmtDateSimple(d) { if (!d) return '—'; return new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) }
function fmtDateFull(d) { if (!d) return '—'; const dt=new Date(d); const day=dt.getDate(); const s=day===1?'st':day===2?'nd':day===3?'rd':'th'; return `${day}${s} ${dt.toLocaleDateString('en-IN',{month:'long',year:'numeric'})}` }

const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
const tens  = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
function toWords(n) { n=Math.round(n); if(!n) return "Zero Rupees"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim()+" Rupees" }

const CO = {
  fullName:      'SoftGrid Info Pvt. Ltd.',
  themeColor:    '#2e7d32',
  gstin:         '27ABJCS4985R1Z4',
  tan:           'PNES82511C',
  website:       'www.softgridinfo.in',
  email:         'hr@softgridinfo.in',
  addressFooter: 'Office No. 203, Khandagale Complex, Behind EON Hospital, Kharadi Bypass, Pune MH - 411014',
}

// ─── PDF open function ────────────────────────────────────────────────────────
function openOfferLetterPDF(letter, stampImg, stamp2Img) {
  const bg1 = BG_PAGES[0]
  const bg2 = BG_PAGES[1]
  const bg3 = BG_PAGES[2]
  const bg4 = BG_PAGES[3]

  const monthly   = letter.monthly_gross || 0
  const basic     = letter.basic || 0
  const da        = letter.da || 0
  const hra       = letter.hra || 0
  const conv      = letter.conveyance || 0
  const med       = letter.medical || 0
  const special   = letter.special || 0
  const annual    = letter.annual_gross || 0
  const netM      = letter.net_monthly || 0
  const ctcA      = letter.annual_ctc || 0
  const pfRate    = letter.pf_rate || 12
  const pfEmrRate = letter.pf_emr_rate || 13
  const pfEmpM    = letter.pf_employee ? Math.round((basic + da) * pfRate / 100) : 0
  const pfEmrM    = letter.pf_employer ? Math.round((basic + da) * pfEmrRate / 100) : 0
  const pt        = monthly > 0 ? 200 : 0
  const ctcM      = monthly + pfEmrM

  // ── exact same as OfferLetterPage_SoftGrid ──
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

  const headerInfo = `
    <div style="position:absolute;top:10mm;right:8mm;text-align:right;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#1b5e20;line-height:1.9">
      <div style="font-weight:800;font-size:16px;color:#1b5e20;letter-spacing:0.3px">SOFTGRID INFO PVT. LTD.</div>
      <div><strong>GSTIN:</strong> ${CO.gstin}</div>
      <div><strong>TAN:</strong> ${CO.tan}</div>
    </div>`

  const footerHTML = `
    <div style="position:absolute;bottom:6mm;left:18mm;right:8mm;border-top:1px solid #a5d6a7;padding-top:4px;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#000;font-family:'Segoe UI',Arial,sans-serif">
      <span>${CO.addressFooter}</span>
      <span>${CO.website} | ${CO.email}</span>
    </div>`

  // ── Salary rows ──
  const salaryRows = [
    { label:"Basic Salary (Basic)",                                    naNote:null,                                                       m:basic,   y:basic*12,   type:""       },
    { label:"Dearness Allowance (DA)",                                 naNote:null,                                                       m:da,      y:da*12,      type:""       },
    { label:"House Rent Allowance (HRA)",                              naNote:null,                                                       m:hra,     y:hra*12,     type:""       },
    { label:"Conveyance Allowance",                                    naNote:null,                                                       m:conv,    y:conv*12,    type:""       },
    { label:"Medical Allowance",                                       naNote:null,                                                       m:med,     y:med*12,     type:""       },
    { label:"Incentives",                                              naNote:null,                                                       m:null,    y:null,       type:"na"     },
    { label:"Other Allowance",                                         naNote:null,                                                       m:special, y:special*12, type:""       },
    { label:"Gross Salary",                                            naNote:null,                                                       m:monthly, y:annual,     type:"gross"  },
    { label:"Provident Fund (Employee Deduction)",                     naNote:letter.pf_employee?null:"Not Applicable*",                  m:letter.pf_employee?pfEmpM:null, y:letter.pf_employee?pfEmpM*12:null, type:"deduct"  },
    { label:"ESIC (Employee Deduction)",                               naNote:"Not Applicable*",                                          m:null,    y:null,       type:"deduct" },
    { label:"Professional Tax (Employee Deduction)",                   naNote:null,                                                       m:pt,      y:pt*12,      type:"deduct" },
    { label:"TDS (Depends on IT Slabs & Exemptions/Loan Recovery)",    naNote:null,                                                       m:null,    y:null,       type:"na"     },
    { label:"Net Salary",                                              naNote:null,                                                       m:netM,    y:netM*12,    type:"net"    },
    { label:"Provident Fund (Employer Contribution)",                  naNote:letter.pf_employer?null:"Not Applicable*",                  m:letter.pf_employer?pfEmrM:null, y:letter.pf_employer?pfEmrM*12:null, type:"employer"},
    { label:"ESIC (Employer Contribution)",                            naNote:null,                                                       m:null,    y:null,       type:"na"     },
    { label:"Gratuity (Employer Contribution)",                        naNote:null,                                                       m:null,    y:null,       type:"na"     },
    { label:"Bonus (Employer Contribution)",                           naNote:null,                                                       m:null,    y:null,       type:"na"     },
    { label:"Variable Pay (Employer Contribution)",                    naNote:null,                                                       m:null,    y:null,       type:"na"     },
    { label:"Cost To Company (CTC)",                                   naNote:null,                                                       m:ctcM,    y:ctcA,       type:"ctc"    },
  ]

  const rHTML = salaryRows.map(({ label, naNote, m, y, type }) => {
    const isTotal = type === 'gross' || type === 'net' || type === 'ctc'
    const rowBg   = isTotal ? `background:#e8f5e9;font-weight:700;color:#1a2e1a` : `background:#fff;font-weight:400;color:#1a2e1a`

    const labelHtml = naNote
      ? `<div>${label}</div><div style="color:#e53935;font-size:12px">${naNote}</div>`
      : `<div>${label}</div>`

    return `<tr style="${rowBg}">
      <td style="padding:6px 10px;border:1px solid #a5d6a7;font-size:14px">${labelHtml}</td>
      <td style="padding:6px 10px;border:1px solid #a5d6a7;text-align:right;font-size:14px;background:${isTotal ? '#e8f5e9' : '#fff'}">${m!==null?fmtNumRaw(m):'NA'}</td>
      <td style="padding:6px 10px;border:1px solid #a5d6a7;text-align:right;font-size:14px;background:${isTotal ? '#e8f5e9' : '#fff'}">${y!==null?fmtNumRaw(y):'NA'}</td>
    </tr>`
  }).join('')

  // ── PAGE 1 ──
  const page1 = `
  <div style="position:relative;${pgStyle(bg1, 22)}">
    ${headerInfo}
    <p style="margin-bottom:6px;font-size:14px;text-align:right">${fmtDateSimple(letter.offer_date)}</p>
    <h1 style="text-align:center;font-size:19px;font-weight:700;text-decoration:underline;margin:0 0 20px">Offer Letter</h1>
    <p style="margin-bottom:-4px;font-size:14px"><strong>Dear ${(letter.full_name || '').split(' ')[0] || letter.full_name || ''},</strong></p>
    ${letter.emp_id ? `<p style="margin-bottom:14px;font-size:14px"><strong>Employee ID:</strong> ${letter.emp_id}</p>` : ''}
    <p style="margin-bottom:14px;line-height:1.8;font-size:14px">With reference to your Resume and subsequent interview you had with us, we are pleased to appoint you as a "<strong>${letter.designation || ''}</strong>" in our organization on the following terms and conditions:</p>
    <p style="margin-bottom:10px;font-size:14px"><strong>Date of Joining:</strong> You are expected to join duty on <strong>${fmtDateFull(letter.joining_date)}</strong></p>
    <p style="margin-bottom:14px;font-size:14px"><strong>Location:</strong> ${letter.location || ''}</p>
    <p style="margin-bottom:14px;line-height:1.8;font-size:14px"><strong>Remuneration:</strong> Your Annual Total Employment Cost to the company would be <strong>Rs. ${fmtNum(annual)}/- Per Annum (${toWords(annual)} Only).</strong> This comprises of your salary and Performance Linked incentives and the details of which is been given in the <strong>Annexure A</strong> attached below.</p>
    <p style="margin-bottom:14px;line-height:1.8;font-size:14px">Please note that the salary will be on the basis of lump sum and taxes applicable will be deducted from your salary every month (if applicable).</p>
    <p style="margin-bottom:14px;line-height:1.8;font-size:14px">You will execute an agreement/contract of confirmed employment with us for a period of <strong>${letter.contract_period || ''}</strong> including the period of probation executing a bond to that effect.</p>
    <p style="margin-bottom:6px;line-height:1.8;font-size:14px">We welcome you to The <strong>SOFTGRID INFO PVT LTD</strong> family and look forward to a fruitful collaboration.</p>
    <p style="margin-bottom:20px;line-height:1.8;font-size:14px">We are confident you will be able to make a significant contribution to the success of our company and look forward to working with you.</p>
    <p style="margin-bottom:4px;font-size:14px">Yours Sincerely,</p>
    <p style="margin-bottom:4px;font-size:14px">For <strong>SOFTGRID INFO PVT. LTD.</strong></p>
    <p style="font-size:14px">HR Manager</p>
    ${footerHTML}
  </div>`

  // ── PAGE 2 ──
  const page2 = `
  <div style="page-break-before:always;position:relative;${pgStyle(bg2, 7)}">
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

  // ── PAGE 3 ──
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

  // ── PAGE 4 ──
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

  const pw = window.open('', '_blank')
  pw.document.write(`<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<title>Offer Letter — ${letter.full_name} — ${CO.fullName}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#1a2e1a;font-size:14px;background:#f5f5f5}
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
    <div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Offer Letter — ${letter.full_name}</div>
    <div style="color:#64748b;font-size:12px">👇 <strong style="color:#a5b4fc">"Save as PDF"</strong> to save the file</div>
  </div>
  <div style="display:flex;gap:10px">
    <button onclick="window.print()" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>
    <button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>
  </div>
</div>
</body></html>`)
  pw.document.close()
}

const DOC_TABS = [
  { key: 'all',                 label: 'All Documents',      icon: '📂', color: 'slate'    },
  { key: 'offer_letter',        label: 'Offer',              icon: '📋', color: 'indigo'   },
  { key: 'offer_confirmation',  label: 'Offer Confirmation', icon: '✅', color: 'violet'   },
  { key: 'payslip',             label: 'Payslip',                   icon: '💰', color: 'emerald'  },
  { key: 'appraisal',           label: 'Appraisal',          icon: '📈', color: 'amber'    },
  { key: 'relieving',           label: 'Relieving',          icon: '🚪', color: 'rose'     },
  { key: 'experience',          label: 'Experience',         icon: '🎓', color: 'cyan'     },
]

const TAB_COLORS = {
  slate:   { active: 'bg-white/15 text-white border-white/30',                inactive: 'text-gray-400 border-transparent hover:text-white hover:bg-white/10'           },
  indigo:  { active: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50',  inactive: 'text-gray-400 border-transparent hover:text-indigo-300 hover:bg-indigo-500/10'  },
  violet:  { active: 'bg-violet-500/20 text-violet-300 border-violet-500/50',  inactive: 'text-gray-400 border-transparent hover:text-violet-300 hover:bg-violet-500/10'  },
  emerald: { active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50', inactive: 'text-gray-400 border-transparent hover:text-emerald-300 hover:bg-emerald-500/10' },
  amber:   { active: 'bg-amber-500/20 text-amber-300 border-amber-500/50',     inactive: 'text-gray-400 border-transparent hover:text-amber-300 hover:bg-amber-500/10'     },
  rose:    { active: 'bg-rose-500/20 text-rose-300 border-rose-500/50',        inactive: 'text-gray-400 border-transparent hover:text-rose-300 hover:bg-rose-500/10'       },
  cyan:    { active: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',        inactive: 'text-gray-400 border-transparent hover:text-cyan-300 hover:bg-cyan-500/10'       },
}

// ─── Coming Soon Placeholder ──────────────────────────────────────────────────
function ComingSoonSection({ tab }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-4">{tab.icon}</div>
      <h2 className="text-xl font-semibold text-gray-300 mb-2">{tab.label}</h2>
      <p className="text-gray-500 text-sm">These documents will be available soon</p>
      <div className="mt-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-500">Coming Soon</div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MyDocuments() {
  const { user } = useAuth()
  const [letters,  setLetters]  = useState([])
  const [payslips, setPayslips] = useState([])
  const [appraisals, setAppraisals] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [deleting, setDeleting] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [viewingLetter, setViewingLetter] = useState(null)
  const [viewingAppraisal, setViewingAppraisal] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const canDelete = (letter) =>
    user?.role === 'admin' || letter.created_by === user?.id

  const handleViewAppraisal = (ap) => {
    openAppraisalPDF({
      empName:         ap.employee_name  || ap.emp_name   || ap.full_name  || '',
      empId:           ap.emp_id         || '',
      designation:     ap.designation    || '',
      letterDate:      ap.letter_date    || ap.created_at || '',
      effectiveDate:   ap.effective_date || ap.letter_date || ap.created_at || '',
      newMonthly:      ap.new_monthly    || ap.monthly_gross || ap.new_salary || 0,
      created_by_name: ap.created_by_name || '',
    })
  }

  const fetchLetters = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const token = localStorage.getItem('hr_token')
      const headers = { Authorization: `Bearer ${token}` }
      const companyId = user?.company_id

      const [letRes, psRes, apRes, empRes, usersRes, companiesRes] = await Promise.all([
        fetch(`${API_URL}/offer-letters/`, { headers }),
        fetch(`${API_URL}/payslips/`,      { headers }),
        fetch(`${API_URL}/appraisal-letters/`, { headers }),
        companyId ? fetch(`${API_URL}/employees/?company_id=${companyId}`, { headers }) : Promise.resolve({ ok: false }),
        fetch(`${API_URL}/users/?limit=1000`, { headers }),
        fetch(`${API_URL}/companies/`,     { headers }),
      ])

      if (!letRes.ok) throw new Error('Failed to load Offer Letters')
      if (!psRes.ok)  throw new Error('Failed to load Pay Slips')

      const letters  = await letRes.json()
      const payslips = await psRes.json()
      const appraisals = apRes.ok ? await apRes.json() : []

      // ── employees map build karo (emp_id → employee object) ──
      let empMap = {}
      if (empRes.ok) {
        const emps = await empRes.json()
        emps.forEach(e => { empMap[e.emp_id] = e })
      }

      // ── users map build karo (id → user object) ──
      let usersMap = {}
      if (usersRes.ok) {
        const users = await usersRes.json()
        users.forEach(u => { usersMap[u.id] = u })
      }

      // ── companies map build karo (id → company object) ──
      let companiesMap = {}
      if (companiesRes.ok) {
        const companies = await companiesRes.json()
        companies.forEach(c => { companiesMap[c.id] = c })
      }

      // ── DEBUG: raw API data log karo ──
      console.log('=== DEBUG MyDocuments ===')
      console.log('payslips raw (first):', payslips[0])
      console.log('payslips[0] keys:', payslips[0] ? Object.keys(payslips[0]) : 'empty')
      console.log('payslips[0] created_by_name:', payslips[0]?.created_by_name)
      console.log('payslips[0] company_id:', payslips[0]?.company_id)
      console.log('payslips[0] emp_id:', payslips[0]?.emp_id)
      console.log('payslips[0] emp_name:', payslips[0]?.emp_name)
      console.log('empMap keys:', Object.keys(empMap).slice(0, 3))
      console.log('usersMap keys:', Object.keys(usersMap).slice(0, 3))
      console.log('companiesMap keys:', Object.keys(companiesMap).slice(0, 3))
      console.log('usersRes.ok:', usersRes.ok, '| companiesRes.ok:', companiesRes.ok)

      // ── each payslip madhe employee + user + company data merge karo ──
      const mergedPayslips = payslips.map(ps => {
        const emp     = empMap[ps.emp_id]           || {}
        const creator = usersMap[ps.created_by]     || {}
        const company = companiesMap[ps.company_id] || {}
        return {
          ...ps,
          emp_name:        ps.emp_name        || emp.full_name               || '',
          designation:     ps.designation     || emp.designation             || '',
          department:      ps.department      || emp.department              || '',
          uan_number:      ps.uan_number      || emp.uan_number              || '',
          pf_number:       ps.pf_number       || emp.pf_number               || '',
          pan_number:      ps.pan_number      || emp.pan                     || '',
          adhar_number:    ps.adhar_number    || emp.aadhar                  || '',
          bank_name:       ps.bank_name       || emp.bank_name               || '',
          account_no:      ps.account_no      || emp.bank_acc                || '',
          created_by_name: ps.created_by_name || creator.full_name || creator.username || '',
          company_name:    ps.company_name    || company.name                || '',
        }
      })

      // ── appraisal letters madhe creator name ──
      // created_by_name already comes directly from backend (_attach_extra)

      // ── each appraisal madhe employee + creator + company data merge karo ──
      const mergedAppraisals = appraisals.map(ap => {
        const emp     = empMap[ap.emp_id]           || {}
        const company = companiesMap[ap.company_id] || {}
        return {
          ...ap,
          employee_name:   ap.employee_name   || ap.emp_name || ap.full_name || emp.full_name || '',
          designation:     ap.designation     || emp.designation || '',
          department:      ap.department      || emp.department  || '',
          created_by_name: ap.created_by_name || '',
          company_name:    ap.company_name    || company.name || '',
        }
      })

      setLetters(letters)
      setPayslips(mergedPayslips)
      setAppraisals(mergedAppraisals)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchLetters() }, [fetchLetters])

  const handleDelete = async (id) => {
    if (!window.confirm('Do you want to delete this offer letter?')) return
    setDeleting(id)
    try {
      const token = localStorage.getItem('hr_token')
      await fetch(`${API_URL}/offer-letters/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setLetters(prev => prev.filter(l => l.id !== id))
    } catch {
      alert('Delete failed, try again.')
    } finally {
      setDeleting(null)
    }
  }

  const handleDeletePayslip = async (id) => {
    if (!window.confirm('Do you want to delete this pay slip?')) return
    setDeleting(id)
    try {
      const token = localStorage.getItem('hr_token')
      const res = await fetch(`${API_URL}/payslips/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Delete failed')
      setPayslips(prev => prev.filter(ps => ps.id !== id))
    } catch {
      alert('Delete failed, try again.')
    } finally {
      setDeleting(null)
    }
  }

  const handleDeleteAppraisal = async (id) => {
    if (!window.confirm('Do you want to delete this appraisal letter?')) return
    setDeleting(id)
    try {
      const token = localStorage.getItem('hr_token')
      const res = await fetch(`${API_URL}/appraisal-letters/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Delete failed')
      setAppraisals(prev => prev.filter(ap => ap.id !== id))
    } catch {
      alert('Delete failed, try again.')
    } finally {
      setDeleting(null)
    }
  }

  // ── Search Filter ──
  const q = searchQuery.trim().toLowerCase()
  const filteredLetters  = q
    ? letters.filter(l =>
        (l.full_name || '').toLowerCase().includes(q) ||
        String(l.emp_id || '').toLowerCase().includes(q) ||
        String(l.id || '').toLowerCase().includes(q)
      )
    : letters
  const filteredPayslips = q
    ? payslips.filter(ps =>
        (ps.emp_name || '').toLowerCase().includes(q) ||
        String(ps.emp_id || '').toLowerCase().includes(q)
      )
    : payslips

  const filteredAppraisals = q
    ? appraisals.filter(ap =>
        (ap.employee_name || '').toLowerCase().includes(q) ||
        String(ap.emp_id || '').toLowerCase().includes(q)
      )
    : appraisals

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">
      <Sidebar />

      {/* ── Offer Letter PDF Viewer ── */}
      {viewingLetter && (
        <OfferLetterPDFViewer
          letter={viewingLetter}
          onClose={() => setViewingLetter(null)}
        />
      )}

      {/* ── Appraisal Letter Preview ── */}


      <main className="flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">📄 My Documents</h1>
            <p className="text-gray-500 text-sm mt-1">All your HR documents in one place</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-400">{letters.length + payslips.length + appraisals.length}</div>
            <div className="text-xs text-gray-500">Total Documents</div>
          </div>
        </div>

        {/* ── Search Bar ── */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0z"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Employee Name or Emp ID..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-xs text-gray-500">
              🔍 "<span className="text-indigo-300">{searchQuery}</span>" — Results: {filteredLetters.length} letters · {filteredPayslips.length} payslips · {filteredAppraisals.length} appraisals
            </p>
          )}
        </div>

        {/* ── Document Type Navbar ── */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-1">
            {DOC_TABS.map((tab) => {
              const isActive = activeTab === tab.key
              const colors = TAB_COLORS[tab.color]
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${isActive ? colors.active : colors.inactive}`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.key === 'all' && (letters.length + payslips.length + appraisals.length) > 0 && (
                    <span className="ml-1 text-xs bg-white/10 px-1.5 py-0.5 rounded-full">
                      {searchQuery ? filteredLetters.length + filteredPayslips.length + filteredAppraisals.length : letters.length + payslips.length + appraisals.length}
                    </span>
                  )}
                  {tab.key === 'offer_letter' && letters.length > 0 && (
                    <span className="ml-1 text-xs bg-white/10 px-1.5 py-0.5 rounded-full">
                      {searchQuery ? filteredLetters.length : letters.length}
                    </span>
                  )}
                  {tab.key === 'payslip' && payslips.length > 0 && (
                    <span className="ml-1 text-xs bg-white/10 px-1.5 py-0.5 rounded-full">
                      {searchQuery ? filteredPayslips.length : payslips.length}
                    </span>
                  )}
                  {tab.key === 'appraisal' && appraisals.length > 0 && (
                    <span className="ml-1 text-xs bg-white/10 px-1.5 py-0.5 rounded-full">
                      {searchQuery ? filteredAppraisals.length : appraisals.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          {/* Divider line */}
          <div className="mt-2 h-px bg-white/5" />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <p className="text-gray-400 text-sm">Documents are loading...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* ── TAB CONTENT ── */}

        {/* All Documents Tab */}
        {!loading && activeTab === 'all' && (
          <div className="space-y-8">
            {filteredLetters.length === 0 && filteredPayslips.length === 0 && filteredAppraisals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">{searchQuery ? '🔍' : '📭'}</div>
                <h2 className="text-xl font-semibold text-gray-300 mb-2">
                  {searchQuery ? `"${searchQuery}" — No Documents found` : 'No Documents Found'}
                </h2>
                <p className="text-gray-500 text-sm">{searchQuery ? 'Try searching with a different name or ID' : 'No documents have been generated yet'}</p>
              </div>
            ) : (
              <>
                {filteredLetters.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-indigo-400 mb-4">📋 Offer Letters
                      <span className="ml-2 text-xs font-normal bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">{filteredLetters.length}</span>
                    </h2>
                    <div className="space-y-4">
                      {filteredLetters.map((letter, idx) => (
                        <div key={`all-l-${letter.id ?? idx}`} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl hover:border-indigo-500/30 transition-all">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                {letter.full_name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-white font-semibold text-base truncate">{letter.full_name}</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {letter.designation && <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">{letter.designation}</span>}
                                  {letter.department  && <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full">{letter.department}</span>}
                                </div>
                                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                                  {letter.joining_date    && <span>📅 Joining: <span className="text-gray-300">{fmtDate(letter.joining_date)}</span></span>}
                                  {letter.offer_date      && <span>📋 Offer: <span className="text-gray-300">{fmtDate(letter.offer_date)}</span></span>}
                                  {letter.location        && <span>📍 Location: <span className="text-gray-300">{letter.location}</span></span>}
                                  {letter.contract_period && <span>🔖 Contract: <span className="text-gray-300">{letter.contract_period}</span></span>}
                                </div>
                                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                                  <span>📊 Gross/Month: <span className="text-gray-300">₹ {fmtNum(letter.monthly_gross)}</span></span>
                                  <span>💰 CTC: <span className="text-emerald-400 font-semibold">₹ {fmtNum(letter.annual_ctc)}</span></span>
                                  <span>💵 Net/Month: <span className="text-amber-400 font-semibold">₹ {fmtNum(letter.net_monthly)}</span></span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                              <button onClick={() => setViewingLetter(letter)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                View
                              </button>
                              {canDelete(letter) && (
                                <button onClick={() => handleDelete(letter.id)} disabled={deleting === letter.id} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 active:scale-95 transition-all disabled:opacity-50">
                                  {deleting === letter.id ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>}
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center flex-wrap gap-2 mt-4 pt-3 border-t border-white/5 text-xs text-gray-500">
                            <span>#{letter.id}</span><span className="text-white/10">·</span>
                            {letter.emp_id          && <span>EMP: {letter.emp_id}</span>}
                            {letter.created_by_name && <><span className="text-white/10">·</span><span className="text-indigo-400">✍️ {letter.created_by_name}</span></>}

                            {letter.company_id      && <span className="text-gray-600">· 🏢 {letter.company_name || `Company #${letter.company_id}`}</span>}
                            {letter.created_at      && <><span className="text-white/10">·</span><span>{new Date(letter.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span></>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {filteredPayslips.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-emerald-400 mb-4">💰 Pay Slips
                      <span className="ml-2 text-xs font-normal bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">{filteredPayslips.length}</span>
                    </h2>
                    <div className="space-y-4">
                      {filteredPayslips.map((ps, idx) => (
                        <div key={`all-p-${ps.id ?? idx}`} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl hover:border-emerald-500/30 transition-all">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                {ps.emp_name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-white font-semibold text-base truncate">{ps.emp_name}</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {ps.designation && <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">{ps.designation}</span>}
                                  {ps.department  && <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full">{ps.department}</span>}
                                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">📅 {ps.month} {ps.year}</span>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                                  {ps.monthly_gross && <span>📊 Gross: <span className="text-gray-300">₹ {fmtNum(ps.monthly_gross)}</span></span>}
                                  {ps.net_salary    && <span>💵 Net: <span className="text-amber-400 font-semibold">₹ {fmtNum(ps.net_salary)}</span></span>}
                                  {ps.paid_days     && <span>🗓️ Paid Days: <span className="text-gray-300">{ps.paid_days}</span></span>}
                                </div>

                              </div>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                              <button onClick={() => openPaySlipPDF(ps)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                View
                              </button>
                              {canDelete(ps) && (
                                <button onClick={() => handleDeletePayslip(ps.id)} disabled={deleting === ps.id} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 active:scale-95 transition-all disabled:opacity-50">
                                  {deleting === ps.id ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>}
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center flex-wrap gap-2 mt-4 pt-3 border-t border-white/5 text-xs text-gray-500">
                            <span>#{ps.id}</span><span className="text-white/10">·</span>
                            {ps.emp_id          && <><span>EMP: {ps.emp_id}</span><span className="text-white/10">·</span></>}
                            {ps.created_by_name && <><span className="text-emerald-400">✍️ {ps.created_by_name}</span><span className="text-white/10">·</span></>}

                            {ps.company_id      && <><span className="text-gray-400">🏢 <span className="text-gray-300">{ps.company_name || `Company #${ps.company_id}`}</span></span><span className="text-white/10">·</span><span className="text-gray-500">Co. ID: {ps.company_id}</span></>}
                            {ps.created_at      && <><span className="text-white/10">·</span><span>{new Date(ps.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span></>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {filteredAppraisals.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-amber-400 mb-4">📈 Appraisal Letters
                      <span className="ml-2 text-xs font-normal bg-amber-500/20 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">{filteredAppraisals.length}</span>
                    </h2>
                    <div className="space-y-4">
                      {filteredAppraisals.map((ap, idx) => (
                        <div key={`all-a-${ap.id ?? idx}`} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl hover:border-amber-500/30 transition-all">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                {(ap.employee_name)?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-white font-semibold text-base truncate">{ap.employee_name}</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {ap.designation && (
                                    <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">{ap.designation}</span>
                                  )}
                                  {ap.department && (
                                    <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full">{ap.department}</span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                                  {ap.effective_date && <span>📅 Effective: <span className="text-gray-300">{fmtDate(ap.effective_date)}</span></span>}
                                </div>
                                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                                  {ap.old_ctc != null && <span>📊 Old CTC: <span className="text-gray-300">₹ {fmtNum(ap.old_ctc)}</span></span>}
                                  {ap.new_ctc != null && <span>💰 New CTC: <span className="text-emerald-400 font-semibold">₹ {fmtNum(ap.new_ctc)}</span></span>}
                                  {ap.old_ctc != null && ap.new_ctc != null && ap.old_ctc > 0 && (
                                    <span>📈 Increment: <span className="text-amber-400 font-semibold">{(((ap.new_ctc - ap.old_ctc) / ap.old_ctc) * 100).toFixed(1)}%</span></span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                              <button onClick={() => handleViewAppraisal(ap)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                View
                              </button>
                              {canDelete(ap) && (
                                <button onClick={() => handleDeleteAppraisal(ap.id)} disabled={deleting === ap.id} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 active:scale-95 transition-all disabled:opacity-50">
                                  {deleting === ap.id ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>}
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center flex-wrap gap-2 mt-4 pt-3 border-t border-white/5 text-xs text-gray-500">
                            <span>#{ap.id}</span>
                            <span className="text-white/10">·</span>
                            {ap.emp_id          && <><span>EMP: {ap.emp_id}</span><span className="text-white/10">·</span></>}
                            {ap.created_by_name && <><span className="text-amber-400">✍️ {ap.created_by_name}</span><span className="text-white/10">·</span></>}
                            {ap.company_id      && <><span className="text-gray-400">🏢 <span className="text-gray-300">{ap.company_name || `Company #${ap.company_id}`}</span></span><span className="text-white/10">·</span><span className="text-gray-500">Co. ID: {ap.company_id}</span></>}
                            {ap.created_at      && (
                              <>
                                <span className="text-white/10">·</span>
                                <span>{new Date(ap.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Offer Letter Tab */}
        {!loading && activeTab === 'offer_letter' && (
          <div className="mb-10">
            {filteredLetters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">{searchQuery ? '🔍' : '📭'}</div>
                <h2 className="text-xl font-semibold text-gray-300 mb-2">
                  {searchQuery ? `"${searchQuery}" — No Offer Letters found` : 'No Offer Letters Found'}
                </h2>
                <p className="text-gray-500 text-sm">{searchQuery ? 'Try searching with a different name or ID' : 'No Offer Letters have been generated yet'}</p>
              </div>
            ) : (
              <>
            <h2 className="text-lg font-semibold text-indigo-400 mb-4">📋 Offer Letters
              <span className="ml-2 text-xs font-normal bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">{filteredLetters.length}</span>
            </h2>
            <div className="space-y-4">
            {filteredLetters.map((letter, idx) => (
              <div key={letter.id ?? idx} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl hover:border-indigo-500/30 transition-all">
                <div className="flex items-start justify-between gap-4">

                  {/* Left */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {letter.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold text-base truncate">{letter.full_name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {letter.designation && (
                          <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">{letter.designation}</span>
                        )}
                        {letter.department && (
                          <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full">{letter.department}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                        {letter.joining_date    && <span>📅 Joining: <span className="text-gray-300">{fmtDate(letter.joining_date)}</span></span>}
                        {letter.offer_date      && <span>📋 Offer: <span className="text-gray-300">{fmtDate(letter.offer_date)}</span></span>}
                        {letter.location        && <span>📍 Location: <span className="text-gray-300">{letter.location}</span></span>}
                        {letter.contract_period && <span>🔖 Contract: <span className="text-gray-300">{letter.contract_period}</span></span>}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                        <span>📊 Gross/Month: <span className="text-gray-300">₹ {fmtNum(letter.monthly_gross)}</span></span>
                        <span>💰 CTC: <span className="text-emerald-400 font-semibold">₹ {fmtNum(letter.annual_ctc)}</span></span>
                        <span>💵 Net/Month: <span className="text-amber-400 font-semibold">₹ {fmtNum(letter.net_monthly)}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Buttons */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => setViewingLetter(letter)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      View Document
                    </button>

                    {canDelete(letter) && (
                      <button
                        onClick={() => handleDelete(letter.id)}
                        disabled={deleting === letter.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {deleting === letter.id ? (
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        )}
                        Delete
                      </button>
                    )}
                  </div>

                </div>

                {/* Bottom meta */}
                <div className="flex items-center flex-wrap gap-2 mt-4 pt-3 border-t border-white/5 text-xs text-gray-500">
                  <span>#{letter.id}</span>
                  <span className="text-white/10">·</span>
                  {letter.emp_id          && <><span>EMP: {letter.emp_id}</span><span className="text-white/10">·</span></>}
                  {letter.created_by_name && <><span className="text-indigo-400">✍️ {letter.created_by_name}</span><span className="text-white/10">·</span></>}

                  {letter.company_id      && <><span className="text-gray-400">🏢 <span className="text-gray-300">{letter.company_name || `Company #${letter.company_id}`}</span></span><span className="text-gray-500 text-white/10">·</span><span className="text-gray-500">Co. ID: {letter.company_id}</span></>}
                  {letter.created_at      && (
                    <>
                      <span className="text-white/10">·</span>
                      <span>{new Date(letter.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                    </>
                  )}
                </div>

              </div>
            ))}
            </div>
              </>
            )}
          </div>
        )}

        {/* Payslip Tab */}
        {!loading && activeTab === 'payslip' && (
          <div>
            {filteredPayslips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">{searchQuery ? '🔍' : '📭'}</div>
                <h2 className="text-xl font-semibold text-gray-300 mb-2">
                  {searchQuery ? `"${searchQuery}" — No Pay Slips found` : 'No Pay Slips Found'}
                </h2>
                <p className="text-gray-500 text-sm">{searchQuery ? 'Try searching with a different name or ID' : 'No Pay Slips have been generated yet'}</p>
              </div>
            ) : (
              <>
            <h2 className="text-lg font-semibold text-emerald-400 mb-4">💰 Pay Slips
              <span className="ml-2 text-xs font-normal bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">{filteredPayslips.length}</span>
            </h2>
            <div className="space-y-4">
              {filteredPayslips.map((ps, idx) => (
                <div key={ps.id ?? idx} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl hover:border-emerald-500/30 transition-all">
                  <div className="flex items-start justify-between gap-4">

                    {/* Left */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {ps.emp_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-semibold text-base truncate">{ps.emp_name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {ps.designation && <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">{ps.designation}</span>}
                          {ps.department  && <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full">{ps.department}</span>}
                          <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">📅 {ps.month} {ps.year}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                          {ps.monthly_gross && <span>📊 Gross: <span className="text-gray-300">₹ {fmtNum(ps.monthly_gross)}</span></span>}
                          {ps.net_salary    && <span>💵 Net: <span className="text-amber-400 font-semibold">₹ {fmtNum(ps.net_salary)}</span></span>}
                          {ps.paid_days     && <span>🗓️ Paid Days: <span className="text-gray-300">{ps.paid_days}</span></span>}
                        </div>
                         
                      </div>
                    </div>

                    {/* Right Button */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => openPaySlipPDF(ps)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      View Pay Slip
                    </button>
                    {canDelete(ps) && (
                      <button onClick={() => handleDeletePayslip(ps.id)} disabled={deleting === ps.id} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 active:scale-95 transition-all disabled:opacity-50">
                        {deleting === ps.id ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>}
                        Delete
                      </button>
                    )}
                    </div>

                  </div>

                  {/* Bottom meta */}
                  <div className="flex items-center flex-wrap gap-2 mt-4 pt-3 border-t border-white/5 text-xs text-gray-500">
                    <span>#{ps.id}</span>
                    <span className="text-white/10">·</span>
                    {ps.emp_id          && <><span>EMP: {ps.emp_id}</span><span className="text-white/10">·</span></>}
                    {ps.created_by_name && <><span className="text-emerald-400">✍️ {ps.created_by_name}</span><span className="text-white/10">·</span></>}

                    {ps.company_id      && <><span className="text-gray-400">🏢 <span className="text-gray-300">{ps.company_name || `Company #${ps.company_id}`}</span></span><span className="text-white/10">·</span><span className="text-gray-500">Co. ID: {ps.company_id}</span></>}
                    {ps.created_at      && (
                      <>
                        <span className="text-white/10">·</span>
                        <span>{new Date(ps.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                      </>
                    )}
                  </div>

                </div>
              ))}
            </div>
              </>
            )}
          </div>
        )}

        {!loading && activeTab === 'appraisal' && (
          <div className="mb-10">
            {filteredAppraisals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">{searchQuery ? '🔍' : '📭'}</div>
                <h2 className="text-xl font-semibold text-gray-300 mb-2">
                  {searchQuery ? `"${searchQuery}" — No Appraisal Letters found` : 'No Appraisal Letters Found'}
                </h2>
                <p className="text-gray-500 text-sm">{searchQuery ? 'Try searching with a different name or ID' : 'No Appraisal Letters have been generated yet'}</p>
              </div>
            ) : (
              <>
            <h2 className="text-lg font-semibold text-amber-400 mb-4">📈 Appraisal Letters
              <span className="ml-2 text-xs font-normal bg-amber-500/20 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">{filteredAppraisals.length}</span>
            </h2>
            <div className="space-y-4">
            {filteredAppraisals.map((ap, idx) => (
              <div key={ap.id ?? idx} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl hover:border-amber-500/30 transition-all">
                <div className="flex items-start justify-between gap-4">

                  {/* Left */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {(ap.employee_name)?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold text-base truncate">{ap.employee_name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {ap.designation && (
                          <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">{ap.designation}</span>
                        )}
                        {ap.department && (
                          <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full">{ap.department}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                        {ap.effective_date && <span>📅 Effective: <span className="text-gray-300">{fmtDate(ap.effective_date)}</span></span>}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                        {ap.old_ctc != null && <span>📊 Old CTC: <span className="text-gray-300">₹ {fmtNum(ap.old_ctc)}</span></span>}
                        {ap.new_ctc != null && <span>💰 New CTC: <span className="text-emerald-400 font-semibold">₹ {fmtNum(ap.new_ctc)}</span></span>}
                        {ap.old_ctc != null && ap.new_ctc != null && ap.old_ctc > 0 && (
                          <span>📈 Increment: <span className="text-amber-400 font-semibold">{(((ap.new_ctc - ap.old_ctc) / ap.old_ctc) * 100).toFixed(1)}%</span></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Buttons */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleViewAppraisal(ap)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      View
                    </button>
                    {canDelete(ap) && (
                      <button
                        onClick={() => handleDeleteAppraisal(ap.id)}
                        disabled={deleting === ap.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {deleting === ap.id ? (
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        )}
                        Delete
                      </button>
                    )}
                  </div>

                </div>

                {/* Bottom meta */}
                <div className="flex items-center flex-wrap gap-2 mt-4 pt-3 border-t border-white/5 text-xs text-gray-500">
                  <span>#{ap.id}</span>
                  <span className="text-white/10">·</span>
                  {ap.emp_id          && <><span>EMP: {ap.emp_id}</span><span className="text-white/10">·</span></>}
                  {ap.created_by_name && <><span className="text-amber-400">✍️ {ap.created_by_name}</span><span className="text-white/10">·</span></>}
                  {ap.company_id      && <><span className="text-gray-400">🏢 <span className="text-gray-300">{ap.company_name || `Company #${ap.company_id}`}</span></span><span className="text-white/10">·</span><span className="text-gray-500">Co. ID: {ap.company_id}</span></>}
                  {ap.created_at      && (
                    <>
                      <span className="text-white/10">·</span>
                      <span>{new Date(ap.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                    </>
                  )}
                </div>

              </div>
            ))}
            </div>
              </>
            )}
          </div>
        )}

        {/* Other Tabs — Coming Soon */}
        {!loading && activeTab === 'offer_confirmation' && <ComingSoonSection tab={DOC_TABS[2]} />}
        {!loading && activeTab === 'relieving'          && <ComingSoonSection tab={DOC_TABS[5]} />}
        {!loading && activeTab === 'experience'         && <ComingSoonSection tab={DOC_TABS[6]} />}

      </main>
    </div>
  )
}