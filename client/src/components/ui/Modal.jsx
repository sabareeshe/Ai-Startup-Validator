// ============================================================
// components/ui/Modal.jsx — Modal Dialog Component
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative ${maxWidth} w-full glass-card-strong p-6 z-10 max-h-[90vh] overflow-y-auto`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
