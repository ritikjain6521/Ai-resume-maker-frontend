import { MoreVertical, Download, Copy, Trash2, Edit2, Eye, FileText } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TEMPLATE_COLORS = {
  modern: 'from-blue-500 to-indigo-600',
  executive: 'from-slate-600 to-slate-800',
  creative: 'from-purple-500 to-pink-600',
  corporate: 'from-cyan-500 to-teal-600',
  minimal: 'from-gray-400 to-gray-600',
  developer: 'from-green-500 to-emerald-700',
};

const ATSRing = ({ score }) => {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const pct = (score / 100) * circ;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
      <circle
        cx="24" cy="24" r={r} fill="none"
        stroke={color} strokeWidth="4"
        strokeDasharray={`${pct} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="bold" fill={color}>{score}</text>
    </svg>
  );
};

const ResumeCard = ({ resume, onDelete, onDuplicate, onDownload }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const gradient = TEMPLATE_COLORS[resume.templateId] || TEMPLATE_COLORS.modern;
  const updatedDate = new Date(resume.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="bg-white dark:bg-surface rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      {/* Thumbnail */}
      <div className={`h-40 bg-gradient-to-br ${gradient} relative flex items-center justify-center`}>
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_11px)]"></div>
        <div className="bg-white/90 dark:bg-white/80 w-20 h-28 rounded shadow-lg p-2 relative z-10 flex flex-col gap-1.5">
          <div className="w-full h-2 bg-slate-800 rounded-sm"></div>
          <div className="w-3/4 h-1 bg-slate-400 rounded-sm"></div>
          <div className="mt-1 space-y-1">
            {[1, 2, 3, 4].map(i => <div key={i} className={`h-0.5 bg-slate-200 rounded-sm ${i === 3 ? 'w-2/3' : 'w-full'}`}></div>)}
          </div>
          <div className="mt-1 w-full h-1 bg-slate-300 rounded-sm"></div>
          <div className="mt-0.5 space-y-0.5">
            {[1, 2].map(i => <div key={i} className="h-0.5 bg-slate-200 rounded-sm w-full"></div>)}
          </div>
        </div>
        {/* ATS Badge */}
        {resume.atsScore > 0 && (
          <div className="absolute top-3 right-3 bg-white dark:bg-slate-800 rounded-full shadow-md p-0.5">
            <ATSRing score={resume.atsScore} />
          </div>
        )}
        {/* Template Badge */}
        <div className="absolute bottom-3 left-3 bg-black/30 text-white/90 text-xs font-medium px-2 py-0.5 rounded-full capitalize backdrop-blur-sm">
          {resume.templateId}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{resume.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Updated {updatedDate}</p>
          </div>
          <div className="relative ml-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 bg-white dark:bg-surface border border-slate-100 dark:border-white/10 rounded-xl shadow-xl z-20 py-1 w-44 animate-in fade-in slide-in-from-top-2 duration-200">
                {[
                  { icon: Edit2, label: 'Edit', action: () => navigate(`/builder/${resume._id}`) },
                  { icon: Eye, label: 'Preview', action: () => navigate(`/builder/${resume._id}?preview=true`) },
                  { icon: Download, label: 'Download PDF', action: () => { onDownload(resume._id, 'pdf'); setMenuOpen(false); } },
                  { icon: FileText, label: 'Download DOC', action: () => { onDownload(resume._id, 'doc'); setMenuOpen(false); } },
                  { icon: Copy, label: 'Duplicate', action: () => { onDuplicate(resume._id); setMenuOpen(false); } },
                  { icon: Trash2, label: 'Delete', action: () => { onDelete(resume._id); setMenuOpen(false); }, danger: true },
                ].map(({ icon: Ic, label, action, danger }) => (
                  <button
                    key={label}
                    onClick={action}
                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${danger ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                  >
                    <Ic size={14} /> {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Download size={12} /> {resume.downloadsCount || 0}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Eye size={12} /> {resume.views || 0}
          </div>
          {resume.jobMatchScore > 0 && (
            <div className="flex items-center gap-1 text-xs text-primary-500">
              <FileText size={12} /> {resume.jobMatchScore}% match
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
