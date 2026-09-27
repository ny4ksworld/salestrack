/**
 * StatCard — metric tile used on dashboards.
 * Props: icon, label, value, sub (optional small line), accent (optional colour class)
 */
export default function StatCard({ icon, label, value, sub, accent = 'text-blue-700' }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide truncate">{label}</p>
        <p className={`text-2xl font-bold mt-0.5 tracking-tight ${accent}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  )
}
