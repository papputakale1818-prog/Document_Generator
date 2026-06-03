
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

function ordinalDate(d) {
  if(!d) return "—"
  const dt = new Date(d)
  const day = dt.getDate()
  const suffix = ["th","st","nd","rd"][((day%100-20)%10<=3&&(day%100-20)%10>0)?(day%100-20)%10:(day%100<=3&&day%100>0)?day%100:0] || "th"
  return day + suffix + " " + dt.toLocaleDateString("en-IN",{month:"long",year:"numeric"})
}

export default function RelievingLetter_SoftGrid() {
  const { selectedCompany } = useAuth()

  const [form, setForm] = useState({
    empName:      '',
    empId:        '',
    designation:  '',
    joiningDate:  '',
    relievingDate:'',
    letterDate:   '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const exportPDF = useCallback(() => {
    const bgStyle =
      "background-image:url('" + bgImage + "');" +
      "background-size:cover;" +
      "background-repeat:no-repeat;" +
      "background-position:center top;"

    const stampHTML = stampimage
      ? '<img src="' + stampimage + '" style="height:80px;object-fit:contain" alt="Stamp" />'
      : '<div style="width:80px;height:80px;border:2px solid ' + CO.themeColor + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:' + CO.themeColor + ';text-align:center">SOFTGRID<br>PUNE</div>'

    const html =
      '<!DOCTYPE html><html><head>' +
      '<meta charset="UTF-8">' +
      '<title>Relieving Letter — ' + (form.empName || 'Employee') + '</title>' +
      '<style>' +
        '*{box-sizing:border-box;margin:0;padding:0}' +
        "body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#1a1a1a}" +
        '@page{size:210mm 297mm;margin:0}' +
        '@media print{' +
          'html,body{width:210mm;height:297mm;margin:0;overflow:hidden}' +
          '#save-bar{display:none!important}' +
          '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
        '}' +
        '.page{' +
          'width:210mm;height:297mm;' +
          'margin:0 auto;' +
          'padding:14mm 18mm 20mm;' +
          'position:relative;' +
          'overflow:hidden;' +
          bgStyle +
          '-webkit-print-color-adjust:exact;print-color-adjust:exact' +
        '}' +
        '.footer{' +
          'position:absolute;bottom:8mm;left:18mm;right:18mm;' +
          'border-top:1.5px solid #ccc;padding-top:3mm;' +
          'text-align:center;font-size:10px;color:#444;' +
          "font-family:'Segoe UI',Arial,sans-serif" +
        '}' +
        '.footer a{color:' + CO.themeColor + ';text-decoration:none}' +
      '</style></head><body>' +

      '<div class="page">' +

        // ── Title ─────────────────────────────────────────────────────────
        '<div style="text-align:center;font-size:18px;font-weight:700;text-decoration:underline;margin-bottom:10mm;letter-spacing:.04em;color:#1a1a1a">' +
          'RELIEVING LETTER' +
        '</div>' +

        // ── Employee Name (left) + Date (right) — same row ───────────────
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-top:20mm;margin-bottom:6mm">' +
          '<div>' +
            '<p style="font-size:13px;font-weight:700;line-height:1.7;color:#1a1a1a">' + (form.empName || '[Employee Name]') + '</p>' +
            '<p style="font-size:13px;color:#1a1a1a">Emp Id: ' + (form.empId || '[Emp ID]') + '</p>' +
          '</div>' +
          '<div style="font-size:13px;font-weight:600;color:#1a1a1a;white-space:nowrap">' +
            ordinalDate(form.letterDate) +
          '</div>' +
        '</div>' +

        // ── Body paragraphs ───────────────────────────────────────────────
        '<p style="font-size:13px;line-height:1.8;margin-bottom:5mm;text-align:justify;color:#1a1a1a">' +
          'This is to certify that, Mr./Ms. <strong>' + (form.empName || '[Employee Name]') + '</strong> has been with our organization ' +
          'from <strong>' + ordinalDate(form.joiningDate) + '</strong> to <strong>' + ordinalDate(form.relievingDate) + '</strong> on permanent basis which was executed on the ' +
          'joining day and his/her last held designation was <strong>' + (form.designation || '[Designation]') + '</strong>. He/She has been ' +
          'relieved from the services w.e.f <strong>' + ordinalDate(form.relievingDate) + '</strong>.' +
        '</p>' +

        '<p style="font-size:13px;line-height:1.8;margin-bottom:5mm;color:#1a1a1a">' +
          'We wish him/her very best for his/her future endeavors.' +
        '</p>' +

        '<p style="font-size:13px;line-height:1.8;margin-bottom:5mm;color:#1a1a1a">' +
          'We thank you for your services with <strong>' + CO.fullNameUpper + '</strong> and take this opportunity ' +
          'we wish you all the best for your future endeavors.' +
        '</p>' +

        '<p style="font-size:13px;line-height:1.8;margin-bottom:10mm;text-align:justify;color:#1a1a1a">' +
          'We would like to draw your attention to your continuing obligations towards the ' +
          'company, including that of confidentiality with respect to all proprietary and ' +
          'confidential information and data of the company and its customers that you have had ' +
          'access to during the course of your employment with the company.' +
        '</p>' +

        // ── Stamp + Signature ─────────────────────────────────────────────
        '<div style="margin-top:8mm">' +
          '<div style="margin-bottom:4mm">' + stampHTML + '</div>' +
          '<p style="font-size:13px;font-weight:700;margin-bottom:1mm;color:#1a1a1a">For: ' + CO.fullNameUpper + '</p>' +
          '<p style="font-size:13px;color:#444">Authorized Signatory</p>' +
        '</div>' +

        // ── Footer ────────────────────────────────────────────────────────
        '<div class="footer">' +
          '<a href="https://' + CO.website + '">' + CO.website + '</a>' +
          ' &nbsp;|&nbsp; ' +
          '<a href="mailto:' + CO.email + '">' + CO.email + '</a><br>' +
          'Address: ' + CO.address + '<br>' +
          'GSTIN: ' + CO.gstin + ' &nbsp;|&nbsp; TAN: ' + CO.tan +
        '</div>' +

      '</div>' +

      // ── Save bar ──────────────────────────────────────────────────────────
      '<div id="save-bar" style="position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#1e293b,#0f172a);border-top:2px solid ' + CO.themeColor + ';padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999">' +
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

    const pw = window.open('', '_blank')
    pw.document.write(html)
    pw.document.close()
  }, [form])

  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-green-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">
      
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Relieving Letter</h1>
        <p className="text-gray-500 text-sm mb-8">{CO.fullName}</p>

        <div className="max-w-2xl space-y-6">

          {/* Employee Info */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-indigo-400 mb-5">👤 Employee Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Employee Name</label><input name="empName" value={form.empName} onChange={handleChange} placeholder="e.g. Takale Pappu Rajendra" className={inp} /></div>
                <div><label className={lbl}>Employee ID</label><input name="empId" value={form.empId} onChange={handleChange} placeholder="e.g. EMPSG0018" className={inp} /></div>
              </div>
              <div>
                <label className={lbl}>Designation</label>
                <input name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Software Developer" className={inp} />
              </div>
            </div>
          </div>

          {/* Dates */}
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

          {/* Preview */}
          {form.empName && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
              <h2 className="text-base font-semibold text-emerald-400 mb-4">👁 Preview</h2>
              <div className="text-gray-300 text-sm space-y-3 leading-relaxed">
                <p><strong className="text-white">{form.empName}</strong> &nbsp;|&nbsp; Emp Id: <strong className="text-white">{form.empId || '—'}</strong></p>
                <p>Designation: <strong className="text-white">{form.designation || '—'}</strong></p>
                <p>Joining: <strong className="text-white">{ordinalDate(form.joiningDate)}</strong> → Relieving: <strong className="text-white">{ordinalDate(form.relievingDate)}</strong></p>
                <p>Letter Date: <strong className="text-white">{ordinalDate(form.letterDate)}</strong></p>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={exportPDF}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg"
          >
            ⬇️ Generate Relieving Letter (PDF)
          </button>
          <p className="text-center text-gray-600 text-xs pb-8">Print dialog मध्ये "Save as PDF" निवडा</p>

        </div>
      </main>
    </div>
  )
}