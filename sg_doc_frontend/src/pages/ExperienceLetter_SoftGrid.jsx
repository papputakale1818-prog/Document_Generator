import { useState } from 'react'
import { Field, inputCls, PageShell } from '../components/FormHelpers'
import { useAuth } from '../context/AuthContext'

export default function ExperienceLetterPage() {
  const { selectedCompany } = useAuth()
  const [form, setForm] = useState({ employeeName: '', employeeId: '', designation: '', department: '', joiningDate: '', lastWorkingDate: '', performance: '', hrName: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="flex min-h-screen bg-gray-50">
    
      <main className="flex-1 p-8 max-w-3xl">
        <PageShell title="Experience Letter" company={selectedCompany?.name} btnLabel="Generate Experience Letter"
          btnColor="bg-amber-500 hover:bg-amber-600"
          onSubmit={e => { e.preventDefault(); alert(`Experience Letter generated for ${form.employeeName}!`) }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Employee Name"><input value={form.employeeName} onChange={set('employeeName')} required className={inputCls} placeholder="Full Name" /></Field>
            <Field label="Employee ID"><input value={form.employeeId} onChange={set('employeeId')} required className={inputCls} placeholder="EMP001" /></Field>
            <Field label="Designation"><input value={form.designation} onChange={set('designation')} required className={inputCls} placeholder="e.g. Software Engineer" /></Field>
            <Field label="Department"><input value={form.department} onChange={set('department')} required className={inputCls} placeholder="e.g. Engineering" /></Field>
            <Field label="Date of Joining"><input type="date" value={form.joiningDate} onChange={set('joiningDate')} required className={inputCls} /></Field>
            <Field label="Last Working Date"><input type="date" value={form.lastWorkingDate} onChange={set('lastWorkingDate')} required className={inputCls} /></Field>
            <Field label="HR Manager Name"><input value={form.hrName} onChange={set('hrName')} required className={inputCls} placeholder="HR Name" /></Field>
            <Field label="Performance Remark">
              <select value={form.performance} onChange={set('performance')} required className={inputCls}>
                <option value="">Select</option>
                {['Excellent', 'Very Good', 'Good', 'Satisfactory'].map(r => <option key={r}>{r}</option>)}
              </select>
            </Field>
          </div>
        </PageShell>
      </main>
    </div>
  )
}
