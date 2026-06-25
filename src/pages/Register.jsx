import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { User, Mail, Lock, ArrowRight, Loader2, CreditCard } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('Basic');
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null); // holds user after registration, before payment

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load Razorpay script as a Promise so we can await it
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    // Pre-load Razorpay script in background
    loadRazorpay();
  }, []);

  const initiatePayment = async (planName, amount, userData) => {
    setPaymentLoading(true);
    setError(null);
    try {
      // Ensure Razorpay is loaded before attempting payment
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded || !window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection and refresh the page.');
      }

      const res = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan: planName, amount })
      });
      const orderData = await res.json();
      
      if (!res.ok) throw new Error(orderData.message || 'Failed to create payment order. Please try again.');

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AI Resume Maker',
        description: `Subscribe to ${planName} Plan`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('http://localhost:5000/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planName
              })
            });
            
            if (verifyRes.ok) {
              // Update local state and Redux with the correct plan
              const updatedUser = { ...userData, plan: planName };
              dispatch(setCredentials(updatedUser));
              navigate('/dashboard');
            } else {
              const d = await verifyRes.json();
              setError(`Payment verified but plan update failed: ${d.message || 'Unknown error'}. Please contact support.`);
              dispatch(setCredentials(userData));
              navigate('/dashboard');
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            setError('Payment was received but verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
            dispatch(setCredentials(userData));
            navigate('/dashboard');
          }
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
            setError('Payment was cancelled. Your account has been created with a Basic plan. You can upgrade anytime from the Pricing page.');
            setRegisteredUser(userData);
            dispatch(setCredentials(userData));
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
        },
        theme: { color: '#0ea5e9' }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setPaymentLoading(false);
        setError(`Payment failed: ${response.error.description}. Please try again or upgrade later from the Pricing page.`);
        setRegisteredUser(userData);
        dispatch(setCredentials(userData));
      });
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      setError(`Payment error: ${err.message}. Your account was created with a Basic plan. You can upgrade anytime from the Pricing page.`);
      setRegisteredUser(userData);
      dispatch(setCredentials(userData));
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Pre-load Razorpay before registering if needed
      if (plan !== 'Basic') {
        await loadRazorpay();
      }

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // If plan is not Basic, initiate payment BEFORE dispatching credentials
        // so we can update them with the correct plan after payment
        if (plan === 'Premium') {
          setLoading(false);
          await initiatePayment('Premium', 299, data);
        } else if (plan === 'Pro') {
          setLoading(false);
          await initiatePayment('Pro', 599, data);
        } else {
          // Basic plan — log in and navigate to dashboard
          dispatch(setCredentials(data));
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Cannot connect to server. Please ensure the backend is running.');
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
              Supercharge Your <span className="text-primary-500">Resume</span>
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 font-medium max-w-md mx-auto">
              Unlock AI-powered writing, ATS scoring, and premium templates to land your dream job faster.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto max-h-screen custom-scrollbar">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 my-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create an Account</h1>
            <p className="text-slate-500 dark:text-slate-400">Join AI Resume Maker today</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium">
              <p className="mb-3">{error}</p>
              {registeredUser && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 text-xs bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => initiatePayment(plan, plan === 'Premium' ? 299 : 599, registeredUser)}
                    className="flex-1 text-xs bg-primary-500 text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Retry Payment
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <User size={20} />
                </div>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
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

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Subscription Plan</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <CreditCard size={20} />
                </div>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none font-medium"
                >
                  <option value="Basic">Basic Plan (Free)</option>
                  <option value="Premium">Premium Plan (₹299/mo)</option>
                  <option value="Pro">Pro Plan (₹599/mo)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
              {plan !== 'Basic' && (
                <p className="text-xs text-primary-500 mt-2 font-medium">✓ Razorpay payment window will open after account creation.</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading || paymentLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {(loading || paymentLoading) ? <Loader2 size={20} className="animate-spin" /> : (plan === 'Basic' ? 'Create Account' : `Create Account & Pay for ${plan}`)}
              {!loading && !paymentLoading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600 dark:text-slate-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
