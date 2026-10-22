// ============================================================
// pages/auth/Login.jsx — Login Page
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiLightBulb } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative floating shapes */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

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
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/60 mt-2">Sign in to AI Startup Validator</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/80">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 focus:border-white/40 outline-none transition-all"
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
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 focus:border-white/40 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-sm text-red-300">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-white/60 hover:text-white transition-colors">
                Forgot password?
              </Link>
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-white/50 mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
