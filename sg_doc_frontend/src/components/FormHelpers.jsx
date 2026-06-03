export function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

export const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-white"

export function PageShell({ title, company, children, btnLabel, btnColor = 'bg-primary-500 hover:bg-primary-600', onSubmit }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-display)' }}>{title}</h1>
        <p className="text-gray-400 text-sm mt-1">{company}</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={onSubmit} className="space-y-5">
          {children}
          <button type="submit" className={`${btnColor} text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-md cursor-pointer mt-2`}>
            {btnLabel}
          </button>
        </form>
      </div>
    </div>
  )
}
