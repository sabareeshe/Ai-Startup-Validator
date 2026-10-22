// ============================================================
// pages/Dashboard.jsx — Main Dashboard
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLightBulb, HiDocumentReport, HiTrendingUp, HiChartBar, HiPlusCircle, HiArrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';
import Card from '../components/ui/Card';
import { SkeletonStats, SkeletonCard } from '../components/ui/LoadingSkeleton';
import Badge from '../components/ui/Badge';
import ScoreGauge from '../components/charts/ScoreGauge';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/analytics');
      setAnalytics(data.analytics);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = analytics ? [
    {
      label: 'Total Startups',
      value: analytics.totalStartups,
      icon: HiLightBulb,
      gradient: 'from-primary-500 to-primary-600',
      bgLight: 'bg-primary-50 dark:bg-primary-950/30',
    },
    {
      label: 'Validation Reports',
      value: analytics.totalValidations,
      icon: HiDocumentReport,
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      label: 'Avg Innovation Score',
      value: analytics.avgScores?.innovation || 0,
      icon: HiTrendingUp,
      gradient: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50 dark:bg-amber-950/30',
      suffix: '/100',
    },
    {
      label: 'Success Rate',
      value: analytics.avgScores?.successProbability || 0,
      icon: HiChartBar,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50 dark:bg-blue-950/30',
      suffix: '%',
    },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-surface-100"
          >
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
          </motion.h1>
          <p className="text-surface-500 mt-1">Here's an overview of your startup validations</p>
        </div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/create')}
          className="btn-primary flex items-center gap-2"
        >
          <HiPlusCircle className="w-5 h-5" />
          New Startup
        </motion.button>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <SkeletonStats />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={stat.label} delay={i * 0.1} className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${stat.bgLight} -translate-y-6 translate-x-6 blur-md`} />
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-surface-500 dark:text-surface-400">{stat.label}</p>
                <p className="text-3xl font-bold text-surface-900 dark:text-surface-100 mt-1">
                  {stat.value}{stat.suffix || ''}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Score Gauges & Recent Validations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Overview */}
        <Card delay={0.5} className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-6">Average Scores</h3>
          {analytics ? (
            <div className="grid grid-cols-2 gap-6">
              <ScoreGauge score={analytics.avgScores?.innovation || 0} label="Innovation" size={100} />
              <ScoreGauge score={analytics.avgScores?.market || 0} label="Market" size={100} />
              <ScoreGauge score={analytics.avgScores?.scalability || 0} label="Scalability" size={100} />
              <ScoreGauge score={analytics.avgScores?.investorReadiness || 0} label="Investor" size={100} />
            </div>
          ) : (
            <div className="text-center py-8 text-surface-400">
              <p>No data yet. Create your first startup!</p>
            </div>
          )}
        </Card>

        {/* Recent Validations */}
        <Card delay={0.6} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Validations</h3>
            <button
              onClick={() => navigate('/my-startups')}
              className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1 font-medium"
            >
              View All <HiArrowRight className="w-4 h-4" />
            </button>
          </div>
          {analytics?.recentValidations?.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentValidations.map((report, i) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  onClick={() => navigate(`/report/${report.startup?._id}`)}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                      <HiLightBulb className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{report.startup?.startupName || 'Untitled'}</p>
                      <p className="text-xs text-surface-500">{report.startup?.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-lg font-bold ${report.innovationScore >= 75 ? 'text-emerald-500' : report.innovationScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {report.innovationScore}
                      </p>
                      <p className="text-xs text-surface-500">Score</p>
                    </div>
                    <HiArrowRight className="w-4 h-4 text-surface-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-surface-400">
              <HiDocumentReport className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No validations yet</p>
              <button
                onClick={() => navigate('/create')}
                className="mt-3 text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                Create your first startup →
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card delay={0.8}>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Validate New Idea', desc: 'Get AI-powered analysis', icon: HiLightBulb, path: '/create', gradient: 'from-primary-500 to-primary-600' },
            { label: 'View Analytics', desc: 'Track your performance', icon: HiChartBar, path: '/analytics', gradient: 'from-emerald-500 to-emerald-600' },
            { label: 'Ask AI Assistant', desc: 'Get business advice', icon: '🤖', path: '/chat', gradient: 'from-blue-500 to-blue-600', isEmoji: true },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all text-left group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center flex-shrink-0`}>
                {action.isEmoji ? (
                  <span className="text-xl">{action.icon}</span>
                ) : (
                  <action.icon className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <p className="font-medium group-hover:text-primary-500 transition-colors">{action.label}</p>
                <p className="text-xs text-surface-500">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
