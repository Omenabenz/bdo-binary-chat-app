import  React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === 'Admin001') {
      adminLogin();
      navigate('/admin');
    } else {
      setError('Invalid access code');
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">Admin Access</h1>
          <p className="text-gray-600">Support Center Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Access Code</label>
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter access code"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600">Back to User Login</Link>
        </div>
      </div>
    </div>
  );
}
 