import { useState } from 'react';
import { Search, Filter, Edit2, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight, Shield, User } from 'lucide-react';

const PLAN_COLORS = {
  Basic: 'bg-slate-500/20 text-slate-300',
  Premium: 'bg-primary-500/20 text-primary-400',
  Pro: 'bg-purple-500/20 text-purple-400',
};

const UsersTable = ({ users, total, page, pages, onUpdate, onDelete, onPageChange }) => {
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditSave = () => {
    onUpdate(editingUser._id, editForm);
    setEditingUser(null);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface border border-white/5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="bg-surface border border-white/5 rounded-xl text-sm text-slate-300 px-3 py-2.5 focus:outline-none focus:border-primary-500"
          >
            <option value="">All Plans</option>
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="Pro">Pro</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface/60 border-b border-white/5">
              <tr>
                {['User', 'Email', 'Plan', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users
                .filter((u) => {
                  const q = search.toLowerCase();
                  const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
                  const matchPlan = !filterPlan || u.plan === filterPlan;
                  return matchSearch && matchPlan;
                })
                .map((user) => (
                  <tr key={user._id} className="hover:bg-surface/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-400">{user.email}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${PLAN_COLORS[user.plan] || PLAN_COLORS.Basic}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {user.role === 'Admin' ? <Shield size={14} className="text-red-400" /> : <User size={14} className="text-slate-500" />}
                        <span className={`text-xs ${user.role === 'Admin' ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>{user.role}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${user.isActive !== false ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}></div>
                        <span className={`text-xs ${user.isActive !== false ? 'text-green-400' : 'text-slate-500'}`}>
                          {user.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingUser(user); setEditForm({ plan: user.plan, role: user.role, isActive: user.isActive !== false }); }}
                          className="p-1.5 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
                          title="Edit user"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onUpdate(user._id, { isActive: user.isActive === false })}
                          className={`p-1.5 rounded-lg transition-colors ${user.isActive !== false ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}
                          title={user.isActive !== false ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive !== false ? <XCircle size={14} /> : <CheckCircle size={14} />}
                        </button>
                        <button
                          onClick={() => onDelete(user._id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-surface/30">
          <p className="text-xs text-slate-500">Showing {users.length} of {total} users</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-surface text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-slate-400 px-2">{page} / {pages}</span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pages}
              className="p-1.5 rounded-lg bg-surface text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Edit User: {editingUser.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Plan</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  className="w-full bg-surface border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="Pro">Pro</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full bg-surface border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} className="w-4 h-4 rounded accent-primary-500" />
                <label htmlFor="isActive" className="text-sm text-slate-300">Account Active</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingUser(null)} className="flex-1 py-2.5 glass rounded-xl text-slate-300 text-sm font-medium hover:bg-surface/80 transition-colors">Cancel</button>
              <button onClick={handleEditSave} className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-bold transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
