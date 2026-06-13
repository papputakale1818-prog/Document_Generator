
import { useEffect, useRef } from 'react'
import { BG_PAGES } from '../assets/bg_images'
import stampImg  from '../assets/stamp.jpg'
import stamp2Img from '../assets/stamp2.jpg'

// ─── Helpers (same as OfferLetterPage_SoftGrid) ───────────────────────────────
function fmtNumRaw(n) { if (n===null||n===undefined||isNaN(n)) return '0'; return Math.round(n).toLocaleString('en-IN') }
function fmtNum(n)    { if (n===null||n===undefined||isNaN(n)||n===0) return '—'; return Math.round(n).toLocaleString('en-IN') }
function fmtDateSimple(d) { if (!d) return '—'; return new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) }
function fmtDateFull(d) {
  if (!d) return '—'
  const dt  = new Date(d)
  const day = dt.getDate()
  const s   = day===1?'st':day===2?'nd':day===3?'rd':'th'
  return `${day}${s} ${dt.toLocaleDateString('en-IN', { month:'long', year:'numeric' })}`
}

const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen']
const tens  = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety']
function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?' '+ones[n%10]:''); return ones[Math.floor(n/100)]+' Hundred'+(n%100?' '+hw(n%100):'') }
function toWords(n) { n=Math.round(n); if(!n) return 'Zero Rupees'; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=''; if(cr) r+=hw(cr)+' Crore '; if(lk) r+=hw(lk)+' Lakh '; if(th) r+=hw(th)+' Thousand '; if(rest) r+=hw(rest); return r.trim()+' Rupees' }

const CO = {
  fullName:      'SoftGrid Info Pvt. Ltd.',
  gstin:         '27ABJCS4985R1Z4',
  tan:           'PNES82511C',
  website:       'www.softgridinfo.in',
  email:         'hr@softgridinfo.in',
  addressFooter: 'Office No. 203, Khandagale Complex, Behind EON Hospital, Kharadi Bypass, Pune MH - 411014',
}

// ─── HTML builder (exact same as OfferLetterPage_SoftGrid exportPDF) ──────────
function buildOfferLetterHTML(letter) {
  const bg1 = BG_PAGES[0]
  const bg2 = BG_PAGES[1]
  const bg3 = BG_PAGES[2]
  const bg4 = BG_PAGES[3]

  const monthly   = letter.monthly_gross || 0
  const basic     = letter.basic         || 0
  const da        = letter.da            || 0
  const hra       = letter.hra           || 0
  const conv      = letter.conveyance    || 0
  const med       = letter.medical       || 0
  const special   = letter.special       || 0
  const annual    = letter.annual_gross  || 0
  const netM      = letter.net_monthly   || 0
  const ctcA      = letter.annual_ctc    || 0
  const pfRate    = letter.pf_rate       || 12
  const pfEmrRate = letter.pf_emr_rate   || 13
  const pfEmpM    = letter.pf_employee ? Math.round((basic + da) * pfRate    / 100) : 0
  const pfEmrM    = letter.pf_employer ? Math.round((basic + da) * pfEmrRate / 100) : 0
  const pt        = monthly > 0 ? 200 : 0
  const ctcM      = monthly + pfEmrM

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

  const salaryRows = [
    { label:'Basic Salary (Basic)',                                   naNote:null,                                 m:basic,                         y:basic*12,         type:''       },
    { label:'Dearness Allowance (DA)',                                naNote:null,                                 m:da,                            y:da*12,            type:''       },
    { label:'House Rent Allowance (HRA)',                             naNote:null,                                 m:hra,                           y:hra*12,           type:''       },
    { label:'Conveyance Allowance',                                   naNote:null,                                 m:conv,                          y:conv*12,          type:''       },
    { label:'Medical Allowance',                                      naNote:null,                                 m:med,                           y:med*12,           type:''       },
    { label:'Incentives',                                             naNote:null,                                 m:null,                          y:null,             type:'na'     },
    { label:'Other Allowance',                                        naNote:null,                                 m:special,                       y:special*12,       type:''       },
    { label:'Gross Salary',                                           naNote:null,                                 m:monthly,                       y:annual,           type:'gross'  },
    { label:'Provident Fund (Employee Deduction)',                    naNote:letter.pf_employee?null:'Not Applicable*', m:letter.pf_employee?pfEmpM:null, y:letter.pf_employee?pfEmpM*12:null, type:'deduct' },
    { label:'ESIC (Employee Deduction)',                              naNote:'Not Applicable*',                    m:null,                          y:null,             type:'deduct' },
    { label:'Professional Tax (Employee Deduction)',                  naNote:null,                                 m:pt,                            y:pt*12,            type:'deduct' },
    { label:'TDS (Depends on IT Slabs & Exemptions/Loan Recovery)',   naNote:null,                                 m:null,                          y:null,             type:'na'     },
    { label:'Net Salary',                                             naNote:null,                                 m:netM,                          y:netM*12,          type:'net'    },
    { label:'Provident Fund (Employer Contribution)',                 naNote:letter.pf_employer?null:'Not Applicable*', m:letter.pf_employer?pfEmrM:null, y:letter.pf_employer?pfEmrM*12:null, type:'employer'},
    { label:'ESIC (Employer Contribution)',                           naNote:null,                                 m:null,                          y:null,             type:'na'     },
    { label:'Gratuity (Employer Contribution)',                       naNote:null,                                 m:null,                          y:null,             type:'na'     },
    { label:'Bonus (Employer Contribution)',                          naNote:null,                                 m:null,                          y:null,             type:'na'     },
    { label:'Variable Pay (Employer Contribution)',                   naNote:null,                                 m:null,                          y:null,             type:'na'     },
    { label:'Cost To Company (CTC)',                                  naNote:null,                                 m:ctcM,                          y:ctcA,             type:'ctc'    },
  ]

  const rHTML = salaryRows.map(({ label, naNote, m, y, type }) => {
    const isTotal  = type === 'gross' || type === 'net' || type === 'ctc'
    const rowBg    = isTotal ? 'background:#e8f5e9;font-weight:700;color:#1a2e1a' : 'background:#fff;font-weight:400;color:#1a2e1a'
    const labelHtml = naNote
      ? `<div>${label}</div><div style="color:#e53935;font-size:12px">${naNote}</div>`
      : `<div>${label}</div>`
    return `<tr style="${rowBg}">
      <td style="padding:6px 10px;border:1px solid #a5d6a7;font-size:14px">${labelHtml}</td>
      <td style="padding:6px 10px;border:1px solid #a5d6a7;text-align:right;font-size:14px;background:${isTotal?'#e8f5e9':'#fff'}">${m!==null?fmtNumRaw(m):'NA'}</td>
      <td style="padding:6px 10px;border:1px solid #a5d6a7;text-align:right;font-size:14px;background:${isTotal?'#e8f5e9':'#fff'}">${y!==null?fmtNumRaw(y):'NA'}</td>
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
      <div style="text-align:center;min-width:200px;position:relative;left:5mm;bottom:17mm;">
        <img src="${stamp2Img}" alt="Company Stamp" style="width:150px;height:auto;display:block;margin:0 auto;" />
      </div>
      <div style="text-align:center;min-width:160px;">
        <div style="font-size:13px;color:#1a2e1a;margin-bottom:44px"><strong>${letter.full_name || ''}</strong></div>
        <div style="border-top:1.5px solid #546e54;padding-top:8px;font-size:12px;color:#546e54">
          <strong>Accepted &amp; Agreed</strong>
        </div>
      </div>
    </div>
    <img src="${stampImg}" alt="Signature" style="position:absolute;bottom:40mm;left:50%;transform:translateX(-50%);width:150px;height:auto;" />
    ${footerHTML}
  </div>`

  return `<!DOCTYPE html><html><head>
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
    <div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Offer Letter is Ready!</div>
    <div style="color:#64748b;font-size:12px">👇 <strong style="color:#a5b4fc">"Save as PDF"</strong> to save the file</div>
  </div>
  <div style="display:flex;gap:10px">
    <button onclick="window.print()" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>
    <button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>
  </div>
</div>
</body></html>`
}

// ─── Main Component ───────────────────────────────────────────────────────────
// Props:
//   letter  — offer letter object from API
//   onClose — callback to close the modal
export default function OfferLetterPDFViewer({ letter, onClose }) {
  const iframeRef = useRef(null)

  // Write HTML into iframe srcdoc when letter changes
  useEffect(() => {
    if (!letter || !iframeRef.current) return
    const html = buildOfferLetterHTML(letter)
    const iframe = iframeRef.current
    // Use srcdoc for same-origin access so print works
    iframe.srcdoc = html
  }, [letter])

  if (!letter) return null

  const handlePrint = () => {
    const html = buildOfferLetterHTML(letter)
    const pw = window.open('', '_blank')
    if (!pw) return
    pw.document.write(html)
    pw.document.close()
  }

  // Close on backdrop click
  return (
    // ── Full screen overlay ──
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0f172a]">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#1e293b] border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {letter.full_name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="text-white font-semibold text-sm">{letter.full_name}</div>
            <div className="text-gray-400 text-xs">{letter.designation}{letter.department ? ` · ${letter.department}` : ''}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Save as PDF button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Save as PDF
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── iframe — full screen PDF preview ── */}
      <iframe
        ref={iframeRef}
        title={`Offer Letter — ${letter.full_name}`}
        className="flex-1 w-full border-0 bg-[#f5f5f5]"
        sandbox="allow-same-origin allow-scripts allow-modals"
      />
    </div>
  )
}