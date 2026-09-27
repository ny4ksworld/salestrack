import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout.jsx'
import StatCard from '../components/cards/StatCard.jsx'
import TargetProgressBar from '../components/TargetProgressBar.jsx'
import RecentSalesTable from '../components/RecentSalesTable.jsx'
import RecordSaleForm from '../components/forms/RecordSaleForm.jsx'
import { useSalesContext } from '../context/SalesContext.jsx'
import {
  salesByRep, todaySales,
  totalRevenue, pendingSales, repTargetProgress,
} from '../utils/calculations.js'
import { formatCurrencyCompact } from '../utils/formatCurrency.js'

export default function SalespersonDashboard() {
  const { sales, salesReps, shops, products, currentRep, enqueue, resubmitSale } = useSalesContext()
  const [resubmitSaleObj, setResubmitSaleObj] = useState(null)

  const mySales = useMemo(
    () => currentRep ? salesByRep(sales, currentRep.id) : [],
    [sales, currentRep]
  )

  const stats = useMemo(() => {
    if (!currentRep) return { todayCount: 0, totalRevenue: 0, pending: 0 }
    const todayMine = todaySales(mySales)
    return {
      todayCount:   todayMine.length,
      totalRevenue: totalRevenue(mySales),
      pending:      pendingSales(mySales).length,
    }
  }, [mySales, currentRep])

  const progress = useMemo(
    () => currentRep ? repTargetProgress(sales, currentRep) : { revenue: 0, target: 0, percent: 0 },
    [sales, currentRep]
  )

  // My last 5 sales, newest first
  const recentMine = useMemo(
    () => [...mySales].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5),
    [mySales]
  )

  // Rejected sales this rep can resubmit
  const myRejected = useMemo(
    () => mySales.filter(s => s.status === 'Rejected').sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [mySales]
  )

  function handleResubmit(saleId, updates) {
    resubmitSale(saleId, updates)
    setResubmitSaleObj(null)
  }

  if (!currentRep) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500 text-sm mb-4">No rep selected. Use the dropdown in the top bar to select your profile.</p>
        </div>
      </AppLayout>
    )
  }

  const shop = shops.find(s => s.id === currentRep.shopId)

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{currentRep.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{shop?.name} · {shop?.location}</p>
          </div>
          <Link
            to="/salesperson/record"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-md transition-colors"
          >
            + Record Sale
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon="🛒"
            label="Sales Today"
            value={stats.todayCount}
            sub="All statuses"
          />
          <StatCard
            icon="💰"
            label="Total Revenue"
            value={formatCurrencyCompact(stats.totalRevenue)}
            sub="Approved only"
            accent="text-green-700"
          />
          <StatCard
            icon="⏳"
            label="Pending"
            value={stats.pending}
            sub="Awaiting approval"
            accent={stats.pending > 0 ? 'text-amber-600' : 'text-gray-500'}
          />
        </div>

        {/* Target progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Monthly Target</h2>
          <TargetProgressBar
            revenue={progress.revenue}
            target={progress.target}
            percent={progress.percent}
          />
        </div>

        {/* Rejected sales — resubmit prompt */}
        {myRejected.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">
                Rejected Sales
                <span className="ml-2 text-xs bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full font-semibold">
                  {myRejected.length} to fix
                </span>
              </h2>
            </div>
            <div className="space-y-2">
              {myRejected.map(sale => (
                <div key={sale.id} className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">{sale.productName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">KSh {sale.totalAmount.toLocaleString('en-KE')} · {sale.paymentMethod}</p>
                    {sale.notes && (
                      <p className="text-xs text-red-700 mt-1">
                        <span className="font-semibold">Reason:</span> {sale.notes}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setResubmitSaleObj(sale)}
                    className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-red-300 text-red-700 hover:bg-red-50 transition-colors whitespace-nowrap"
                  >
                    Edit &amp; Resubmit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inline resubmit form */}
        {resubmitSaleObj && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">Edit &amp; Resubmit</h2>
              <button
                type="button"
                onClick={() => setResubmitSaleObj(null)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                ✕ Cancel
              </button>
            </div>
            <RecordSaleForm
              salesReps={salesReps}
              shops={shops}
              products={products}
              currentRep={currentRep}
              onSubmit={enqueue}
              initialSale={resubmitSaleObj}
              onResubmit={handleResubmit}
            />
          </div>
        )}

        {/* Recent sales */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">My Recent Sales</h2>
            {mySales.length === 0 && (
              <span className="text-xs text-gray-400">No sales yet</span>
            )}
          </div>
          <RecentSalesTable
            sales={recentMine}
            salesReps={salesReps}
            shops={shops}
            isManager={false}
            pageSize={5}
          />
          {mySales.length > 5 && (
            <p className="text-xs text-gray-400 mt-2 text-right">Showing last 5 · All your sales appear in the manager history.</p>
          )}
        </div>

      </div>
    </AppLayout>
  )
}
