import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import CCDashboard from './pages/CCDashboard';
import HODDashboard from './pages/HODDashboard';
import Profile from './pages/Profile';

function App() {
  const { user } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  const getDashboardByRole = () => {
    switch (user?.role) {
      case 'STUDENT': return <StudentDashboard />;
      case 'STAFF': return <StaffDashboard />;
      case 'CC': return <CCDashboard />;
      case 'HOD': return <HODDashboard />;
      default: return <Navigate to="/login" />;
    }
  };

  return (
    <div className="font-sans antialiased text-gray-100 bg-gray-950 min-h-screen selection:bg-blue-500/30">
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={getDashboardByRole()} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
