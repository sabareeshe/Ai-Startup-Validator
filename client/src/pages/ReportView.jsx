// ============================================================
// pages/ReportView.jsx — Full Validation Report
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowLeft, HiDownload, HiChat, HiRefresh, HiLightBulb,
  HiExclamation, HiCheckCircle, HiTrendingUp, HiCode, HiCurrencyDollar,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ScoreGauge from '../components/charts/ScoreGauge';
import SWOTCard from '../components/reports/SWOTCard';
import { SkeletonReport } from '../components/ui/LoadingSkeleton';

export default function ReportView() {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const [downloading, setDownloading] = useState(false);

  useEffect(() => { fetchReport(); }, [startupId]);

  const fetchReport = async () => {
    try {
      const { data } = await api.get(`/validations/${startupId}/report`);
      setReport(data.report);
    } catch (error) {
      toast.error('Report not found');
      navigate('/my-startups');
    } finally {
      setLoading(false);
    }
  };

  const handleRevalidate = async () => {
    try {
      toast.loading('Re-analyzing with AI...', { id: 'reval' });
      const { data } = await api.post(`/validations/${startupId}`);
      setReport(data.report);
      toast.success('Report updated!', { id: 'reval' });
    } catch (error) {
      toast.error('Revalidation failed', { id: 'reval' });
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    toast.loading('Generating PDF report...', { id: 'pdf' });
    try {
      const response = await api.get(`/validations/${report._id}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const cleanName = (startup?.startupName || 'Startup').replace(/[^a-z0-9]/gi, '_');
      link.download = `${cleanName}_Validation_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded!', { id: 'pdf' });
    } catch (err) {
      const token = localStorage.getItem('token');
      if (token) {
        window.open(`/api/validations/${report._id}/pdf?token=${token}`, '_blank');
        toast.dismiss('pdf');
      } else {
        toast.error('Failed to download PDF', { id: 'pdf' });
      }
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <SkeletonReport />;
  if (!report) return null;

  const startup = report.startup;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{startup?.startupName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge color="primary">{startup?.industry}</Badge>
              <Badge color="gray">{startup?.startupStage}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/chat?startup=${startupId}`)} className="btn-secondary text-sm flex items-center gap-2">
            <HiChat className="w-4 h-4" /> Ask AI
          </button>
          <button onClick={handleRevalidate} className="btn-secondary text-sm flex items-center gap-2">
            <HiRefresh className="w-4 h-4" /> Revalidate
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <HiDownload className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
            {downloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Score Summary */}
      <Card delay={0.1}>
        <h2 className="text-lg font-semibold mb-6">Score Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          <ScoreGauge score={report.innovationScore} label="Innovation" />
          <ScoreGauge score={report.marketPotentialScore} label="Market" />
          <ScoreGauge score={report.scalabilityScore} label="Scalability" />
          <ScoreGauge score={report.investorReadinessScore} label="Investor" />
          <ScoreGauge score={report.successProbability} label="Success %" />
        </div>
      </Card>

      {/* Executive Summary */}
      <Card delay={0.2}>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <HiLightBulb className="w-5 h-5 text-primary-500" /> Executive Summary
        </h2>
        <p className="text-surface-600 dark:text-surface-400 leading-relaxed">{report.executiveSummary}</p>
      </Card>

      {/* Final Verdict */}
      <Card delay={0.25} className="border-2 border-primary-200 dark:border-primary-800">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <HiCheckCircle className="w-5 h-5 text-primary-500" /> Final Verdict
        </h2>
        <p className="text-surface-700 dark:text-surface-300 leading-relaxed font-medium">{report.finalVerdict}</p>
      </Card>

      {/* SWOT Analysis */}
      <div>
        <h2 className="text-lg font-semibold mb-4">SWOT Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SWOTCard type="strengths" items={report.swotAnalysis?.strengths} />
          <SWOTCard type="weaknesses" items={report.swotAnalysis?.weaknesses} />
          <SWOTCard type="opportunities" items={report.swotAnalysis?.opportunities} />
          <SWOTCard type="threats" items={report.swotAnalysis?.threats} />
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportSection icon={HiTrendingUp} title="Product-Market Fit" content={report.productMarketFit} delay={0.3} />
        <ReportSection icon={HiTrendingUp} title="Technical Feasibility" content={report.technicalFeasibility} delay={0.35} />
        <ReportSection icon={HiTrendingUp} title="Customer Validation" content={report.customerValidation} delay={0.4} />
        <ReportSection icon={HiTrendingUp} title="Competitive Analysis" content={report.competitiveAnalysis} delay={0.45} />
      </div>

      {/* Business & Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportSection icon={HiCurrencyDollar} title="Business Model Analysis" content={report.businessModelAnalysis} delay={0.5} />
        <ReportSection icon={HiCurrencyDollar} title="Revenue Suggestions" content={report.revenueSuggestions} delay={0.55} />
        <ReportSection icon={HiCurrencyDollar} title="Pricing Suggestions" content={report.pricingSuggestions} delay={0.6} />
        <ReportSection icon={HiCurrencyDollar} title="Funding Suggestions" content={report.fundingSuggestions} delay={0.65} />
      </div>

      {/* Marketing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportSection icon={HiTrendingUp} title="Marketing Strategy" content={report.marketingStrategy} delay={0.7} />
        <ReportSection icon={HiTrendingUp} title="Customer Acquisition" content={report.customerAcquisitionStrategy} delay={0.75} />
      </div>

      <ReportSection icon={HiTrendingUp} title="Go-To-Market Plan" content={report.goToMarketPlan} delay={0.8} />

      {/* Technical */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportSection icon={HiCode} title="MVP Roadmap" content={report.mvpRoadmap} delay={0.85} />
        <ReportSection icon={HiCode} title="Recommended Tech Stack" content={report.recommendedTechStack} delay={0.9} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card delay={0.95}>
          <h3 className="font-semibold mb-2">Estimated Timeline</h3>
          <p className="text-surface-600 dark:text-surface-400 text-sm">{report.estimatedDevTimeline}</p>
        </Card>
        <Card delay={1.0}>
          <h3 className="font-semibold mb-2">Estimated Cost</h3>
          <p className="text-surface-600 dark:text-surface-400 text-sm">{report.estimatedDevCost}</p>
        </Card>
      </div>

      {/* Risks */}
      <Card delay={1.05}>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <HiExclamation className="w-5 h-5 text-amber-500" /> Key Risks
        </h2>
        <ul className="space-y-2">
          {report.risks?.map((risk, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-400">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              {risk}
            </li>
          ))}
        </ul>
      </Card>

      {/* AI Recommendations */}
      <Card delay={1.1} className="border-2 border-emerald-200 dark:border-emerald-800">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          ✨ AI Recommendations for Improvement
        </h2>
        <ul className="space-y-3">
          {report.aiRecommendations?.map((rec, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-surface-700 dark:text-surface-300">{rec}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/** Reusable report section */
function ReportSection({ icon: Icon, title, content, delay = 0 }) {
  return (
    <Card delay={delay}>
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary-500" /> {title}
      </h3>
      <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed whitespace-pre-line">{content || 'N/A'}</p>
    </Card>
  );
}
