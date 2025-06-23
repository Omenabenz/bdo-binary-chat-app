import  { Routes, Route } from 'react-router-dom';
import AdminChat from './AdminChat';
import AdminWallet from './AdminWallet';
import AdminWithdrawals from './AdminWithdrawals';
import AdminUsers from './AdminUsers';
import AdminProfile from './AdminProfile';
import AdminNavigation from './AdminNavigation';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<AdminChat />} />
        <Route path="/chat" element={<AdminChat />} />
        <Route path="/wallet" element={<AdminWallet />} />
        <Route path="/withdrawals" element={<AdminWithdrawals />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/profile" element={<AdminProfile />} />
      </Routes>
      <AdminNavigation />
    </div>
  );
}
 