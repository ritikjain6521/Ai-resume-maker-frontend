import { useState } from 'react';
import { Sparkles, FileText, Download, Briefcase, FileSignature, Copy, CheckCircle, Lock } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { API } from '../../config/api';
import toast from 'react-hot-toast';

const CoverLetterGenerator = ({ resume, isPremium }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState(resume?.personalInfo?.targetRole || '');
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async () => {
    if (!isPremium) {
      toast.error('Cover letter generation is a Premium feature.');
      return;
    }
    
    if (!targetRole) {
      toast.error('Please specify a target role.');
      return;
    }

    setIsGenerating(true);
    setCoverLetter('');

    try {
      const res = await fetch(`${API}/ai/generate-cover-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          resumeData: resume,
          jobDescription: jobDescription || `Write a cover letter for the role of ${targetRole}.`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCoverLetter(data.coverLetter);
        toast.success('Cover letter generated successfully!');
      } else {
        toast.error(data.message || 'Failed to generate cover letter');
      }
    } catch (err) {
      toast.error('Network error while generating cover letter.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setIsCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ format: 'a4' });
    const p = resume.personalInfo || {};
    
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(`${p.firstName || ''} ${p.lastName || ''}`, 20, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    const contactInfo = [p.email, p.phone, p.linkedIn].filter(Boolean).join('  |  ');
    doc.text(contactInfo, 20, 28);
    
    doc.setDrawColor(200);
    doc.line(20, 32, 190, 32);

    doc.setTextColor(0);
    doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 20, 42);

    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(coverLetter, 170);
    doc.text(splitText, 20, 52);

    doc.save(`Cover_Letter_${p.firstName || 'My'}_${p.lastName || 'Resume'}.pdf`);
  };

  // ── Locked State for Basic Users ──
  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center h-full">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
          <Lock size={36} className="text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">AI Cover Letter Generator</h2>
        <p className="text-slate-400 max-w-sm mb-8 text-sm leading-relaxed">
          Instantly generate a tailored, professional cover letter matching your resume and the job description.
        </p>
        <div className="glass rounded-xl p-4 mb-6 inline-block border border-primary-500/20">
          <p className="text-primary-300 font-medium text-sm flex items-center gap-2">
            <Sparkles size={16} /> Available for Premium & Pro users only
          </p>
        </div>
        <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-primary-500/25">
          Upgrade Plan
        </button>
      </div>
    );
  }

  // ── Premium UI ──
  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">

      {/* Header */}
      <div className="p-5 border-b border-white/5 shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary-500/15 border border-primary-500/20">
            <FileSignature size={20} className="text-primary-400" />
          </div>
          Cover Letter Generator
        </h2>
        <p className="text-xs text-slate-500 mt-2 ml-11">
          Provide the job details and our AI will write a highly tailored cover letter.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 space-y-5 overflow-y-auto custom-scrollbar">

        {/* Target Role */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Briefcase size={14} className="text-slate-500" /> Target Role
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-slate-600"
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <FileText size={14} className="text-slate-500" /> Job Description
            <span className="text-slate-600 normal-case tracking-normal font-normal">(optional but recommended)</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here for a highly tailored cover letter..."
            rows={6}
            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-slate-600 resize-none"
          ></textarea>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !targetRole}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            <>
              <Sparkles size={18} /> Generate Cover Letter
            </>
          )}
        </button>

        {/* Output Preview */}
        <div className="glass rounded-2xl border border-white/5 flex flex-col overflow-hidden">
          <div className="bg-surface/60 border-b border-white/5 px-5 py-3 flex items-center justify-between shrink-0">
            <h3 className="font-semibold text-white text-sm">Preview</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!coverLetter}
                className="p-2 text-slate-400 hover:text-primary-400 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30"
                title="Copy to clipboard"
              >
                {isCopied ? <CheckCircle size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={!coverLetter}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-30"
              >
                <Download size={14} /> PDF
              </button>
            </div>
          </div>
          <div className="p-5 min-h-[200px]">
            {coverLetter ? (
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {coverLetter}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 py-12">
                <FileText size={40} className="mb-3 opacity-30" />
                <p className="text-sm">Your generated cover letter will appear here.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoverLetterGenerator;
