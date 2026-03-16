import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  Trash2,
  X,
  ChevronDown,
  Loader2,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Briefcase,
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getApplications, deleteApplication, updateApplicationStatus } from '../services/api';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const statusColors = {
  Applied: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
  Interview: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
  Rejected: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  Offer: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
};

function getScoreColor(score) {
  if (score >= 75) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function getScoreColorClass(score) {
  if (score >= 75) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (deletingId) return;
    setDeletingId(id);
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
      if (selectedApp?._id === id) setSelectedApp(null);
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateApplicationStatus(id, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: updated.status } : a))
      );
      if (selectedApp?._id === id) {
        setSelectedApp((prev) => ({ ...prev, status: updated.status }));
      }
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  // Stats
  const totalApps = applications.length;
  const avgScore =
    totalApps > 0
      ? Math.round(applications.reduce((sum, a) => sum + (a.score || 0), 0) / totalApps)
      : 0;
  const highMatch = applications.filter((a) => (a.score || 0) >= 75).length;
  const thisWeek = applications.filter((a) => {
    const d = new Date(a.createdAt);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;

  const statCards = [
    { label: 'Total Applications', value: totalApps, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Average Score', value: `${avgScore}%`, icon: BarChart3, color: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]/10' },
    { label: 'High Match', value: highMatch, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'This Week', value: thisWeek, icon: Calendar, color: 'text-violet-500', bg: 'bg-violet-50' },
  ];

  return (
    <div className="relative">
      {/* Header */}
      <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Applications Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Track and manage all your job applications</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stat.value}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[var(--color-text-muted)]" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Briefcase size={28} className="text-gray-300" />
            </div>
            <p className="font-medium text-[var(--color-text-primary)] mb-1">No applications yet</p>
            <p className="text-sm text-[var(--color-text-muted)]">Analyze a resume to create your first application</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {['Position', 'Company', 'Status', 'Score', 'Date', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app, i) => {
                  const sc = statusColors[app.status] || statusColors.Applied;
                  return (
                    <motion.tr
                      key={app._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => setSelectedApp(app)}
                      className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50/80 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">
                          {app.jobTitle}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {app.company || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={app.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusChange(app._id, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className={`appearance-none text-xs font-medium px-3 py-1.5 pr-7 rounded-full border-0 cursor-pointer ${sc.bg} ${sc.text} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-accent)]`}
                          >
                            {['Applied', 'Interview', 'Rejected', 'Offer'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} className={`absolute right-2 top-1/2 -translate-y-1/2 ${sc.text} pointer-events-none`} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${getScoreColorClass(app.score)}`}>
                          {app.score != null ? `${app.score}%` : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--color-text-muted)]">
                          {new Date(app.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDelete(e, app._id)}
                          disabled={deletingId === app._id}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          {deletingId === app._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-[var(--color-border)] p-6 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{selectedApp.jobTitle}</h2>
                  <p className="text-sm text-[var(--color-text-secondary)]">{selectedApp.company || 'Unknown Company'}</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Score */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 flex-shrink-0">
                    <CircularProgressbar
                      value={selectedApp.score || 0}
                      text={`${selectedApp.score || 0}%`}
                      styles={buildStyles({
                        textSize: '22px',
                        textColor: getScoreColor(selectedApp.score),
                        pathColor: getScoreColor(selectedApp.score),
                        trailColor: '#f3f4f6',
                      })}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">Match Score</p>
                    {selectedApp.summary && (
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">{selectedApp.summary}</p>
                    )}
                  </div>
                </div>

                {/* Keywords */}
                {selectedApp.matchedKeywords?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Matched Keywords</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.matchedKeywords.map((kw) => (
                        <span key={kw} className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApp.missingKeywords?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle size={16} className="text-red-500" />
                      <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Missing Keywords</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.missingKeywords.map((kw) => (
                        <span key={kw} className="px-3 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {selectedApp.suggestions?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb size={16} className="text-[var(--color-accent)]" />
                      <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Suggestions</h4>
                    </div>
                    <ol className="space-y-2">
                      {selectedApp.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
