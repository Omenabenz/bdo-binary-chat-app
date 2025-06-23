import  React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminInterface() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState('');

  const handleLogin = () => {
    if (accessCode === 'Admin001') {
      navigate('/admin/chat');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="bg-blue-600 text-white p-4 text-center rounded-lg mb-6">
        <h1 className="text-xl font-semibold">Admin Interface</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Access Code</h3>
          <input
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4"
            placeholder="Enter access code"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Log In
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={handleLogout}
            className="text-blue-600 underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
 