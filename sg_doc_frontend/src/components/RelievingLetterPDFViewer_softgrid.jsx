
// import { useCallback } from 'react'
// import OfferLetterTemplate from '../assets/OfferLetterTemplate.png'
// import stampimage  from '../assets/stamp.jpg'     // ✅ same stamp
// import stampimage2 from '../assets/stamp2.jpg'    // ✅ same stamp2

// const CO = {
//   fullName:      'SoftGrid Info Pvt. Ltd.',
//   fullNameUpper: 'SOFTGRID INFO PVT. LTD.',
//   website:       'www.softgridinfo.in',
//   email:         'hr@softgridinfo.in',
//   address:       'Office No. 203, Khandagale Complex, Behind EON Hospital, Kharadi Bypass, Pune MH - 411014',
//   gstin:         '27ABJCS4985R1Z4',
//   tan:           'PNES82511C',
//   themeColor:    '#2e7d32',
// }

// function ordinalDate(d) {
//   if (!d) return "—"
//   const dt = new Date(d)
//   const day = dt.getDate()
//   const suffix =
//     ["th","st","nd","rd"][
//       ((day % 100 - 20) % 10 <= 3 && (day % 100 - 20) % 10 > 0)
//         ? (day % 100 - 20) % 10
//         : (day % 100 <= 3 && day % 100 > 0)
//           ? day % 100
//           : 0
//     ] || "th"
//   return day + suffix + " " + dt.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
// }

// /**
//  * buildRelievingLetterHTML
//  *
//  * Core HTML builder for the Relieving Letter (shared by the hook,
//  * the component, and the plain `openRelievingLetterPDF` function).
//  *
//  * `form` shape:
//  *   {
//  *     empName:         string,
//  *     empId:           string,
//  *     resignationDate: 'YYYY-MM-DD',
//  *     relievingDate:   'YYYY-MM-DD',
//  *     letterDate:      'YYYY-MM-DD',
//  *   }
//  */
// function buildRelievingLetterHTML(form) {

//   // ── Background — Appraisal sarkha BG_PAGES[0] ─────────────────────────
//   const bgStyle =
//     "background-image:url('" + BG_PAGES[0] + "');" +
//     "background-size:100% 100%;" +          // ✅ Appraisal: 100% 100%
//     "background-repeat:no-repeat;" +
//     "background-position:center center;"    // ✅ Appraisal: center center

//   // ── Stamp 1 (center) — same as Appraisal ──────────────────────────────
//   const stampHTML = stampimage
//     ? '<img src="' + stampimage + '" style="height:70px;object-fit:contain" alt="Stamp" />'
//     : '<div style="width:70px;height:70px;border:2px solid ' + CO.themeColor + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:' + CO.themeColor + ';text-align:center">SOFTGRID<br>PUNE</div>'

//   // ── Stamp 2 (left side) — same as Appraisal ───────────────────────────
//   const stampHTML2 = stampimage2
//     ? '<img src="' + stampimage2 + '" style="height:70px;object-fit:contain" alt="Stamp" />'
//     : ''

//   // Format resignation date as DD-Mon-YYYY
//   const resignFmt = form.resignationDate
//     ? new Date(form.resignationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
//     : '[Resignation Date]'

//   // Format relieving date as DD-Month-YYYY
//   const relieveFmt = form.relievingDate
//     ? new Date(form.relievingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).replace(/ /g, '-')
//     : '[Relieving Date]'

//   const html =
//     '<!DOCTYPE html><html><head>' +
//     '<meta charset="UTF-8">' +
//     '<title>Relieving Letter — ' + (form.empName || 'Employee') + '</title>' +
//     '<style>' +
//       '*{box-sizing:border-box;margin:0;padding:0}' +
//       'body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;background:#f5f5f5}' +
//       '@page{size:210mm 297mm;margin:0}' +
//       '@media print{' +
//         'html,body{width:210mm;height:297mm;margin:0;overflow:hidden;background:white}' +
//         '#save-bar{display:none!important}' +
//         '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
//       '}' +
//       // ✅ Appraisal sarkha padding: 38mm 18mm 20mm
//       '.page{' +
//         'width:210mm;height:297mm;' +
//         'margin:0 auto;' +
//         'padding:38mm 18mm 20mm;' +
//         'position:relative;' +
//         'overflow:hidden;' +
//         bgStyle +
//         '-webkit-print-color-adjust:exact;print-color-adjust:exact' +
//       '}' +
//       // ✅ Appraisal sarkha footer
//       '.footer{' +
//         'position:absolute;bottom:8mm;left:18mm;right:18mm;' +
//         'padding-top:3mm;' +
//         'text-align:center;font-size:9pt;color:#444;' +
//         'font-family:Calibri,Arial,sans-serif' +
//       '}' +
//       '.footer a{color:' + CO.themeColor + ';text-decoration:none}' +
//       '#save-bar{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#1e293b,#0f172a);border-top:2px solid ' + CO.themeColor + ';padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:"Segoe UI",sans-serif}' +
//     '</style></head><body>' +

//     '<div class="page">' +

//       // ── Date (top-right) — Appraisal sarkha ──────────────────────────
//       '<div style="text-align:right;font-size:11pt;font-weight:600;margin-bottom:7mm;padding-top:10mm;padding-right:12mm;color:#1a1a1a">' +
//         ordinalDate(form.letterDate) +
//       '</div>' +

//       // ── Title ─────────────────────────────────────────────────────────
//       '<div style="text-align:center;font-size:18pt;font-weight:700;text-decoration:underline;margin-bottom:7mm;letter-spacing:.02em">' +
//         'Relieving Letter' +
//       '</div>' +

//       // ── Salutation ────────────────────────────────────────────────────
//       '<div style="margin-bottom:5mm">' +
//         '<p style="font-size:11pt;font-weight:700;line-height:1.3">Dear ' + (form.empName || '[Employee Name]') + ',</p>' +
//         '<p style="font-size:11pt;font-weight:700;line-height:1.3">Emp Id: ' + (form.empId || '[Emp ID]') + '</p>' +
//       '</div>' +

//       // ── Para 1 — resignation acknowledgement ──────────────────────────
//       '<p style="font-size:11pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
//         'This is to acknowledge the receipt of your resignation email dated <strong>' + resignFmt + '</strong>. ' +
//         'We have accepted your resignation and are writing to confirm that your employment with ' +
//         '<strong>' + CO.fullName + '</strong> will officially end on <strong>' + relieveFmt + '</strong>.' +
//       '</p>' +

//       // ── Para 2 — appreciation ─────────────────────────────────────────
//       '<p style="font-size:11pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
//         'During your tenure with us, you have contributed significantly to the company, and your efforts have ' +
//         'been greatly appreciated. We would like to take this opportunity to thank you for your dedication and ' +
//         'hard work.' +
//       '</p>' +

//       // ── Para 3 — formalities ──────────────────────────────────────────
//       '<p style="font-size:11pt;line-height:1.3;margin-bottom:3mm;text-align:justify">' +
//         'As per company policy, we request you to kindly ensure the completion of the following formalities before ' +
//         'your departure.' +
//       '</p>' +

//       '<ol style="font-size:11pt;line-height:1.3;margin-left:6mm;margin-bottom:4mm">' +
//         '<li>Settle any outstanding dues or financial obligations, if applicable.</li>' +
//         '<li>Complete the necessary paperwork and obtain all relevant clearance certificates.<br>' +
//           '<span style="display:block;text-align:justify;padding-left:2mm">' +
//             'Upon successful completion of the above formalities, we will process your final settlement as per company norms.' +
//           '</span>' +
//         '</li>' +
//       '</ol>' +

//       // ── Para 4 — closing ──────────────────────────────────────────────
//       '<p style="font-size:11pt;line-height:1.3;margin-bottom:5mm">' +
//         'Thank you once again for your service to our organization.' +
//       '</p>' +

//       // ── Stamp + Signature — Appraisal sarkha layout ───────────────────
//       '<div style="margin-top:4mm">' +
//         '<p style="font-size:11pt;font-weight:700;margin-bottom:1mm">For: ' + CO.fullNameUpper + '</p>' +
//         '<div style="display:flex;align-items:flex-end;margin-top:3mm;position:relative;min-height:80px">' +
//           '<div style="margin-left:0mm">' +
//             stampHTML2 +
//           '</div>' +
//           '<div style="position:absolute;left:50%;transform:translateX(-50%);bottom:0">' + stampHTML + '</div>' +
//         '</div>' +
//       '</div>' +

//       // ── Footer — Appraisal sarkha (website | email + address + gstin + tan) ──
//       '<div class="footer">' +
//         '<a href="https://' + CO.website + '">' + CO.website + '</a>' +
//         ' &nbsp;|&nbsp; ' +
//         '<a href="mailto:' + CO.email + '">' + CO.email + '</a><br>' +
//         'Address: ' + CO.address + '<br>' +
//         'GSTIN: ' + CO.gstin + ' &nbsp;|&nbsp; TAN: ' + CO.tan +
//       '</div>' +

//     '</div>' +

//     // ── Save bar — Appraisal sarkha ───────────────────────────────────────
//     '<div id="save-bar">' +
//       '<div>' +
//         '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Relieving Letter तयार आहे! — ' + CO.fullName + '</div>' +
//         '<div style="color:#64748b;font-size:12px">👇 <strong style="color:#a5b4fc">Save as PDF</strong> click करा</div>' +
//       '</div>' +
//       '<div style="display:flex;gap:10px">' +
//         '<button onclick="document.getElementById(\'save-bar\').style.display=\'none\';window.print();" style="background:linear-gradient(135deg,' + CO.themeColor + ',#4ade80);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>' +
//         '<button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>' +
//       '</div>' +
//     '</div>' +

//     '</body></html>'

//   return html
// }

// /**
//  * openRelievingLetterPDF
//  *
//  * Plain function (NOT a hook) — can be called directly from any
//  * click handler, e.g. handleViewRelieving(rl) in MyDocuments.jsx.
//  *
//  * `form` shape — same as above:
//  *   {
//  *     empName:         string,
//  *     empId:           string,
//  *     resignationDate: 'YYYY-MM-DD',
//  *     relievingDate:   'YYYY-MM-DD',
//  *     letterDate:      'YYYY-MM-DD',
//  *   }
//  */
// export function openRelievingLetterPDF(form) {
//   const html = buildRelievingLetterHTML(form)
//   const pw = window.open('', '_blank')
//   pw.document.write(html)
//   pw.document.close()
// }

// /**
//  * useRelievingLetterPDF
//  *
//  * Hook version — returns an `exportPDF` callback bound to `form`.
//  * Useful inside components where `form` lives in state.
//  */
// export function useRelievingLetterPDF(form) {
//   const exportPDF = useCallback(() => {
//     openRelievingLetterPDF(form)
//   }, [form])

//   return { exportPDF }
// }

// /**
//  * RelievingLetterPDFViewer — drop-in button component.
//  */
// export default function RelievingLetterPDFViewer({ form, label = '⬇️ Generate Relieving Letter (PDF)', className = '' }) {
//   const { exportPDF } = useRelievingLetterPDF(form)

//   return (
//     <button
//       onClick={exportPDF}
//       className={className || "w-full py-3 rounded-xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg"}
//     >
//       {label}
//     </button>
//   )
// }


import { useCallback } from 'react'
import OfferLetterTemplate from '../assets/OfferLetterTemplate.png'
import stampimage  from '../assets/stamp.jpg'     // ✅ same stamp
import stampimage2 from '../assets/stamp2.jpg'    // ✅ same stamp2

const CO = {
  fullName:      'SoftGrid Info Pvt. Ltd.',
  fullNameUpper: 'SOFTGRID INFO PVT. LTD.',
  website:       'www.softgridinfo.in',
  email:         'hr@softgridinfo.in',
  address:       'Office No. 203, Khandagale Complex, Behind EON Hospital, Kharadi Bypass, Pune MH - 411014',
  gstin:         '27ABJCS4985R1Z4',
  tan:           'PNES82511C',
  themeColor:    '#2e7d32',
}

function ordinalDate(d) {
  if (!d) return "—"
  const dt = new Date(d)
  const day = dt.getDate()
  const suffix =
    ["th","st","nd","rd"][
      ((day % 100 - 20) % 10 <= 3 && (day % 100 - 20) % 10 > 0)
        ? (day % 100 - 20) % 10
        : (day % 100 <= 3 && day % 100 > 0)
          ? day % 100
          : 0
    ] || "th"
  return day + suffix + " " + dt.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
}

/**
 * buildRelievingLetterHTML
 *
 * Core HTML builder for the Relieving Letter (shared by the hook,
 * the component, and the plain `openRelievingLetterPDF` function).
 *
 * `form` shape:
 *   {
 *     empName:         string,
 *     empId:           string,
 *     resignationDate: 'YYYY-MM-DD',
 *     relievingDate:   'YYYY-MM-DD',
 *     letterDate:      'YYYY-MM-DD',
 *   }
 */
function buildRelievingLetterHTML(form) {

  // ── Background — Appraisal sarkha BG_PAGES[0] ─────────────────────────
  const bgStyle =
    "background-image:url('" + OfferLetterTemplate + "');" +
    "background-size:100% 100%;" +          // ✅ Appraisal: 100% 100%
    "background-repeat:no-repeat;" +
    "background-position:center center;"    // ✅ Appraisal: center center

  // ── Stamp 1 (center) — same as Appraisal ──────────────────────────────
  const stampHTML = stampimage
    ? '<img src="' + stampimage + '" style="height:70px;object-fit:contain" alt="Stamp" />'
    : '<div style="width:70px;height:70px;border:2px solid ' + CO.themeColor + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:' + CO.themeColor + ';text-align:center">SOFTGRID<br>PUNE</div>'

  // ── Stamp 2 (left side) — same as Appraisal ───────────────────────────
  const stampHTML2 = stampimage2
    ? '<img src="' + stampimage2 + '" style="height:70px;object-fit:contain" alt="Stamp" />'
    : ''

  // Format resignation date as DD-Mon-YYYY
  const resignFmt = form.resignationDate
    ? new Date(form.resignationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
    : '[Resignation Date]'

  // Format relieving date as DD-Month-YYYY
  const relieveFmt = form.relievingDate
    ? new Date(form.relievingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).replace(/ /g, '-')
    : '[Relieving Date]'

  const html =
    '<!DOCTYPE html><html><head>' +
    '<meta charset="UTF-8">' +
    '<title>Relieving Letter — ' + (form.empName || 'Employee') + '</title>' +
    '<style>' +
      '*{box-sizing:border-box;margin:0;padding:0}' +
      'body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;background:#f5f5f5}' +
      '@page{size:210mm 297mm;margin:0}' +
      '@media print{' +
        'html,body{width:210mm;height:297mm;margin:0;overflow:hidden;background:white}' +
        '#save-bar{display:none!important}' +
        '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
      '}' +
      // ✅ Appraisal sarkha padding: 38mm 18mm 20mm
      '.page{' +
        'width:210mm;height:297mm;' +
        'margin:0 auto;' +
        'padding:38mm 18mm 20mm;' +
        'position:relative;' +
        'overflow:hidden;' +
        bgStyle +
        '-webkit-print-color-adjust:exact;print-color-adjust:exact' +
      '}' +
      // ✅ Appraisal sarkha footer
      '.footer{' +
        'position:absolute;bottom:8mm;left:18mm;right:18mm;' +
        'padding-top:3mm;' +
        'text-align:center;font-size:9pt;color:#444;' +
        'font-family:Calibri,Arial,sans-serif' +
      '}' +
      '.footer a{color:' + CO.themeColor + ';text-decoration:none}' +
      '#save-bar{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#1e293b,#0f172a);border-top:2px solid ' + CO.themeColor + ';padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:"Segoe UI",sans-serif}' +
    '</style></head><body>' +

    '<div class="page">' +

      // ── Date (top-right) — Appraisal sarkha ──────────────────────────
      '<div style="text-align:right;font-size:11pt;font-weight:600;margin-bottom:7mm;padding-top:10mm;padding-right:12mm;color:#1a1a1a">' +
        ordinalDate(form.letterDate) +
      '</div>' +

      // ── Title ─────────────────────────────────────────────────────────
      '<div style="text-align:center;font-size:18pt;font-weight:700;text-decoration:underline;margin-bottom:7mm;letter-spacing:.02em">' +
        'Relieving Letter' +
      '</div>' +

      // ── Salutation ────────────────────────────────────────────────────
      '<div style="margin-bottom:5mm">' +
        '<p style="font-size:11pt;font-weight:700;line-height:1.3">Dear ' + (form.empName || '[Employee Name]') + ',</p>' +
        '<p style="font-size:11pt;font-weight:700;line-height:1.3">Emp Id: ' + (form.empId || '[Emp ID]') + '</p>' +
      '</div>' +

      // ── Para 1 — resignation acknowledgement ──────────────────────────
      '<p style="font-size:11pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
        'This is to acknowledge the receipt of your resignation email dated <strong>' + resignFmt + '</strong>. ' +
        'We have accepted your resignation and are writing to confirm that your employment with ' +
        '<strong>' + CO.fullName + '</strong> will officially end on <strong>' + relieveFmt + '</strong>.' +
      '</p>' +

      // ── Para 2 — appreciation ─────────────────────────────────────────
      '<p style="font-size:11pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
        'During your tenure with us, you have contributed significantly to the company, and your efforts have ' +
        'been greatly appreciated. We would like to take this opportunity to thank you for your dedication and ' +
        'hard work.' +
      '</p>' +

      // ── Para 3 — formalities ──────────────────────────────────────────
      '<p style="font-size:11pt;line-height:1.3;margin-bottom:3mm;text-align:justify">' +
        'As per company policy, we request you to kindly ensure the completion of the following formalities before ' +
        'your departure.' +
      '</p>' +

      '<ol style="font-size:11pt;line-height:1.3;margin-left:6mm;margin-bottom:4mm">' +
        '<li>Settle any outstanding dues or financial obligations, if applicable.</li>' +
        '<li>Complete the necessary paperwork and obtain all relevant clearance certificates.<br>' +
          '<span style="display:block;text-align:justify;padding-left:2mm">' +
            'Upon successful completion of the above formalities, we will process your final settlement as per company norms.' +
          '</span>' +
        '</li>' +
      '</ol>' +

      // ── Para 4 — closing ──────────────────────────────────────────────
      '<p style="font-size:11pt;line-height:1.3;margin-bottom:5mm">' +
        'Thank you once again for your service to our organization.' +
      '</p>' +

      // ── Stamp + Signature — Appraisal sarkha layout ───────────────────
      '<div style="margin-top:4mm">' +
        '<p style="font-size:11pt;font-weight:700;margin-bottom:1mm">For: ' + CO.fullNameUpper + '</p>' +
        '<div style="display:flex;align-items:flex-end;margin-top:3mm;position:relative;min-height:80px">' +
          '<div style="margin-left:0mm">' +
            stampHTML2 +
          '</div>' +
          '<div style="position:absolute;left:50%;transform:translateX(-50%);bottom:0">' + stampHTML + '</div>' +
        '</div>' +
      '</div>' +

      // ── Footer — Appraisal sarkha (website | email + address + gstin + tan) ──
      '<div class="footer">' +
        '<a href="https://' + CO.website + '">' + CO.website + '</a>' +
        ' &nbsp;|&nbsp; ' +
        '<a href="mailto:' + CO.email + '">' + CO.email + '</a><br>' +
        'Address: ' + CO.address + '<br>' +
        'GSTIN: ' + CO.gstin + ' &nbsp;|&nbsp; TAN: ' + CO.tan +
      '</div>' +

    '</div>' +

    // ── Save bar — Appraisal sarkha ───────────────────────────────────────
    '<div id="save-bar">' +
      '<div>' +
        '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Relieving Letter तयार आहे! — ' + CO.fullName + '</div>' +
        '<div style="color:#64748b;font-size:12px">👇 <strong style="color:#a5b4fc">Save as PDF</strong> click करा</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px">' +
        '<button onclick="document.getElementById(\'save-bar\').style.display=\'none\';window.print();" style="background:linear-gradient(135deg,' + CO.themeColor + ',#4ade80);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>' +
        '<button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>' +
      '</div>' +
    '</div>' +

    '</body></html>'

  return html
}

/**
 * openRelievingLetterPDF
 *
 * Plain function (NOT a hook) — can be called directly from any
 * click handler, e.g. handleViewRelieving(rl) in MyDocuments.jsx.
 *
 * `form` shape — same as above:
 *   {
 *     empName:         string,
 *     empId:           string,
 *     resignationDate: 'YYYY-MM-DD',
 *     relievingDate:   'YYYY-MM-DD',
 *     letterDate:      'YYYY-MM-DD',
 *   }
 */
export function openRelievingLetterPDF(form) {
  const html = buildRelievingLetterHTML(form)
  const pw = window.open('', '_blank')
  pw.document.write(html)
  pw.document.close()
}

/**
 * useRelievingLetterPDF
 *
 * Hook version — returns an `exportPDF` callback bound to `form`.
 * Useful inside components where `form` lives in state.
 */
export function useRelievingLetterPDF(form) {
  const exportPDF = useCallback(() => {
    openRelievingLetterPDF(form)
  }, [form])

  return { exportPDF }
}

/**
 * RelievingLetterPDFViewer — drop-in button component.
 */
export default function RelievingLetterPDFViewer({ form, label = '⬇️ Generate Relieving Letter (PDF)', className = '' }) {
  const { exportPDF } = useRelievingLetterPDF(form)

  return (
    <button
      onClick={exportPDF}
      className={className || "w-full py-3 rounded-xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg"}
    >
      {label}
    </button>
  )
}