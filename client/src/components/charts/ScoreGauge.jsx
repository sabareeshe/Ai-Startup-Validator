// ============================================================
// components/charts/ScoreGauge.jsx — Radial Score Display
// ============================================================

import { motion } from 'framer-motion';

export default function ScoreGauge({ score = 0, label = 'Score', size = 120, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  const getColor = (s) => {
    if (s >= 75) return { stroke: '#22c55e', text: 'text-emerald-500', bg: 'rgba(34,197,94,0.1)' };
    if (s >= 50) return { stroke: '#f59e0b', text: 'text-amber-500', bg: 'rgba(245,158,11,0.1)' };
    return { stroke: '#ef4444', text: 'text-red-500', bg: 'rgba(239,68,68,0.1)' };
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-surface-200 dark:text-surface-700"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`text-2xl font-bold ${color.text}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <span className="text-sm font-medium text-surface-600 dark:text-surface-400">{label}</span>
    </div>
  );
}
