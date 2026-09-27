/**
 * RecentSalesTable — paginated, sortable sales table.
 *
 * Props:
 *   sales       — filtered sales array to display
 *   salesReps   — for name lookup
 *   shops       — for name lookup
 *   isManager   — show Approve/Reject buttons on Pending rows
 *   onApprove(saleId)
 *   onReject(saleId, reason)
 *   pageSize    — rows per page (default 10)
 */
import { useState } from 'react'
import { StatusBadge } from './StatusBadge.jsx'
import RejectModal from './RejectModal.jsx'
import { formatDateTime } from '../utils/dateHelpers.js'

const PAGE_SIZE = 10

export default function RecentSalesTable({
  sales = [],
  salesReps = [],
  shops = [],
  isManager = false,
  onApprove,
  onReject,
  pageSize = PAGE_SIZE,
}) {
  const [page, setPage] = useState(1)
  const [rejectTarget, setRejectTarget] = useState(null) // { id, name }

  const repMap  = Object.fromEntries(salesReps.map(r  => [r.id,  r.name]))
  const shopMap = Object.fromEntries(shops.map(sh => [sh.id, sh.name]))

  const totalPages = Math.max(1, Math.ceil(sales.length / pageSize))
  const slice = sales.slice((page - 1) * pageSize, page * pageSize)

  function handleRejectConfirm(reason) {
    onReject(rejectTarget.id, reason)
    setRejectTarget(null)
  }

  return (
    <>
      {rejectTarget && (
        <RejectModal
          saleName={rejectTarget.name}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        {sales.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">No sales found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Rep</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Shop</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Method</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
                {isManager && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody>
              {slice.map((sale, i) => (
                <tr
                  key={sale.id}
                  className={`border-b border-gray-100 last:border-0 ${
                    sale.status === 'Pending' && isManager ? 'bg-amber-50 hover:bg-amber-100/70' :
                    sale.status === 'Rejected' ? 'bg-red-50 hover:bg-red-100/70' :
                    i % 2 === 0 ? 'hover:bg-gray-50' : 'bg-gray-50/40 hover:bg-gray-100/70'
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800 truncate max-w-[160px]">{sale.productName}</div>
                    <div className="text-xs text-gray-400">{sale.sku}</div>
                    {sale.serialNumber && (
                      <div className="text-xs text-gray-400 font-mono">S/N: {sale.serialNumber}</div>
                    )}
                    {sale.status === 'Rejected' && sale.notes && (
                      <div className="text-xs text-red-600 mt-0.5 max-w-[200px]">⚠ {sale.notes}</div>
                    )}
                    {/* Show date inline on mobile where date column is hidden */}
                    <div className="text-xs text-gray-400 mt-0.5 sm:hidden">{formatDateTime(sale.timestamp)}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{repMap[sale.repId] ?? sale.repId}</td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{shopMap[sale.shopId] ?? sale.shopId}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800 whitespace-nowrap">
                    KSh {sale.totalAmount.toLocaleString('en-KE')}
                    {sale.quantity > 1 && (
                      <div className="text-xs text-gray-400 font-normal">×{sale.quantity}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{sale.paymentMethod}</td>
                  <td className="px-4 py-3"><StatusBadge status={sale.status} /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell whitespace-nowrap">{formatDateTime(sale.timestamp)}</td>
                  {isManager && (
                    <td className="px-4 py-3">
                      {sale.status === 'Pending' && (
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => onApprove(sale.id)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors"
                          >
                            ✓ Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectTarget({ id: sale.id, name: sale.productName })}
                            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span>{sales.length} record{sales.length !== 1 ? 's' : ''}</span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
            >‹</button>
            <span className="px-3 py-1">Page {page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
            >›</button>
          </div>
        </div>
      )}
    </>
  )
}
