import { Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLAN_COLORS = {
  Basic: 'from-slate-500 to-slate-700',
  Premium: 'from-primary-500 to-cyan-500',
  Pro: 'from-purple-600 to-pink-600',
};

const SubscriptionBanner = ({ plan = 'Basic', resumesUsed = 0, resumeLimit = 2 }) => {
  if (plan === 'Pro') return null;

  const nextPlan = plan === 'Basic' ? 'Premium' : 'Pro';
  const gradient = PLAN_COLORS[plan];
  const usagePercent = resumeLimit === Infinity ? 0 : (resumesUsed / resumeLimit) * 100;
  const isNearLimit = usagePercent >= 80;

  return (
    <div className={`rounded-2xl bg-gradient-to-r ${gradient} p-5 text-white shadow-lg`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-yellow-300" />
            <span className="text-xs font-bold uppercase tracking-wide text-white/80">Current Plan</span>
          </div>
          <p className="text-xl font-bold">{plan} Plan</p>
          {plan === 'Basic' && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>Resumes: {resumesUsed}/{resumeLimit}</span>
                {isNearLimit && <span className="text-yellow-300 font-medium">Almost full!</span>}
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${isNearLimit ? 'bg-yellow-300' : 'bg-white'}`}
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
            </div>
          )}
          <p className="text-sm text-white/70 mt-2">
            {plan === 'Basic' ? 'Unlock unlimited resumes, AI features, and premium templates' : 'Unlock AI Customizer, version history, and LinkedIn optimizer'}
          </p>
        </div>
        <Link
          to="/pricing"
          className="shrink-0 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors backdrop-blur-sm"
        >
          Upgrade to {nextPlan} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
