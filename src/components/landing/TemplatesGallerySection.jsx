import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TemplatesGallerySection = () => {
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Professional', 'Modern', 'Simple', 'Creative'];

  const templates = [
    { id: 1, name: 'Professional Classic', category: 'Professional', score: '98%' },
    { id: 2, name: 'Business Classic', category: 'Professional', score: '93%' },
    { id: 3, name: 'Simple Elegant', category: 'Simple', score: '92%' },
    { id: 4, name: 'Corporate Elite', category: 'Professional', score: '91%' },
    { id: 5, name: 'Creative Designer', category: 'Creative', score: '88%' },
    { id: 6, name: 'Modern Tech', category: 'Modern', score: '95%' },
    { id: 7, name: 'Clean Minimal', category: 'Simple', score: '94%' },
    { id: 8, name: 'Startup Bold', category: 'Creative', score: '89%' },
  ];

  const filteredTemplates = filter === 'All' 
    ? templates 
    : templates.filter(t => t.category === filter);

  return (
    <section className="py-24 bg-slate-50 dark:bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Perfect <span className="text-primary-500">Template</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Select from our professionally designed templates to create a resume that stands out.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-surface rounded-full shadow-sm border border-slate-200 dark:border-white/10 p-2 max-w-3xl mx-auto mb-12 flex flex-wrap justify-center gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={template.id} 
              className="bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 p-4 group hover:shadow-xl hover:border-primary-500/30 transition-all cursor-pointer flex flex-col"
            >
              {/* Template Mockup Visual */}
              <div className="aspect-[1/1.4] bg-slate-100 dark:bg-[#1a2235] rounded-xl mb-4 border border-slate-200 dark:border-white/5 relative overflow-hidden flex flex-col">
                <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">Popular</div>
                
                {/* Simulated Real Content */}
                <div className="flex-1 p-3 opacity-90 group-hover:opacity-100 transition-opacity flex flex-col bg-white dark:bg-slate-900 shadow-inner overflow-hidden">
                  
                  {/* Real Template Style: Creative */}
                  {template.category === 'Creative' && (
                    <div className="flex flex-col h-full">
                      <div className="bg-primary-500 text-white p-3 -mx-3 -mt-3 mb-2 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="w-12 h-12 bg-white/20 rounded-full absolute -top-4 -right-4"></div>
                        <div className="text-[10px] font-bold tracking-widest uppercase">Alex Morgan</div>
                        <div className="text-[6px] text-primary-100 uppercase mt-0.5">Product Designer</div>
                      </div>
                      <div className="flex gap-2 flex-1">
                        <div className="w-1/3 bg-slate-50 dark:bg-slate-800 p-1.5 -ml-3 -mb-3 space-y-2">
                          <div className="text-[5px] font-bold text-slate-800 dark:text-white uppercase border-b border-slate-200 dark:border-slate-700 pb-0.5">Contact</div>
                          <div className="space-y-1">
                            <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-1 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                          </div>
                          <div className="text-[5px] font-bold text-slate-800 dark:text-white uppercase border-b border-slate-200 dark:border-slate-700 pb-0.5 pt-1">Skills</div>
                          <div className="flex flex-wrap gap-0.5">
                            <div className="h-1.5 w-4 bg-primary-100 dark:bg-primary-900 rounded-sm"></div>
                            <div className="h-1.5 w-6 bg-primary-100 dark:bg-primary-900 rounded-sm"></div>
                            <div className="h-1.5 w-5 bg-primary-100 dark:bg-primary-900 rounded-sm"></div>
                          </div>
                        </div>
                        <div className="w-2/3 p-1 space-y-2">
                          <div>
                            <div className="text-[6px] font-bold text-primary-600 dark:text-primary-400">Experience</div>
                            <div className="mt-1 space-y-1">
                              <div className="flex justify-between items-end">
                                <div className="text-[5px] font-bold text-slate-700 dark:text-slate-300">Senior UI Designer</div>
                                <div className="text-[4px] text-slate-400">2021 - Present</div>
                              </div>
                              <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                              <div className="h-1 w-4/5 bg-slate-100 dark:bg-slate-800 rounded"></div>
                            </div>
                            <div className="mt-1.5 space-y-1">
                              <div className="flex justify-between items-end">
                                <div className="text-[5px] font-bold text-slate-700 dark:text-slate-300">UX Researcher</div>
                                <div className="text-[4px] text-slate-400">2018 - 2021</div>
                              </div>
                              <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Real Template Style: Professional/Simple/Modern */}
                  {template.category !== 'Creative' && (
                    <div className="flex flex-col h-full space-y-2">
                      <div className={`border-b-2 ${template.category === 'Professional' ? 'border-slate-800 dark:border-slate-400' : 'border-primary-500'} pb-1 flex justify-between items-end`}>
                        <div>
                          <div className={`text-[10px] font-bold uppercase ${template.category === 'Modern' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>Sarah Jenkins</div>
                          <div className="text-[6px] text-slate-500 mt-0.5">Software Engineer</div>
                        </div>
                        <div className="text-[4px] text-right space-y-0.5 text-slate-500">
                          <div>sarah@example.com</div>
                          <div>+1 (555) 123-4567</div>
                          <div>New York, NY</div>
                        </div>
                      </div>
                      
                      {/* Summary */}
                      <div>
                        <div className="text-[5px] font-bold uppercase text-slate-800 dark:text-slate-200 mb-0.5">Summary</div>
                        <div className="space-y-0.5">
                          <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                          <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                          <div className="h-1 w-2/3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                        </div>
                      </div>

                      {/* Experience */}
                      <div className="flex-1">
                        <div className="text-[5px] font-bold uppercase text-slate-800 dark:text-slate-200 mb-1 border-b border-slate-200 dark:border-slate-700 pb-0.5">Experience</div>
                        
                        <div className="mb-1.5">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <div className="text-[5px] font-bold text-slate-700 dark:text-slate-300">Lead Developer <span className="font-normal text-slate-500">at TechCorp</span></div>
                            <div className="text-[4px] text-slate-400">2020 - Present</div>
                          </div>
                          <div className="pl-1 space-y-0.5 border-l border-slate-200 dark:border-slate-700 ml-0.5">
                            <div className="flex gap-1 items-center"><div className="w-0.5 h-0.5 rounded-full bg-slate-400 shrink-0"></div><div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded"></div></div>
                            <div className="flex gap-1 items-center"><div className="w-0.5 h-0.5 rounded-full bg-slate-400 shrink-0"></div><div className="h-1 w-5/6 bg-slate-100 dark:bg-slate-800 rounded"></div></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-baseline mb-0.5">
                            <div className="text-[5px] font-bold text-slate-700 dark:text-slate-300">Full Stack Dev <span className="font-normal text-slate-500">at StartupInc</span></div>
                            <div className="text-[4px] text-slate-400">2017 - 2020</div>
                          </div>
                          <div className="pl-1 space-y-0.5 border-l border-slate-200 dark:border-slate-700 ml-0.5">
                            <div className="flex gap-1 items-center"><div className="w-0.5 h-0.5 rounded-full bg-slate-400 shrink-0"></div><div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded"></div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                  <Link to="/builder" className="bg-primary-500 text-white px-4 py-2 rounded-full font-medium shadow-lg text-sm scale-90 group-hover:scale-100 transition-transform">
                    Use Template
                  </Link>
                </div>
              </div>
              
              <div className="mt-auto">
                <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2">{template.name}</h3>
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2 py-1 rounded border border-primary-100 dark:border-primary-500/20 lowercase">
                    {template.category}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    {template.score}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplatesGallerySection;
