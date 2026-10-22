// ============================================================
// pages/Landing.jsx — SaaS Public Landing Page
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiLightBulb, HiShieldCheck, HiDocumentReport, HiTrendingUp,
  HiChat, HiCheck, HiArrowRight, HiSparkles, HiCode,
  HiCurrencyDollar, HiQuestionMarkCircle, HiChevronDown,
} from 'react-icons/hi';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useAuth } from '../hooks/useAuth';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does AI Startup Validator analyze my idea?',
      a: 'We leverage Google Gemini AI combined with venture capital evaluation frameworks. The engine evaluates your problem statement, solution feasibility, target demographics, monetization structure, and competitors across 25+ quantitative and qualitative metrics.',
    },
    {
      q: 'Can I export reports for angel investors and incubators?',
      a: 'Yes! Every validated idea can be exported as a publication-ready, beautifully styled PDF document with executive summaries, SWOT matrices, score gauges, risk mitigations, and MVP roadmaps.',
    },
    {
      q: 'What is the Contextual AI Chat Assistant?',
      a: 'Unlike generic chatbots, our AI assistant retains full context of your specific startup idea. You can ask follow-up questions regarding marketing channels, feature prioritization, pricing tiers, or investor pitch objections.',
    },
    {
      q: 'Is my startup idea kept confidential?',
      a: 'Absolutely. Your startup ideas and validation reports are strictly private to your authenticated account and are never used to train public language models.',
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 selection:bg-primary-500 selection:text-white">
      {/* ===== Navigation Bar ===== */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/25">
              <HiLightBulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gradient">StartupAI</span>
              <span className="text-xs ml-1.5 px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wider">
                Validator
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-surface-600 dark:text-surface-300">
            <a href="#features" className="hover:text-primary-500 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary-500 transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-primary-500 transition-colors">Demo Report</a>
            <a href="#pricing" className="hover:text-primary-500 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-primary-500 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary text-sm flex items-center gap-2"
              >
                Go to Dashboard <HiArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden gradient-mesh">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 border border-primary-500/20 shadow-sm"
          >
            <HiSparkles className="w-4 h-4 text-primary-500" />
            <span>Powered by Google Gemini AI · 25+ Deep Validation Metrics</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
          >
            Validate Your Startup Idea <br />
            <span className="text-gradient">Before You Write A Line Of Code.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-lg sm:text-xl text-surface-600 dark:text-surface-400 leading-relaxed"
          >
            Transform your entrepreneurial concept into an investor-ready validation report. Receive real-time
            Innovation Scores, SWOT analysis, unit economics, tech stack guidance, and downloadable PDF reports in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => navigate(user ? '/create' : '/register')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 shadow-xl shadow-primary-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <HiLightBulb className="w-5 h-5" />
              Validate Your Idea Now — Free
            </button>
            <a
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold glass-card hover:bg-surface-100 dark:hover:bg-surface-800 transition-all flex items-center justify-center gap-2"
            >
              Explore Sample Report
            </a>
          </motion.div>

          {/* Social Proof */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-surface-200/60 dark:border-surface-800/60">
            <div>
              <p className="text-3xl font-extrabold text-gradient">25+</p>
              <p className="text-xs text-surface-500 mt-1 uppercase tracking-wider">Metrics Analyzed</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gradient">&lt; 15s</p>
              <p className="text-xs text-surface-500 mt-1 uppercase tracking-wider">Analysis Speed</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gradient">100%</p>
              <p className="text-xs text-surface-500 mt-1 uppercase tracking-wider">PDF Investor Export</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gradient">24/7</p>
              <p className="text-xs text-surface-500 mt-1 uppercase tracking-wider">Contextual AI Chat</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Interactive Demo Preview Card ===== */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest text-primary-500 font-bold mb-2">Live Report Preview</h2>
          <h3 className="text-3xl sm:text-4xl font-bold">What Your AI Validation Looks Like</h3>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card-strong p-6 sm:p-8 rounded-3xl shadow-2xl border border-primary-500/20"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-200 dark:border-surface-700 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h4 className="text-2xl font-bold">MediScan AI</h4>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                  Validated ✓
                </span>
              </div>
              <p className="text-sm text-surface-500 mt-1">Healthcare · MVP Stage · B2B Subscription</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400">
                Sample Scorecard
              </span>
            </div>
          </div>

          {/* Scores Overview Mock */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-6">
            {[
              { label: 'Innovation', val: 92, color: 'text-emerald-500' },
              { label: 'Market Potential', val: 88, color: 'text-emerald-500' },
              { label: 'Scalability', val: 91, color: 'text-emerald-500' },
              { label: 'Investor Ready', val: 87, color: 'text-emerald-500' },
              { label: 'Success %', val: 84, color: 'text-emerald-500' },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 text-center">
                <p className={`text-3xl font-extrabold ${s.color}`}>{s.val}</p>
                <p className="text-xs text-surface-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* SWOT Snippet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20">
              <h5 className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm mb-2 flex items-center gap-1.5">
                <HiCheck className="w-4 h-4" /> Core Strengths
              </h5>
              <ul className="text-xs text-surface-600 dark:text-surface-400 space-y-1">
                <li>• Offline-first neural inference running on commodity tablets</li>
                <li>• Instant clinical validation with 94.8% radiologist-concordant accuracy</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-500/20">
              <h5 className="font-semibold text-blue-600 dark:text-blue-400 text-sm mb-2 flex items-center gap-1.5">
                <HiTrendingUp className="w-4 h-4" /> Growth Opportunities
              </h5>
              <ul className="text-xs text-surface-600 dark:text-surface-400 space-y-1">
                <li>• Telemedicine expansion across developing Asian & Latin American markets</li>
                <li>• Government subsidized procurement through rural healthcare grants</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== Features Grid ===== */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-primary-500 font-bold mb-2">Core Capabilities</h2>
          <h3 className="text-3xl sm:text-4xl font-bold">Everything You Need To Build A Winner</h3>
          <p className="text-surface-600 dark:text-surface-400 mt-4">
            AI Startup Validator combines Google Gemini AI with elite venture capital heuristics to dissect every dimension of your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: HiLightBulb,
              title: '25+ Metric AI Scoring',
              desc: 'Detailed scores on Innovation, Technical Feasibility, Market Potential, Scalability, and Investor Readiness.',
              gradient: 'from-amber-500 to-amber-600',
            },
            {
              icon: HiShieldCheck,
              title: 'SWOT & Moat Analysis',
              desc: 'Comprehensive matrix of Strengths, Weaknesses, Opportunities, and Threats, identifying your competitive moat.',
              gradient: 'from-emerald-500 to-emerald-600',
            },
            {
              icon: HiCode,
              title: 'Actionable MVP Roadmap',
              desc: 'Phase-by-phase feature roadmap with recommended tech stack, estimated development timeline, and cost breakdown.',
              gradient: 'from-blue-500 to-blue-600',
            },
            {
              icon: HiCurrencyDollar,
              title: 'Financial & Pricing Strategy',
              desc: 'In-depth pricing tier recommendations, customer acquisition strategies, and fundraising suggestions for angel rounds.',
              gradient: 'from-primary-500 to-primary-600',
            },
            {
              icon: HiDocumentReport,
              title: 'Investor-Grade PDF Export',
              desc: 'Generate styled, multi-page professional PDF reports ready for venture capitalists, pitch competitions, and accelerators.',
              gradient: 'from-purple-500 to-purple-600',
            },
            {
              icon: HiChat,
              title: 'Contextual AI Advisor',
              desc: 'Ask follow-up questions anytime. The AI remembers all your startup specifics and provides bespoke strategic advice.',
              gradient: 'from-pink-500 to-pink-600',
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <f.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3">{f.title}</h4>
              <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-100/50 dark:bg-surface-900/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase tracking-widest text-primary-500 font-bold mb-2">Simple Workflow</h2>
            <h3 className="text-3xl sm:text-4xl font-bold">From Concept to Validation in 3 Steps</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Enter Idea Parameters',
                desc: 'Fill out our structured form: problem statement, proposed solution, USP, target audience, budget, and business model.',
              },
              {
                step: '02',
                title: 'AI Synthesis Engine',
                desc: 'Google Gemini analyzes competitive moats, market risks, technical feasibility, and synthesizes 25+ metrics.',
              },
              {
                step: '03',
                title: 'Actionable Report & Chat',
                desc: 'Inspect your full dashboard report, download an investor PDF, and brainstorm with your contextual AI assistant.',
              },
            ].map((step, i) => (
              <div key={step.step} className="glass-card p-8 rounded-2xl relative">
                <span className="text-5xl font-black text-primary-500/20 mb-4 block">{step.step}</span>
                <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Pricing Section ===== */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-primary-500 font-bold mb-2">Transparent Plans</h2>
          <h3 className="text-3xl sm:text-4xl font-bold">Invest in Validation, Avoid Costly Mistakes</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Free Starter */}
          <div className="glass-card p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold">Free Starter</h4>
              <p className="text-sm text-surface-500 mt-1">For aspiring founders exploring ideas</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-surface-500 text-sm"> / forever</span>
              </div>
              <ul className="space-y-3 text-sm text-surface-600 dark:text-surface-400 mb-8">
                <li className="flex items-center gap-2"><HiCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" /> Up to 3 Startup Validations</li>
                <li className="flex items-center gap-2"><HiCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" /> Core Innovation & SWOT Scoring</li>
                <li className="flex items-center gap-2"><HiCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" /> Full PDF Report Generation</li>
                <li className="flex items-center gap-2"><HiCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" /> Light/Dark Mode Persistence</li>
              </ul>
            </div>
            <button onClick={() => navigate('/register')} className="w-full btn-secondary">
              Get Started Free
            </button>
          </div>

          {/* Pro Founder */}
          <div className="glass-card-strong p-8 rounded-3xl border-2 border-primary-500 relative flex flex-col justify-between shadow-2xl scale-105">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md">
              Most Popular
            </span>
            <div>
              <h4 className="text-xl font-bold">Pro Founder</h4>
              <p className="text-sm text-surface-500 mt-1">For active builders & serial entrepreneurs</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-gradient">$19</span>
                <span className="text-surface-500 text-sm"> / month</span>
              </div>
              <ul className="space-y-3 text-sm text-surface-600 dark:text-surface-400 mb-8">
                <li className="flex items-center gap-2"><HiCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" /> Unlimited Startup Validations</li>
                <li className="flex items-center gap-2"><HiCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" /> Gemini 2.0 Flash AI Deep Reasoning</li>
                <li className="flex items-center gap-2"><HiCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" /> Unlimited Contextual AI Chat</li>
                <li className="flex items-center gap-2"><HiCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" /> Priority MVP Roadmaps & Cost Estimation</li>
                <li className="flex items-center gap-2"><HiCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" /> Full Analytics & Trend Gauges</li>
              </ul>
            </div>
            <button onClick={() => navigate('/register')} className="w-full btn-primary">
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Enterprise Incubator */}
          <div className="glass-card p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold">Incubator / VC</h4>
              <p className="text-sm text-surface-500 mt-1">For accelerators, universities & venture studios</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold">$99</span>
                <span className="text-surface-500 text-sm"> / month</span>
              </div>
              <ul className="space-y-3 text-sm text-surface-600 dark:text-surface-400 mb-8">
                <li className="flex items-center gap-2"><HiCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" /> Multi-user Admin Governance Panel</li>
                <li className="flex items-center gap-2"><HiCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" /> White-label Branded PDF Reports</li>
                <li className="flex items-center gap-2"><HiCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" /> Bulk Cohort Idea Ingestion</li>
                <li className="flex items-center gap-2"><HiCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" /> Dedicated REST API Access</li>
              </ul>
            </div>
            <button onClick={() => navigate('/register')} className="w-full btn-secondary">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* ===== FAQ Accordion ===== */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest text-primary-500 font-bold mb-2">Got Questions?</h2>
          <h3 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between font-semibold hover:text-primary-500 transition-colors"
              >
                <span>{faq.q}</span>
                <HiChevronDown className={`w-5 h-5 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-primary-500' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-sm text-surface-600 dark:text-surface-400 leading-relaxed border-t border-surface-100 dark:border-surface-800 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== Bottom CTA Banner ===== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl gradient-primary p-10 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl sm:text-5xl font-extrabold">Ready to Validate Your Next Big Idea?</h3>
            <p className="max-w-2xl mx-auto text-white/80 text-base sm:text-lg">
              Join thousands of founders who validate ideas with data before spending capital.
            </p>
            <button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="px-8 py-4 rounded-xl font-bold text-primary-950 bg-white hover:bg-white/95 hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              {user ? 'Open Dashboard' : 'Create Free Account Now'}
            </button>
          </div>
        </div>
      </section>

      {/* ===== Comprehensive Footer ===== */}
      <footer className="border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <HiLightBulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">AI Startup Validator</span>
            </div>
            <p className="text-sm text-surface-500 max-w-sm leading-relaxed">
              A production-ready full-stack MERN Software-as-a-Service application utilizing Google Gemini AI for rigorous startup idea validation.
            </p>
            <div className="text-xs text-surface-400 space-y-1 pt-2">
              <p><strong>Developed by:</strong> Sabareesh E (Reg: 714024104181)</p>
              <p><strong>Institution:</strong> Sri Shakthi Institute of Engineering and Technology (Autonomous), Coimbatore - 62</p>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-sm mb-4">Platform</h5>
            <ul className="space-y-2 text-sm text-surface-500">
              <li><Link to="/dashboard" className="hover:text-primary-500">Dashboard</Link></li>
              <li><Link to="/create" className="hover:text-primary-500">Validate Startup</Link></li>
              <li><Link to="/my-startups" className="hover:text-primary-500">My Startups</Link></li>
              <li><Link to="/analytics" className="hover:text-primary-500">Platform Analytics</Link></li>
              <li><Link to="/chat" className="hover:text-primary-500">AI Assistant</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-sm mb-4">Account & Access</h5>
            <ul className="space-y-2 text-sm text-surface-500">
              <li><Link to="/login" className="hover:text-primary-500">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-primary-500">Register</Link></li>
              <li><Link to="/forgot-password" className="hover:text-primary-500">Forgot Password</Link></li>
              <li><Link to="/profile" className="hover:text-primary-500">Profile Settings</Link></li>
              <li><Link to="/admin" className="hover:text-primary-500">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-surface-200 dark:border-surface-800 flex flex-col sm:flex-row items-center justify-between text-xs text-surface-500 gap-4">
          <p>© {new Date().getFullYear()} AI Startup Validator · Sri Shakthi Institute of Engineering and Technology</p>
          <p>MERN Stack Architecture with Google Gemini AI Integration</p>
        </div>
      </footer>
    </div>
  );
}
