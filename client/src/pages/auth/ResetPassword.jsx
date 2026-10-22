// ============================================================
// pages/auth/ResetPassword.jsx — Password Reset Form
// ============================================================

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiLockClosed, HiLightBulb, HiCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  // Password strength meter
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { level: score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { level: score, label: 'Fair', color: 'bg-amber-500' };
    return { level: score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const onSubmit = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password: formData.password });
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mx-auto mb-4 border border-white/20"
          >
            <HiLightBulb className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white">New Password</h1>
          <p className="text-white/60 mt-2">Enter your new secure password</p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <HiCheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Password Updated!</h3>
              <p className="text-white/60 text-sm mb-6">
                Your password has been changed successfully. Redirecting to login...
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 rounded-xl font-semibold text-primary-900 bg-white hover:bg-white/90 transition-all"
              >
                Go to Login Now
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white/80">New Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 focus:border-white/40 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="text-sm text-red-300">{errors.password.message}</p>}

                {/* Password strength meter */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i <= strength.level ? strength.color : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-white/50">Strength: {strength.label}</p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white/80">Confirm Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    {...register('confirmPassword', {
                      required: 'Please confirm password',
                      validate: (v) => v === password || 'Passwords do not match',
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 focus:border-white/40 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-300">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-primary-900 bg-white hover:bg-white/90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>

              <p className="text-center text-white/50 text-sm">
                Remember your password?{' '}
                <Link to="/login" className="text-white font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
