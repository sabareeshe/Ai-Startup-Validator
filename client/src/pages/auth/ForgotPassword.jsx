// ============================================================
// pages/auth/ForgotPassword.jsx — Password Reset Request
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiMail, HiLightBulb, HiCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: formData.email });
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />

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
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-white/60 mt-2">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <HiCheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email Sent!</h3>
              <p className="text-white/60 text-sm">
                If an account with that email exists, you'll receive a password reset link shortly.
              </p>
              <Link
                to="/login"
                className="inline-block mt-6 px-6 py-3 rounded-xl font-semibold text-primary-900 bg-white hover:bg-white/90 transition-all"
              >
                Back to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white/80">Email Address</label>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-primary-900 bg-white hover:bg-white/90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
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
