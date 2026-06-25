// Centralized API configuration for production and development
// In production (Vercel), uses the Render backend URL
// In development, uses localhost:5000

const API_BASE_URL = import.meta.env.VITE_API_URL 
  || (import.meta.env.PROD 
    ? 'https://ai-resume-maker-backend-ve6d.onrender.com' 
    : 'http://localhost:5000');

export const API = `${API_BASE_URL}/api`;
export default API_BASE_URL;
