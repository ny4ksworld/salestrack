/**
 * RejectModal — simple inline modal for entering rejection reason.
 */
import { useState } from 'react'

export default function RejectModal({ saleName, onConfirm, onCancel }) {
  const [reason, setReason] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-full max-w-sm mx-4">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Reject Sale</h3>
        <p className="text-sm text-gray-500 mb-4">
          Enter a reason for rejecting <span className="font-medium text-gray-700">{saleName}</span>.
        </p>
        <textarea
          autoFocus
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Reason for rejection…"
          rows={3}
          className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
        />
        <div className="flex gap-2 mt-4 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason.trim())}
            className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}
