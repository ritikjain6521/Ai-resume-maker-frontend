import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: null,
  users: [],
  totalUsers: 0,
  userPage: 1,
  userPages: 1,
  resumes: [],
  totalResumes: 0,
  subscriptionStats: null,
  isLoading: false,
  featureToggles: JSON.parse(localStorage.getItem('adminFeatureToggles') || JSON.stringify({
    grammarCheck: { Basic: false, Premium: true, Pro: true },
    atsOptimize: { Basic: false, Premium: true, Pro: true },
    aiSuggestions: { Basic: false, Premium: true, Pro: true },
    versionHistory: { Basic: false, Premium: false, Pro: true },
    jobMatcher: { Basic: false, Premium: false, Pro: true },
    pdfExport: { Basic: false, Premium: true, Pro: true },
    docxExport: { Basic: false, Premium: false, Pro: true },
    allTemplates: { Basic: false, Premium: true, Pro: true },
    aiCustomizer: { Basic: false, Premium: false, Pro: true },
  })),
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminStats: (state, action) => {
      state.stats = action.payload;
    },
    setAdminUsers: (state, action) => {
      state.users = action.payload.users;
      state.totalUsers = action.payload.total;
      state.userPage = action.payload.page;
      state.userPages = action.payload.pages;
    },
    updateAdminUser: (state, action) => {
      const idx = state.users.findIndex((u) => u._id === action.payload._id);
      if (idx !== -1) state.users[idx] = action.payload;
    },
    removeAdminUser: (state, action) => {
      state.users = state.users.filter((u) => u._id !== action.payload);
      state.totalUsers -= 1;
    },
    setAdminResumes: (state, action) => {
      state.resumes = action.payload.resumes;
      state.totalResumes = action.payload.total;
    },
    setSubscriptionStats: (state, action) => {
      state.subscriptionStats = action.payload;
    },
    setAdminLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateFeatureToggle: (state, action) => {
      const { feature, plan, value } = action.payload;
      state.featureToggles[feature][plan] = value;
      localStorage.setItem('adminFeatureToggles', JSON.stringify(state.featureToggles));
    },
  },
});

export const {
  setAdminStats,
  setAdminUsers,
  updateAdminUser,
  removeAdminUser,
  setAdminResumes,
  setSubscriptionStats,
  setAdminLoading,
  updateFeatureToggle,
} = adminSlice.actions;

export default adminSlice.reducer;
