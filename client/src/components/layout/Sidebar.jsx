// ============================================================
// components/layout/Sidebar.jsx — Navigation Sidebar
// ============================================================

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome, HiLightBulb, HiDocumentReport, HiChartBar,
  HiChat, HiUser, HiCog, HiChevronLeft, HiChevronRight,
  HiPlusCircle, HiShieldCheck,
} from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { path: '/dashboard', icon: HiHome, label: 'Dashboard' },
  { path: '/create', icon: HiPlusCircle, label: 'New Startup' },
  { path: '/my-startups', icon: HiLightBulb, label: 'My Startups' },
  { path: '/analytics', icon: HiChartBar, label: 'Analytics' },
  { path: '/chat', icon: HiChat, label: 'AI Chat' },
  { path: '/profile', icon: HiUser, label: 'Profile' },
];

const adminItems = [
  { path: '/admin', icon: HiShieldCheck, label: 'Admin Panel' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { isAdmin } = useAuth();
  const location = useLocation();

  const items = isAdmin ? [...navItems, ...adminItems] : navItems;

  return (
    <>
      {/* Mobile Sidebar Overlay — handled by DashboardLayout */}
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-r border-surface-200 dark:border-surface-800 z-30"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-surface-200 dark:border-surface-800">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <HiLightBulb className="w-6 h-6 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden"
              >
                <h1 className="text-lg font-bold text-gradient whitespace-nowrap">StartupAI</h1>
                <p className="text-xs text-surface-500 whitespace-nowrap">Validator</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800/50'
                }`
              }
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${
                location.pathname === item.path ? 'text-primary-500' : 'group-hover:text-primary-500'
              } transition-colors`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="px-3 py-4 border-t border-surface-200 dark:border-surface-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            {collapsed ? <HiChevronRight className="w-5 h-5" /> : <HiChevronLeft className="w-5 h-5" />}
            {!collapsed && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
