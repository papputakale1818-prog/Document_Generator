// import { useState, useCallback } from 'react'
// import { useAuth } from '../context/AuthContext'
// import bgImage from '../assets/new_design.jpg'
// import stampimage from '../assets/stamp.jpg'

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

// // ─── Replace this with your actual API base URL ───────────────────────────────

// export default function RelievingLetter_SoftGrid() {
//   const { user, selectedCompany } = useAuth()

//   const [form, setForm] = useState({
//     empName:          '',
//     empId:            '',
//     designation:      '',
//     resignationDate:  '',   // date of resignation email
//     relievingDate:    '',   // last working / official end date
//     letterDate:       '',
//   })

//   // empName & designation come only from backend fetch — not editable manually

//   // empName and designation come only from backend fetch — not editable manually

//   const [fetchStatus, setFetchStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
//   const [fetchError,  setFetchError]  = useState('')
//   const [saveStatus,  setSaveStatus]  = useState('idle') // 'idle' | 'saving' | 'success' | 'error'
//   const [saveError,   setSaveError]   = useState('')

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setForm(prev => ({ ...prev, [name]: value }))
//   }

//   // ── Fetch employee data from backend using Emp ID ─────────────────────────
//   const fetchEmployee = useCallback(async () => {
//     if (!form.empId.trim()) {
//       setFetchError('Please enter an Employee ID first.')
//       setFetchStatus('error')
//       return
//     }
//     setFetchStatus('loading')
//     setFetchError('')
//     try {
//       const res = await fetch(
//         `http://127.0.0.1:8000/api/relieving-letters/${encodeURIComponent(form.empId.trim())}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//       if (!res.ok) {
//         const msg = res.status === 404
//           ? 'Employee not found in relieving letters.'
//           : `Server error (${res.status}).`
//         throw new Error(msg)
//       }
//       const data = await res.json()

//       // Backend snake_case → Frontend camelCase
//       setForm(prev => ({
//         ...prev,
//         empName:         data.emp_name         ?? prev.empName,
//         resignationDate: data.resignation_date ?? prev.resignationDate,
//         relievingDate:   data.relieving_date   ?? prev.relievingDate,
//         letterDate:      data.letter_date      ?? prev.letterDate,
//       }))
//       setFetchStatus('success')
//     } catch (err) {
//       setFetchError(err.message || 'Failed to fetch employee data.')
//       setFetchStatus('error')
//     }
//   }, [form.empId, user?.token])

//   // ── Save relieving letter to DB (POST, fallback to PATCH if exists) ───────
//   const saveToDB = useCallback(async () => {
//     if (!form.empId.trim()) {
//       setSaveError('Employee ID is required to save.')
//       setSaveStatus('error')
//       return false
//     }
//     setSaveStatus('saving')
//     setSaveError('')

//     const payload = {
//       emp_id:           form.empId.trim(),
//       resignation_date: form.resignationDate || null,
//       relieving_date:   form.relievingDate   || null,
//       letter_date:      form.letterDate      || null,
//       is_relieved:      true,
//     }

//     const headers = {
//       'Authorization': `Bearer ${user?.token}`,
//       'Content-Type': 'application/json',
//     }

//     try {
//       let res = await fetch('http://127.0.0.1:8000/api/relieving-letters/', {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(payload),
//       })

//       // If already exists, fall back to PATCH (update)
//       if (res.status === 409) {
//         res = await fetch(
//           `http://127.0.0.1:8000/api/relieving-letters/${encodeURIComponent(form.empId.trim())}`,
//           {
//             method: 'PATCH',
//             headers,
//             body: JSON.stringify({
//               resignation_date: payload.resignation_date,
//               relieving_date:   payload.relieving_date,
//               letter_date:      payload.letter_date,
//               is_relieved:      payload.is_relieved,
//             }),
//           }
//         )
//       }

//       if (!res.ok) {
//         throw new Error(`Server error (${res.status}).`)
//       }

//       setSaveStatus('success')
//       return true
//     } catch (err) {
//       setSaveError(err.message || 'Failed to save relieving letter.')
//       setSaveStatus('error')
//       return false
//     }
//   }, [form, user?.token])

//   // ── Generate PDF ──────────────────────────────────────────────────────────
//   const exportPDF = useCallback(() => {
//     const bgStyle =
//       "background-image:url('" + bgImage + "');" +
//       "background-size:cover;" +
//       "background-repeat:no-repeat;" +
//       "background-position:center top;"

//     const stampHTML = stampimage
//       ? '<img src="' + stampimage + '" style="height:80px;object-fit:contain" alt="Stamp" />'
//       : '<div style="width:80px;height:80px;border:2px solid ' + CO.themeColor + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:' + CO.themeColor + ';text-align:center">SOFTGRID<br>PUNE</div>'

//     // Format resignation date as DD-Mon-YYYY for body text
//     const resignFmt = form.resignationDate
//       ? new Date(form.resignationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
//       : '[Resignation Date]'

//     // Format relieving date as DD-Month-YYYY for body text
//     const relieveFmt = form.relievingDate
//       ? new Date(form.relievingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).replace(/ /g, '-')
//       : '[Relieving Date]'

//     const html =
//       '<!DOCTYPE html><html><head>' +
//       '<meta charset="UTF-8">' +
//       '<title>Relieving Letter — ' + (form.empName || 'Employee') + '</title>' +
//       '<style>' +
//         '*{box-sizing:border-box;margin:0;padding:0}' +
//         "body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#1a1a1a}" +
//         '@page{size:210mm 297mm;margin:0}' +
//         '@media print{' +
//           'html,body{width:210mm;height:297mm;margin:0;overflow:hidden}' +
//           '#save-bar{display:none!important}' +
//           '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
//         '}' +
//         '.page{' +
//           'width:210mm;height:297mm;' +
//           'margin:0 auto;' +
//           'padding:14mm 18mm 20mm;' +
//           'position:relative;' +
//           'overflow:hidden;' +
//           bgStyle +
//           '-webkit-print-color-adjust:exact;print-color-adjust:exact' +
//         '}' +
//         '.footer{' +
//           'position:absolute;bottom:8mm;left:18mm;right:18mm;' +
//           'border-top:1.5px solid #ccc;padding-top:3mm;' +
//           'text-align:center;font-size:10px;color:#444;' +
//           "font-family:'Segoe UI',Arial,sans-serif" +
//         '}' +
//         '.footer a{color:' + CO.themeColor + ';text-decoration:none}' +
//       '</style></head><body>' +

//       '<div class="page">' +

//         // ── Date (top-right) ──────────────────────────────────────────────
//         '<div style="text-align:right;font-size:13px;font-weight:600;color:#1a1a1a;margin-bottom:6mm">' +
//           ordinalDate(form.letterDate) +
//         '</div>' +

//         // ── Title ─────────────────────────────────────────────────────────
//         '<div style="text-align:center;font-size:15px;font-weight:700;text-decoration:underline;margin-bottom:8mm;letter-spacing:.04em;color:#1a1a1a">' +
//           'Relieving Letter' +
//         '</div>' +

//         // ── Salutation ────────────────────────────────────────────────────
//         '<p style="font-size:13px;font-weight:700;line-height:1.8;color:#1a1a1a">' +
//           'Dear ' + (form.empName || '[Employee Name]') + ',' +
//         '</p>' +
//         '<p style="font-size:13px;font-weight:700;margin-bottom:6mm;color:#1a1a1a">' +
//           'EMP ID: ' + (form.empId || '[Emp ID]') +
//         '</p>' +

//         // ── Para 1 — resignation acknowledgement ──────────────────────────
//         '<p style="font-size:13px;line-height:1.8;margin-bottom:5mm;text-align:justify;color:#1a1a1a">' +
//           'This is to acknowledge the receipt of your resignation email dated <strong>' + resignFmt + '</strong>. ' +
//           'We have accepted your resignation and are writing to confirm that your employment with ' +
//           '<strong>' + CO.fullName + '</strong> will officially end on <strong>' + relieveFmt + '</strong>.' +
//         '</p>' +

//         // ── Para 2 — appreciation ─────────────────────────────────────────
//         '<p style="font-size:13px;line-height:1.8;margin-bottom:5mm;text-align:justify;color:#1a1a1a">' +
//           'During your tenure with us, you have contributed significantly to the company, and your efforts have ' +
//           'been greatly appreciated. We would like to take this opportunity to thank you for your dedication and ' +
//           'hard work.' +
//         '</p>' +

//         // ── Para 3 — formalities ──────────────────────────────────────────
//         '<p style="font-size:13px;line-height:1.8;margin-bottom:3mm;text-align:justify;color:#1a1a1a">' +
//           'As per company policy, we request you to kindly ensure the completion of the following formalities before ' +
//           'your departure.' +
//         '</p>' +

//         '<ol style="font-size:13px;line-height:1.8;margin-left:6mm;margin-bottom:5mm;color:#1a1a1a">' +
//           '<li>Settle any outstanding dues or financial obligations, if applicable.</li>' +
//           '<li>Complete the necessary paperwork and obtain all relevant clearance certificates.<br>' +
//             '<span style="display:block;text-align:justify;padding-left:2mm">' +
//               'Upon successful completion of the above formalities, we will process your final settlement as per company norms.' +
//             '</span>' +
//           '</li>' +
//         '</ol>' +

//         // ── Para 4 — closing ──────────────────────────────────────────────
//         '<p style="font-size:13px;line-height:1.8;margin-bottom:10mm;color:#1a1a1a">' +
//           'Thank you once again for your service to our organization.' +
//         '</p>' +

//         // ── Stamp + Signature ─────────────────────────────────────────────
//         '<div style="text-align:right;margin-top:6mm">' +
//           '<p style="font-size:13px;font-weight:700;margin-bottom:2mm;color:#1a1a1a">For: ' + CO.fullNameUpper + '</p>' +
//           '<p style="font-size:13px;color:#444;margin-bottom:6mm">Authorized Signatory</p>' +
//           '<div style="display:inline-flex;align-items:center;gap:16px">' +
//             stampHTML +
//           '</div>' +
//         '</div>' +

//         // ── Footer ────────────────────────────────────────────────────────
//         '<div class="footer">' +
//           'Address: ' + CO.address + '<br>' +
//           '<a href="https://' + CO.website + '">' + CO.website + '</a>' +
//           ' &nbsp;|&nbsp; ' +
//           '<a href="mailto:' + CO.email + '">' + CO.email + '</a>' +
//         '</div>' +

//       '</div>' +

//       // ── Save bar ──────────────────────────────────────────────────────────
//       '<div id="save-bar" style="position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#1e293b,#0f172a);border-top:2px solid ' + CO.themeColor + ';padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999">' +
//         '<div>' +
//           '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Relieving Letter तयार आहे! — ' + CO.fullName + '</div>' +
//           '<div style="color:#64748b;font-size:12px">👇 <strong style="color:#a5b4fc">Save as PDF</strong> click करा</div>' +
//         '</div>' +
//         '<div style="display:flex;gap:10px">' +
//           '<button onclick="document.getElementById(\'save-bar\').style.display=\'none\';window.print();" style="background:linear-gradient(135deg,' + CO.themeColor + ',#4ade80);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>' +
//           '<button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>' +
//         '</div>' +
//       '</div>' +

//       '</body></html>'

//     const pw = window.open('', '_blank')
//     pw.document.write(html)
//     pw.document.close()
//   }, [form])

//   // ── Styles ────────────────────────────────────────────────────────────────
//   const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-green-500 outline-none text-white text-sm transition-colors"
//   const lbl = "text-sm text-gray-300"

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">
//       <main className="flex-1 p-8 overflow-y-auto">
//         <h1 className="text-3xl font-bold mb-2">Relieving Letter</h1>
//         <p className="text-gray-500 text-sm mb-8">{CO.fullName}</p>

//         <div className="max-w-2xl space-y-6">

//           {/* ── Employee Info ─────────────────────────────────────────────── */}
//           <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
//             <h2 className="text-base font-semibold text-indigo-400 mb-5">👤 Employee Information</h2>
//             <div className="space-y-4">

//               {/* Emp ID + Fetch button */}
//               <div>
//                 <label className={lbl}>Employee ID</label>
//                 <div className="flex gap-2 mt-1">
//                   <input
//                     name="empId"
//                     value={form.empId}
//                     onChange={(e) => {
//                       handleChange(e)
//                       setFetchStatus('idle')
//                       setFetchError('')
//                     }}
//                     placeholder="e.g. SG01257"
//                     className="flex-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-green-500 outline-none text-white text-sm transition-colors"
//                   />
//                   <button
//                     onClick={fetchEmployee}
//                     disabled={fetchStatus === 'loading'}
//                     className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors whitespace-nowrap"
//                   >
//                     {fetchStatus === 'loading' ? '⏳ Fetching…' : '🔍 Fetch Details'}
//                   </button>
//                 </div>

//                 {/* Status messages */}
//                 {fetchStatus === 'success' && (
//                   <p className="mt-1 text-xs text-green-400">✅ Employee data loaded successfully.</p>
//                 )}
//                 {fetchStatus === 'error' && (
//                   <p className="mt-1 text-xs text-red-400">❌ {fetchError}</p>
//                 )}
//               </div>

//               {/* Fetched info display (read-only) */}
//               {fetchStatus === 'success' && form.empName && (
//                 <div className="mt-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 space-y-1">
//                   <p>Name: <strong className="text-white">{form.empName}</strong></p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ── Dates ────────────────────────────────────────────────────── */}
//           <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
//             <h2 className="text-base font-semibold text-cyan-400 mb-5">📅 Important Dates</h2>
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className={lbl}>Resignation Email Date</label>
//                   <input
//                     type="date"
//                     name="resignationDate"
//                     value={form.resignationDate}
//                     onChange={handleChange}
//                     className={inp + " [color-scheme:dark]"}
//                   />
//                 </div>
//                 <div>
//                   <label className={lbl}>Last Working / Relieving Date</label>
//                   <input
//                     type="date"
//                     name="relievingDate"
//                     value={form.relievingDate}
//                     onChange={handleChange}
//                     className={inp + " [color-scheme:dark]"}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className={lbl}>Letter Date</label>
//                 <input
//                   type="date"
//                   name="letterDate"
//                   value={form.letterDate}
//                   onChange={handleChange}
//                   className={inp + " [color-scheme:dark]"}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* ── Generate Button ───────────────────────────────────────────── */}
//           <button
//             onClick={async () => {
//               const ok = await saveToDB()
//               if (ok) exportPDF()
//             }}
//             disabled={saveStatus === 'saving'}
//             className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg disabled:opacity-50"
//           >
//             {saveStatus === 'saving' ? '⏳ Saving…' : '⬇️ Generate Relieving Letter (PDF)'}
//           </button>
//           {saveStatus === 'success' && (
//             <p className="text-center text-green-400 text-xs">✅ Saved to database successfully.</p>
//           )}
//           {saveStatus === 'error' && (
//             <p className="text-center text-red-400 text-xs">❌ {saveError}</p>
//           )}
//           <p className="text-center text-gray-600 text-xs pb-8">Print dialog मध्ये "Save as PDF" निवडा</p>

//         </div>
//       </main>
//     </div>
//   )
// }

import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRelievingLetterPDF } from '../components/RelievingLetterPDFViewer_softgrid'

export default function RelievingLetter_SoftGrid() {
  const { user, selectedCompany } = useAuth()

  const [form, setForm] = useState({
    empName:          '',
    empId:            '',
    designation:      '',
    resignationDate:  '',   // date of resignation email
    relievingDate:    '',   // last working / official end date
    letterDate:       '',
  })

  // empName & designation come only from backend fetch — not editable manually

  // empName and designation come only from backend fetch — not editable manually

  const [fetchStatus, setFetchStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [fetchError,  setFetchError]  = useState('')
  const [saveStatus,  setSaveStatus]  = useState('idle') // 'idle' | 'saving' | 'success' | 'error'
  const [saveError,   setSaveError]   = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // ── Fetch employee data from backend using Emp ID ─────────────────────────
  const fetchEmployee = useCallback(async () => {
    if (!form.empId.trim()) {
      setFetchError('Please enter an Employee ID first.')
      setFetchStatus('error')
      return
    }
    setFetchStatus('loading')
    setFetchError('')
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/relieving-letters/${encodeURIComponent(form.empId.trim())}`,
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      if (!res.ok) {
        const msg = res.status === 404
          ? 'Employee not found in relieving letters.'
          : `Server error (${res.status}).`
        throw new Error(msg)
      }
      const data = await res.json()

      // Backend snake_case → Frontend camelCase
      setForm(prev => ({
        ...prev,
        empName:         data.emp_name         ?? prev.empName,
        resignationDate: data.resignation_date ?? prev.resignationDate,
        relievingDate:   data.relieving_date   ?? prev.relievingDate,
        letterDate:      data.letter_date      ?? prev.letterDate,
      }))
      setFetchStatus('success')
    } catch (err) {
      setFetchError(err.message || 'Failed to fetch employee data.')
      setFetchStatus('error')
    }
  }, [form.empId, user?.token])

  // ── Save relieving letter to DB (POST, fallback to PATCH if exists) ───────
  const saveToDB = useCallback(async () => {
    if (!form.empId.trim()) {
      setSaveError('Employee ID is required to save.')
      setSaveStatus('error')
      return false
    }
    setSaveStatus('saving')
    setSaveError('')

    const payload = {
      emp_id:           form.empId.trim(),
      resignation_date: form.resignationDate || null,
      relieving_date:   form.relievingDate   || null,
      letter_date:      form.letterDate      || null,
      is_relieved:      true,
    }

    const headers = {
      'Authorization': `Bearer ${user?.token}`,
      'Content-Type': 'application/json',
    }

    try {
      let res = await fetch('http://127.0.0.1:8000/api/relieving-letters/', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })

      // If already exists, fall back to PATCH (update)
      if (res.status === 409) {
        res = await fetch(
          `http://127.0.0.1:8000/api/relieving-letters/${encodeURIComponent(form.empId.trim())}`,
          {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
              resignation_date: payload.resignation_date,
              relieving_date:   payload.relieving_date,
              letter_date:      payload.letter_date,
              is_relieved:      payload.is_relieved,
            }),
          }
        )
      }

      if (!res.ok) {
        throw new Error(`Server error (${res.status}).`)
      }

      setSaveStatus('success')
      return true
    } catch (err) {
      setSaveError(err.message || 'Failed to save relieving letter.')
      setSaveStatus('error')
      return false
    }
  }, [form, user?.token])

  // ── PDF generation (from RelievingLetterPDFViewer_softgrid) ────────────────
  const { exportPDF } = useRelievingLetterPDF(form)

  // ── Styles ────────────────────────────────────────────────────────────────
  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-green-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Relieving Letter</h1>
        <p className="text-gray-500 text-sm mb-8">SoftGrid Info Pvt. Ltd.</p>

        <div className="max-w-2xl space-y-6">

          {/* ── Employee Info ─────────────────────────────────────────────── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-indigo-400 mb-5">👤 Employee Information</h2>
            <div className="space-y-4">

              {/* Emp ID + Fetch button */}
              <div>
                <label className={lbl}>Employee ID</label>
                <div className="flex gap-2 mt-1">
                  <input
                    name="empId"
                    value={form.empId}
                    onChange={(e) => {
                      handleChange(e)
                      setFetchStatus('idle')
                      setFetchError('')
                    }}
                    placeholder="e.g. SG01257"
                    className="flex-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-green-500 outline-none text-white text-sm transition-colors"
                  />
                  <button
                    onClick={fetchEmployee}
                    disabled={fetchStatus === 'loading'}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    {fetchStatus === 'loading' ? '⏳ Fetching…' : '🔍 Fetch Details'}
                  </button>
                </div>

                {/* Status messages */}
                {fetchStatus === 'success' && (
                  <p className="mt-1 text-xs text-green-400">✅ Employee data loaded successfully.</p>
                )}
                {fetchStatus === 'error' && (
                  <p className="mt-1 text-xs text-red-400">❌ {fetchError}</p>
                )}
              </div>

              {/* Fetched info display (read-only) */}
              {fetchStatus === 'success' && form.empName && (
                <div className="mt-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 space-y-1">
                  <p>Name: <strong className="text-white">{form.empName}</strong></p>
                </div>
              )}
            </div>
          </div>

          {/* ── Dates ────────────────────────────────────────────────────── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-cyan-400 mb-5">📅 Important Dates</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Resignation Email Date</label>
                  <input
                    type="date"
                    name="resignationDate"
                    value={form.resignationDate}
                    onChange={handleChange}
                    className={inp + " [color-scheme:dark]"}
                  />
                </div>
                <div>
                  <label className={lbl}>Last Working / Relieving Date</label>
                  <input
                    type="date"
                    name="relievingDate"
                    value={form.relievingDate}
                    onChange={handleChange}
                    className={inp + " [color-scheme:dark]"}
                  />
                </div>
              </div>
              <div>
                <label className={lbl}>Letter Date</label>
                <input
                  type="date"
                  name="letterDate"
                  value={form.letterDate}
                  onChange={handleChange}
                  className={inp + " [color-scheme:dark]"}
                />
              </div>
            </div>
          </div>

          {/* ── Generate Button ───────────────────────────────────────────── */}
          <button
            onClick={async () => {
              const ok = await saveToDB()
              if (ok) exportPDF()
            }}
            disabled={saveStatus === 'saving'}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg disabled:opacity-50"
          >
            {saveStatus === 'saving' ? '⏳ Saving…' : '⬇️ Generate Relieving Letter (PDF)'}
          </button>
          {saveStatus === 'success' && (
            <p className="text-center text-green-400 text-xs">✅ Saved to database successfully.</p>
          )}
          {saveStatus === 'error' && (
            <p className="text-center text-red-400 text-xs">❌ {saveError}</p>
          )}

        </div>
      </main>
    </div>
  )
}