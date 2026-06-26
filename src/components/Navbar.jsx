import { Link, useLocation } from 'react-router-dom';
import { FileText, Menu, X, LogIn, Sun, Moon, LogOut, User, LayoutDashboard, Layers, Shield, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const PLAN_BADGE = {
  Basic: 'bg-slate-500/20 text-slate-300',
  Premium: 'bg-primary-500/20 text-primary-400',
  Pro: 'bg-purple-500/20 text-purple-400',
};

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const handleLogout = () => { dispatch(logout()); setUserMenuOpen(false); };

  const isActive = (path) => location.pathname === path;

  const publicNavLinks = [
    { to: '/features', label: 'Features' },
    { to: '/templates', label: 'Templates' },
    { to: '/pricing', label: 'Pricing' },
  ];

  const authNavLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/resumes', label: 'My Resumes', icon: Layers },
  ];

  return (
    <nav className="fixed w-full z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <img 
              src="/logo.svg" 
              alt="ResumeNova Logo" 
              className="w-10 h-10 drop-shadow-md group-hover:scale-105 transition-transform"
            />
            <span className="font-display font-bold text-xl text-slate-800 dark:text-white tracking-wide">
              Resume<span className="text-primary-500">Nova</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!userInfo ? (
              // Public links
              <>
                {publicNavLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive(to)
                        ? 'text-primary-500 bg-primary-500/10'
                        : 'text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </>
            ) : (
              // Auth links
              <>
                {authNavLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive(to)
                        ? 'text-primary-500 bg-primary-500/10'
                        : 'text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={15} /> {label}
                  </Link>
                ))}
                {userInfo.role === 'Admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive('/admin')
                        ? 'text-red-500 bg-red-500/10'
                        : 'text-red-400 hover:text-red-300 hover:bg-red-500/5'
                    }`}
                  >
                    <Shield size={15} /> Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-white transition-colors bg-slate-100 dark:bg-surface rounded-full"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {!userInfo ? (
              <>
                <Link to="/login" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-white transition-colors text-sm font-medium px-3 py-2 rounded-xl hover:bg-white/5">
                  <LogIn size={16} /> Log in
                </Link>
                <Link to="/register" className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary-500/25 hover:-translate-y-0.5">
                  Get Started
                </Link>
              </>
            ) : (
              /* User Menu */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {userInfo.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{userInfo.name?.split(' ')[0]}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${PLAN_BADGE[userInfo.plan] || PLAN_BADGE.Basic}`}>
                      {userInfo.plan}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 bg-white dark:bg-surface border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl z-50 w-52 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{userInfo.name}</p>
                      <p className="text-xs text-slate-400 truncate">{userInfo.email}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                        { to: '/resumes', icon: Layers, label: 'My Resumes' },
                        { to: '/pricing', icon: User, label: 'Upgrade Plan' },
                      ].map(({ to, icon: Ic, label }) => (
                        <Link
                          key={to}
                          to={to}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <Ic size={15} className="text-slate-400 dark:text-slate-500" /> {label}
                        </Link>
                      ))}
                      {userInfo.role === 'Admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors"
                        >
                          <Shield size={15} /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-slate-100 dark:border-white/5 pt-1 pb-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/5 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white bg-surface rounded-full">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:glass border-t border-slate-100 dark:border-white/10 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-4 pt-4 pb-6 space-y-1">
            {!userInfo ? (
              <>
                {publicNavLinks.map(({ to, label }) => (
                  <Link key={to} to={to} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-white font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">{label}</Link>
                ))}
                <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2 mt-2">
                  <Link to="/login" className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:text-primary-500 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Log in</Link>
                  <Link to="/register" className="block px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl text-center transition-colors">Get Started</Link>
                </div>
              </>
            ) : (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-surface/50 rounded-xl mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {userInfo.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{userInfo.name}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${PLAN_BADGE[userInfo.plan] || PLAN_BADGE.Basic}`}>{userInfo.plan} Plan</span>
                  </div>
                </div>
                {authNavLinks.map(({ to, label, icon: Ic }) => (
                  <Link key={to} to={to} className="flex items-center gap-2.5 px-4 py-3 text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-white font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <Ic size={16} /> {label}
                  </Link>
                ))}
                {userInfo.role === 'Admin' && (
                  <Link to="/admin" className="flex items-center gap-2.5 px-4 py-3 text-red-400 font-medium rounded-xl hover:bg-red-500/5 transition-colors">
                    <Shield size={16} /> Admin Panel
                  </Link>
                )}
                <div className="pt-3 border-t border-slate-100 dark:border-white/10 mt-2">
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 text-rose-500 font-medium rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/5 transition-colors">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
