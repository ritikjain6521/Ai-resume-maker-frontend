import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentResume: {
    _id: null,
    title: 'Untitled Resume',
    templateId: 'modern',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      linkedIn: '',
      github: '',
      website: '',
      summary: '',
      targetRole: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
    jobDescription: '',
  },
  resumes: [],           // list of user's resumes
  atsScore: null,
  atsMissingKeywords: [],
  atsFormattingIssues: [],
  atsSuggestions: [],
  atsSectionScores: {},
  atsStrengthLevel: '',
  optimizationSuggestions: [],
  jobMatchScore: null,
  grammarIssues: [],
  grammarCorrectedText: '',
  aiSuggestions: null,   // { keywords, certifications, trendingTechnologies, industryTrends, projectIdeas }
  isLoading: false,
  isSaving: false,
  activeResumeId: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setResumes: (state, action) => {
      state.resumes = action.payload;
    },
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
      state.activeResumeId = action.payload._id;
    },
    resetCurrentResume: (state) => {
      state.currentResume = initialState.currentResume;
      state.activeResumeId = null;
      state.atsScore = null;
      state.atsMissingKeywords = [];
      state.atsFormattingIssues = [];
      state.atsSuggestions = [];
      state.grammarIssues = [];
    },
    updatePersonalInfo: (state, action) => {
      state.currentResume.personalInfo = { ...state.currentResume.personalInfo, ...action.payload };
    },
    setTemplate: (state, action) => {
      state.currentResume.templateId = action.payload;
    },
    setResumeTitle: (state, action) => {
      state.currentResume.title = action.payload;
    },
    setSectionOrder: (state, action) => {
      state.currentResume.sectionOrder = action.payload;
    },
    setJobDescription: (state, action) => {
      state.currentResume.jobDescription = action.payload;
    },
    addExperience: (state, action) => {
      state.currentResume.experience.push(action.payload);
    },
    updateExperience: (state, action) => {
      const { index, data } = action.payload;
      state.currentResume.experience[index] = { ...state.currentResume.experience[index], ...data };
    },
    deleteExperience: (state, action) => {
      state.currentResume.experience.splice(action.payload, 1);
    },
    addEducation: (state, action) => {
      state.currentResume.education.push(action.payload);
    },
    updateEducation: (state, action) => {
      const { index, data } = action.payload;
      state.currentResume.education[index] = { ...state.currentResume.education[index], ...data };
    },
    deleteEducation: (state, action) => {
      state.currentResume.education.splice(action.payload, 1);
    },
    updateSkills: (state, action) => {
      state.currentResume.skills = action.payload;
    },
    addProject: (state, action) => {
      state.currentResume.projects.push(action.payload);
    },
    updateProject: (state, action) => {
      const { index, data } = action.payload;
      state.currentResume.projects[index] = { ...state.currentResume.projects[index], ...data };
    },
    deleteProject: (state, action) => {
      state.currentResume.projects.splice(action.payload, 1);
    },
    addCertification: (state, action) => {
      state.currentResume.certifications.push(action.payload);
    },
    updateCertification: (state, action) => {
      const { index, data } = action.payload;
      state.currentResume.certifications[index] = { ...state.currentResume.certifications[index], ...data };
    },
    deleteCertification: (state, action) => {
      state.currentResume.certifications.splice(action.payload, 1);
    },
    setAtsData: (state, action) => {
      state.atsScore = action.payload.score;
      state.atsMissingKeywords = action.payload.missingKeywords || [];
      state.atsFormattingIssues = action.payload.formattingIssues || [];
      state.atsSuggestions = action.payload.suggestions || [];
      state.atsSectionScores = action.payload.sectionScores || {};
      state.atsStrengthLevel = action.payload.strengthLevel || '';
      state.optimizationSuggestions = action.payload.suggestions || [];
    },
    setJobMatchData: (state, action) => {
      state.jobMatchScore = action.payload.jobMatchScore;
      state.optimizationSuggestions = action.payload.bulletPointSuggestions || [];
    },
    setGrammarData: (state, action) => {
      state.grammarIssues = action.payload.issues || [];
      state.grammarCorrectedText = action.payload.correctedText || '';
    },
    applyGrammarFix: (state, action) => {
      const { original, corrected } = action.payload;
      
      // Update summary
      if (state.currentResume.personalInfo.summary?.includes(original)) {
        state.currentResume.personalInfo.summary = state.currentResume.personalInfo.summary.replace(original, corrected);
      }
      
      // Update experience descriptions
      state.currentResume.experience = state.currentResume.experience.map(exp => {
        if (exp.description?.includes(original)) {
          return { ...exp, description: exp.description.replace(original, corrected) };
        }
        return exp;
      });

      // Update project descriptions
      state.currentResume.projects = state.currentResume.projects.map(proj => {
        if (proj.description?.includes(original)) {
          return { ...proj, description: proj.description.replace(original, corrected) };
        }
        return proj;
      });

      // Remove the issue from the list once applied
      state.grammarIssues = state.grammarIssues.filter(i => i.original !== original);
    },
    setAiSuggestions: (state, action) => {
      state.aiSuggestions = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },
  },
});

export const {
  setResumes,
  setCurrentResume,
  resetCurrentResume,
  updatePersonalInfo,
  setTemplate,
  setResumeTitle,
  setSectionOrder,
  setJobDescription,
  addExperience, updateExperience, deleteExperience,
  addEducation, updateEducation, deleteEducation,
  updateSkills,
  addProject, updateProject, deleteProject,
  addCertification, updateCertification, deleteCertification,
  setAtsData,
  setJobMatchData,
  setGrammarData,
  applyGrammarFix,
  setAiSuggestions,
  setLoading,
  setSaving,
} = resumeSlice.actions;

export default resumeSlice.reducer;
