import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProject, updateProject, deleteProject } from '../../redux/slices/resumeSlice';
import { Plus, Trash2, Wand2, Loader2 } from 'lucide-react';
import { API } from '../../config/api';

const ProjectsForm = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.resume.currentResume.projects);
  const [loadingIndex, setLoadingIndex] = useState(null);

  const handleAdd = () => {
    dispatch(addProject({
      name: '',
      description: '',
      link: '',
      technologies: ''
    }));
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    dispatch(updateProject({ index, data: { [name]: value } }));
  };

  const handleAIOptimize = async (index) => {
    const proj = projects[index];
    if (!proj.description.trim() && !proj.name.trim()) {
      alert('Please add a project name and description before using AI Optimize.');
      return;
    }
    setLoadingIndex(index);
    try {
      const prompt = `Rewrite the following project description into 3-4 impactful, achievement-oriented bullet points suitable for a resume. Start each bullet with a strong action verb. Focus on technologies used and impact delivered.

Project Name: ${proj.name || 'Unnamed Project'}
Technologies: ${proj.technologies || 'Not specified'}
Description: ${proj.description}`;

      const res = await fetch(`${API}/ai/improve-bullets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          description: prompt,
          role: proj.name || 'Project',
          company: '',
        }),
      });
      const data = await res.json();
      if (res.ok && data.suggestion) {
        dispatch(updateProject({ index, data: { description: data.suggestion } }));
      } else {
        alert(data.message || 'AI optimization failed. Please try again.');
      }
    } catch {
      alert('Could not reach AI service. Please make sure the backend is running.');
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {projects.map((proj, index) => (
        <div key={index} className="glass p-6 rounded-2xl border border-white/5 relative group">
          <button 
            onClick={() => dispatch(deleteProject(index))}
            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={20} />
          </button>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Project Name</label>
              <input 
                type="text" name="name" value={proj.name} onChange={(e) => handleChange(index, e)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="E-commerce Platform"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Project Link / URL</label>
              <input 
                type="text" name="link" value={proj.link} onChange={(e) => handleChange(index, e)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="https://github.com/user/project"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-400 mb-1">Technologies Used</label>
            <input 
              type="text" name="technologies" value={proj.technologies} onChange={(e) => handleChange(index, e)}
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <div className="relative">
              <textarea 
                rows={4} name="description" value={proj.description} onChange={(e) => handleChange(index, e)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 pr-36 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="• Built a scalable e-commerce app with 10k+ daily users..."
              />
              <button
                onClick={() => handleAIOptimize(index)}
                disabled={loadingIndex === index}
                className="absolute bottom-3 right-3 bg-primary-500/10 hover:bg-primary-500/25 disabled:opacity-60 disabled:cursor-not-allowed text-primary-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors border border-primary-500/20"
              >
                {loadingIndex === index ? (
                  <><Loader2 size={13} className="animate-spin" /> Optimizing...</>
                ) : (
                  <><Wand2 size={13} /> AI Optimize</>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              💡 Write a brief description then click <span className="text-primary-400 font-medium">AI Optimize</span> to convert it into impressive bullet points.
            </p>
          </div>
        </div>
      ))}

      <button 
        onClick={handleAdd}
        className="w-full border-2 border-dashed border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5 text-slate-300 rounded-2xl p-4 flex items-center justify-center gap-2 transition-all"
      >
        <Plus size={20} />
        Add Project
      </button>
    </div>
  );
};

export default ProjectsForm;
