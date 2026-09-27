/**
 * WhatsAppSummary — shows the plain-text daily summary with a Copy button.
 * Props: text (string from buildWhatsAppSummary)
 */
import { useState } from 'react'

export default function WhatsAppSummary({ text }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">WhatsApp Daily Summary</h3>
        <button
          type="button"
          onClick={handleCopy}
          className={`text-xs px-3 py-1.5 rounded-md border transition-colors font-medium ${
            copied
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
          }`}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="text-xs text-gray-600 bg-gray-50 rounded-md p-3 whitespace-pre-wrap break-words font-mono leading-relaxed border border-gray-100">
        {text || 'No approved sales today.'}
      </pre>
    </div>
  )
}
