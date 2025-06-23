import  React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Mail, Phone, User, CreditCard } from 'lucide-react';
import { supabase } from '../../supabase';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .order('createdAt', { ascending: false });
      if (data) setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const updateUser = async (userId: string, updates: any) => {
    try {
      await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);
      
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
      setSelectedUser({ ...selectedUser, ...updates });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await supabase.from('users')
        .delete()
        .eq('id', userId);
      
      setUsers(prev => prev.filter(u => u.id !== userId));
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (selectedUser) {
    return (
      <div className="min-h-screen bg-white p-4 pb-20">
        <div className="flex items-center mb-6">
          <ArrowLeft size={24} onClick={() => setSelectedUser(null)} className="cursor-pointer" />
          <h1 className="text-xl font-semibold ml-4">User Details</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
            <img
              src={selectedUser.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face'}
              className="w-20 h-20 rounded-full mx-auto mb-4"
              alt={selectedUser.fullName}
            />
            <h2 className="text-xl font-semibold">{selectedUser.fullName}</h2>
            <p className="text-sm opacity-75">{selectedUser.tradingId}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center">
              <User size={20} className="mr-2" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail size={16} className="mr-3 text-gray-500" />
                <span>{selectedUser.email}</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-3 text-gray-500" />
                <span>{selectedUser.phone}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center">
              <CreditCard size={20} className="mr-2" />
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Current Balance:</span>
                <span className="font-semibold text-green-600">₱{(selectedUser.balance || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Initial Investment:</span>
                <span className="font-semibold">₱{selectedUser.amountInvested.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Created:</span>
                <span>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-600 font-semibold">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Edit User Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={selectedUser.fullName}
                  onChange={(e) => setSelectedUser({...selectedUser, fullName: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={selectedUser.phone}
                  onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Balance (₱)</label>
                <input
                  type="number"
                  defaultValue={selectedUser.balance || 0}
                  onChange={(e) => setSelectedUser({...selectedUser, balance: parseFloat(e.target.value)})}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <button 
                onClick={() => {
                  updateUser(selectedUser.id, selectedUser);
                  alert('User updated successfully!');
                }}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
              View Transaction History
            </button>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold">
              Send Message
            </button>
            <button 
              onClick={() => {
                const confirmed = confirm('Are you sure you want to delete this user?');
                if (confirmed) {
                  deleteUser(selectedUser.id);
                  alert('User deleted successfully!');
                }
              }}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
        <h1 className="text-xl font-semibold">Users</h1>
        <div className="text-sm opacity-75 mt-1">
          {users.length} registered users
        </div>
      </div>

      <div className="space-y-4">
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users registered yet
          </div>
        ) : (
          users.map((user: any) => {
            const isOnline = Math.random() > 0.5;
            const lastSeen = isOnline ? 'Online' : `Last seen ${new Date(user.createdAt).toLocaleDateString()}`;
            
            return (
              <div 
                key={user.id} 
                className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={user.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face'}
                        className="w-12 h-12 rounded-full"
                        alt={user.fullName}
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <div className="font-semibold">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{lastSeen}</div>
                      <div className="text-xs text-blue-600">{user.tradingId}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      ₱{(user.balance || 0).toLocaleString()}
                    </div>
                    <ChevronRight size={20} className="text-gray-400 mt-1" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
 