// ============================================================
// components/reports/ReportCard.jsx — Startup Report Summary Card
// ============================================================

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiEye, HiTrash, HiRefresh, HiDownload, HiChat } from 'react-icons/hi';
import Badge, { ScoreBadge } from '../ui/Badge';

export default function ReportCard({ report, onDelete, onRevalidate, index = 0 }) {
  const navigate = useNavigate();
  const startup = report.startup;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass-card p-5 hover:shadow-xl transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 truncate">
            {startup?.startupName || 'Untitled'}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge color="primary">{startup?.industry || 'Unknown'}</Badge>
            <Badge color="gray">{startup?.startupStage || 'N/A'}</Badge>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 rounded-lg bg-surface-50 dark:bg-surface-800/50">
          <p className="text-xs text-surface-500 mb-1">Innovation</p>
          <p className={`text-lg font-bold ${report.innovationScore >= 75 ? 'text-emerald-500' : report.innovationScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
            {report.innovationScore}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-surface-50 dark:bg-surface-800/50">
          <p className="text-xs text-surface-500 mb-1">Market</p>
          <p className={`text-lg font-bold ${report.marketPotentialScore >= 75 ? 'text-emerald-500' : report.marketPotentialScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
            {report.marketPotentialScore}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-surface-50 dark:bg-surface-800/50">
          <p className="text-xs text-surface-500 mb-1">Success</p>
          <p className={`text-lg font-bold ${report.successProbability >= 75 ? 'text-emerald-500' : report.successProbability >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
            {report.successProbability}%
          </p>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2 mb-4">
        {report.executiveSummary || 'No summary available.'}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-surface-100 dark:border-surface-700/50">
        <button
          onClick={() => navigate(`/report/${report.startup?._id || report.startup}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors"
        >
          <HiEye className="w-4 h-4" /> View
        </button>
        <button
          onClick={() => navigate(`/chat?startup=${report.startup?._id || report.startup}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
        >
          <HiChat className="w-4 h-4" /> Chat
        </button>
        <button
          onClick={() => onRevalidate?.(report.startup?._id || report.startup)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
        >
          <HiRefresh className="w-4 h-4" /> Redo
        </button>
        <button
          onClick={() => window.open(`/api/validations/${report._id}/pdf`, '_blank')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
        >
          <HiDownload className="w-4 h-4" /> PDF
        </button>
        <div className="flex-1" />
        <button
          onClick={() => onDelete?.(report._id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors opacity-0 group-hover:opacity-100"
        >
          <HiTrash className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
