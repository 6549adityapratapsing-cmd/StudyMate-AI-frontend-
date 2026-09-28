import React from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Sparkles,
  Brain,
  CheckSquare,
  Layers,
  Flame,
  UploadCloud,
  MessageSquare,
  ShieldCheck,
  GraduationCap,
  LogIn,
  UserPlus,
  LogOut,
  User
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

function AppLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Left Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {/* Logo Banner */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--primary-glow)',
            }}
          >
            <GraduationCap size={24} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800, color: '#fff' }}>
              StudyMate <span className="text-gradient">AI</span>
            </h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>EXAM PREPARATION</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', padding: '8px 12px' }}>
            Study Engine
          </div>

          <NavLink
            to="/"
            className={({ isActive }) =>
              `btn btn-secondary ${isActive ? 'active' : ''}`
            }
            style={({ isActive }) => ({
              justifyContent: 'flex-start',
              background: isActive ? 'rgba(99, 102, 241, 0.15)' : undefined,
              borderColor: isActive ? 'var(--border-active)' : undefined,
            })}
          >
            <Brain size={18} color="var(--primary)" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/materials" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <UploadCloud size={18} color="var(--secondary)" />
            <span>Upload Material</span>
          </NavLink>

          <NavLink to="/summary" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <FileText size={18} color="#a855f7" />
            <span>Summaries & Notes</span>
          </NavLink>

          <NavLink to="/important-questions" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Flame size={18} color="#f59e0b" />
            <span>Important Questions</span>
          </NavLink>

          <NavLink to="/repeated-questions" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Sparkles size={18} color="#ec4899" />
            <span>Repeated Questions</span>
          </NavLink>

          <NavLink to="/quiz" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <CheckSquare size={18} color="#10b981" />
            <span>Quiz & Practice Test</span>
          </NavLink>

          <NavLink to="/flashcards" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Layers size={18} color="#38bdf8" />
            <span>Flashcards</span>
          </NavLink>

          <NavLink to="/chat" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <MessageSquare size={18} color="#818cf8" />
            <span>AI Study Chat</span>
          </NavLink>
        </nav>

        {/* Student Session Card or Sign In Prompt */}
        {isAuthenticated && user ? (
          <div
            className="glass-card"
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--brand-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#fff',
                }}
              >
                {user.full_name ? user.full_name[0].toUpperCase() : 'S'}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user.full_name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {user.college_course || 'Student'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.78rem', justifyContent: 'center' }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <LogIn size={16} />
              <span>Sign In</span>
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <UserPlus size={16} />
              <span>Register</span>
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Navbar */}
        <header
          style={{
            height: 'var(--navbar-height)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(14, 19, 31, 0.6)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              StudyMate <span className="text-gradient">AI System</span>
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} />
              <span>JWT & bcrypt Active</span>
            </div>

            {isAuthenticated && user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Hi, <strong style={{ color: '#fff' }}>{user.full_name.split(' ')[0]}</strong>
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page View Container */}
        <div style={{ padding: '36px', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<DashboardHome />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function DashboardHome() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Welcome Card */}
      <div
        className="glass-card"
        style={{
          padding: '36px',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(14, 19, 31, 0.8) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        }}
      >
        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
          <div className="badge badge-revision" style={{ marginBottom: '16px' }}>
            {isAuthenticated ? `Welcome, ${user?.full_name}` : '🎓 College Exam Prep Architecture Ready'}
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '14px', lineHeight: 1.2 }}>
            Transform your study materials into an <span className="text-gradient">AI Exam Prep System</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '24px' }}>
            Upload PDFs, handwritten note photos, or past question papers. StudyMate AI analyzes your material
            to generate targeted summaries, repeated exam questions, interactive quizzes, and flashcards.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn btn-primary">
                  <UserPlus size={18} />
                  <span>Get Started (Create Account)</span>
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  <LogIn size={18} />
                  <span>Sign In</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/materials" className="btn btn-primary">
                  <UploadCloud size={18} />
                  <span>Upload Study Material</span>
                </Link>
                <Link to="/summary" className="btn btn-secondary">
                  <Sparkles size={18} />
                  <span>Explore AI Presets</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            AUTHENTICATION
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>
            {isAuthenticated ? 'Authenticated' : 'Ready'}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
            bcrypt password hashing & stateless JWT token session management.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            STUDENT STATUS
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
            {isAuthenticated ? user?.college_course || 'Active Student' : 'Guest Student'}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
            {isAuthenticated ? `Logged in as ${user?.email}` : 'Sign in to sync your study materials.'}
          </p>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            NEXT PHASE
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>Material Ingestion</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
            PDF Parsing (`pdf-parse`), Image OCR (`tesseract.js`), and Multer uploads.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
