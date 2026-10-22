// ============================================================
// pages/Profile.jsx — User Profile Management
// ============================================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiLockClosed, HiShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: profileErrors } } = useForm({
    defaultValues: { name: user?.name, email: user?.email },
  });

  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd, formState: { errors: pwdErrors } } = useForm();

  const onUpdateProfile = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', formData);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.put('/users/change-password', formData);
      // Update token
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      resetPwd();
      toast.success('Password changed!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Avatar & Info Card */}
      <Card delay={0.1}>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-surface-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                <HiShieldCheck className="w-3.5 h-3.5" /> {user?.role}
              </span>
              <span className="text-xs text-surface-500">
                Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass-card rounded-xl w-fit">
        {['profile', 'password'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === t
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            {t === 'profile' ? 'Edit Profile' : 'Change Password'}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <Card delay={0.2}>
          <form onSubmit={handleProfile(onUpdateProfile)} className="space-y-5">
            <Input
              label="Full Name"
              icon={HiUser}
              error={profileErrors.name?.message}
              {...regProfile('name', { required: 'Name is required' })}
            />
            <Input
              label="Email"
              type="email"
              icon={HiMail}
              error={profileErrors.email?.message}
              {...regProfile('email', { required: 'Email is required' })}
            />
            <div className="flex justify-end">
              <Button type="submit" loading={loading}>Save Changes</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Password Tab */}
      {tab === 'password' && (
        <Card delay={0.2}>
          <form onSubmit={handlePwd(onChangePassword)} className="space-y-5">
            <Input
              label="Current Password"
              type="password"
              icon={HiLockClosed}
              error={pwdErrors.currentPassword?.message}
              {...regPwd('currentPassword', { required: 'Current password is required' })}
            />
            <Input
              label="New Password"
              type="password"
              icon={HiLockClosed}
              error={pwdErrors.newPassword?.message}
              {...regPwd('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
            />
            <div className="flex justify-end">
              <Button type="submit" loading={loading}>Change Password</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
