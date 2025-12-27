import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';
import Pipeline from './pages/Pipeline';
import MyApplications from './pages/MyApplications';

import CareerAdvisor from './pages/CareerAdvisor';


import Sidebar from './components/Sidebar';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" />; // Or unauthorized page

  return children;
};

function App() {
  const role = localStorage.getItem('role');
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {localStorage.getItem('token') && <Sidebar />}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['ROLE_ADMIN']}><AdminDashboard /></PrivateRoute>} />
            <Route path="/recruiter/dashboard" element={<PrivateRoute allowedRoles={['ROLE_RECRUITER']}><RecruiterDashboard /></PrivateRoute>} />
            <Route path="/candidate/dashboard" element={<PrivateRoute allowedRoles={['ROLE_CANDIDATE']}><CandidateDashboard /></PrivateRoute>} />

            <Route path="/jobs" element={<PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_RECRUITER', 'ROLE_CANDIDATE']}><Jobs /></PrivateRoute>} />
            <Route path="/candidates" element={<PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_RECRUITER']}><Candidates /></PrivateRoute>} />
            <Route path="/pipeline" element={<PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_RECRUITER']}><Pipeline /></PrivateRoute>} />
            <Route path="/my-applications" element={<PrivateRoute allowedRoles={['ROLE_CANDIDATE']}><MyApplications /></PrivateRoute>} />
            <Route path="/career-advisor" element={<PrivateRoute allowedRoles={['ROLE_CANDIDATE']}><CareerAdvisor /></PrivateRoute>} />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
