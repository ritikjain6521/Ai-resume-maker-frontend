import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExperience, updateExperience, deleteExperience } from '../../redux/slices/resumeSlice';
import { Plus, Trash2, Wand2, Loader2 } from 'lucide-react';

const API = 'http://localhost:5000/api';

const ExperienceForm = () => {
  const dispatch = useDispatch();
  const experiences = useSelector((state) => state.resume.currentResume.experience);
  const [loadingIndex, setLoadingIndex] = useState(null);

  const handleAIBullets = async (index) => {
    const exp = experiences[index];
    if (!exp.description.trim() && !exp.title.trim()) {
      alert('Please add a job title and description before using AI Bullets.');
      return;
    }
    setLoadingIndex(index);
    try {
      const res = await fetch(`${API}/ai/improve-bullets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          description: exp.description,
          role: exp.title || 'Professional',
          company: exp.company || 'Company',
        }),
      });
      const data = await res.json();
      if (res.ok && data.suggestion) {
        dispatch(updateExperience({ index, data: { description: data.suggestion } }));
      } else {
        alert(data.message || 'AI generation failed. Please try again.');
      }
    } catch {
      alert('Could not reach AI service. Please make sure the backend is running.');
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleAdd = () => {
    dispatch(addExperience({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }));
  };

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    dispatch(updateExperience({
      index,
      data: { [name]: type === 'checkbox' ? checked : value }
    }));
  };

  const handleDelete = (index) => {
    dispatch(deleteExperience(index));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {experiences.map((exp, index) => (
        <div key={index} className="glass p-6 rounded-2xl border border-white/5 relative group">
          <button 
            onClick={() => handleDelete(index)}
            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={20} />
          </button>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Job Title</label>
              <input 
                type="text" 
                name="title"
                value={exp.title}
                onChange={(e) => handleChange(index, e)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Company</label>
              <input 
                type="text" 
                name="company"
                value={exp.company}
                onChange={(e) => handleChange(index, e)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="Tech Corp Inc."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Start Date</label>
              <input 
                type="month" 
                name="startDate"
                value={exp.startDate}
                onChange={(e) => handleChange(index, e)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">End Date</label>
              <input 
                type="month" 
                name="endDate"
                value={exp.endDate}
                onChange={(e) => handleChange(index, e)}
                disabled={exp.current}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <div className="flex items-center mt-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                <input 
                  type="checkbox" 
                  name="current"
                  checked={exp.current}
                  onChange={(e) => handleChange(index, e)}
                  className="rounded border-white/10 bg-surface text-primary-500 focus:ring-primary-500"
                />
                I currently work here
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <div className="relative">
              <textarea 
                rows={4}
                name="description"
                value={exp.description}
                onChange={(e) => handleChange(index, e)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 pr-32 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="• Developed new features..."
              />
              <button
                onClick={() => handleAIBullets(index)}
                disabled={loadingIndex === index}
                className="absolute bottom-3 right-3 bg-primary-500/10 hover:bg-primary-500/25 disabled:opacity-60 disabled:cursor-not-allowed text-primary-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors border border-primary-500/20"
              >
                {loadingIndex === index ? (
                  <><Loader2 size={13} className="animate-spin" /> Generating...</>
                ) : (
                  <><Wand2 size={13} /> AI Bullets</>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}

      <button 
        onClick={handleAdd}
        className="w-full border-2 border-dashed border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5 text-slate-300 rounded-2xl p-4 flex items-center justify-center gap-2 transition-all"
      >
        <Plus size={20} />
        Add Experience
      </button>
    </div>
  );
};

export default ExperienceForm;
