// ============================================================
// pages/NotFound.jsx — 404 Not Found Page
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiLightBulb, HiArrowLeft } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';

export default function NotFound() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-card-strong p-8 text-center rounded-3xl shadow-2xl border border-surface-200 dark:border-surface-700"
      >
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/25">
          <HiLightBulb className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-6xl font-extrabold text-gradient mb-2">404</h1>
        <h2 className="text-xl font-bold mb-3">Page Not Found</h2>
        <p className="text-sm text-surface-600 dark:text-surface-400 mb-8 leading-relaxed">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={user ? '/dashboard' : '/'}
            className="btn-primary text-sm flex items-center justify-center gap-2"
          >
            <HiHome className="w-4 h-4" />
            {user ? 'Go to Dashboard' : 'Back to Home'}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary text-sm flex items-center justify-center gap-2"
          >
            <HiArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
