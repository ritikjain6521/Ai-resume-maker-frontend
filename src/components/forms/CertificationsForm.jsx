import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCertification, updateCertification, deleteCertification } from '../../redux/slices/resumeSlice';
import { Plus, Trash2, Award } from 'lucide-react';

const CertificationsForm = () => {
  const dispatch = useDispatch();
  const certifications = useSelector((state) => state.resume.currentResume.certifications);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleAdd = () => {
    dispatch(addCertification({ name: '', issuer: '', date: '', credentialId: '', url: '' }));
    setExpandedIndex(certifications.length);
  };

  const handleUpdate = (index, field, value) => {
    dispatch(updateCertification({ index, data: { [field]: value } }));
  };

  const handleDelete = (index) => {
    dispatch(deleteCertification(index));
    setExpandedIndex(null);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">Certifications</h3>
          <p className="text-xs text-slate-400 mt-0.5">Add your professional certifications</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {certifications.length === 0 && (
        <div className="text-center py-8 rounded-xl border border-dashed border-white/10">
          <Award size={32} className="text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No certifications added yet</p>
          <button onClick={handleAdd} className="mt-2 text-primary-400 text-sm hover:text-primary-300 transition-colors">
            + Add your first certification
          </button>
        </div>
      )}

      {certifications.map((cert, index) => (
        <div key={index} className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Award size={16} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">{cert.name || 'New Certification'}</p>
                <p className="text-xs text-slate-400">{cert.issuer || 'Issuer'} {cert.date && `· ${cert.date}`}</p>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(index); }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </button>

          {expandedIndex === index && (
            <div className="p-4 pt-0 space-y-3 border-t border-white/5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Certification Name *</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                    placeholder="AWS Certified Developer"
                    className="w-full bg-background border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Issuing Organization</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => handleUpdate(index, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                    className="w-full bg-background border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Issue Date</label>
                  <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => handleUpdate(index, 'date', e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Credential ID</label>
                  <input
                    type="text"
                    value={cert.credentialId}
                    onChange={(e) => handleUpdate(index, 'credentialId', e.target.value)}
                    placeholder="ABC123XYZ"
                    className="w-full bg-background border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Credential URL</label>
                <input
                  type="url"
                  value={cert.url}
                  onChange={(e) => handleUpdate(index, 'url', e.target.value)}
                  placeholder="https://www.credly.com/badges/..."
                  className="w-full bg-background border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CertificationsForm;
