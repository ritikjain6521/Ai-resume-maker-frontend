import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setJobMatchData } from '../../redux/slices/resumeSlice';
import { Target, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import SubscriptionGate from '../SubscriptionGate';

const JobMatcher = ({ resumeData }) => {
  const dispatch = useDispatch();
  const [jobDescription, setJobDescription] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  
  const jobMatchScore = useSelector((state) => state.resume.jobMatchScore);
  const optimizationSuggestions = useSelector((state) => state.resume.optimizationSuggestions);

  const handleMatch = async () => {
    if (!jobDescription.trim()) return;
    setIsMatching(true);
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://ai-resume-maker-backend-ve6d.onrender.com' : 'http://localhost:5000')}/api/ai/optimize-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription }),
      });
      const data = await res.json();
      dispatch(setJobMatchData(data));
      setMatchResult(data);
    } catch {
      // Mock fallback
      const mock = {
        jobMatchScore: 65,
        missingKeywords: ['React', 'TypeScript', 'Node.js'],
        keywordsToAdd: ['Agile', 'GraphQL', 'Redux'],
        suggestedSummary: 'Results-driven software engineer with experience in modern web technologies...',
        bulletPointSuggestions: ['Spearheaded migration to React, improving load times by 30%'],
        actionVerbs: ['Architected', 'Spearheaded', 'Optimized']
      };
      dispatch(setJobMatchData(mock));
      setMatchResult(mock);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="bg-white dark:bg-surface rounded-2xl border border-slate-100 dark:border-white/5 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-blue-500/10">
          <Target size={20} className="text-blue-500" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">Job Description Matcher</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tailor your resume for a specific role</p>
        </div>
      </div>

      <SubscriptionGate requiredPlan="Pro" featureName="Job Matcher">
        <div className="space-y-4">
          {!matchResult ? (
            <>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Paste Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={6}
                  className="w-full bg-slate-50 dark:bg-background border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
              <button
                onClick={handleMatch}
                disabled={isMatching || !jobDescription.trim()}
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {isMatching ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><Target size={16} /> Analyze Match</>}
              </button>
            </>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-500/5 rounded-xl border border-blue-100 dark:border-blue-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-500/30 flex items-center justify-center relative">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${matchResult.jobMatchScore * 1.25} 125`} className="text-blue-500" />
                    </svg>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{matchResult.jobMatchScore}%</span>
                  </div>
                  <div>
                    <p className="font-bold text-blue-900 dark:text-blue-100">Match Score</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {matchResult.jobMatchScore >= 80 ? 'Great match! Ready to apply.' : 'Needs improvement to pass ATS.'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setMatchResult(null)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">New Match</button>
              </div>

              {/* Missing Keywords */}
              {matchResult.missingKeywords?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Missing Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.missingKeywords.map((kw) => (
                      <span key={kw} className="px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs rounded border border-rose-100 dark:border-rose-500/10">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {matchResult.bulletPointSuggestions?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Suggested Bullet Points</p>
                  <ul className="space-y-2">
                    {matchResult.bulletPointSuggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Summary */}
              {matchResult.suggestedSummary && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Tailored Summary</p>
                  <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{matchResult.suggestedSummary}"</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SubscriptionGate>
    </div>
  );
};

export default JobMatcher;
