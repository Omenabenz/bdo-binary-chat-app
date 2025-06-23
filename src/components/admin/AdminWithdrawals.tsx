import  React, { useState, useEffect } from 'react'; 
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabase';

export default function AdminWithdrawals() {
  const { transactions, updateTransaction, addNotification } = useApp();
   const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null); 
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    message: ''
  });

  const withdrawalTransactions = transactions.filter(t => t.type === 'withdrawal');

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' }
  ];

  const handleStatusUpdate = async () => {
    if (!selectedTransaction || !statusUpdate.status) return;

    const transaction = withdrawalTransactions.find(t => t.id === selectedTransaction);
    if (!transaction) return;

    try {
      await updateTransaction(selectedTransaction, {
        status: statusUpdate.status,
        companyMessage: statusUpdate.message
      });

      await addNotification({
        id: Date.now().toString(),
        userId: transaction.userId,
        title: `Withdrawal ${statusUpdate.status.charAt(0).toUpperCase() + statusUpdate.status.slice(1)}`,
               message: `Your withdrawal of ₱${transaction.amount.toLocaleString()} has been ${statusUpdate.status}. ${statusUpdate.message}`, 
        type: 'withdrawal',
        timestamp: new Date(),
        read: false
      });

      setSelectedTransaction(null);
      setStatusUpdate({ status: '', message: '' });
      alert('Withdrawal status updated successfully!');
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      alert('Failed to update withdrawal status');
    }
  };

  if (selectedTransaction) {
    const transaction = withdrawalTransactions.find(t => t.id === selectedTransaction);
    if (!transaction) return null;

    return (
      <div className="min-h-screen bg-white p-4 pb-20">
        <div className="flex items-center mb-6">
          <ArrowLeft size={24} onClick={() => setSelectedTransaction(null)} className="cursor-pointer" />
          <h1 className="text-xl font-semibold ml-4">Update Withdrawal</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Withdrawal Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold">₱{transaction.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Reference:</span>
                <span>{transaction.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(transaction.timestamp).toLocaleDateString()}</span>
              </div>
              {transaction.bankDetails && (
                <>
                  <div className="flex justify-between">
                    <span>Bank:</span>
                    <span>{transaction.bankDetails.bank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account:</span>
                    <span>{transaction.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span>{transaction.bankDetails.accountName}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Update Status</label>
            <select
              value={statusUpdate.status}
              onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message/Instructions</label>
            <textarea
              value={statusUpdate.message}
              onChange={(e) => setStatusUpdate({...statusUpdate, message: e.target.value})}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="Add message or instructions for the user..."
            />
          </div>

          <button
            onClick={handleStatusUpdate}
            disabled={!statusUpdate.status}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
          >
            Update Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
        <h1 className="text-xl font-semibold">Withdrawal Control</h1>
        <div className="text-sm opacity-75 mt-1">
          {withdrawalTransactions.length} withdrawal requests
        </div>
      </div>

      <div className="space-y-4">
        {withdrawalTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No withdrawal requests
          </div>
        ) : (
          withdrawalTransactions.map((transaction) => {
            const statusOption = statusOptions.find(s => s.value === transaction.status);
            
            return (
              <div key={transaction.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold">₱{transaction.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{transaction.referenceNumber}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${statusOption?.color}`}>
                    {statusOption?.label}
                  </div>
                </div>

                {transaction.bankDetails && (
                  <div className="text-sm text-gray-600 mb-3">
                    <div>{transaction.bankDetails.bank} - {transaction.bankDetails.accountNumber}</div>
                    <div>{transaction.bankDetails.accountName}</div>
                  </div>
                )}

                <div className="text-xs text-gray-500 mb-3">
                  {new Date(transaction.timestamp).toLocaleString()}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setSelectedTransaction(transaction.id)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
 