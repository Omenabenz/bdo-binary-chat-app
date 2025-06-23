import  React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { supabase } from '../supabase';
import { User } from '../types';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    amountInvested: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tradingId, setTradingId] = useState('');
  const { login } = useAuth();
  const { addNotification } = useApp();
  const navigate = useNavigate();

  const generateTradingId = () => {
    return `#BDO-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    const newTradingId = generateTradingId();
    const newUser: User = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      amountInvested: Number(formData.amountInvested),
      tradingId: newTradingId,
      balance: 0,
      darkMode: false,
      notifications: true,
      createdAt: new Date()
    };

    try {
      await supabase.from('users').insert(newUser);

      await addNotification({
        id: Date.now().toString(),
        userId: newUser.id,
        title: 'Account Created Successfully',
        message: `Welcome to BDO Binary! Your Trading ID is ${newTradingId}. Your account has been successfully created.`,
        type: 'message',
        timestamp: new Date(),
        read: false
      });

      setTradingId(newTradingId);
      setShowSuccess(true);

      setTimeout(() => {
        login(newUser);
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg p-8 w-full max-w-md text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-xl font-semibold mb-4">Account successfully created!</h2>
          <p className="text-lg mb-4">Your Trading ID: <strong>{tradingId}</strong></p>
          <div className="text-sm text-gray-600">Redirecting to your account...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">BDO Binary</h1>
          <p className="text-lg text-blue-600">Chat-App</p>
        </div>

        <h2 className="text-xl font-semibold mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount Invested</label>
            <input
              type="number"
              value={formData.amountInvested}
              onChange={(e) => setFormData({...formData, amountInvested: e.target.value})}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
              required
            />
            <label className="text-sm text-gray-600">
              I agree to the Terms and Conditions
            </label>
          </div>

          <button
            type="submit"
            disabled={!agreed}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
          >
            Create account
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600">Already have an account? Log in</Link>
        </div>
      </div>
    </div>
  );
}
 