// ============================================================
// pages/admin/AdminPanel.jsx — Admin Dashboard
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUsers, HiLightBulb, HiDocumentReport, HiTrash, HiSearch, HiChartBar, HiShieldCheck, HiEye } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import IndustryChart from '../../components/charts/IndustryChart';
import { SkeletonStats, SkeletonTable } from '../../components/ui/LoadingSkeleton';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');
  const [searchStartup, setSearchStartup] = useState('');
  const [deleteStartupId, setDeleteStartupId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => { fetchAdminData(); }, []);

  const fetchAdminData = async () => {
    try {
      const [analyticsRes, usersRes, startupsRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
        api.get('/admin/startups'),
      ]);
      setAnalytics(analyticsRes.data.analytics);
      setUsers(usersRes.data.users);
      setStartups(startupsRes.data.startups);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStartup = async () => {
    try {
      await api.delete(`/admin/startups/${deleteStartupId}`);
      setStartups((prev) => prev.filter((s) => s._id !== deleteStartupId));
      toast.success('Startup deleted by admin');
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setDeleteStartupId(null);
    }
  };

  const handleToggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/admin/users/${u.id}/role`, { role: newRole });
      setUsers((prev) => prev.map((item) => (item.id === u.id ? { ...item, role: newRole } : item)));
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/admin/users/${deleteUserId}`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
      // Also remove startups belonging to this user
      setStartups((prev) => prev.filter((s) => s.user?._id !== deleteUserId));
      toast.success('User and data deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteUserId(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredStartups = startups.filter((s) =>
    s.startupName.toLowerCase().includes(searchStartup.toLowerCase())
  );

  if (loading) return <div className="space-y-6"><SkeletonStats /><SkeletonTable /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass-card rounded-xl w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: HiChartBar },
          { id: 'users', label: 'Users', icon: HiUsers },
          { id: 'startups', label: 'Startups', icon: HiLightBulb },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <HiUsers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-surface-500">Total Users</p>
                  <p className="text-2xl font-bold">{analytics.totalUsers}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <HiLightBulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-surface-500">Total Startups</p>
                  <p className="text-2xl font-bold">{analytics.totalStartups}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <HiDocumentReport className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-surface-500">Total Validations</p>
                  <p className="text-2xl font-bold">{analytics.totalValidations}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Popular Industries</h3>
            <IndustryChart data={analytics.popularIndustries} />
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Card animate={false} hover={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700">
                    <th className="text-left py-3 px-4 font-semibold text-surface-500">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-500">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-500">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-500">Startups</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-500">Validations</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-500">Joined</th>
                    <th className="text-right py-3 px-4 font-semibold text-surface-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50">
                      <td className="py-3 px-4 font-medium">{u.name}</td>
                      <td className="py-3 px-4 text-surface-500">{u.email}</td>
                      <td className="py-3 px-4"><Badge color={u.role === 'admin' ? 'purple' : 'gray'}>{u.role}</Badge></td>
                      <td className="py-3 px-4">{u.startupCount}</td>
                      <td className="py-3 px-4">{u.validationCount}</td>
                      <td className="py-3 px-4 text-surface-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleRole(u)}
                            className="px-2.5 py-1 text-xs rounded-lg font-medium border border-surface-300 dark:border-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                            title={u.role === 'admin' ? 'Demote to regular user' : 'Promote to administrator'}
                          >
                            {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => setDeleteUserId(u.id)}
                            className="p-1.5 text-xs rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Delete user"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Startups Tab */}
      {tab === 'startups' && (
        <div className="space-y-4">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search startups..."
              value={searchStartup}
              onChange={(e) => setSearchStartup(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Card animate={false} hover={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700">
                    <th className="text-left py-3 px-4 font-semibold text-surface-500">Startup</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-500">Industry</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-500">Owner</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-500">Stage</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-500">Validated</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStartups.map((s) => (
                    <tr key={s._id} className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50">
                      <td className="py-3 px-4 font-medium">{s.startupName}</td>
                      <td className="py-3 px-4"><Badge color="primary">{s.industry}</Badge></td>
                      <td className="py-3 px-4 text-surface-500">{s.user?.name || 'Unknown'}</td>
                      <td className="py-3 px-4">{s.startupStage}</td>
                      <td className="py-3 px-4">{s.isValidated ? <Badge color="green">Yes</Badge> : <Badge color="gray">No</Badge>}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {s.isValidated && (
                            <button
                              onClick={() => navigate(`/report/${s._id}`)}
                              className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
                              title="View Validation Report"
                            >
                              <HiEye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteStartupId(s._id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Delete Startup"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Startup Confirmation */}
      <Modal isOpen={!!deleteStartupId} onClose={() => setDeleteStartupId(null)} title="Admin: Delete Startup">
        <p className="text-surface-600 dark:text-surface-400 mb-6">
          Are you sure you want to delete this startup and all associated data? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteStartupId(null)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleDeleteStartup} className="btn-danger text-sm">Delete Startup</button>
        </div>
      </Modal>

      {/* Delete User Confirmation */}
      <Modal isOpen={!!deleteUserId} onClose={() => setDeleteUserId(null)} title="Admin: Delete User Account">
        <p className="text-surface-600 dark:text-surface-400 mb-6">
          Are you sure you want to delete this user? All their startups, validation reports, and chat sessions will also be permanently deleted.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteUserId(null)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleDeleteUser} className="btn-danger text-sm">Delete User & Data</button>
        </div>
      </Modal>
    </div>
  );
}
