import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { materialsAPI, aiAPI } from '../services/api.js';
import {
  Flame,
  Star,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  UploadCloud,
  FileText
} from 'lucide-react';

export default function ImportantQuestionsPage() {
  const [searchParams] = useSearchParams();
  const initialMaterialId = searchParams.get('materialId') || '';

  const { isAuthenticated } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(initialMaterialId);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Filter: 'all' | 'very_important' | 'important' | 'revision'
  const [filterPriority, setFilterPriority] = useState('all');

  // Expanded Answer Guide IDs map
  const [expandedIds, setExpandedIds] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      loadMaterials();
    } else {
      setLoadingMaterials(false);
    }
  }, [isAuthenticated]);

  const loadMaterials = async () => {
    try {
      setLoadingMaterials(true);
      const res = await materialsAPI.list();
      if (res.success && res.data?.materials) {
        setMaterials(res.data.materials);
        if (!selectedMaterialId && res.data.materials.length > 0) {
          setSelectedMaterialId(res.data.materials[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  useEffect(() => {
    if (selectedMaterialId) {
      handleGenerateQuestions();
    }
  }, [selectedMaterialId]);

  const handleGenerateQuestions = async () => {
    if (!selectedMaterialId) return;
    setLoadingAI(true);
    setErrorMsg('');
    try {
      const res = await aiAPI.getImportantQuestions({ materialId: selectedMaterialId });
      if (res.success && res.data?.questions) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate important questions.');
    } finally {
      setLoadingAI(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIds((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterPriority === 'all') return true;
    return q.importance === filterPriority;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Title */}
      <div>
        <div className="badge badge-very-important" style={{ marginBottom: '10px' }}>
          Exam Yield Engine
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
          Important <span className="text-gradient">Exam Questions</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
          AI-curated questions prioritized by university exam importance, conceptual depth, and grading weight.
        </p>
      </div>

      {/* Material Selector & Filter */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <label className="form-label" style={{ fontWeight: 600, color: '#fff', marginBottom: '8px', display: 'block' }}>
              Select Study Material:
            </label>
            {materials.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No materials uploaded yet.{' '}
                <Link to="/materials" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Upload notes or a question bank.
                </Link>
              </div>
            ) : (
              <select
                className="form-select"
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id} style={{ background: 'var(--bg-surface)' }}>
                    {m.title} {m.is_question_paper ? '(Exam Paper)' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={handleGenerateQuestions}
            className="btn btn-primary"
            disabled={!selectedMaterialId || loadingAI}
            style={{ padding: '10px 18px', fontSize: '0.9rem' }}
          >
            <Sparkles size={16} />
            <span>Regenerate Questions</span>
          </button>
        </div>

        {/* Priority Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button
            onClick={() => setFilterPriority('all')}
            className={`btn btn-secondary ${filterPriority === 'all' ? 'active' : ''}`}
            style={{ padding: '6px 14px', fontSize: '0.85rem', background: filterPriority === 'all' ? 'var(--primary)' : undefined }}
          >
            All Questions ({questions.length})
          </button>
          <button
            onClick={() => setFilterPriority('very_important')}
            className={`btn btn-secondary ${filterPriority === 'very_important' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.85rem',
              color: '#f87171',
              background: filterPriority === 'very_important' ? 'var(--danger-bg)' : undefined,
            }}
          >
            🔥 Very Important ({questions.filter((q) => q.importance === 'very_important').length})
          </button>
          <button
            onClick={() => setFilterPriority('important')}
            className={`btn btn-secondary ${filterPriority === 'important' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.85rem',
              color: '#fbbf24',
              background: filterPriority === 'important' ? 'var(--warning-bg)' : undefined,
            }}
          >
            ⭐ Important ({questions.filter((q) => q.importance === 'important').length})
          </button>
          <button
            onClick={() => setFilterPriority('revision')}
            className={`btn btn-secondary ${filterPriority === 'revision' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.85rem',
              color: '#60a5fa',
              background: filterPriority === 'revision' ? 'var(--info-bg)' : undefined,
            }}
          >
            📝 Revision ({questions.filter((q) => q.importance === 'revision').length})
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div
          style={{
            padding: '14px 18px',
            background: 'var(--danger-bg)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loadingAI && (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Formulating High-Yield Exam Questions...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Evaluating conceptual weight, derivations, and grading criteria.
          </p>
        </div>
      )}

      {/* Questions List */}
      {!loadingAI && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredQuestions.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
              <HelpCircle size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>No questions found in this category</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                Try selecting "All Questions" or choose another study material.
              </p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => (
              <div
                key={idx}
                className="glass-card animate-fade-in"
                style={{
                  padding: '24px',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: `4px solid ${
                    q.importance === 'very_important'
                      ? 'var(--danger)'
                      : q.importance === 'important'
                      ? 'var(--warning)'
                      : 'var(--info)'
                  }`,
                }}
              >
                {/* Header Badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span
                      className={`badge ${
                        q.importance === 'very_important'
                          ? 'badge-very-important'
                          : q.importance === 'important'
                          ? 'badge-important'
                          : 'badge-revision'
                      }`}
                    >
                      {q.importance === 'very_important' ? '🔥 VERY IMPORTANT' : q.importance.toUpperCase()}
                    </span>

                    <span className="badge badge-revision">
                      {q.type || 'Conceptual'}
                    </span>

                    {q.topic && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        Topic: <strong style={{ color: '#fff' }}>{q.topic}</strong>
                      </span>
                    )}
                  </div>

                  {q.expectedMarks && (
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8' }}>
                      {q.expectedMarks} Marks
                    </div>
                  )}
                </div>

                {/* Question Text */}
                <h3 style={{ fontSize: '1.18rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '16px', color: '#fff' }}>
                  Q{idx + 1}. {q.question}
                </h3>

                {/* Answer Guide Toggle */}
                {q.answerGuide && (
                  <div>
                    <button
                      onClick={() => toggleExpand(idx)}
                      className="btn btn-secondary"
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.82rem',
                        gap: '6px',
                        borderColor: 'rgba(255,255,255,0.1)',
                      }}
                    >
                      {expandedIds[idx] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      <span>{expandedIds[idx] ? 'Hide Answer Guide' : 'View Full Marks Answer Guide'}</span>
                    </button>

                    {expandedIds[idx] && (
                      <div
                        style={{
                          marginTop: '14px',
                          padding: '16px 20px',
                          background: 'rgba(99, 102, 241, 0.08)',
                          border: '1px solid rgba(99, 102, 241, 0.25)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.92rem',
                          lineHeight: 1.7,
                          color: '#e0e7ff',
                        }}
                      >
                        <div style={{ fontWeight: 700, color: '#818cf8', marginBottom: '6px' }}>
                          🎯 Key Points Required for Full Marks:
                        </div>
                        {q.answerGuide}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
