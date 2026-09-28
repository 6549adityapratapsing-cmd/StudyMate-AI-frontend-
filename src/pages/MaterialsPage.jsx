import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { materialsAPI } from '../services/api.js';
import {
  UploadCloud,
  FileText,
  Image,
  FileCode,
  CheckCircle,
  AlertCircle,
  Trash2,
  Calendar,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  HelpCircle,
  LogIn
} from 'lucide-react';

export default function MaterialsPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Tab: 'file' or 'text'
  const [activeTab, setActiveTab] = useState('file');

  // Form State
  const [title, setTitle] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [isQuestionPaper, setIsQuestionPaper] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Upload Status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Materials List
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [filterType, setFilterType] = useState('all');

  const fileInputRef = useRef(null);

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
      }
    } catch (err) {
      console.error('Failed to load materials:', err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        // Strip extension for default title
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        setTitle(cleanName);
      }
      setErrorMsg('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        setTitle(cleanName);
      }
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isAuthenticated) {
      setErrorMsg('Please sign in or register to upload and save study materials.');
      return;
    }

    if (activeTab === 'file') {
      if (!selectedFile) {
        setErrorMsg('Please select a PDF or Image file to upload.');
        return;
      }

      setIsUploading(true);
      setUploadStatusMsg(
        selectedFile.type === 'application/pdf'
          ? 'Extracting text and tables from PDF...'
          : selectedFile.type.startsWith('image/')
          ? 'Running OCR on handwritten/printed notes...'
          : 'Processing document...'
      );

      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', title);
        formData.append('isQuestionPaper', isQuestionPaper);
        formData.append('academicYear', academicYear);

        const res = await materialsAPI.uploadFile(formData);
        if (res.success) {
          setSuccessMsg(
            `Successfully processed "${res.data.material.title}" (${res.data.stats.wordCount} words extracted)!`
          );
          // Reset form
          setSelectedFile(null);
          setTitle('');
          setAcademicYear('');
          setIsQuestionPaper(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          loadMaterials();
        }
      } catch (err) {
        setErrorMsg(err.message || 'Failed to upload and process file.');
      } finally {
        setIsUploading(false);
        setUploadStatusMsg('');
      }
    } else {
      // Pasted text
      if (!pastedText.trim() || pastedText.trim().length < 20) {
        setErrorMsg('Please paste at least a couple of sentences of study notes.');
        return;
      }

      setIsUploading(true);
      setUploadStatusMsg('Normalizing and cleaning notes...');

      try {
        const res = await materialsAPI.uploadText({
          title: title || 'Pasted Notes',
          text: pastedText,
          isQuestionPaper,
          academicYear,
        });

        if (res.success) {
          setSuccessMsg(
            `Successfully saved notes (${res.data.stats.wordCount} words)!`
          );
          setPastedText('');
          setTitle('');
          setAcademicYear('');
          setIsQuestionPaper(false);
          loadMaterials();
        }
      } catch (err) {
        setErrorMsg(err.message || 'Failed to save notes.');
      } finally {
        setIsUploading(false);
        setUploadStatusMsg('');
      }
    }
  };

  const handleDelete = async (id, materialTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${materialTitle}"?`)) return;

    try {
      await materialsAPI.delete(id);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      setSuccessMsg(`Deleted "${materialTitle}".`);
    } catch (err) {
      setErrorMsg('Failed to delete material: ' + err.message);
    }
  };

  const filteredMaterials = materials.filter((m) => {
    if (filterType === 'all') return true;
    if (filterType === 'pdf') return m.file_type === 'pdf';
    if (filterType === 'image') return m.file_type === 'image';
    if (filterType === 'paper') return m.is_question_paper;
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <div className="badge badge-revision" style={{ marginBottom: '10px' }}>
          Document Ingestion & OCR Pipeline
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
          Upload <span className="text-gradient">Study Material</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
          Upload textbook chapters (PDF), photographs of handwritten notes (OCR), previous-year exam papers, or paste lecture notes.
        </p>
      </div>

      {/* Guest Warning */}
      {!isAuthenticated && (
        <div
          className="glass-card"
          style={{
            padding: '20px 24px',
            borderColor: 'rgba(245, 158, 11, 0.4)',
            background: 'var(--warning-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={24} color="var(--warning)" />
            <div>
              <div style={{ fontWeight: 700, color: '#fbbf24' }}>Sign In Required to Save Materials</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                You must sign in so your study materials and AI summaries are securely linked to your account.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
              <LogIn size={16} />
              <span>Sign In</span>
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
              <span>Register Free</span>
            </Link>
          </div>
        </div>
      )}

      {/* Upload Box Card */}
      <div className="glass-card" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '24px' }}>
          <button
            type="button"
            className={`btn ${activeTab === 'file' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('file')}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <UploadCloud size={18} />
            <span>Upload File (PDF / Images / Notes)</span>
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'text' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('text')}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <FileText size={18} />
            <span>Paste Text Notes</span>
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div
            style={{
              padding: '14px 18px',
              background: 'var(--danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-md)',
              color: '#f87171',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
            {(errorMsg.toLowerCase().includes('token') ||
              errorMsg.toLowerCase().includes('exist') ||
              errorMsg.toLowerCase().includes('session') ||
              errorMsg.toLowerCase().includes('sign in')) && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: 'rgba(239, 68, 68, 0.5)' }}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--success-bg)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 'var(--radius-md)',
              color: '#34d399',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Metadata Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="doc-title">
                Document / Chapter Title
              </label>
              <input
                id="doc-title"
                type="text"
                className="form-input"
                placeholder="e.g. Physics - Laws of Motion"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="doc-year">
                Academic Year / Source (Optional)
              </label>
              <input
                id="doc-year"
                type="text"
                className="form-input"
                placeholder="e.g. 2024 Exam Paper, Midterm 1"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              />
            </div>
          </div>

          {/* Question Paper Flag */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <input
              id="is-question-paper"
              type="checkbox"
              checked={isQuestionPaper}
              onChange={(e) => setIsQuestionPaper(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="is-question-paper" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
              <strong>This is a Previous-Year Question Paper or Question Bank</strong>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                Helps the Repeated Question Analyzer detect and count recurring exam questions.
              </div>
            </label>
          </div>

          {/* Tab 1: File Dropzone */}
          {activeTab === 'file' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-active)',
                borderRadius: 'var(--radius-lg)',
                padding: '48px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(15, 21, 35, 0.5)',
                transition: 'all 0.2s ease',
                marginBottom: '24px',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,text/plain"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <UploadCloud size={32} color="var(--primary)" />
              </div>

              {selectedFile ? (
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || 'Document'}
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <span className="badge badge-success">File Selected & Ready</span>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                    Drop your PDF or Image here, or <span className="text-gradient">browse</span>
                  </h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    Supports PDF textbooks, scanned pages, or JPG/PNG photos of handwritten notes (Max 20MB)
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Text Area */
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" htmlFor="paste-notes">
                Paste Study Notes / Lecture Transcripts
              </label>
              <textarea
                id="paste-notes"
                className="form-textarea"
                rows={10}
                placeholder="Paste your notes, definitions, formulas, or question paper text here..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            disabled={isUploading || (!selectedFile && !pastedText.trim())}
          >
            {isUploading ? (
              <>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <span>{uploadStatusMsg || 'Processing Material...'}</span>
              </>
            ) : (
              <>
                <UploadCloud size={20} />
                <span>Upload & Extract Study Data</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Uploaded Materials List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Your Study Materials ({materials.length})</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Extracted documents available for AI summaries, quizzes, and repeated question analysis.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setFilterType('all')}
              className={`btn btn-secondary ${filterType === 'all' ? 'active' : ''}`}
              style={{ padding: '6px 12px', fontSize: '0.8rem', background: filterType === 'all' ? 'var(--primary)' : undefined }}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('pdf')}
              className={`btn btn-secondary ${filterType === 'pdf' ? 'active' : ''}`}
              style={{ padding: '6px 12px', fontSize: '0.8rem', background: filterType === 'pdf' ? 'var(--primary)' : undefined }}
            >
              PDFs
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`btn btn-secondary ${filterType === 'image' ? 'active' : ''}`}
              style={{ padding: '6px 12px', fontSize: '0.8rem', background: filterType === 'image' ? 'var(--primary)' : undefined }}
            >
              Notes (OCR)
            </button>
            <button
              onClick={() => setFilterType('paper')}
              className={`btn btn-secondary ${filterType === 'paper' ? 'active' : ''}`}
              style={{ padding: '6px 12px', fontSize: '0.8rem', background: filterType === 'paper' ? 'var(--primary)' : undefined }}
            >
              Question Papers
            </button>
          </div>
        </div>

        {loadingMaterials ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading your study materials...
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
            <FileCode size={40} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>No study materials found</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '4px' }}>
              Upload your first PDF textbook chapter or photo of notes above to start your AI exam preparation.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredMaterials.map((item) => (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span
                      className={`badge ${
                        item.file_type === 'pdf'
                          ? 'badge-revision'
                          : item.file_type === 'image'
                          ? 'badge-important'
                          : 'badge-success'
                      }`}
                    >
                      {item.file_type.toUpperCase()}
                    </span>

                    {item.is_question_paper && (
                      <span className="badge badge-very-important">
                        Exam Paper
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', lineHeight: 1.3 }}>
                    {item.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {item.page_count > 1 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BookOpen size={14} /> {item.page_count} pages
                      </span>
                    )}
                    {item.academic_year && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} /> {item.academic_year}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <Link
                    to={`/summary?materialId=${item.id}`}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                  >
                    <Sparkles size={16} />
                    <span>Study with AI</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="btn btn-secondary"
                    style={{ padding: '8px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    title="Delete Material"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
