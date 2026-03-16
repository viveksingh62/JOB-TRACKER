import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  Upload,
  FileText,
  Briefcase,
  Building2,
  Loader2,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Save,
  X,
  Sparkles,
} from 'lucide-react';
import { analyzeResume } from '../services/api';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function getScoreColor(score) {
  if (score >= 75) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function getScoreLabel(score) {
  if (score >= 75) return 'Strong Match';
  if (score >= 50) return 'Moderate Match';
  return 'Needs Work';
}

export default function Analyze() {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    if (!file) return setError('Please upload your resume');
    if (!jobTitle.trim()) return setError('Please enter the job title');
    if (!jobDescription.trim()) return setError('Please paste the job description');

    setLoading(true);
    setError('');
    setResult(null);
    setSaved(false);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobTitle', jobTitle);
      formData.append('company', company);
      formData.append('jobDescription', jobDescription);

      const response = await analyzeResume(formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobTitle('');
    setCompany('');
    setJobDescription('');
    setResult(null);
    setError('');
    setSaved(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
            <Sparkles size={20} className="text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Resume Analyzer</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">AI-powered resume matching</p>
          </div>
        </div>
      </motion.div>

      {/* Upload & Form */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl border border-[var(--color-border)] p-6 md:p-8 mb-6"
      >
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 mb-6 ${
            isDragActive
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
              : file
              ? 'border-emerald-300 bg-emerald-50/50'
              : 'border-gray-200 hover:border-[var(--color-accent)]/50 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText size={24} className="text-emerald-500" />
                <span className="font-medium text-emerald-700">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="p-1 hover:bg-emerald-100 rounded-full transition-colors"
                >
                  <X size={16} className="text-emerald-500" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Upload size={24} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume PDF'}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">or click to browse • PDF only, max 10MB</p>
              </>
            )}
          </motion.div>
        </div>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-2">
              <Briefcase size={14} className="text-[var(--color-text-muted)]" />
              Job Title *
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              className="input-field"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-2">
              <Building2 size={14} className="text-[var(--color-text-muted)]" />
              Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google"
              className="input-field"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-2">
            <FileText size={14} className="text-[var(--color-text-muted)]" />
            Job Description *
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={8}
            className="input-field resize-none"
          />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2"
            >
              <XCircle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Analyze Resume
              </>
            )}
          </motion.button>
          {result && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="btn-secondary"
            >
              New Analysis
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Score Card */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="w-40 h-40 flex-shrink-0"
                >
                  <CircularProgressbar
                    value={result.score || 0}
                    text={`${result.score || 0}%`}
                    styles={buildStyles({
                      textSize: '22px',
                      textColor: getScoreColor(result.score),
                      pathColor: getScoreColor(result.score),
                      trailColor: '#f3f4f6',
                      pathTransitionDuration: 1.5,
                    })}
                  />
                </motion.div>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
                    Match Score
                  </h2>
                  <p
                    className="text-sm font-semibold mb-3"
                    style={{ color: getScoreColor(result.score) }}
                  >
                    {getScoreLabel(result.score)}
                  </p>
                  {result.summary && (
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {result.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Matched */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-[var(--color-border)] p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <h3 className="font-semibold text-[var(--color-text-primary)]">Matched Keywords</h3>
                  <span className="ml-auto text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {result.matchedKeywords?.length || 0}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords?.map((kw, i) => (
                    <motion.span
                      key={kw}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200"
                    >
                      {kw}
                    </motion.span>
                  ))}
                  {(!result.matchedKeywords || result.matchedKeywords.length === 0) && (
                    <p className="text-sm text-[var(--color-text-muted)]">No matched keywords found</p>
                  )}
                </div>
              </motion.div>

              {/* Missing */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-[var(--color-border)] p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <XCircle size={18} className="text-red-500" />
                  <h3 className="font-semibold text-[var(--color-text-primary)]">Missing Keywords</h3>
                  <span className="ml-auto text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    {result.missingKeywords?.length || 0}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw, i) => (
                    <motion.span
                      key={kw}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200"
                    >
                      {kw}
                    </motion.span>
                  ))}
                  {(!result.missingKeywords || result.missingKeywords.length === 0) && (
                    <p className="text-sm text-[var(--color-text-muted)]">No missing keywords — great job!</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Suggestions */}
            {result.suggestions && result.suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl border border-[var(--color-border)] p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={18} className="text-[var(--color-accent)]" />
                  <h3 className="font-semibold text-[var(--color-text-primary)]">Suggestions</h3>
                </div>
                <ol className="space-y-3">
                  {result.suggestions.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      className="flex gap-3 text-sm text-[var(--color-text-secondary)] leading-relaxed"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      {s}
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            )}

            {/* Saved indicator */}
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-emerald-600 text-sm font-medium"
                >
                  <CheckCircle2 size={16} />
                  Application saved to dashboard!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
