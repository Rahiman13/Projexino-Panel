import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeContext } from './context/ThemeContext';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
// import Users from './components/Users';
// import Blogs from './components/Blogs';
import Newsletter from './components/Newsletter';
import ProtectedRoute from './components/ProtectedRoute';
import Blogs from './components/Blogs';
import Subscribers from './components/Subscribers';
import Team from './components/Team';
import Careers from './components/Careers';
import Contacts from './components/Contacts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          {/* <Route path="users" element={<Users />} /> */}
          <Route path="newsletter" element={<Newsletter />} />
          <Route path="subscribers" element={<Subscribers />} />
          {/* <Route path="blogs" element={<Blogs />} /> */}
          <Route path="blogs" element={<Blogs />} />
          <Route path="team" element={<Team />} />
          <Route path="careers" element={<Careers />} />
          <Route path="contacts" element={<Contacts />} />
        </Route>

        {/* Redirect root to dashboard or login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer 
        theme={localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'}
      />
    </BrowserRouter>
  );
}

export default App;
