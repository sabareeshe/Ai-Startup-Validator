// ============================================================
// components/charts/IndustryChart.jsx — Industry Distribution
// ============================================================

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#64748b'];

export default function IndustryChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-surface-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={4}
          dataKey="count"
          nameKey="industry"
          animationBegin={0}
          animationDuration={1200}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            padding: '12px 16px',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
