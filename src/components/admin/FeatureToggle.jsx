import { useDispatch, useSelector } from 'react-redux';
import { updateFeatureToggle } from '../../redux/slices/adminSlice';
import { Shield, Lock, Unlock } from 'lucide-react';

const FEATURES = [
  { key: 'grammarCheck', label: 'Grammar & Spell Check', desc: 'AI-powered grammar correction' },
  { key: 'atsOptimize', label: 'ATS Optimization', desc: 'Full ATS analysis with keywords' },
  { key: 'aiSuggestions', label: 'AI Suggestions Engine', desc: 'Skills, certifications & keywords' },
  { key: 'versionHistory', label: 'Version History', desc: 'Save & restore resume versions' },
  { key: 'jobMatcher', label: 'Job Description Matcher', desc: 'Match resume to job postings' },
  { key: 'pdfExport', label: 'PDF Export', desc: 'Download as PDF' },
  { key: 'docxExport', label: 'DOCX Export', desc: 'Download as Word document' },
  { key: 'allTemplates', label: 'All Templates', desc: 'Access all 6 resume templates' },
  { key: 'aiCustomizer', label: 'AI Role Customizer', desc: 'Generate role-specific resumes' },
];

const PLANS = ['Basic', 'Premium', 'Pro'];

const FeatureToggle = () => {
  const dispatch = useDispatch();
  const featureToggles = useSelector((state) => state.admin.featureToggles);

  const handleToggle = (feature, plan, value) => {
    dispatch(updateFeatureToggle({ feature, plan, value }));
  };

  return (
    <div className="bg-white dark:glass rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-500/10">
            <Shield size={20} className="text-primary-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Feature Access Control</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Control which features are available per subscription plan</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-surface/50 border-b border-slate-200 dark:border-white/5">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Feature</th>
              {PLANS.map((plan) => (
                <th key={plan} className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{plan}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {FEATURES.map((feature) => (
              <tr key={feature.key} className="hover:bg-slate-50 dark:hover:bg-surface/30 transition-colors">
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{feature.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{feature.desc}</p>
                </td>
                {PLANS.map((plan) => {
                  const enabled = featureToggles[feature.key]?.[plan] ?? false;
                  return (
                    <td key={plan} className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggle(feature.key, plan, !enabled)}
                        className={`relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-all duration-300 ${enabled ? 'bg-primary-500' : 'bg-slate-200 dark:bg-white/10'}`}
                        title={`${enabled ? 'Disable' : 'Enable'} ${feature.label} for ${plan}`}
                      >
                        <span className={`absolute w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${enabled ? 'translate-x-3' : '-translate-x-3'}`}>
                          {enabled
                            ? <Unlock size={10} className="text-primary-500" />
                            : <Lock size={10} className="text-slate-400" />
                          }
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 bg-slate-50 dark:bg-surface/30 border-t border-slate-200 dark:border-white/5">
        <p className="text-xs text-slate-500">⚠️ Changes are applied immediately and persist in browser storage. Connect to backend settings API for permanent storage.</p>
      </div>
    </div>
  );
};

export default FeatureToggle;
