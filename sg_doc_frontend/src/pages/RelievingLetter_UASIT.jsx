
import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import bgImage from '../assets/UAS_background image_1.png'
import stampimage from '../assets/uas_stamp2.png'

// ─── Company Config (UASIT) ───────────────────────────────────────────────
const CO = {
  fullName:      'UAS IT Consultancy Services Pvt. Ltd.',
  fullNameUpper: 'UAS IT CONSULTANCY SERVICES PVT. LTD.',
  website:       'www.uasit.in',
  email:         'hr@uasit.in',
  address:       'Office No. 203, Khandagale Complex<br>Behind EON Hospital, Kharadi Bypass<br>Pune MH - 411014',
  addressInline: 'Office No. 203, Khandagale Complex, Behind EON Hospital, Kharadi Bypass, Pune MH - 411014',
  gstin:         '27ABJCS4985R1Z4',
  tan:           'PNES82511C',
  themeColor:    '#1a3c6e',
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function ordinalDate(d) {
  if (!d) return "—"
  const dt = new Date(d)
  const day = dt.getDate()
  const suffix = ["th","st","nd","rd"][((day%100-20)%10<=3&&(day%100-20)%10>0)?(day%100-20)%10:(day%100<=3&&day%100>0)?day%100:0] || "th"
  return day + suffix + " " + dt.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
}

// ─── PDF Header (UASIT style — same as AppraisalLetter_UASIT) ─────────────
function pdfHeader() {
  return `
    <div style="margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid rgba(255,255,255,0.4)">
      <div style="position:relative;height:60px;">
        <div style="position:absolute;top:-48mm;left:50%;transform:translateX(-50%);font-size:26px;font-weight:800;color:#ffffff;text-shadow:1px 1px 4px rgba(0,0,0,0.5);letter-spacing:0.04em;white-space:nowrap;">
          ${CO.fullName}
        </div>
        <div style="position:absolute;top:2mm;right:0;font-size:10.5px;color:#4a5e7a;text-align:right;line-height:1.75">
          ${CO.address}<br>GSTIN: ${CO.gstin} | TAN: ${CO.tan}
        </div>
      </div>
    </div>`
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function RelievingLetter_UASIT() {
  const { selectedCompany } = useAuth()

  const [form, setForm] = useState({
    empName:       '',
    empId:         '',
    designation:   '',
    joiningDate:   '',
    relievingDate: '',
    letterDate:    '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // ─── PDF Export ────────────────────────────────────────────────────────────
  const exportPDF = useCallback(() => {
    const bgStyle =
      "background-image:url('" + bgImage + "');" +
      "background-size:cover;" +
      "background-repeat:no-repeat;" +
      "background-position:center top;"

    // UASIT page style — same padding as AppraisalLetter_UASIT
    const pageStyle =
      "width:210mm;height:297mm;" +
      "margin:0 auto;" +
      "padding:18mm 18mm 20mm;" +
      "position:relative;" +
      "overflow:hidden;" +
      bgStyle +
      "-webkit-print-color-adjust:exact;print-color-adjust:exact"

    const stampHTML = stampimage
      ? '<img src="' + stampimage + '" style="height:70px;object-fit:contain" alt="Stamp" />'
      : '<div style="width:70px;height:70px;border:2px solid ' + CO.themeColor + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:' + CO.themeColor + ';text-align:center">UASIT<br>PUNE</div>'

    const html =
      '<!DOCTYPE html><html><head>' +
      '<meta charset="UTF-8">' +
      '<title>Relieving Letter — ' + (form.empName || 'Employee') + ' — ' + CO.fullName + '</title>' +
      '<style>' +
        '*{box-sizing:border-box;margin:0;padding:0}' +
        "body{font-family:'Segoe UI',Arial,sans-serif;font-size:12.5px;color:#0d1f3c}" +
        '@page{size:210mm 297mm;margin:0}' +
        '@media print{' +
          'html,body{width:210mm;height:297mm;margin:0;overflow:hidden}' +
          '#save-bar{display:none!important}' +
          '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
        '}' +
        '.page{' + pageStyle + '}' +
      '</style></head><body>' +

      '<div class="page">' +
        pdfHeader() +

        '<div style="margin-top:5mm">' +

          // ── Employee block + Date (side by side) ───────────────────────────
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:7mm">' +
            '<div>' +
              '<p style="font-size:13px;font-weight:700;line-height:1.7;color:#0d1f3c">' + (form.empName || '[Employee Name]') + '</p>' +
              '<p style="font-size:13px;color:#0d1f3c">Emp Id: ' + (form.empId || '[Emp ID]') + '</p>' +
            '</div>' +
            '<div style="font-size:13px;font-weight:600;color:#0d1f3c;white-space:nowrap">' +
              ordinalDate(form.letterDate) +
            '</div>' +
          '</div>' +

          // ── Title ──────────────────────────────────────────────────────────
          '<div style="text-align:center;font-size:18px;font-weight:700;text-decoration:underline;margin-bottom:8mm;letter-spacing:.04em;color:#0d1f3c">' +
            'RELIEVING LETTER' +
          '</div>' +

          // ── Body paragraphs (SoftGrid content) ────────────────────────────
          '<p style="font-size:13px;line-height:1.85;margin-bottom:5mm;text-align:justify;color:#0d1f3c">' +
            'This is to certify that, Mr./Ms. <strong>' + (form.empName || '[Employee Name]') + '</strong> has been with our organization ' +
            'from <strong>' + ordinalDate(form.joiningDate) + '</strong> to <strong>' + ordinalDate(form.relievingDate) + '</strong> on permanent basis which was executed on the ' +
            'joining day and his/her last held designation was <strong>' + (form.designation || '[Designation]') + '</strong>. He/She has been ' +
            'relieved from the services w.e.f <strong>' + ordinalDate(form.relievingDate) + '</strong>.' +
          '</p>' +

          '<p style="font-size:13px;line-height:1.85;margin-bottom:5mm;color:#0d1f3c">' +
            'We wish him/her very best for his/her future endeavors.' +
          '</p>' +

          '<p style="font-size:13px;line-height:1.85;margin-bottom:5mm;color:#0d1f3c">' +
            'We thank you for your services with <strong>' + CO.fullNameUpper + '</strong> and take this opportunity ' +
            'we wish you all the best for your future endeavors.' +
          '</p>' +

          '<p style="font-size:13px;line-height:1.85;margin-bottom:10mm;text-align:justify;color:#0d1f3c">' +
            'We would like to draw your attention to your continuing obligations towards the ' +
            'company, including that of confidentiality with respect to all proprietary and ' +
            'confidential information and data of the company and its customers that you have had ' +
            'access to during the course of your employment with the company.' +
          '</p>' +

          // ── Stamp + Signature (UASIT style) ───────────────────────────────
          '<div style="margin-top:6mm">' +
            '<p style="font-size:12px;font-weight:700;margin-bottom:1mm;color:#0d1f3c">For: ' + CO.fullNameUpper + '</p>' +
            '<div style="display:flex;align-items:flex-end;gap:10mm;margin-top:3mm">' +
              '<div>' + stampHTML + '</div>' +
              '<div>' +
                '<div style="margin-bottom:2mm;border-top:1.5px solid #4a5e7a;width:120px"></div>' +
                '<div style="font-size:11px;color:#4a5e7a;margin-top:1mm">Authorised Signatory<br><strong>DIRECTOR</strong></div>' +
              '</div>' +
            '</div>' +
          '</div>' +

        '</div>' +

      '</div>' +

      // ── Save Bar (UASIT theme) ─────────────────────────────────────────────
      '<div id="save-bar" style="position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#0d1f3c,#1a3c6e);border-top:2px solid #4a90d9;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999">' +
        '<div>' +
          '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Relieving Letter तयार आहे! — ' + CO.fullName + '</div>' +
          '<div style="color:#8ab4d4;font-size:12px">👇 <strong style="color:#a8d4f5">Save as PDF</strong> click करा</div>' +
        '</div>' +
        '<div style="display:flex;gap:10px">' +
          '<button onclick="document.getElementById(\'save-bar\').style.display=\'none\';window.print();" style="background:linear-gradient(135deg,' + CO.themeColor + ',#2a6bb5);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>' +
          '<button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#8ab4d4;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>' +
        '</div>' +
      '</div>' +

      '</body></html>'

    const pw = window.open('', '_blank')
    pw.document.write(html)
    pw.document.close()
  }, [form])

  // ─── UI — UASIT theme (blue focus, same structure as AppraisalLetter_UASIT) ──
  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-blue-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">
      
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Relieving Letter</h1>
        <p className="text-gray-500 text-sm mb-8">{CO.fullName}</p>

        <div className="max-w-2xl space-y-6">

          {/* ── Employee Info ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-blue-400 mb-5">👤 Employee Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Employee Name</label>
                  <input name="empName" value={form.empName} onChange={handleChange} placeholder="e.g. Rajendra Takale" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Employee ID</label>
                  <input name="empId" value={form.empId} onChange={handleChange} placeholder="e.g. EMP018" className={inp} />
                </div>
              </div>
              <div>
                <label className={lbl}>Designation</label>
                <input name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Software Developer" className={inp} />
              </div>
            </div>
          </div>

          {/* ── Dates ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-cyan-400 mb-5">📅 Important Dates</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Date of Joining</label>
                  <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} className={inp + " [color-scheme:dark]"} />
                </div>
                <div>
                  <label className={lbl}>Last Working / Relieving Date</label>
                  <input type="date" name="relievingDate" value={form.relievingDate} onChange={handleChange} className={inp + " [color-scheme:dark]"} />
                </div>
              </div>
              <div>
                <label className={lbl}>Letter Date</label>
                <input type="date" name="letterDate" value={form.letterDate} onChange={handleChange} className={inp + " [color-scheme:dark]"} />
              </div>
            </div>
          </div>

          {/* ── Preview ── */}
          {form.empName && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
              <h2 className="text-base font-semibold text-blue-400 mb-4">👁 Preview</h2>
              <div className="text-gray-300 text-sm space-y-3 leading-relaxed">
                <p><strong className="text-white">{form.empName}</strong> &nbsp;|&nbsp; Emp Id: <strong className="text-white">{form.empId || '—'}</strong></p>
                <p>Designation: <strong className="text-white">{form.designation || '—'}</strong></p>
                <p>Joining: <strong className="text-white">{ordinalDate(form.joiningDate)}</strong> → Relieving: <strong className="text-white">{ordinalDate(form.relievingDate)}</strong></p>
                <p>Letter Date: <strong className="text-white">{ordinalDate(form.letterDate)}</strong></p>
              </div>
            </div>
          )}

          {/* ── Generate Button ── */}
          <button
            onClick={exportPDF}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 font-semibold hover:scale-105 transition text-white text-sm shadow-lg"
          >
            ⬇️ Generate Relieving Letter (PDF)
          </button>
          <p className="text-center text-gray-600 text-xs pb-8">Print dialog मध्ये "Save as PDF" निवडा</p>

        </div>
      </main>
    </div>
  )
}