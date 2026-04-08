# EduDisha: AI-Powered Career Guidance Portal 🚀

[![Powered by Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blueviolet?style=for-the-badge&logo=google-gemini)](https://deepmind.google/technologies/gemini/)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/mern-stack)
[![NEP 2020 Aligned](https://img.shields.io/badge/Standards-NEP%202020-orange?style=for-the-badge)](https://www.education.gov.in/nep-2020)

**EduDisha** is a production-grade, AI-driven career counselling platform designed to synchronize the aspirations of students, the guidance of educators, and the monitoring of parents. Aligned with the **NEP 2020** guidelines, it leverages advanced cognitive AI to provide personalized career trajectories.

---

## 🌟 Core Pillars

### 🎓 Student Portal (Learner Console)
*   **AI Career Mentor**: An interactive chatbot powered by Gemini 1.5 Flash for real-time career counseling.
*   **Priority Mentorship Alerts**: High-visibility alerts for teacher-assigned quizzes and milestones.
*   **Career Simulations**: Interactive modules for exploring modern professional fields.
*   **Gamified Roadmap**: Visual progress tracking of skill development and aptitude gain.

### 👩‍🏫 Educator Portal (Teacher Dashboard)
*   **AI Quiz Hub**: One-click generation of aptitude tests customized by parameters (Coding, Robotics, Logic).
*   **Global Cognitive Explorer**: Unified search engine to locate students, skills, and records across the school registry.
*   **Performance Audit**: School-wide analytics including Avg. Performance, Active Participation, and Roster management.
*   **Official Reporting**: Automated PDF generation for student progress reports using `jsPDF`.

### 👨‍👩‍👦 Guardian Portal (Parent Dashboard)
*   **Child Trajectory Sync**: Real-time monitoring of linked student accounts.
*   **Guardian Alerts**: Automated notifications for quiz results and teacher feedback.
*   **Skill Velocity Index**: Visualization of child's skill growth vs. class benchmarks.
*   **Career Roadmap Alignment**: Insights into AI-suggested career paths for their children.

---

## 🛠️ Technical Architecture

### Tech Stack
- **Frontend**: React (Vite), Tailwind CSS (Premium Aesthetic), Framer Motion.
- **Backend**: Node.js, Express.js (RESTful API).
- **Database**: MongoDB (Mongoose ODM).
- **AI Engine**: Google Gemini API (`gemini-1.5-flash`).
- **Reporting**: `jspdf` & `jspdf-autotable`.

### Key Systems
*   **Global Notification Engine**: Cross-role notification stream with 30-day TTL indexing.
*   **RBAC Security**: Role-Based Access Control using JWT (JSON Web Tokens) for Students, Teachers, and Parents.
*   **Schema Synchronization**: Strict JSON schema enforcement for AI-generated assessment data.

---

## 📂 Project Structure

```bash
career-guidance-portal/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI Architecture
│   │   ├── layouts/        # Role-based Layout wrappers
│   │   ├── pages/          # Dashboard & Content views
│   │   └── context/        # Auth & Global State
├── server/                 # Node.js Backend
│   ├── controllers/        # Business Logic (Teacher, Student, Parent)
│   ├── models/             # Mongoose Data Schemas
│   ├── routes/             # Protected API Endpoints
│   └── services/           # AI Generator & External Integrations
└── README.md
```

---

## 🚀 Installation & Setup

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Atlas or Local)
*   Google Gemini API Key

### 2. Environment Configuration
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_hyper_secure_secret
GEMINI_API_KEY=your_google_gemini_key
```

### 3. Quick Start
```bash
# Install Server Dependencies
cd server && npm install

# Install Client Dependencies
cd ../client && npm install

# Run Project (Concurrent)
# From Root:
npm start
```

---

## 📈 Future Roadmap
- [ ] **School Admin Module**: Multi-school management and subscription handling.
- [ ] **Live Career Webinars**: Integration with Zoom/Google Meet for expert sessions.
- [ ] **Blockchain Credentials**: Verified skill certificates using smart contracts.

---

## 📄 License & Attribution
Designed and Developed with ❤️ by **Antigravity AI**.
Built for the future of Indian Education.

> *Disclaimer: This project is intended for educational and career advancement purposes, adhering to the data privacy and ethical AI standards.*
