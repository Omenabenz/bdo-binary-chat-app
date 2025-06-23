import  React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, CreditCard, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navigation() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/dashboard/wallet', icon: CreditCard, label: 'Wallet' },
    { path: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
    { path: '/dashboard/profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${
      user?.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-t`}>
      <div className="flex justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path === '/dashboard/chat' && location.pathname === '/dashboard');
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-4 ${
                isActive 
                  ? 'text-blue-600' 
                  : user?.darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
 