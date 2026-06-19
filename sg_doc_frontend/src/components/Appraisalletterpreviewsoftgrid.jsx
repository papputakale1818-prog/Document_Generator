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

const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
function toWords(n) { n=Math.round(n); if(!n) return "Zero"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim() }
function fmtNum(n) { if(!n||isNaN(n)) return "0.00"; return Math.round(n).toLocaleString("en-IN") + ".00" }
function ordinalDate(d) {
  if(!d) return "—"
  const dt = new Date(d)
  const day = dt.getDate()
  const suffix = ["th","st","nd","rd"][((day%100-20)%10<=3&&(day%100-20)%10>0)?(day%100-20)%10:(day%100<=3&&day%100>0)?day%100:0] || "th"
  return day + suffix + " " + dt.toLocaleDateString("en-IN",{month:"long",year:"numeric"})
}

function calcSalary(monthly, withPF = true, pfRate = 12, pfEmrRate = 13) {
  const m = parseFloat(monthly) || 0
  const a = m * 12
  const basic      = Math.round(m * 0.40)
  const da         = Math.round(basic * 0.50)
  const hra        = Math.round(basic * 0.40)
  const conv       = m > 0 ? 1600 : 0
  const med        = m > 0 ? 1250 : 0
  const special    = m - basic - da - hra - conv - med
  const pfCapped   = withPF && m > 21000
  const pf         = withPF ? (pfCapped ? 1800 : Math.round((basic + da) * (Number(pfRate) || 0) / 100)) : 0
  const pfEmr      = withPF ? (pfCapped ? 1800 : Math.round((basic + da) * (Number(pfEmrRate) || 0) / 100)) : 0
  const ctcMonthly = m + pfEmr
  return {
    basic: basic*12, da: da*12, hra: hra*12, conv: conv*12, med: med*12,
    special: special*12, pf: pf*12, pfEmr: pfEmr*12, gross: a, ctc: ctcMonthly*12, monthly: m,
    withPF,
  }
}

const ROWS = [
  { label: 'Basic',                   key: 'basic'   },
  { label: 'DA',                      key: 'da'      },
  { label: 'HRA',                     key: 'hra'     },
  { label: 'Conveyance allowances',   key: 'conv'    },
  { label: 'Medical allowances',      key: 'med'     },
  { label: 'Special Allowances',      key: 'special' },
  { label: "Co.'s Contribution to PF", key: 'pfEmr' },
]

// ── Builds the full printable HTML for the Salary Appraisal letter ─────────
export function buildAppraisalHTML(form) {
  const nw = calcSalary(form.newMonthly, form.withPF, form.pfRate, form.pfEmrRate)

  const bgStyle =
    "background-image:url('" + OfferLetterTemplate + "');" +
    "background-size:100% 100%;" +
    "background-repeat:no-repeat;" +
    "background-position:center center;"

  const cellBase = "padding:4px 8px;border:1px solid #000;font-size:10pt;font-family:Calibri,Arial,sans-serif;vertical-align:middle;"

  const rowsHTML = ROWS.map(r => {
    const isPFRow = r.key === 'pfEmr'
    const valueText = (isPFRow && !nw.withPF) ? 'Not Applicable' : fmtNum(nw[r.key])
    return (
      '<tr>' +
        '<td style="' + cellBase + 'color:#333;width:60%">' + r.label + '</td>' +
        '<td style="' + cellBase + 'text-align:right;padding-right:18%;color:#333;width:40%">' + valueText + '</td>' +
      '</tr>'
    )
  }).join('')

  const stampHTML = stampimage
    ? '<img src="' + stampimage + '" style="height:70px;object-fit:contain" alt="Stamp" />'
    : '<div style="width:70px;height:70px;border:2px solid ' + CO.themeColor + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:' + CO.themeColor + ';text-align:center">SOFTGRID<br>PUNE</div>'

  const stampHTML2 = stampimage2
    ? '<img src="' + stampimage2 + '" style="height:70px;object-fit:contain" alt="Stamp" />'
    : ''

  return (
    '<!DOCTYPE html><html><head>' +
    '<meta charset="UTF-8">' +
    '<title>Salary Appraisal — ' + (form.empName || 'Employee') + '</title>' +
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
      "table{border-collapse:collapse;width:82%;table-layout:fixed}" +
      "td:first-child,th:first-child,td:last-child,th:last-child{width:50%}" +
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
        ordinalDate(form.letterDate || form.effectiveDate) +
      '</div>' +

      '<div style="text-align:center;font-size:18pt;font-weight:700;text-decoration:underline;margin-bottom:7mm;letter-spacing:.02em">' +
        'Salary Appraisal' +
      '</div>' +

      '<div style="margin-bottom:5mm">' +
        '<p style="font-size:11pt;font-weight:700;line-height:1.3">Dear ' + (form.empName || '[Employee Name]') + '</p>' +
        '<p style="font-size:11pt;font-weight:700;line-height:1.3">Emp Id: ' + (form.empId || '[Emp ID]') + '</p>' +
      '</div>' +

      '<p style="font-size:11pt;line-height:1.3;margin-bottom:4mm;text-align:justify">' +
        'We are pleased to inform you that, following a thorough review of your performance and contributions to ' +
        '<strong>' + CO.fullName + '</strong>, we have decided to adjust your salary effective ' +
        '<strong>' + ordinalDate(form.effectiveDate) + '</strong>. This adjustment reflects our appreciation for your hard work, dedication, and continued growth within the company.' +
      '</p>' +
      '<p style="font-size:11pt;line-height:1.3;margin-bottom:4mm">' +
        'You are being appraised and your current salary and CTC is being revised as below.' +
      '</p>' +

      '<table style="margin:4mm auto">' +
        '<thead>' +
          '<tr>' +
            '<th style="background:#fff;font-size:10pt;padding:4px 8px;border:1px solid #000;text-align:left;font-weight:700">Name</th>' +
            '<th style="background:#fff;font-size:10pt;padding:4px 8px;border:1px solid #000;text-align:left;font-weight:700">' + (form.empName || '[Employee Name]') + '</th>' +
          '</tr>' +
          '<tr>' +
            '<th style="background:#fff;font-size:10pt;padding:4px 8px;border:1px solid #000;text-align:left;font-weight:400">Designation</th>' +
            '<th style="background:#fff;font-size:10pt;padding:4px 8px;border:1px solid #000;text-align:left;font-weight:400">' + (form.designation || '[Designation]') + '</th>' +
          '</tr>' +
          '<tr>' +
            '<th style="background:#fff;font-size:10pt;padding:4px 8px;border:1px solid #000;text-align:left;font-weight:700">Salary Components</th>' +
            '<th style="background:#fff;font-size:10pt;padding:4px 8px;border:1px solid #000;text-align:left;font-weight:700">Annual (INR)</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
        '<tfoot>' +
          '<tr>' +
            '<td style="background:#fff;font-weight:700;font-size:10pt;color:#1a1a1a;padding:4px 8px;border:1px solid #000">Cost to Company (CTC)</td>' +
            '<td style="background:#fff;font-weight:700;font-size:10pt;color:#1a1a1a;padding:4px 8px;border:1px solid #000;text-align:right;padding-right:18%">' + fmtNum(nw.ctc) + '</td>' +
          '</tr>' +
        '</tfoot>' +
      '</table>' +

      '<p style="font-size:11pt;margin:3mm 0;text-align:justify">All the other terms and conditions of your employment remain unchanged as per the latest policies of the company.</p>' +
      '<p style="font-size:11pt;margin-bottom:5mm">Looking forward to your continued support, excellence and collaboration with us.</p>' +

      '<div style="margin-top:4mm">' +
        '<p style="font-size:11pt;font-weight:700;margin-bottom:1mm">For: ' + CO.fullNameUpper + '</p>' +
        '<div style="display:flex;align-items:flex-end;margin-top:3mm;position:relative;min-height:80px">' +
          '<div style="margin-left:0mm">' +
            stampHTML2 +
          '</div>' +
          '<div style="position:absolute;left:50%;transform:translateX(-50%);bottom:0">' + stampHTML + '</div>' +
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
        '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Salary Appraisal is Ready here ! — ' + CO.fullName + '</div>' +
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

// ── openAppraisalPDF — standalone function, same pattern as openPaySlipPDF ──
// form = { empName, empId, designation, letterDate, effectiveDate, newMonthly }
export function openAppraisalPDF(form) {
  const html = buildAppraisalHTML(form || {})
  const pw = window.open('', '_blank')
  pw.document.write(html)
  pw.document.close()
}

export default openAppraisalPDF