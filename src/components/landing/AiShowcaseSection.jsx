import { Sparkles, MessageSquare, Mic, UserPlus, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const AiShowcaseSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-[#0a0f1c] overflow-hidden relative transition-colors duration-300">
      {/* Abstract background */}
      <div className="absolute top-0 left-1/4 w-1/2 h-full bg-primary-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">Powered by Next-Gen AI</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Not just a resume builder. It's your personal AI career assistant working 24/7.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Main AI Chat Interface Mockup */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl flex flex-col h-[500px]">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-white/10">
              <div className="bg-primary-50 dark:bg-primary-500/20 p-2 rounded-lg text-primary-600 dark:text-primary-400"><Sparkles size={24} /></div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">AI Assistant</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Online and ready to help</p>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col gap-4">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center shrink-0 text-white"><Sparkles size={14} /></div>
                <div className="bg-slate-50 dark:bg-[#1f2937] border border-slate-100 dark:border-transparent p-3 rounded-2xl rounded-tl-sm text-sm text-slate-700 dark:text-slate-300">
                  Hi! I'm ready to optimize your resume. What would you like to do today?
                </div>
              </div>
              <div className="flex gap-3 max-w-[80%] self-end flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center shrink-0 text-xs font-medium text-slate-700 dark:text-white">You</div>
                <div className="bg-primary-600 p-3 rounded-2xl rounded-tr-sm text-sm text-white shadow-sm">
                  Can you rewrite my software engineer experience to sound more impactful?
                </div>
              </div>
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center shrink-0 text-white"><Sparkles size={14} /></div>
                <div className="bg-slate-50 dark:bg-[#1f2937] border border-slate-100 dark:border-transparent p-4 rounded-2xl rounded-tl-sm text-sm text-slate-700 dark:text-slate-300">
                  <p className="mb-2">Absolutely. Here are 3 optimized bullet points based on your input:</p>
                  <ul className="space-y-2 pl-4 list-disc text-slate-900 dark:text-white">
                    <li>Spearheaded the migration of legacy architecture to React, reducing page load times by 40%.</li>
                    <li>Developed and deployed 15+ RESTful APIs using Node.js, serving 100k+ daily active users.</li>
                    <li>Mentored 3 junior developers and established code review guidelines.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10">
              <div className="bg-slate-50 dark:bg-[#1f2937] border border-slate-200 dark:border-transparent rounded-full p-1 pl-4 flex items-center">
                <input type="text" placeholder="Type a message..." className="bg-transparent border-none outline-none text-sm w-full text-slate-900 dark:text-white placeholder:text-slate-400" disabled />
                <button className="bg-primary-500 hover:bg-primary-600 transition-colors p-2 rounded-full text-white"><Mic size={16} /></button>
              </div>
            </div>
          </div>

          {/* AI Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 p-6 rounded-2xl flex flex-col justify-center group hover:shadow-lg hover:border-primary-500/30 transition-all">
              <div className="bg-blue-50 dark:bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform"><MessageSquare size={24} /></div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">AI Suggestions</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Context-aware text generation tailored to your specific industry and role.</p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 p-6 rounded-2xl flex flex-col justify-center group hover:shadow-lg hover:border-primary-500/30 transition-all">
              <div className="bg-emerald-50 dark:bg-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform"><FileText size={24} /></div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">AI Cover Letter</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Generates a customized cover letter that perfectly matches the tone of your resume.</p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 p-6 rounded-2xl flex flex-col justify-center group hover:shadow-lg hover:border-primary-500/30 transition-all">
              <div className="bg-purple-50 dark:bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform"><Mic size={24} /></div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Interview Gen</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Predicts the exact questions recruiters will ask based on your specific resume bullets.</p>
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-indigo-800 border border-primary-500/50 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group shadow-md">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-white"><UserPlus size={64} /></div>
              <h3 className="text-xl font-bold mb-2 relative z-10 text-white">AI Career Coach</h3>
              <p className="text-sm text-primary-100 mb-4 relative z-10">Available 24/7 on Pro plan. Upgrade to unlock full potential.</p>
              <button className="bg-white text-primary-700 hover:bg-primary-50 transition-colors px-4 py-2 rounded-lg text-sm font-bold w-max relative z-10 shadow-lg">UPGRADE NOW</button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AiShowcaseSection;
