# 🧠 Swasthya Initiative AI — Mental Health Monitoring System

> AI-Based Mental Health Monitoring and Support System for Students

A full-stack, AI-powered web application that helps students track **Stress**, **Anxiety**, and **Depression** through validated assessments, an empathetic AI chatbot (Mira), a private journal with sentiment analysis, and personalized wellness recommendations — with a privacy-first teacher dashboard.

---

## 📁 Project Structure

```
mental-health-app/
│
├── frontend/                    # React.js application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Sidebar.js       # Navigation sidebar
│   │   │   ├── Charts.js        # TrendChart, BarChart, RadialScore
│   │   │   ├── AlertBanner.js   # High-risk alert banner
│   │   │   └── AppLayout.js     # Page wrapper with title block
│   │   ├── pages/               # One file per page/screen
│   │   │   ├── LandingPage.js
│   │   │   ├── AuthPage.js
│   │   │   ├── StudentDashboard.js
│   │   │   ├── AssessmentPage.js   # Shared for stress/anxiety/depression
│   │   │   ├── ChatbotPage.js
│   │   │   ├── JournalPage.js
│   │   │   ├── RecommendationsPage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── TeacherDashboard.js
│   │   │   ├── RiskAlertsPage.js
│   │   │   └── AnalyticsPage.js
│   │   ├── data/                # Static data and questions
│   │   │   ├── mockData.js      # Mock students, trends, dept data
│   │   │   ├── questions.js     # PSS / GAD-7 / PHQ-9 questions
│   │   │   └── recommendations.js
│   │   ├── utils/               # Helper functions
│   │   │   ├── helpers.js       # getRiskLevel, getScoreColor, etc.
│   │   │   └── api.js           # All API calls (Claude + backend)
│   │   ├── styles/
│   │   │   └── global.css       # Design tokens, animations, utilities
│   │   ├── App.js               # Root router
│   │   └── index.js             # React entry point
│   └── package.json
│
├── backend/                     # Node.js + Express API
│   ├── config/
│   │   └── db.js                # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js              # JWT protect + requireRole
│   ├── models/
│   │   ├── User.js
│   │   ├── Assessment.js
│   │   └── Journal.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── assessmentController.js
│   │   ├── journalController.js
│   │   └── chatbotController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── journalRoutes.js
│   │   └── chatbotRoutes.js
│   ├── database/
│   │   └── schema.sql           # Full MySQL schema
│   ├── server.js                # Express entry point
│   ├── .env.example             # Environment variable template
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- **MySQL** 8.0+ (optional — app works without it in demo mode)
- A free **Anthropic API key** from [console.anthropic.com](https://console.anthropic.com)

---

### Step 1 — Clone / Extract the Project

```bash
cd mental-health-app
```

---

### Step 2 — Set Up the Frontend

```bash
cd frontend
npm install
```

The frontend calls the Claude API directly from the browser (standard for development). No extra config needed to run.

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

**Demo access** — click the demo buttons on the login page:
- 👩‍🎓 **Student Demo** → full student dashboard
- 👨‍🏫 **Teacher Demo** → aggregated class view

---

### Step 3 — Set Up the Backend 

```bash
cd ../backend
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mindcare_db
JWT_SECRET=pick_a_long_random_string
```

Start the backend:
```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start        # production
```

---

### Step 4 — Set Up the Database (Optional)

```bash
mysql -u root -p < backend/database/schema.sql
```

This creates all 7 tables:
- `users` · `stress_tests` · `anxiety_tests` · `depression_tests`
- `journal_entries` · `predictions` · `alerts` · `consent_settings`

> **Note:** The frontend works fully in demo/mock mode without a database. MySQL only needed for data persistence.

---

## 🧪 Running Both Together

Open two terminals:

**Terminal 1 — Frontend:**
```bash
cd frontend && npm start
```

**Terminal 2 — Backend:**
```bash
cd backend && npm run dev
```

Frontend proxies `/api/*` calls to `http://localhost:5000` automatically (configured in `frontend/package.json`).

---

## 🌐 API Endpoints

| Method | Endpoint                    | Auth     | Description                       |
|--------|-----------------------------|----------|-----------------------------------|
| POST   | `/api/auth/login`           | Public   | Login                             |
| POST   | `/api/auth/signup`          | Public   | Register                          |
| GET    | `/api/auth/me`              | JWT      | Get current user                  |
| POST   | `/api/assessment`           | JWT      | Submit assessment result          |
| GET    | `/api/assessment/history`   | JWT      | Get user's past scores            |
| GET    | `/api/assessment/class-stats` | Teacher | Aggregated class data           |
| POST   | `/api/journal`              | JWT      | Save journal entry                |
| GET    | `/api/journal`              | JWT      | Get user's journal entries        |
| POST   | `/api/chatbot`              | JWT      | Send message to AI chatbot        |
| GET    | `/api/health`               | Public   | Backend health check              |

---

## 🧠 AI Features

| Feature                  | How It Works                                     |
|--------------------------|--------------------------------------------------|
| **Mira Chatbot**         | Claude API with mental health system prompt      |
| **Sentiment Detection**  | Embedded `[SENTIMENT:...]` tag in Claude replies |
| **Assessment Insight**   | Claude generates 3-sentence empathetic analysis  |
| **Journal Analysis**     | Claude returns structured JSON sentiment + score |

---

## 👥 User Roles

| Role       | Access                                                           |
|------------|------------------------------------------------------------------|
| **Student**  | Dashboard, 3 assessments, chatbot, journal, recommendations    |
| **Teacher**  | Aggregated class stats, risk alerts, analytics (no personal data)|
| **Parent**   | Emergency alert notification only (with student consent)       |

---

## 🔒 Privacy Design

- Teachers see **only aggregated, anonymized** data
- Journal entries and chat history are **never shared**
- Parent notifications require explicit **student consent**
- No personal health data visible to unauthorized roles

---

## 🛠 Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Frontend     | React.js 18, pure CSS-in-JS       |
| Charts       | Custom SVG (no library needed)    |
| AI / NLP     | Claude API (Anthropic)            |
| Backend      | Node.js + Express.js              |
| Database     | MySQL 8 with mysql2 driver        |
| Auth         | JWT (jsonwebtoken + bcryptjs)     |
| Assessments  | PSS-7, GAD-7, PHQ-9 scales        |

---

## 📊 Assessment Scales Used

| Test       | Clinical Scale           | Questions |
|------------|--------------------------|-----------|
| Stress     | PSS (Perceived Stress)   | 7         |
| Anxiety    | GAD-7                    | 7         |
| Depression | PHQ-9                    | 7         |

Score ranges: **0–44 Low** · **45–69 Moderate** · **70–100 High Risk**

---

## 📝 Project Report Notes

This project demonstrates:
1. **AI Integration** — Real-time API for chatbot, assessment analysis, and sentiment detection
2. **Full-Stack Architecture** — Separated React frontend + Express backend with REST APIs
3. **Database Design** — Normalized MySQL schema with 8 tables and foreign key relationships
4. **Privacy-First Design** — Role-based access control with JWT authentication
5. **Clinical Validity** — Uses internationally validated mental health screening scales
6. **Scalable Structure** — Modular file organization following industry conventions

---

*MindCare AI*
