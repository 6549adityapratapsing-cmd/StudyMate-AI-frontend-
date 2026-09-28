import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { materialsAPI, aiAPI } from '../services/api.js';
import {
  FileText,
  Sparkles,
  BookOpen,
  ListChecks,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  ChevronRight,
  Layers,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function SummaryPage() {
  const [searchParams] = useSearchParams();
  const initialMaterialId = searchParams.get('materialId') || '';

  const { isAuthenticated } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(initialMaterialId);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  // Active AI View Mode: 'quick' | 'detailed' | 'keypoints' | 'explain'
  const [activeMode, setActiveMode] = useState('quick');
  const [conceptQuery, setConceptQuery] = useState('');

  // Results State
  const [quickSummary, setQuickSummary] = useState(null);
  const [detailedSummary, setDetailedSummary] = useState(null);
  const [keyPointsData, setKeyPointsData] = useState(null);
  const [explainData, setExplainData] = useState(null);

  // Loading & Error States
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  // Trigger Quick Summary when material changes
  useEffect(() => {
    if (selectedMaterialId) {
      handleGenerateQuickSummary();
    }
  }, [selectedMaterialId]);

  const handleGenerateQuickSummary = async () => {
    if (!selectedMaterialId) return;
    setLoadingAI(true);
    setErrorMsg('');
    try {
      const res = await aiAPI.getQuickSummary({ materialId: selectedMaterialId });
      if (res.success && res.data?.summary) {
        setQuickSummary(res.data.summary);
        setActiveMode('quick');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate summary.');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleGenerateDetailedSummary = async () => {
    if (!selectedMaterialId) return;
    setLoadingAI(true);
    setErrorMsg('');
    try {
      const res = await aiAPI.getDetailedSummary({ materialId: selectedMaterialId });
      if (res.success && res.data?.detailedSummary) {
        setDetailedSummary(res.data.detailedSummary);
        setActiveMode('detailed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate detailed summary.');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleGenerateKeyPoints = async () => {
    if (!selectedMaterialId) return;
    setLoadingAI(true);
    setErrorMsg('');
    try {
      const res = await aiAPI.getKeyPoints({ materialId: selectedMaterialId });
      if (res.success && res.data) {
        setKeyPointsData(res.data);
        setActiveMode('keypoints');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to extract key points.');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleExplainConcept = async (e) => {
    if (e) e.preventDefault();
    if (!selectedMaterialId || !conceptQuery.trim()) return;
    setLoadingAI(true);
    setErrorMsg('');
    try {
      const res = await aiAPI.explainConcept({
        materialId: selectedMaterialId,
        concept: conceptQuery.trim(),
      });
      if (res.success && res.data?.explanation) {
        setExplainData(res.data.explanation);
        setActiveMode('explain');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to explain concept.');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Title */}
      <div>
        <div className="badge badge-revision" style={{ marginBottom: '10px' }}>
          AI Study Assistant & Summaries
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
          Study <span className="text-gradient">Summaries & Notes</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
          Transform your uploaded chapters into concise summaries, structured topic reviews, and beginner-friendly explanations.
        </p>
      </div>

      {/* Material Selector Card */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <label className="form-label" style={{ fontWeight: 600, color: '#fff', marginBottom: '8px', display: 'block' }}>
              Select Study Material to Analyze:
            </label>
            {materials.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No materials uploaded yet.{' '}
                <Link to="/materials" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Upload a document first.
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
                    {m.title} ({m.file_type.toUpperCase()})
                  </option>
                ))}
              </select>
            )}
          </div>

          <Link to="/materials" className="btn btn-secondary" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
            <UploadCloud size={16} />
            <span>Upload New Material</span>
          </Link>
        </div>

        {/* AI Presets Selector Bar */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button
            onClick={() => {
              if (!quickSummary) handleGenerateQuickSummary();
              else setActiveMode('quick');
            }}
            className={`btn ${activeMode === 'quick' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-md)' }}
            disabled={!selectedMaterialId || loadingAI}
          >
            <Sparkles size={16} />
            <span>Quick Summary</span>
          </button>

          <button
            onClick={() => {
              if (!detailedSummary) handleGenerateDetailedSummary();
              else setActiveMode('detailed');
            }}
            className={`btn ${activeMode === 'detailed' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-md)' }}
            disabled={!selectedMaterialId || loadingAI}
          >
            <BookOpen size={16} />
            <span>Detailed Summary</span>
          </button>

          <button
            onClick={() => {
              if (!keyPointsData) handleGenerateKeyPoints();
              else setActiveMode('keypoints');
            }}
            className={`btn ${activeMode === 'keypoints' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-md)' }}
            disabled={!selectedMaterialId || loadingAI}
          >
            <ListChecks size={16} />
            <span>Key Revision Points</span>
          </button>

          <button
            onClick={() => setActiveMode('explain')}
            className={`btn ${activeMode === 'explain' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-md)' }}
            disabled={!selectedMaterialId || loadingAI}
          >
            <Lightbulb size={16} />
            <span>Explain Simply</span>
          </button>

          <Link
            to={`/important-questions?materialId=${selectedMaterialId}`}
            className="btn btn-secondary"
            style={{ borderRadius: 'var(--radius-md)', marginLeft: 'auto', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' }}
          >
            <Flame size={16} />
            <span>View Important Questions</span>
          </Link>
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
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>AI Study Engine Processing...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Analyzing definitions, formulas, and concepts from your selected material.
          </p>
        </div>
      )}

      {/* 1. Quick Summary View */}
      {!loadingAI && activeMode === 'quick' && quickSummary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Overview */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="var(--primary)" />
              <span>{quickSummary.title} — Executive Overview</span>
            </h2>
            <p style={{ color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {quickSummary.overview}
            </p>
          </div>

          {/* Core Concepts */}
          {quickSummary.coreConcepts?.length > 0 && (
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', color: '#38bdf8' }}>Core Concepts</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {quickSummary.coreConcepts.map((concept, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9rem',
                      color: '#e0f2fe',
                    }}
                  >
                    • {concept}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Definitions Grid */}
          {quickSummary.definitions?.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Important Definitions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {quickSummary.definitions.map((item, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#a855f7', marginBottom: '6px' }}>
                      {item.term}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {item.definition}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulas */}
          {quickSummary.formulas?.length > 0 && (
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', color: '#34d399' }}>
                Key Formulas & Equations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {quickSummary.formulas.map((f, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{f.name}</div>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>{f.explanation}</div>
                    </div>
                    <code
                      style={{
                        padding: '6px 14px',
                        background: 'rgba(0,0,0,0.4)',
                        color: '#6ee7b7',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        fontWeight: 700,
                      }}
                    >
                      {f.formula}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Detailed Summary View */}
      {!loadingAI && activeMode === 'detailed' && detailedSummary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{detailedSummary.chapterTitle}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Comprehensive topic-by-topic breakdown organized for structured revision.
            </p>
          </div>

          {detailedSummary.topics?.map((topic, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '12px' }}>
                {topic.topicName}
              </h3>
              <p style={{ color: 'var(--text-main)', lineHeight: 1.7, marginBottom: '20px' }}>
                {topic.summary}
              </p>

              {topic.subtopics?.map((sub, sIdx) => (
                <div
                  key={sIdx}
                  style={{
                    padding: '16px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>{sub.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
                    {sub.details}
                  </div>
                  {sub.keyTakeaway && (
                    <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 500 }}>
                      ✓ Exam Takeaway: {sub.keyTakeaway}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Checklist */}
          {detailedSummary.revisionChecklist?.length > 0 && (
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#fbbf24' }}>
                Pre-Exam Revision Checklist
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {detailedSummary.revisionChecklist.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={18} color="var(--success)" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Key Points View */}
      {!loadingAI && activeMode === 'keypoints' && keyPointsData && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
            High-Yield Key Points ({keyPointsData.totalPoints || keyPointsData.keyPoints?.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {keyPointsData.keyPoints?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                    {item.point}
                  </div>
                </div>
                <span
                  className={`badge ${
                    item.category === 'formula'
                      ? 'badge-success'
                      : item.category === 'definition'
                      ? 'badge-revision'
                      : 'badge-important'
                  }`}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {item.category || 'CONCEPT'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Explain Simply View */}
      {!loadingAI && activeMode === 'explain' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Query Bar */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Ask AI: Explain a Concept Simply</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
              Type any concept, equation, or topic from your notes, and the AI will break it down using beginner-friendly analogies.
            </p>
            <form onSubmit={handleExplainConcept} style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Inertia, Newton's 2nd Law, Entropy..."
                value={conceptQuery}
                onChange={(e) => setConceptQuery(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" disabled={!conceptQuery.trim() || loadingAI}>
                <Lightbulb size={18} />
                <span>Explain Simply</span>
              </button>
            </form>
          </div>

          {/* Explanation Card */}
          {explainData && (
            <div className="glass-card animate-fade-in" style={{ padding: '32px', borderColor: 'var(--border-active)' }}>
              <div className="badge badge-revision" style={{ marginBottom: '12px' }}>
                Beginner-Friendly Breakdown
              </div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>{explainData.concept}</h2>

              <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-main)', marginBottom: '24px' }}>
                {explainData.simpleExplanation}
              </div>

              {explainData.analogy && (
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    marginBottom: '16px',
                  }}
                >
                  <strong style={{ color: '#818cf8', display: 'block', marginBottom: '4px' }}>
                    💡 Real-World Analogy:
                  </strong>
                  <span style={{ color: '#e0e7ff' }}>{explainData.analogy}</span>
                </div>
              )}

              {explainData.examTip && (
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '4px' }}>
                    📝 Exam Tip:
                  </strong>
                  <span style={{ color: '#fef3c7' }}>{explainData.examTip}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
