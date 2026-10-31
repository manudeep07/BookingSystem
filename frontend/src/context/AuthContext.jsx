import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, probeRole } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Check auth and probe role on initial load if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const role = await probeRole();
          setUser((prev) => {
            const updated = prev ? { ...prev, role } : { email: 'user@example.com', role };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
          });
        } catch {
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const loginUser = async (email, password, roleHint = null) => {
    const data = await apiLogin(email, password);
    const receivedToken = data.token;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);

    // Determine role: probe /users endpoint or honor roleHint
    let resolvedRole = roleHint;
    try {
      resolvedRole = await probeRole();
    } catch {
      resolvedRole = roleHint || 'CUSTOMER';
    }

    const userData = { email, role: resolvedRole };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const registerUser = async (name, email, password) => {
    return await apiRegister(name, email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    role: user?.role || 'CUSTOMER',
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
    loading,
    loginUser,
    registerUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
