import { useState } from 'react'

import { useAuth } from '../context/AuthContext'
import { openConfirmationPDF } from '../components/ConfirmationLetterPDFViewer_Softgrid'

const CO = {
  fullName: 'SoftGrid Info Pvt. Ltd.',
}

export default function ConfirmationLetterPage_SoftGrid() {
  const { selectedCompany } = useAuth()

  const [form, setForm] = useState({
    empId: '',
    fullName: '',
    designation: '',
    joiningDate: '',
    letterDate: new Date().toISOString().split('T')[0],
  })
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'empId') setFetchError('')
  }

  const fetchEmployee = async () => {
    const empId = form.empId.trim()
    if (!empId) { setFetchError('Please enter Emp ID first'); return }
    const companyId = selectedCompany?.id || selectedCompany?.company_id
    setFetching(true)
    setFetchError('')
    try {
      const token = localStorage.getItem('hr_token')
      const res = await fetch(
        `http://127.0.0.1:8000/employees/by-emp-id?emp_id=${encodeURIComponent(empId)}&company_id=${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setFetchError(err.detail || 'Employee not found')
        return
      }
      const data = await res.json()

      setForm(prev => ({
        ...prev,
        fullName:    data.full_name   || data.name     || prev.fullName,
        designation: data.designation || data.position || prev.designation,
        joiningDate: data.joining_date || prev.joiningDate,
      }))
    } catch {
      setFetchError('Could not connect to server')
    } finally {
      setFetching(false)
    }
  }

  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-green-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"

  const handleSaveAndGenerate = async () => {
    const empId = form.empId.trim()
    if (!empId) { setSaveError('Please enter Emp ID first'); return }
    if (!form.letterDate) { setSaveError('Please select Letter Date'); return }

    const companyId = selectedCompany?.id || selectedCompany?.company_id
    setSaving(true)
    setSaveError('')
    try {
      const token = localStorage.getItem('hr_token')
      const res = await fetch('http://127.0.0.1:8000/confirmation-letter/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emp_id: empId,
          company_id: companyId,
          letter_date: form.letterDate,
          created_by: localStorage.getItem('hr_username') || null,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setSaveError(err.detail || 'Failed to save confirmation letter')
        return
      }

      openConfirmationPDF(form)
    } catch {
      setSaveError('Could not connect to server')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Employee Confirmation Letter</h1>
        <p className="text-gray-500 text-sm mb-8">{CO.fullName}</p>

        <div className="max-w-xl space-y-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-indigo-400 mb-5">👤 Employee Details</h2>
            <div className="space-y-4">

              <div>
                <label className={lbl}>Employee ID</label>
                <div className="flex gap-2 mt-1">
                  <input
                    name="empId"
                    value={form.empId}
                    onChange={handleChange}
                    onKeyDown={e => e.key === 'Enter' && fetchEmployee()}
                    placeholder="e.g. SGT1005"
                    className="flex-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-green-500 outline-none text-white text-sm transition-colors"
                  />
                  <button
                    onClick={fetchEmployee}
                    disabled={fetching}
                    className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    {fetching ? '...' : '🔍 Fetch'}
                  </button>
                </div>
                {fetchError && <p className="text-red-400 text-xs mt-1">{fetchError}</p>}
              </div>

              <div>
                <label className={lbl}>Employee Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Auto-filled after fetch"
                  className={inp}
                />
              </div>

              <div>
                <label className={lbl}>Designation</label>
                <input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="Auto-filled after fetch"
                  className={inp}
                />
              </div>

              <div>
                <label className={lbl}>Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                  className={inp + " [color-scheme:dark]"}
                />
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

          <button
            onClick={handleSaveAndGenerate}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg disabled:opacity-50"
          >
            {saving ? 'Saving...' : '⬇️ Generate Confirmation Letter (PDF)'}
          </button>
          {saveError && <p className="text-red-400 text-xs">{saveError}</p>}
        </div>
      </main>
    </div>
  )
}