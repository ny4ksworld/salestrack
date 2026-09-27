/**
 * DateFilter — preset date range picker.
 * Props:
 *   value: 'today' | '7days' | '30days' | 'custom'
 *   onChange(preset, customDate?)
 *   customDate: 'YYYY-MM-DD' string (used when value === 'custom')
 *   onCustomDateChange(dateStr)
 */
const PRESETS = [
  { key: 'today',  label: 'Today'   },
  { key: '7days',  label: '7 Days'  },
  { key: '30days', label: '30 Days' },
  { key: 'custom', label: 'Custom'  },
]

export default function DateFilter({ value, onChange, customDate, onCustomDateChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map(p => (
        <button
          key={p.key}
          type="button"
          onClick={() => onChange(p.key)}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors font-medium ${
            value === p.key
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {p.label}
        </button>
      ))}
      {value === 'custom' && (
        <input
          type="date"
          value={customDate || ''}
          onChange={e => onCustomDateChange(e.target.value)}
          className="px-2 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
        />
      )}
    </div>
  )
}
