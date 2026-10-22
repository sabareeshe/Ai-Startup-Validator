// ============================================================
// components/reports/SWOTCard.jsx — SWOT Analysis Display
// ============================================================

import { motion } from 'framer-motion';
import { HiShieldCheck, HiExclamation, HiLightningBolt, HiTrendingUp } from 'react-icons/hi';

const swotConfig = {
  strengths: {
    title: 'Strengths',
    icon: HiShieldCheck,
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  weaknesses: {
    title: 'Weaknesses',
    icon: HiExclamation,
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
  },
  opportunities: {
    title: 'Opportunities',
    icon: HiTrendingUp,
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  threats: {
    title: 'Threats',
    icon: HiLightningBolt,
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
};

export default function SWOTCard({ type, items = [] }) {
  const config = swotConfig[type];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border ${config.border} ${config.bg} p-5`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h4 className={`font-semibold ${config.text}`}>{config.title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-gradient-to-br ${config.gradient}`} />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
