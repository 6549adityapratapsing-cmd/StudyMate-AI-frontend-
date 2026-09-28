# 🎓 StudyMate AI - Frontend Client

The official Single Page Application (SPA) frontend for **StudyMate AI** — an AI-Powered Study and Exam Preparation Assistant built for college students.

---

## 🌐 Live Production Application
- **Live Web App**: [https://study-mate-ai-frontend-6hw8jirij-studymeta-ai.vercel.app/](https://study-mate-ai-frontend-6hw8jirij-studymeta-ai.vercel.app/)
- **Live Backend API**: [https://studymate-ai-backend-kmhk.onrender.com/api](https://studymate-ai-backend-kmhk.onrender.com/api)

---

## 🛠️ Tech Stack
- **Framework**: React 18
- **Bundler**: Vite
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Design System**: Obsidian Deep Dark Theme with Glassmorphism, CSS Custom Properties & Animations

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `VITE_API_URL` points to your backend server:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure
```
src/
├── assets/          # Brand logos & icons
├── components/      # Reusable UI cards, badges, navbar, sidebar
├── context/         # AuthContext (JWT session management)
├── pages/           # Login, Register, Dashboard, Materials
├── services/        # Centralized API fetch client with Bearer auth
├── App.jsx          # Route configurations & layout shell
├── index.css        # Modern design system & tokens
└── main.jsx         # React root mounting
```
