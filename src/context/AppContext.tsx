import  React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, Transaction, Notification } from '../types';
import { supabase } from '../supabase';

interface AppContextType {
  messages: Message[];
  transactions: Transaction[];
  notifications: Notification[];
  addMessage: (message: Message) => void;
  addTransaction: (transaction: Transaction) => void;
  addNotification: (notification: Notification) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadData();
    
    // Listen for real-time updates
    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, loadMessages)
      .subscribe();

    const transactionsSubscription = supabase
      .channel('transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, loadTransactions)
      .subscribe();

    const notificationsSubscription = supabase
      .channel('notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, loadNotifications)
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
      transactionsSubscription.unsubscribe();
      notificationsSubscription.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    await Promise.all([loadMessages(), loadTransactions(), loadNotifications()]);
  };

  const loadMessages = async () => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });
      if (data) setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .order('timestamp', { ascending: false });
      if (data) setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('timestamp', { ascending: false });
      if (data) setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const addMessage = async (message: Message) => {
    try {
      await supabase.from('messages').insert(message);
      setMessages(prev => [...prev, message]);
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const addTransaction = async (transaction: Transaction) => {
    try {
      await supabase.from('transactions').insert(transaction);
      setTransactions(prev => [transaction, ...prev]);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const addNotification = async (notification: Notification) => {
    try {
      await supabase.from('notifications').insert(notification);
      setNotifications(prev => [notification, ...prev]);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id);
      
      setTransactions(prev => 
        prev.map(t => t.id === id ? { ...t, ...updates } : t)
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      messages, transactions, notifications,
      addMessage, addTransaction, addNotification,
      updateTransaction, markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
 