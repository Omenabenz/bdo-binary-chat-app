export  interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  amountInvested: number;
  tradingId: string;
  balance: number;
  profilePhoto?: string;
  darkMode: boolean;
  notifications: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'photo' | 'file' | 'voice';
  timestamp: Date;
  read: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'credit' | 'debit';
  amount: number;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';
  timestamp: Date;
  referenceNumber?: string;
  bankDetails?: {
    bank: string;
    accountNumber: string;
    accountName: string;
  };
  companyMessage?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'balance' | 'profit' | 'withdrawal' | 'message' | 'login';
  timestamp: Date;
  read: boolean;
}
 