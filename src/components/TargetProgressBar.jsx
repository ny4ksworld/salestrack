/**
 * TargetProgressBar — shows approved revenue vs monthly target.
 * Props: revenue (number), target (number), percent (0–100)
 */
export default function TargetProgressBar({ revenue, target, percent }) {
  const barColour =
    percent >= 80 ? '#16a34a' :
    percent >= 50 ? '#d97706' :
                   '#dc2626'

  const textColour =
    percent >= 80 ? 'text-green-700' :
    percent >= 50 ? 'text-amber-700' :
                   'text-red-700'

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-600 text-xs">Monthly target</span>
        <span className={`font-semibold text-xs ${textColour}`}>{percent}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, percent)}%`, background: barColour }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1.5">
        <span>KSh {revenue.toLocaleString('en-KE')}</span>
        <span>KSh {target.toLocaleString('en-KE')}</span>
      </div>
    </div>
  )
}
