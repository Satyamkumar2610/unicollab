import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const userData = await api.get('/auth/me');
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          sessionStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    console.log('🔵 Login attempt:', email);
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response;

    console.log('✅ Login successful:', user);
    sessionStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);

    return response;
  };

  const register = async (userData) => {
    console.log('🔵 Register attempt:', userData.email);
    const response = await api.post('/auth/register', userData);
    const { token, user } = response;

    console.log('✅ Registration successful:', user);
    sessionStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);

    return response;
  };

  const logout = () => {
    console.log('🔵 Logout');
    sessionStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
