import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './slices/resumeSlice';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    auth: authReducer,
    admin: adminReducer,
  },
});
