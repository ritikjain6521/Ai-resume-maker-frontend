import { motion } from 'framer-motion';
import { FileText, Wand2, ArrowRight, Layout, Download, Settings, Check, Zap, Star, Users, LayoutTemplate, Settings2, Link as LinkIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { API } from '../config/api';

import StatisticsSection from '../components/landing/StatisticsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import AtsShowcaseSection from '../components/landing/AtsShowcaseSection';
import TemplatesGallerySection from '../components/landing/TemplatesGallerySection';
import AiShowcaseSection from '../components/landing/AiShowcaseSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CtaAndFooterSection from '../components/landing/CtaAndFooterSection';

const LandingPage = () => {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handlePayment = async (planName, amount) => {
    setLoadingPlan(planName);
    try {
      const res = await fetch(`${API}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName, amount })
      });
      const orderData = await res.json();
      
      if (!res.ok) throw new Error(orderData.message);

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AI Resume Maker',
        description: `Upgrade to ${planName} Plan`,
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await fetch(`${API}/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: planName
            })
          });
          if (verifyRes.ok) {
            alert(`Successfully upgraded to ${planName}!`);
            navigate('/dashboard');
          } else {
            alert('Payment verification failed');
          }
        },
        theme: {
          color: '#8b5cf6'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Could not initiate payment. Ensure backend is running and Razorpay keys are configured.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 right-0 -translate-y-12 translate-x-1/3 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-primary-100 dark:bg-primary-900/20 rounded-full blur-[120px] opacity-60 pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[300px] sm:w-[450px] lg:w-[600px] h-[300px] sm:h-[450px] lg:h-[600px] bg-green-100 dark:bg-green-900/20 rounded-full blur-[100px] opacity-50 pointer-events-none z-0"></div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-6 border border-primary-100 dark:border-primary-500/20">
              <Zap size={16} className="fill-current" />
              <span>#1 AI Resume Builder</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-[1.1] text-slate-900 dark:text-white">
              Land Your <span className="text-primary-500">Dream Job</span> with AI-Powered Resumes
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
              Create professional resumes in minutes using advanced AI technology. Stand out from the crowd with personalized, ATS-optimized resumes.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-8 sm:mb-10 text-slate-600 dark:text-slate-300 text-sm font-medium">
              <div className="flex items-center gap-2"><Users size={18} className="text-primary-500"/> 2M+ users</div>
              <div className="flex items-center gap-2"><Star size={18} className="text-yellow-500 fill-current"/> 4.9/5 rating</div>
              <div className="flex items-center gap-2"><LayoutTemplate size={18} className="text-primary-500"/> 30+ templates</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/builder" className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-xl shadow-primary-500/25 flex items-center justify-center gap-2 text-lg">
                <Zap size={20} className="fill-current" /> Create Resume <ArrowRight size={20} />
              </Link>
              <Link to="/templates" className="w-full sm:w-auto bg-white dark:bg-surface border-2 border-primary-500/20 hover:border-primary-500 text-primary-600 dark:text-primary-400 px-8 py-4 rounded-xl font-medium transition-all flex items-center justify-center text-lg">
                View All Templates
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Visual Composition */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center lg:justify-end mt-4 lg:mt-0 overflow-visible"
          >
            {/* The Main Resume Document */}
            <div className="w-[75%] max-w-[350px] sm:w-[85%] sm:max-w-[400px] bg-white dark:bg-slate-100 rounded-lg shadow-2xl overflow-hidden relative z-10 border border-slate-200">
              <div className="h-24 bg-slate-800 p-6 flex items-center justify-between">
                <div>
                  <div className="w-32 h-4 bg-white/20 rounded mb-2"></div>
                  <div className="w-24 h-3 bg-white/10 rounded"></div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="w-20 h-3 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="w-full h-2 bg-slate-100 rounded"></div>
                  <div className="w-full h-2 bg-slate-100 rounded"></div>
                  <div className="w-4/5 h-2 bg-slate-100 rounded"></div>
                </div>
                <div className="w-20 h-3 bg-slate-200 rounded mt-6 mb-4"></div>
                <div className="flex gap-4">
                  <div className="w-1/4 space-y-2">
                    <div className="w-full h-2 bg-slate-200 rounded"></div>
                    <div className="w-full h-2 bg-slate-200 rounded"></div>
                  </div>
                  <div className="w-3/4 space-y-2">
                    <div className="w-full h-2 bg-slate-100 rounded"></div>
                    <div className="w-full h-2 bg-slate-100 rounded"></div>
                    <div className="w-3/4 h-2 bg-slate-100 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/4 space-y-2">
                    <div className="w-full h-2 bg-slate-200 rounded"></div>
                    <div className="w-full h-2 bg-slate-200 rounded"></div>
                  </div>
                  <div className="w-3/4 space-y-2">
                    <div className="w-full h-2 bg-slate-100 rounded"></div>
                    <div className="w-full h-2 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Tags */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute top-4 sm:top-10 right-2 sm:right-0 z-20 bg-green-500 text-white px-2.5 py-1 sm:px-4 sm:py-2 rounded-full font-bold shadow-lg flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              91% Score <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
            </motion.div>
            
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1 }} className="absolute top-2 sm:top-4 left-2 sm:left-0 z-20 bg-white dark:bg-surface text-slate-700 dark:text-slate-200 px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg font-medium shadow-lg flex items-center gap-1.5 sm:gap-2 border border-slate-100 dark:border-white/10 text-xs sm:text-sm">
              <Download size={14} className="text-slate-400 sm:hidden" /><Download size={16} className="text-slate-400 hidden sm:block" /> Export to PDF
            </motion.div>
            
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-16 sm:bottom-20 right-0 sm:right-2 z-20 bg-primary-500 text-white px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg font-medium shadow-lg flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <LinkIcon size={14} className="sm:hidden" /><LinkIcon size={16} className="hidden sm:block" /> Share Link
            </motion.div>

            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }} className="absolute bottom-6 sm:bottom-10 left-2 sm:left-10 z-20 bg-white dark:bg-surface text-slate-700 dark:text-slate-200 px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg font-medium shadow-lg flex items-center gap-1.5 sm:gap-2 border border-slate-100 dark:border-white/10 text-xs sm:text-sm">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div> ATS Perfect
            </motion.div>

            {/* Floating Options Panel */}
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-1/3 -right-8 lg:-right-16 z-0 bg-white dark:bg-surface p-4 rounded-xl shadow-2xl border border-slate-100 dark:border-white/10 w-48 hidden lg:block">
              <div className="flex items-center gap-2 mb-4 bg-primary-500 text-white px-3 py-1.5 rounded-lg -mt-8 mx-auto w-max shadow-lg text-sm font-medium">
                <Settings2 size={14} /> Customize
              </div>
              <div className="space-y-4">
                <div>
                  <div className="h-2 w-12 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded overflow-hidden"><div className="h-full w-1/2 bg-primary-500"></div></div>
                </div>
                <div>
                  <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full bg-red-400"></div>
                    <div className="w-4 h-4 rounded-full bg-green-400"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                    <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                    <div className="w-4 h-4 rounded-full bg-purple-400 ring-2 ring-primary-500 ring-offset-1"></div>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      <StatisticsSection />
      <FeaturesSection />
      <AtsShowcaseSection />
      <TemplatesGallerySection />
      <AiShowcaseSection />

      {/* Pricing Section (Kept from previous version, just styled for Light/Dark mode) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Simple, Transparent Pricing</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Choose the perfect plan for your career goals.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          {/* Basic Plan */}
          <div className="glass p-8 rounded-2xl flex flex-col">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-300 mb-2">Basic</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">₹0</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">Perfect for entry-level candidates.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 size={20} className="text-primary-500 shrink-0" /> Max 2 Resumes</li>
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 size={20} className="text-primary-500 shrink-0" /> Basic ATS Score</li>
            </ul>
            <button className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-surface dark:hover:bg-surface/80 text-slate-900 dark:text-white py-3 rounded-xl font-medium transition-colors">
              Get Started Free
            </button>
          </div>
          
          {/* Premium Plan */}
          <div className="bg-white dark:bg-surface/80 p-8 rounded-2xl border-2 border-primary-500 relative flex flex-col shadow-xl shadow-primary-500/10 md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-2">Premium</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">₹299</span>
              <span className="text-slate-500 dark:text-slate-400">/month</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">Everything you need to land interviews.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-slate-800 dark:text-white"><CheckCircle2 size={20} className="text-primary-500 shrink-0" /> Unlimited Resumes</li>
              <li className="flex gap-3 text-slate-800 dark:text-white"><CheckCircle2 size={20} className="text-primary-500 shrink-0" /> Full ATS Optimization</li>
            </ul>
            <button 
              onClick={() => handlePayment('Premium', 299)}
              disabled={loadingPlan === 'Premium'}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loadingPlan === 'Premium' ? <Loader2 size={20} className="animate-spin" /> : 'Upgrade to Premium'}
            </button>
          </div>
          
          {/* Pro Plan */}
          <div className="glass p-8 rounded-2xl flex flex-col">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-300 mb-2">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">₹599</span>
              <span className="text-slate-500 dark:text-slate-400">/month</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">For complete career development.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 size={20} className="text-primary-500 shrink-0" /> Everything in Premium</li>
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 size={20} className="text-primary-500 shrink-0" /> AI Cover Letter Generator</li>
            </ul>
            <button 
              onClick={() => handlePayment('Pro', 599)}
              disabled={loadingPlan === 'Pro'}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-surface dark:hover:bg-surface/80 text-slate-900 dark:text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loadingPlan === 'Pro' ? <Loader2 size={20} className="animate-spin" /> : 'Upgrade to Pro'}
            </button>
          </div>
        </div>
      </div>

      <TestimonialsSection />
      <CtaAndFooterSection />
    </div>
  );
};

export default LandingPage;
