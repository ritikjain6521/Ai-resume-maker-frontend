import { useDispatch, useSelector } from 'react-redux';
import { updateSkills } from '../../redux/slices/resumeSlice';
import { X, AlertCircle, CheckCircle2, TrendingUp, Search, AlertTriangle, PlusCircle } from 'lucide-react';

const STRENGTH_COLORS = {
  Weak: { bar: 'bg-rose-500', text: 'text-rose-400', bg: 'bg-rose-500/10' },
  Fair: { bar: 'bg-orange-500', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  Good: { bar: 'bg-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  Strong: { bar: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  Excellent: { bar: 'bg-primary-500', text: 'text-primary-400', bg: 'bg-primary-500/10' },
};

const ScoreRing = ({ score }) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const pct = (score / 100) * circ;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${pct} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dasharray 1.2s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-slate-400">/ 100</span>
      </div>
    </div>
  );
};

const SectionBar = ({ section, score }) => {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-yellow-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-24 capitalize shrink-0">{section}</span>
      <div className="flex-1 bg-white/5 rounded-full h-2">
        <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold w-8 text-right ${color.replace('bg-', 'text-')}`}>{score}%</span>
    </div>
  );
};

const ATSReport = ({
  score = 0,
  missingKeywords = [],
  formattingIssues = [],
  suggestions = [],
  sectionScores = {},
  strengthLevel = 'Fair',
  onClose,
}) => {
  const dispatch = useDispatch();
  const currentSkills = useSelector(state => state.resume.currentResume.skills) || [];
  
  const strength = STRENGTH_COLORS[strengthLevel] || STRENGTH_COLORS.Fair;
  const strengthPct = { Weak: 20, Fair: 40, Good: 60, Strong: 80, Excellent: 100 }[strengthLevel] || 40;

  const handleAddKeywords = () => {
    const newSkills = [...new Set([...currentSkills, ...missingKeywords])];
    dispatch(updateSkills(newSkills));
    alert('Keywords successfully added to your Skills section!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="glass w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500/10">
              <TrendingUp size={20} className="text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ATS Analysis Report</h2>
              <p className="text-xs text-slate-400">Based on industry ATS standards</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Score + Strength */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-surface/50 rounded-2xl border border-white/5">
            <ScoreRing score={score} />
            <div className="flex-1 space-y-3 w-full">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-400">Resume Strength</span>
                  <span className={`text-sm font-bold ${strength.text}`}>{strengthLevel}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3">
                  <div className={`h-3 rounded-full ${strength.bar} transition-all duration-1000`} style={{ width: `${strengthPct}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Missing Keywords', value: missingKeywords.length, color: 'text-rose-400' },
                  { label: 'Format Issues', value: formattingIssues.length, color: 'text-yellow-400' },
                  { label: 'Suggestions', value: suggestions.length, color: 'text-primary-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-surface/60 rounded-xl p-2.5">
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-slate-500 leading-tight mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section Completeness */}
          {Object.keys(sectionScores).length > 0 && (
            <div className="bg-surface/30 rounded-2xl border border-white/5 p-4">
              <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" /> Section Completeness
              </h3>
              <div className="space-y-2.5">
                {Object.entries(sectionScores).map(([section, val]) => (
                  <SectionBar key={section} section={section} score={val} />
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {missingKeywords.length > 0 && (
            <div className="bg-rose-500/5 rounded-2xl border border-rose-500/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Search size={16} className="text-rose-400" /> Missing Keywords
                </h3>
                <button
                  onClick={handleAddKeywords}
                  className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-lg shadow-rose-500/20"
                >
                  <PlusCircle size={14} /> Auto-add to Skills
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((kw) => (
                  <span key={kw} className="px-2.5 py-1 bg-rose-500/10 text-rose-400 text-xs font-medium rounded-full border border-rose-500/10">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Formatting Issues */}
          {formattingIssues.length > 0 && (
            <div className="bg-yellow-500/5 rounded-2xl border border-yellow-500/10 p-4">
              <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-yellow-400" /> Formatting Issues
              </h3>
              <ul className="space-y-1.5">
                {formattingIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="bg-primary-500/5 rounded-2xl border border-primary-500/10 p-4">
              <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-primary-400" /> Optimization Suggestions
              </h3>
              <ul className="space-y-2">
                {suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="font-bold text-primary-500 shrink-0 w-4">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-white/5 shrink-0">
          <button onClick={onClose} className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition-colors">
            Got it — I'll improve my resume!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ATSReport;
