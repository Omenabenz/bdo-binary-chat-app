import  React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { supabase } from '../supabase';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { addNotification } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${identifier},tradingId.eq.${identifier}`);

      if (users && users.length > 0) {
        const user = users[0];
        
        // Add login notification
        await addNotification({
          id: Date.now().toString(),
          userId: user.id,
          title: 'Login Alert',
          message: `You have successfully logged in to your account at ${new Date().toLocaleString()}`,
          type: 'login',
          timestamp: new Date(),
          read: false
        });

        login(user);
        navigate('/dashboard');
      } else {
        setError('Account not found. Please check your Trading ID or Email.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">BDO Binary</h1>
          <p className="text-lg text-blue-600">Chat-App</p>
        </div>

        <h2 className="text-xl font-semibold mb-6">Log in</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Trading ID number or Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-3 border rounded-lg"
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
            Log in
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/register" className="text-blue-600">Create account</Link>
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/admin-login" 
            className="text-gray-400 text-xs hover:text-gray-600"
          >
            Support Center
          </Link>
        </div>
      </div>
    </div>
  );
}
 