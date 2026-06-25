import { TrendingUp, Users, Target, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const StatisticsSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-background border-y border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary-500 tracking-widest uppercase mb-2">Trusted By Thousands</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Proven Results That Speak For Themselves</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Success Rate */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass bg-white dark:bg-surface p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm"
          >
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Success Rate</div>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251" strokeDashoffset="65" className="text-primary-500" strokeLinecap="round" />
                </svg>
                <div className="absolute text-3xl font-bold text-slate-900 dark:text-white">74%</div>
              </div>
            </div>
            <div className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">Interview Call Rate</div>
          </motion.div>

          {/* Card 2: Total Users */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass bg-white dark:bg-surface p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Users</div>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-bold text-green-500">2M+</span>
              <TrendingUp size={32} className="text-green-500 mb-1" />
            </div>
            <div className="h-16 w-full relative overflow-hidden">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-green-500 stroke-current">
                <path d="M0,30 L20,25 L40,28 L60,15 L80,20 L100,5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4">Active Global Job Seekers</div>
          </motion.div>

          {/* Card 3: Resumes Created */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass bg-white dark:bg-surface p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Resumes Created</div>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-bold text-blue-500">5.4M</span>
            </div>
            <div className="flex items-end gap-1 h-16 w-full">
              <div className="w-1/5 bg-slate-200 dark:bg-slate-700 h-1/4 rounded-t-sm"></div>
              <div className="w-1/5 bg-slate-200 dark:bg-slate-700 h-2/4 rounded-t-sm"></div>
              <div className="w-1/5 bg-slate-200 dark:bg-slate-700 h-3/4 rounded-t-sm"></div>
              <div className="w-1/5 bg-slate-200 dark:bg-slate-700 h-4/5 rounded-t-sm"></div>
              <div className="w-1/5 bg-blue-500 h-full rounded-t-sm"></div>
            </div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4">Generated using AI</div>
          </motion.div>

          {/* Card 4: ATS Reports Generated */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass bg-white dark:bg-surface p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">ATS Reports</div>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-bold text-primary-500">12M+</span>
            </div>
            <div className="h-16 w-full relative overflow-hidden">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-primary-500 stroke-current">
                <path d="M0,25 L15,20 L30,22 L45,15 L60,18 L75,10 L100,5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4">Analyzed & Optimized</div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
