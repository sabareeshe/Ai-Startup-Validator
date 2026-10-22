// ============================================================
// components/ui/ThemeToggle.jsx — Dark/Light Mode Toggle
// ============================================================

import { useContext } from 'react';
import { motion } from 'framer-motion';
import { HiSun, HiMoon } from 'react-icons/hi';
import { ThemeContext } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <HiSun className="w-5 h-5 text-amber-400" />
        ) : (
          <HiMoon className="w-5 h-5 text-primary-600" />
        )}
      </motion.div>
    </motion.button>
  );
}
