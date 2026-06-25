import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSkills } from '../../redux/slices/resumeSlice';
import { X, Plus, Wand2 } from 'lucide-react';

const SkillsForm = () => {
  const dispatch = useDispatch();
  const skills = useSelector((state) => state.resume.currentResume.skills);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      dispatch(updateSkills([...skills, inputValue.trim()]));
      setInputValue('');
    }
  };

  const handleRemove = (skillToRemove) => {
    dispatch(updateSkills(skills.filter(s => s !== skillToRemove)));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass p-6 rounded-2xl border border-white/5">
        <label className="block text-sm font-medium text-slate-400 mb-2">Add Skills</label>
        
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            placeholder="e.g. React.js, Python, Project Management"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-all"
          >
            Add
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2 bg-surface border border-white/10 px-4 py-2 rounded-full text-sm">
              <span>{skill}</span>
              <button 
                onClick={() => handleRemove(skill)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {skills.length === 0 && (
            <p className="text-slate-500 text-sm">No skills added yet.</p>
          )}
        </div>
      </div>

      <button className="w-full glass border border-primary-500/30 hover:bg-primary-500/10 text-primary-400 rounded-2xl p-4 flex items-center justify-center gap-2 transition-all">
        <Wand2 size={20} />
        Auto-Suggest Skills via AI
      </button>
    </div>
  );
};

export default SkillsForm;
