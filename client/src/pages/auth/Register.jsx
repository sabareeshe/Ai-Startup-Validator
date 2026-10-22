// ============================================================
// pages/auth/Register.jsx — Registration Page
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiLockClosed, HiLightBulb } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  // Password strength indicator
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
    setLoading(true);
    try {
      await registerUser(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 focus:border-white/40 outline-none transition-all";

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mx-auto mb-4 border border-white/20"
          >
            <HiLightBulb className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-white/60 mt-2">Start validating your startup ideas</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/80">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  {...register('name', { required: 'Name is required' })}
                  className={inputClass}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-sm text-red-300">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/80">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-sm text-red-300">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/80">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-sm text-red-300">{errors.password.message}</p>}
              {/* Strength Indicator */}
              {password && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i < strength.level ? strength.color : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white/60">{strength.label}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/80">Confirm Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  {...register('confirmPassword', { required: 'Please confirm password', validate: (val) => val === password || 'Passwords do not match' })}
                  className={inputClass}
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
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : null}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-white/50 mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
