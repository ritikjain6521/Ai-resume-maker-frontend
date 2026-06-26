import { Users, FileText, Download, TrendingUp, BarChart2, Activity, Crown, Zap } from 'lucide-react';

const StatTile = ({ label, value, icon: Icon, color, bgColor, sub }) => (
  <div className="bg-white dark:glass p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all group">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2.5 rounded-xl ${bgColor}`}>
        <Icon size={20} className={color} />
      </div>
    </div>
    <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">{value}</p>
    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{label}</p>
    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
  </div>
);

const PlanBar = ({ plan, count, total, color }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-16 text-xs font-medium text-slate-600 dark:text-slate-300 shrink-0">{plan}</div>
      <div className="flex-1 bg-slate-100 dark:bg-white/5 rounded-full h-2">
        <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <div className="w-14 text-right text-xs text-slate-500 dark:text-slate-400 shrink-0">{count} ({Math.round(pct)}%)</div>
    </div>
  );
};

const StatsOverview = ({ stats }) => {
  if (!stats) return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white dark:glass rounded-2xl animate-pulse" />)}
    </div>
  );

  const tiles = [
    { label: 'Total Users', value: stats.totalUsers?.toLocaleString(), icon: Users, color: 'text-blue-400', bgColor: 'bg-blue-500/10', sub: `+${stats.newUsersThisMonth} this month` },
    { label: 'Total Resumes', value: stats.totalResumes?.toLocaleString(), icon: FileText, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { label: 'Total Downloads', value: stats.totalDownloads?.toLocaleString(), icon: Download, color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { label: 'Est. Monthly Revenue', value: `₹${stats.estimatedRevenue?.toLocaleString()}`, icon: TrendingUp, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    { label: 'Avg ATS Score', value: `${stats.avgAtsScore}%`, icon: BarChart2, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
    { label: 'Active Users', value: stats.activeUsers?.toLocaleString(), icon: Activity, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    { label: 'Premium Users', value: stats.planDistribution?.Premium || 0, icon: Zap, color: 'text-primary-400', bgColor: 'bg-primary-500/10' },
    { label: 'Pro Users', value: stats.planDistribution?.Pro || 0, icon: Crown, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
  ];

  const total = stats.totalUsers || 1;
  const dist = stats.planDistribution || { Basic: 0, Premium: 0, Pro: 0 };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tiles.map((t) => <StatTile key={t.label} {...t} />)}
      </div>

      {/* Plan Distribution */}
      <div className="bg-white dark:glass rounded-2xl border border-slate-200 dark:border-white/5 p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart2 size={18} className="text-primary-400" /> Plan Distribution
        </h3>
        <div className="space-y-3">
          <PlanBar plan="Basic" count={dist.Basic} total={total} color="bg-slate-500" />
          <PlanBar plan="Premium" count={dist.Premium} total={total} color="bg-primary-500" />
          <PlanBar plan="Pro" count={dist.Pro} total={total} color="bg-purple-500" />
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
