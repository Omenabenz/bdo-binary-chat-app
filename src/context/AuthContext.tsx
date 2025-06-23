import  React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../supabase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (user: User) => void;
  adminLogin: () => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('bdoUser');
    const savedAdmin = localStorage.getItem('bdoAdmin');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      syncUserData(userData);
    }
    
    if (savedAdmin) {
      setIsAdmin(true);
    }
  }, []);

  const syncUserData = async (userData: User) => {
    try {
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.id);
      
      if (users && users.length > 0) {
        const syncedUser = { ...userData, ...users[0] };
        setUser(syncedUser);
        localStorage.setItem('bdoUser', JSON.stringify(syncedUser));
      } else {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error syncing user data:', error);
      setUser(userData);
    }
  };

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('bdoUser', JSON.stringify(user));
  };

  const adminLogin = () => {
    setIsAdmin(true);
    localStorage.setItem('bdoAdmin', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('bdoUser');
    localStorage.removeItem('bdoAdmin');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('bdoUser', JSON.stringify(updatedUser));
      
      try {
        await supabase
          .from('users')
          .upsert(updatedUser)
          .eq('id', user.id);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, adminLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
 