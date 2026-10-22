const fs = require('fs');
const HTMLtoDOCX = require('html-to-docx');

const htmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AI Startup Validator Report</title>
</head>
<body style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: black;">

    <!-- HEADER TABLE mimicking the Logos -->
    <table width="100%" style="border-collapse: collapse; margin-bottom: 100px;">
        <tr>
            <td width="20%" style="text-align: left; vertical-align: middle;">
                <div style="width: 100px; height: 100px; border: 1px dashed #ccc; text-align: center; line-height: 100px; font-size: 10px; color: gray; font-family: sans-serif;">[SIET Logo]</div>
            </td>
            <td width="60%" style="text-align: center; vertical-align: middle; font-family: Arial, sans-serif;">
                <span style="color: #008040; font-size: 28pt; font-weight: bold; letter-spacing: 2px;">SRI SHAKTHI</span><br/>
                <span style="color: #008040; font-size: 11pt; font-weight: bold;">INSTITUTE OF ENGINEERING AND TECHNOLOGY</span><br/>
                <span style="font-size: 11pt; font-weight: bold;">An Autonomous Institution</span><br/>
                <span style="font-size: 11pt; font-weight: bold;">Coimbatore - 62.</span>
            </td>
            <td width="20%" style="text-align: right; vertical-align: middle;">
                <div style="width: 100px; height: 100px; border: 1px dashed #ccc; text-align: center; line-height: 100px; font-size: 10px; color: gray; font-family: sans-serif; float: right;">[NBA/NAAC]</div>
            </td>
        </tr>
    </table>

    <!-- MAIN TITLE -->
    <div style="text-align: center; margin-top: 150px; margin-bottom: 250px;">
        <h2 style="font-size: 16pt; font-weight: bold; margin-bottom: 40px;">MERN PROJECT</h2>
        <h1 style="font-size: 22pt; font-weight: bold;">AI STARTUP VALIDATOR</h1>
    </div>
    
    <!-- DONE BY SECTION -->
    <div style="text-align: right; margin-right: 50px;">
        <p style="font-size: 14pt; font-weight: bold; margin: 0;">DONE BY:</p>
        <p style="font-size: 14pt; font-weight: bold; margin: 0;">SABAREESH E</p>
        <p style="font-size: 14pt; font-weight: bold; margin: 0;">714024104181</p>
    </div>
    
    <br clear="all" style="page-break-before: always;" />

    <h2 style="font-size: 16pt; font-weight: bold;">ABSTRACT:</h2>
    <p style="text-align: justify;">The AI Startup Validator platform is a comprehensive full-stack Software-as-a-Service (SaaS) application engineered using MongoDB, Express.js, React.js, and Node.js (MERN stack). Designed to empower entrepreneurs and startup incubators, the platform leverages the Google Gemini AI API to rigorously analyze, score, and provide actionable feedback on startup ideas. It bridges the gap between raw entrepreneurial intuition and data-driven market validation.</p>
    <p style="text-align: justify;">Built on a secure JWT-based authentication system with password recovery workflows, the application offers personalized dashboards where users can manage their startup ideas, track analytics, and generate detailed AI reports. The AI validation engine outputs comprehensive metrics including Innovation Scores, Market Potential, Scalability, SWOT analyses, and an actionable MVP Roadmap. These reports can be exported as professional PDF documents for investors or internal planning.</p>
    <p style="text-align: justify;">In addition to core validation, the platform features a contextual AI Chat Assistant that allows founders to ask follow-up questions tailored specifically to their startup's data, as well as an administrative governance suite for platform-wide user and content moderation. By combining modern React components, high-throughput Node.js microservices, and robust MongoDB storage, the AI Startup Validator provides a scalable and resilient digital foundation for early-stage idea validation.</p>
    
    <br/>
    <h2 style="font-size: 16pt; font-weight: bold;">TECH STACK:</h2>
    <p style="font-weight: bold;">Frontend:</p>
    <p style="text-align: justify;">The client-side application is developed using React 18 with Vite, delivering an ultra-responsive, component-driven Single-Page Application (SPA). React governs all operational views including the public landing showcase, authentication portal, startup management dashboard, and AI report visualizations.</p>
    <p style="text-align: justify;">Tailwind CSS powers a modern visual design system with dark/light mode persistence. Data visualization is handled by Recharts, while forms are efficiently managed using React Hook Form. Framer Motion is utilized to provide fluid animations and enhanced glassmorphism aesthetics.</p>
    
    <p style="font-weight: bold;">Backend:</p>
    <p style="text-align: justify;">The backend architecture is built with Node.js and Express.js, providing an asynchronous, non-blocking REST API gateway. The backend follows a strict modular structure separating routes, controllers, middleware, and Mongoose models.</p>
    <p style="text-align: justify;">Security is enforced using JSON Web Tokens (JWT) for stateless authentication, bcrypt for cryptographic password hashing, and Helmet for HTTP header protection. PDF generation is seamlessly handled server-side using PDFKit, and Google Gemini API drives the AI reasoning engine.</p>

    <p style="font-weight: bold;">Database:</p>
    <p style="text-align: justify;">The platform utilizes MongoDB as its primary document-oriented NoSQL database. MongoDB's schema flexibility easily accommodates complex AI validation outputs and startup metadata. Mongoose serves as the Object Data Modeling (ODM) layer, enforcing schema integrity and efficient aggregation pipelines.</p>

    <br clear="all" style="page-break-before: always;" />

    <h2 style="font-size: 16pt; font-weight: bold;">MODULES:</h2>
    <p style="font-weight: bold;">Module 1: User Authentication & Password Recovery:</p>
    <p style="text-align: justify;">Manages user registration, credential verification, profile updates, and password reset flows with real-time strength validation. Utilizes bcrypt for password hashing and issues signed JWT bearer tokens for stateless session verification.</p>

    <p style="font-weight: bold;">Module 2: Startup Idea Management:</p>
    <p style="text-align: justify;">Enables founders to create, edit, delete, search, and filter their startup ideas. Each idea acts as a foundational block that can be iteratively refined and sent for AI validation.</p>

    <p style="font-weight: bold;">Module 3: AI Validation Engine (Google Gemini):</p>
    <p style="text-align: justify;">The core computational module that interfaces with Google Gemini AI. It analyzes startup parameters to generate Innovation Scores, Market Potential, Scalability, SWOT matrices, Target Market insights, Monetization strategies, and a step-by-step MVP Roadmap, with resilient contextual fallback mechanisms.</p>

    <p style="font-weight: bold;">Module 4: Contextual AI Chat Assistant:</p>
    <p style="text-align: justify;">Provides an interactive conversational interface where founders ask specific follow-up questions about their validated startup. The AI advisor retains context about the startup's industry, strengths, and weaknesses to provide tailored strategic guidance.</p>

    <p style="font-weight: bold;">Module 5: Professional PDF Generation:</p>
    <p style="text-align: justify;">Utilizes PDFKit to convert structured AI validation metrics into clean, formatted, downloadable multi-page PDF reports suitable for investor pitches and incubator evaluations.</p>

    <p style="font-weight: bold;">Module 6: Analytics & Dashboarding:</p>
    <p style="text-align: justify;">A comprehensive dashboard rendering system-wide statistics. Visualizes validation trends, industry distributions of ideas, score gauges, and stage distributions via interactive charts.</p>

    <p style="font-weight: bold;">Module 7: Admin Governance Portal:</p>
    <p style="text-align: justify;">Provides platform administrators with oversight tools for managing registered users, elevating user roles (User to Admin), moderating inappropriate startup concepts, and tracking global platform adoption metrics.</p>

    <p style="font-weight: bold;">Module 8: SaaS Landing Showcase & Responsive UI:</p>
    <p style="text-align: justify;">A polished marketing frontend with interactive scorecard previews, capability grids, transparent pricing tiers, founder FAQs, and mobile-friendly responsive navigation drawers.</p>

    <br clear="all" style="page-break-before: always;" />

    <h2 style="font-size: 16pt; font-weight: bold;">FRONTEND CODE:</h2>
    <p style="font-weight: bold;">AppRoutes.jsx (Route Configuration):</p>
    <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 10pt;">
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ProtectedRoute, AdminRoute, GuestRoute } from './ProtectedRoute';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Landing from '../pages/Landing';
import NotFound from '../pages/NotFound';

import Dashboard from '../pages/Dashboard';
import CreateStartup from '../pages/CreateStartup';
import MyStartups from '../pages/MyStartups';
import ReportView from '../pages/ReportView';
import Analytics from '../pages/Analytics';
import ChatAssistant from '../pages/ChatAssistant';
import Profile from '../pages/Profile';
import AdminPanel from '../pages/admin/AdminPanel';

export default function AppRoutes() {
  return (
    &lt;Routes&gt;
      &lt;Route path="/" element={&lt;Landing /&gt;} /&gt;
      &lt;Route path="/login" element={&lt;GuestRoute&gt;&lt;Login /&gt;&lt;/GuestRoute&gt;} /&gt;
      &lt;Route path="/register" element={&lt;GuestRoute&gt;&lt;Register /&gt;&lt;/GuestRoute&gt;} /&gt;
      &lt;Route path="/forgot-password" element={&lt;GuestRoute&gt;&lt;ForgotPassword /&gt;&lt;/GuestRoute&gt;} /&gt;
      &lt;Route path="/reset-password/:token" element={&lt;GuestRoute&gt;&lt;ResetPassword /&gt;&lt;/GuestRoute&gt;} /&gt;

      &lt;Route element={&lt;ProtectedRoute&gt;&lt;DashboardLayout /&gt;&lt;/ProtectedRoute&gt;}&gt;
        &lt;Route path="/dashboard" element={&lt;Dashboard /&gt;} /&gt;
        &lt;Route path="/create" element={&lt;CreateStartup /&gt;} /&gt;
        &lt;Route path="/edit/:id" element={&lt;CreateStartup /&gt;} /&gt;
        &lt;Route path="/my-startups" element={&lt;MyStartups /&gt;} /&gt;
        &lt;Route path="/report/:startupId" element={&lt;ReportView /&gt;} /&gt;
        &lt;Route path="/analytics" element={&lt;Analytics /&gt;} /&gt;
        &lt;Route path="/chat" element={&lt;ChatAssistant /&gt;} /&gt;
        &lt;Route path="/profile" element={&lt;Profile /&gt;} /&gt;
        &lt;Route path="/admin" element={&lt;AdminRoute&gt;&lt;AdminPanel /&gt;&lt;/AdminRoute&gt;} /&gt;
      &lt;/Route&gt;

      &lt;Route path="*" element={&lt;NotFound /&gt;} /&gt;
    &lt;/Routes&gt;
  );
}
    </pre>

    <br/>
    <h2 style="font-size: 16pt; font-weight: bold;">BACKEND CODE:</h2>
    <p style="font-weight: bold;">server.js (Main Express Gateway):</p>
    <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 10pt;">
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const startupRoutes = require('./routes/startupRoutes');
const validationRoutes = require('./routes/validationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/validations', validationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
});
    </pre>

    <br clear="all" style="page-break-before: always;" />

    <h2 style="font-size: 16pt; font-weight: bold;">OUTPUT:</h2>
    
    <p style="font-weight: bold; color: #0070c0;">Fig 1: SaaS Landing Page</p>
    <div style="border: 2px dashed #ccc; width: 100%; height: 300px; text-align: center; line-height: 300px; color: #888;">
        [PLACEHOLDER: Insert Landing Page Screenshot Here]
    </div>
    <p style="text-align: justify;">The public landing view featuring the main value proposition, highlighting the AI validation features, and call-to-action buttons for user registration.</p>
    <br>

    <p style="font-weight: bold; color: #0070c0;">Fig 2: Authentication Portal</p>
    <div style="border: 2px dashed #ccc; width: 100%; height: 300px; text-align: center; line-height: 300px; color: #888;">
        [PLACEHOLDER: Insert Login/Register Screenshot Here]
    </div>
    <p style="text-align: justify;">Secure login, registration, and password recovery interface backed by encrypted JWT token generation and bcrypt hashing.</p>
    <br>

    <p style="font-weight: bold; color: #0070c0;">Fig 3: Founder Dashboard & Analytics</p>
    <div style="border: 2px dashed #ccc; width: 100%; height: 300px; text-align: center; line-height: 300px; color: #888;">
        [PLACEHOLDER: Insert Dashboard Screenshot Here]
    </div>
    <p style="text-align: justify;">The user operational dashboard displaying saved startup ideas, score gauges, validation trends, and quick access to create new ideas.</p>
    <br>

    <p style="font-weight: bold; color: #0070c0;">Fig 4: AI Validation Report & SWOT</p>
    <div style="border: 2px dashed #ccc; width: 100%; height: 300px; text-align: center; line-height: 300px; color: #888;">
        [PLACEHOLDER: Insert AI Report Screenshot Here]
    </div>
    <p style="text-align: justify;">Comprehensive AI analysis view rendering Innovation Scores, SWOT analysis, Target Market insights, and MVP Roadmap generated by Google Gemini.</p>
    <br>

    <p style="font-weight: bold; color: #0070c0;">Fig 5: Contextual AI Chat Assistant</p>
    <div style="border: 2px dashed #ccc; width: 100%; height: 300px; text-align: center; line-height: 300px; color: #888;">
        [PLACEHOLDER: Insert AI Chat Assistant Screenshot Here]
    </div>
    <p style="text-align: justify;">Interactive conversational AI providing tailored strategic feedback retainining full context of the founder's validated business idea.</p>
    <br>

    <p style="font-weight: bold; color: #0070c0;">Fig 6: Professional PDF Export</p>
    <div style="border: 2px dashed #ccc; width: 100%; height: 300px; text-align: center; line-height: 300px; color: #888;">
        [PLACEHOLDER: Insert PDF Export Screenshot Here]
    </div>
    <p style="text-align: justify;">Demonstrating the downloadable multi-page PDF report feature, converting AI validation metrics into a professional document format for investor pitches.</p>
    <br>

    <br clear="all" style="page-break-before: always;" />

    <h2 style="font-size: 16pt; font-weight: bold; color: #0070c0;">CONCLUSION & FUTURE ENHANCEMENTS</h2>
    
    <p style="font-weight: bold;">Conclusion</p>
    <p style="text-align: justify;">The AI Startup Validator successfully demonstrates the efficacy of modern MERN stack technologies coupled with advanced Generative AI (Google Gemini) in solving early-stage entrepreneurial challenges. By combining robust data management with intelligent AI insights, the platform dramatically reduces the time required for market research and validation, empowering founders to make data-driven decisions with confidence.</p>
    
    <p style="font-weight: bold;">Future Enhancements</p>
    <p style="text-align: justify;">1. <b>Competitor Analysis Integration:</b> Integrating third-party APIs (like Crunchbase or Clearbit) to automatically fetch and analyze real-world competitors based on the startup idea description.</p>
    <p style="text-align: justify;">2. <b>Financial Projections Engine:</b> Adding a module that utilizes AI to estimate initial startup costs, burn rate, and potential revenue models based on the selected industry and target market.</p>
    <p style="text-align: justify;">3. <b>Multi-User Collaboration:</b> Allowing founders to invite co-founders or team members to their workspace to collaboratively edit and refine startup ideas.</p>
    <p style="text-align: justify;">4. <b>Pitch Deck Generator:</b> Expanding the PDF generation capabilities to automatically construct structured presentation slides (Pitch Decks) directly from the AI validation data.</p>

</body>
</html>
`;

(async () => {
    try {
        const fileBuffer = await HTMLtoDOCX(htmlString, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true,
            margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        });
        fs.writeFileSync('AI_Startup_Validator_Report.docx', fileBuffer);
        console.log('Report generated successfully as AI_Startup_Validator_Report.docx');
    } catch (error) {
        console.error('Error generating document:', error);
    }
})();
