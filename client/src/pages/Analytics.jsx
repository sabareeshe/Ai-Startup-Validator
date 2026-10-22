// ============================================================
// pages/Analytics.jsx — Analytics Dashboard
// ============================================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiChartBar, HiTrendingUp, HiLightBulb, HiShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';
import Card from '../components/ui/Card';
import ScoreGauge from '../components/charts/ScoreGauge';
import IndustryChart from '../components/charts/IndustryChart';
import TrendChart from '../components/charts/TrendChart';
import { SkeletonStats } from '../components/ui/LoadingSkeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SCORE_COLORS = ['#ef4444', '#f59e0b', '#f59e0b', '#22c55e', '#22c55e'];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/analytics');
      setAnalytics(data.analytics);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="space-y-6"><SkeletonStats /><SkeletonStats /></div>;

  if (!analytics || analytics.totalValidations === 0) {
    return (
      <Card className="text-center py-16">
        <HiChartBar className="w-16 h-16 mx-auto mb-4 text-surface-300" />
        <h2 className="text-xl font-semibold mb-2">No Analytics Data Yet</h2>
        <p className="text-surface-500">Validate some startups to see analytics here.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Startups', value: analytics.totalStartups, icon: HiLightBulb, color: 'from-primary-500 to-primary-600' },
          { label: 'Total Validations', value: analytics.totalValidations, icon: HiChartBar, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Avg Innovation', value: `${analytics.avgScores.innovation}/100`, icon: HiTrendingUp, color: 'from-amber-500 to-amber-600' },
          { label: 'Avg Success Rate', value: `${analytics.avgScores.successProbability}%`, icon: HiShieldCheck, color: 'from-blue-500 to-blue-600' },
        ].map((stat, i) => (
          <Card key={stat.label} delay={i * 0.1}>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-surface-500">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Score Gauges */}
      <Card delay={0.5}>
        <h2 className="text-lg font-semibold mb-6">Average Scores</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
          <ScoreGauge score={analytics.avgScores.innovation} label="Innovation" />
          <ScoreGauge score={analytics.avgScores.market} label="Market" />
          <ScoreGauge score={analytics.avgScores.scalability} label="Scalability" />
          <ScoreGauge score={analytics.avgScores.investorReadiness} label="Investor" />
          <ScoreGauge score={analytics.avgScores.successProbability} label="Success" />
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Validation Trends */}
        <Card delay={0.6}>
          <h2 className="text-lg font-semibold mb-4">Validation Trends</h2>
          <TrendChart data={analytics.monthlyValidations} dataKey="count" label="Validations" />
        </Card>

        {/* Industry Distribution */}
        <Card delay={0.7}>
          <h2 className="text-lg font-semibold mb-4">Industry Distribution</h2>
          <IndustryChart data={analytics.industryDistribution} />
        </Card>
      </div>

      {/* Score Distribution & Stage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card delay={0.8}>
          <h2 className="text-lg font-semibold mb-4">Score Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.scoreDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={1200}>
                {analytics.scoreDistribution.map((_, i) => (
                  <Cell key={i} fill={SCORE_COLORS[i % SCORE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Stage Distribution */}
        <Card delay={0.9}>
          <h2 className="text-lg font-semibold mb-4">Startup Stages</h2>
          <div className="space-y-4">
            {analytics.stageDistribution.map((stage, i) => {
              const maxCount = Math.max(...analytics.stageDistribution.map((s) => s.count));
              const pct = (stage.count / maxCount) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-surface-500">{stage.count}</span>
                  </div>
                  <div className="h-3 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.9 + i * 0.1 }}
                      className="h-full rounded-full gradient-primary"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
