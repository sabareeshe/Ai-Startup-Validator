// ============================================================
// components/layout/Header.jsx — Top Navigation Header
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiSearch, HiBell, HiLogout, HiUser, HiCog } from 'react-icons/hi';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Left: Mobile menu + Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <HiMenu className="w-6 h-6" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1.5 pr-4 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{user?.name}</p>
                <p className="text-xs text-surface-500">{user?.role}</p>
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 glass-card-strong py-2 z-50 shadow-2xl"
                  >
                    <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-700">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-surface-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                    >
                      <HiUser className="w-4 h-4" /> Profile
                    </button>
                    <hr className="my-1 border-surface-200 dark:border-surface-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <HiLogout className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
