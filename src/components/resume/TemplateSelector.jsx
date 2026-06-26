import { useDispatch, useSelector } from 'react-redux';
import { setTemplate } from '../../redux/slices/resumeSlice';
import { CheckCircle2, Lock, Star } from 'lucide-react';

const TEMPLATES = [
  // ── BASIC PLAN ──
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Bold blue header, ATS-friendly',
    plan: 'Basic',
    ats: 98,
    colors: { bg: 'bg-blue-700', accent: 'bg-blue-300', text: 'text-blue-700' },
    tag: 'Most Popular',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Serif font, centered, elegant',
    plan: 'Basic',
    ats: 97,
    colors: { bg: 'bg-gray-700', accent: 'bg-gray-300', text: 'text-gray-700' },
    tag: null,
  },
  {
    id: 'ats-classic',
    name: 'ATS Classic',
    desc: 'Ultra ATS-safe, pure text layout',
    plan: 'Basic',
    ats: 100,
    colors: { bg: 'bg-gray-500', accent: 'bg-gray-200', text: 'text-gray-600' },
    tag: '100% ATS',
  },
  // ── PREMIUM PLAN ──
  {
    id: 'executive',
    name: 'Executive',
    desc: 'Dark sidebar, senior-level style',
    plan: 'Premium',
    ats: 95,
    colors: { bg: 'bg-slate-800', accent: 'bg-slate-400', text: 'text-slate-700' },
    tag: null,
  },
  {
    id: 'creative',
    name: 'Creative',
    desc: 'Purple gradient, design-forward',
    plan: 'Premium',
    ats: 88,
    colors: { bg: 'bg-purple-700', accent: 'bg-pink-300', text: 'text-purple-700' },
    tag: null,
  },
  {
    id: 'corporate',
    name: 'Corporate',
    desc: 'Teal accent, professional trust',
    plan: 'Premium',
    ats: 96,
    colors: { bg: 'bg-teal-700', accent: 'bg-cyan-300', text: 'text-teal-700' },
    tag: null,
  },
  {
    id: 'developer',
    name: 'Developer',
    desc: 'Dark terminal, code aesthetic',
    plan: 'Premium',
    ats: 82,
    colors: { bg: 'bg-gray-900', accent: 'bg-green-500', text: 'text-green-700' },
    tag: 'For Engineers',
  },
  {
    id: 'nova-premium',
    name: 'Nova Premium',
    desc: 'Two-column, modern elegant',
    plan: 'Premium',
    ats: 92,
    colors: { bg: 'bg-emerald-800', accent: 'bg-emerald-400', text: 'text-emerald-700' },
    tag: 'New',
  },
  // ── PRO PLAN ──
  {
    id: 'pro-elegant',
    name: 'Pro Elegant',
    desc: 'Indigo sidebar with skill bars',
    plan: 'Pro',
    ats: 93,
    colors: { bg: 'bg-indigo-900', accent: 'bg-indigo-400', text: 'text-indigo-700' },
    tag: 'Pro Exclusive',
  },
  {
    id: 'ats-max',
    name: 'ATS Max',
    desc: 'Maximum ATS score, clean & bold',
    plan: 'Pro',
    ats: 100,
    colors: { bg: 'bg-gray-800', accent: 'bg-gray-300', text: 'text-gray-700' },
    tag: '100% ATS',
  },
  {
    id: 'nova-pro',
    name: 'Nova Pro',
    desc: 'Stunning header, professional layout',
    plan: 'Pro',
    ats: 98,
    colors: { bg: 'bg-amber-700', accent: 'bg-amber-400', text: 'text-amber-800' },
    tag: 'Premium Look',
  },
];

const PLAN_RANK = { Basic: 0, Premium: 1, Pro: 2 };
const PLAN_COLORS = {
  Basic: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Premium: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
  Pro: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const TemplateSelector = () => {
  const dispatch = useDispatch();
  const currentTemplate = useSelector((state) => state.resume.currentResume.templateId);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userPlan = userInfo?.plan || 'Basic';

  const canAccess = (requiredPlan) => PLAN_RANK[userPlan] >= PLAN_RANK[requiredPlan];

  const grouped = {
    Basic: TEMPLATES.filter((t) => t.plan === 'Basic'),
    Premium: TEMPLATES.filter((t) => t.plan === 'Premium'),
    Pro: TEMPLATES.filter((t) => t.plan === 'Pro'),
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-white text-base">Choose Template</h3>
        <p className="text-xs text-slate-400 mt-0.5">All templates are ATS-optimized. Change anytime.</p>
      </div>

      {Object.entries(grouped).map(([planName, templates]) => (
        <div key={planName}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${PLAN_COLORS[planName]}`}>
              {planName} Plan
            </span>
            {planName !== 'Basic' && PLAN_RANK[userPlan] < PLAN_RANK[planName] && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Lock size={10} /> Upgrade to unlock
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((tmpl) => {
              const accessible = canAccess(tmpl.plan);
              const isSelected = currentTemplate === tmpl.id;

              return (
                <button
                  key={tmpl.id}
                  onClick={() => accessible && dispatch(setTemplate(tmpl.id))}
                  className={`relative text-left rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary-500 shadow-lg shadow-primary-500/25 scale-[1.02]'
                      : accessible
                      ? 'border-white/5 hover:border-white/25 hover:scale-[1.01]'
                      : 'border-white/5 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {/* Mini Preview */}
                  <div className={`h-28 ${tmpl.colors.bg} relative flex items-center justify-center overflow-hidden`}>
                    {/* Decorative mini resume */}
                    <div className="w-16 h-22 bg-white/95 rounded shadow-xl p-1.5 flex flex-col gap-0.5 transform rotate-1">
                      <div className={`w-full h-3 ${tmpl.colors.bg} rounded-sm`} />
                      <div className="w-3/4 h-1 bg-gray-200 rounded-sm" />
                      <div className="mt-0.5 space-y-0.5">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-0.5 ${i % 4 === 0 ? 'w-2/3' : 'w-full'} bg-gray-100 rounded-sm`} />
                        ))}
                      </div>
                      <div className={`mt-0.5 w-full h-1 ${tmpl.colors.accent} rounded-sm opacity-70`} />
                      <div className="space-y-0.5 mt-0.5">
                        {[0, 1].map((i) => <div key={i} className="w-full h-0.5 bg-gray-100 rounded-sm" />)}
                      </div>
                    </div>

                    {/* ATS score badge */}
                    <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                      ATS {tmpl.ats}%
                    </div>

                    {/* Tag */}
                    {tmpl.tag && (
                      <div className="absolute top-2 right-2 bg-white/90 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-gray-800 flex items-center gap-0.5">
                        <Star size={7} className="text-yellow-500 fill-yellow-500" /> {tmpl.tag}
                      </div>
                    )}

                    {/* Lock overlay */}
                    {!accessible && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                        <Lock size={18} className="text-white mb-1" />
                        <span className="text-white text-[9px] font-bold uppercase">{tmpl.plan} Only</span>
                      </div>
                    )}

                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute bottom-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 bg-surface">
                    <p className="font-bold text-white text-xs">{tmpl.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{tmpl.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="glass rounded-xl border border-white/5 p-3">
        <p className="text-xs text-slate-400">
          <span className="text-white font-semibold">Currently active:</span>{' '}
          <span className="text-primary-400 font-medium">
            {TEMPLATES.find((t) => t.id === currentTemplate)?.name || 'Modern'}
          </span>
          {' '}— {TEMPLATES.find((t) => t.id === currentTemplate)?.desc}
        </p>
      </div>
    </div>
  );
};

export default TemplateSelector;
