/**
 * SalespersonCard — card showing rep info, shop, target progress and sales count.
 */
import TargetProgressBar from '../TargetProgressBar.jsx'

export default function SalespersonCard({ rep, shopName, revenue, salesCount, target, percent }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{rep.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{shopName}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded border ${
          rep.active
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-gray-50 text-gray-500 border-gray-200'
        }`}>
          {rep.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 text-sm border-t border-gray-100 pt-3">
        <div>
          <p className="text-xs text-gray-400">Revenue</p>
          <p className="font-semibold text-gray-800 text-sm">KSh {revenue.toLocaleString('en-KE')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Sales</p>
          <p className="font-semibold text-gray-800 text-sm">{salesCount}</p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400">Phone</p>
          <p className="font-semibold text-gray-800 text-sm truncate">{rep.phone}</p>
        </div>
      </div>

      {/* Target progress */}
      <TargetProgressBar revenue={revenue} target={target} percent={percent} />
    </div>
  )
}
