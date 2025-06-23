import  React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, CreditCard, Download, Users, User } from 'lucide-react';

export default function AdminNavigation() {
  const location = useLocation();

  const navItems = [
    { path: '/admin/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/admin/wallet', icon: CreditCard, label: 'Wallet' },
    { path: '/admin/withdrawals', icon: Download, label: 'Withdrawals' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path === '/admin/chat' && location.pathname === '/admin');
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-4 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
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
 