import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import api from '../utils/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock registered users for demonstration
const mockUsers: User[] = [
  { id: '1', email: 'student@college.edu', name: 'John Doe' },
  { id: '2', email: 'admin@college.edu', name: 'Admin User' }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('cmis_user');
      const token = localStorage.getItem('cmis_token');
      if (savedUser && token) return JSON.parse(savedUser);
    } catch (e) {
      // ignore parse errors
    }
    return null;
  });
  const [error, setError] = useState<string | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    // Load registered users from localStorage
    const savedUsers = localStorage.getItem('cmis_registered_users');
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (!res || !res.success) {
        setError(res?.message || 'Invalid credentials');
        return false;
      }
  const access = res.data.accessToken || res.data.token;
  const refresh = res.data.refreshToken;
  localStorage.setItem('cmis_token', access);
  if (refresh) localStorage.setItem('cmis_refresh', refresh);
  // save via api util too
  const apiMod = await import('../utils/api');
  apiMod.default.saveTokens(access, refresh);

      // Fetch profile
      try {
        const profile = await (await (await import('../utils/api')).default.get('/api/auth/me'));
        if (profile && profile.success) {
          const u = profile.data;
          const loggedInUser: User = { id: u._id || u.id || '', email: u.email, name: u.name || u.email.split('@')[0] };
          // Attach role for UI checks
          (loggedInUser as any).role = u.role;
          setUser(loggedInUser);
          localStorage.setItem('cmis_user', JSON.stringify(loggedInUser));
        }
      } catch (err) {
        const loggedInUser: User = { id: '', email, name: email.split('@')[0] };
        setUser(loggedInUser);
        localStorage.setItem('cmis_user', JSON.stringify(loggedInUser));
      }
      return true;
    } catch (err: any) {
      setError(err?.message || 'Login failed');
      return false;
    }
  };

  const register = async (email: string, password: string, confirmPassword: string): Promise<boolean> => {
    setError(null);
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      const res = await api.post('/api/auth/register', { email, password });
      if (!res || !res.success) {
        setError(res?.message || 'Registration failed');
        return false;
      }
      return true;
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cmis_user');
    // notify backend
    (async () => {
      try {
        const apiMod = await import('../utils/api');
        await apiMod.default.post('/api/auth/logout', {});
        apiMod.default.clearAllTokens && apiMod.default.clearAllTokens();
      } catch (e) {
        // ignore
      }
    })();
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        error,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};