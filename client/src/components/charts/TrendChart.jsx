// ============================================================
// components/charts/TrendChart.jsx — Validation Trends Line Chart
// ============================================================

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function TrendChart({ data = [], dataKey = 'count', color = '#6366f1', label = 'Validations' }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-surface-400">
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            padding: '12px 16px',
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={3}
          fill={`url(#gradient-${dataKey})`}
          name={label}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
