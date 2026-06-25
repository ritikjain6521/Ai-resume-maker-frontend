import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PLAN_RANK = { Basic: 0, Premium: 1, Pro: 2 };

const SubscriptionGate = ({ requiredPlan = 'Premium', children, featureName = 'this feature' }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userPlan = userInfo?.plan || 'Basic';
  const hasAccess = PLAN_RANK[userPlan] >= PLAN_RANK[requiredPlan];

  if (hasAccess) return children;

  return (
    <div className="relative">
      <div className="opacity-30 pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm rounded-xl z-10">
        <div className="flex flex-col items-center gap-3 text-center p-6">
          <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
            <Lock size={22} className="text-primary-400" />
          </div>
          <p className="text-sm font-semibold text-white">
            {requiredPlan} Plan Required
          </p>
          <p className="text-xs text-slate-400 max-w-[200px]">
            Upgrade to access {featureName}
          </p>
          <Link
            to="/pricing"
            className="mt-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-full transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionGate;
