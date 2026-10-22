// ============================================================
// seed.js — Database Seeding Script
// ============================================================
// Populates the database with realistic demo accounts, startup
// ideas, AI validation reports, and chat history for testing
// and live demonstration.
// ============================================================

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const StartupIdea = require('./models/StartupIdea');
const ValidationReport = require('./models/ValidationReport');
const ChatHistory = require('./models/ChatHistory');

const sampleStartups = [
  {
    startupName: 'MediScan AI',
    industry: 'Healthcare',
    startupStage: 'MVP',
    problemStatement: 'Rural clinics lack access to experienced radiologists, leading to delays of up to 3 weeks in detecting critical pulmonary and orthopedic conditions from standard X-ray scans.',
    proposedSolution: 'An edge-computing AI diagnostic assistant that operates on standard tablets, analyzing chest X-rays and bone scans in under 15 seconds with 94.8% radiologist-concordant accuracy without requiring constant internet access.',
    uniqueSellingProposition: 'Offline-capable edge inference models specifically calibrated on diverse low-resource imaging hardware, costing 80% less than hospital PACS integrations.',
    targetAudience: 'Rural health centers, community clinics, and NGO mobile medical units across developing regions.',
    revenueModel: 'Subscription',
    businessModel: 'B2B',
    competitors: 'Qure.ai, Zebra Medical, Enlitic, traditional teleradiology services',
    budget: '$100,000 - $500,000',
    teamSize: '6-10',
    country: 'United States',
    additionalNotes: 'Currently piloting with 3 community hospitals. HIPAA compliant architecture in place.',
    scores: {
      innovation: 92,
      market: 88,
      scalability: 91,
      investor: 87,
      success: 84,
    },
    swot: {
      strengths: [
        'Proprietary offline-first neural network architecture',
        'Strong clinical validation partnerships in progress',
        'Exceptional gross margins on software licensing',
        'Experienced team with bioinformatics and clinical backgrounds',
      ],
      weaknesses: [
        'FDA 510(k) regulatory clearance timeline uncertainty',
        'Long enterprise B2B sales cycles in hospital networks',
        'Dependence on clinic hardware standardization',
        'Requirement for continuous HIPAA and SOC2 compliance audits',
      ],
      opportunities: [
        'Global telemedicine expansion in Southeast Asia and Latin America',
        'Integration with digital ultrasound and portable CT scanners',
        'Subsidized procurement through government rural healthcare grants',
        'Pharmaceutical clinical trial data partnerships',
      ],
      threats: [
        'Rapid advancements by Big Tech healthcare divisions (Google Health, AWS HealthLake)',
        'Malpractice liability concerns from hospital risk boards',
        'Potential medical device regulatory guideline tightening',
        'Physician union pushback against diagnostic automation',
      ],
    },
    risks: [
      'Regulatory clearance delays extending cash runway burn',
      'Clinical adoption resistance from conservative medical staff',
      'Data liability in cases of rare misdiagnoses',
      'High cost of specialized clinical data annotation',
      'Complex enterprise security sign-off hurdles',
    ],
  },
  {
    startupName: 'EcoRoute Logistics',
    industry: 'Logistics',
    startupStage: 'Early Stage',
    problemStatement: 'Last-mile urban delivery fleets waste 23% of fuel and generate excessive carbon emissions due to static routing algorithms that fail to account for real-time micro-congestion and loading zone restrictions.',
    proposedSolution: 'A dynamic AI dispatch engine that continuously recalculates multi-stop delivery routes in real time, minimizing fuel consumption, idling time, and municipal parking infraction penalties.',
    uniqueSellingProposition: 'Predictive parking availability algorithms and commercial vehicle curb-space mapping that reduce vehicle stop duration by 35%.',
    targetAudience: 'Mid-sized freight forwarders, e-commerce fulfillment fleets, and third-party logistics providers (3PLs).',
    revenueModel: 'Pay-per-use',
    businessModel: 'B2B',
    competitors: 'OptimoRoute, Routific, Onfleet, Google Fleet Engine',
    budget: '$25,000 - $100,000',
    teamSize: '2-5',
    country: 'Germany',
    additionalNotes: 'Integrated with OpenStreetMap and major telematics providers.',
    scores: {
      innovation: 85,
      market: 90,
      scalability: 89,
      investor: 82,
      success: 79,
    },
    swot: {
      strengths: [
        'Instant measurable ROI for fleet operators via fuel cost savings',
        'Lightweight API integration with existing telematics units',
        'ESG compliance metrics built into operator reporting',
        'Low customer churn due to daily workflow lock-in',
      ],
      weaknesses: [
        'High compute cost during peak real-time recalculation windows',
        'Need for local municipal data partnerships in each new city',
        'Driver interface resistance during initial rollout',
        'Limited customer base in low-density suburban markets',
      ],
      opportunities: [
        'European Union green logistics subsidies and emissions mandates',
        'Partnership with electric commercial vehicle OEMs (Rivian, Ford Pro)',
        'Expansion into autonomous delivery robot route coordination',
        'Carbon credit generation and offset trading marketplace',
      ],
      threats: [
        'Google Maps Platform launching competitive commercial vehicle features',
        'Volatile fuel prices affecting customer urgency during price drops',
        'Telematics hardware manufacturers building native basic routing',
        'Urban congestion charge policy changes',
      ],
    },
    risks: [
      'Reliance on third-party mapping API pricing and rate limits',
      'High driver churn requiring continuous training simplicity',
      'Fleet telematics protocol fragmentation',
      'Edge-case routing leading to inaccessible physical loading docks',
      'Customer acquisition costs rising on digital B2B ad channels',
    ],
  },
  {
    startupName: 'LearnCraft Studio',
    industry: 'EdTech',
    startupStage: 'Idea',
    problemStatement: 'Middle school STEM educators spend 15+ hours weekly creating interactive science and math exercises, yet 68% of students report feeling disengaged by static digital worksheets.',
    proposedSolution: 'A generative AI pedagogical engine that instantly converts state curriculum standards into interactive 3D browser simulations, adaptive puzzle challenges, and automated grading rubrics.',
    uniqueSellingProposition: 'Browser-based zero-install WebGL simulations customized dynamically to each student reading and problem-solving level.',
    targetAudience: 'K-12 STEM teachers, school district curriculum directors, and homeschooling parent cooperatives.',
    revenueModel: 'Freemium',
    businessModel: 'B2B2C',
    competitors: 'Kahoot, Quizlet, PhET Interactive Simulations, Mystery Science',
    budget: '< $5,000',
    teamSize: 'Solo Founder',
    country: 'Canada',
    additionalNotes: 'Built prototype with Three.js and Claude/Gemini API prompts.',
    scores: {
      innovation: 88,
      market: 82,
      scalability: 94,
      investor: 74,
      success: 71,
    },
    swot: {
      strengths: [
        'Viral bottom-up teacher adoption through free tier sharing',
        'Near-zero marginal cost per additional simulation generated',
        'High student engagement through gamification mechanics',
        'Alignment with Next Generation Science Standards (NGSS)',
      ],
      weaknesses: [
        'Slow school district procurement cycles (9-12 months)',
        'Strict student privacy compliance laws (FERPA, COPPA)',
        'Teachers have limited personal discretionary spending budget',
        'Solo founder bandwidth constraints across marketing and tech',
      ],
      opportunities: [
        'After-school STEM tutoring center licensing packages',
        'Homeschooling market rapid expansion post-2020',
        'Sponsorships from tech giants promoting youth computer science',
        'International curriculum localization (UK, India, Australia)',
      ],
      threats: [
        'Free open educational resources developed by government bodies',
        'District-wide bans on unapproved generative AI tools',
        'School hardware limitations (old Chromebooks with weak GPUs)',
        'Teacher burnout leading to high account abandonment',
      ],
    },
    risks: [
      'Difficulty converting free teacher users into paying school district contracts',
      'Generative hallucination producing incorrect scientific facts',
      'Strict legal liabilities around underage user data storage',
      'Heavy browser memory consumption on legacy student Chromebooks',
      'Seasonal churn during summer school holiday periods',
    ],
  },
  {
    startupName: 'FinPulse Micro',
    industry: 'FinTech',
    startupStage: 'Growth',
    problemStatement: 'Over 70 million gig workers and freelance creators worldwide are denied fair commercial credit, leases, and loans because legacy credit bureaus only recognize traditional W-2 salary slips.',
    proposedSolution: 'An alternative underwriting engine that aggregates real-time platform earnings, client payment velocity, invoice fulfillment rates, and bank open-banking data to produce a dynamic "GigScore".',
    uniqueSellingProposition: 'Direct API integrations with Upwork, Uber, DoorDash, Stripe, and Fiverr providing instant pre-qualification without credit score damage.',
    targetAudience: 'Independent contractors, gig economy drivers, freelance creatives, and digital agency contractors.',
    revenueModel: 'Commission',
    businessModel: 'B2B2C',
    competitors: 'Klover, Brigit, EarnIn, traditional credit score agencies',
    budget: '$500,000 - $1M',
    teamSize: '11-25',
    country: 'United Kingdom',
    additionalNotes: 'Authorized by FCA sandbox. Over 15,000 waitlisted freelance applicants.',
    scores: {
      innovation: 89,
      market: 94,
      scalability: 93,
      investor: 92,
      success: 86,
    },
    swot: {
      strengths: [
        'Proprietary non-traditional credit risk assessment algorithms',
        'High viral referral rate within freelancer professional groups',
        'Strong network effects as more gig platforms connect',
        'High lifetime value per customer via credit card and loan commissions',
      ],
      weaknesses: [
        'High compliance and licensing capital requirements in FinTech',
        'Credit default risk during broader economic recessions',
        'Platform dependency on gig platform API terms of service',
        'Customer acquisition competition against venture-backed neo-banks',
      ],
      opportunities: [
        'White-label B2B scoring API for traditional auto and mortgage lenders',
        'Embedded micro-insurance products tailored to freelancer downtime',
        'Expansion into European digital nomad hubs (Portugal, Spain, Estonia)',
        'Strategic acquisition by major credit bureaus looking for gig data',
      ],
      threats: [
        'Aggressive entry by credit reporting giants (Experian, TransUnion)',
        'Changes in open banking data sharing regulations (PSD2/PSD3)',
        'Gig economy legal reclassification battles regarding contractor status',
        'High interest rate environments suppressing overall lending volume',
      ],
    },
    risks: [
      'Regulatory compliance penalties under consumer credit lending laws',
      'Higher than anticipated loan default rates during tech market downturns',
      'Open banking API downtime interrupting real-time scoring',
      'Fraudulent synthetic identity attacks targeting automated underwriting',
      'Vulnerability to sudden gig platform API access revocations',
    ],
  },
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB successfully.');

    // 1. Ensure Admin User
    let adminUser = await User.findOne({ email: 'admin@startupvalidator.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'System Administrator',
        email: 'admin@startupvalidator.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('✅ Created default admin account: admin@startupvalidator.com / Admin@123');
    } else {
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('ℹ️ Admin account already exists (role verified as admin).');
    }

    // 2. Ensure Sabareesh E account is admin
    const sabareesh = await User.findOne({ email: 'sabare667@gmail.com' });
    let projectOwner = adminUser;
    if (sabareesh) {
      sabareesh.role = 'admin';
      await sabareesh.save();
      projectOwner = sabareesh;
      console.log('✅ Updated Sabareesh E (sabare667@gmail.com) role to "admin"!');
    } else {
      const newSabareesh = await User.create({
        name: 'Sabareesh E',
        email: 'sabare667@gmail.com',
        password: 'Password@123',
        role: 'admin',
      });
      projectOwner = newSabareesh;
      console.log('✅ Created project creator account: Sabareesh E (sabare667@gmail.com) with role "admin"!');
    }

    // 3. Ensure Demo Founder User
    let demoFounder = await User.findOne({ email: 'founder@startupvalidator.com' });
    if (!demoFounder) {
      demoFounder = await User.create({
        name: 'Alex Founder',
        email: 'founder@startupvalidator.com',
        password: 'Founder@123',
        role: 'user',
      });
      console.log('✅ Created demo founder account: founder@startupvalidator.com / Founder@123');
    }

    // 4. Seed Startup Ideas for the founder and project owner
    const targetUsers = [projectOwner, demoFounder];

    for (const targetUser of targetUsers) {
      for (const item of sampleStartups) {
        let startup = await StartupIdea.findOne({
          user: targetUser._id,
          startupName: item.startupName,
        });

        if (!startup) {
          startup = await StartupIdea.create({
            user: targetUser._id,
            startupName: item.startupName,
            industry: item.industry,
            startupStage: item.startupStage,
            problemStatement: item.problemStatement,
            proposedSolution: item.proposedSolution,
            uniqueSellingProposition: item.uniqueSellingProposition,
            targetAudience: item.targetAudience,
            revenueModel: item.revenueModel,
            businessModel: item.businessModel,
            competitors: item.competitors,
            budget: item.budget,
            teamSize: item.teamSize,
            country: item.country,
            additionalNotes: item.additionalNotes,
            isValidated: true,
          });
          console.log(`💡 Seeded startup "${item.startupName}" for ${targetUser.name}`);
        } else {
          startup.isValidated = true;
          await startup.save();
        }

        // 5. Create or update validation report
        let report = await ValidationReport.findOne({ startup: startup._id });
        if (!report) {
          report = await ValidationReport.create({
            startup: startup._id,
            user: targetUser._id,
            executiveSummary: `${item.startupName} is an innovative ${item.industry} initiative in the ${item.startupStage} phase. By addressing: "${item.problemStatement.slice(0, 100)}...", the company provides a defensible solution leveraging ${item.uniqueSellingProposition}. Supported by a scalable ${item.businessModel} model and ${item.revenueModel} monetization, the venture shows high probability of sustainable unit economics.`,
            innovationScore: item.scores.innovation,
            marketPotentialScore: item.scores.market,
            scalabilityScore: item.scores.scalability,
            investorReadinessScore: item.scores.investor,
            successProbability: item.scores.success,
            technicalFeasibility: `High feasibility. Can be deployed with modern cloud native technologies, utilizing microservices and decoupled single-page application frameworks.`,
            productMarketFit: `Strong initial indicators with distinct customer urgency within the ${item.targetAudience} segment.`,
            customerValidation: `Target demographic is readily accessible through industry channels and inbound thought leadership content.`,
            competitiveAnalysis: `Distinct differentiation established through "${item.uniqueSellingProposition}", mitigating primary threats from ${item.competitors}.`,
            swotAnalysis: item.swot,
            risks: item.risks,
            businessModelAnalysis: `The ${item.businessModel} model provides healthy operating leverage, recurring cash flows, and attractive customer lifetime value.`,
            revenueSuggestions: `1. Tiered subscription pricing with monthly and annual discount options.\n2. Add-on professional enterprise onboarding packages.\n3. Usage-based overage fees.`,
            pricingSuggestions: `Starter: $29/mo, Professional: $99/mo, Enterprise: $399+/mo customized to volume.`,
            marketingStrategy: `Omnichannel strategy focusing on SEO content marketing, founder-led outbound messaging, and targeted product directory launches.`,
            customerAcquisitionStrategy: `Prioritize low-cost direct channels, referral loops, and strategic B2B affiliate partnerships to sustain a CAC:LTV ratio above 1:3.`,
            goToMarketPlan: `Q1: Beta testing with 20 closed pilot customers.\nQ2: Public launch and community seeding.\nQ3: Paid marketing expansion and self-serve onboarding.`,
            mvpRoadmap: `Phase 1: Core workflow and authentication.\nPhase 2: Analytics dashboards and billing.\nPhase 3: Webhooks and enterprise integrations.`,
            recommendedTechStack: `React 18, Node.js, Express, MongoDB, Tailwind CSS, Stripe Payments.`,
            estimatedDevTimeline: '10-12 weeks for production-ready MVP.',
            estimatedDevCost: item.budget,
            fundingSuggestions: `Bootstrap initial MVP to $10k MRR, then raise $350k Angel/Pre-Seed round.`,
            finalVerdict: `🟢 Highly Recommended. ${item.startupName} targets an authentic market friction with compelling margins. Proceed with structured customer interviews and rapid MVP deployment.`,
            aiRecommendations: [
              'Build a pre-launch landing page to capture early customer emails.',
              'Conduct 25 structured problem interviews before finalizing UI designs.',
              'Set up unit-economic tracking from day one (CAC, LTV, Churn).',
              'Form an industry advisory board to accelerate enterprise credibility.',
              'Establish an active community presence in relevant professional forums.',
            ],
          });
          console.log(`📊 Seeded validation report for "${item.startupName}"`);
        }

        // 6. Seed Chat History
        let chat = await ChatHistory.findOne({ startup: startup._id });
        if (!chat) {
          await ChatHistory.create({
            user: targetUser._id,
            startup: startup._id,
            messages: [
              {
                role: 'user',
                content: 'What should our primary focus be for the first 30 days?',
                timestamp: new Date(Date.now() - 3600000 * 24 * 3),
              },
              {
                role: 'assistant',
                content: `For **${item.startupName}** in the ${item.startupStage} stage, focus on three things for the next 30 days:\n\n1. **Interview 20 Ideal Customers:** Talk directly to representatives of ${item.targetAudience}. Validate that your problem statement resonates with their top 3 daily pain points.\n2. **Lock Down the Core MVP Feature:** Strip all secondary features. Build only what is needed to deliver your core USP: "${item.uniqueSellingProposition.slice(0, 80)}...".\n3. **Set Up a Pre-Launch Waitlist:** Build a simple, clean landing page explaining the problem and collecting emails with an incentive.`,
                timestamp: new Date(Date.now() - 3600000 * 24 * 3 + 120000),
              },
              {
                role: 'user',
                content: 'How should we approach our initial pricing strategy?',
                timestamp: new Date(Date.now() - 3600000 * 24),
              },
              {
                role: 'assistant',
                content: `With your **${item.revenueModel}** model, keep it simple:\n\n• **Launch with 2 Plans:** A low-friction Starter tier and a comprehensive Pro tier.\n• **Charge From Day One:** Never launch free without a clear path to monetization. Paying customers provide 10x better product feedback than free users.\n• **Annual Incentive:** Offer 2 months free for upfront annual commitments to boost early operating cash flow.`,
                timestamp: new Date(Date.now() - 3600000 * 24 + 180000),
              },
            ],
          });
          console.log(`💬 Seeded chat history for "${item.startupName}"`);
        }
      }
    }

    console.log('\n======================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('You can now log in with the following demo credentials:');
    console.log('------------------------------------------------------');
    console.log('👑 Admin Account:');
    console.log('   Email:    admin@startupvalidator.com');
    console.log('   Password: Admin@123');
    console.log('   Role:     admin (has full access to Admin Panel)\n');
    console.log('🎓 Project Creator Account:');
    console.log('   Email:    sabare667@gmail.com');
    console.log('   Role:     admin (has full access to Admin Panel & Startups)\n');
    console.log('🚀 Founder Account:');
    console.log('   Email:    founder@startupvalidator.com');
    console.log('   Password: Founder@123');
    console.log('   Role:     user (has 4 pre-validated startup ideas & chat)\n');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
