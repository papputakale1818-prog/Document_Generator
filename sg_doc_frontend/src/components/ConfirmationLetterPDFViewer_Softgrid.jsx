import OfferLetterTemplate from '../assets/OfferLetterTemplate.png'
import stampimage from '../assets/stamp.jpg'
import stampimage2 from '../assets/stamp2.jpg'

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
  if(!d) return "—"
  const dt = new Date(d)
  const day = dt.getDate()
  const suffix = ["th","st","nd","rd"][((day%100-20)%10<=3&&(day%100-20)%10>0)?(day%100-20)%10:(day%100<=3&&day%100>0)?day%100:0] || "th"
  return day + suffix + " " + dt.toLocaleDateString("en-IN",{month:"long",year:"numeric"})
}

// ── Builds the full printable HTML for the Employee Confirmation Letter ───
export function buildConfirmationHTML(form) {
  const bgStyle =
    "background-image:url('" + OfferLetterTemplate + "');" +
    "background-size:100% 100%;" +
    "background-repeat:no-repeat;" +
    "background-position:center center;"

  const stampHTML = stampimage
    ? '<img src="' + stampimage + '" style="height:70px;object-fit:contain" alt="Stamp" />'
    : '<div style="width:70px;height:70px;border:2px solid ' + CO.themeColor + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:' + CO.themeColor + ';text-align:center">SOFTGRID<br>PUNE</div>'

  const stampHTML2 = stampimage2
    ? '<img src="' + stampimage2 + '" style="height:70px;object-fit:contain" alt="Stamp" />'
    : ''

  return (
    '<!DOCTYPE html><html><head>' +
    '<meta charset="UTF-8">' +
    '<title>Employee Confirmation Letter — ' + (form.fullName || 'Employee') + '</title>' +
    '<style>' +
      '*{box-sizing:border-box;margin:0;padding:0}' +
      "body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;background:#f5f5f5}" +
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
      "td,th{font-family:Calibri,Arial,sans-serif;font-size:11pt}" +
      '.footer{' +
        'position:absolute;bottom:8mm;left:18mm;right:18mm;' +
        'padding-top:3mm;' +
        'text-align:center;font-size:9pt;color:#444;' +
        "font-family:Calibri,Arial,sans-serif" +
      '}' +
      '.footer a{color:' + CO.themeColor + ';text-decoration:none}' +
      '#save-bar{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#1e293b,#0f172a);border-top:2px solid ' + CO.themeColor + ';padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:"Segoe UI",sans-serif}' +
    '</style></head><body>' +

    '<div class="page">' +

      '<div style="text-align:right;font-size:11pt;font-weight:600;margin-bottom:7mm;padding-top:10mm;padding-right:12mm;color:#1a1a1a">' +
        ordinalDate(form.letterDate || form.joiningDate) +
      '</div>' +

      '<div style="text-align:center;font-size:18pt;font-weight:700;text-decoration:underline;margin-bottom:3mm;letter-spacing:.02em">' +
        'Offer Confirmation Letter' +
      '</div>' +

      '<div style="font-size:11pt;font-weight:700;margin-bottom:1mm">' +
        'Employee ID: ' + (form.empId || '[Emp ID]') +
      '</div>' +

      '<div style="margin-bottom:5mm">' +
        '<p style="font-size:11pt;font-weight:700;line-height:1.3">Dear ' + (form.fullName || '[Employee Name]') + ',</p>' +
      '</div>' +

      '<p style="font-size:11pt;line-height:1.2;margin-bottom:3mm;text-align:justify">' +
        'We are pleased to inform you that you have successfully completed your probation period with ' +
        '<strong>' + CO.fullName + '</strong>.' +
      '</p>' +

      '<p style="font-size:11pt;line-height:1.2;margin-bottom:3mm;text-align:justify">' +
        'Based on your performance, dedication, and contribution to the organization during the probation period, we are happy to confirm your employment as a permanent employee in the position of <strong>' + (form.designation || '[Designation]') + '</strong>, effective from <strong>' + ordinalDate(form.joiningDate) + '</strong>.' +
      '</p>' +

      '<p style="font-size:11pt;line-height:1.2;margin-bottom:3mm;text-align:justify">' +
        'Your commitment, professionalism, and positive attitude have been appreciated by the management and your team members. We are confident that you will continue to contribute to the growth and success of the organization.' +
      '</p>' +

      '<p style="font-size:11pt;line-height:1.2;margin-bottom:3mm;text-align:justify">' +
        'All other terms and conditions of your employment shall remain unchanged as per your appointment letter and company policies.' +
      '</p>' +

      '<p style="font-size:11pt;line-height:1.2;margin-bottom:3mm;text-align:justify">' +
        'We congratulate you on this achievement and look forward to a long and successful association with ' + CO.fullName + '.' +
      '</p>' +

      '<p style="font-size:11pt;line-height:1.2;margin-bottom:4mm;text-align:justify">' +
        'We wish you continued success in your career with us.' +
      '</p>' +

      '<div style="margin-top:4mm;margin-bottom:8mm">' +
        '<p style="font-size:11pt;margin-bottom:1mm">Best Regards,</p>' +
        '<p style="font-size:11pt;font-weight:700;margin-bottom:1mm">HR Department</p>' +
        '<p style="font-size:11pt;font-weight:700;margin-bottom:1mm">' + CO.fullName + '</p>' +
      '</div>' +

      '<div style="border-top:1px solid #999;padding-top:4mm;margin-top:4mm">' +
        '<p style="font-size:11pt;font-weight:700;margin-bottom:3mm">Acknowledgement by Employee</p>' +
        '<p style="font-size:11pt;line-height:1.2;margin-bottom:4mm;text-align:justify">' +
          'I, <strong>' + (form.fullName || '[Employee Name]') + '</strong>, acknowledge receipt of this Confirmation Letter and accept the terms mentioned herein.' +
        '</p>' +
        '<p style="font-size:11pt;margin-bottom:3mm">Employee Signature: ___________________</p>' +
        '<p style="font-size:11pt;margin-bottom:3mm">Date: ' + ordinalDate(form.letterDate) + '</p>' +
        '<div style="display:flex;align-items:flex-end;margin-top:5mm;position:relative;min-height:80px">' +
          '<div style="position:absolute;left:50%;transform:translateX(-50%);bottom:10mm">' + stampHTML + '</div>' +
          '<div style="position:absolute;right:0;bottom:10mm">' +
            stampHTML2 +
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
        '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Confirmation Letter is Ready here ! — ' + CO.fullName + '</div>' +
        '<div style="color:#64748b;font-size:12px">👇 <strong style="color:#a5b4fc">Save as PDF</strong> click Here </div>' +
      '</div>' +
      '<div style="display:flex;gap:10px">' +
        '<button onclick="document.getElementById(\'save-bar\').style.display=\'none\';window.print();" style="background:linear-gradient(135deg,' + CO.themeColor + ',#4ade80);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>' +
        '<button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>' +
      '</div>' +
    '</div>' +

    '</body></html>'
  )
}

// ── openConfirmationPDF — standalone function, same pattern as openAppraisalPDF ──
// form = { empId, fullName, designation, letterDate, joiningDate }
export function openConfirmationPDF(form) {
  const html = buildConfirmationHTML(form || {})
  const pw = window.open('', '_blank')
  pw.document.write(html)
  pw.document.close()
}

export default openConfirmationPDF