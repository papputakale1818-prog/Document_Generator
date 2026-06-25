
// // import { BG_PAGES } from '../assets/bg_images'
// import OfferLetterTemplate from '../assets/OfferLetterTemplate.png'
// import logoImg from '../assets/PHOTO-2025-09-04-19-02-03.jpg'

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
// const tens  = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
// function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
// function toWords(n) { n=Math.round(n); if(!n) return "Zero Rupees"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim()+" Rupees" }
// function fmtNum(n) { if(n===null||n===undefined||isNaN(n)) return "0"; return Math.round(n).toLocaleString("en-IN") }

// const CO = {
//   website:       'www.softgridinfo.in',
//   email:         'hr@softgridinfo.in',
//   addressFooter: 'Office No. 203, Khandagale Complex, Behind EON Hospital, Kharadi Bypass, Pune MH - 411014',
// }

// // ─── openPaySlipPDF — standalone function ────────────────────────────────────
// // ps = payslip object from backend /payslips/ API
// export async function openPaySlipPDF(ps) {
//   // ── Employee table madhun live fetch — DB madhe null asel tar employees madhun fill karo ──
//   try {
//     const token = localStorage.getItem('hr_token')
//     const empRes = await fetch(`http://127.0.0.1:8000/employees/${ps.emp_id}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//     if (empRes.ok) {
//       const emp = await empRes.json()
//       ps = {
//         ...ps,
//         emp_name:     ps.emp_name     || emp.full_name  || '',
//         uan_number:   ps.uan_number   || emp.uan_number || '',
//         pf_number:    ps.pf_number    || emp.pf_number  || '',
//         pan_number:   ps.pan_number   || emp.pan        || '',
//         adhar_number: ps.adhar_number || emp.aadhar     || '',
//         bank_name:    ps.bank_name    || emp.bank_name  || '',
//         account_no:   ps.account_no   || emp.bank_acc   || '',
//         designation:  ps.designation  || emp.designation|| '',
//         department:   ps.department   || emp.department || '',
//       }
//     }
//   } catch { /* fetch fail — original ps use karo */ }

//   // ── Offer Letter madhun salary breakdown fetch karo ──
//   try {
//     const token = localStorage.getItem('hr_token')
//     const olRes = await fetch(`http://127.0.0.1:8000/offer-letters/`, {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//     if (olRes.ok) {
//       const letters = await olRes.json()
//       const empLetters = letters.filter(l => l.emp_id === ps.emp_id)
//       const empLetter  = empLetters.length > 0
//         ? empLetters.reduce((a, b) => (b.id > a.id ? b : a))
//         : null
//       if (empLetter) {
//         const monthly = empLetter.monthly_gross || 0
//         const autoBasic   = Math.round(monthly * 0.40)
//         const autoDa      = Math.round(autoBasic * 0.50)
//         const autoHra     = Math.round(autoBasic * 0.40)
//         const autoConv    = monthly > 0 ? 1600 : 0
//         const autoMed     = monthly > 0 ? 1250 : 0
//         const autoSpecial = monthly - autoBasic - autoDa - autoHra - autoConv - autoMed
//         // Company rule: Monthly Gross > ₹21,000 असेल tar PF fixed ₹1,800 (cap), nahitar normal 12% calculation
//         const pfEmpM      = monthly > 21000 ? 1800 : Math.round((autoBasic + autoDa) * 0.12)
//         const pt          = monthly > 0 ? 200 : 0
//         const totalDed    = pfEmpM + pt
//         // keep(): form/Deductions & Settings ne adhich pathवlela value (0 dharun) override karaycha nahi —
//         // fakt khara undefined/null/'' asel tarच offer-letter cha auto-calc fallback म्हणून vapraycha
//         const keep = (v, fallback) => (v !== undefined && v !== null && v !== '') ? v : fallback
//         ps = {
//           ...ps,
//           monthly_gross:   keep(ps.monthly_gross, monthly),
//           net_salary:      keep(ps.net_salary, empLetter.net_monthly || 0),
//           basic:           keep(ps.basic, autoBasic),
//           da:              keep(ps.da, autoDa),
//           hra:             keep(ps.hra, autoHra),
//           conveyance:      keep(ps.conveyance, autoConv),
//           medical:         keep(ps.medical, autoMed),
//           special:         keep(ps.special, autoSpecial),
//           pf_employee:     keep(ps.pf_employee, pfEmpM),
//           prof_tax:        keep(ps.prof_tax, pt),
//           total_deduction: keep(ps.total_deduction, totalDed),
//         }
//       }
//     }
//   } catch { /* offer letter fetch fail — ignore */ }

//   const earnRows = [
//     { label: "Basic Salary",          val: ps.basic      || 0 },
//     { label: "DA",                    val: ps.da         || 0 },
//     { label: "HRA",                   val: ps.hra        || 0 },
//     { label: "Conveyance Allowances", val: ps.conveyance || 0 },
//     { label: "Medical Allowances",    val: ps.medical    || 0 },
//     { label: "Special Allowances",    val: ps.special    || 0 },
//   ]
//   const dedRows = [
//     { label: "Provident Fund",       val: ps.pf_employee     || 0 },
//     { label: "ESI/Health Insurance", val: ps.esi_employee    || 0 },
//     { label: "Professional Tax",     val: ps.prof_tax        || 0 },
//     { label: "Loan Recovery",        val: ps.loan_recovery   || 0 },
//     { label: "Other Deduction",      val: ps.other_deduction || 0 },
//     { label: "TDS",                  val: ps.tds             || 0 },
//   ]
//   const maxR = Math.max(earnRows.length, dedRows.length)
//   const tableRowsHTML = Array.from({ length: maxR }, (_, i) => {
//     const e = earnRows[i]
//     const d = dedRows[i]
//     return `<tr>
//       <td style="padding:4px 8px;border:1px solid #000;font-size:11.5px">${e ? e.label : ''}</td>
//       <td style="padding:4px 8px;border:1px solid #000;text-align:right;font-size:11.5px">${e ? fmtNum(e.val) : ''}</td>
//       <td style="padding:4px 8px;border:1px solid #000;font-size:11.5px">${d ? d.label : ''}</td>
//       <td style="padding:4px 8px;border:1px solid #000;text-align:right;font-size:11.5px">${d ? fmtNum(d.val) : ''}</td>
//     </tr>`
//   }).join('')

//   const monthAbbr   = String(ps.month || '').slice(0, 3)
//   const yearShort   = String(ps.year  || '').slice(-2)
//   const monthLabel  = `${monthAbbr}-${yearShort}`
//   const gross       = ps.monthly_gross || 0
//   const net         = ps.net_salary    || 0
//   const grossWords  = toWords(gross)
//   const inHandWords = toWords(net)

//   // ── Image: PHOTO-2025-09-04-19-02-03.jpg — left corner la set ──
//   // TODO: Replace the src path below with your actual image import or public URL
//   // e.g. import logoImg from '../assets/PHOTO-2025-09-04-19-02-03.jpg'  → then pass as prop or import at top
//   // For now using relative path — update if needed:
//   const logoImgSrc = logoImg

//   const pgStyle = `
//     position:relative;
//     width:210mm;
//     min-height:297mm;
//     margin:0 auto;
//     padding:32mm 18mm 22mm 18mm;
//     font-family:'Segoe UI',Arial,sans-serif;
//     font-size:13px;
//     color:#1a2e1a;
//     background:#ffffff;
//     -webkit-print-color-adjust:exact;
//     print-color-adjust:exact;
//   `

//   const footerHTML = `
//     <div style="position:absolute;bottom:6mm;left:18mm;right:8mm;border-top:1px solid #999;padding-top:4px;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#000;font-family:'Segoe UI',Arial,sans-serif">
//       <span>${CO.addressFooter}</span>
//       <span>${CO.website} | ${CO.email}</span>
//     </div>`

//   const pw = window.open('', '_blank')
//   pw.document.write(`<!DOCTYPE html><html><head>
// <meta charset="UTF-8">
// <title>Pay Slip — ${ps.emp_name || 'Employee'} — ${ps.month} ${ps.year}</title>
// <style>
//   * { box-sizing:border-box;margin:0;padding:0 }
//   body { font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#333;background:#f5f5f5 }
//   @page { size:A4;margin:0 }
//   @media print {
//     html,body{width:210mm;margin:0;background:white}
//     .no-print{display:none!important}
//     *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
//   }
//   .meta-grid {
//     display:grid;grid-template-columns:1fr 1fr;
//     font-size:12px;line-height:1.85;
//     margin-bottom:10px;border-bottom:1px solid #ccc;padding-bottom:8px;
//   }
//   .meta-grid .row { display:flex; }
//   .meta-grid .lbl { min-width:120px;color:#333;font-weight:normal; }
//   .meta-grid .val { color:#333; }
//   .att-bar {
//     font-size:12px;padding:3px 0 5px 0;
//     border-bottom:1px solid #ccc;margin-bottom:7px;
//     display:flex;gap:32px;
//   }
//   table { width:100%;border-collapse:collapse;font-size:12px;margin-top:4px }
//   th {
//     background:#ffffff;color:#000;
//     padding:5px 8px;font-size:11.5px;font-weight:700;border:1px solid #000;
//   }
//   th:nth-child(1),th:nth-child(3) { text-align:left }
//   th:nth-child(2),th:nth-child(4) { text-align:right }
//   td { border:1px solid #000 }
//   .total-row td {
//     background:#e8f5e9;font-weight:700;
//     padding:4px 8px;border:1px solid #000;font-size:11.5px;color:#1b4332;
//   }
//   .total-row td:nth-child(2),
//   .total-row td:nth-child(4) { text-align:right }
//   .net-row td {
//     background:#c8e6c9;font-weight:700;
//     padding:4px 8px;font-size:11.5px;color:#333;border:1px solid #000;
//   }
//   .net-row td:last-child { text-align:right;color:#333;font-weight:700 }
//   .words { margin-top:12px;font-size:12px;line-height:2 }
//   .words div { display:flex;gap:4px }
//   .words .wlbl { font-weight:normal;min-width:190px }
//   .note { position:absolute;bottom:35mm;left:18mm;right:18mm;font-size:11px;color:#444 }
//   #pbar { position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#1e293b,#0f172a);border-top:2px solid #6366f1;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:'Segoe UI',sans-serif }
// </style></head><body>

// <div style="${pgStyle}">

//   <!-- ── Logo Image + Company Name — Left Top Corner ── -->
//   <div style="position:absolute;top:6mm;left:18mm;display:flex;align-items:center;gap:14px;">
//     <img
//       src="${logoImgSrc}"
//       alt="Company Logo"
//       style="height:100px;width:auto;object-fit:contain;"
//     />
//     <span style="font-size:36px;font-weight:900;color:#000000;letter-spacing:1px;font-family:'Segoe UI',Arial,sans-serif;line-height:1;">SOFTGRID INFO PVT. LTD.</span>
//   </div>

//   <div class="meta-grid">
//     <div class="row"><span class="lbl">Month:</span><span class="val">${monthLabel}</span></div>
//     <div class="row"><span class="lbl">UAN Number:</span><span class="val">${ps.uan_number || '-'}</span></div>
//     <div class="row"><span class="lbl">EMP ID:</span><span class="val">${ps.emp_id || '-'}</span></div>
//     <div class="row"><span class="lbl">PF Number:</span><span class="val">${ps.pf_number || '-'}</span></div>
//     <div class="row"><span class="lbl">Name:</span><span class="val">${ps.emp_name || '-'}</span></div>
//     <div class="row"><span class="lbl">PAN Number:</span><span class="val">${ps.pan_number || '-'}</span></div>
//     <div class="row"><span class="lbl">Designation:</span><span class="val">${ps.designation || '-'}</span></div>
//     <div class="row"><span class="lbl">Aadhaar Number:</span><span class="val">${ps.adhar_number || '-'}</span></div>
//     <div class="row"><span class="lbl">Department:</span><span class="val">${ps.department || '-'}</span></div>
//     <div class="row"><span class="lbl">Account Number:</span><span class="val">${ps.account_no || '-'}</span></div>
//     <div class="row"></div>
//     <div class="row"><span class="lbl">Bank Name:</span><span class="val">${ps.bank_name || '-'}</span></div>
//   </div>

//   <div class="att-bar">
//     <span>Working Day's: <strong>${ps.working_days ?? '0'}</strong></span>
//     <span>LOP: <strong>${ps.lop ?? '0.00'}</strong></span>
//     <span>PL: <strong>${ps.pl || '0.00'}</strong></span>
//   </div>

//   <table>
//     <thead>
//       <tr>
//         <th style="width:30%">Components In salary</th>
//         <th style="width:20%">Gross Amount</th>
//         <th style="width:30%">Deductions &amp; Recoveries</th>
//         <th style="width:20%">Gross Deductions</th>
//       </tr>
//     </thead>
//     <tbody>${tableRowsHTML}</tbody>
//     <tfoot>
//       <tr class="total-row">
//         <td><strong>Total Gross Salary</strong></td>
//         <td style="text-align:right"><strong>${fmtNum(gross)}</strong></td>
//         <td></td>
//         <td></td>
//       </tr>
//       <tr class="net-row">
//         <td colspan="2"><strong>Net Salary</strong></td>
//         <td></td>
//         <td style="text-align:right"><strong>${fmtNum(net)}.0</strong></td>
//       </tr>
//     </tfoot>
//   </table>

//   <div class="words">
//     <div><span class="wlbl">Total Amount In Words:</span><span>Rupees ${grossWords} Only.</span></div>
//     <div><span class="wlbl">In Hand Salary In Words:</span><span>Rupees ${inHandWords} Only.</span></div>
//   </div>

//   <div class="note">Note: This is a computer-generated slip, signature is not required.</div>

//   ${footerHTML}
// </div>

// <div id="pbar" class="no-print">
//   <div>
//     <div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Pay Slip is ready!</div>
//     <div style="color:#64748b;font-size:12px">👇 Click <strong style="color:#a5b4fc">"Save as PDF"</strong> → Destination: <strong style="color:#a5b4fc">"Save as PDF"</strong></div>
//   </div>
//   <div style="display:flex;gap:10px">
//     <button onclick="document.getElementById('pbar').style.display='none';window.print()" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(99,102,241,0.5)">⬇️ Save as PDF</button>
//     <button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>
//   </div>
// </div>
// </body></html>`)
//   pw.document.close()
// }


// import { BG_PAGES } from '../assets/bg_images'
import OfferLetterTemplate from '../assets/OfferLetterTemplate.png'
import logoImg from '../assets/PHOTO-2025-09-04-19-02-03.jpg'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
const tens  = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
function toWords(n) { n=Math.round(n); if(!n) return "Zero Rupees"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim()+" Rupees" }
function fmtNum(n) { if(n===null||n===undefined||isNaN(n)) return "0"; return Math.round(n).toLocaleString("en-IN") }

const CO = {
  website:       'www.softgridinfo.in',
  email:         'hr@softgridinfo.in',
  addressFooter: 'Office No. 203, Khandagale Complex, Behind EON Hospital, Kharadi Bypass, Pune MH - 411014',
}

// ─── openPaySlipPDF — standalone function ────────────────────────────────────
// ps = payslip object from backend /payslips/ API
export async function openPaySlipPDF(ps) {
  // ── Employee table madhun live fetch — DB madhe null asel tar employees madhun fill karo ──
  try {
    const token = localStorage.getItem('hr_token')
    const empRes = await fetch(`http://127.0.0.1:8000/employees/${ps.emp_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (empRes.ok) {
      const emp = await empRes.json()
      ps = {
        ...ps,
        emp_name:     ps.emp_name     || emp.full_name  || '',
        uan_number:   ps.uan_number   || emp.uan_number || '',
        pf_number:    ps.pf_number    || emp.pf_number  || '',
        pan_number:   ps.pan_number   || emp.pan        || '',
        adhar_number: ps.adhar_number || emp.aadhar     || '',
        bank_name:    ps.bank_name    || emp.bank_name  || '',
        account_no:   ps.account_no   || emp.bank_acc   || '',
        designation:  ps.designation  || emp.designation|| '',
        department:   ps.department   || emp.department || '',
      }
    }
  } catch { /* fetch fail — original ps use karo */ }

  // ── Salary breakdown — DB madhe saved values use karo,
  //    jya null/undefined/0 astil tya saathi monthly_gross varun auto-calculate karo ──
  const gross = ps.monthly_gross || 0

  // ── Earnings: DB madhe saved asel tar te, nahitar auto-formula ──
  const basic   = (ps.basic      != null && ps.basic   !== '' && Number(ps.basic)   > 0) ? Number(ps.basic)      : Math.round(gross * 0.40)
  const da      = (ps.da         != null && ps.da      !== '' && Number(ps.da)      > 0) ? Number(ps.da)         : Math.round(basic * 0.50)
  const hra     = (ps.hra        != null && ps.hra     !== '' && Number(ps.hra)     > 0) ? Number(ps.hra)        : Math.round(basic * 0.40)
  const conv    = (ps.conveyance != null && ps.conveyance !== '' && Number(ps.conveyance) > 0) ? Number(ps.conveyance) : (gross > 0 ? 1600 : 0)
  const med     = (ps.medical    != null && ps.medical !== '' && Number(ps.medical)    > 0) ? Number(ps.medical)    : (gross > 0 ? 1250 : 0)
  // Special: gross - (basic + da + hra + conv + med) — always recalculate to ensure consistency
  const specialCalc = gross - basic - da - hra - conv - med
  const special = (ps.special != null && ps.special !== '' && Number(ps.special) > 0)
    ? Number(ps.special)
    : (specialCalc > 0 ? specialCalc : 0)

  // ── PF Logic (Company Rule) ──
  // DB madhe pf_employee > 0 saved asel tar directly use karo (generate-time la correct calculate zala hota)
  // DB madhe 0 saved asel — mhanje toggle OFF hota — tar 0 ch rakho (user ne intentionally off kela hota)
  // DB madhe null/undefined asel (junya records) — tar company rule apply karo:
  //   monthly_gross > 21,000 → PF fixed ₹1,800 (cap)
  //   monthly_gross ≤ 21,000 → 12% of (basic + da)
  const pfFromDB = ps.pf_employee
  let pfEmp
  if (pfFromDB !== null && pfFromDB !== undefined && pfFromDB !== '') {
    // DB madhe value ahe — exactly te use karo (toggle ON/OFF decision respect karo)
    pfEmp = Number(pfFromDB)
  } else {
    // Junya record — null ahe — company rule lagav
    pfEmp = gross > 21000
      ? 1800
      : Math.round((basic + da) * 0.12)
  }

  // ── ESI: DB value use karo (toggle-based, override nako) ──
  const esiEmp  = Number(ps.esi_employee    || 0)
  const pt      = Number(ps.prof_tax        || 0) || (gross > 0 ? 200 : 0)
  const loan    = Number(ps.loan_recovery   || 0)
  const otherDed= Number(ps.other_deduction || 0)
  const tds     = Number(ps.tds             || 0)

  // ── Recalculate totals ──
  const totalDedCalc = pfEmp + esiEmp + pt + loan + otherDed + tds
  const netCalc      = gross - totalDedCalc

  // DB madhe net_salary saved asel tar te use karo (generate-time la correct hota)
  // nahitar recalculated value use karo
  const net = (ps.net_salary != null && ps.net_salary !== '' && Number(ps.net_salary) > 0)
    ? Number(ps.net_salary)
    : netCalc

  const earnRows = [
    { label: "Basic Salary",          val: basic   },
    { label: "DA",                    val: da      },
    { label: "HRA",                   val: hra     },
    { label: "Conveyance Allowances", val: conv    },
    { label: "Medical Allowances",    val: med     },
    { label: "Special Allowances",    val: special },
  ]
  const dedRows = [
    { label: "Provident Fund",       val: pfEmp   },
    { label: "ESI/Health Insurance", val: esiEmp  },
    { label: "Professional Tax",     val: pt      },
    { label: "Loan Recovery",        val: loan    },
    { label: "Other Deduction",      val: otherDed},
    { label: "TDS",                  val: tds     },
  ]
  const maxR = Math.max(earnRows.length, dedRows.length)
  const tableRowsHTML = Array.from({ length: maxR }, (_, i) => {
    const e = earnRows[i]
    const d = dedRows[i]
    return `<tr>
      <td style="padding:4px 8px;border:1px solid #000;font-size:11.5px">${e ? e.label : ''}</td>
      <td style="padding:4px 8px;border:1px solid #000;text-align:right;font-size:11.5px">${e ? fmtNum(e.val) : ''}</td>
      <td style="padding:4px 8px;border:1px solid #000;font-size:11.5px">${d ? d.label : ''}</td>
      <td style="padding:4px 8px;border:1px solid #000;text-align:right;font-size:11.5px">${d ? fmtNum(d.val) : ''}</td>
    </tr>`
  }).join('')

  const monthAbbr   = String(ps.month || '').slice(0, 3)
  const yearShort   = String(ps.year  || '').slice(-2)
  const monthLabel  = `${monthAbbr}-${yearShort}`
  const grossWords  = toWords(gross)
  const inHandWords = toWords(net)

  // ── Image: PHOTO-2025-09-04-19-02-03.jpg — left corner la set ──
  // TODO: Replace the src path below with your actual image import or public URL
  // e.g. import logoImg from '../assets/PHOTO-2025-09-04-19-02-03.jpg'  → then pass as prop or import at top
  // For now using relative path — update if needed:
  const logoImgSrc = logoImg

  const pgStyle = `
    position:relative;
    width:210mm;
    min-height:297mm;
    margin:0 auto;
    padding:32mm 18mm 22mm 18mm;
    font-family:'Segoe UI',Arial,sans-serif;
    font-size:13px;
    color:#1a2e1a;
    background:#ffffff;
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;
  `

  const footerHTML = `
    <div style="position:absolute;bottom:6mm;left:18mm;right:8mm;border-top:1px solid #999;padding-top:4px;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#000;font-family:'Segoe UI',Arial,sans-serif">
      <span>${CO.addressFooter}</span>
      <span>${CO.website} | ${CO.email}</span>
    </div>`

  const pw = window.open('', '_blank')
  pw.document.write(`<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<title>Pay Slip — ${ps.emp_name || 'Employee'} — ${ps.month} ${ps.year}</title>
<style>
  * { box-sizing:border-box;margin:0;padding:0 }
  body { font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#333;background:#f5f5f5 }
  @page { size:A4;margin:0 }
  @media print {
    html,body{width:210mm;margin:0;background:white}
    .no-print{display:none!important}
    *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
  }
  .meta-grid {
    display:grid;grid-template-columns:1fr 1fr;
    font-size:12px;line-height:1.85;
    margin-bottom:10px;border-bottom:1px solid #ccc;padding-bottom:8px;
  }
  .meta-grid .row { display:flex; }
  .meta-grid .lbl { min-width:120px;color:#333;font-weight:normal; }
  .meta-grid .val { color:#333; }
  .att-bar {
    font-size:12px;padding:3px 0 5px 0;
    border-bottom:1px solid #ccc;margin-bottom:7px;
    display:flex;gap:32px;
  }
  table { width:100%;border-collapse:collapse;font-size:12px;margin-top:4px }
  th {
    background:#ffffff;color:#000;
    padding:5px 8px;font-size:11.5px;font-weight:700;border:1px solid #000;
  }
  th:nth-child(1),th:nth-child(3) { text-align:left }
  th:nth-child(2),th:nth-child(4) { text-align:right }
  td { border:1px solid #000 }
  .total-row td {
    background:#e8f5e9;font-weight:700;
    padding:4px 8px;border:1px solid #000;font-size:11.5px;color:#1b4332;
  }
  .total-row td:nth-child(2),
  .total-row td:nth-child(4) { text-align:right }
  .net-row td {
    background:#c8e6c9;font-weight:700;
    padding:4px 8px;font-size:11.5px;color:#333;border:1px solid #000;
  }
  .net-row td:last-child { text-align:right;color:#333;font-weight:700 }
  .words { margin-top:12px;font-size:12px;line-height:2 }
  .words div { display:flex;gap:4px }
  .words .wlbl { font-weight:normal;min-width:190px }
  .note { position:absolute;bottom:35mm;left:18mm;right:18mm;font-size:11px;color:#444 }
  #pbar { position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#1e293b,#0f172a);border-top:2px solid #6366f1;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:'Segoe UI',sans-serif }
</style></head><body>

<div style="${pgStyle}">

  <!-- ── Logo Image + Company Name — Left Top Corner ── -->
  <div style="position:absolute;top:6mm;left:18mm;display:flex;align-items:center;gap:14px;">
    <img
      src="${logoImgSrc}"
      alt="Company Logo"
      style="height:100px;width:auto;object-fit:contain;"
    />
    <span style="font-size:36px;font-weight:900;color:#000000;letter-spacing:1px;font-family:'Segoe UI',Arial,sans-serif;line-height:1;">SOFTGRID INFO PVT. LTD.</span>
  </div>

  <div class="meta-grid">
    <div class="row"><span class="lbl">Month:</span><span class="val">${monthLabel}</span></div>
    <div class="row"><span class="lbl">UAN Number:</span><span class="val">${ps.uan_number || '-'}</span></div>
    <div class="row"><span class="lbl">EMP ID:</span><span class="val">${ps.emp_id || '-'}</span></div>
    <div class="row"><span class="lbl">PF Number:</span><span class="val">${ps.pf_number || '-'}</span></div>
    <div class="row"><span class="lbl">Name:</span><span class="val">${ps.emp_name || '-'}</span></div>
    <div class="row"><span class="lbl">PAN Number:</span><span class="val">${ps.pan_number || '-'}</span></div>
    <div class="row"><span class="lbl">Designation:</span><span class="val">${ps.designation || '-'}</span></div>
    <div class="row"><span class="lbl">Aadhaar Number:</span><span class="val">${ps.adhar_number || '-'}</span></div>
    <div class="row"><span class="lbl">Department:</span><span class="val">${ps.department || '-'}</span></div>
    <div class="row"><span class="lbl">Account Number:</span><span class="val">${ps.account_no || '-'}</span></div>
    <div class="row"></div>
    <div class="row"><span class="lbl">Bank Name:</span><span class="val">${ps.bank_name || '-'}</span></div>
  </div>

  <div class="att-bar">
    <span>Working Day's: <strong>${ps.working_days ?? '0'}</strong></span>
    <span>LOP: <strong>${ps.lop ?? '0.00'}</strong></span>
    <span>PL: <strong>${ps.pl || '0.00'}</strong></span>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:30%">Components In salary</th>
        <th style="width:20%">Gross Amount</th>
        <th style="width:30%">Deductions &amp; Recoveries</th>
        <th style="width:20%">Gross Deductions</th>
      </tr>
    </thead>
    <tbody>${tableRowsHTML}</tbody>
    <tfoot>
      <tr class="total-row">
        <td><strong>Total Gross Salary</strong></td>
        <td style="text-align:right"><strong>${fmtNum(gross)}</strong></td>
        <td></td>
        <td></td>
      </tr>
      <tr class="net-row">
        <td colspan="2"><strong>Net Salary</strong></td>
        <td></td>
        <td style="text-align:right"><strong>${fmtNum(net)}.0</strong></td>
      </tr>
    </tfoot>
  </table>

  <div class="words">
    <div><span class="wlbl">Total Amount In Words:</span><span>Rupees ${grossWords} Only.</span></div>
    <div><span class="wlbl">In Hand Salary In Words:</span><span>Rupees ${inHandWords} Only.</span></div>
  </div>

  <div class="note">Note: This is a computer-generated slip, signature is not required.</div>

  ${footerHTML}
</div>

<div id="pbar" class="no-print">
  <div>
    <div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Pay Slip is ready!</div>
    <div style="color:#64748b;font-size:12px">👇 Click <strong style="color:#a5b4fc">"Save as PDF"</strong> → Destination: <strong style="color:#a5b4fc">"Save as PDF"</strong></div>
  </div>
  <div style="display:flex;gap:10px">
    <button onclick="document.getElementById('pbar').style.display='none';window.print()" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(99,102,241,0.5)">⬇️ Save as PDF</button>
    <button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>
  </div>
</div>
</body></html>`)
  pw.document.close()
}