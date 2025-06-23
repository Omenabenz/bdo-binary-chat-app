import  React, { useState, useEffect } from 'react';
import { Plus, Minus, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabase';

export default function AdminWallet() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [action, setAction] = useState<'add' | 'remove'>('add');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { addTransaction, addNotification } = useApp();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .order('fullName');
      if (data) setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.tradingId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWalletAction = async () => {
    if (!selectedUserId || !amount) return;

    const selectedUser = users.find(u => u.id === selectedUserId);
    if (!selectedUser) return;

    const amountNum = Number(amount);
    const newBalance = action === 'add' 
      ? selectedUser.balance + amountNum 
      : Math.max(0, selectedUser.balance - amountNum);

    try {
      // Update user balance in Supabase
      await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', selectedUserId);

      // Add transaction record
      await addTransaction({
        id: Date.now().toString(),
        userId: selectedUserId,
        type: action === 'add' ? 'credit' : 'debit',
        amount: amountNum,
        status: 'completed',
        timestamp: new Date(),
        referenceNumber: `${action === 'add' ? 'CR' : 'DB'}-${Date.now()}`,
        companyMessage: reason || `${action === 'add' ? 'Credited' : 'Debited'} by company`
      });

      // Add notification
      await addNotification({
        id: Date.now().toString(),
        userId: selectedUserId,
        title: `Balance ${action === 'add' ? 'Credited' : 'Debited'}`,
        message: `₱${amountNum.toLocaleString()} has been ${action === 'add' ? 'added to' : 'deducted from'} your account. ${reason}`,
        type: 'balance',
        timestamp: new Date(),
        read: false
      });

      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === selectedUserId ? { ...u, balance: newBalance } : u
      ));

      // Reset form
      setSelectedUserId('');
      setAmount('');
      setReason('');
      
      alert(`Successfully ${action === 'add' ? 'added' : 'removed'} ₱${amountNum.toLocaleString()} ${action === 'add' ? 'to' : 'from'} ${selectedUser.fullName}'s account`);
    } catch (error) {
      console.error('Error updating wallet:', error);
      alert('Failed to update wallet. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
        <h1 className="text-xl font-semibold">Wallet Management</h1>
        <div className="text-sm opacity-75 mt-1">
          Manage user balances and funds
        </div>
      </div>

      <div className="space-y-6">
        {/* Search Users */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border rounded-lg"
          />
          <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
        </div>

        {/* User Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select User</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Choose user</option>
            {filteredUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.fullName} ({user.tradingId}) - ₱{(user.balance || 0).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {/* Action Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Action</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setAction('add')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                action === 'add' ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}
            >
              <Plus size={20} />
              <span>Add Funds</span>
            </button>
            <button
              onClick={() => setAction('remove')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                action === 'remove' ? 'bg-red-600 text-white' : 'bg-gray-200'
              }`}
            >
              <Minus size={20} />
              <span>Remove Funds</span>
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Amount (₱)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Enter amount"
            min="0"
          />
        </div>

        {/* Reason Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Reason/Note (Optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Enter reason for this transaction..."
            rows={3}
          />
        </div>

        {/* Execute Button */}
        <button
          onClick={handleWalletAction}
          disabled={!selectedUserId || !amount}
          className={`w-full py-3 rounded-lg font-semibold ${
            action === 'add' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          } disabled:bg-gray-400`}
        >
          {action === 'add' ? 'Add Funds' : 'Remove Funds'}
        </button>
      </div>

      {/* User Balance Overview */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">User Balances</h3>
        <div className="space-y-2">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-medium">{user.fullName}</div>
                <div className="text-sm text-gray-600">{user.tradingId}</div>
              </div>
              <div className="text-lg font-bold text-green-600">
                ₱{(user.balance || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 