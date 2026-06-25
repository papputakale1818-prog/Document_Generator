// import { useCallback } from 'react'
// import bgImage    from '../assets/UAS_backGround.jpeg'
// import stampimage  from '../assets/uas_stamp.png'
// import stampimage1 from '../assets/uas_stamp1.png'

// // ─── Company Config ───────────────────────────────────────────────────────────
// const CO = {
//   fullName:      'UAS IT Consultancy Services Pvt. Ltd.',
//   fullNameUpper: 'UAS IT CONSULTANCY SERVICES PVT. LTD.',
//   shortName:     'UAS IT CONSULTANCY SERVICES',
//   website:       'www.uasit.org',
//   email:         'hr@uasit.org',
//   address:       'Office No:204, Khandagale Complex, Near EON Hospital, Kharadi Bypass, Pune 411014.',
//   gstin:         '27ABJCS4985R1Z4',
//   tan:           'PNES82511C',
//   color:         '#1a3c6e',
//   letterPrefix:  'UAS IT SERV/RELVLTR/26',
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function ordinalDate(d) {
//   if (!d) return '—'
//   const dt     = new Date(d)
//   const day    = dt.getDate()
//   const suffix = ['th','st','nd','rd'][
//     ((day%100-20)%10<=3 && (day%100-20)%10>0) ? (day%100-20)%10 :
//     (day%100<=3 && day%100>0) ? day%100 : 0
//   ] || 'th'
//   return day + '<sup>' + suffix + '</sup> ' + dt.toLocaleDateString('en-IN', { month:'long', year:'numeric' })
// }

// function fmtDateShort(d) {
//   if (!d) return '—'
//   const dt = new Date(d)
//   return dt.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
// }

// // ─── Build HTML ───────────────────────────────────────────────────────────────
// function buildRelievingHTML(form) {
//   // letterDate form मधून येईल; नसेल तर today use होईल
//   const letterDate = form.letterDate || new Date().toISOString().split('T')[0]

//   return (
//     '<!DOCTYPE html><html><head>' +
//     '<meta charset="UTF-8">' +
//     '<title>Relieving Letter — ' + (form.empName || 'Employee') + ' — ' + CO.fullName + '</title>' +
//     '<style>' +
//       '*{box-sizing:border-box;margin:0;padding:0}' +
//       'body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;background:#e8edf2;display:flex;justify-content:center;padding:30px 0 80px}' +

//       /* ── A4 exact print ── */
//       '@page{size:210mm 297mm;margin:0}' +
//       '@media print{' +
//         'html,body{width:210mm;height:297mm;margin:0;padding:0;background:white;display:block}' +
//         '.page{' +
//           'box-shadow:none!important;' +
//           'width:210mm!important;' +
//           'height:297mm!important;' +
//           'min-height:unset!important;' +
//           'max-height:297mm!important;' +
//           'overflow:hidden!important;' +
//           'page-break-after:avoid;' +
//         '}' +
//         '#save-bar{display:none!important}' +
//         '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
//       '}' +

//       '.page{' +
//         'width:210mm;height:297mm;' +   /* fixed height — ekdum A4 */
//         'background:#fff;' +
//         'position:relative;' +
//         'overflow:hidden;' +
//         'box-shadow:0 4px 32px rgba(0,0,0,0.18);' +
//       '}' +
//       '.bg-img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:top;z-index:0}' +

//       /* ── content area: top padding = letterhead image height ── */
//       '.content{position:relative;z-index:1;padding:52mm 16mm 28mm 16mm;display:flex;flex-direction:column}' +

//       '.footer{' +
//         'position:absolute;bottom:0;left:0;right:0;' +
//         'border-top:1px solid #ccc;' +
//         'padding:5px 16mm 6px;' +
//         'text-align:center;font-size:8.5pt;color:#1a1a1a;' +
//         'font-family:Calibri,Arial,sans-serif;' +
//         'background:transparent' +
//       '}' +
//       '.footer a{color:' + CO.color + ';text-decoration:none}' +

//       '#save-bar{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#0d1f3c,' + CO.color + ');border-top:2px solid #4a90d9;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:"Segoe UI",sans-serif}' +
//     '</style></head><body>' +

//     '<div class="page">' +

//       /* ── Background letterhead ── */
//       '<img class="bg-img" src="' + bgImage + '" alt="" />' +

//       '<div class="content">' +

//         /* ── ROW 1: Ref No (left) + Date (right) ── */
//         '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4mm">' +
//           '<div style="font-size:11pt;font-weight:700;color:#1a1a1a">' + CO.letterPrefix + '</div>' +
//           '<div style="font-size:11pt;font-weight:700;color:#1a1a1a">' + ordinalDate(letterDate) + '</div>' +
//         '</div>' +

//         /* ── ROW 2: Employee Name + Emp ID ── */
//         '<div style="margin-bottom:4mm">' +
//           '<p style="font-size:11pt;font-weight:700;line-height:1.6;color:#1a1a1a">' + (form.empName || '[Employee Name]') + '</p>' +
//           '<p style="font-size:11pt;font-weight:700;line-height:1.6;color:#1a1a1a">Emp Id.: ' + (form.empId || '[Emp ID]') + '</p>' +
//         '</div>' +

//         /* ── ROW 3: Title "Relieving Letter" ── */
//         '<div style="text-align:center;font-size:15pt;font-weight:700;text-decoration:underline;margin-bottom:5mm;letter-spacing:0.02em;color:#1a1a1a">' +
//           'Relieving Letter' +
//         '</div>' +

//         /* ── ROW 4 onwards: सगळा content "Relieving Letter" च्या खाली ── */

//         /* Para 1 */
//         '<p style="font-size:11pt;line-height:1.7;margin-bottom:4mm;text-align:justify;color:#1a1a1a">' +
//           'This is to inform you that you have been relieved from your duties at <strong>' + CO.fullName + '</strong>' +
//           ' with effect from <strong>' + fmtDateShort(form.relievingDate) + '</strong>.' +
//         '</p>' +

//         /* Para 2 */
//         '<p style="font-size:11pt;line-height:1.7;margin-bottom:5mm;text-align:justify;color:#1a1a1a">' +
//           'During your tenure with us as a <strong>' + (form.designation || '[Designation]') + '</strong>,' +
//           ' we found you sincere and dedicated towards your work.' +
//           ' We appreciate your efforts and wish you all the best for your future career.' +
//         '</p>' +

//         /* Para 3 */
//         '<p style="font-size:11pt;line-height:1.7;margin-bottom:10mm;text-align:justify;color:#1a1a1a">' +
//           'We are confident that he will bring the same level of dedication, expertise, and enthusiasm to any future' +
//           ' endeavors they pursue. We express our gratitude for their contributions and wish them continued success in' +
//           ' their career endeavors.' +
//         '</p>' +

//         /* ── Signature block ── */
//         '<div style="display:flex;align-items:center;gap:10mm;margin-left:10mm">' +
//           '<img src="' + stampimage + '" style="height:90px;object-fit:contain" alt="UASIT Stamp" />' +
//           '<div>' +
//             '<p style="font-size:12pt;font-weight:700;color:' + CO.color + ';letter-spacing:0.04em;margin-bottom:6mm">' + CO.shortName + '</p>' +
//             '<img src="' + stampimage1 + '" style="height:45px;object-fit:contain;display:block" alt="Signature" />' +
//           '</div>' +
//         '</div>' +

//       '</div>' + /* .content */

//       /* ── Footer ── */
//       '<div class="footer">' +
//         'Office Address: ' + CO.address +
//         ' &nbsp; Website: <a href="https://' + CO.website + '">' + CO.website + '</a>' +
//         ' &nbsp; Email: <a href="mailto:' + CO.email + '">' + CO.email + '</a>' +
//       '</div>' +

//     '</div>' + /* .page */

//     /* ── Save bar ── */
//     '<div id="save-bar">' +
//       '<div>' +
//         '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Relieving Letter तयार आहे! — ' + CO.fullName + '</div>' +
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

// // ─── Hook ─────────────────────────────────────────────────────────────────────
// // form = { empName, empId, designation, joiningDate, resignationDate, relievingDate, letterDate }
// export function useRelievingLetterPDF(form) {
//   const exportPDF = useCallback(() => {
//     const html = buildRelievingHTML(form || {})
//     const pw = window.open('', '_blank')
//     if (!pw) return
//     pw.document.write(html)
//     pw.document.close()
//   }, [form])

//   return { exportPDF }
// }

// export default useRelievingLetterPDF

import { useCallback } from 'react'
import bgImage    from '../assets/UAS_backGround.jpeg'
import stampimage  from '../assets/uas_stamp.png'
import stampimage1 from '../assets/uas_stamp1.png'

// ─── Company Config ───────────────────────────────────────────────────────────
const CO = {
  fullName:      'UAS IT Consultancy Services Pvt. Ltd.',
  fullNameUpper: 'UAS IT CONSULTANCY SERVICES PVT. LTD.',
  shortName:     'UAS IT CONSULTANCY SERVICES',
  website:       'www.uasit.org',
  email:         'hr@uasit.org',
  address:       'Office No:204, Khandagale Complex, Near EON Hospital, Kharadi Bypass, Pune 411014.',
  gstin:         '27ABJCS4985R1Z4',
  tan:           'PNES82511C',
  color:         '#1a3c6e',
  letterPrefix:  'UAS IT SERV/RELVLTR/26',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ordinalDate(d) {
  if (!d) return '—'
  const dt     = new Date(d)
  const day    = dt.getDate()
  const suffix = ['th','st','nd','rd'][
    ((day%100-20)%10<=3 && (day%100-20)%10>0) ? (day%100-20)%10 :
    (day%100<=3 && day%100>0) ? day%100 : 0
  ] || 'th'
  return day + '<sup>' + suffix + '</sup> ' + dt.toLocaleDateString('en-IN', { month:'long', year:'numeric' })
}

function fmtDateShort(d) {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
}

// ─── Build HTML ───────────────────────────────────────────────────────────────
function buildRelievingHTML(form) {
  // letterDate form मधून येईल; नसेल तर today use होईल
  const letterDate = form.letterDate || new Date().toISOString().split('T')[0]

  return (
    '<!DOCTYPE html><html><head>' +
    '<meta charset="UTF-8">' +
    '<title>Relieving Letter — ' + (form.empName || 'Employee') + ' — ' + CO.fullName + '</title>' +
    '<style>' +
      '*{box-sizing:border-box;margin:0;padding:0}' +
      'body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;background:#e8edf2;display:flex;justify-content:center;padding:30px 0 80px}' +

      /* ── A4 exact print ── */
      '@page{size:210mm 297mm;margin:0}' +
      '@media print{' +
        'html,body{width:210mm;height:297mm;margin:0;padding:0;background:white;display:block}' +
        '.page{' +
          'box-shadow:none!important;' +
          'width:210mm!important;' +
          'height:297mm!important;' +
          'min-height:unset!important;' +
          'max-height:297mm!important;' +
          'overflow:hidden!important;' +
          'page-break-after:avoid;' +
        '}' +
        '#save-bar{display:none!important}' +
        '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
      '}' +

      '.page{' +
        'width:210mm;height:297mm;' +   /* fixed height — ekdum A4 */
        'background:#fff;' +
        'position:relative;' +
        'overflow:hidden;' +
        'box-shadow:0 4px 32px rgba(0,0,0,0.18);' +
      '}' +
      '.bg-img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:top;z-index:0}' +

      /* ── content area: top padding = letterhead + 15mm extra ── */
      '.content{position:relative;z-index:1;padding:67mm 16mm 28mm 16mm;display:flex;flex-direction:column}' +

      '.footer{' +
        'position:absolute;bottom:0;left:0;right:0;' +
        'border-top:1px solid #ccc;' +
        'padding:5px 16mm 6px;' +
        'text-align:center;font-size:8.5pt;color:#1a1a1a;' +
        'font-family:Calibri,Arial,sans-serif;' +
        'background:transparent' +
      '}' +
      '.footer a{color:' + CO.color + ';text-decoration:none}' +

      '#save-bar{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#0d1f3c,' + CO.color + ');border-top:2px solid #4a90d9;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:"Segoe UI",sans-serif}' +
    '</style></head><body>' +

    '<div class="page">' +

      /* ── Background letterhead ── */
      '<img class="bg-img" src="' + bgImage + '" alt="" />' +

      '<div class="content">' +

        /* ── ROW 1: Date (right side only) ── */
        '<div style="display:flex;justify-content:flex-end;margin-bottom:5mm">' +
          '<div style="font-size:13pt;font-weight:700;color:#1a1a1a">' + ordinalDate(letterDate) + '</div>' +
        '</div>' +

        /* ── ROW 2: Title "Relieving Letter" ── */
        '<div style="text-align:center;font-size:17pt;font-weight:700;text-decoration:underline;margin-bottom:6mm;letter-spacing:0.02em;color:#1a1a1a">' +
          'Relieving Letter' +
        '</div>' +

        /* ── ROW 3: Employee Name + Emp ID — title च्या खाली ── */
        '<div style="margin-bottom:5mm">' +
          '<p style="font-size:13pt;font-weight:700;line-height:1.6;color:#1a1a1a">' + (form.empName || '[Employee Name]') + '</p>' +
          '<p style="font-size:13pt;font-weight:700;line-height:1.6;color:#1a1a1a">Emp Id.: ' + (form.empId || '[Emp ID]') + '</p>' +
        '</div>' +

        /* ── Para 1 onwards ── */

        /* Para 1 */
        '<p style="font-size:13pt;line-height:1.7;margin-bottom:5mm;text-align:justify;color:#1a1a1a">' +
          'This is to inform you that you have been relieved from your duties at <strong>' + CO.fullName + '</strong>' +
          ' with effect from <strong>' + fmtDateShort(form.relievingDate) + '</strong>.' +
        '</p>' +

        /* Para 2 */
        '<p style="font-size:13pt;line-height:1.7;margin-bottom:6mm;text-align:justify;color:#1a1a1a">' +
          'During your tenure with us as a <strong>' + (form.designation || '[Designation]') + '</strong>,' +
          ' we found you sincere and dedicated towards your work.' +
          ' We appreciate your efforts and wish you all the best for your future career.' +
        '</p>' +

        /* Para 3 */
        '<p style="font-size:13pt;line-height:1.7;margin-bottom:12mm;text-align:justify;color:#1a1a1a">' +
          'We are confident that he will bring the same level of dedication, expertise, and enthusiasm to any future' +
          ' endeavors they pursue. We express our gratitude for their contributions and wish them continued success in' +
          ' their career endeavors.' +
        '</p>' +

        /* ── Signature block ── */
        '<div style="display:flex;align-items:center;gap:10mm;margin-left:25mm">' +
          '<img src="' + stampimage + '" style="height:90px;object-fit:contain" alt="UASIT Stamp" />' +
          '<div>' +
            '<img src="' + stampimage1 + '" style="height:45px;object-fit:contain;display:block" alt="Signature" />' +
          '</div>' +
        '</div>' +

      '</div>' + /* .content */

      /* ── Footer ── */
      '<div class="footer">' +
        'Office Address: ' + CO.address +
        ' &nbsp; Website: <a href="https://' + CO.website + '">' + CO.website + '</a>' +
        ' &nbsp; Email: <a href="mailto:' + CO.email + '">' + CO.email + '</a>' +
      '</div>' +

    '</div>' + /* .page */

    /* ── Save bar ── */
    '<div id="save-bar">' +
      '<div>' +
        '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Relieving Letter तयार आहे! — ' + CO.fullName + '</div>' +
        '<div style="color:#8ab4d4;font-size:12px">👇 <strong style="color:#a8d4f5">Save as PDF</strong> click करा</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px">' +
        '<button onclick="document.getElementById(\'save-bar\').style.display=\'none\';window.print();" style="background:linear-gradient(135deg,' + CO.color + ',#2a6bb5);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>' +
        '<button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#8ab4d4;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>' +
      '</div>' +
    '</div>' +

    '</body></html>'
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// form = { empName, empId, designation, joiningDate, resignationDate, relievingDate, letterDate }
export function useRelievingLetterPDF(form) {
  const exportPDF = useCallback(() => {
    const html = buildRelievingHTML(form || {})
    const pw = window.open('', '_blank')
    if (!pw) return
    pw.document.write(html)
    pw.document.close()
  }, [form])

  return { exportPDF }
}

export default useRelievingLetterPDF