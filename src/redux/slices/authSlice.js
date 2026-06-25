import { createSlice } from '@reduxjs/toolkit';

// Safely parse stored user info — clear if corrupted or missing required fields
const getSavedUser = () => {
  try {
    const raw = localStorage.getItem('userInfo');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Validate required fields exist; if not, wipe the stale entry
    if (!parsed?._id || !parsed?.email || !parsed?.role) {
      localStorage.removeItem('userInfo');
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem('userInfo');
    return null;
  }
};

const initialState = {
  userInfo: getSavedUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
