 
import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import bgImage from '../assets/UAS_background image_1.png'

// ─── Company Config ────────────────────────────────────────────────────────
const CO = {
  fullName:      'UAS IT Consultancy Services Pvt. Ltd.',
  website:       'www.uasit.in',
  email:         'hr@uasit.in',
  address:       'Office No. 203, Khandagale Complex<br>Behind EON Hospital, Kharadi Bypass<br>Pune MH - 411014',
  gstin:         '27ABJCS4985R1Z4',
  tan:           'PNES82511C',
  themeColor:    '#1a3c6e',
  headerColor:   '#1a3c6e',
}

// ─── Number Helpers ────────────────────────────────────────────────────────
const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
function toWords(n) { n=Math.round(n); if(!n) return "Zero Rupees"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim()+" Rupees" }
function fmtNum(n) { if(n===null||n===undefined||isNaN(n)) return "0"; return Math.round(n).toLocaleString("en-IN") }
function fmtDate(d) { if(!d) return "—"; return new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) }

// ─── PDF Header — company name center up, address right original position ────
// function pdfHeader() {
//   return `
//     <div style="margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid rgba(255,255,255,0.4)">
//       <div style="position:relative;">
//         <div style="text-align:center;margin-top:-26mm;font-size:26px;font-weight:800;color:#ffffff;text-shadow:1px 1px 4px rgba(0,0,0,0.5);letter-spacing:0.04em;">${CO.fullName}</div>
//         <div style="position:absolute;top:20mm;right:0;font-size:10.5px;color:#4a5e7a;text-align:right;line-height:1.75">${CO.address}<br>GSTIN: ${CO.gstin} | TAN: ${CO.tan}</div>
//       </div>
//     </div>`
// }
// ─── PDF Header — Final Updated Position ────
function pdfHeader() {
  return `
    <div style="margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid rgba(255,255,255,0.4)">
      
      <div style="position:relative;height:60px;">

        <!-- Company Name -->
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
        ">
          ${CO.fullName}
        </div>
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
    </div>
  `
}

// Footer empty — background image मध्येच address/contact आहे
function pdfFooter() { return '' }

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function OfferLetterConfirmationPage_UASIT() {
  const { selectedCompany } = useAuth()

  const [form, setForm] = useState({
    fullName:       '',
    designation:    '',
    department:     '',
    manager:        '',
    location:       'Pune, Maharashtra',
    offerDate:      '',
    joiningDate:    '',
    appointDate:    '',
    contractPeriod: '1 year',
    annualGross:    '',
    pfEmp:          true,
    pfEmr:          true,
    esiOn:          false,
    pfRate:         12,
    pfEmrRate:      13,
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
  const pfEmpM        = form.pfEmp  ? Math.round((basic + da) * Number(form.pfRate)    / 100) : 0
  const esiEmpM       = (form.esiOn && esiApplicable) ? Math.round(monthly * 0.0075) : 0
  const pt            = monthly > 0 ? 200 : 0
  const totalDed      = pfEmpM + esiEmpM + pt
  const netM          = monthly - totalDed
  const pfEmrM        = form.pfEmr  ? Math.round((basic + da) * Number(form.pfEmrRate) / 100) : 0
  const esiEmrM       = (form.esiOn && esiApplicable) ? Math.round(monthly * 0.0325) : 0
  const ctcM          = monthly + pfEmrM + esiEmrM
  const ctcA          = ctcM * 12

  const salaryRows = [
    { label: "Basic Salary (40% of Gross)",                                                            m: basic,    y: basic*12,    type: "" },
    { label: "Dearness Allowance (50% of Basic)",                                                      m: da,       y: da*12,       type: "" },
    { label: "House Rent Allowance (40% of Basic)",                                                    m: hra,      y: hra*12,      type: "" },
    { label: "Conveyance Allowance (Fixed)",                                                           m: conv,     y: conv*12,     type: "" },
    { label: "Medical Allowance (Fixed)",                                                              m: med,      y: med*12,      type: "" },
    { label: "Special Allowance (Balance Amount)",                                                     m: special,  y: special*12,  type: "" },
    { label: "Incentives",                                                                             m: null,     y: null,        type: "na" },
    { label: "Other Allowance",                                                                        m: null,     y: null,        type: "na" },
    { label: "Total Gross Salary",                                                                     m: monthly,  y: annual,      type: "gross" },
    { label: `PF contribution by employee (${form.pfEmp ? form.pfRate+"% of Basic+DA" : "NA"})`,      m: form.pfEmp ? pfEmpM : null, y: form.pfEmp ? pfEmpM*12 : null, type: "deduct" },
    { label: "ESI contribution by employee (0.75% of Gross)",                                         m: (form.esiOn&&esiApplicable) ? esiEmpM : null, y: (form.esiOn&&esiApplicable) ? esiEmpM*12 : null, type: "deduct" },
    { label: "Professional Tax (PT) - Fixed Rs:200",                                                  m: pt,       y: pt*12,       type: "deduct" },
    { label: "Total deductions (PF+ESI+PT)",                                                          m: totalDed, y: totalDed*12, type: "deduct-total" },
    { label: "Net Salary (Gross-Total deductions)",                                                    m: netM,     y: netM*12,     type: "net" },
    { label: "NA",                                                                                     m: null,     y: null,        type: "na" },
    { label: `Employer PF contribution (${form.pfEmr ? form.pfEmrRate+"% of Basic+DA" : "NA"})`,      m: form.pfEmr ? pfEmrM : null, y: form.pfEmr ? pfEmrM*12 : null, type: "employer" },
  ]

  // ─── PDF Export ────────────────────────────────────────────────────────────
  const exportPDF = useCallback(() => {
    const bgStyle = bgImage
      ? `background-image:url('${bgImage}');background-size:cover;background-repeat:no-repeat;background-position:center top;`
      : ''

    const pageStyle = `width:210mm;min-height:297mm;margin:0 auto;padding:58mm 20mm 16mm;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#0d1f3c;${bgStyle}`

    const rHTML = salaryRows.map(({ label, m, y, type }) => {
      const st = {
        gross:          `background:#d0e4f7;font-weight:700;color:#0d2a5e`,
        deduct:         `background:#fff;color:#333`,
        "deduct-total": `background:#d0e4f7;font-weight:700;color:#0d2a5e`,
        net:            `background:#d0e4f7;font-weight:700;color:#0d2a5e`,
        employer:       `background:#fff;color:#333`,
        na:             `color:#aaa;font-style:italic;background:#fff`,
      }[type] || `background:#fff;color:#333`
      return `<tr style="${st}">
        <td style="padding:6px 10px;border:1px solid #a8c4e0">${label}</td>
        <td style="padding:6px 10px;border:1px solid #a8c4e0;text-align:right;font-family:monospace">${m!==null?fmtNum(m):"NA"}</td>
        <td style="padding:6px 10px;border:1px solid #a8c4e0;text-align:right;font-family:monospace">${y!==null?fmtNum(y):"NA"}</td>
      </tr>`
    }).join("")

    // ── PAGE 3: Terms & Conditions ─────────────────────────────────────────
    const termsHTML = `
    <div style="page-break-before:always;${pageStyle}">
      ${pdfHeader()}
      <div style="margin-top:20mm">
        <h2 style="text-align:center;font-size:18px;text-decoration:underline;margin:20px 0 22px">TERMS AND CONDITIONS</h2>
        <h3 style="font-size:14px;margin-bottom:14px">Notes:</h3>
        <ol style="padding-left:20px;line-height:1.9;font-size:12.5px">
          <li style="margin-bottom:10px">For claiming tax benefits in case of admissible allowance, you will have to submit supporting documents to the Company's satisfaction and within the timeline stipulated by the Company.</li>
          <li style="margin-bottom:10px">In case where Permanent Account Number (PAN) is not produced, highest tax rates will apply to all amounts on which tax is deductible at source under the applicable tax law.</li>
          <li style="margin-bottom:10px">The Company reserves the right to change the compensation structure and/or the compensation components from time to time.
            <ol type="a" style="padding-left:20px;margin-top:6px">
              <li>50% of your Retention Bonus and the remaining 50% on your one year of completion with us (if applicable).</li>
              <li>Retention Bonus – For the first six (6) months of your employment with ${CO.fullName.toUpperCase()}, you will be paid 50% of your Retention Bonus and the remaining 50% on your one year of completion with us (if applicable).</li>
            </ol>
          </li>
          <li style="margin-bottom:10px">These statutory payments are included based on current applicable practice and law and are subject to changes based on changes in law from time to time.</li>
          <li style="margin-bottom:10px">Employee's contribution towards PF and Employee's contribution towards ESIC will be made from monthly salary (if applicable).</li>
          <li style="margin-bottom:10px">For employees who are not covered under the PF Act and wish to opt for PF or in the event it becomes obligatory on the company to cover you under the Provident Fund Act or any other relevant acts or rules, as amended from time to time, the Provident Fund being paid to you will be adjusted against Special Allowance or Provident Fund contribution (if applicable).</li>
        </ol>
      </div>
      ${pdfFooter()}
    </div>`

    // ── PAGE 4: Additional Terms ───────────────────────────────────────────
    const additionalTermsHTML = `
    <div style="page-break-before:always;${pageStyle}">
      ${pdfHeader()}
      <div style="margin-top:20mm">
        <h2 style="text-align:center;font-size:18px;text-decoration:underline;margin:20px 0 22px">ADDITIONAL TERMS</h2>
        <h3 style="font-size:13px;font-weight:700;margin-bottom:12px">A. The following statutory elements are included in the compensation package stated above: (If Applicable)</h3>
        <p style="margin-bottom:10px;line-height:1.8;font-size:12.5px"><strong>1. Provident Fund</strong> – You will be covered under the Employee's Provident Fund (PF) scheme wherein, the Company will contribute towards PF at the statutory rate as may be defined by government from time to time.</p>
        <p style="margin-bottom:10px;line-height:1.8;font-size:12.5px"><strong>2. Gratuity</strong> – Upon cessation of employment after completion of continuous service of at least five (5) years with the Company, you will be eligible for the gratuity as per the Payment of Gratuity Act.</p>
        <p style="margin-bottom:14px;line-height:1.8;font-size:12.5px"><strong>3. ESIC</strong> – As per compensation mentioned above if you are eligible for ESIC then, you will be covered under Employee's State Insurance Act wherein, the Company will contribute towards statutory rate.</p>
        <h3 style="font-size:13px;font-weight:700;margin-bottom:12px">B. As an employee of the ${CO.fullName.toUpperCase()}, you shall be entitled to the following benefits subject to any change made by the Company from time to time: (If Applicable)</h3>
        <p style="margin-bottom:10px;line-height:1.8;font-size:12.5px"><strong>1. Group Medical Insurance</strong> – In accordance with the Company policy you shall be covered under the Medical Insurance policy, which will be held by the Company.</p>
        <p style="margin-bottom:10px;line-height:1.8;font-size:12.5px"><strong>2. Group Personal Accident Insurance</strong> – In accordance with the Company policy you shall be covered under the Personal Accident Insurance policy, which will be held by the Company.</p>
        <p style="margin-bottom:14px;line-height:1.8;font-size:12.5px"><strong>3. Annual Leave/Public Holidays</strong> – You will be eligible for annual leaves and public holidays as determined by the Company's Leave Policy which is subject to change from time to time.</p>
        <p style="font-size:12.5px;line-height:1.8;margin-bottom:30px">You are required to treat this letter and its contents as strictly confidential and should not disclose same to any person or entity without our written consent.</p>
        <div style="display:flex;justify-content:space-between;margin-top:44px;padding:0 10px">
          <div style="text-align:center;min-width:160px">
            <div style="border-top:1.5px solid #4a5e7a;padding-top:8px;font-size:12px;color:#4a5e7a;line-height:1.7">
              <strong>Human Resource</strong><br>${CO.fullName.toUpperCase()}<br><strong>DIRECTOR</strong>
            </div>
          </div>
          <div style="text-align:center;min-width:160px">
            <div style="border-top:1.5px solid #4a5e7a;padding-top:8px;font-size:12px;color:#4a5e7a;line-height:1.7">
              <strong>Accepted &amp; Agreed</strong><br>&nbsp;
            </div>
          </div>
        </div>
      </div>
      ${pdfFooter()}
    </div>`

    const pw = window.open("", "_blank")
    pw.document.write(`<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<title>Offer Confirmation Letter — ${form.fullName || "Employee"} — ${CO.fullName}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#0d1f3c;font-size:13px}
  @page{size:A4;margin:0}
  @media print{
    html,body{width:210mm;margin:0}
    .no-print{display:none!important}
    *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
  }
  .page{width:210mm;min-height:297mm;margin:0 auto;padding:58mm 20mm 16mm;${bgStyle}}
  h1{text-align:center;font-size:22px;text-decoration:underline;margin:20px 0 24px}
  p{margin-bottom:10px;line-height:1.75}
  table.info{width:100%;margin:14px 0;border-collapse:collapse}
  table.info td{padding:5px 4px;vertical-align:top;font-size:13px}
  table.info td:first-child{color:#4a5e7a;width:45%;font-weight:600}
  table.sal{width:100%;border-collapse:collapse;margin:20px 0;font-size:12px}
  table.sal th{background:${CO.themeColor};color:#fff;padding:8px 10px;font-size:11px;letter-spacing:.06em;text-transform:uppercase}
  table.sal th:not(:first-child){text-align:right}
  .annexure-title{font-size:15px;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:.06em;margin:28px 0 4px}
  .ctc-box{background:#e8f0fb;border:1px solid #a8c4e0;border-radius:8px;padding:12px 16px;margin-bottom:20px}
  .ctc-label{font-size:11px;font-weight:700;color:#4a5e7a;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px}
  .ctc-value{font-size:14px;font-weight:600;color:${CO.themeColor}}
  .footer-bar{margin-top:28px;padding-top:10px;border-top:1px solid #b0c4de;text-align:center;font-size:10px;color:#4a5e7a}
  .footer-bar a{color:${CO.themeColor}}
</style>
</head><body>

<!-- PAGE 1: Offer Confirmation Letter -->
<div class="page">
  ${pdfHeader()}
  <div style="margin-top:20mm">
    <div style="text-align:right;margin-bottom:16px;color:#4a5e7a;font-size:13px">${fmtDate(form.offerDate)}</div>
    <h1>Offer Confirmation Letter</h1>
    <p><strong>Dear ${form.fullName || "[Employee Name]"},</strong></p>
    <p>With reference to your Resume and subsequent interview you had with us, we are pleased to confirm your appointment as a "<strong>${form.designation || "[Designation]"}</strong>" in our organization on the following terms and conditions:</p>
    <table class="info">
      <tr><td>Designation:</td><td><strong>${form.designation || "—"}</strong></td></tr>
      <tr><td>Department:</td><td><strong>${form.department || "—"}</strong></td></tr>
      <tr><td>Reporting Manager:</td><td><strong>${form.manager || "—"}</strong></td></tr>
      <tr><td>Date of Appointment:</td><td><strong>${fmtDate(form.appointDate)}</strong></td></tr>
      <tr><td>Date of Joining:</td><td>You are expected to join duty on <strong>${fmtDate(form.joiningDate)}</strong></td></tr>
      <tr><td>Location:</td><td>${form.location}</td></tr>
    </table>
    <p><strong>Remuneration:</strong> Your Annual Total Employment Cost to the company would be ₹ <strong>${fmtNum(ctcA)}/- Per Annum (${toWords(ctcA)} Only)</strong>. This comprises of your salary and Performance Linked incentives and the details of which is been given in the <strong>Annexure A</strong> attached below.</p>
    <p>Please note that the salary will be on the basis of lump sum and taxes applicable will be deducted from your salary every month (if applicable).</p>
    <p>You will execute an agreement/contract of confirmed employment with us for a period of <strong>${form.contractPeriod}</strong> including the period of probation executing a bond to that effect.</p>
    <p>We welcome you to The <strong>${CO.fullName}</strong> family and look forward to a fruitful collaboration. We are confident you will be able to make a significant contribution to the success of our company and look forward to working with you.</p>
  </div>
  ${pdfFooter()}
</div>

<!-- PAGE 2: Annexure A – Salary Distribution -->
<div style="page-break-before:always;${pageStyle}">
  ${pdfHeader()}
  <div style="margin-top:20mm">
    <div class="annexure-title">ANNEXURE 'A'</div>
    <div class="annexure-title" style="margin-top:4px">SALARY DISTRIBUTION</div>
    <table class="sal" style="margin-top:24px">
      <thead>
        <tr>
          <th style="text-align:left">Particulars</th>
          <th style="text-align:right">Monthly Salary (Rs)</th>
          <th style="text-align:right">Yearly Salary (Rs)</th>
        </tr>
      </thead>
      <tbody>${rHTML}</tbody>
    </table>
    <div class="ctc-box">
      <div class="ctc-label">Annual CTC in Words</div>
      <div class="ctc-value">${toWords(ctcA)} Only</div>
    </div>
  </div>
  ${pdfFooter()}
</div>

<!-- PAGE 3: Terms & Conditions -->
${termsHTML}

<!-- PAGE 4: Additional Terms -->
${additionalTermsHTML}

<div class="no-print" style="position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#0d1f3c,#1a3c6e);border-top:2px solid #4a90d9;padding:16px 28px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:'Segoe UI',sans-serif;">
  <div>
    <div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Offer Confirmation Letter तयार आहे! — ${CO.fullName}</div>
    <div style="color:#8ab4d4;font-size:12px">👇 <strong style="color:#a8d4f5">"Save as PDF"</strong> click करा</div>
  </div>
  <div style="display:flex;gap:10px">
    <button onclick="this.closest('div').style.display='none';window.print()" style="background:linear-gradient(135deg,#1a3c6e,#2a6bb5);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>
    <button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#8ab4d4;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>
  </div>
</div>
</body></html>`)
    pw.document.close()
  }, [form, annual, monthly, basic, da, hra, conv, med, special, pfEmpM, esiEmpM, pt, totalDed, netM, pfEmrM, esiEmrM, ctcM, ctcA, esiApplicable, salaryRows])

  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-blue-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">
      
      <main className="flex-1 p-8 overflow-y-auto">

        {/* Page Header */}
        <h1 className="text-3xl font-bold mb-2">Offer Confirmation Letter Generator</h1>
        <p className="text-gray-500 text-sm mb-8">{CO.fullName}</p>

        <div className="max-w-2xl space-y-6">

          {/* ── Employee Info ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-blue-400 mb-5">👤 Employee Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Full Name</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="e.g. Amit Kumar" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Designation</label>
                  <input name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Developer" className={inp} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Department</label>
                  <input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Reporting Manager</label>
                  <input name="manager" value={form.manager} onChange={handleChange} placeholder="e.g. Manager Name" className={inp} />
                </div>
              </div>
              <div>
                <label className={lbl}>Work Location</label>
                <input name="location" value={form.location} onChange={handleChange} className={inp} />
              </div>
            </div>
          </div>

          {/* ── Dates ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-cyan-400 mb-5">📅 Important Dates</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Offer Date</label>
                  <input type="date" name="offerDate" value={form.offerDate} onChange={handleChange} className={inp + " [color-scheme:dark]"} />
                </div>
                <div>
                  <label className={lbl}>Date of Joining</label>
                  <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} className={inp + " [color-scheme:dark]"} />
                </div>
                <div>
                  <label className={lbl}>Appointment Date</label>
                  <input type="date" name="appointDate" value={form.appointDate} onChange={handleChange} className={inp + " [color-scheme:dark]"} />
                </div>
              </div>
              <div>
                <label className={lbl}>Contract Period</label>
                <select name="contractPeriod" value={form.contractPeriod} onChange={handleChange} className={inp + " cursor-pointer"} style={{colorScheme:'dark', backgroundColor:'#1e293b'}}>
                  <option value="3 months">3 Months Probation</option>
                  <option value="6 months">6 Months Probation</option>
                  <option value="1 year">1 Year (incl. probation)</option>
                  <option value="2 years">2 Years</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Salary ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-amber-400 mb-5">₹ Salary Details</h2>
            <div>
              <label className={lbl}>Annual Gross (₹)</label>
              <input
                type="number"
                name="annualGross"
                value={form.annualGross}
                onChange={handleChange}
                placeholder="e.g. 360000"
                className={inp + " text-amber-400 font-bold"}
              />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mt-5 mb-5">
              {[
                { label: "Annual Gross", value: annual,  cls: "text-amber-400",   bg: "bg-amber-500/10  border-amber-500/20" },
                { label: "Net / Month",  value: netM,    cls: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                { label: "Annual CTC",   value: ctcA,    cls: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
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

            {/* Salary Table Preview */}
            <div className="rounded-xl overflow-hidden border border-white/10 mt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500/50 to-cyan-500/30">
                    {["Particulars","Monthly (₹)","Annual (₹)"].map((h,i) => (
                      <th key={h} className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-white ${i===0?"text-left":"text-right"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {salaryRows.map(({ label, m, y, type }, i) => {
                    const cls = {
                      gross:          "bg-cyan-500/10 text-cyan-300 font-bold",
                      deduct:         "bg-rose-500/5 text-rose-300",
                      "deduct-total": "bg-rose-500/10 text-rose-300 font-bold",
                      net:            "bg-amber-500/10 text-amber-300 font-bold",
                      employer:       "bg-blue-500/5 text-blue-300",
                      na:             "text-gray-600 italic",
                    }[type] || "text-gray-300"
                    return (
                      <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${cls}`}>
                        <td className="px-4 py-2 text-sm">{label}</td>
                        <td className="px-4 py-2 text-right font-mono text-xs">{m !== null ? fmtNum(m) : <span className="text-gray-600">NA</span>}</td>
                        <td className="px-4 py-2 text-right font-mono text-xs">{y !== null ? fmtNum(y) : <span className="text-gray-600">NA</span>}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* CTC in Words */}
            <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Annual CTC in Words</div>
              <div className="text-blue-300 font-semibold text-sm">{toWords(ctcA)} Only</div>
            </div>
          </div>

          {/* ── PF & ESI ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-purple-400 mb-5">🛡️ PF & ESI Settings</h2>
            <div className="space-y-4">
              {[
                { key: "pfEmp", label: "Employee PF",  desc: `${form.pfRate}% of (Basic + DA) — deducted from salary` },
                { key: "pfEmr", label: "Employer PF",  desc: `${form.pfEmrRate}% of (Basic + DA) — added to CTC` },
                { key: "esiOn", label: "ESI",          desc: esiApplicable ? "Applicable (Monthly ≤ ₹21,000)" : "Not applicable — Monthly > ₹21,000", disabled: !esiApplicable },
              ].map(({ key, label, desc, disabled }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <div className="text-sm font-medium text-white">{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                  </div>
                  <button
                    onClick={() => !disabled && setForm(prev => ({ ...prev, [key]: !prev[key] }))}
                    className={`w-11 h-6 rounded-full relative transition-all flex-shrink-0
                      ${form[key] && !disabled ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-white/10'}
                      ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form[key] && !disabled ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className={lbl}>Employee PF Rate (%)</label>
                  <input type="number" name="pfRate" value={form.pfRate} onChange={handleChange} min={0} max={12} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Employer PF Rate (%)</label>
                  <input type="number" name="pfEmrRate" value={form.pfEmrRate} onChange={handleChange} min={0} max={13} className={inp} />
                </div>
              </div>
              <div className="flex items-center justify-between bg-amber-500/5 border border-amber-500/10 rounded-xl px-4 py-3 mt-2">
                <div>
                  <div className="text-sm font-medium text-white">Maharashtra Professional Tax</div>
                  <div className="text-xs text-gray-500 mt-0.5">Fixed monthly deduction</div>
                </div>
                <div className="text-amber-400 font-bold text-lg">₹200<span className="text-xs font-normal text-gray-500">/mo</span></div>
              </div>
            </div>
          </div>

          {/* ── Generate Button ── */}
          <button
            onClick={exportPDF}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg"
          >
            ⬇️ Generate Offer Confirmation Letter (PDF) — 4 Pages
          </button>
          <p className="text-center text-gray-600 text-xs pb-8">Print dialog मध्ये "Save as PDF" निवडा</p>

        </div>
      </main>
    </div>
  )
}