import { useState, useMemo } from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import DateFilter from '../components/DateFilter.jsx'
import SearchBar from '../components/SearchBar.jsx'
import RecentSalesTable from '../components/RecentSalesTable.jsx'
import { useSalesContext } from '../context/SalesContext.jsx'
import { toDateString, isSameDay, lastNDays } from '../utils/dateHelpers.js'

const STATUS_TABS = ['All', 'Pending', 'Approved', 'Rejected']

function matchesDateFilter(sale, preset, customDate) {
  const ts = sale.timestamp
  const today = toDateString()
  if (preset === 'today')  return isSameDay(ts, today)
  if (preset === '7days')  return lastNDays(7).some(d => isSameDay(ts, d))
  if (preset === '30days') return lastNDays(30).some(d => isSameDay(ts, d))
  if (preset === 'custom' && customDate) return isSameDay(ts, customDate)
  return true
}

export default function SalesHistoryPage() {
  const { sales, salesReps, shops, approveSale, rejectSale } = useSalesContext()

  const [dateFilter,  setDateFilter]  = useState('7days')
  const [customDate,  setCustomDate]  = useState('')
  const [search,      setSearch]      = useState('')
  const [statusTab,   setStatusTab]   = useState('All')

  const repMap  = useMemo(() => Object.fromEntries(salesReps.map(r  => [r.id,  r.name])), [salesReps])

  const filtered = useMemo(() => {
    let list = [...sales].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    // Date filter
    list = list.filter(s => matchesDateFilter(s, dateFilter, customDate))

    // Status tab
    if (statusTab !== 'All') list = list.filter(s => s.status === statusTab)

    // Search: product name, SKU, rep name
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(s =>
        s.productName.toLowerCase().includes(q) ||
        s.sku.toLowerCase().includes(q) ||
        (repMap[s.repId] || '').toLowerCase().includes(q)
      )
    }

    return list
  }, [sales, dateFilter, customDate, statusTab, search, repMap])

  // Tab counts
  const counts = useMemo(() => {
    const base = [...sales].filter(s => matchesDateFilter(s, dateFilter, customDate))
    return {
      All:      base.length,
      Pending:  base.filter(s => s.status === 'Pending').length,
      Approved: base.filter(s => s.status === 'Approved').length,
      Rejected: base.filter(s => s.status === 'Rejected').length,
    }
  }, [sales, dateFilter, customDate])

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">

        <div>
          <h1 className="text-xl font-bold text-gray-900">Sales History</h1>
          <p className="text-sm text-gray-500 mt-0.5">Browse and verify all sales records</p>
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <DateFilter
            value={dateFilter}
            onChange={setDateFilter}
            customDate={customDate}
            onCustomDateChange={setCustomDate}
          />
          <div className="sm:w-64">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search product, SKU or rep…"
            />
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
                key={tab}
                type="button"
                onClick={() => setStatusTab(tab)}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors font-medium ${
                  statusTab === tab
                    ? tab === 'Pending'  ? 'bg-amber-500 text-white border-amber-500' :
                      tab === 'Approved' ? 'bg-green-600 text-white border-green-600' :
                      tab === 'Rejected' ? 'bg-red-600   text-white border-red-600'   :
                                           'bg-blue-600  text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
              {tab}
              <span className="ml-1.5 text-xs opacity-80">({counts[tab] ?? 0})</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <RecentSalesTable
          sales={filtered}
          salesReps={salesReps}
          shops={shops}
          isManager
          onApprove={approveSale}
          onReject={rejectSale}
          pageSize={15}
        />

      </div>
    </AppLayout>
  )
}
