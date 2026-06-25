import { FileText, Target, Shield, Wand2, Globe, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Wand2 size={24} />,
      title: "AI Resume Builder",
      description: "Don't stare at a blank page. Let artificial intelligence generate your professional summary and experience bullets in seconds.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: <Target size={24} />,
      title: "ATS Analyzer",
      description: "Get real-time feedback on your resume's compatibility with Applicant Tracking Systems. Know exactly what keywords you're missing.",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10"
    },
    {
      icon: <FileText size={24} />,
      title: "Resume Optimization",
      description: "Tailor your resume to specific job descriptions instantly. Our AI highlights the exact skills employers are looking for.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: <Shield size={24} />,
      title: "Cover Letter Generator",
      description: "Generate highly personalized, matching cover letters that perfectly complement your resume and the target job description.",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: <Globe size={24} />,
      title: "LinkedIn Optimizer",
      description: "Export your highly optimized resume data directly into a format perfect for copy-pasting into your LinkedIn profile.",
      color: "text-sky-500",
      bgColor: "bg-sky-500/10"
    },
    {
      icon: <Briefcase size={24} />,
      title: "Career Coach",
      description: "Practice for your interviews using our AI Career Coach. It generates custom interview questions based on your resume.",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-sm font-semibold mb-6">
            Platform Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Every Feature Tells <span className="text-rose-500">A Story</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            From a blank page to a hired candidate, our platform guides you through every chapter of your career journey with powerful, intuitive AI tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="bg-slate-50 dark:bg-surface p-8 rounded-3xl border border-slate-200 dark:border-white/5 transition-all shadow-sm hover:shadow-md"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bgColor} ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {feature.description}
              </p>
              <button className={`font-semibold text-sm flex items-center gap-1 ${feature.color} hover:opacity-80 transition-opacity`}>
                Learn more <span className="text-lg leading-none">›</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
