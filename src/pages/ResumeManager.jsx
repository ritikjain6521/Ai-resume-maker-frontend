import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, Grid3X3, List, Download,
  FileText, RefreshCw, AlertTriangle, Layers
} from 'lucide-react';
import { setResumes } from '../redux/slices/resumeSlice';
import ResumeCard from '../components/dashboard/ResumeCard';

const API = `\${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://ai-resume-maker-backend-ve6d.onrender.com' : 'http://localhost:5000')}/api`;

const PLAN_LIMITS = { Basic: 2, Premium: Infinity, Pro: Infinity };

const MOCK_RESUMES = [
  { _id: 'mock1', title: 'Software Engineer Resume', templateId: 'modern', atsScore: 82, downloadsCount: 3, views: 12, jobMatchScore: 78, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
  { _id: 'mock2', title: 'Full Stack Developer — Google', templateId: 'developer', atsScore: 91, downloadsCount: 1, views: 5, jobMatchScore: 90, updatedAt: new Date(Date.now() - 86400000).toISOString(), createdAt: new Date().toISOString() },
];

const ResumeManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const resumes = useSelector((state) => state.resume.resumes);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemplate, setFilterTemplate] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [viewMode, setViewMode] = useState('grid');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const plan = userInfo?.plan || 'Basic';
  const limit = PLAN_LIMITS[plan];
  const atLimit = limit !== Infinity && resumes.length >= limit;

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/resumes`, { credentials: 'include' });
      if (res.ok) dispatch(setResumes(await res.json()));
      else dispatch(setResumes([]));
    } catch {
      dispatch(setResumes([]));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    setTimeout(() => fetchResumes(), 0); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (atLimit) return;
    setIsCreating(true);
    try {
      const res = await fetch(`${API}/resumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: newTitle || 'Untitled Resume', templateId: 'modern' }),
      });
      if (res.ok) {
        const data = await res.json();
        setShowNewModal(false);
        navigate(`/builder/${data._id}`);
      } else {
        const d = await res.json();
        alert(d.message);
      }
    } catch {
      navigate('/builder/new');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume? This action cannot be undone.')) return;
    try {
      await fetch(`${API}/resumes/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchResumes();
    } catch { fetchResumes(); }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await fetch(`${API}/resumes/${id}/duplicate`, { method: 'POST', credentials: 'include' });
      if (res.ok) fetchResumes();
      else { const d = await res.json(); alert(d.message); }
    } catch { alert('Could not duplicate — backend unavailable.'); }
  };

  const handleDownload = async (id) => {
    try {
      await fetch(`${API}/resumes/${id}/download`, { method: 'POST', credentials: 'include' });
    } catch { /* ignore */ }
    navigate(`/builder/${id}?download=true`);
  };

  // Sort & filter
  const filtered = resumes
    .filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchQ = !q || r.title?.toLowerCase().includes(q);
      const matchT = !filterTemplate || r.templateId === filterTemplate;
      return matchQ && matchT;
    })
    .sort((a, b) => {
      if (sortBy === 'atsScore') return (b.atsScore || 0) - (a.atsScore || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  // Compute dashboard stats for the top strip
  const avgAts = resumes.length
    ? Math.round(resumes.reduce((a, r) => a + (r.atsScore || 0), 0) / resumes.length)
    : 0;
  const totalDownloads = resumes.reduce((a, r) => a + (r.downloadsCount || 0), 0);
  const bestMatch = Math.max(...resumes.map((r) => r.jobMatchScore || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={24} className="text-primary-500" /> My Resumes
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
              {limit !== Infinity && ` · ${resumes.length}/${limit} used (${plan} plan)`}
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            disabled={atLimit}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
          >
            <Plus size={18} />
            {atLimit ? `Limit Reached (${plan})` : 'New Resume'}
          </button>
        </div>

        {/* Plan Usage Bar */}
        {limit !== Infinity && (
          <div className="mb-6 bg-white dark:bg-surface rounded-2xl border border-slate-100 dark:border-white/5 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Plan Usage — {plan} ({resumes.length}/{limit} resumes)
              </span>
              {atLimit && (
                <span className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                  <AlertTriangle size={12} /> Limit reached — upgrade to create more
                </span>
              )}
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${atLimit ? 'bg-rose-500' : 'bg-primary-500'}`}
                style={{ width: `${Math.min((resumes.length / limit) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Resumes', value: resumes.length, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
            { label: 'Avg ATS Score', value: `${avgAts}%`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
            { label: 'Downloads', value: totalDownloads, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10' },
            { label: 'Best Job Match', value: `${bestMatch}%`, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 border border-transparent`}>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters & View Toggle */}
        <div className="bg-white dark:bg-surface rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-background border border-slate-100 dark:border-white/5 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            {/* Filter by Template */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400 shrink-0" />
              <select
                value={filterTemplate}
                onChange={(e) => setFilterTemplate(e.target.value)}
                className="bg-slate-50 dark:bg-background border border-slate-100 dark:border-white/5 rounded-xl text-sm text-slate-700 dark:text-slate-300 px-3 py-2.5 focus:outline-none focus:border-primary-500 min-w-[130px]"
              >
                <option value="">All Templates</option>
                {['modern', 'minimal', 'executive', 'creative', 'corporate', 'developer'].map((t) => (
                  <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-background border border-slate-100 dark:border-white/5 rounded-xl text-sm text-slate-700 dark:text-slate-300 px-3 py-2.5 focus:outline-none focus:border-primary-500"
            >
              <option value="updatedAt">Last Updated</option>
              <option value="atsScore">Highest ATS Score</option>
              <option value="title">Alphabetical</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-background rounded-xl p-1">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-surface text-primary-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}>
                <Grid3X3 size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-surface text-primary-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}>
                <List size={16} />
              </button>
            </div>

            <button onClick={fetchResumes} className="p-2.5 rounded-xl border border-slate-100 dark:border-white/5 text-slate-400 hover:text-primary-500 hover:border-primary-300 transition-colors">
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Resume Grid / List */}
        {isLoading ? (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' : 'space-y-3'}`}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`${viewMode === 'grid' ? 'h-64' : 'h-24'} bg-white dark:bg-surface rounded-2xl animate-pulse border border-slate-100 dark:border-white/5`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-surface flex items-center justify-center mb-4">
              <FileText size={36} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              {searchQuery || filterTemplate ? 'No resumes match your filters' : 'No resumes yet'}
            </h3>
            <p className="text-sm text-slate-400 mb-6 mt-1 max-w-sm">
              {searchQuery || filterTemplate
                ? 'Try clearing your search or filter'
                : 'Create your first professional resume with AI assistance'}
            </p>
            {!searchQuery && !filterTemplate && (
              <button
                onClick={() => setShowNewModal(true)}
                disabled={atLimit}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                <Plus size={18} /> Create First Resume
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onDownload={handleDownload}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-surface rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-surface/80 border-b border-slate-100 dark:border-white/5">
                <tr>
                  {['Resume', 'Template', 'ATS Score', 'Job Match', 'Downloads', 'Updated', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map((resume) => (
                  <tr key={resume._id} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors group">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{resume.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(resume.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full capitalize">{resume.templateId}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-bold ${resume.atsScore >= 80 ? 'text-emerald-500' : resume.atsScore >= 60 ? 'text-yellow-500' : 'text-rose-500'}`}>
                        {resume.atsScore || '—'}%
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-blue-500">{resume.jobMatchScore > 0 ? `${resume.jobMatchScore}%` : '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <Download size={13} /> {resume.downloadsCount || 0}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {new Date(resume.updatedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigate(`/builder/${resume._id}`)} className="px-2.5 py-1 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-lg hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors">Edit</button>
                        <button onClick={() => handleDownload(resume._id)} className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Download</button>
                        <button onClick={() => handleDelete(resume._id)} className="px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-medium rounded-lg hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Resume Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-surface border border-slate-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Create New Resume</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Give your resume a descriptive title</p>
            <input
              type="text"
              placeholder="e.g. Software Engineer — Google"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
              className="w-full bg-slate-50 dark:bg-background border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-colors mb-5"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowNewModal(false); setNewTitle(''); }}
                className="flex-1 py-2.5 bg-slate-100 dark:glass hover:bg-slate-200 dark:hover:bg-surface/80 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                {isCreating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : 'Create Resume'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;
