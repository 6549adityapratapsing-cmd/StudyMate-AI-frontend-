import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GraduationCap, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '20px',
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--glass-shadow)',
        }}
      >
        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--brand-gradient)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px var(--primary-glow)',
              marginBottom: '16px',
            }}
          >
            <GraduationCap size={32} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Sign in to continue your exam preparation
          </p>
        </div>

        {/* Error Banner */}
        {authError && (
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-md)',
              color: '#f87171',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={18} />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              College Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (authError) setAuthError(null);
                }}
                required
                style={{ paddingLeft: '40px' }}
              />
              <Mail
                size={18}
                color="var(--text-dim)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (authError) setAuthError(null);
                }}
                required
                style={{ paddingLeft: '40px' }}
              />
              <Lock
                size={18}
                color="var(--text-dim)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px' }}
            disabled={isSubmitting}
          >
            <LogIn size={18} />
            <span>{isSubmitting ? 'Signing In...' : 'Sign In to StudyMate'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
}
