/**
 * ShopActivityCard — card summarising a shop's performance.
 */
export default function ShopActivityCard({ shop, repCount, revenue, topProduct }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{shop.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{shop.location}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded border ${
          shop.active
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-gray-50 text-gray-500 border-gray-200'
        }`}>
          {shop.active ? 'Open' : 'Closed'}
        </span>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm border-t border-gray-100 pt-3">
        <div>
          <p className="text-xs text-gray-400">Revenue</p>
          <p className="font-semibold text-gray-800 text-sm">KSh {revenue.toLocaleString('en-KE')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Reps</p>
          <p className="font-semibold text-gray-800">{repCount}</p>
        </div>
        {topProduct && (
          <div className="min-w-0">
            <p className="text-xs text-gray-400">Top Product</p>
            <p className="font-semibold text-gray-800 truncate max-w-[120px]">{topProduct}</p>
          </div>
        )}
      </div>
    </div>
  )
}
