import  { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chat from './user/Chat';
import Wallet from './user/Wallet';
import Notifications from './user/Notifications';
import Profile from './user/Profile';
import Navigation from './user/Navigation';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={`min-h-screen ${user.darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Navigation />
    </div>
  );
}
 