import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ label, value, icon: Icon, color, bgColor, trend, trendValue, suffix = '' }) => {
  const isPositive = trend === 'up';

  return (
    <div className={`bg-white dark:bg-surface rounded-2xl p-5 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 group`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon size={22} className={color} />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
          {value}{suffix}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
