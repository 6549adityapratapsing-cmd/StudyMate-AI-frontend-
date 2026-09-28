import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('studymate_token'));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check and restore session on page load
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem('studymate_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await authAPI.getProfile();
        if (res.success && res.data?.user) {
          setUser(res.data.user);
          setToken(storedToken);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await authAPI.login({ email, password });
      if (res.success && res.data) {
        const { user: loggedInUser, token: receivedToken } = res.data;
        localStorage.setItem('studymate_token', receivedToken);
        setToken(receivedToken);
        setUser(loggedInUser);
        return { success: true, user: loggedInUser };
      }
    } catch (err) {
      const msg = err.data?.message || err.message || 'Login failed';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const register = async ({ email, password, fullName, collegeCourse }) => {
    setAuthError(null);
    try {
      const res = await authAPI.register({ email, password, fullName, collegeCourse });
      if (res.success && res.data) {
        const { user: newUser, token: receivedToken } = res.data;
        localStorage.setItem('studymate_token', receivedToken);
        setToken(receivedToken);
        setUser(newUser);
        return { success: true, user: newUser };
      }
    } catch (err) {
      const msg = err.data?.message || err.message || 'Registration failed';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('studymate_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    loading,
    authError,
    setAuthError,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
