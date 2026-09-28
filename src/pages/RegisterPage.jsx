import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GraduationCap, Mail, Lock, User, BookOpen, UserPlus, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [collegeCourse, setCollegeCourse] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      email,
      password,
      fullName,
      collegeCourse,
    });
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
          maxWidth: '480px',
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--glass-shadow)',
        }}
      >
        {/* Header */}
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
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create Student Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Start analyzing your study material & ace your exams
          </p>
        </div>

        {/* Error Banners */}
        {(validationError || authError) && (
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
            <span>{validationError || authError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-fullname">
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-fullname"
                type="text"
                className="form-input"
                placeholder="e.g. Alex Johnson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ paddingLeft: '40px' }}
              />
              <User
                size={18}
                color="var(--text-dim)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-course">
              Course / Degree Program
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-course"
                type="text"
                className="form-input"
                placeholder="e.g. B.Tech Computer Science, 1st Year"
                value={collegeCourse}
                onChange={(e) => setCollegeCourse(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <BookOpen
                size={18}
                color="var(--text-dim)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              College Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-email"
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

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              Password (min. 6 characters)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
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

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="reg-confirm-password">
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-confirm-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px' }}
            disabled={isSubmitting}
          >
            <UserPlus size={18} />
            <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
