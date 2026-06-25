import { motion } from 'framer-motion';
import { Eye, Settings, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const AtsShowcaseSection = () => {
  return (
    <section className="py-24 bg-indigo-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Beat the bots with our <span className="text-indigo-600 dark:text-indigo-400">ATS Score Showcase</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them. Our advanced ATS analyzer guarantees your resume passes the filter.
            </p>
            
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <TargetIcon size={20} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Keyword Match</h4>
                  <p className="text-slate-600 dark:text-slate-400">Instantly see which crucial keywords from the job description are missing from your resume.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Missing Skills</h4>
                  <p className="text-slate-600 dark:text-slate-400">Discover technical and soft skills that you should add to significantly boost your score.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Improvement Suggestions</h4>
                  <p className="text-slate-600 dark:text-slate-400">Get actionable, step-by-step advice on how to rewrite bullet points for maximum impact.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Visual: Dashboard Mockup */}
          <div className="bg-white dark:bg-[#151c2f] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
            {/* Window Header */}
            <div className="bg-slate-50 dark:bg-surface border-b border-slate-200 dark:border-white/5 p-4 flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex-1 text-center font-mono">Analysis Dashboard</div>
            </div>
            
            {/* Window Body */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-white/5 text-center relative overflow-hidden">
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">Resume Score</h4>
                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="251" strokeDashoffset="55" className="text-indigo-500" strokeLinecap="round" />
                    </svg>
                    <div className="absolute text-4xl font-bold text-slate-900 dark:text-white">78</div>
                  </div>
                </div>
                
                <div className="grid grid-rows-2 gap-4">
                   <div className="bg-slate-50 dark:bg-surface p-4 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-4">
                      <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="251" strokeDashoffset="37" className="text-blue-500" strokeLinecap="round" />
                        </svg>
                        <div className="absolute text-sm font-bold text-slate-900 dark:text-white">85%</div>
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white text-sm">Skills Match</h5>
                        <p className="text-xs text-slate-500">Good coverage</p>
                      </div>
                   </div>
                   <div className="bg-slate-50 dark:bg-surface p-4 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-4">
                      <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="251" strokeDashoffset="70" className="text-rose-500" strokeLinecap="round" />
                        </svg>
                        <div className="absolute text-sm font-bold text-slate-900 dark:text-white">72%</div>
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white text-sm">Experience</h5>
                        <p className="text-xs text-rose-500">Needs improvement</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Mock Bar Chart */}
              <div className="bg-slate-50 dark:bg-surface p-5 rounded-xl border border-slate-200 dark:border-white/5">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Top Required Skills</h4>
                <div className="flex items-end justify-between h-32 gap-2">
                  <div className="w-full bg-indigo-500 rounded-t-sm h-[85%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100">React</span></div>
                  <div className="w-full bg-indigo-500 rounded-t-sm h-[70%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100">NodeJS</span></div>
                  <div className="w-full bg-indigo-500 rounded-t-sm h-[90%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100">TypeScript</span></div>
                  <div className="w-full bg-indigo-500 rounded-t-sm h-[40%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100">AWS</span></div>
                  <div className="w-full bg-indigo-500 rounded-t-sm h-[55%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100">Docker</span></div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm h-[30%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100">GraphQL</span></div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm h-[20%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100">GraphQL</span></div>
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-medium">
                  <span>1st</span><span>2nd</span><span>3rd</span><span>4th</span><span>5th</span><span>6th</span><span>7th</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// Simple target icon component
function TargetIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

export default AtsShowcaseSection;
