import { useMemo } from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import SalespersonCard from '../components/cards/SalespersonCard.jsx'
import { useSalesContext } from '../context/SalesContext.jsx'
import { salesByRep, approvedSales, repTargetProgress } from '../utils/calculations.js'

export default function SalespersonsPage() {
  const { sales, salesReps, shops } = useSalesContext()

  const shopMap = useMemo(
    () => Object.fromEntries(shops.map(s => [s.id, s.name])),
    [shops]
  )

  const repStats = useMemo(() =>
    salesReps.map(rep => {
      const repSales   = salesByRep(sales, rep.id)
      const approved   = approvedSales(repSales)
      const { revenue, percent } = repTargetProgress(sales, rep)
      return {
        rep,
        shopName:   shopMap[rep.shopId] || rep.shopId,
        revenue,
        salesCount: approved.length,
        target:     rep.target,
        percent,
      }
    }).sort((a, b) => b.revenue - a.revenue),
    [sales, salesReps, shopMap]
  )

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Salespersons</h1>
          <p className="text-sm text-gray-500 mt-0.5">{salesReps.filter(r => r.active).length} active reps across {shops.length} shops</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {repStats.map(({ rep, shopName, revenue, salesCount, target, percent }) => (
            <SalespersonCard
              key={rep.id}
              rep={rep}
              shopName={shopName}
              revenue={revenue}
              salesCount={salesCount}
              target={target}
              percent={percent}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
