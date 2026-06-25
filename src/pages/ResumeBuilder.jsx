import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  updatePersonalInfo, setAtsData, setCurrentResume, setResumeTitle,
  resetCurrentResume, setSaving, setLoading 
} from '../redux/slices/resumeSlice';
import { 
  Wand2, Download, Eye, 
  BookOpen, Loader2, Save, Target, SpellCheck, Settings, 
  ChevronLeft, ChevronRight, ArrowLeft, Lock
} from 'lucide-react';

import ExperienceForm from '../components/forms/ExperienceForm';
import EducationForm from '../components/forms/EducationForm';
import SkillsForm from '../components/forms/SkillsForm';
import ProjectsForm from '../components/forms/ProjectsForm';
import CertificationsForm from '../components/forms/CertificationsForm';
import TemplateSelector from '../components/resume/TemplateSelector';
import ATSReport from '../components/resume/ATSReport';
import GrammarChecker from '../components/resume/GrammarChecker';
import JobMatcher from '../components/resume/JobMatcher';
import ResumePreview from '../components/resume/ResumePreview';

// ... (We'll use a mocked API for saving to avoid breaking if backend isn't up)
import { API } from '../config/api';

const TABS = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
];

const RIGHT_PANELS = [
  { id: 'preview', label: 'Live Preview', icon: Eye },
  { id: 'templates', label: 'Templates', icon: Settings },
  { id: 'jobMatch', label: 'Job Match', icon: Target },
];

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const resume = useSelector((state) => state.resume.currentResume);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { atsScore, atsMissingKeywords, atsFormattingIssues, atsSuggestions, atsSectionScores, atsStrengthLevel } = useSelector(state => state.resume);
  const isSaving = useSelector((state) => state.resume.isSaving);
  
  const [activeTab, setActiveTab] = useState('personal');
  const [rightPanel, setRightPanel] = useState('preview');
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [showGrammarCheck, setShowGrammarCheck] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchResume = async (resumeId) => {
    dispatch(setLoading(true));
    try {
      const res = await fetch(`${API}/resumes/${resumeId}`, { credentials: 'include' });
      if (res.ok) {
        dispatch(setCurrentResume(await res.json()));
      }
    } catch {
      console.error('Failed to fetch resume');
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Initialize
  useEffect(() => {
    if (id && id !== 'new') {
      fetchResume(id);
    } else {
      if (location.state?.importedData) {
        dispatch(setCurrentResume(location.state.importedData));
      } else {
        dispatch(resetCurrentResume());
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Check URL params for auto-actions
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('preview') === 'true') {
      // Avoid calling state directly in effect if possible. Using setTimeout to push out of current render cycle.
      setTimeout(() => {
        setRightPanel('preview');
        setIsMobilePreview(true);
      }, 0);
    }
    if (params.get('download') === 'true') {
      // Trigger download flow
      setTimeout(() => alert('Downloading PDF... (Export feature logic here)'), 500);
    }
  }, [location]);

  const handleSave = async (saveVersion = false, versionLabel = '') => {
    dispatch(setSaving(true));
    try {
      const method = id === 'new' ? 'POST' : 'PUT';
      const url = id === 'new' ? `${API}/resumes` : `${API}/resumes/${id}`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...resume, saveVersion, versionLabel })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (id === 'new') navigate(`/builder/${data._id}`, { replace: true });
        else dispatch(setCurrentResume(data));
      }
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      dispatch(setSaving(false));
    }
  };

  const handleAnalyzeAts = async () => {
    // Gate: only Premium and Pro users
    if (userInfo?.plan === 'Basic') {
      if (window.confirm('ATS Checker is a Premium & Pro feature. Would you like to view our plans?')) navigate('/pricing');
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await fetch(`${API}/ai/analyze-ats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ resumeData: resume, jobDescription: resume.jobDescription })
      });
      if (res.ok) {
        dispatch(setAtsData(await res.json()));
        setShowAtsModal(true);
      } else {
        const err = await res.json();
        alert(err.message || 'ATS analysis failed. Please try again.');
      }
    } catch {
      alert('Cannot reach AI server. Please check your connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Called when user clicks "Apply All Improvements & Save" in the ATS modal
  const handleAtsImprove = async () => {
    // The ATSReport component already dispatched updateSkills.
    // Now auto-save the updated resume.
    await handleSave();
  };

  const handleAIWrite = async (field, currentText) => {
    try {
      const res = await fetch(`${API}/ai/improve-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentSummary: currentText, role: resume.personalInfo.targetRole || 'Professional' })
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(updatePersonalInfo({ [field]: data.suggestion }));
      }
    } catch {
      alert("AI Service unavailable");
    }
  };

  // --- Rendering Helpers ---

  // Simple preview component rendering
  // Simple preview component rendering
  const renderPreview = () => (
    <div className="w-full max-w-[800px] mx-auto scale-[0.85] md:scale-100 origin-top flex flex-col items-center justify-start">
      <ResumePreview resume={resume} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-20 flex flex-col md:flex-row overflow-hidden">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-white/5 shrink-0 z-20">
        <button onClick={() => navigate('/dashboard')} className="p-2 text-slate-400 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobilePreview(!isMobilePreview)}
            className="px-3 py-1.5 bg-primary-500/20 text-primary-400 rounded-lg text-sm font-medium"
          >
            {isMobilePreview ? 'Edit' : 'Preview'}
          </button>
          <button onClick={() => handleSave()} className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <Save size={18} />
          </button>
        </div>
      </div>

      {/* Left Navigation Sidebar (Desktop) */}
      <div className={`hidden md:flex flex-col border-r border-white/5 bg-surface transition-all duration-300 z-10 ${sidebarCollapsed ? 'w-16' : 'w-64'} shrink-0`}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          {!sidebarCollapsed && (
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={16} /> Dashboard
            </button>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1.5 rounded hover:bg-white/5 text-slate-400">
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {!sidebarCollapsed && <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sections</p>}
          <nav className="space-y-1 px-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? tab.label : ''}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === tab.id ? 'bg-white' : 'bg-transparent'}`} />
                {!sidebarCollapsed && tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Middle Column - Editor Area */}
      <div className={`flex-1 flex flex-col h-[calc(100vh-5rem)] md:h-[calc(100vh-5rem)] overflow-hidden transition-transform duration-300 ${isMobilePreview ? '-translate-x-full md:translate-x-0 hidden md:flex' : 'flex'}`}>
        
        {/* Editor Toolbar */}
        <div className="h-16 border-b border-white/5 bg-surface/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
          <input 
            type="text"
            value={resume.title}
            onChange={(e) => dispatch(setResumeTitle(e.target.value))}
            className="bg-transparent text-lg font-bold text-white placeholder-slate-500 focus:outline-none w-1/2"
            placeholder="Resume Title"
          />
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                if (userInfo?.plan === 'Basic') {
                  if(confirm("Grammar Check is a Premium feature. Would you like to view our plans?")) navigate('/pricing');
                  return;
                }
                setShowGrammarCheck(true);
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-medium flex items-center gap-2 transition-colors hidden sm:flex relative group"
            >
              {userInfo?.plan === 'Basic' ? <Lock size={16} /> : <SpellCheck size={16} />} 
              <span className="hidden lg:inline">Grammar</span>
            </button>
            <button 
              onClick={handleAnalyzeAts}
              disabled={isAnalyzing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 font-medium flex items-center gap-2 transition-colors disabled:opacity-50 relative group"
            >
              {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : userInfo?.plan === 'Basic' ? <Lock size={16} /> : <Wand2 size={16} />}
              <span className="hidden sm:inline">ATS Check</span>
            </button>
            <button 
              onClick={() => handleSave()}
              disabled={isSaving}
              className="p-2 sm:px-4 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        {/* Editor Form Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Form Content - Personal Info */}
            {activeTab === 'personal' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="font-semibold text-white">Personal Information</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Your basic contact details</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {[
                    { label: 'First Name', name: 'firstName', placeholder: 'John' },
                    { label: 'Last Name', name: 'lastName', placeholder: 'Doe' },
                    { label: 'Email', name: 'email', placeholder: 'john@example.com', type: 'email' },
                    { label: 'Phone', name: 'phone', placeholder: '+1 234 567 890' },
                    { label: 'Location', name: 'address', placeholder: 'New York, NY' },
                    { label: 'Target Role', name: 'targetRole', placeholder: 'Software Engineer' },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">{field.label}</label>
                      <input 
                        type={field.type || 'text'} 
                        name={field.name}
                        value={resume.personalInfo[field.name]}
                        onChange={(e) => dispatch(updatePersonalInfo({ [field.name]: e.target.value }))}
                        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-slate-600"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-4 border-t border-white/5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">LinkedIn URL</label>
                    <input 
                      type="url" name="linkedIn"
                      value={resume.personalInfo.linkedIn || ''}
                      onChange={(e) => dispatch(updatePersonalInfo({ linkedIn: e.target.value }))}
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder-slate-600"
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">GitHub / Portfolio URL</label>
                    <input 
                      type="url" name="github"
                      value={resume.personalInfo.github || ''}
                      onChange={(e) => dispatch(updatePersonalInfo({ github: e.target.value }))}
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-slate-500 transition-all placeholder-slate-600"
                      placeholder="github.com/johndoe"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-400">Professional Summary</label>
                    <button 
                      onClick={() => handleAIWrite('summary', resume.personalInfo.summary)}
                      className="text-xs font-medium text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
                    >
                      <Wand2 size={12} /> AI Rewrite
                    </button>
                  </div>
                  <textarea 
                    rows={6}
                    name="summary"
                    value={resume.personalInfo.summary}
                    onChange={(e) => dispatch(updatePersonalInfo({ summary: e.target.value }))}
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-slate-600 resize-y"
                    placeholder="Results-driven software engineer with 5+ years of experience..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'experience' && <ExperienceForm />}
            {activeTab === 'education' && <EducationForm />}
            {activeTab === 'skills' && <SkillsForm />}
            {activeTab === 'projects' && <ProjectsForm />}
            {activeTab === 'certifications' && <CertificationsForm />}
            
          </div>
        </div>
      </div>

      {/* Right Column - Multi-Panel Area (Desktop) & Full Screen Mobile Preview */}
      <div className={`w-full md:w-[45%] lg:w-[45%] xl:w-[50%] h-[calc(100vh-5rem)] bg-surface border-l border-white/5 flex flex-col absolute md:static top-20 left-0 z-30 transition-transform duration-300 ${isMobilePreview ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        
        {/* Right Panel Tabs */}
        <div className="flex p-2 gap-1 bg-surface border-b border-white/5 shrink-0 overflow-x-auto hide-scrollbar">
          {RIGHT_PANELS.map((panel) => (
            <button
              key={panel.id}
              onClick={() => setRightPanel(panel.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
                rightPanel === panel.id 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <panel.icon size={16} /> {panel.label}
            </button>
          ))}
          <div className="flex-1" />
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-semibold transition-colors shrink-0"
          >
            <Download size={16} /> Export
          </button>
        </div>

        {/* Right Panel Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-900 flex items-start justify-center relative">
          
          {rightPanel === 'preview' && (
            <div className="w-full h-full p-4 sm:p-8 flex items-start justify-center overflow-auto custom-scrollbar">
              {renderPreview()}
            </div>
          )}

          {rightPanel === 'templates' && (
            <div className="w-full h-full p-6 bg-background animate-in fade-in zoom-in-95 duration-300">
              <TemplateSelector />
            </div>
          )}

          {rightPanel === 'jobMatch' && (
            <div className="w-full h-full p-6 bg-background animate-in fade-in slide-in-from-right-4 duration-300">
              <JobMatcher resumeData={resume} />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAtsModal && (
        <ATSReport 
          score={atsScore}
          missingKeywords={atsMissingKeywords}
          formattingIssues={atsFormattingIssues}
          suggestions={atsSuggestions}
          sectionScores={atsSectionScores}
          strengthLevel={atsStrengthLevel}
          onClose={() => setShowAtsModal(false)}
          onImprove={handleAtsImprove}
        />
      )}

      {showGrammarCheck && (
        <GrammarChecker 
          textToCheck={`${resume.personalInfo.summary}\n${resume.experience.map(e => `${e.description}`).join('\n')}\n${resume.projects.map(p => p.description).join('\n')}`}
          onClose={() => setShowGrammarCheck(false)}
        />
      )}

    </div>
  );
};

export default ResumeBuilder;
