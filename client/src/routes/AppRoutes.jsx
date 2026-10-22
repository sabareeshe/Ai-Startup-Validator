// ============================================================
// routes/AppRoutes.jsx — Application Routes
// ============================================================

import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ProtectedRoute, AdminRoute, GuestRoute } from './ProtectedRoute';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Public & Landing pages
import Landing from '../pages/Landing';
import NotFound from '../pages/NotFound';

// App pages
import Dashboard from '../pages/Dashboard';
import CreateStartup from '../pages/CreateStartup';
import MyStartups from '../pages/MyStartups';
import ReportView from '../pages/ReportView';
import Analytics from '../pages/Analytics';
import ChatAssistant from '../pages/ChatAssistant';
import Profile from '../pages/Profile';
import AdminPanel from '../pages/admin/AdminPanel';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing & Marketing */}
      <Route path="/" element={<Landing />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
      <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />

      {/* Protected Routes with Dashboard Layout */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateStartup />} />
        <Route path="/edit/:id" element={<CreateStartup />} />
        <Route path="/my-startups" element={<MyStartups />} />
        <Route path="/report/:startupId" element={<ReportView />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/chat" element={<ChatAssistant />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      </Route>

      {/* Default fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
