
import { useState } from 'react'

/**
 * EmployeeIdLookup
 * -----------------
 * Ek reusable component je Employee ID input + "Fetch" button + 
 * company-mismatch error (same jo OfferLetterPage madhe hota) handle karto.
 *
 * Kuthehi import kara — same UI, same error message, same logic.
 * Tumhi sirf `onFound` callback de un tumchya local form state madhe data fill kara.
 *
 * USAGE (kontyahi page/component madhe):
 * ----------------------------------------
 * import EmployeeIdLookup from '../components/EmployeeIdLookup'
 *
 * <EmployeeIdLookup
 *   companyId={companyId}
 *   companyName={companyName}
 *   onFound={(emp) => {
 *     setForm(prev => ({
 *       ...prev,
 *       fullName: emp.full_name || emp.name || prev.fullName,
 *       designation: emp.designation || emp.position || prev.designation,
 *       department: emp.department || prev.department,
 *       manager: emp.manager || emp.reporting_manager || prev.manager,
 *       location: emp.location || emp.work_location || prev.location,
 *     }))
 *   }}
 * />
 *
 * Ha component apla swatahcha empId state ठेवतो, pan tumhala
 * tyacha empId baher pan hava asel (save karaytela) tar `onEmpIdChange` prop use kara.
 */

const API_URL = 'http://127.0.0.1:8000'

const defaultInputClass =
  "w-full mt-1 px-4 py-2 rounded-lg bg-transparent border border-gray-600 focus:border-indigo-500 outline-none text-white text-sm transition-colors"
const defaultLabelClass = "text-sm text-gray-300"

export default function EmployeeIdLookup({
  companyId,
  companyName = 'this company',
  onFound,                 // (employeeObject) => void   -- required, called on success
  onEmpIdChange,            // (empIdString) => void      -- optional, parent ला empId havi asel tar
  apiUrl = API_URL,
  placeholder = 'e.g. SG264527',
  label = 'Employee ID',
  required = true,
  inputClassName = defaultInputClass,
  labelClassName = defaultLabelClass,
}) {
  const [empId, setEmpId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmpIdChange = (e) => {
    const value = e.target.value
    setEmpId(value)
    onEmpIdChange?.(value)
  }

  const fetchEmployeeById = async (id = empId) => {
    if (!id.trim()) return
    if (!companyId) {
      setError('⚠️ No company selected — please choose one from the Companies page')
      return
    }
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('hr_token')
      const res = await fetch(`${apiUrl}/employees/${id.trim()}?company_id=${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`Employee ID "${id}" does not belong to ${companyName}`)
        }
        throw new Error('Lookup failed')
      }
      const emp = await res.json()

      // double-check — backend filter miss zala tari ithe pakka check
      if (emp.company_id && String(emp.company_id) !== String(companyId)) {
        throw new Error(`Employee ID "${id}" does not belong to ${companyName}`)
      }

      onFound?.(emp)
    } catch (err) {
      setError(`⚠️ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <label className={labelClassName}>
        {label}{' '}
        {required && <span className="text-red-400 text-xs">*Required</span>}{' '}
        <span className="text-gray-500 text-xs">(Enter ID → auto-fill)</span>
      </label>
      <div className="flex gap-2 mt-1">
        <input
          name="empId"
          value={empId}
          onChange={handleEmpIdChange}
          onKeyDown={(e) => e.key === 'Enter' && fetchEmployeeById(empId)}
          placeholder={placeholder}
          className={inputClassName + ' flex-1'}
        />
        <button
          type="button"
          onClick={() => fetchEmployeeById(empId)}
          disabled={loading || !empId.trim()}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center gap-2"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            '🔍'
          )}
          {loading ? 'Fetching...' : 'Fetch'}
        </button>
      </div>
      {error && <div className="mt-1 text-red-400 text-xs">{error}</div>}
    </div>
  )
}


