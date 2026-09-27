import { useMemo } from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import ShopActivityCard from '../components/cards/ShopActivityCard.jsx'
import { useSalesContext } from '../context/SalesContext.jsx'
import { salesByShop, approvedSales, totalRevenue } from '../utils/calculations.js'

function topProduct(shopSales) {
  if (!shopSales.length) return null
  const tally = {}
  for (const s of approvedSales(shopSales)) {
    tally[s.productName] = (tally[s.productName] || 0) + s.totalAmount
  }
  const entries = Object.entries(tally)
  if (!entries.length) return null
  return entries.sort((a, b) => b[1] - a[1])[0][0]
}

export default function ShopsPage() {
  const { sales, salesReps, shops } = useSalesContext()

  const shopStats = useMemo(() =>
    shops.map(shop => {
      const shopSales = salesByShop(sales, shop.id)
      const repCount  = salesReps.filter(r => r.shopId === shop.id && r.active).length
      return {
        shop,
        repCount,
        revenue:    totalRevenue(shopSales),
        topProduct: topProduct(shopSales),
      }
    }).sort((a, b) => b.revenue - a.revenue),
    [sales, salesReps, shops]
  )

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Shops</h1>
          <p className="text-sm text-gray-500 mt-0.5">{shops.filter(s => s.active).length} active branches</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopStats.map(({ shop, repCount, revenue, topProduct: tp }) => (
            <ShopActivityCard
              key={shop.id}
              shop={shop}
              repCount={repCount}
              revenue={revenue}
              topProduct={tp}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
