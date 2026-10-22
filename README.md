# 🚀 AI Startup Validator

A production-ready SaaS web application that validates startup ideas using **Google Gemini AI**. Built with the **MERN Stack** (MongoDB, Express.js, React 18, Node.js) and styled with Tailwind CSS and Framer Motion.

---

## 🌟 Key Features

- 🌐 **Modern SaaS Landing Page** — Interactive marketing homepage with live demo previews, feature breakdown, pricing tiers, and founder FAQs.
- 🔐 **JWT Authentication & Security** — Registration, Login, Forgot Password, Reset Password with password strength meters, and bcrypt cryptographic hashing.
- 💡 **Startup Idea Management** — Full CRUD operations: Create, Read, Update, Delete, Search, and Filter by Industry and Stage.
- 🤖 **AI Validation Engine (Google Gemini)** — Deep synthesis analyzing 25+ quantitative & qualitative metrics (Innovation Score, Market Potential, Scalability, Investor Readiness, and Success Probability).
- 📊 **Comprehensive Reports** — Executive Summary, SWOT Analysis, Key Risks, Business Model Analysis, Revenue & Pricing Strategies, Go-To-Market Plan, and MVP Technical Roadmap.
- 📥 **Investor-Grade PDF Export** — Instant 1-click multi-page PDF generation styled with PDFKit for investor pitches and incubators.
- 💬 **Contextual AI Chat Assistant** — Interactive AI advisor with full memory of your startup details for instant tailored guidance on marketing, pricing, and tech stacks.
- 📈 **Analytics Dashboard** — Recharts-powered data visualizations, validation trend charts, industry distributions, and score gauges.
- 👨‍💼 **Admin Governance Panel** — Platform-wide user management, role elevation (User ↔ Admin), startup moderation, and platform metrics.
- 🌙 **Persistent Dark / Light Mode** — Seamless theme toggling with localStorage persistence.
- 📱 **Mobile-First Responsive UI** — Smooth drawer navigation and adaptable glassmorphism cards.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS 3, Framer Motion 11, Recharts 2, React Hook Form 7, React Icons
- **Backend:** Node.js 18+, Express.js 4, MongoDB, Mongoose 8, JWT, bcryptjs, Helmet, CORS, PDFKit
- **AI Engine:** Google Gemini API (`@google/generative-ai`) with intelligent contextual fallback
- **Report Generator:** `html-to-docx` (Academic Project Report)

---

## 🚀 Quick Setup & Run

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas URI)

### 2. Install Dependencies
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3. Environment Configuration
Verify or edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/startup-validator
JWT_SECRET=startup_validator_jwt_secret_key_2024_very_secure
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
CLIENT_URL=http://localhost:5173
```
> **Note:** If `GEMINI_API_KEY` is not provided or rate-limited, the application automatically uses an intelligent contextual analysis engine tailored to your startup parameters, ensuring uninterrupted operation.

### 4. Seed Demo Data (Recommended)
Populate the database with realistic demo accounts, pre-validated startups, and chat history with one command:
```bash
npm run seed
```

#### Demo Credentials:
| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@startupvalidator.com` | `Admin@123` | Full Admin Panel & Moderation |
| **Project Creator** | `sabare667@gmail.com` | (Your password) | Admin & Startups |
| **Founder** | `founder@startupvalidator.com` | `Founder@123` | 4 Pre-validated Startups & Chat |

### 5. Start the Application
Run both server and client:

```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2: Frontend Client (Port 5173)
cd client
npm run dev
```

Open your browser at **`http://localhost:5173`**

---

## 📁 Project Structure

```
├── client/                     # React 18 + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI cards, inputs, charts & layout
│   │   │   ├── charts/         # Gauge, Trend & Industry Recharts components
│   │   │   ├── layout/         # Header, Sidebar, DashboardLayout
│   │   │   ├── reports/        # SWOT matrix card, Report section card
│   │   │   └── ui/             # Card, Button, Badge, Modal, ThemeToggle
│   │   ├── contexts/           # AuthContext, ThemeContext
│   │   ├── hooks/              # useAuth custom hook
│   │   ├── pages/              # Landing, Dashboard, MyStartups, CreateStartup,
│   │   │   │                   # ReportView, Analytics, ChatAssistant, Profile
│   │   │   ├── admin/          # AdminPanel (Users, Startups, Analytics)
│   │   │   └── auth/           # Login, Register, ForgotPassword, ResetPassword
│   │   ├── routes/             # AppRoutes, ProtectedRoute, AdminRoute, GuestRoute
│   │   └── services/           # Axios instance with auth interceptors
│   └── vite.config.js          # Optimized chunking & proxy configuration
│
├── server/                     # Node.js + Express backend
│   ├── config/                 # MongoDB Mongoose connection
│   ├── controllers/            # Auth, User, Startup, Validation, Chat, Admin
│   ├── middleware/             # JWT auth, Admin role check, Validation, Error Handler
│   ├── models/                 # User, StartupIdea, ValidationReport, ChatHistory
│   ├── routes/                 # Express route definitions
│   ├── services/               # Gemini AI service, PDFKit service, Email service
│   ├── utils/                  # ApiError, helper utilities
│   ├── seed.js                 # Complete DB seeder with sample startups & users
│   └── server.js               # Application entry point
│
├── create-report.js            # DOCX Academic Report Generator
└── README.md                   # Project documentation
```

---

## 🔌 API Reference

### Authentication
- `POST /api/auth/register` — Register a new founder account
- `POST /api/auth/login` — Login and receive JWT token
- `POST /api/auth/forgot-password` — Request password reset email / token
- `POST /api/auth/reset-password/:token` — Reset password using token
- `GET /api/auth/me` — Get authenticated user details

### Startup Idea Management
- `POST /api/startups` — Create a new startup idea
- `GET /api/startups` — List all user's ideas (search & filter)
- `GET /api/startups/:id` — Get single startup idea details
- `PUT /api/startups/:id` — Update startup idea
- `DELETE /api/startups/:id` — Delete startup and its associated reports/chat

### AI Validation & PDF
- `POST /api/validations/:startupId` — Run Gemini AI validation analysis
- `GET /api/validations/:startupId/report` — Fetch validation report
- `GET /api/validations/:id/pdf` — Stream or download PDF report (supports Bearer token or `?token=` query param)
- `GET /api/validations` — List all validation reports with pagination

### Contextual AI Chat
- `POST /api/chat/:startupId` — Send question to AI advisor
- `GET /api/chat/:startupId` — Get chat conversation history
- `DELETE /api/chat/:startupId` — Clear chat conversation history

### Analytics & Admin
- `GET /api/analytics` — User-level analytics (scores, distribution, trends)
- `GET /api/admin/analytics` — Platform-wide statistics (Admin only)
- `GET /api/admin/users` — List all users (Admin only)
- `PUT /api/admin/users/:id/role` — Update user role between user and admin (Admin only)
- `DELETE /api/admin/users/:id` — Delete user account and all data (Admin only)
- `GET /api/admin/startups` — Moderation list of all startups across platform (Admin only)
- `DELETE /api/admin/startups/:id` — Delete inappropriate startup (Admin only)

---

## 🎓 Academic Credit & Author

- **Project:** MERN Project - AI Startup Validator
- **Author:** Sabareesh E
- **Register Number:** 714024104181
- **Institution:** Sri Shakthi Institute of Engineering and Technology (Autonomous), Coimbatore - 62
- **Documentation:** Run `node create-report.js` to compile the official submission DOCX report.

---

## 📄 License

MIT License — Feel free to use and adapt for your own startups!
