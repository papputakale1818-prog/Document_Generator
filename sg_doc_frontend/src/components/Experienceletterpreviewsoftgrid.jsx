// import { useCallback } from 'react'
// import OfferLetterTemplate from '../assets/OfferLetterTemplate.png'
// import stampimage  from '../assets/stamp.jpg'     // ✅ same stamp
// import stampimage2 from '../assets/stamp2.jpg'    // ✅ same stamp2

// // Experienceletterpreviewsoftgrid.jsx
// // Opens a new browser tab with a print-ready Experience Letter — background,
// // padding, stamps & save-bar match RelievingLetterPDFViewer_softgrid.jsx exactly.

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

// // e.g. 02-Oct-2023
// function fmtDateShort(dateStr) {
//   if (!dateStr) return ''
//   const d = new Date(dateStr)
//   if (isNaN(d)) return dateStr
//   return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
// }

// /**
//  * buildExperienceLetterHTML
//  *
//  * Core HTML builder for the Experience Letter (shared by the hook,
//  * the component, and the plain `openExperienceLetterPDF` function).
//  *
//  * `form` shape:
//  *   {
//  *     empName:         string,
//  *     empId:           string,
//  *     designation:     string,
//  *     joiningDate:     'YYYY-MM-DD',
//  *     lastWorkingDate: 'YYYY-MM-DD',
//  *     letterDate:      'YYYY-MM-DD',
//  *     employmentType:  string,
//  *   }
//  */
// function buildExperienceLetterHTML(form) {
//   const {
//     empName = '', empId = '', designation = '',
//     joiningDate = '', lastWorkingDate = '',
//     letterDate = '', employmentType = 'Permanent',
//   } = form || {}

//   // ── Background — Appraisal/Relieving sarkha BG_PAGES[0] ───────────────
//   const bgStyle =
//     "background-image:url('" + BG_PAGES[0] + "');" +
//     "background-size:100% 100%;" +          // ✅ same: 100% 100%
//     "background-repeat:no-repeat;" +
//     "background-position:center center;"    // ✅ same: center center

//   // ── Stamp 1 (center) — same as Appraisal/Relieving ─────────────────────
//   const stampHTML = stampimage
//     ? '<img src="' + stampimage + '" style="height:70px;object-fit:contain" alt="Stamp" />'
//     : '<div style="width:70px;height:70px;border:2px solid ' + CO.themeColor + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:' + CO.themeColor + ';text-align:center">SOFTGRID<br>PUNE</div>'

//   // ── Stamp 2 (left side) — same as Appraisal/Relieving ──────────────────
//   const stampHTML2 = stampimage2
//     ? '<img src="' + stampimage2 + '" style="height:70px;object-fit:contain" alt="Stamp" />'
//     : ''

//   const joinFmt   = joiningDate ? fmtDateShort(joiningDate) : '[Joining Date]'
//   const lastFmt    = lastWorkingDate ? fmtDateShort(lastWorkingDate) : '[Last Working Date]'

//   const html =
//     '<!DOCTYPE html><html><head>' +
//     '<meta charset="UTF-8">' +
//     '<title>Experience Letter — ' + (empName || 'Employee') + '</title>' +
//     '<style>' +
//       '*{box-sizing:border-box;margin:0;padding:0}' +
//       'body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;background:#f5f5f5}' +
//       '@page{size:210mm 297mm;margin:0}' +
//       '@media print{' +
//         'html,body{width:210mm;height:297mm;margin:0;overflow:hidden;background:white}' +
//         '#save-bar{display:none!important}' +
//         '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
//       '}' +
//       // ✅ Appraisal/Relieving sarkha padding: 38mm 18mm 20mm
//       '.page{' +
//         'width:210mm;height:297mm;' +
//         'margin:0 auto;' +
//         'padding:38mm 18mm 20mm;' +
//         'position:relative;' +
//         'overflow:hidden;' +
//         bgStyle +
//         '-webkit-print-color-adjust:exact;print-color-adjust:exact' +
//       '}' +
//       // ✅ Appraisal/Relieving sarkha footer
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

//       // ── Date (top-right) — Appraisal/Relieving sarkha ──────────────────
//       '<div style="text-align:right;font-size:11pt;font-weight:600;margin-bottom:7mm;padding-top:10mm;padding-right:12mm;color:#1a1a1a">' +
//         ordinalDate(letterDate) +
//       '</div>' +

//       // ── Title ─────────────────────────────────────────────────────────
//       '<div style="text-align:center;font-size:18pt;font-weight:700;text-decoration:underline;margin-bottom:7mm;letter-spacing:.02em">' +
//         'To Whom It May Concern' +
//       '</div>' +

//       // ── Salutation ────────────────────────────────────────────────────
//       '<div style="margin-bottom:5mm">' +
//         '<p style="font-size:11pt;font-weight:700;line-height:1.3">' + (empName || '[Employee Name]') + '</p>' +
//         '<p style="font-size:11pt;font-weight:700;line-height:1.3">Emp Id: ' + (empId || '[Emp ID]') + '</p>' +
//       '</div>' +

//       // ── Para 1 — employment certification ───────────────────────────────
//       '<p style="font-size:11pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
//         'This is to certify that, <strong>Mr./Ms. ' + (empName || '[Employee Name]') + '</strong> has been with our organization from ' +
//         '<strong>' + joinFmt + ' to ' + lastFmt + '</strong> on a <strong>' + employmentType + '</strong> basis, and his/her last ' +
//         'held designation was <strong>' + (designation || '[Designation]') + '</strong>. He/She has been relieved from the services w.e.f ' +
//         '<strong>' + lastFmt + '</strong>.' +
//       '</p>' +

//       // ── Para 2 — well wishes ──────────────────────────────────────────
//       '<p style="font-size:11pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
//         'We wish him / her very best for his / her future endeavors.' +
//       '</p>' +

//       // ── Para 3 — thanks ───────────────────────────────────────────────
//       '<p style="font-size:11pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
//         'We thank you for your services with <strong>' + CO.fullNameUpper + '</strong> and take this opportunity ' +
//         'we wish you all the best for your future endeavors.' +
//       '</p>' +

//       // ── Para 4 — confidentiality ─────────────────────────────────────
//       '<p style="font-size:11pt;line-height:1.3;margin-bottom:5mm;text-align:justify">' +
//         'We would like to draw your attention to your continuing obligations towards the company, including that of ' +
//         'confidentiality with respect to all proprietary and confidential information and data of the company and its ' +
//         'customers that you have had access to during the course of your employment with the company.' +
//       '</p>' +

//       // ── Stamp + Signature — Appraisal/Relieving sarkha layout ─────────
//       '<div style="margin-top:4mm">' +
//         '<p style="font-size:11pt;font-weight:700;margin-bottom:1mm">For: ' + CO.fullNameUpper + '</p>' +
//         '<div style="display:flex;align-items:flex-end;margin-top:3mm;position:relative;min-height:80px">' +
//           '<div style="margin-left:0mm">' +
//             stampHTML2 +
//           '</div>' +
//           '<div style="position:absolute;left:50%;transform:translateX(-50%);bottom:0">' + stampHTML + '</div>' +
//         '</div>' +
//       '</div>' +

//       // ── Footer — Appraisal/Relieving sarkha (website | email + address + gstin + tan) ──
//       '<div class="footer">' +
//         '<a href="https://' + CO.website + '">' + CO.website + '</a>' +
//         ' &nbsp;|&nbsp; ' +
//         '<a href="mailto:' + CO.email + '">' + CO.email + '</a><br>' +
//         'Address: ' + CO.address + '<br>' +
//         'GSTIN: ' + CO.gstin + ' &nbsp;|&nbsp; TAN: ' + CO.tan +
//       '</div>' +

//     '</div>' +

//     // ── Save bar — Appraisal/Relieving sarkha ─────────────────────────────
//     '<div id="save-bar">' +
//       '<div>' +
//         '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Experience Letter तयार आहे! — ' + CO.fullName + '</div>' +
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
//  * openExperienceLetterPDF
//  *
//  * Plain function (NOT a hook) — can be called directly from any
//  * click handler, e.g. handleViewExperience(el) in MyDocuments.jsx.
//  *
//  * `form` shape — same as above.
//  */
// export function openExperienceLetterPDF(form) {
//   const html = buildExperienceLetterHTML(form)
//   const pw = window.open('', '_blank')
//   pw.document.write(html)
//   pw.document.close()
// }

// /**
//  * useExperienceLetterPDF
//  *
//  * Hook version — returns an `exportPDF` callback bound to `form`.
//  * Useful inside components where `form` lives in state.
//  */
// export function useExperienceLetterPDF(form) {
//   const exportPDF = useCallback(() => {
//     openExperienceLetterPDF(form)
//   }, [form])

//   return { exportPDF }
// }

// /**
//  * ExperienceLetterPDFViewer — drop-in button component.
//  */
// export default function ExperienceLetterPDFViewer({ form, label = '⬇️ Generate Experience Letter (PDF)', className = '' }) {
//   const { exportPDF } = useExperienceLetterPDF(form)

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

// Experienceletterpreviewsoftgrid.jsx
// Opens a new browser tab with a print-ready Experience Letter — background,
// padding, stamps & save-bar match RelievingLetterPDFViewer_softgrid.jsx exactly.

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

// e.g. 02-Oct-2023
function fmtDateShort(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
}

/**
 * buildExperienceLetterHTML
 *
 * Core HTML builder for the Experience Letter (shared by the hook,
 * the component, and the plain `openExperienceLetterPDF` function).
 *
 * `form` shape:
 *   {
 *     empName:         string,
 *     empId:           string,
 *     designation:     string,
 *     joiningDate:     'YYYY-MM-DD',
 *     lastWorkingDate: 'YYYY-MM-DD',
 *     letterDate:      'YYYY-MM-DD',
 *     employmentType:  string,
 *   }
 */
function buildExperienceLetterHTML(form) {
  const {
    empName = '', empId = '', designation = '',
    joiningDate = '', lastWorkingDate = '',
    letterDate = '', employmentType = 'Permanent',
  } = form || {}

  // ── Background — Appraisal/Relieving sarkha BG_PAGES[0] ───────────────
  const bgStyle =
    "background-image:url('" + OfferLetterTemplate + "');" +
    "background-size:100% 100%;" +          // ✅ same: 100% 100%
    "background-repeat:no-repeat;" +
    "background-position:center center;"    // ✅ same: center center

  // ── Stamp 1 (center) — same as Appraisal/Relieving ─────────────────────
  const stampHTML = stampimage
    ? '<img src="' + stampimage + '" style="height:70px;object-fit:contain" alt="Stamp" />'
    : '<div style="width:70px;height:70px;border:2px solid ' + CO.themeColor + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:' + CO.themeColor + ';text-align:center">SOFTGRID<br>PUNE</div>'

  // ── Stamp 2 (left side) — same as Appraisal/Relieving ──────────────────
  const stampHTML2 = stampimage2
    ? '<img src="' + stampimage2 + '" style="height:70px;object-fit:contain" alt="Stamp" />'
    : ''

  const joinFmt   = joiningDate ? fmtDateShort(joiningDate) : '[Joining Date]'
  const lastFmt    = lastWorkingDate ? fmtDateShort(lastWorkingDate) : '[Last Working Date]'

  const html =
    '<!DOCTYPE html><html><head>' +
    '<meta charset="UTF-8">' +
    '<title>Experience Letter — ' + (empName || 'Employee') + '</title>' +
    '<style>' +
      '*{box-sizing:border-box;margin:0;padding:0}' +
      'body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;background:#f5f5f5}' +
      '@page{size:210mm 297mm;margin:0}' +
      '@media print{' +
        'html,body{width:210mm;height:297mm;margin:0;overflow:hidden;background:white}' +
        '#save-bar{display:none!important}' +
        '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
      '}' +
      // ✅ Appraisal/Relieving sarkha padding: 38mm 18mm 20mm
      '.page{' +
        'width:210mm;height:297mm;' +
        'margin:0 auto;' +
        'padding:38mm 18mm 20mm;' +
        'position:relative;' +
        'overflow:hidden;' +
        bgStyle +
        '-webkit-print-color-adjust:exact;print-color-adjust:exact' +
      '}' +
      // ✅ Appraisal/Relieving sarkha footer
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

      // ── Date (top-right) — Appraisal/Relieving sarkha ──────────────────
      '<div style="text-align:right;font-size:11pt;font-weight:600;margin-bottom:7mm;padding-top:10mm;padding-right:12mm;color:#1a1a1a">' +
        ordinalDate(letterDate) +
      '</div>' +

      // ── Title ─────────────────────────────────────────────────────────
      '<div style="text-align:center;font-size:18pt;font-weight:700;text-decoration:underline;margin-bottom:7mm;letter-spacing:.02em">' +
        'To Whom It May Concern' +
      '</div>' +

      // ── Salutation ────────────────────────────────────────────────────
      '<div style="margin-bottom:5mm">' +
        '<p style="font-size:11pt;font-weight:700;line-height:1.3">' + (empName || '[Employee Name]') + '</p>' +
        '<p style="font-size:11pt;font-weight:700;line-height:1.3">Emp Id: ' + (empId || '[Emp ID]') + '</p>' +
      '</div>' +

      // ── Para 1 — employment certification ───────────────────────────────
      '<p style="font-size:11pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
        'This is to certify that, <strong>Mr./Ms. ' + (empName || '[Employee Name]') + '</strong> has been with our organization from ' +
        '<strong>' + joinFmt + ' to ' + lastFmt + '</strong> on a <strong>' + employmentType + '</strong> basis, and his/her last ' +
        'held designation was <strong>' + (designation || '[Designation]') + '</strong>. He/She has been relieved from the services w.e.f ' +
        '<strong>' + lastFmt + '</strong>.' +
      '</p>' +

      // ── Para 2 — well wishes ──────────────────────────────────────────
      '<p style="font-size:11pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
        'We wish him / her very best for his / her future endeavors.' +
      '</p>' +

      // ── Para 3 — thanks ───────────────────────────────────────────────
      '<p style="font-size:11pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
        'We thank you for your services with <strong>' + CO.fullNameUpper + '</strong> and take this opportunity ' +
        'we wish you all the best for your future endeavors.' +
      '</p>' +

      // ── Para 4 — confidentiality ─────────────────────────────────────
      '<p style="font-size:11pt;line-height:1.3;margin-bottom:5mm;text-align:justify">' +
        'We would like to draw your attention to your continuing obligations towards the company, including that of ' +
        'confidentiality with respect to all proprietary and confidential information and data of the company and its ' +
        'customers that you have had access to during the course of your employment with the company.' +
      '</p>' +

      // ── Stamp + Signature — Appraisal/Relieving sarkha layout ─────────
      '<div style="margin-top:4mm">' +
        '<p style="font-size:11pt;font-weight:700;margin-bottom:1mm">For: ' + CO.fullNameUpper + '</p>' +
        '<div style="display:flex;align-items:flex-end;margin-top:3mm;position:relative;min-height:80px">' +
          '<div style="margin-left:0mm">' +
            stampHTML2 +
          '</div>' +
          '<div style="position:absolute;left:50%;transform:translateX(-50%);bottom:0">' + stampHTML + '</div>' +
        '</div>' +
      '</div>' +

      // ── Footer — Appraisal/Relieving sarkha (website | email + address + gstin + tan) ──
      '<div class="footer">' +
        '<a href="https://' + CO.website + '">' + CO.website + '</a>' +
        ' &nbsp;|&nbsp; ' +
        '<a href="mailto:' + CO.email + '">' + CO.email + '</a><br>' +
        'Address: ' + CO.address + '<br>' +
        'GSTIN: ' + CO.gstin + ' &nbsp;|&nbsp; TAN: ' + CO.tan +
      '</div>' +

    '</div>' +

    // ── Save bar — Appraisal/Relieving sarkha ─────────────────────────────
    '<div id="save-bar">' +
      '<div>' +
        '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Experience Letter तयार आहे! — ' + CO.fullName + '</div>' +
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
 * openExperienceLetterPDF
 *
 * Plain function (NOT a hook) — can be called directly from any
 * click handler, e.g. handleViewExperience(el) in MyDocuments.jsx.
 *
 * `form` shape — same as above.
 */
export function openExperienceLetterPDF(form) {
  const html = buildExperienceLetterHTML(form)
  const pw = window.open('', '_blank')
  pw.document.write(html)
  pw.document.close()
}

/**
 * useExperienceLetterPDF
 *
 * Hook version — returns an `exportPDF` callback bound to `form`.
 * Useful inside components where `form` lives in state.
 */
export function useExperienceLetterPDF(form) {
  const exportPDF = useCallback(() => {
    openExperienceLetterPDF(form)
  }, [form])

  return { exportPDF }
}

/**
 * ExperienceLetterPDFViewer — drop-in button component.
 */
export default function ExperienceLetterPDFViewer({ form, label = '⬇️ Generate Experience Letter (PDF)', className = '' }) {
  const { exportPDF } = useExperienceLetterPDF(form)

  return (
    <button
      onClick={exportPDF}
      className={className || "w-full py-3 rounded-xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg"}
    >
      {label}
    </button>
  )
}