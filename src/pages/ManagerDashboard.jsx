import { useMemo } from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import StatCard from '../components/cards/StatCard.jsx'
import RecentSalesTable from '../components/RecentSalesTable.jsx'
import LeaderboardTable from '../components/LeaderboardTable.jsx'
import WhatsAppSummary from '../components/WhatsAppSummary.jsx'
import SalesOverTimeChart from '../components/charts/SalesOverTimeChart.jsx'
import SalesByRepChart from '../components/charts/SalesByRepChart.jsx'
import SalesByShopChart from '../components/charts/SalesByShopChart.jsx'
import { useSalesContext } from '../context/SalesContext.jsx'
import {
  approvedSales, pendingSales, todaySales,
  totalRevenue, activeRepsToday, revenueByDay,
  revenueByRep, revenueByShop, repTargetProgress,
  buildWhatsAppSummary,
} from '../utils/calculations.js'
import { formatCurrencyCompact } from '../utils/formatCurrency.js'

export default function ManagerDashboard() {
  const { sales, salesReps, shops, approveSale, rejectSale } = useSalesContext()

  const stats = useMemo(() => ({
    todayRevenue:   totalRevenue(todaySales(sales).filter(s => s.status === 'Approved'), false),
    totalApproved:  approvedSales(sales).length,
    pending:        pendingSales(sales).length,
    activeReps:     activeRepsToday(sales, salesReps),
  }), [sales, salesReps])

  const timeData  = useMemo(() => revenueByDay(sales, 7), [sales])
  const repData   = useMemo(() => revenueByRep(sales, salesReps), [sales, salesReps])
  const shopData  = useMemo(() => revenueByShop(sales, shops), [sales, shops])

  const repStats  = useMemo(() =>
    repData.map(r => {
      const rep = salesReps.find(sr => sr.id === r.repId)
      const prog = rep ? repTargetProgress(sales, rep) : { revenue: r.revenue, target: 0, percent: 0 }
      return { ...r, ...prog }
    }),
    [repData, sales, salesReps]
  )

  // Pending sales first, then rest sorted newest-first
  const sortedSales = useMemo(() => {
    const pending  = sales.filter(s => s.status === 'Pending').sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    const rest     = sales.filter(s => s.status !== 'Pending').sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    return [...pending, ...rest]
  }, [sales])

  const whatsappText = useMemo(() => buildWhatsAppSummary(sales, salesReps, shops), [sales, salesReps, shops])

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Page title */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of all sales activity</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="💰"
            label="Today's Revenue"
            value={formatCurrencyCompact(stats.todayRevenue)}
            sub="Approved sales only"
          />
          <StatCard
            icon="✅"
            label="Total Approved"
            value={stats.totalApproved}
            sub="All-time approved sales"
            accent="text-green-700"
          />
          <StatCard
            icon="⏳"
            label="Pending Review"
            value={stats.pending}
            sub={stats.pending > 0 ? 'Action required' : 'All clear'}
            accent={stats.pending > 0 ? 'text-amber-600' : 'text-gray-500'}
          />
          <StatCard
            icon="👥"
            label="Active Reps Today"
            value={stats.activeReps}
            sub={`of ${salesReps.filter(r => r.active).length} active reps`}
          />
        </div>

        {/* Pending alert banner */}
        {stats.pending > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
            <span className="text-amber-600 font-bold text-sm">!</span>
            <p className="text-sm font-medium text-amber-800">
              {stats.pending} sale{stats.pending !== 1 ? 's' : ''} pending your review — scroll down to approve or reject.
            </p>
          </div>
        )}

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <SalesOverTimeChart data={timeData} />
          </div>
          <SalesByShopChart data={shopData} />
        </div>

        {/* Rep performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Rep Leaderboard</h2>
            <LeaderboardTable repStats={repStats} />
          </div>
          <SalesByRepChart data={repData} />
        </div>

        {/* Sales table — pending first */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            All Sales
            {stats.pending > 0 && (
              <span className="ml-2 text-xs bg-amber-100 text-amber-700 border border-amber-300 px-1.5 py-0.5 rounded-full font-semibold">
                {stats.pending} pending
              </span>
            )}
          </h2>
          <RecentSalesTable
            sales={sortedSales}
            salesReps={salesReps}
            shops={shops}
            isManager
            onApprove={approveSale}
            onReject={rejectSale}
          />
        </div>

        {/* WhatsApp summary */}
        <WhatsAppSummary text={whatsappText} />

      </div>
    </AppLayout>
  )
}
