import { Link } from 'react-router-dom';

const Templates = () => {
  const templates = [
    { id: 1, name: 'Modern Professional', category: 'General' },
    { id: 2, name: 'Tech Executive', category: 'Technology' },
    { id: 3, name: 'Creative Designer', category: 'Creative' },
    { id: 4, name: 'Minimalist', category: 'General' },
    { id: 5, name: 'Data Scientist', category: 'Technology' },
    { id: 6, name: 'Corporate Business', category: 'Business' },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ATS-Friendly Templates</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Choose from our collection of professionally designed templates proven to pass Applicant Tracking Systems.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map(template => (
            <div key={template.id} className="glass p-4 rounded-2xl border border-white/5 group hover:border-primary-500/30 transition-all cursor-pointer">
              <div className="aspect-[1/1.4] bg-surface rounded-xl mb-4 border border-white/5 flex items-center justify-center relative overflow-hidden">
                <span className="text-slate-600 font-bold uppercase rotate-[-45deg] opacity-50 tracking-widest text-2xl group-hover:text-primary-500/30 transition-colors">Preview</span>
                <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Link to="/builder" className="bg-primary-500 text-white px-6 py-2 rounded-full font-medium shadow-lg scale-90 group-hover:scale-100 transition-all">
                    Use Template
                  </Link>
                </div>
              </div>
              <div className="flex justify-between items-center px-2">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <span className="text-xs bg-surface px-2 py-1 rounded-full text-slate-400 border border-white/5">{template.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;
