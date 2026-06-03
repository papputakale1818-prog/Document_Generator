
import { useState, useCallback } from 'react'

import { useAuth } from '../context/AuthContext'
import bgImage from '../assets/new_design.jpg'
import stampimage from '../assets/stamp.jpg'

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
function fmtNum(n) { if(!n||isNaN(n)) return "0"; return Math.round(n).toLocaleString("en-IN") }
function ordinalDate(d) {
  if(!d) return "—"
  const dt = new Date(d)
  const day = dt.getDate()
  const suffix = ["th","st","nd","rd"][((day%100-20)%10<=3&&(day%100-20)%10>0)?(day%100-20)%10:(day%100<=3&&day%100>0)?day%100:0] || "th"
  return day + suffix + " " + dt.toLocaleDateString("en-IN",{month:"long",year:"numeric"})
}

function calcSalary(annual) {
  const a = parseFloat(annual) || 0
  const monthly    = Math.round(a / 12)
  const basic      = Math.round(monthly * 0.40)
  const da         = Math.round(basic * 0.50)
  const hra        = Math.round(basic * 0.40)
  const conv       = monthly > 0 ? 1600 : 0
  const med        = monthly > 0 ? 1250 : 0
  const special    = monthly - basic - da - hra - conv - med
  const pf         = Math.round((basic + da) * 0.12)
  const ctcMonthly = monthly + Math.round((basic + da) * 0.13)
  return {
    basic:   basic * 12,
    da:      da * 12,
    hra:     hra * 12,
    conv:    conv * 12,
    med:     med * 12,
    special: special * 12,
    pf:      pf * 12,
    gross:   a,
    ctc:     ctcMonthly * 12,
  }
}

const ROWS = [
  { label: 'Basic Salary (40% of Gross)',         key: 'basic'   },
  { label: 'Dearness Allowance (50% of Basic)',    key: 'da'      },
  { label: 'House Rent Allowance (40% of Basic)',  key: 'hra'     },
  { label: 'Conveyance Allowance (Fixed)',         key: 'conv'    },
  { label: 'Medical Allowance (Fixed)',            key: 'med'     },
  { label: 'Special Allowance (Balance)',          key: 'special' },
  { label: 'PF Contribution (12% of Basic+DA)',    key: 'pf'      },
]

export default function SalaryAppraisalPage_SoftGrid() {
  const { selectedCompany } = useAuth()

  const [form, setForm] = useState({
    empName: '', empId: '', designation: '', letterDate: '', effectiveDate: '',
    curAnnual: '', newAnnual: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const cur = calcSalary(form.curAnnual)
  const nw  = calcSalary(form.newAnnual)

  const exportPDF = useCallback(() => {
    const bgStyle =
      "background-image:url('" + bgImage + "');" +
      "background-size:cover;" +
      "background-repeat:no-repeat;" +
      "background-position:center top;"

    // ── Table rows — plain font, no monospace ──────────────────────────────
    const cellBase = "padding:7px 12px;border:1px solid #d0d0d0;font-size:12px;font-family:'Segoe UI',Arial,sans-serif;vertical-align:middle;"

    const rowsHTML = ROWS.map(r =>
      '<tr>' +
        '<td style="' + cellBase + 'color:#333;width:44%">' + r.label + '</td>' +
        '<td style="' + cellBase + 'text-align:right;color:#333">' + fmtNum(cur[r.key]) + '</td>' +
        '<td style="' + cellBase + 'text-align:right;color:#1b5e20;font-weight:600">' + fmtNum(nw[r.key]) + '</td>' +
      '</tr>'
    ).join('')

    const stampHTML = stampimage
      ? '<img src="' + stampimage + '" style="height:70px;object-fit:contain" alt="Stamp" />'
      : '<div style="width:70px;height:70px;border:2px solid ' + CO.themeColor + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:' + CO.themeColor + ';text-align:center">SOFTGRID<br>PUNE</div>'

    const html =
      '<!DOCTYPE html><html><head>' +
      '<meta charset="UTF-8">' +
      '<title>Salary Appraisal — ' + (form.empName || 'Employee') + '</title>' +
      '<style>' +
        // ── Reset + global ─────────────────────────────────────────────────
        '*{box-sizing:border-box;margin:0;padding:0}' +
        "body{font-family:'Segoe UI',Arial,sans-serif;font-size:12.5px;color:#1a1a1a}" +

        // ── A4 page ────────────────────────────────────────────────────────
        // @page removes browser header/footer; size:A4 enforces exact sheet
        '@page{size:210mm 297mm;margin:0}' +
        '@media print{' +
          'html,body{width:210mm;height:297mm;margin:0;overflow:hidden}' +
          '#save-bar{display:none!important}' +
          '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
        '}' +

        // ── Page container — exactly A4 ────────────────────────────────────
        // 210mm wide, 297mm tall, padding 14mm top/bottom, 18mm sides
        // position:relative so footer can be absolute at bottom
        '.page{' +
          'width:210mm;height:297mm;' +
          'margin:0 auto;' +
          'padding:14mm 18mm 20mm;' +
          'position:relative;' +
          'overflow:hidden;' +           // nothing bleeds outside A4
          bgStyle +
          '-webkit-print-color-adjust:exact;print-color-adjust:exact' +
        '}' +

        // ── Table global reset — no monospace ──────────────────────────────
        "table{border-collapse:collapse;width:100%}" +
        "td,th{font-family:'Segoe UI',Arial,sans-serif;font-size:12px}" +

        // ── Sticky footer inside page ──────────────────────────────────────
        '.footer{' +
          'position:absolute;bottom:8mm;left:18mm;right:18mm;' +
          'border-top:1.5px solid #ccc;padding-top:3mm;' +
          'text-align:center;font-size:10px;color:#444;' +
          "font-family:'Segoe UI',Arial,sans-serif" +
        '}' +
        '.footer a{color:' + CO.themeColor + ';text-decoration:none}' +
      '</style></head><body>' +

      '<div class="page">' +

        // Date — right aligned
        '<div style="text-align:right;font-size:12px;font-weight:600;margin-bottom:7mm;color:#1a1a1a">' +
          ordinalDate(form.letterDate || form.effectiveDate) +
        '</div>' +

        // Title
        '<div style="text-align:center;font-size:16px;font-weight:700;text-decoration:underline;margin-bottom:7mm;letter-spacing:.02em">' +
          'Salary Appraisal' +
        '</div>' +

        // Employee name + ID
        '<div style="margin-bottom:5mm">' +
          '<p style="font-size:12.5px;font-weight:700;line-height:1.7">' + (form.empName || '[Employee Name]') + '</p>' +
          '<p style="font-size:12.5px;font-weight:700;line-height:1.7">Emp Id: ' + (form.empId || '[Emp ID]') + '</p>' +
        '</div>' +

        // Body paragraphs
        '<p style="font-size:12px;line-height:1.8;margin-bottom:4mm;text-align:justify">' +
          'We are pleased to inform you that, following a thorough review of your performance and contributions to ' +
          '<strong>' + CO.fullNameUpper + '</strong>, we have decided to adjust your salary effective ' +
          '<strong>' + ordinalDate(form.effectiveDate) + '</strong>. This adjustment reflects our appreciation for your hard work.' +
        '</p>' +
        '<p style="font-size:12px;line-height:1.8;margin-bottom:4mm">' +
          'Your current salary and CTC is revised as below.' +
        '</p>' +

        // ── Salary Table ───────────────────────────────────────────────────
        '<table style="margin:4mm 0">' +
          '<thead>' +
            // Row 1 — employee name span
            '<tr>' +
              '<th style="background:#f5f5f5;font-size:12px;padding:8px 12px;border:1px solid #ccc;text-align:left;font-weight:700">' +
                'Name<br><span style="font-weight:400;font-size:11px;color:#555">Designation</span>' +
              '</th>' +
              '<th colspan="2" style="background:#f5f5f5;font-size:12px;padding:8px 12px;border:1px solid #ccc;text-align:center;font-weight:700">' +
                (form.empName || '[Employee Name]') + '<br>' +
                '<span style="font-weight:700;font-size:12px">' + (form.designation || '[Designation]') + '</span>' +
              '</th>' +
            '</tr>' +
            // Row 2 — column headers
            '<tr>' +
              '<th style="background:#f0f0f0;font-size:12px;padding:8px 12px;border:1px solid #ccc;text-align:left;font-weight:700">Salary Components</th>' +
              '<th style="background:#f0f0f0;font-size:12px;padding:8px 12px;border:1px solid #ccc;text-align:right;font-weight:700">Current Salary (INR)</th>' +
              '<th style="background:#f0f0f0;font-size:12px;padding:8px 12px;border:1px solid #ccc;text-align:right;font-weight:700;color:' + CO.themeColor + '">New Salary (INR)</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + rowsHTML + '</tbody>' +
          '<tfoot>' +
            // Total Gross row
            '<tr>' +
              '<td style="background:#e8f5e9;font-weight:700;font-size:12.5px;color:#1b5e20;padding:8px 12px;border:1px solid #ccc">Total Gross</td>' +
              '<td style="background:#e8f5e9;font-weight:700;font-size:12.5px;color:#1b5e20;padding:8px 12px;border:1px solid #ccc;text-align:right">' + fmtNum(cur.gross) + '</td>' +
              '<td style="background:#e8f5e9;font-weight:700;font-size:12.5px;color:#1b5e20;padding:8px 12px;border:1px solid #ccc;text-align:right">' + fmtNum(nw.gross) + '</td>' +
            '</tr>' +
            // CTC row
            '<tr>' +
              '<td style="background:#c8e6c9;font-weight:700;font-size:12.5px;color:#1b5e20;padding:8px 12px;border:1px solid #ccc">CTC (Annual)</td>' +
              '<td style="background:#c8e6c9;font-weight:700;font-size:12.5px;color:#1b5e20;padding:8px 12px;border:1px solid #ccc;text-align:right">' + fmtNum(cur.ctc) + '</td>' +
              '<td style="background:#c8e6c9;font-weight:700;font-size:12.5px;color:#1b5e20;padding:8px 12px;border:1px solid #ccc;text-align:right">' + fmtNum(nw.ctc) + '</td>' +
            '</tr>' +
          '</tfoot>' +
        '</table>' +

        // Closing lines
        '<p style="font-size:12px;margin:3mm 0">All other terms and conditions remain unchanged.</p>' +
        '<p style="font-size:12px;margin-bottom:5mm">Looking forward to your continued excellence.</p>' +

        // Signature block
        '<div style="margin-top:4mm">' +
          '<p style="font-size:12px;font-weight:700;margin-bottom:1mm">For: ' + CO.fullNameUpper + '</p>' +
          '<div style="display:flex;align-items:flex-end;gap:10mm;margin-top:3mm">' +
            '<div>' + stampHTML + '</div>' +
            '<div>' +
              '<div style="margin-bottom:2mm;border-top:1.5px solid #333;width:120px"></div>' +
              '<div style="font-size:11px;color:#333;margin-top:1mm;font-family:\'Segoe UI\',Arial,sans-serif">' +
                'Authorised Signatory<br><strong>DIRECTOR</strong>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // Footer — absolutely positioned at bottom of A4 page
        '<div class="footer">' +
          '<a href="https://' + CO.website + '">' + CO.website + '</a>' +
          ' &nbsp;|&nbsp; ' +
          '<a href="mailto:' + CO.email + '">' + CO.email + '</a><br>' +
          'Address: ' + CO.address + '<br>' +
          'GSTIN: ' + CO.gstin + ' &nbsp;|&nbsp; TAN: ' + CO.tan +
        '</div>' +

      '</div>' + // .page end

      // ── Save bar (hidden on print) ─────────────────────────────────────
      '<div id="save-bar" style="position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#1e293b,#0f172a);border-top:2px solid ' + CO.themeColor + ';padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999">' +
        '<div>' +
          '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Salary Appraisal तयार आहे! — ' + CO.fullName + '</div>' +
          '<div style="color:#64748b;font-size:12px">👇 <strong style="color:#a5b4fc">Save as PDF</strong> click करा</div>' +
        '</div>' +
        '<div style="display:flex;gap:10px">' +
          '<button onclick="document.getElementById(\'save-bar\').style.display=\'none\';window.print();" style="background:linear-gradient(135deg,' + CO.themeColor + ',#4ade80);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>' +
          '<button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>' +
        '</div>' +
      '</div>' +

      '</body></html>'

    const pw = window.open('', '_blank')
    pw.document.write(html)
    pw.document.close()
  }, [form, cur, nw])

  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-green-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">
      
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Salary Appraisal</h1>
        <p className="text-gray-500 text-sm mb-8">{CO.fullName}</p>
        <div className="max-w-3xl space-y-6">

          {/* ── Employee Info ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-indigo-400 mb-5">👤 Employee Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Employee Name</label><input name="empName" value={form.empName} onChange={handleChange} placeholder="e.g. Rajendra Takale" className={inp} /></div>
                <div><label className={lbl}>Employee ID</label><input name="empId" value={form.empId} onChange={handleChange} placeholder="e.g. EMP018" className={inp} /></div>
              </div>
              <div>
                <label className={lbl}>Designation</label>
                <input name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Software Developer" className={inp} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Letter Date</label>
                  <input type="date" name="letterDate" value={form.letterDate} onChange={handleChange} className={inp + " [color-scheme:dark]"} />
                </div>
                <div>
                  <label className={lbl}>Effective Date</label>
                  <input type="date" name="effectiveDate" value={form.effectiveDate} onChange={handleChange} className={inp + " [color-scheme:dark]"} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Salary Inputs ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-amber-400 mb-5">₹ Salary Details (Annual Gross)</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={lbl}>Current Annual Gross (₹)</label>
                <input type="number" name="curAnnual" value={form.curAnnual} onChange={handleChange} placeholder="e.g. 360000" className={inp + " text-white font-bold"} />
                {cur.gross > 0 && <p className="text-xs text-gray-500 mt-1">Monthly: ₹ {fmtNum(Math.round(cur.gross/12))}</p>}
              </div>
              <div>
                <label className="text-sm text-green-400">New Annual Gross (₹)</label>
                <input type="number" name="newAnnual" value={form.newAnnual} onChange={handleChange} placeholder="e.g. 420000" className={inp + " text-green-400 font-bold"} />
                {nw.gross > 0 && <p className="text-xs text-green-600 mt-1">Monthly: ₹ {fmtNum(Math.round(nw.gross/12))}</p>}
              </div>
            </div>

            {/* CTC Summary Cards */}
            {(cur.gross > 0 || nw.gross > 0) && (
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current CTC</div>
                  <div className="text-white font-bold text-lg">₹ {fmtNum(cur.ctc)}</div>
                  <div className="text-gray-400 text-xs mt-1">{toWords(cur.ctc)} Rupees</div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-4 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">New CTC</div>
                  <div className="text-emerald-400 font-bold text-lg">₹ {fmtNum(nw.ctc)}</div>
                  <div className="text-emerald-300 text-xs mt-1">{toWords(nw.ctc)} Rupees</div>
                </div>
              </div>
            )}

            {/* Preview Table */}
            {(cur.gross > 0 || nw.gross > 0) && (
              <div className="rounded-xl overflow-hidden border border-white/10 mt-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-600/50 to-emerald-500/30">
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white text-left">Component</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white text-right">Current (INR)</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-green-300 text-right">New (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((r, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-2 text-gray-300 text-sm">{r.label}</td>
                        <td className="px-4 py-2 text-right text-xs text-gray-300">{fmtNum(cur[r.key])}</td>
                        <td className="px-4 py-2 text-right text-xs text-green-400">{fmtNum(nw[r.key])}</td>
                      </tr>
                    ))}
                    <tr className="bg-white/5 border-t border-white/10">
                      <td className="px-4 py-2 text-white font-bold text-sm">Total Gross</td>
                      <td className="px-4 py-2 text-right text-sm text-white font-bold">{fmtNum(cur.gross)}</td>
                      <td className="px-4 py-2 text-right text-sm text-green-300 font-bold">{fmtNum(nw.gross)}</td>
                    </tr>
                    <tr className="bg-emerald-500/15 border-t border-emerald-500/30">
                      <td className="px-4 py-2 text-emerald-300 font-bold text-sm">CTC (Annual)</td>
                      <td className="px-4 py-2 text-right text-sm text-white font-bold">{fmtNum(cur.ctc)}</td>
                      <td className="px-4 py-2 text-right text-sm text-emerald-300 font-bold">{fmtNum(nw.ctc)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Generate Button ── */}
          <button
            onClick={exportPDF}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg"
          >
            ⬇️ Generate Salary Appraisal (PDF)
          </button>
          <p className="text-center text-gray-600 text-xs pb-8">Print dialog मध्ये "Save as PDF" निवडा</p>

        </div>
      </main>
    </div>
  )
}