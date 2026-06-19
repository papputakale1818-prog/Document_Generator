
import { useState } from 'react'

import { useAuth } from '../context/AuthContext'
import { openExperienceLetterPDF } from '../components/Experienceletterpreviewsoftgrid'

const CO = {
  fullName: 'SoftGrid Info Pvt. Ltd.',
}

function tenureText(from, to) {
  const start = new Date(from)
  const end = new Date(to)
  if (isNaN(start) || isNaN(end) || end < start) return ''
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  if (end.getDate() < start.getDate()) months--
  const years = Math.floor(months / 12)
  const rem = months % 12
  const parts = []
  if (years) parts.push(`${years} Year${years > 1 ? 's' : ''}`)
  if (rem) parts.push(`${rem} Month${rem > 1 ? 's' : ''}`)
  return parts.length ? parts.join(' ') : 'Less than a month'
}

export default function ExperienceLetterPage_SoftGrid() {
  const { selectedCompany } = useAuth()

  const [form, setForm] = useState({
    empName: '', empId: '', designation: '', department: '',
    letterDate: '', joiningDate: '', lastWorkingDate: '',
    employmentType: '',
  })
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState('')

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

      // Date of Joining comes from the offer_letters table
      let joiningDate = ''
      try {
        const offerRes = await fetch(
          `http://127.0.0.1:8000/offer-letters/${encodeURIComponent(empId)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (offerRes.ok) {
          const offerData = await offerRes.json()
          joiningDate = offerData.joining_date || ''
        }
      } catch {}

      // Last Working Date comes from the relieving_letter table
      let lastWorkingDate = ''
      try {
        const relievingRes = await fetch(
          `http://127.0.0.1:8000/api/relieving-letters/${encodeURIComponent(empId)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (relievingRes.ok) {
          const relievingData = await relievingRes.json()
          lastWorkingDate = relievingData.relieving_date || ''
        }
      } catch {}

      setForm(prev => ({
        ...prev,
        empName:         data.full_name  || data.name      || prev.empName,
        designation:     data.designation || data.position  || prev.designation,
        department:      data.department  || prev.department,
        employmentType:  data.emp_type     || prev.employmentType,
        joiningDate:     joiningDate       || prev.joiningDate,
        lastWorkingDate: lastWorkingDate   || prev.lastWorkingDate,
      }))
    } catch {
      setFetchError('Could not connect to server')
    } finally {
      setFetching(false)
    }
  }

  const saveExperienceRecord = async () => {
    try {
      const token = localStorage.getItem('hr_token')
      await fetch('http://127.0.0.1:8000/letters/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emp_id: form.empId,
          letter_date: form.letterDate || null,
          company_id: selectedCompany?.id || selectedCompany?.company_id,
        }),
      })
    } catch {
      // saving is best-effort
    }
  }

  const inp = "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-amber-500 outline-none text-white text-sm transition-colors"
  const lbl = "text-sm text-gray-300"
  const tenure = form.joiningDate && form.lastWorkingDate ? tenureText(form.joiningDate, form.lastWorkingDate) : ''

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 text-white">

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Experience Letter</h1>
        <p className="text-gray-500 text-sm mb-8">{CO.fullName}</p>
        <div className="max-w-3xl space-y-6">

          {/* ── Employee Info ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-indigo-400 mb-5">👤 Employee Information</h2>
            <div className="space-y-4">

              <div>
                <label className={lbl}>Employee ID</label>
                <div className="flex gap-2 mt-1">
                  <input
                    name="empId"
                    value={form.empId}
                    onChange={handleChange}
                    onKeyDown={e => e.key === 'Enter' && fetchEmployee()}
                    placeholder="e.g. SG01257"
                    className="flex-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-amber-500 outline-none text-white text-sm transition-colors"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Full Name</label>
                  <input name="empName" value={form.empName} onChange={handleChange} placeholder="Auto-filled after fetch" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Designation</label>
                  <input name="designation" value={form.designation} onChange={handleChange} placeholder="Auto-filled after fetch" className={inp} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Department</label>
                  <input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Employment Type</label>
                  <input name="employmentType" value={form.employmentType} onChange={handleChange} placeholder="Auto-filled after fetch" className={inp} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Dates & Tenure ── */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-base font-semibold text-amber-400 mb-5">📅 Dates & Tenure</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Date of Joining</label>
                <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} className={inp + " [color-scheme:dark]"} />
              </div>
              <div>
                <label className={lbl}>Last Working / Relieving Date</label>
                <input type="date" name="lastWorkingDate" value={form.lastWorkingDate} onChange={handleChange} className={inp + " [color-scheme:dark]"} />
              </div>
              <div>
                <label className={lbl}>Letter Date</label>
                <input type="date" name="letterDate" value={form.letterDate} onChange={handleChange} className={inp + " [color-scheme:dark]"} />
              </div>
            </div>

            {tenure && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-4 text-center mt-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Tenure</div>
                <div className="text-emerald-400 font-bold text-lg">{tenure}</div>
              </div>
            )}
          </div>

          {/* ── Preview / Save Button ── */}
          <button
            onClick={async () => {
              await saveExperienceRecord()
              openExperienceLetterPDF(form)
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 font-semibold hover:scale-105 transition text-white text-sm shadow-lg"
          >
            ⬇️ Generate Experience Letter (PDF)
          </button>

        </div>
      </main>
    </div>
  )
}