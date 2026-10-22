// ============================================================
// pages/MyStartups.jsx — User's Startup Ideas List
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiFilter, HiPlusCircle, HiPencil, HiTrash, HiEye, HiRefresh, HiDownload, HiChat } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { SkeletonCard } from '../components/ui/LoadingSkeleton';

export default function MyStartups() {
  const navigate = useNavigate();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [validatingId, setValidatingId] = useState(null);

  useEffect(() => { fetchStartups(); }, [search, industry]);

  const fetchStartups = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (industry) params.industry = industry;
      const { data } = await api.get('/startups', { params });
      setStartups(data.startups);
    } catch (error) {
      toast.error('Failed to load startups');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/startups/${deleteId}`);
      setStartups((prev) => prev.filter((s) => s._id !== deleteId));
      toast.success('Startup deleted');
    } catch (error) {
      toast.error('Failed to delete startup');
    } finally {
      setDeleteId(null);
    }
  };

  const handleValidate = async (startupId) => {
    setValidatingId(startupId);
    try {
      toast.loading('AI is analyzing...', { id: 'val' });
      await api.post(`/validations/${startupId}`);
      toast.success('Validation complete!', { id: 'val' });
      navigate(`/report/${startupId}`);
    } catch (error) {
      toast.error('Validation failed', { id: 'val' });
    } finally {
      setValidatingId(null);
    }
  };

  const handleDownloadPDF = async (startup) => {
    try {
      toast.loading('Preparing PDF report...', { id: 'pdf-' + startup._id });
      const { data } = await api.get(`/validations/${startup._id}/report`);
      if (data?.report?._id) {
        const response = await api.get(`/validations/${data.report._id}/pdf`, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${startup.startupName.replace(/[^a-z0-9]/gi, '_')}_Validation_Report.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success('PDF downloaded!', { id: 'pdf-' + startup._id });
      }
    } catch (err) {
      toast.error('Failed to download PDF', { id: 'pdf-' + startup._id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">My Startups</h1>
        <button onClick={() => navigate('/create')} className="btn-primary flex items-center gap-2 text-sm">
          <HiPlusCircle className="w-5 h-5" /> New Startup
        </button>
      </div>

      {/* Search & Filter */}
      <Card animate={false} hover={false}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search startups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="input-field w-full sm:w-48"
          >
            <option value="">All Industries</option>
            {['Technology','Healthcare','FinTech','EdTech','E-Commerce','AI/ML','SaaS','Other'].map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Startup List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : startups.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-6xl mb-4">💡</div>
          <h3 className="text-xl font-semibold mb-2">No startups yet</h3>
          <p className="text-surface-500 mb-6">Create your first startup idea and get AI validation</p>
          <button onClick={() => navigate('/create')} className="btn-primary">
            Create Startup
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {startups.map((startup, i) => (
            <motion.div
              key={startup._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold truncate">{startup.startupName}</h3>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <Badge color="primary">{startup.industry}</Badge>
                    <Badge color="gray">{startup.startupStage}</Badge>
                    {startup.isValidated && <Badge color="green">Validated ✓</Badge>}
                  </div>
                </div>
              </div>

              <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2 mb-4">
                {startup.problemStatement}
              </p>

              <div className="text-xs text-surface-500 mb-4">
                {startup.country} · {startup.teamSize} · {startup.budget}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-surface-100 dark:border-surface-700/50">
                {startup.isValidated && (
                  <>
                    <button
                      onClick={() => navigate(`/report/${startup._id}`)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors"
                      title="View Report"
                    >
                      <HiEye className="w-4 h-4" /> Report
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(startup)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors"
                      title="Download PDF"
                    >
                      <HiDownload className="w-4 h-4" /> PDF
                    </button>
                  </>
                )}
                <button
                  onClick={() => navigate(`/chat?startup=${startup._id}`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                  title="Ask AI"
                >
                  <HiChat className="w-4 h-4" /> Chat
                </button>
                <button
                  onClick={() => handleValidate(startup._id)}
                  disabled={validatingId === startup._id}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors disabled:opacity-50"
                  title="Re-run AI analysis"
                >
                  <HiRefresh className={`w-4 h-4 ${validatingId === startup._id ? 'animate-spin' : ''}`} />
                  {startup.isValidated ? 'Revalidate' : 'Validate'}
                </button>
                <button
                  onClick={() => navigate(`/edit/${startup._id}`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                  title="Edit details"
                >
                  <HiPencil className="w-4 h-4" /> Edit
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => setDeleteId(startup._id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                  title="Delete startup"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Startup">
        <p className="text-surface-600 dark:text-surface-400 mb-6">
          Are you sure you want to delete this startup? All associated reports and chat history will also be deleted. This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleDelete} className="btn-danger text-sm">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
