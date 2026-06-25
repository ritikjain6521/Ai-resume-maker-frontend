import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Plus, Award, Zap, Briefcase, TrendingUp } from 'lucide-react';
import SubscriptionGate from '../SubscriptionGate';

const AISuggestionsPanel = ({ role = 'Software Engineer', skills = [] }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/suggest-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, skills }),
      });
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions({
        keywords: ['React.js', 'Node.js', 'Docker', 'Kubernetes', 'TypeScript', 'GraphQL'],
        certifications: [
          { name: 'AWS Certified Developer', issuer: 'Amazon', relevance: 'High demand for cloud expertise' },
          { name: 'Google Professional Cloud Developer', issuer: 'Google', relevance: 'Top cloud certification' },
        ],
        trendingTechnologies: ['LLMs', 'Rust', 'WebAssembly', 'Edge Computing'],
        industryTrends: ['AI-augmented development', 'Platform engineering', 'DevSecOps'],
        projectIdeas: ['Build an AI chatbot', 'Create a real-time dashboard', 'Develop a CLI tool'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-surface rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-slate-900 dark:text-white text-sm">AI Career Suggestions</p>
            <p className="text-xs text-slate-400">Skills, certifications & trends</p>
          </div>
        </div>
        {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </button>

      {isOpen && (
        <SubscriptionGate requiredPlan="Premium" featureName="AI Career Suggestions">
          <div className="px-5 pb-5 space-y-4">
            {!suggestions ? (
              <button
                onClick={fetchSuggestions}
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating suggestions...
                  </>
                ) : (
                  <><Sparkles size={16} /> Get AI Suggestions</>
                )}
              </button>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Keywords */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={14} className="text-yellow-500" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Keywords to Add</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.keywords?.map((k) => (
                      <span key={k} className="px-2.5 py-1 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full flex items-center gap-1 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors">
                        <Plus size={10} /> {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={14} className="text-emerald-500" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Recommended Certifications</p>
                  </div>
                  <div className="space-y-2">
                    {suggestions.certifications?.slice(0, 2).map((cert) => (
                      <div key={cert.name} className="flex items-start gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-500/5 rounded-lg border border-emerald-100 dark:border-emerald-500/10">
                        <Award size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-white">{cert.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{cert.issuer} · {cert.relevance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trending */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className="text-blue-500" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Trending Technologies</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.trendingTechnologies?.map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Project Ideas */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={14} className="text-orange-500" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Project Ideas</p>
                  </div>
                  <ul className="space-y-1">
                    {suggestions.projectIdeas?.slice(0, 3).map((p) => (
                      <li key={p} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></div>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSuggestions(null)}
                  className="text-xs text-slate-400 hover:text-primary-500 transition-colors"
                >
                  Refresh suggestions
                </button>
              </div>
            )}
          </div>
        </SubscriptionGate>
      )}
    </div>
  );
};

export default AISuggestionsPanel;
