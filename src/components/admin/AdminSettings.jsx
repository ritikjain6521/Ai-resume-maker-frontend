import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Key, Plus, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import { setAdminSettings } from '../../redux/slices/adminSlice';
import { API } from '../../config/api';

const AdminSettings = () => {
  const dispatch = useDispatch();
  const { settings } = useSelector((s) => s.admin);
  const [newKey, setNewKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API}/admin/settings`, { credentials: 'include' });
      if (res.ok) {
        dispatch(setAdminSettings(await res.json()));
      }
    } catch (err) {
      console.error('Failed to fetch settings');
    }
  };

  useEffect(() => {
    if (!settings) {
      fetchSettings();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const handleAddKey = async (e) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    setIsSaving(true);
    setError('');

    try {
      const currentKeys = settings?.geminiApiKeys || [];
      const updatedKeys = [...currentKeys, { key: newKey.trim(), isExhausted: false }];
      
      const res = await fetch(`${API}/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ geminiApiKeys: updatedKeys })
      });

      if (res.ok) {
        dispatch(setAdminSettings(await res.json()));
        setNewKey('');
      } else {
        setError('Failed to add API key.');
      }
    } catch (err) {
      setError('Network error adding API key.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveKey = async (keyId) => {
    if (!confirm('Remove this API key?')) return;
    setIsSaving(true);
    try {
      const updatedKeys = settings.geminiApiKeys.filter(k => k._id !== keyId);
      const res = await fetch(`${API}/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ geminiApiKeys: updatedKeys })
      });

      if (res.ok) {
        dispatch(setAdminSettings(await res.json()));
      }
    } catch (err) {
      alert('Failed to remove key.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetStatus = async (keyId) => {
    setIsSaving(true);
    try {
      const updatedKeys = settings.geminiApiKeys.map(k => 
        k._id === keyId ? { ...k, isExhausted: false } : k
      );
      const res = await fetch(`${API}/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ geminiApiKeys: updatedKeys })
      });

      if (res.ok) {
        dispatch(setAdminSettings(await res.json()));
      }
    } catch (err) {
      alert('Failed to reset key status.');
    } finally {
      setIsSaving(false);
    }
  };

  const keys = settings?.geminiApiKeys || [];
  const exhaustedCount = keys.filter(k => k.isExhausted).length;

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl border border-white/5 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Key className="text-primary-400" /> Gemini API Keys
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Manage API keys for AI generation. If a key hits quota limits, the system will automatically rotate to the next active key.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-white bg-surface/50 px-3 py-1.5 rounded-lg border border-white/10">
              <span className={keys.length - exhaustedCount > 0 ? 'text-emerald-400' : 'text-red-400'}>
                {keys.length - exhaustedCount}
              </span> active / {keys.length} total
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleAddKey} className="flex gap-3 mb-8">
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="AIzaSy..."
            className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-primary-500 outline-none"
          />
          <button
            type="submit"
            disabled={isSaving || !newKey.trim()}
            className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
            Add Key
          </button>
        </form>

        <div className="space-y-3">
          {keys.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No API keys configured. The system will fall back to the environment variable.
            </div>
          ) : (
            keys.map((k) => (
              <div key={k._id} className={`flex items-center justify-between p-4 rounded-xl border ${k.isExhausted ? 'bg-red-500/5 border-red-500/10' : 'bg-surface/50 border-white/5'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-slate-300">
                      {k.key.substring(0, 8)}...{k.key.substring(k.key.length - 4)}
                    </span>
                    {k.isExhausted ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase">Exhausted</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase">Active</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Added: {new Date(k.addedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {k.isExhausted && (
                    <button
                      onClick={() => handleResetStatus(k._id)}
                      disabled={isSaving}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
                      title="Reset exhausted status"
                    >
                      Reset Status
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveKey(k._id)}
                    disabled={isSaving}
                    className="p-2 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
