// import { useCallback } from 'react'
// import bgImage     from '../assets/UAS_backGround.jpeg'
// import stampimage  from '../assets/uas_stamp.png'
// import stampimage1 from '../assets/uas_stamp1.png'

// const CO = {
//   fullName:      'UASIT Pvt. Ltd.',
//   fullNameUpper: 'UASIT PVT. LTD.',
//   website:       'www.uasit.in',
//   email:         'hr@uasit.in',
//   address:       'Your UASIT Office Address Here',
//   gstin:         'YOUR_GSTIN_HERE',
//   tan:           'YOUR_TAN_HERE',
//   themeColor:    '#1565c0',
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

// function buildResignationAcceptanceHTML(form) {

//   // ✅ Fixed: bgImage वापरतो (OfferLetterTemplate नाही)
//   const bgStyle =
//     "background-image:url('" + bgImage + "');" +
//     "background-size:100% 100%;" +
//     "background-repeat:no-repeat;" +
//     "background-position:center center;"

//   const stampHTML = stampimage
//     ? '<img src="' + stampimage + '" style="height:70px;object-fit:contain" alt="Stamp" />'
//     : '<div style="width:70px;height:70px;border:2px solid ' + CO.themeColor + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:' + CO.themeColor + ';text-align:center">UASIT<br>PUNE</div>'

//   const stampHTML2 = stampimage1
//     ? '<img src="' + stampimage1 + '" style="height:70px;object-fit:contain" alt="Stamp" />'
//     : ''

//   const resignFmt = form.resignationDate
//     ? new Date(form.resignationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
//     : '[Resignation Date]'

//   const lastDayFmt = form.lastWorkingDate
//     ? new Date(form.lastWorkingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).replace(/ /g, '-')
//     : '[Last Working Date]'

//   const html =
//     '<!DOCTYPE html><html><head>' +
//     '<meta charset="UTF-8">' +
//     '<title>Resignation Acceptance Letter — ' + (form.empName || 'Employee') + '</title>' +
//     '<style>' +
//       '*{box-sizing:border-box;margin:0;padding:0}' +
//       'body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;background:#f5f5f5}' +
//       '@page{size:210mm 297mm;margin:0}' +
//       '@media print{' +
//         'html,body{width:210mm;height:297mm;margin:0;overflow:hidden;background:white}' +
//         '#save-bar{display:none!important}' +
//         '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
//       '}' +
//       '.page{' +
//         'width:210mm;height:297mm;' +
//         'margin:0 auto;' +
//         'padding:38mm 18mm 20mm;' +
//         'position:relative;' +
//         'overflow:hidden;' +
//         bgStyle +
//         '-webkit-print-color-adjust:exact;print-color-adjust:exact' +
//       '}' +
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

//       '<div style="text-align:right;font-size:11pt;font-weight:600;margin-bottom:7mm;padding-top:10mm;padding-right:12mm;color:#1a1a1a">' +
//         ordinalDate(form.letterDate) +
//       '</div>' +

//       '<div style="text-align:center;font-size:20pt;font-weight:700;text-decoration:underline;margin-bottom:7mm;letter-spacing:.02em">' +
//         'Resignation Acceptance Letter' +
//       '</div>' +

//       '<div style="margin-top:5mm">' +

//       '<div style="margin-bottom:5mm">' +
//         '<p style="font-size:13pt;font-weight:700;line-height:1.3">Dear ' + (form.empName || '[Employee Name]') + ',</p>' +
//         '<p style="font-size:13pt;font-weight:700;line-height:1.3">Emp Id: ' + (form.empId || '[Emp ID]') +
//           (form.designation ? ' &nbsp;|&nbsp; Designation: ' + form.designation : '') +
//         '</p>' +
//       '</div>' +

//       '<p style="font-size:13pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
//         'This is to acknowledge the receipt of your resignation email dated <strong>' + resignFmt + '</strong>. ' +
//         'We are writing to confirm that your resignation has been duly accepted, and your last working day with ' +
//         '<strong>' + CO.fullName + '</strong> will be <strong>' + lastDayFmt + '</strong>.' +
//       '</p>' +

//       '<p style="font-size:13pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
//         'During your tenure with us, you have contributed significantly to the company, and your efforts have ' +
//         'been greatly appreciated. We would like to take this opportunity to thank you for your dedication and ' +
//         'hard work.' +
//       '</p>' +

//       '<p style="font-size:13pt;line-height:1.3;margin-bottom:3mm;text-align:justify">' +
//         'We kindly request you to ensure a smooth transition by completing the following before your last ' +
//         'working day.' +
//       '</p>' +

//       '<ol style="font-size:13pt;line-height:1.6;margin-left:6mm;margin-bottom:4mm">' +
//         '<li style="margin-bottom:2mm">Complete the handover of all pending work and responsibilities to your reporting manager.</li>' +
//         '<li style="margin-bottom:2mm">Return all company assets, including laptop, ID card, and any other property issued to you.</li>' +
//         '<li style="margin-bottom:2mm">Settle any outstanding dues or financial obligations, if applicable.<br>' +
//           '<span style="display:block;text-align:justify;padding-left:2mm;margin-top:2mm">' +
//             'Upon successful completion of the above formalities, your relieving letter and full and final ' +
//             'settlement will be processed as per company norms.' +
//           '</span>' +
//         '</li>' +
//       '</ol>' +

//       '<p style="font-size:13pt;line-height:1.3;margin-bottom:5mm">' +
//         'We wish you the very best in your future endeavors.' +
//       '</p>' +

//       '<div style="margin-top:4mm">' +
//         '<p style="font-size:13pt;font-weight:700;margin-bottom:1mm">For: ' + CO.fullNameUpper + '</p>' +
//         '<div style="display:flex;align-items:flex-end;margin-top:3mm;position:relative;min-height:80px">' +
//           '<div style="margin-left:0mm">' +
//             stampHTML2 +
//           '</div>' +
//           '<div style="position:absolute;left:50%;transform:translateX(-50%);bottom:0">' + stampHTML + '</div>' +
//         '</div>' +
//       '</div>' +

//       '</div>' +

//       '<div class="footer">' +
//         '<a href="https://' + CO.website + '">' + CO.website + '</a>' +
//         ' &nbsp;|&nbsp; ' +
//         '<a href="mailto:' + CO.email + '">' + CO.email + '</a><br>' +
//         'Address: ' + CO.address + '<br>' +
//         'GSTIN: ' + CO.gstin + ' &nbsp;|&nbsp; TAN: ' + CO.tan +
//       '</div>' +

//     '</div>' +

//     '<div id="save-bar">' +
//       '<div>' +
//         '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Resignation Acceptance Letter तयार आहे! — ' + CO.fullName + '</div>' +
//         '<div style="color:#64748b;font-size:12px">👇 <strong style="color:#a5b4fc">Save as PDF</strong> click करा</div>' +
//       '</div>' +
//       '<div style="display:flex;gap:10px">' +
//         '<button onclick="document.getElementById(\'save-bar\').style.display=\'none\';window.print();" style="background:linear-gradient(135deg,' + CO.themeColor + ',#42a5f5);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>' +
//         '<button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>' +
//       '</div>' +
//     '</div>' +

//     '</body></html>'

//   return html
// }

// export function openResignationAcceptancePDF(form) {
//   const html = buildResignationAcceptanceHTML(form)
//   const pw = window.open('', '_blank')
//   pw.document.write(html)
//   pw.document.close()
// }

// export function useResignationAcceptancePDF(form) {
//   const exportPDF = useCallback(() => {
//     openResignationAcceptancePDF(form)
//   }, [form])

//   return { exportPDF }
// }

// export default function ResignationAcceptancePDFViewer({ form, label = '⬇️ Generate Resignation Acceptance (PDF)', className = '' }) {
//   const { exportPDF } = useResignationAcceptancePDF(form)

//   return (
//     <button
//       onClick={exportPDF}
//       className={className || "w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg"}
//     >
//       {label}
//     </button>
//   )
// }

import { useCallback } from 'react'
import bgImage     from '../assets/UAS_backGround.jpeg'
import stampimage  from '../assets/uas_stamp.png'
import stampimage1 from '../assets/uas_stamp1.png'

const CO = {
  fullName:      'UAS IT Consultancy Services Pvt. Ltd.',
  fullNameUpper: 'UAS IT CONSULTANCY SERVICES PVT. LTD.',
  website:       'www.uasit.in',
  email:         'hr@uasit.in',
  address:       'Your UASIT Office Address Here',
  gstin:         'YOUR_GSTIN_HERE',
  tan:           'YOUR_TAN_HERE',
  themeColor:    '#1565c0',
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

function buildResignationAcceptanceHTML(form) {

  // ✅ Fixed: bgImage वापरतो (OfferLetterTemplate नाही)
  const bgStyle =
    "background-image:url('" + bgImage + "');" +
    "background-size:100% 100%;" +
    "background-repeat:no-repeat;" +
    "background-position:center center;"

  const stampHTML = stampimage
    ? '<img src="' + stampimage + '" style="height:70px;object-fit:contain" alt="Stamp" />'
    : '<div style="width:70px;height:70px;border:2px solid ' + CO.themeColor + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:' + CO.themeColor + ';text-align:center">UASIT<br>PUNE</div>'

  const stampHTML2 = stampimage1
    ? '<img src="' + stampimage1 + '" style="height:70px;object-fit:contain" alt="Stamp" />'
    : ''

  const resignFmt = form.resignationDate
    ? new Date(form.resignationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
    : '[Resignation Date]'

  const lastDayFmt = form.lastWorkingDate
    ? new Date(form.lastWorkingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).replace(/ /g, '-')
    : '[Last Working Date]'

  const html =
    '<!DOCTYPE html><html><head>' +
    '<meta charset="UTF-8">' +
    '<title>Resignation Acceptance Letter — ' + (form.empName || 'Employee') + '</title>' +
    '<style>' +
      '*{box-sizing:border-box;margin:0;padding:0}' +
      'body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;background:#f5f5f5}' +
      '@page{size:210mm 297mm;margin:0}' +
      '@media print{' +
        'html,body{width:210mm;height:297mm;margin:0;overflow:hidden;background:white}' +
        '#save-bar{display:none!important}' +
        '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
      '}' +
      '.page{' +
        'width:210mm;height:297mm;' +
        'margin:0 auto;' +
        'padding:38mm 18mm 20mm;' +
        'position:relative;' +
        'overflow:hidden;' +
        bgStyle +
        '-webkit-print-color-adjust:exact;print-color-adjust:exact' +
      '}' +
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

      '<div style="text-align:right;font-size:11pt;font-weight:600;margin-bottom:7mm;padding-top:10mm;padding-right:12mm;color:#1a1a1a">' +
        ordinalDate(form.letterDate) +
      '</div>' +

      '<div style="text-align:center;font-size:20pt;font-weight:700;text-decoration:underline;margin-bottom:7mm;letter-spacing:.02em">' +
        'Resignation Acceptance Letter' +
      '</div>' +

      '<div style="margin-top:5mm">' +

      '<div style="margin-bottom:5mm">' +
        '<p style="font-size:13pt;font-weight:700;line-height:1.3">Dear ' + (form.empName || '[Employee Name]') + ',</p>' +
        '<p style="font-size:13pt;font-weight:700;line-height:1.3">Emp Id: ' + (form.empId || '[Emp ID]') +
          (form.designation ? ' &nbsp;|&nbsp; Designation: ' + form.designation : '') +
        '</p>' +
      '</div>' +

      '<p style="font-size:13pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
        'This is to acknowledge the receipt of your resignation email dated <strong>' + resignFmt + '</strong>. ' +
        'We are writing to confirm that your resignation has been duly accepted, and your last working day with ' +
        '<strong>' + CO.fullName + '</strong> will be <strong>' + lastDayFmt + '</strong>.' +
      '</p>' +

      '<p style="font-size:13pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
        'During your tenure with us, you have contributed significantly to the company, and your efforts have ' +
        'been greatly appreciated. We would like to take this opportunity to thank you for your dedication and ' +
        'hard work.' +
      '</p>' +

      '<p style="font-size:13pt;line-height:1.3;margin-bottom:3mm;text-align:justify">' +
        'We kindly request you to ensure a smooth transition by completing the following before your last ' +
        'working day.' +
      '</p>' +

      '<ol style="font-size:13pt;line-height:1.6;margin-left:6mm;margin-bottom:4mm">' +
        '<li style="margin-bottom:2mm">Complete the handover of all pending work and responsibilities to your reporting manager.</li>' +
        '<li style="margin-bottom:2mm">Return all company assets, including laptop, ID card, and any other property issued to you.</li>' +
        '<li style="margin-bottom:2mm">Settle any outstanding dues or financial obligations, if applicable.<br>' +
          '<span style="display:block;text-align:justify;padding-left:2mm;margin-top:2mm">' +
            'Upon successful completion of the above formalities, your relieving letter and full and final ' +
            'settlement will be processed as per company norms.' +
          '</span>' +
        '</li>' +
      '</ol>' +

      '<p style="font-size:13pt;line-height:1.3;margin-bottom:5mm">' +
        'We wish you the very best in your future endeavors.' +
      '</p>' +

      '<div style="margin-top:4mm">' +
        '<p style="font-size:13pt;font-weight:700;margin-bottom:1mm">For: ' + CO.fullNameUpper + '</p>' +
        '<div style="display:flex;align-items:flex-end;margin-top:3mm;position:relative;min-height:80px">' +
          '<div style="margin-left:0mm">' +
            stampHTML2 +
          '</div>' +
          '<div style="position:absolute;left:50%;transform:translateX(-50%);bottom:0">' + stampHTML + '</div>' +
        '</div>' +
      '</div>' +

      '</div>' +

      '<div class="footer">' +
        '<a href="https://' + CO.website + '">' + CO.website + '</a>' +
        ' &nbsp;|&nbsp; ' +
        '<a href="mailto:' + CO.email + '">' + CO.email + '</a><br>' +
        'Address: ' + CO.address + '<br>' +
        'GSTIN: ' + CO.gstin + ' &nbsp;|&nbsp; TAN: ' + CO.tan +
      '</div>' +

    '</div>' +

    '<div id="save-bar">' +
      '<div>' +
        '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Resignation Acceptance Letter तयार आहे! — ' + CO.fullName + '</div>' +
        '<div style="color:#64748b;font-size:12px">👇 <strong style="color:#a5b4fc">Save as PDF</strong> click करा</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px">' +
        '<button onclick="document.getElementById(\'save-bar\').style.display=\'none\';window.print();" style="background:linear-gradient(135deg,' + CO.themeColor + ',#42a5f5);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>' +
        '<button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>' +
      '</div>' +
    '</div>' +

    '</body></html>'

  return html
}

export function openResignationAcceptancePDF(form) {
  const html = buildResignationAcceptanceHTML(form)
  const pw = window.open('', '_blank')
  pw.document.write(html)
  pw.document.close()
}

export function useResignationAcceptancePDF(form) {
  const exportPDF = useCallback(() => {
    openResignationAcceptancePDF(form)
  }, [form])

  return { exportPDF }
}

export default function ResignationAcceptancePDFViewer({ form, label = '⬇️ Generate Resignation Acceptance (PDF)', className = '' }) {
  const { exportPDF } = useResignationAcceptancePDF(form)

  return (
    <button
      onClick={exportPDF}
      className={className || "w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg"}
    >
      {label}
    </button>
  )
}