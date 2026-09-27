/**
 * StatusBadge — inline status chip for sale status.
 */
export function StatusBadge({ status }) {
  const styles = {
    Pending:  'bg-amber-50 text-amber-700 border-amber-200',
    Approved: 'bg-green-50 text-green-700 border-green-200',
    Rejected: 'bg-red-50  text-red-700   border-red-200',
  }
  const labels = { Pending: 'Pending', Approved: 'Approved', Rejected: 'Rejected' }
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {labels[status] || status}
    </span>
  )
}
