import { ArrowRight, FileText, MessageCircle, Globe, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CtaAndFooterSection = () => {
  return (
    <>
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-white dark:bg-background transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 dark:from-[#0a0f1c] dark:to-indigo-950/50 rounded-2xl sm:rounded-[3rem] p-8 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary-500/10 border border-slate-800 dark:border-white/10">
            {/* Glowing Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
                Stop applying. <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400">Start getting hired.</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join over 2 million professionals who have accelerated their careers using our AI-powered resume builder.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register" className="bg-white text-slate-900 hover:bg-slate-50 px-8 py-4 rounded-full font-bold transition-transform hover:-translate-y-1 shadow-xl flex items-center justify-center gap-2 text-lg">
                  Build My Resume Free <ArrowRight size={20} className="text-primary-500" />
                </Link>
                <Link to="/templates" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-full font-bold transition-colors flex items-center justify-center text-lg">
                  View Templates
                </Link>
              </div>
              <p className="mt-8 text-sm text-slate-400 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> No credit card required. Free basic plan forever.
              </p>
              <p className="mt-4 text-[11px] text-slate-600 tracking-widest uppercase font-semibold">
                Crafted by <span className="text-primary-400/70">Ritik Jain</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-12">
            
            <div className="col-span-2 sm:col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4 group">
                <img 
                  src="/logo.svg" 
                  alt="ResumeNova Logo" 
                  className="w-9 h-9 drop-shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="font-display font-bold text-xl text-white tracking-wide">
                  Resume<span className="text-primary-400">Nova</span>
                </span>
              </Link>
              <p className="text-sm text-slate-400 mb-6">
                The world's most advanced AI-powered resume builder. Helping professionals land their dream jobs.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><MessageCircle size={20} /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Globe size={20} /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Share2 size={20} /></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/builder" className="hover:text-white transition-colors">AI Resume Builder</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">ATS Optimization</Link></li>
                <li><Link to="/templates" className="hover:text-white transition-colors">Professional Templates</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Cover Letter Generator</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Career Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resume Examples</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Interview Questions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} ResumeNova. All rights reserved.</p>
            <p className="flex items-center gap-1.5 font-medium">
              Engineered with <span className="text-primary-500">precision</span> by <span className="text-white tracking-wide">Ritik Jain</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CtaAndFooterSection;
