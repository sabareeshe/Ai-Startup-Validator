// ============================================================
// pages/CreateStartup.jsx — Create / Edit Startup Idea
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  HiLightBulb, HiOfficeBuilding, HiUsers, HiCurrencyDollar,
  HiGlobe, HiDocumentText, HiSparkles, HiArrowLeft,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const industries = [
  'Technology', 'Healthcare', 'FinTech', 'EdTech', 'E-Commerce', 'AI/ML',
  'SaaS', 'Social Media', 'Gaming', 'Real Estate', 'Food & Beverage',
  'Travel', 'Logistics', 'CleanTech', 'Cybersecurity', 'Blockchain',
  'IoT', 'Media & Entertainment', 'Agriculture', 'Other',
];

const stages = ['Idea', 'MVP', 'Early Stage', 'Growth', 'Scale', 'Mature'];
const revenueModels = ['Subscription', 'Freemium', 'Marketplace', 'Advertising', 'Commission', 'Licensing', 'Pay-per-use', 'One-time Purchase', 'Hybrid', 'Other'];
const businessModels = ['B2B', 'B2C', 'B2B2C', 'C2C', 'D2C', 'SaaS', 'Marketplace', 'Platform', 'Other'];
const budgetRanges = ['< $5,000', '$5,000 - $25,000', '$25,000 - $100,000', '$100,000 - $500,000', '$500,000 - $1M', '$1M - $5M', '$5M+'];
const teamSizes = ['Solo Founder', '2-5', '6-10', '11-25', '26-50', '50+'];

export default function CreateStartup() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = !!id;
  const autoValidate = searchParams.get('validate') === 'true';

  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Load startup data for editing
  useEffect(() => {
    if (isEdit) {
      fetchStartup();
    }
  }, [id]);

  const fetchStartup = async () => {
    try {
      const { data } = await api.get(`/startups/${id}`);
      reset(data.startup);
    } catch (error) {
      toast.error('Failed to load startup');
      navigate('/my-startups');
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      let startupId = id;

      if (isEdit) {
        await api.put(`/startups/${id}`, formData);
        toast.success('Startup updated!');
      } else {
        const { data } = await api.post('/startups', formData);
        startupId = data.startup._id;
        toast.success('Startup created!');
      }

      // Auto-validate if requested
      if (autoValidate || !isEdit) {
        await handleValidate(startupId);
      } else {
        navigate('/my-startups');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save startup');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (startupId) => {
    setValidating(true);
    try {
      toast.loading('AI is analyzing your startup...', { id: 'validating' });
      await api.post(`/validations/${startupId}`);
      toast.success('Validation complete!', { id: 'validating' });
      navigate(`/report/${startupId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Validation failed', { id: 'validating' });
      navigate('/my-startups');
    } finally {
      setValidating(false);
    }
  };

  const selectClass = "input-field";

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
          <HiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? 'Edit Startup' : 'Validate New Startup'}</h1>
          <p className="text-surface-500 text-sm">Fill in the details and let AI analyze your idea</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card animate={true} delay={0.1}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HiLightBulb className="w-5 h-5 text-primary-500" /> Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Startup Name *"
              placeholder="e.g., TechFlow AI"
              error={errors.startupName?.message}
              {...register('startupName', { required: 'Startup name is required' })}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Industry *</label>
              <select {...register('industry', { required: 'Industry is required' })} className={selectClass}>
                <option value="">Select Industry</option>
                {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
              </select>
              {errors.industry && <p className="text-sm text-red-500">{errors.industry.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Startup Stage *</label>
              <select {...register('startupStage', { required: 'Stage is required' })} className={selectClass}>
                <option value="">Select Stage</option>
                {stages.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.startupStage && <p className="text-sm text-red-500">{errors.startupStage.message}</p>}
            </div>
            <Input
              label="Country *"
              placeholder="e.g., United States"
              icon={HiGlobe}
              error={errors.country?.message}
              {...register('country', { required: 'Country is required' })}
            />
          </div>
        </Card>

        {/* Problem & Solution */}
        <Card animate={true} delay={0.2}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HiDocumentText className="w-5 h-5 text-primary-500" /> Problem & Solution
          </h2>
          <div className="space-y-5">
            <Input
              type="textarea"
              label="Problem Statement *"
              placeholder="What problem are you solving? Describe the pain point..."
              error={errors.problemStatement?.message}
              {...register('problemStatement', { required: 'Problem statement is required' })}
            />
            <Input
              type="textarea"
              label="Proposed Solution *"
              placeholder="How does your product solve this problem?"
              error={errors.proposedSolution?.message}
              {...register('proposedSolution', { required: 'Proposed solution is required' })}
            />
            <Input
              type="textarea"
              label="Unique Selling Proposition (USP) *"
              placeholder="What makes your solution unique compared to others?"
              error={errors.uniqueSellingProposition?.message}
              {...register('uniqueSellingProposition', { required: 'USP is required' })}
            />
          </div>
        </Card>

        {/* Market & Audience */}
        <Card animate={true} delay={0.3}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HiUsers className="w-5 h-5 text-primary-500" /> Market & Audience
          </h2>
          <div className="space-y-5">
            <Input
              label="Target Audience *"
              placeholder="e.g., Small business owners aged 25-45 in the US"
              error={errors.targetAudience?.message}
              {...register('targetAudience', { required: 'Target audience is required' })}
            />
            <Input
              type="textarea"
              label="Competitors"
              placeholder="List your main competitors and how you differ..."
              {...register('competitors')}
            />
          </div>
        </Card>

        {/* Business Model */}
        <Card animate={true} delay={0.4}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HiCurrencyDollar className="w-5 h-5 text-primary-500" /> Business & Revenue
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Revenue Model *</label>
              <select {...register('revenueModel', { required: 'Revenue model is required' })} className={selectClass}>
                <option value="">Select Revenue Model</option>
                {revenueModels.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.revenueModel && <p className="text-sm text-red-500">{errors.revenueModel.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Business Model *</label>
              <select {...register('businessModel', { required: 'Business model is required' })} className={selectClass}>
                <option value="">Select Business Model</option>
                {businessModels.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.businessModel && <p className="text-sm text-red-500">{errors.businessModel.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Budget *</label>
              <select {...register('budget', { required: 'Budget is required' })} className={selectClass}>
                <option value="">Select Budget</option>
                {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              {errors.budget && <p className="text-sm text-red-500">{errors.budget.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Team Size *</label>
              <select {...register('teamSize', { required: 'Team size is required' })} className={selectClass}>
                <option value="">Select Team Size</option>
                {teamSizes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.teamSize && <p className="text-sm text-red-500">{errors.teamSize.message}</p>}
            </div>
          </div>
        </Card>

        {/* Additional Notes */}
        <Card animate={true} delay={0.5}>
          <Input
            type="textarea"
            label="Additional Notes (Optional)"
            placeholder="Any extra context, features you plan, or questions you have..."
            {...register('additionalNotes')}
          />
        </Card>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading || validating}
            icon={HiSparkles}
            disabled={loading || validating}
          >
            {validating ? 'AI Validating...' : isEdit ? 'Save & Revalidate' : '✨ Validate with AI'}
          </Button>
        </div>
      </form>
    </div>
  );
}
