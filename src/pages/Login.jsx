import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { API } from '../config/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(setCredentials(data));
        // Redirect admin users directly to admin panel
        if (data.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 font-sans">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-400/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-lg px-12 flex flex-col items-center">
          {/* Animated Graphic */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full relative mb-12"
          >
            {/* Main Resume Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="w-[80%] mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <div className="h-16 bg-slate-50 dark:bg-slate-900/50 p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                <div className="space-y-2">
                  <div className="w-24 h-3 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary-500"></div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="w-1/3 h-3 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
                  <div className="w-5/6 h-2 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
                </div>
                <div className="space-y-2 pt-4">
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
                  <div className="w-4/5 h-2 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
                </div>
              </div>
            </motion.div>

            {/* Floating Tags */}
            <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }} 
              className="absolute -right-4 top-1/4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium shadow-xl flex items-center gap-2 border border-slate-100 dark:border-slate-700"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div> ATS Perfect
            </motion.div>

            <motion.div 
              animate={{ y: [0, -8, 0] }} 
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }} 
              className="absolute -left-4 bottom-1/4 bg-primary-500 text-white px-4 py-2 rounded-lg font-medium shadow-xl flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              AI Optimized
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight leading-tight text-slate-900 dark:text-white">
              Elevate Your <span className="text-primary-500">Career</span>
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 font-medium max-w-md mx-auto">
              Join thousands of professionals building ATS-optimized resumes with artificial intelligence.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400">Sign in to continue to your dashboard</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600 dark:text-slate-400 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
