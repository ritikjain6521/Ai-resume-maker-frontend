import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGrammarData, applyGrammarFix } from '../../redux/slices/resumeSlice';
import { SpellCheck, Loader2, CheckCircle2, AlertCircle, X, Check } from 'lucide-react';
import SubscriptionGate from '../SubscriptionGate';

const TYPE_COLORS = {
  Grammar: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Spelling: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Punctuation: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Readability: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const GrammarChecker = ({ textToCheck = '', onClose }) => {
  const dispatch = useDispatch();
  const grammarIssues = useSelector((state) => state.resume.grammarIssues);
  const grammarCorrectedText = useSelector((state) => state.resume.grammarCorrectedText);
  const [isChecking, setIsChecking] = useState(false);
  const [checked, setChecked] = useState(false);

  const runCheck = async () => {
    if (!textToCheck.trim()) return;
    setIsChecking(true);
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://ai-resume-maker-backend-ve6d.onrender.com' : 'http://localhost:5000')}/api/ai/grammar-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToCheck }),
      });
      const data = await res.json();
      dispatch(setGrammarData(data));
      setChecked(true);
    } catch {
      dispatch(setGrammarData({
        issues: [{ type: 'Grammar', original: 'Example error', corrected: 'Example correction', explanation: 'Could not connect to AI service' }],
        correctedText: textToCheck,
        score: 75,
      }));
      setChecked(true);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="glass w-full max-w-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <SpellCheck size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Grammar & Spell Checker</h2>
              <p className="text-xs text-slate-400">AI-powered proofreading</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          <SubscriptionGate requiredPlan="Premium" featureName="Grammar & Spell Checker">
            <div className="space-y-4">
              {!checked ? (
                <>
                  <div className="bg-surface/50 rounded-xl p-4 border border-white/5">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap max-h-40 overflow-auto">
                      {textToCheck || 'No text provided. Fill in your resume content first.'}
                    </p>
                  </div>
                  <button
                    onClick={runCheck}
                    disabled={isChecking || !textToCheck}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    {isChecking ? <><Loader2 size={18} className="animate-spin" /> Checking...</> : <><SpellCheck size={18} /> Run Grammar Check</>}
                  </button>
                </>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Issues Count */}
                  <div className="flex items-center gap-3">
                    {grammarIssues.length === 0 ? (
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 size={18} />
                        <span className="font-semibold">No issues found! Your text looks great.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <AlertCircle size={18} />
                        <span className="font-semibold">{grammarIssues.length} issue{grammarIssues.length !== 1 ? 's' : ''} found</span>
                      </div>
                    )}
                  </div>

                  {/* Issues List */}
                  {grammarIssues.length > 0 && (
                    <div className="space-y-3">
                      {grammarIssues.map((issue, i) => (
                        <div key={i} className={`rounded-xl border p-3.5 flex flex-col sm:flex-row gap-3 items-start justify-between ${TYPE_COLORS[issue.type] || TYPE_COLORS.Grammar}`}>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold uppercase tracking-wide">{issue.type}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-medium text-slate-400 shrink-0 w-16">Original:</span>
                              <span className="text-xs text-white bg-red-500/10 px-1.5 py-0.5 rounded line-through">{issue.original}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-medium text-slate-400 shrink-0 w-16">Corrected:</span>
                              <span className="text-xs text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">{issue.corrected}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{issue.explanation}</p>
                          </div>
                          <button
                            onClick={() => dispatch(applyGrammarFix({ original: issue.original, corrected: issue.corrected }))}
                            className="shrink-0 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors self-end sm:self-auto"
                          >
                            <Check size={14} /> Apply Fix
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Corrected Text */}
                  {grammarCorrectedText && grammarIssues.length > 0 && (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                      <p className="text-xs font-semibold text-emerald-400 mb-2">✓ Corrected Version</p>
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{grammarCorrectedText}</p>
                    </div>
                  )}

                  <button onClick={() => setChecked(false)} className="text-xs text-slate-400 hover:text-primary-400 transition-colors">
                    ← Re-check
                  </button>
                </div>
              )}
            </div>
          </SubscriptionGate>
        </div>
      </div>
    </div>
  );
};

export default GrammarChecker;
