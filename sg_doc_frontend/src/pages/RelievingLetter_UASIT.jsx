import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRelievingLetterPDF } from '../components/RelievingLetterPDFViewer_uasit'
import EmployeeIdLookup from '../components/EmployeeIdLookup'

export default function RelievingLetter_UASIT() {
  const { user, selectedCompany } = useAuth()

  const [form, setForm] = useState({
    empName:          '',
    empId:            '',
    designation:      '',
    resignationDate:  '',
    relievingDate:    '',
    letterDate:       '',
  })

  const [saveStatus,  setSaveStatus]  = useState('idle') // 'idle' | 'saving' | 'success' | 'error'
  const [saveError,   setSaveError]   = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Called by EmployeeIdLookup on successful employee fetch
  const handleEmployeeFound = (emp) => {
    setForm(prev => ({
      ...prev,
      empName:     emp.full_name   || emp.name        || emp.emp_name  || prev.empName,
      designation: emp.designation || emp.position    || prev.designation,
      resignationDate: emp.resignation_date ?? prev.resignationDate,
      relievingDate:   emp.relieving_date   ?? prev.relievingDate,
      letterDate:      emp.letter_date      ?? prev.letterDate,
    }))
  }

  // ── Save relieving letter to DB (POST, fallback to PATCH if exists) ───────
  const saveToDB = async () => {
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
  }

  // ── PDF generation (from RelievingLetterPDFViewer_uasit) ──────────────────
  const { exportPDF } = useRelievingLetterPDF(form)

  // ── Styles ────────────────────────────────────────────────────────────────
  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-green-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Relieving Letter</h1>
        <p className="text-gray-500 text-sm mb-8">UAS IT Consultancy Services Pvt. Ltd.</p>

        <div className="max-w-2xl space-y-6">

          {/* ── Employee Info ─────────────────────────────────────────────── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-indigo-400 mb-5">👤 Employee Information</h2>
            <div className="space-y-4">

              {/* Emp ID lookup — auto-fills name, designation, and dates if available */}
              <EmployeeIdLookup
                companyId={selectedCompany?.id || selectedCompany?.company_id}
                companyName={selectedCompany?.name || selectedCompany?.company_name || 'this company'}
                onFound={handleEmployeeFound}
                onEmpIdChange={(id) => setForm(prev => ({ ...prev, empId: id }))}
                placeholder="e.g. EMP018"
                inputClassName="w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-green-500 outline-none text-white text-sm transition-colors"
              />

              {/* Fetched name display (read-only) */}
              {form.empName && (
                <div className="mt-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 space-y-1">
                  <p>Name: <strong className="text-white">{form.empName}</strong></p>
                  {form.designation && (
                    <p>Designation: <strong className="text-white">{form.designation}</strong></p>
                  )}
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