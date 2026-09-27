/**
 * SalesByShopChart — pie chart of revenue per shop.
 * Props: data — [{ shopId, name, revenue }]
 */
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts'

const COLOURS = ['#2563eb', '#0891b2', '#059669']

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm px-3 py-2 text-sm">
      <p className="text-gray-500 text-xs mb-0.5">{payload[0].name}</p>
      <p className="font-semibold text-gray-800">KSh {payload[0].value.toLocaleString('en-KE')}</p>
    </div>
  )
}

export default function SalesByShopChart({ data = [] }) {
  const nonZero = data.filter(d => d.revenue > 0)
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Revenue by Shop</h3>
      {nonZero.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">No data.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={nonZero}
              dataKey="revenue"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={72}
              label={false}
              labelLine={false}
            >
              {nonZero.map((_, i) => (
                <Cell key={i} fill={COLOURS[i % COLOURS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconSize={8}
              iconType="circle"
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              formatter={(value) => (
                <span style={{ color: '#374151' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
