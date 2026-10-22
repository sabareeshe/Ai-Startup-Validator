// ============================================================
// components/ui/Badge.jsx — Badge / Tag Component
// ============================================================

const colorMap = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  yellow: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  gray: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
};

export default function Badge({ children, color = 'primary', className = '' }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorMap[color] || colorMap.primary} ${className}`}>
      {children}
    </span>
  );
}

/** Returns color based on score value */
export function getScoreColor(score) {
  if (score >= 75) return 'green';
  if (score >= 50) return 'yellow';
  return 'red';
}

export function ScoreBadge({ score, label }) {
  const color = getScoreColor(score);
  return (
    <Badge color={color}>
      {label ? `${label}: ` : ''}{score}/100
    </Badge>
  );
}
