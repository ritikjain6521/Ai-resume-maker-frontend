import { CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);

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

  const handlePayment = async (planName, amount) => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    setLoadingPlan(planName);
    try {
      // Ensure Razorpay is loaded
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded || !window.Razorpay) {
        alert('Razorpay SDK failed to load. Please check your internet connection and try again.');
        return;
      }

      const res = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan: planName, amount })
      });
      const orderData = await res.json();
      
      if (!res.ok) throw new Error(orderData.message || 'Failed to create payment order');

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AI Resume Maker',
        description: `Upgrade to ${planName} Plan`,
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
              // Update Redux store AND localStorage with the new plan
              const updatedUser = { ...userInfo, plan: planName };
              dispatch(setCredentials(updatedUser));
              alert(`🎉 Successfully upgraded to ${planName}! Your new features are now active.`);
              navigate('/dashboard');
            } else {
              const d = await verifyRes.json();
              alert(`Payment verification failed: ${d.message || 'Unknown error'}. Please contact support.`);
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Payment verification network error. Please contact support with your payment ID: ' + response.razorpay_payment_id);
          }
        },
        prefill: {
          name: userInfo?.name || '',
          email: userInfo?.email || '',
        },
        theme: {
          color: '#0ea5e9'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert(`Payment failed: ${response.error.description}. Please try again.`);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert(`Could not initiate payment: ${error.message}. Ensure backend is running and Razorpay keys are configured.`);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Choose the perfect plan for your career goals.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="glass p-8 rounded-2xl border border-white/5 flex flex-col">
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Basic</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">₹0</span>
            </div>
            <p className="text-slate-400 mb-6 text-sm">Perfect for entry-level candidates.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-slate-300"><CheckCircle2 size={20} className="text-primary-400 shrink-0" /> Max 2 Resumes</li>
              <li className="flex gap-3 text-slate-300"><CheckCircle2 size={20} className="text-primary-400 shrink-0" /> Basic ATS Score</li>
              <li className="flex gap-3 text-slate-300"><CheckCircle2 size={20} className="text-primary-400 shrink-0" /> Basic Templates</li>
            </ul>
            <button
              onClick={() => userInfo ? navigate('/dashboard') : navigate('/register')}
              className="w-full glass hover:bg-surface/80 text-white py-3 rounded-xl font-medium transition-colors"
            >
              {userInfo ? 'Current Plan' : 'Get Started Free'}
            </button>
          </div>
          
          {/* Premium Plan */}
          <div className="bg-surface/80 p-8 rounded-2xl border border-primary-500/50 relative flex flex-col shadow-xl shadow-primary-500/10 transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-xl font-semibold text-primary-400 mb-2">Premium</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">₹299</span>
              <span className="text-slate-400">/month</span>
            </div>
            <p className="text-slate-400 mb-6 text-sm">Everything you need to land interviews.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-white"><CheckCircle2 size={20} className="text-primary-400 shrink-0" /> Unlimited Resumes</li>
              <li className="flex gap-3 text-white"><CheckCircle2 size={20} className="text-primary-400 shrink-0" /> Full ATS Optimization</li>
              <li className="flex gap-3 text-white"><CheckCircle2 size={20} className="text-primary-400 shrink-0" /> Premium Templates</li>
              <li className="flex gap-3 text-white"><CheckCircle2 size={20} className="text-primary-400 shrink-0" /> AI Career Coach Chat</li>
            </ul>
            <button 
              onClick={() => handlePayment('Premium', 299)}
              disabled={loadingPlan === 'Premium' || userInfo?.plan === 'Premium'}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loadingPlan === 'Premium' ? <Loader2 size={20} className="animate-spin" /> : userInfo?.plan === 'Premium' ? '✓ Current Plan' : 'Upgrade to Premium'}
            </button>
          </div>
          
          {/* Pro Plan */}
          <div className="glass p-8 rounded-2xl border border-white/5 flex flex-col">
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">₹599</span>
              <span className="text-slate-400">/month</span>
            </div>
            <p className="text-slate-400 mb-6 text-sm">For complete career development.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-slate-300"><CheckCircle2 size={20} className="text-primary-400 shrink-0" /> Everything in Premium</li>
              <li className="flex gap-3 text-slate-300"><CheckCircle2 size={20} className="text-primary-400 shrink-0" /> AI Cover Letter Generator</li>
              <li className="flex gap-3 text-slate-300"><CheckCircle2 size={20} className="text-primary-400 shrink-0" /> LinkedIn Optimizer</li>
              <li className="flex gap-3 text-slate-300"><CheckCircle2 size={20} className="text-primary-400 shrink-0" /> Priority Support</li>
            </ul>
            <button 
              onClick={() => handlePayment('Pro', 599)}
              disabled={loadingPlan === 'Pro' || userInfo?.plan === 'Pro'}
              className="w-full glass hover:bg-surface/80 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loadingPlan === 'Pro' ? <Loader2 size={20} className="animate-spin" /> : userInfo?.plan === 'Pro' ? '✓ Current Plan' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>

        {!userInfo && (
          <p className="text-center text-slate-400 mt-8 text-sm">
            You need to <a href="/login" className="text-primary-400 hover:text-primary-300 underline">sign in</a> or <a href="/register" className="text-primary-400 hover:text-primary-300 underline">create an account</a> to upgrade.
          </p>
        )}
      </div>
    </div>
  );
};

export default Pricing;
