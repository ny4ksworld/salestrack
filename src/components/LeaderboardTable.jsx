/**
 * LeaderboardTable — ranked rep rows with revenue, target progress and rank medals.
 * Props: repStats — [{ repId, name, revenue, target, percent }]
 */
export default function LeaderboardTable({ repStats = [] }) {
  const rank = (i) => {
    if (i === 0) return <span className="text-amber-500 font-bold text-sm">1st</span>
    if (i === 1) return <span className="text-gray-400 font-bold text-sm">2nd</span>
    if (i === 2) return <span className="text-amber-700 font-bold text-sm">3rd</span>
    return <span className="text-gray-400 text-sm font-medium">{i + 1}</span>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      {repStats.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">No data.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-10">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rep</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Revenue</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell w-40">Progress</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">%</th>
            </tr>
          </thead>
          <tbody>
            {repStats.map((r, i) => {
              const barColour =
                r.percent >= 80 ? '#16a34a' :
                r.percent >= 50 ? '#d97706' :
                                  '#dc2626'
              return (
                <tr key={r.repId} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                  <td className="px-4 py-3 text-center">{rank(i)}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{r.name}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800 whitespace-nowrap">
                    KSh {r.revenue.toLocaleString('en-KE')}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-full">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, r.percent)}%`, background: barColour }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell text-xs">{r.percent}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
