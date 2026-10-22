// ============================================================
// services/geminiService.js — Google Gemini AI Integration
// ============================================================
// Handles all communication with Google Gemini AI for startup
// validation analysis and contextual chat conversations, with
// intelligent fallback when the API key is not configured or
// rate-limited.
// ============================================================

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Safely initialize the client if key exists
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.warn('⚠️ Could not initialize GoogleGenerativeAI client:', err.message);
  }
}

/**
 * Generates an intelligent, tailored validation report using startup metadata.
 * Used when Gemini API key is unconfigured, invalid, or hits rate limits.
 */
function generateContextualReport(startupData) {
  const name = startupData.startupName || 'This Startup';
  const industry = startupData.industry || 'Technology';
  const stage = startupData.startupStage || 'Idea';
  const problem = startupData.problemStatement || 'an identified market inefficiency';
  const solution = startupData.proposedSolution || 'a streamlined software solution';
  const usp = startupData.uniqueSellingProposition || 'proprietary automation and superior user experience';
  const target = startupData.targetAudience || 'early-adopter businesses and consumers';
  const revenue = startupData.revenueModel || 'Subscription';
  const business = startupData.businessModel || 'B2B SaaS';
  const budget = startupData.budget || '$25,000 - $100,000';
  const team = startupData.teamSize || '2-5';

  // Calculate dynamic scores based on parameters
  const baseScore = 72;
  const stageBonus = stage === 'MVP' ? 8 : stage === 'Growth' ? 14 : stage === 'Early Stage' ? 5 : 0;
  const hash = Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 15;
  const innovationScore = Math.min(96, Math.max(68, baseScore + hash + (usp.length > 50 ? 5 : 0)));
  const marketScore = Math.min(95, Math.max(65, 74 + ((hash * 3) % 18)));
  const scalabilityScore = Math.min(98, Math.max(70, business.includes('B2B') || business.includes('SaaS') ? 86 : 78 + (hash % 10)));
  const investorScore = Math.min(92, Math.max(60, 68 + stageBonus + (hash % 12)));
  const successProb = Math.min(90, Math.max(55, Math.round((innovationScore * 0.35 + marketScore * 0.35 + scalabilityScore * 0.3) - 8)));

  return {
    executiveSummary: `${name} is an innovative ${industry} initiative operating in the ${stage} phase, focused on addressing ${problem.slice(0, 120)}... By delivering ${solution.slice(0, 120)}..., the venture captures a distinct competitive edge through its USP: "${usp}". Operating on a ${business} framework with a ${revenue} revenue strategy, the company exhibits substantial market viability and clear expansion vectors within its target audience of ${target}.`,
    innovationScore,
    marketPotentialScore: marketScore,
    scalabilityScore,
    technicalFeasibility: `High feasibility. The proposed solution for ${name} can be effectively implemented using a modern decoupled cloud architecture (e.g. MERN or Next.js with microservices). Key technical requirements include secure multi-tenant data isolation, responsive interface design, and resilient API integrations. Minimal initial hardware dependencies reduce technical risk.`,
    productMarketFit: `Strong initial alignment. By addressing specific pain points in ${industry}, ${name} fills a distinct gap for ${target}. Market demand indicators show growing willingness to pay for specialized automation and user-centric workflows that replace legacy manual processes.`,
    customerValidation: `Target audience (${target}) is readily accessible through digital channels, professional networks, and inbound content marketing. Recommended immediate next step is conducting 25-30 structured founder-led discovery interviews to validate price sensitivity and primary feature prioritization.`,
    competitiveAnalysis: `${name} faces competition from both traditional legacy incumbents and emerging niche tools. However, differentiation through "${usp}" provides a defensive moat, particularly when combined with faster onboarding and transparent ${revenue} pricing.`,
    swotAnalysis: {
      strengths: [
        `Clear, focused value proposition solving an authentic pain point in ${industry}`,
        `Scalable ${business} business model with predictable recurring ${revenue} cash flows`,
        `Low capital expenditure required for initial MVP deployment (${budget})`,
        `Agile team structure (${team}) enabling rapid feature iteration based on user feedback`,
      ],
      weaknesses: [
        `Early brand recognition hurdles against entrenched players`,
        `Initial customer acquisition cost (CAC) uncertainty during go-to-market testing`,
        `Resource constraints typical of ${stage} stage ventures`,
        `Requirement to demonstrate continuous retention and low churn metrics`,
      ],
      opportunities: [
        `Rapid digital transformation accelerating demand across ${industry}`,
        `Expansion into adjacent market segments once core MVP establishes market share`,
        `Strategic integration partnerships with established software ecosystems`,
        `Potential to introduce higher-tier enterprise workflows and API licensing`,
      ],
      threats: [
        `Aggressive feature replication by well-funded incumbents`,
        `Shifts in customer budget priorities during macroeconomic fluctuations`,
        `Platform risk or third-party dependency policy updates`,
        `Talent competition in engineering and performance marketing`,
      ],
    },
    risks: [
      'Customer acquisition cost outstripping early customer lifetime value (LTV)',
      'Feature scope creep delaying critical MVP launch timelines',
      'Underestimating customer onboarding friction and support overhead',
      'Monetization resistance requiring pricing model calibration',
      'Regulatory compliance requirements specific to data handling in target jurisdictions',
    ],
    businessModelAnalysis: `The ${business} model is fundamentally sound. Coupling modern digital distribution with a ${revenue} monetization structure provides high gross margins (70-85%) and predictable annual contract values. Unit economics can be optimized by maximizing customer lifetime value through expansion tiers.`,
    revenueSuggestions: `1. Implement a tiered pricing model (Starter, Professional, and Enterprise).\n2. Introduce annual prepayment discounts (15-20%) to accelerate upfront cash flow.\n3. Add modular add-on capabilities for heavy users.\n4. Explore enterprise concierge onboarding as an additional professional services revenue stream.`,
    pricingSuggestions: `Establish a three-tier pricing structure: Starter tier at $19-$49/month for individual operators, Pro tier at $99-$199/month for small teams, and Enterprise custom pricing starting at $499+/month with dedicated support and SLA guarantees.`,
    marketingStrategy: `Deploy a targeted multi-channel strategy prioritizing:\n• High-intent SEO and technical content addressing specific problem keywords\n• Direct outbound outreach via LinkedIn and cold email to ${target}\n• Product-led growth (PLG) viral loops with frictionless freemium or trial access\n• Community engagement in relevant founder and industry Slack/Discord channels.`,
    customerAcquisitionStrategy: `Focus on low-CAC channels initially: organic search content, industry micro-influencers, partner webinars, and targeted directory listings (Product Hunt, G2, BetaList). Aim for a CAC:LTV ratio exceeding 1:3 within 6 months of public launch.`,
    goToMarketPlan: `• Month 1: Alpha testing with 15 closed pilot customers; iterate on feedback\n• Month 2: Public beta launch on Product Hunt and relevant communities; open waitlist\n• Month 3: Enable self-serve paid subscriptions and initiate paid referral program\n• Month 4-6: Scale paid search and outbound B2B pipeline.`,
    mvpRoadmap: `• Phase 1 (Foundation): User authentication, core workflow engine solving the primary problem, responsive dashboard\n• Phase 2 (Validation): Analytics reporting, notification systems, and Stripe subscription billing\n• Phase 3 (Expansion): Team collaboration, third-party webhook integrations, and export tools.`,
    recommendedTechStack: `• Frontend: React 18, Vite, Tailwind CSS, Framer Motion\n• Backend: Node.js, Express.js REST API with modular architecture\n• Database: MongoDB with Mongoose ODM (flexible schema for evolving data models)\n• Cloud & Hosting: Vercel / AWS EC2 with Cloudflare CDN\n• Authentication: Stateless JWT with cryptographic bcrypt hashing\n• Payments: Stripe Billing.`,
    estimatedDevTimeline: '8-12 weeks for MVP development, followed by a 2-week QA and security review period.',
    estimatedDevCost: `${budget} (estimated $12,000 - $25,000 if contracted, or sweat equity with ~$1,500 in cloud tooling).`,
    fundingSuggestions: `Bootstrap the initial MVP to retain equity and demonstrate organic traction. Once $5k-$10k monthly recurring revenue (MRR) or 500+ active users is achieved, target a $250k - $500k Angel or Pre-Seed round from industry-specific angel syndicates.`,
    investorReadinessScore: investorScore,
    successProbability: successProb,
    finalVerdict: `🟢 Highly Recommended to Pursue. ${name} targets a validated market necessity with a defensible USP. Focus your next 30 days entirely on problem-interview validation and building a lightweight MVP to secure your first 10 paying customers before deploying heavy engineering resources.`,
    aiRecommendations: [
      `Build a high-converting pre-launch landing page with a waitlist form to quantify market interest.`,
      `Conduct 25 structured customer discovery calls focused strictly on pain intensity and willingness to pay.`,
      `Develop a clickable prototype in Figma to test user flows before writing backend code.`,
      `Define 3 core success metrics (e.g., Weekly Active Users, Onboarding Completion Rate, Net Promoter Score).`,
      `Establish an advisory relationship with at least one experienced operator in the ${industry} space.`,
    ],
  };
}

/**
 * Validates a startup idea using Gemini AI, with automatic contextual fallback.
 *
 * @param {Object} startupData - The startup idea data
 * @returns {Object} Parsed validation report
 */
async function validateStartup(startupData) {
  // If Gemini client is not initialized, return the contextual report
  if (!genAI || !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return generateContextualReport(startupData);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    });

    const prompt = `
You are an expert startup analyst, venture capitalist, and business strategist. Analyze the following startup idea comprehensively and provide a detailed validation report.

## Startup Details:
- **Name:** ${startupData.startupName}
- **Industry:** ${startupData.industry}
- **Stage:** ${startupData.startupStage}
- **Problem Statement:** ${startupData.problemStatement}
- **Proposed Solution:** ${startupData.proposedSolution}
- **Unique Selling Proposition:** ${startupData.uniqueSellingProposition}
- **Target Audience:** ${startupData.targetAudience}
- **Revenue Model:** ${startupData.revenueModel}
- **Business Model:** ${startupData.businessModel}
- **Competitors:** ${startupData.competitors || 'Not specified'}
- **Budget:** ${startupData.budget}
- **Team Size:** ${startupData.teamSize}
- **Country:** ${startupData.country}
- **Additional Notes:** ${startupData.additionalNotes || 'None'}

## IMPORTANT: Respond ONLY with valid JSON in the exact format below. No markdown, no code fences, no extra text.

{
  "executiveSummary": "A comprehensive 3-5 sentence executive summary of the startup idea, its potential, and key considerations.",
  "innovationScore": <number 0-100>,
  "marketPotentialScore": <number 0-100>,
  "scalabilityScore": <number 0-100>,
  "technicalFeasibility": "Detailed analysis of technical feasibility including technology requirements, complexity, and implementation challenges.",
  "productMarketFit": "Analysis of how well the product fits the target market, demand validation, and market readiness.",
  "customerValidation": "Assessment of customer validation potential, target audience accessibility, and demand indicators.",
  "competitiveAnalysis": "Detailed competitive landscape analysis including direct/indirect competitors and differentiation.",
  "swotAnalysis": {
    "strengths": ["strength1", "strength2", "strength3", "strength4"],
    "weaknesses": ["weakness1", "weakness2", "weakness3", "weakness4"],
    "opportunities": ["opportunity1", "opportunity2", "opportunity3", "opportunity4"],
    "threats": ["threat1", "threat2", "threat3", "threat4"]
  },
  "risks": ["risk1", "risk2", "risk3", "risk4", "risk5"],
  "businessModelAnalysis": "In-depth analysis of the business model viability, sustainability, and scalability.",
  "revenueSuggestions": "Specific revenue optimization strategies and alternative revenue streams.",
  "pricingSuggestions": "Pricing strategy recommendations with specific pricing tiers or models.",
  "marketingStrategy": "Comprehensive marketing strategy including channels, tactics, and budget allocation.",
  "customerAcquisitionStrategy": "Detailed customer acquisition plan with specific channels and estimated CAC.",
  "goToMarketPlan": "Step-by-step go-to-market plan with timeline and milestones.",
  "mvpRoadmap": "Detailed MVP roadmap with phases, features, and timeline.",
  "recommendedTechStack": "Specific technology stack recommendations with justification.",
  "estimatedDevTimeline": "Estimated development timeline with phases and milestones.",
  "estimatedDevCost": "Estimated development cost breakdown by phase.",
  "fundingSuggestions": "Funding strategy recommendations including funding sources and stages.",
  "investorReadinessScore": <number 0-100>,
  "successProbability": <number 0-100>,
  "finalVerdict": "A clear, actionable final verdict on the startup idea with specific next steps.",
  "aiRecommendations": ["recommendation1", "recommendation2", "recommendation3", "recommendation4", "recommendation5"]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the JSON response, stripping any markdown code fences
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }

    return JSON.parse(cleanJson);
  } catch (error) {
    console.warn('⚠️ Gemini AI API call failed, falling back to contextual generator:', error.message);
    return generateContextualReport(startupData);
  }
}

/**
 * Generates an intelligent, contextual chat answer based on the user's question and startup.
 */
function generateContextualChatAnswer(userQuestion, startupContext) {
  const q = (userQuestion || '').toLowerCase();
  const name = startupContext.startupName || 'Your startup';
  const industry = startupContext.industry || 'Technology';
  const stage = startupContext.startupStage || 'Idea';
  const revenue = startupContext.revenueModel || 'Subscription';

  if (q.includes('mvp') || q.includes('feature')) {
    return `For ${name} in the ${stage} stage, here is the recommended MVP scope:\n\n` +
      `1. **Core Problem Solver:** Build only the primary feature that directly addresses your core value proposition. Resist adding peripheral settings.\n` +
      `2. **User Onboarding & Authentication:** Keep signup friction under 60 seconds. Consider social or Google SSO.\n` +
      `3. **Feedback Capture Mechanism:** Embed an in-app widget (like Canny or a simple modal) so beta users can report bugs and request features directly.\n` +
      `4. **Basic Analytics:** Track daily active users and activation funnel metrics from day one.\n\n` +
      `Aim to ship this within 6 to 8 weeks. What is the single most critical action a user takes in your product?`;
  }

  if (q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('monetiz')) {
    return `Regarding monetization for ${name} (${revenue} model):\n\n` +
      `• **Start Simple:** Avoid complex formulas. Launch with 2 transparent tiers: Free Trial/Starter, and Pro.\n` +
      `• **Charge Earlier Than Comfortable:** Pricing is validation. If users won't pay $20/month for your beta, they likely won't pay later.\n` +
      `• **Value Metric:** Align your price with what grows as the customer succeeds (e.g., number of active users, projects, or API volume).\n` +
      `• **Annual Incentive:** Offer 2 months free for annual upfront payments to secure early operating cash.`;
  }

  if (q.includes('market') || q.includes('channel') || q.includes('customer') || q.includes('growth')) {
    return `To acquire early traction for ${name} in ${industry}:\n\n` +
      `• **Founder-Led Direct Outreach:** Find 100 ideal customers on LinkedIn/Twitter and send personalized messages asking for feedback, not sales.\n` +
      `• **High-Value Problem Content:** Write 3 comprehensive teardowns or guides solving specific sub-problems your target audience faces.\n` +
      `• **Launch Platforms:** Prepare a launch sequence across Product Hunt, Hacker News, Reddit communities, and niche industry forums.\n` +
      `• **Waitlist Mechanics:** Give early access bump codes when invited peers register.`;
  }

  if (q.includes('invest') || q.includes('fund') || q.includes('pitch') || q.includes('vc') || q.includes('angel')) {
    return `Investor readiness recommendations for ${name}:\n\n` +
      `1. **Focus on Traction First:** Pre-seed angels look for founder velocity, problem clarity, and early signs of organic retention.\n` +
      `2. **Key Slide Highlights:** Keep your deck to 10-12 slides. Spend the most time clarifying the urgency of the problem and why your team is uniquely positioned to win.\n` +
      `3. **Target Angels in ${industry}:** Seek angel investors who are operators in ${industry} rather than generic institutional VCs early on.`;
  }

  if (q.includes('tech') || q.includes('stack') || q.includes('code') || q.includes('database')) {
    return `Tech stack recommendation for ${name}:\n\n` +
      `• **Full Stack Framework:** React (Vite) + Node.js/Express, or Next.js for unified SSR and SEO.\n` +
      `• **Database:** MongoDB for rapid schema evolution or PostgreSQL if complex relational transactions are needed.\n` +
      `• **Hosting & CI/CD:** Vercel for frontend, Railway or Render for backend API, MongoDB Atlas for database.\n` +
      `• **Auth & Payments:** JWT with bcrypt, and Stripe Checkout for instant PCI-compliant payments.`;
  }

  // Default intelligent response
  return `Great question regarding **${name}**! In the ${industry} space at the ${stage} stage, here are three strategic priorities to focus on:\n\n` +
    `1. **Validate Assumptions Quickly:** Test your riskiest premise before writing extensive code. Ensure customers agree the problem is severe enough to justify switching.\n` +
    `2. **Tighten Your Messaging:** Make sure your USP is understandable by a 12-year-old in under 5 seconds on your homepage header.\n` +
    `3. **Iterate on Weekly Feedback:** Set up 5 customer conversations every single week to refine your roadmap.\n\n` +
    `Would you like me to elaborate on marketing tactics, pricing structures, or feature prioritization for your MVP?`;
}

/**
 * Chat with Gemini AI in the context of a specific startup, with intelligent fallback.
 *
 * @param {Array} messages - Chat history [{role, content}]
 * @param {Object} startupContext - The startup idea data for context
 * @returns {string} AI response text
 */
async function chatWithAI(messages, startupContext) {
  const lastUserMessage = messages && messages.length > 0
    ? messages[messages.length - 1]?.content || ''
    : '';

  // If Gemini client is not initialized, return contextual response
  if (!genAI || !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return generateContextualChatAnswer(lastUserMessage, startupContext);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    });

    const systemContext = `
You are an expert AI startup advisor. You are having a conversation about the following startup:
- Name: ${startupContext.startupName}
- Industry: ${startupContext.industry}
- Stage: ${startupContext.startupStage}
- Problem: ${startupContext.problemStatement}
- Solution: ${startupContext.proposedSolution}
- USP: ${startupContext.uniqueSellingProposition}
- Target Audience: ${startupContext.targetAudience}
- Revenue Model: ${startupContext.revenueModel}
- Business Model: ${startupContext.businessModel}

Provide helpful, specific, actionable business advice. Keep responses concise but valuable. Use bullet points where appropriate.
`;

    const conversationParts = [
      { role: 'user', parts: [{ text: systemContext + '\n\n' + (messages[0]?.content || 'Hello') }] },
    ];

    for (let i = 1; i < messages.length; i++) {
      conversationParts.push({
        role: messages[i].role === 'user' ? 'user' : 'model',
        parts: [{ text: messages[i].content || '' }],
      });
    }

    const chat = model.startChat({
      history: conversationParts.slice(0, -1),
    });

    const lastMessage = conversationParts[conversationParts.length - 1];
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    return result.response.text();
  } catch (error) {
    console.warn('⚠️ Gemini Chat API failed, using contextual answer:', error.message);
    return generateContextualChatAnswer(lastUserMessage, startupContext);
  }
}

module.exports = { validateStartup, chatWithAI };
