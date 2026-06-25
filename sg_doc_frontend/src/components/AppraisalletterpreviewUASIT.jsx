 
// import bgImage    from '../assets/UAS_backGround.jpeg'
// import stampimage  from '../assets/uas_stamp.png'   // circular UASIT stamp
// import stampimage1 from '../assets/uas_stamp1.png'  // second stamp (right side)

// // ─── Company Config ──────────────────────────────────────────────────────────
// const CO = {
//   fullName:        'UAS IT Consultancy Services Pvt. Ltd.',
//   fullNameUpper:   'UAS IT CONSULTANCY SERVICES PVT. LTD.',
//   shortNameUpper:  'UAS IT CONSULTANCY SERVICES',
//   website:         'www.uasit.in',
//   email:           'hr@uasit.in',
//   address:         'Office No:204, Khandagale Complex, Near EON Hospital, Kharadi Bypass, Pune 411014.',
//   gstin:           '27ABJCS4985R1Z4',
//   tan:             'PNES82511C',
//   color:           '#1a3c6e',
//   letterPrefix:    'UAS IT SERV/RELVLTR/25',
// }

// // ─── Helpers ─────────────────────────────────────────────────────────────────
// const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
// const tens  = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
// function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
// function toWords(n) { n=Math.round(n); if(!n) return "Zero"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim() }
// function fmtNum(n) { if(!n||isNaN(n)) return "0.00"; return Math.round(n).toLocaleString("en-IN") + ".00" }

// function ordinalDate(d) {
//   if (!d) return "—"
//   const dt     = new Date(d)
//   const day    = dt.getDate()
//   const suffix = ["th","st","nd","rd"][
//     ((day%100-20)%10<=3 && (day%100-20)%10>0) ? (day%100-20)%10 :
//     (day%100<=3 && day%100>0) ? day%100 : 0
//   ] || "th"
//   return day + "<sup>" + suffix + "</sup> " + dt.toLocaleDateString("en-IN", { month:"long", year:"numeric" })
// }

// function ordinalDatePlain(d) {
//   if (!d) return "—"
//   const dt     = new Date(d)
//   const day    = dt.getDate()
//   const suffix = ["th","st","nd","rd"][
//     ((day%100-20)%10<=3 && (day%100-20)%10>0) ? (day%100-20)%10 :
//     (day%100<=3 && day%100>0) ? day%100 : 0
//   ] || "th"
//   return day + suffix + " " + dt.toLocaleDateString("en-IN", { month:"short", year:"numeric" })
// }

// // ─── Salary Calculation ───────────────────────────────────────────────────────
// function calcSalary(monthly, withPF = true, pfRate = 12, pfEmrRate = 13) {
//   const m       = parseFloat(monthly) || 0
//   const basic   = Math.round(m * 0.40)
//   const da      = Math.round(basic * 0.50)
//   const hra     = Math.round(basic * 0.40)
//   const conv    = m > 0 ? 1600 : 0
//   const med     = m > 0 ? 1250 : 0
//   const special = m - basic - da - hra - conv - med
//   const pfCapped = withPF && m > 21000
//   const pf      = withPF ? (pfCapped ? 1800 : Math.round((basic + da) * (Number(pfRate)    || 0) / 100)) : 0
//   const pfEmr   = withPF ? (pfCapped ? 1800 : Math.round((basic + da) * (Number(pfEmrRate) || 0) / 100)) : 0
//   return {
//     basic:   basic   * 12,
//     da:      da      * 12,
//     hra:     hra     * 12,
//     conv:    conv    * 12,
//     med:     med     * 12,
//     special: special * 12,
//     pf:      pf      * 12,
//     pfEmr:   pfEmr   * 12,
//     gross:   m       * 12,
//     ctc:     (m + pfEmr) * 12,
//     withPF,
//   }
// }

// const ROWS = [
//   { label: 'Basic',                    key: 'basic'   },
//   { label: 'DA',                       key: 'da'      },
//   { label: 'HRA',                      key: 'hra'     },
//   { label: 'Conveyance allowances',    key: 'conv'    },
//   { label: 'Medical allowances',       key: 'med'     },
//   { label: 'Special Allowances',       key: 'special' },
//   { label: "Co.'s Contribution to PF", key: 'pfEmr'  },
// ]

// // ─── Build Full Printable HTML ────────────────────────────────────────────────
// export function buildAppraisalHTML(form) {
//   const nw = calcSalary(form.newMonthly, form.withPF, form.pfRate, form.pfEmrRate)

//   // ── Salary rows ──
//   const cellBase = "padding:3px 8px;border:1px solid #aaa;font-size:11pt;font-family:Calibri,Arial,sans-serif;vertical-align:middle;"

//   const rowsHTML = ROWS.map(r => {
//     const isPFRow    = r.key === 'pfEmr'
//     const valueText  = (isPFRow && !nw.withPF) ? 'Not Applicable' : fmtNum(nw[r.key])
//     return (
//       '<tr>' +
//         '<td style="' + cellBase + 'width:55%;color:#222">' + r.label + '</td>' +
//         '<td style="' + cellBase + 'width:45%;text-align:center;color:#222">' + valueText + '</td>' +
//       '</tr>'
//     )
//   }).join('')

//   // ── Stamp images used directly in signature block ──

//   return (
//     '<!DOCTYPE html><html><head>' +
//     '<meta charset="UTF-8">' +
//     '<title>Appraisal Letter — ' + (form.empName || 'Employee') + ' — ' + CO.fullName + '</title>' +
//     '<style>' +
//       '*{box-sizing:border-box;margin:0;padding:0}' +
//       "body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;background:#e8edf2;display:flex;justify-content:center;padding:30px 0 80px}" +
//       '@page{size:210mm 297mm;margin:0}' +
//       '@media print{' +
//         'html,body{width:210mm;min-height:297mm;margin:0;padding:0;background:white;display:block}' +
//         '.page{box-shadow:none}' +
//         '#save-bar{display:none!important}' +
//         '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
//       '}' +
//       '.page{' +
//         'width:210mm;min-height:297mm;' +
//         'background:#fff;' +
//         'position:relative;' +
//         'overflow:hidden;' +
//         'box-shadow:0 4px 32px rgba(0,0,0,0.18);' +
//       '}' +
//       '.bg-img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:top;z-index:0}' +
//       '.content{position:relative;z-index:1;padding:55mm 16mm 28mm 16mm}' +
//       "table{border-collapse:collapse}" +
//       "td,th{font-family:Calibri,Arial,sans-serif;font-size:11pt}" +
//       '.footer{' +
//         'position:absolute;bottom:0;left:0;right:0;' +
//         'padding:8px 16mm 10px;' +
//         'text-align:center;font-size:9pt;color:#1a1a1a;' +
//         'background:transparent;' +
//         "font-family:Calibri,Arial,sans-serif" +
//       '}' +
//       '.footer a{color:#1a3c6e;text-decoration:none}' +
//       '#save-bar{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#0d1f3c,' + CO.color + ');border-top:2px solid #4a90d9;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:"Segoe UI",sans-serif}' +
//     '</style></head><body>' +

//     '<div class="page">' +

//       // ── Background letterhead image ──
//       '<img class="bg-img" src="' + bgImage + '" alt="" />' +

//       '<div class="content">' +

//         // ── Date (right aligned only) ──
//         '<div style="text-align:right;font-size:11pt;font-weight:700;color:#1a1a1a;margin-bottom:5mm">' +
//           ordinalDate(form.letterDate || form.effectiveDate) +
//         '</div>' +

//         // ── Title ──
//         '<div style="text-align:center;font-size:16pt;font-weight:700;text-decoration:underline;margin-bottom:6mm;letter-spacing:0.02em;color:#1a1a1a">' +
//           'Appraisal Letter' +
//         '</div>' +

//         // ── Employee Name + Emp ID ──
//         '<div style="margin-bottom:5mm">' +
//           '<p style="font-size:11pt;font-weight:700;line-height:1.5;color:#1a1a1a">' + (form.empName || '[Employee Name]') + '</p>' +
//           '<p style="font-size:11pt;font-weight:700;line-height:1.5;color:#1a1a1a">Emp ID.: ' + (form.empId || '[Emp ID]') + '</p>' +
//         '</div>' +

//         // ── Body paragraph 1 ──
//         '<p style="font-size:11pt;line-height:1.55;margin-bottom:4mm;text-align:justify;color:#1a1a1a">' +
//           'We are pleased to inform you that, following a thorough review of your performance and contributions to ' +
//           '<strong>' + CO.fullName + '</strong>' +
//           ', we have decided to adjust your salary effective ' +
//           '<strong>' + ordinalDatePlain(form.effectiveDate) + '</strong>' +
//           '. This adjustment reflects our appreciation for your hard work, dedication, and continued growth within the company.' +
//         '</p>' +

//         // ── Body paragraph 2 ──
//         '<p style="font-size:11pt;line-height:1.55;margin-bottom:5mm;color:#1a1a1a">' +
//           'You are being appraised and your current salary and CTC is being revised as below.' +
//         '</p>' +

//         // ── Salary table ──
//         '<table style="width:80%;border-collapse:collapse;margin:0 auto 5mm auto">' +
//           '<thead>' +
//             '<tr>' +
//               '<th style="' + cellBase + 'background:#f0f0f0;font-weight:700;width:55%;text-align:left">Name</th>' +
//               '<th style="' + cellBase + 'background:#f0f0f0;font-weight:700;width:45%;text-align:left;padding-left:20px">' + (form.empName || '[Employee Name]') + '</th>' +
//             '</tr>' +
//             '<tr>' +
//               '<td style="' + cellBase + 'background:#fff;font-weight:400">Designation</td>' +
//               '<td style="' + cellBase + 'background:#fff;font-weight:400;padding-left:20px">' + (form.designation || '[Designation]') + '</td>' +
//             '</tr>' +
//             '<tr>' +
//               '<th style="' + cellBase + 'background:#f0f0f0;font-weight:700;text-align:left">Salary Components</th>' +
//               '<th style="' + cellBase + 'background:#f0f0f0;font-weight:700;text-align:left;padding-left:20px">Annual (INR)</th>' +
//             '</tr>' +
//           '</thead>' +
//           '<tbody>' + rowsHTML + '</tbody>' +
//           '<tfoot>' +
//             '<tr>' +
//               '<td style="' + cellBase + 'background:#fff;font-weight:700;color:#1a1a1a">Cost to Company (CTC)</td>' +
//               '<td style="' + cellBase + 'background:#fff;font-weight:700;color:#1a1a1a;text-align:center">' + fmtNum(nw.ctc) + '</td>' +
//             '</tr>' +
//           '</tfoot>' +
//         '</table>' +

//         // ── Closing paragraphs ──
//         '<p style="font-size:11pt;line-height:1.55;margin-bottom:2mm;text-align:justify;color:#1a1a1a">' +
//           'All the other terms and conditions of your employment remain unchanged as per the latest policies of the company.' +
//         '</p>' +
//         '<p style="font-size:11pt;line-height:1.55;margin-bottom:8mm;color:#1a1a1a">' +
//           'Looking forward to your continued support, excellence and collaboration with us.' +
//         '</p>' +

//         // ── Signature block ── (uas_stamp.png + uas_stamp1.png side by side, shifted 15mm right)
//         '<div style="display:flex;align-items:center;justify-content:flex-start;margin-top:4mm;margin-left:15mm;gap:10mm">' +
//           '<img src="' + stampimage  + '" style="height:85px;object-fit:contain" alt="UASIT Stamp" />' +
//           '<img src="' + stampimage1 + '" style="height:85px;object-fit:contain" alt="UASIT Stamp 1" />' +
//         '</div>' +

//       '</div>' + // .content

//       // ── Footer bar ──
//       '<div class="footer">' +
//         'Office Address: ' + CO.address +
//         ' &nbsp;|&nbsp; Website: <a href="https://' + CO.website + '">' + CO.website + '</a>' +
//         ' &nbsp;&nbsp; Email: <a href="mailto:' + CO.email + '">' + CO.email + '</a>' +
//       '</div>' +

//     '</div>' + // .page

//     // ── Save bar ──
//     '<div id="save-bar">' +
//       '<div>' +
//         '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Appraisal Letter तयार आहे! — ' + CO.fullName + '</div>' +
//         '<div style="color:#8ab4d4;font-size:12px">👇 <strong style="color:#a8d4f5">Save as PDF</strong> click करा</div>' +
//       '</div>' +
//       '<div style="display:flex;gap:10px">' +
//         '<button onclick="document.getElementById(\'save-bar\').style.display=\'none\';window.print();" style="background:linear-gradient(135deg,' + CO.color + ',#2a6bb5);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>' +
//         '<button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#8ab4d4;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>' +
//       '</div>' +
//     '</div>' +

//     '</body></html>'
//   )
// }

// // ── openAppraisalPDF ─────────────────────────────────────────────────────────
// // form = { empName, empId, designation, letterDate, effectiveDate,
// //          newMonthly, withPF, pfRate, pfEmrRate }
// export function openAppraisalPDF(form) {
//   const html = buildAppraisalHTML(form || {})
//   const pw = window.open('', '_blank')
//   if (!pw) return
//   pw.document.write(html)
//   pw.document.close()
// }

// export default openAppraisalPDF

import bgImage    from '../assets/UAS_backGround.jpeg'
import stampimage  from '../assets/uas_stamp.png'   // circular UASIT stamp
import stampimage1 from '../assets/uas_stamp1.png'  // second stamp (right side)

// ─── Company Config ──────────────────────────────────────────────────────────
const CO = {
  fullName:        'UAS IT Consultancy Services Pvt. Ltd.',
  fullNameUpper:   'UAS IT CONSULTANCY SERVICES PVT. LTD.',
  shortNameUpper:  'UAS IT CONSULTANCY SERVICES',
  website:         'www.uasit.in',
  email:           'hr@uasit.in',
  address:         'Office No:204, Khandagale Complex, Near EON Hospital, Kharadi Bypass, Pune 411014.',
  gstin:           '27ABJCS4985R1Z4',
  tan:             'PNES82511C',
  color:           '#1a3c6e',
  letterPrefix:    'UAS IT SERV/RELVLTR/25',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
const tens  = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
function toWords(n) { n=Math.round(n); if(!n) return "Zero"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim() }
function fmtNum(n) { if(!n||isNaN(n)) return "0.00"; return Math.round(n).toLocaleString("en-IN") + ".00" }

function ordinalDate(d) {
  if (!d) return "—"
  const dt     = new Date(d)
  const day    = dt.getDate()
  const suffix = ["th","st","nd","rd"][
    ((day%100-20)%10<=3 && (day%100-20)%10>0) ? (day%100-20)%10 :
    (day%100<=3 && day%100>0) ? day%100 : 0
  ] || "th"
  return day + "<sup>" + suffix + "</sup> " + dt.toLocaleDateString("en-IN", { month:"long", year:"numeric" })
}

function ordinalDatePlain(d) {
  if (!d) return "—"
  const dt     = new Date(d)
  const day    = dt.getDate()
  const suffix = ["th","st","nd","rd"][
    ((day%100-20)%10<=3 && (day%100-20)%10>0) ? (day%100-20)%10 :
    (day%100<=3 && day%100>0) ? day%100 : 0
  ] || "th"
  return day + suffix + " " + dt.toLocaleDateString("en-IN", { month:"short", year:"numeric" })
}

// ─── Salary Calculation ───────────────────────────────────────────────────────
function calcSalary(monthly, withPF = true, pfRate = 12, pfEmrRate = 13) {
  const m       = parseFloat(monthly) || 0
  const basic   = Math.round(m * 0.40)
  const da      = Math.round(basic * 0.50)
  const hra     = Math.round(basic * 0.40)
  const conv    = m > 0 ? 1600 : 0
  const med     = m > 0 ? 1250 : 0
  const special = m - basic - da - hra - conv - med
  const pfCapped = withPF && m > 21000
  const pf      = withPF ? (pfCapped ? 1800 : Math.round((basic + da) * (Number(pfRate)    || 0) / 100)) : 0
  const pfEmr   = withPF ? (pfCapped ? 1800 : Math.round((basic + da) * (Number(pfEmrRate) || 0) / 100)) : 0
  return {
    basic:   basic   * 12,
    da:      da      * 12,
    hra:     hra     * 12,
    conv:    conv    * 12,
    med:     med     * 12,
    special: special * 12,
    pf:      pf      * 12,
    pfEmr:   pfEmr   * 12,
    gross:   m       * 12,
    ctc:     (m + pfEmr) * 12,
    withPF,
  }
}

const ROWS = [
  { label: 'Basic',                    key: 'basic'   },
  { label: 'DA',                       key: 'da'      },
  { label: 'HRA',                      key: 'hra'     },
  { label: 'Conveyance allowances',    key: 'conv'    },
  { label: 'Medical allowances',       key: 'med'     },
  { label: 'Special Allowances',       key: 'special' },
  { label: "Co.'s Contribution to PF", key: 'pfEmr'  },
]

// ─── Build Full Printable HTML ────────────────────────────────────────────────
export function buildAppraisalHTML(form) {
  const nw = calcSalary(form.newMonthly, form.withPF, form.pfRate, form.pfEmrRate)

  // ── Salary rows ──
  const cellBase = "padding:3px 8px;border:1px solid #aaa;font-size:11pt;font-family:Calibri,Arial,sans-serif;vertical-align:middle;"

  const rowsHTML = ROWS.map(r => {
    const isPFRow    = r.key === 'pfEmr'
    const valueText  = (isPFRow && !nw.withPF) ? 'Not Applicable' : fmtNum(nw[r.key])
    return (
      '<tr>' +
        '<td style="' + cellBase + 'width:55%;color:#222">' + r.label + '</td>' +
        '<td style="' + cellBase + 'width:45%;text-align:center;color:#222">' + valueText + '</td>' +
      '</tr>'
    )
  }).join('')

  // ── Stamp images used directly in signature block ──

  return (
    '<!DOCTYPE html><html><head>' +
    '<meta charset="UTF-8">' +
    '<title>Appraisal Letter — ' + (form.empName || 'Employee') + ' — ' + CO.fullName + '</title>' +
    '<style>' +
      '*{box-sizing:border-box;margin:0;padding:0}' +
      "body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;background:#e8edf2;display:flex;justify-content:center;padding:30px 0 80px}" +
      '@page{size:210mm 297mm;margin:0}' +
      '@media print{' +
        'html,body{width:210mm;min-height:297mm;margin:0;padding:0;background:white;display:block}' +
        '.page{box-shadow:none}' +
        '#save-bar{display:none!important}' +
        '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
      '}' +
      '.page{' +
        'width:210mm;min-height:297mm;' +
        'background:#fff;' +
        'position:relative;' +
        'overflow:hidden;' +
        'box-shadow:0 4px 32px rgba(0,0,0,0.18);' +
      '}' +
      '.bg-img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:top;z-index:0}' +
      '.content{position:relative;z-index:1;padding:55mm 16mm 28mm 16mm}' +
      "table{border-collapse:collapse}" +
      "td,th{font-family:Calibri,Arial,sans-serif;font-size:11pt}" +
      '.footer{' +
        'position:absolute;bottom:0;left:0;right:0;' +
        'padding:8px 16mm 10px;' +
        'text-align:center;font-size:9pt;color:#1a1a1a;' +
        'background:transparent;' +
        "font-family:Calibri,Arial,sans-serif" +
      '}' +
      '.footer a{color:#1a3c6e;text-decoration:none}' +
      '#save-bar{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#0d1f3c,' + CO.color + ');border-top:2px solid #4a90d9;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:"Segoe UI",sans-serif}' +
    '</style></head><body>' +

    '<div class="page">' +

      // ── Background letterhead image ──
      '<img class="bg-img" src="' + bgImage + '" alt="" />' +

      '<div class="content">' +

        // ── Date (right aligned only) ──
        '<div style="text-align:right;font-size:11pt;font-weight:700;color:#1a1a1a;margin-bottom:5mm">' +
          ordinalDate(form.letterDate || form.effectiveDate) +
        '</div>' +

        // ── Title ──
        '<div style="text-align:center;font-size:16pt;font-weight:700;text-decoration:underline;margin-bottom:6mm;letter-spacing:0.02em;color:#1a1a1a">' +
          'Appraisal Letter' +
        '</div>' +

        // ── Employee Name + Emp ID ──
        '<div style="margin-bottom:5mm">' +
          '<p style="font-size:11pt;font-weight:700;line-height:1.5;color:#1a1a1a">' + (form.empName || '[Employee Name]') + '</p>' +
          '<p style="font-size:11pt;font-weight:700;line-height:1.5;color:#1a1a1a">Emp ID.: ' + (form.empId || '[Emp ID]') + '</p>' +
        '</div>' +

        // ── Body paragraph 1 ──
        '<p style="font-size:11pt;line-height:1.55;margin-bottom:4mm;text-align:justify;color:#1a1a1a">' +
          'We are pleased to inform you that, following a thorough review of your performance and contributions to ' +
          '<strong>' + CO.fullName + '</strong>' +
          ', we have decided to adjust your salary effective ' +
          '<strong>' + ordinalDatePlain(form.effectiveDate) + '</strong>' +
          '. This adjustment reflects our appreciation for your hard work, dedication, and continued growth within the company.' +
        '</p>' +

        // ── Body paragraph 2 ──
        '<p style="font-size:11pt;line-height:1.55;margin-bottom:5mm;color:#1a1a1a">' +
          'You are being appraised and your current salary and CTC is being revised as below.' +
        '</p>' +

        // ── Salary table ──
        '<table style="width:80%;border-collapse:collapse;margin:0 auto 5mm auto">' +
          '<thead>' +
            '<tr>' +
              '<th style="' + cellBase + 'background:#f0f0f0;font-weight:700;width:55%;text-align:left">Name</th>' +
              '<th style="' + cellBase + 'background:#f0f0f0;font-weight:700;width:45%;text-align:left;padding-left:20px">' + (form.empName || '[Employee Name]') + '</th>' +
            '</tr>' +
            '<tr>' +
              '<td style="' + cellBase + 'background:#fff;font-weight:400">Designation</td>' +
              '<td style="' + cellBase + 'background:#fff;font-weight:400;padding-left:20px">' + (form.designation || '[Designation]') + '</td>' +
            '</tr>' +
            '<tr>' +
              '<th style="' + cellBase + 'background:#f0f0f0;font-weight:700;text-align:left">Salary Components</th>' +
              '<th style="' + cellBase + 'background:#f0f0f0;font-weight:700;text-align:left;padding-left:20px">Annual (INR)</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + rowsHTML + '</tbody>' +
          '<tfoot>' +
            '<tr>' +
              '<td style="' + cellBase + 'background:#fff;font-weight:700;color:#1a1a1a">Cost to Company (CTC)</td>' +
              '<td style="' + cellBase + 'background:#fff;font-weight:700;color:#1a1a1a;text-align:center">' + fmtNum(nw.ctc) + '</td>' +
            '</tr>' +
          '</tfoot>' +
        '</table>' +

        // ── Closing paragraphs ──
        '<p style="font-size:11pt;line-height:1.55;margin-bottom:2mm;text-align:justify;color:#1a1a1a">' +
          'All the other terms and conditions of your employment remain unchanged as per the latest policies of the company.' +
        '</p>' +
        '<p style="font-size:11pt;line-height:1.55;margin-bottom:8mm;color:#1a1a1a">' +
          'Looking forward to your continued support, excellence and collaboration with us.' +
        '</p>' +

        // ── Signature block ── (uas_stamp.png + uas_stamp1.png side by side, shifted 15mm right)
        '<div style="display:flex;align-items:center;justify-content:flex-start;margin-top:4mm;margin-left:15mm;gap:10mm">' +
          '<img src="' + stampimage  + '" style="height:85px;object-fit:contain" alt="UASIT Stamp" />' +
          '<img src="' + stampimage1 + '" style="height:85px;object-fit:contain" alt="UASIT Stamp 1" />' +
        '</div>' +

      '</div>' + // .content

      // ── Footer bar ──
      '<div class="footer">' +
        'Office Address: ' + CO.address +
        ' &nbsp;|&nbsp; Website: <a href="https://' + CO.website + '">' + CO.website + '</a>' +
        ' &nbsp;&nbsp; Email: <a href="mailto:' + CO.email + '">' + CO.email + '</a>' +
      '</div>' +

    '</div>' + // .page

    // ── Save bar ──
    '<div id="save-bar">' +
      '<div>' +
        '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Appraisal Letter is Ready! — ' + CO.fullName + '</div>' +
        '<div style="color:#8ab4d4;font-size:12px">👇 Click <strong style="color:#a8d4f5">Save as PDF</strong> below</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px">' +
        '<button onclick="document.getElementById(\'save-bar\').style.display=\'none\';window.print();" style="background:linear-gradient(135deg,' + CO.color + ',#2a6bb5);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>' +
        '<button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#8ab4d4;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>' +
      '</div>' +
    '</div>' +

    '</body></html>'
  )
}

// ── openAppraisalPDF ─────────────────────────────────────────────────────────
// form = { empName, empId, designation, letterDate, effectiveDate,
//          newMonthly, withPF, pfRate, pfEmrRate }
export function openAppraisalPDF(form) {
  const html = buildAppraisalHTML(form || {})
  const pw = window.open('', '_blank')
  if (!pw) return
  pw.document.write(html)
  pw.document.close()
}

export default openAppraisalPDF