import  React, { useState, useEffect } from 'react';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const BANKS = [
  'BDO', 'BPI', 'Metrobank', 'Landbank', 'PNB', 'UnionBank', 'RCBC', 'Security Bank',
  'GCash', 'PayMaya', 'Coins.ph', 'GrabPay'
];

export default function Wallet() {
  const { user, updateUser } = useAuth();
  const { transactions, addTransaction, addNotification, addMessage } = useApp();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [withdrawForm, setWithdrawForm] = useState({
    bank: '',
    accountNumber: '',
    accountName: '',
    amount: ''
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const userTransactions = transactions.filter(t => t.userId === user?.id);
  const balance = user?.balance || 0;

  const handleDeposit = async () => {
    if (!depositAmount || !selectedBank || !user) return;

    const message = `Deposit Request: ₱${Number(depositAmount).toLocaleString()} via ${selectedBank}`;
    
    await addMessage({
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: 'admin',
      content: message,
      type: 'text',
      timestamp: new Date(),
      read: false
    });

    setShowDeposit(false);
    setDepositAmount('');
    setSelectedBank('');
    
    alert('Deposit request sent to admin successfully!');
  };

  const handleWithdraw = async () => {
    if (!withdrawForm.amount || !withdrawForm.bank || !withdrawForm.accountNumber || !withdrawForm.accountName || !user) return;

    const amount = Number(withdrawForm.amount);
    if (amount > balance) {
      alert('Insufficient balance');
      return;
    }

    const newBalance = balance - amount;
    const referenceNumber = `WD-${Date.now()}`;
    
    const transaction = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'withdrawal' as const,
      amount,
      status: 'pending' as const,
      timestamp: new Date(),
      referenceNumber,
      bankDetails: withdrawForm
    };

    await addTransaction(transaction);
    await updateUser({ balance: newBalance });

    await addNotification({
      id: Date.now().toString(),
      userId: user.id,
      title: 'Withdrawal Pending',
      message: `Your withdrawal of ₱${amount.toLocaleString()} is being processed. Reference: ${referenceNumber}`,
      type: 'withdrawal',
      timestamp: new Date(),
      read: false
    });

    setReceiptData({
      ...transaction,
      bankName: withdrawForm.bank,
      accountNumber: withdrawForm.accountNumber,
      accountName: withdrawForm.accountName,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    });

    setShowReceipt(true);
    setShowWithdraw(false);
    setWithdrawForm({ bank: '', accountNumber: '', accountName: '', amount: '' });
  };

  const downloadReceipt = () => {
    if (!receiptData) return;
    
    const receiptContent = `
BDO BINARY TRADING
WITHDRAWAL RECEIPT

Reference Number: ${receiptData.referenceNumber}
Date: ${receiptData.date}
Time: ${receiptData.time}

Amount: ₱${receiptData.amount.toLocaleString()}
Bank: ${receiptData.bankName}
Account Number: ${receiptData.accountNumber}
Account Name: ${receiptData.accountName}

Status: PENDING

Thank you for using BDO Binary Trading.
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-${receiptData.referenceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (showReceipt && receiptData) {
    return (
      <div className={`min-h-screen ${user?.darkMode ? 'bg-gray-900 text-white' : 'bg-white'} p-4 pb-20`}>
        <div className="bg-blue-600 text-white p-6 rounded-lg text-center mb-6">
          <h1 className="text-2xl font-bold">Withdrawal Receipt</h1>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-blue-600">BDO BINARY TRADING</h2>
            <p className="text-sm text-gray-600">WITHDRAWAL RECEIPT</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Reference Number:</span>
              <span className="font-bold">{receiptData.referenceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{receiptData.date}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{receiptData.time}</span>
            </div>
            <hr />
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-bold text-lg">₱{receiptData.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Bank:</span>
              <span>{receiptData.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span>Account Number:</span>
              <span>{receiptData.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Account Name:</span>
              <span>{receiptData.accountName}</span>
            </div>
            <hr />
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">
                PENDING
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={downloadReceipt}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
          >
            Download Receipt
          </button>
          <button
            onClick={() => setShowReceipt(false)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Back to Wallet
          </button>
        </div>
      </div>
    );
  }

  if (showDeposit) {
    return (
      <div className={`min-h-screen ${user?.darkMode ? 'bg-gray-900 text-white' : 'bg-white'} p-4 pb-20`}>
        <div className="flex items-center mb-6">
          <ArrowLeft size={24} onClick={() => setShowDeposit(false)} className="cursor-pointer" />
          <h1 className="text-xl font-semibold ml-4">Deposit Funds</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Amount (₱)</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className={`w-full p-3 border rounded-lg ${user?.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Bank/Wallet</label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className={`w-full p-3 border rounded-lg ${user?.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
            >
              <option value="">Choose bank/wallet</option>
              {BANKS.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDeposit}
            disabled={!depositAmount || !selectedBank}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
          >
            Send Deposit Request
          </button>
        </div>
      </div>
    );
  }

  if (showWithdraw) {
    return (
      <div className={`min-h-screen ${user?.darkMode ? 'bg-gray-900 text-white' : 'bg-white'} p-4 pb-20`}>
        <div className="flex items-center mb-6">
          <ArrowLeft size={24} onClick={() => setShowWithdraw(false)} className="cursor-pointer" />
          <h1 className="text-xl font-semibold ml-4">Withdraw Funds</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Available Balance: <span className="font-bold">₱{balance.toLocaleString()}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bank/Wallet</label>
            <select
              value={withdrawForm.bank}
              onChange={(e) => setWithdrawForm({...withdrawForm, bank: e.target.value})}
              className={`w-full p-3 border rounded-lg ${user?.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
            >
              <option value="">Choose bank/wallet</option>
              {BANKS.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Account Number</label>
            <input
              type="text"
              value={withdrawForm.accountNumber}
              onChange={(e) => setWithdrawForm({...withdrawForm, accountNumber: e.target.value})}
              className={`w-full p-3 border rounded-lg ${user?.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
              placeholder="Enter account number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Account Name</label>
            <input
              type="text"
              value={withdrawForm.accountName}
              onChange={(e) => setWithdrawForm({...withdrawForm, accountName: e.target.value})}
              className={`w-full p-3 border rounded-lg ${user?.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
              placeholder="Enter account name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Withdrawal Amount (₱)</label>
            <input
              type="number"
              value={withdrawForm.amount}
              onChange={(e) => setWithdrawForm({...withdrawForm, amount: e.target.value})}
              className={`w-full p-3 border rounded-lg ${user?.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
              placeholder="Enter amount"
              max={balance}
            />
          </div>

          <button
            onClick={handleWithdraw}
            disabled={!withdrawForm.bank || !withdrawForm.accountNumber || !withdrawForm.accountName || !withdrawForm.amount}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
          >
            Withdraw
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${user?.darkMode ? 'bg-gray-900 text-white' : 'bg-white'} p-4 pb-20`}>
      <div className="bg-blue-600 text-white p-6 rounded-lg text-center mb-6">
        <h1 className="text-2xl font-bold">₱{balance.toLocaleString()}</h1>
        <p className="text-sm opacity-75">Total Balance</p>
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setShowDeposit(true)}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>Deposit</span>
        </button>
        <button
          onClick={() => setShowWithdraw(true)}
          className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
        >
          <Minus size={20} />
          <span>Withdraw</span>
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        {userTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No transactions yet
          </div>
        ) : (
          <div className="space-y-3">
            {userTransactions.map((transaction) => (
              <div key={transaction.id} className={`p-4 rounded-lg border ${
                user?.darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium capitalize">
                      {transaction.type === 'credit' ? 'Credited' : 
                       transaction.type === 'debit' ? 'Debited' : 
                       transaction.type}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </div>
                    {transaction.referenceNumber && (
                      <div className="text-xs text-gray-400">
                        Ref: {transaction.referenceNumber}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
 