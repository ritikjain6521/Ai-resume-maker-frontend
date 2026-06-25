import { useDispatch, useSelector } from 'react-redux';
import { addEducation, updateEducation, deleteEducation } from '../../redux/slices/resumeSlice';
import { Plus, Trash2 } from 'lucide-react';

const EducationForm = () => {
  const dispatch = useDispatch();
  const educations = useSelector((state) => state.resume.currentResume.education);

  const handleAdd = () => {
    dispatch(addEducation({
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: ''
    }));
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    dispatch(updateEducation({ index, data: { [name]: value } }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {educations.map((edu, index) => (
        <div key={index} className="glass p-6 rounded-2xl border border-white/5 relative group">
          <button 
            onClick={() => dispatch(deleteEducation(index))}
            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={20} />
          </button>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">School / University</label>
              <input 
                type="text" name="school" value={edu.school} onChange={(e) => handleChange(index, e)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="Harvard University"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Degree</label>
              <input 
                type="text" name="degree" value={edu.degree} onChange={(e) => handleChange(index, e)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="Bachelor of Science"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Field of Study</label>
              <input 
                type="text" name="fieldOfStudy" value={edu.fieldOfStudy} onChange={(e) => handleChange(index, e)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Start Date</label>
              <input 
                type="month" name="startDate" value={edu.startDate} onChange={(e) => handleChange(index, e)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">End Date</label>
              <input 
                type="month" name="endDate" value={edu.endDate} onChange={(e) => handleChange(index, e)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Grade / GPA (Optional)</label>
            <input 
              type="text" name="grade" value={edu.grade} onChange={(e) => handleChange(index, e)}
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="3.8/4.0"
            />
          </div>
        </div>
      ))}

      <button 
        onClick={handleAdd}
        className="w-full border-2 border-dashed border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5 text-slate-300 rounded-2xl p-4 flex items-center justify-center gap-2 transition-all"
      >
        <Plus size={20} />
        Add Education
      </button>
    </div>
  );
};

export default EducationForm;
