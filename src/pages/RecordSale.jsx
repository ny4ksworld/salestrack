import AppLayout from '../components/layout/AppLayout.jsx'
import RecordSaleForm from '../components/forms/RecordSaleForm.jsx'
import { useSalesContext } from '../context/SalesContext.jsx'

export default function RecordSale() {
  const { salesReps, shops, products, currentRep, enqueue, isOnline, queueLength } = useSalesContext()

  function handleSubmit(saleData) {
    enqueue(saleData)
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Record Sale</h1>
        <p className="text-sm text-gray-500 mb-6">
          All submitted sales are pending manager approval.
          {!isOnline && queueLength > 0 && (
            <span className="ml-2 text-amber-600 font-medium">
              ⚠ Offline — {queueLength} sale{queueLength !== 1 ? 's' : ''} queued.
            </span>
          )}
        </p>
        <RecordSaleForm
          salesReps={salesReps}
          shops={shops}
          products={products}
          currentRep={currentRep}
          onSubmit={handleSubmit}
        />
      </div>
    </AppLayout>
  )
}
