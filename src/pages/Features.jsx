import { Zap, LayoutTemplate, Settings2, Download, Link as LinkIcon, Star, Users, FileSearch, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features for Your Career</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Everything you need to build the perfect resume, optimize it for ATS, and land your dream job.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="glass p-8 rounded-2xl border border-white/5 hover:border-primary-500/30 transition-colors">
            <div className="bg-primary-500/20 w-14 h-14 rounded-xl flex items-center justify-center text-primary-400 mb-6">
              <FileSearch size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3">ATS Score Analyzer</h3>
            <p className="text-slate-400">Get instant feedback on your resume's ATS compatibility and actionable suggestions to improve your score.</p>
          </div>
          <div className="glass p-8 rounded-2xl border border-white/5 hover:border-primary-500/30 transition-colors">
            <div className="bg-primary-500/20 w-14 h-14 rounded-xl flex items-center justify-center text-primary-400 mb-6">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Suggestions</h3>
            <p className="text-slate-400">Generate powerful summaries, tailored bullet points, and optimized keywords based on specific job descriptions.</p>
          </div>
          <div className="glass p-8 rounded-2xl border border-white/5 hover:border-primary-500/30 transition-colors">
            <div className="bg-primary-500/20 w-14 h-14 rounded-xl flex items-center justify-center text-primary-400 mb-6">
              <Shield size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Recruiter Approved</h3>
            <p className="text-slate-400">Our templates are designed by industry professionals to ensure readability and maximum impact.</p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/builder" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg shadow-primary-500/25 inline-flex items-center gap-2 text-lg">
            Try Features Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;
