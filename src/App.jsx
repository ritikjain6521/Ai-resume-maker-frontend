import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumeManager from './pages/ResumeManager';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Features from './pages/Features';
import Templates from './pages/Templates';
import Pricing from './pages/Pricing';
import AIAssistant from './components/AIAssistant';

// ------ Route Guards ------
const ProtectedRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  if (!userInfo) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  if (!userInfo) return <Navigate to="/login" replace />;
  if (userInfo.role !== 'Admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  if (userInfo) {
    // Send admins to admin panel, regular users to dashboard
    return <Navigate to={userInfo.role === 'Admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
};

// Hide Navbar for builder pages (full-screen editor)
const NAVBAR_HIDDEN_PATHS = ['/builder'];

function AppContent() {
  const location = window.location;
  const hideNavbar = NAVBAR_HIDDEN_PATHS.some((p) => location.pathname.startsWith(p));

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Auth Routes (redirect if already logged in) */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* Protected User Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/resumes" element={<ProtectedRoute><ResumeManager /></ProtectedRoute>} />
          <Route path="/builder/:id" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
          <Route path="/builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AIAssistant />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
