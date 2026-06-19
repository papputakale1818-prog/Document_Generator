import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useResignationAcceptancePDF } from '../components/Resignation_Acceptance_LetterPDFViewer_softgrid'

export default function ResignationAcceptance_SoftGrid() {
  const { user, selectedCompany } = useAuth()

  const [form, setForm] = useState({
    empName:          '',
    empId:            '',
    designation:      '',
    resignationDate:  '',   // date employee submitted resignation email
    lastWorkingDate:  '',   // accepted last working day
    letterDate:       '',   // date of this acceptance letter
  })

  // empName & designation come only from backend fetch — not editable manually

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
          ? 'Employee not found in relieving letter records.'
          : `Server error (${res.status}).`
        throw new Error(msg)
      }
      const data = await res.json()

      // Backend snake_case → Frontend camelCase (fetched from Relieving Letters table)
      setForm(prev => ({
        ...prev,
        empName:         data.emp_name          ?? prev.empName,
        designation:     data.designation        ?? prev.designation,
        resignationDate: data.resignation_date   ?? prev.resignationDate,
        lastWorkingDate: data.relieving_date     ?? prev.lastWorkingDate,
        letterDate:      data.letter_date         ?? prev.letterDate,
      }))
      setFetchStatus('success')
    } catch (err) {
      setFetchError(err.message || 'Failed to fetch employee data.')
      setFetchStatus('error')
    }
  }, [form.empId, user?.token])

  // ── Save resignation acceptance to DB (POST, fallback to PATCH if exists) ─
  const saveToDB = useCallback(async () => {
    if (!form.empId.trim()) {
      setSaveError('Employee ID is required to save.')
      setSaveStatus('error')
      return false
    }
    setSaveStatus('saving')
    setSaveError('')

    const payload = {
      emp_id:            form.empId.trim(),
      resignation_date:  form.resignationDate || null,
      last_working_date: form.lastWorkingDate || null,
      letter_date:       form.letterDate      || null,
      is_accepted:       true,
    }

    const headers = {
      'Authorization': `Bearer ${user?.token}`,
      'Content-Type': 'application/json',
    }

    try {
      let res = await fetch('http://127.0.0.1:8000/api/resignation-acceptance/', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })

      // If already exists, fall back to PATCH (update)
      if (res.status === 409) {
        res = await fetch(
          `http://127.0.0.1:8000/api/resignation-acceptance/${encodeURIComponent(form.empId.trim())}`,
          {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
              resignation_date:  payload.resignation_date,
              last_working_date: payload.last_working_date,
              letter_date:       payload.letter_date,
              is_accepted:       payload.is_accepted,
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
      setSaveError(err.message || 'Failed to save resignation acceptance.')
      setSaveStatus('error')
      return false
    }
  }, [form, user?.token])

  // ── PDF generation (from Resignation_Acceptance_LetterPDFViewer_softgrid) ──
  const { exportPDF } = useResignationAcceptancePDF(form)

  // ── Styles ────────────────────────────────────────────────────────────────
  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-green-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Resignation Acceptance</h1>
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
                  {form.designation && <p>Designation: <strong className="text-white">{form.designation}</strong></p>}
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
                    name="lastWorkingDate"
                    value={form.lastWorkingDate}
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
            {saveStatus === 'saving' ? '⏳ Saving…' : '⬇️ Generate Resignation Acceptance (PDF)'}
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