// ============================================================
// components/layout/DashboardLayout.jsx — Main App Layout
// ============================================================

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HiHome, HiLightBulb, HiChartBar,
  HiChat, HiUser, HiPlusCircle, HiShieldCheck, HiX,
} from 'react-icons/hi';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../hooks/useAuth';

const mobileNavItems = [
  { path: '/dashboard', icon: HiHome, label: 'Dashboard' },
  { path: '/create', icon: HiPlusCircle, label: 'New Startup' },
  { path: '/my-startups', icon: HiLightBulb, label: 'My Startups' },
  { path: '/analytics', icon: HiChartBar, label: 'Analytics' },
  { path: '/chat', icon: HiChat, label: 'AI Chat' },
  { path: '/profile', icon: HiUser, label: 'Profile' },
];

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin } = useAuth();
  const location = useLocation();

  const items = isAdmin
    ? [...mobileNavItems, { path: '/admin', icon: HiShieldCheck, label: 'Admin' }]
    : mobileNavItems;

  return (
    <div className="flex min-h-screen gradient-mesh">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-surface-900 z-50 lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-surface-200 dark:border-surface-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <HiLightBulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gradient">StartupAI</h1>
                    <p className="text-xs text-surface-500">Validator</p>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
                  <HiX className="w-5 h-5" />
                </button>
              </div>
              <nav className="px-3 py-4 space-y-1">
                {items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400'
                          : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800/50'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
