import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Upload, Activity, Globe, FileText, Download, Eye,
  Star, BarChart2, Clock, Briefcase, Zap, ChevronRight, Search
} from 'lucide-react';
import { setResumes } from '../redux/slices/resumeSlice';
import StatsCard from '../components/dashboard/StatsCard';
import ResumeCard from '../components/dashboard/ResumeCard';
import AISuggestionsPanel from '../components/dashboard/AISuggestionsPanel';
import SubscriptionBanner from '../components/dashboard/SubscriptionBanner';
import { API } from '../config/api';

const PLAN_LIMITS = { Basic: 2, Premium: Infinity, Pro: Infinity };

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const resumes = useSelector((state) => state.resume.resumes);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLinkedinPrompt, setShowLinkedinPrompt] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [stats, setStats] = useState({
    totalResumes: 0,
    avgAtsScore: 0,
    downloads: 0,
    views: 0,
    bestJobMatch: 0,
  });

  const plan = userInfo?.plan || 'Basic';
  const planLimit = PLAN_LIMITS[plan];
  const userName = userInfo?.name?.split(' ')[0] || 'there';

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/resumes`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        dispatch(setResumes(data));
        // Compute stats
        const avgAts = data.length ? Math.round(data.reduce((a, r) => a + (r.atsScore || 0), 0) / data.length) : 0;
        const downloads = data.reduce((a, r) => a + (r.downloadsCount || 0), 0);
        const views = data.reduce((a, r) => a + (r.views || 0), 0);
        const bestMatch = Math.max(...data.map((r) => r.jobMatchScore || 0), 0);
        setStats({ totalResumes: data.length, avgAtsScore: avgAts, downloads, views, bestJobMatch: bestMatch });
      }
    } catch {
      // Use mock data if backend not connected
      dispatch(setResumes([]));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await fetch(`${API}/resumes/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchResumes();
    } catch { alert('Error deleting resume'); }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await fetch(`${API}/resumes/${id}/duplicate`, { method: 'POST', credentials: 'include' });
      if (res.ok) fetchResumes();
      else { const d = await res.json(); alert(d.message); }
    } catch { alert('Error duplicating resume'); }
  };

  const handleDownload = async (id) => {
    try {
      await fetch(`${API}/resumes/${id}/download`, { method: 'POST', credentials: 'include' });
      navigate(`/builder/${id}?download=true`);
    } catch { navigate(`/builder/${id}?download=true`); }
  };

  const handleUploadResume = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setIsLoading(true);
        try {
          const formData = new FormData();
          formData.append('resumeFile', file);
          const res = await fetch(`${API}/resumes/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
          });
          const data = await res.json();
          if (res.ok) {
            navigate('/builder/new', { state: { importedData: data } });
          } else {
            alert(data.message || 'Error uploading file');
          }
        } catch (error) {
          alert('Error uploading file. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    fileInput.click();
  };

  const handleLinkedInImport = async () => {
    const url = prompt("Please enter your LinkedIn Profile URL:\n(e.g., https://linkedin.com/in/username)");
    if (url && url.includes('linkedin.com/in/')) {
      setIsLoading(true);
      try {
        const res = await fetch(`${API}/resumes/import-linkedin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          navigate('/builder/new', { state: { importedData: data } });
        } else {
          alert(data.message || 'Error importing LinkedIn profile');
        }
      } catch (error) {
        alert('Error importing profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (url) {
      alert("Please enter a valid LinkedIn URL.");
    }
  };

  const filteredResumes = resumes.filter((r) =>
    r.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statsData = [
    { label: 'Total Resumes', value: stats.totalResumes, icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10', trend: 'up', trendValue: '+2 this month' },
    { label: 'Avg ATS Score', value: stats.avgAtsScore, icon: BarChart2, color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10', suffix: '%', trendValue: stats.avgAtsScore > 60 ? '+Good' : 'Needs work' },
    { label: 'Total Downloads', value: stats.downloads, icon: Download, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-500/10', trend: 'up' },
    { label: 'Resume Views', value: stats.views, icon: Eye, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-500/10', trend: 'up' },
    { label: 'Best Job Match', value: stats.bestJobMatch, icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-500/10', suffix: '%' },
    { label: 'Active Plan', value: plan, icon: Zap, color: 'text-primary-500', bgColor: 'bg-primary-50 dark:bg-primary-500/10' },
  ];

  const quickActions = [
    {
      icon: Plus, label: 'Create New Resume', desc: 'Start fresh with AI assistance',
      color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      action: () => navigate('/builder/new'),
      disabled: planLimit !== Infinity && stats.totalResumes >= planLimit,
    },
    { icon: Upload, label: 'Upload Resume', desc: 'Enhance your existing resume', color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400', action: handleUploadResume },
    { icon: Globe, label: 'Import LinkedIn', desc: 'Auto-import from LinkedIn', color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400', action: handleLinkedInImport },
    { icon: Activity, label: 'ATS Analyzer', desc: 'Check your resume score', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', action: () => navigate('/resumes') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pt-20 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Link
            to="/builder/new"
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-0.5"
          >
            <Plus size={18} /> New Resume
          </Link>
        </div>

        {/* Subscription Banner */}
        <div className="mb-8">
          <SubscriptionBanner plan={plan} resumesUsed={stats.totalResumes} resumeLimit={planLimit === Infinity ? Infinity : planLimit} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statsData.map((s) => (
            <StatsCard key={s.label} {...s} />
          ))}
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left - Resumes */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick Actions */}
            <div className="bg-white dark:bg-surface rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-5">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4 text-base">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map(({ icon: Icon, label, desc, color, action, disabled }) => (
                  <button
                    key={label}
                    onClick={action}
                    disabled={disabled}
                    className="flex flex-col items-start p-4 rounded-xl border border-slate-100 dark:border-white/5 hover:border-primary-300 dark:hover:border-primary-500/40 hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-2.5`}>
                      <Icon size={18} />
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-primary-500 transition-colors leading-tight">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-tight">{desc}</p>
                    {disabled && <p className="text-xs text-rose-400 mt-1 font-medium">Limit reached</p>}
                  </button>
                ))}
              </div>
            </div>

            {/* Resume List */}
            <div className="bg-white dark:bg-surface rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900 dark:text-white text-base">My Resumes</h2>
                <Link to="/resumes" className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 font-medium">
                  View All <ChevronRight size={16} />
                </Link>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search resumes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-background border border-slate-100 dark:border-white/5 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-56 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : filteredResumes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
                    <FileText size={28} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No resumes yet</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">Create your first resume with AI assistance</p>
                  <Link
                    to="/builder/new"
                    className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Plus size={16} /> Create Resume
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredResumes.slice(0, 4).map((resume) => (
                    <ResumeCard
                      key={resume._id}
                      resume={resume}
                      onDelete={handleDelete}
                      onDuplicate={handleDuplicate}
                      onDownload={handleDownload}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-surface rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-5">
              <h2 className="font-bold text-slate-900 dark:text-white text-base mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {resumes.slice(0, 3).map((r) => (
                  <div key={r._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/3 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
                      <Clock size={16} className="text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{r.title}</p>
                      <p className="text-xs text-slate-400">Updated {new Date(r.updatedAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {r.atsScore > 0 && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.atsScore >= 80 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : r.atsScore >= 60 ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                          ATS {r.atsScore}%
                        </span>
                      )}
                      <Link
                        to={`/builder/${r._id}`}
                        className="flex items-center gap-1 text-xs text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                      >
                        Edit <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
                {resumes.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No activity yet. Create your first resume!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Plan Card */}
            <div className="bg-white dark:bg-surface rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-5">
              <h2 className="font-bold text-slate-900 dark:text-white text-base mb-4">Your Plan</h2>
              <div className="space-y-3">
                {[
                  { label: 'Resumes', used: stats.totalResumes, limit: planLimit, icon: FileText },
                  { label: 'AI Generations', used: 5, limit: plan === 'Basic' ? 10 : Infinity, icon: Zap },
                  { label: 'Downloads', used: stats.downloads, limit: plan === 'Basic' ? 5 : Infinity, icon: Download },
                ].map(({ label, used, limit, icon: Ic }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                      <div className="flex items-center gap-1.5">
                        <Ic size={12} />
                        <span>{label}</span>
                      </div>
                      <span className="font-medium">{used}/{limit === Infinity ? '∞' : limit}</span>
                    </div>
                    {limit !== Infinity && (
                      <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-primary-500 transition-all"
                          style={{ width: `${Math.min((used / limit) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${plan === 'Pro' ? 'bg-purple-500' : plan === 'Premium' ? 'bg-primary-500' : 'bg-slate-400'} animate-pulse`}></div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white">{plan} Plan Active</span>
                </div>
                {plan !== 'Pro' && (
                  <Link to="/pricing" className="w-full block text-center bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                    Upgrade Plan
                  </Link>
                )}
              </div>
            </div>

            {/* AI Suggestions Panel */}
            <AISuggestionsPanel role={userInfo?.targetRole || 'Software Engineer'} skills={[]} />

            {/* Tips */}
            <div className="bg-white dark:bg-surface rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-5">
              <h2 className="font-bold text-slate-900 dark:text-white text-base mb-3">💡 Quick Tips</h2>
              <ul className="space-y-2">
                {[
                  'Keep your resume under 2 pages for best ATS results.',
                  'Use action verbs like Led, Built, Delivered, Increased.',
                  'Quantify achievements: "Increased sales by 30%".',
                  'Tailor your resume for each job description.',
                  'Include relevant keywords from the job posting.',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1 shrink-0"></div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
