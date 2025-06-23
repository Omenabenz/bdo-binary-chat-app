import  { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Login from './components/Login';
import Register from './components/Register';
import AdminLogin from './components/admin/AdminLogin';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import NotificationPopup from './components/NotificationPopup';

function AppRoutes() {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user && !isAdmin ? <Login /> : <Navigate to={user ? "/dashboard" : "/admin"} />} />
      <Route path="/register" element={!user && !isAdmin ? <Register /> : <Navigate to={user ? "/dashboard" : "/admin"} />} />
      <Route path="/admin-login" element={!isAdmin ? <AdminLogin /> : <Navigate to="/admin" />} />
      <Route path="/dashboard/*" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/admin/*" element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin-login" />} />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : isAdmin ? "/admin" : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="App">
            <AppRoutes />
            <NotificationPopup />
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}
 