import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, CreditCard, Shield, Server,
  RefreshCw, AlertTriangle, CheckCircle, LogOut, WifiOff
} from 'lucide-react';
import {
  setAdminStats, setAdminUsers, updateAdminUser, removeAdminUser,
  setAdminResumes, setSubscriptionStats, setAdminLoading
} from '../redux/slices/adminSlice';
import { logout } from '../redux/slices/authSlice';
import StatsOverview from '../components/admin/StatsOverview';
import UsersTable from '../components/admin/UsersTable';
import FeatureToggle from '../components/admin/FeatureToggle';
import AdminSettings from '../components/admin/AdminSettings';
import { API } from '../config/api';
import API_BASE_URL from '../config/api';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'resumes', label: 'Resumes', icon: FileText },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'features', label: 'Feature Controls', icon: Shield },
  { id: 'settings', label: 'Settings & API Keys', icon: Server },
];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, users, totalUsers, userPage, userPages, resumes, totalResumes, subscriptionStats, isLoading } = useSelector((s) => s.admin);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Auto-logout + redirect when session expires
  const handleSessionExpired = () => {
    dispatch(logout());
    navigate('/login');
  };

  const fetchStats = async () => {
    dispatch(setAdminLoading(true));
    setFetchError(null);
    try {
      const res = await fetch(`${API}/admin/stats`, { credentials: 'include' });
      if (res.ok) {
        dispatch(setAdminStats(await res.json()));
      } else if (res.status === 401) {
        // Session is invalid — auto-logout and redirect to login
        handleSessionExpired();
        return;
      } else {
        const d = await res.json();
        setFetchError(d.message || 'Failed to load stats');
      }
    } catch {
      setFetchError('Cannot connect to backend. Make sure the server is running on port 5000.');
    } finally {
      dispatch(setAdminLoading(false));
    }
  };

  const fetchUsers = async (page = 1) => {
    try {
      const res = await fetch(`${API}/admin/users?page=${page}&limit=10`, { credentials: 'include' });
      if (res.ok) {
        dispatch(setAdminUsers(await res.json()));
      } else {
        dispatch(setAdminUsers({ users: [], total: 0, page: 1, pages: 1 }));
      }
    } catch {
      dispatch(setAdminUsers({ users: [], total: 0, page: 1, pages: 1 }));
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await fetch(`${API}/admin/resumes`, { credentials: 'include' });
      if (res.ok) {
        dispatch(setAdminResumes(await res.json()));
      } else {
        dispatch(setAdminResumes({ resumes: [], total: 0 }));
      }
    } catch {
      dispatch(setAdminResumes({ resumes: [], total: 0 }));
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch(`${API}/admin/subscriptions`, { credentials: 'include' });
      if (res.ok) {
        dispatch(setSubscriptionStats(await res.json()));
      } else {
        dispatch(setSubscriptionStats({ plans: [], monthlyRevenue: 0 }));
      }
    } catch {
      dispatch(setSubscriptionStats({ plans: [], monthlyRevenue: 0 }));
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchResumes();
    fetchSubscriptions();
  }, []);

  const handleUpdateUser = async (id, data) => {
    try {
      const res = await fetch(`${API}/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (res.ok) { const updated = await res.json(); dispatch(updateAdminUser(updated)); }
      else { alert('Failed to update user'); }
    } catch { alert('Error updating user. Check backend connection.'); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this user and all their data?')) return;
    try {
      const res = await fetch(`${API}/admin/users/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) dispatch(removeAdminUser(id));
      else alert('Failed to delete user');
    } catch { alert('Error deleting user'); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row pt-20">
      {/* Mobile Tab Bar (shown at top on mobile) */}
      <div className="md:hidden overflow-x-auto bg-surface border-b border-slate-200 dark:border-white/5 flex gap-1 p-2 shrink-0 hide-scrollbar">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === id
                ? 'bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-500/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Icon size={14} className="shrink-0" /> {label}
          </button>
        ))}
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex ${sidebarOpen ? 'w-60' : 'w-16'} shrink-0 bg-surface border-r border-slate-200 dark:border-white/5 transition-all duration-300 flex-col`}>
        <div className="p-4 border-b border-slate-200 dark:border-white/5">
          <div className={`flex items-center gap-2 overflow-hidden ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
              <Shield size={18} className="text-red-400" />
            </div>
            {sidebarOpen && <span className="font-bold text-slate-900 dark:text-white text-sm">Admin Panel</span>}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              } ${sidebarOpen ? '' : 'justify-center'}`}
              title={!sidebarOpen ? label : ''}
            >
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-white/5 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${sidebarOpen ? '' : 'justify-center'}`}
          >
            <LogOut size={18} className="shrink-0 rotate-180" />
            {sidebarOpen && <span>Collapse</span>}
          </button>
          
          {sidebarOpen && (
            <div className="text-center pt-2 pb-1 text-[10px] text-slate-500 uppercase tracking-widest font-semibold border-t border-slate-200 dark:border-white/5">
              Admin by <span className="text-primary-400">Ritik Jain</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wide">
                <Shield size={12} /> Admin Access
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
          <button
            onClick={() => { fetchStats(); fetchUsers(); fetchSubscriptions(); }}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:glass rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5 text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Error Banner */}
        {fetchError && (
          <div className="mb-6 p-4 rounded-xl border flex items-start gap-3 bg-red-500/10 border-red-500/20">
            <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              {fetchError === 'SESSION_EXPIRED' ? (
                <>
                  <p className="font-semibold text-red-300 text-sm">Session Expired</p>
                  <p className="text-xs text-red-400/80 mt-0.5">
                    Your login session has expired. Please <button onClick={() => dispatch(logout())} className="underline font-bold hover:text-slate-900 dark:hover:text-white transition-colors">click here to sign out</button>, then log back in.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-red-300 text-sm">Failed to load data</p>
                  <p className="text-xs text-red-400/80 mt-0.5">{fetchError}</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && <StatsOverview stats={stats} />}

        {activeTab === 'users' && (
          <UsersTable
            users={users}
            total={totalUsers}
            page={userPage}
            pages={userPages}
            onUpdate={handleUpdateUser}
            onDelete={handleDeleteUser}
            onPageChange={(p) => fetchUsers(p)}
          />
        )}

        {activeTab === 'resumes' && (
          <div className="bg-white dark:glass rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-white/5">
              <h3 className="font-bold text-slate-900 dark:text-white">All Resumes ({totalResumes})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-surface/60 border-b border-slate-200 dark:border-white/5">
                  <tr>
                    {['Title', 'User', 'Plan', 'ATS Score', 'Downloads', 'Last Updated'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {resumes.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">No resumes have been created by users yet.</td></tr>
                  ) : resumes.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-surface/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-900 dark:text-white font-medium">{r.title}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{r.userId?.name || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/10 text-primary-400">{r.userId?.plan || 'Basic'}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-emerald-400">{r.atsScore || 0}%</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{r.downloadsCount || 0}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{new Date(r.updatedAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Monthly Revenue', value: `₹${subscriptionStats?.monthlyRevenue?.toLocaleString() || '0'}`, color: 'text-emerald-400' },
                { label: 'Paying Users', value: ((subscriptionStats?.plans?.find(p => p._id === 'Premium')?.count || 0) + (subscriptionStats?.plans?.find(p => p._id === 'Pro')?.count || 0)).toString(), color: 'text-primary-400' },
                { label: 'Conversion Rate', value: `${stats ? Math.round(((stats.planDistribution?.Premium + stats.planDistribution?.Pro) / (stats.totalUsers || 1)) * 100) : 0}%`, color: 'text-purple-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white dark:glass rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{label}</p>
                  <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:glass rounded-2xl border border-slate-200 dark:border-white/5 p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Plan Revenue Breakdown</h3>
              <div className="space-y-3">
                {[
                  { plan: 'Basic', price: 0, count: stats?.planDistribution?.Basic || 0 },
                  { plan: 'Premium', price: 299, count: stats?.planDistribution?.Premium || 0 },
                  { plan: 'Pro', price: 599, count: stats?.planDistribution?.Pro || 0 },
                ].map(({ plan, price, count }) => (
                  <div key={plan} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-surface/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${plan === 'Pro' ? 'bg-purple-500' : plan === 'Premium' ? 'bg-primary-500' : 'bg-slate-500'}`}></div>
                      <span className="text-sm text-slate-900 dark:text-white font-medium">{plan} Plan</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">₹{(price * count).toLocaleString()}/mo</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{count} users × ₹{price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && <FeatureToggle />}

        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};

export default AdminDashboard;
