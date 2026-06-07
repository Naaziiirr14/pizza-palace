import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { firebaseAuth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pp_token'));
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get('/auth/profile');
      setUser(data.user);
    } catch {
      localStorage.removeItem('pp_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });

    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/user-not-found') {
        try {
          await createUserWithEmailAndPassword(firebaseAuth, email, password);
        } catch {
          // ignore if Firebase account creation fails after backend login
        }
      }
    }

    localStorage.setItem('pp_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });

    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/email-already-in-use') {
        try {
          await signInWithEmailAndPassword(firebaseAuth, email, password);
        } catch {
          // ignore: existing Firebase user may have been created earlier
        }
      }
    }

    return data.user;
  };

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
    } catch {
      // ignore sign-out errors
    }
    localStorage.removeItem('pp_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const { data } = await api.put('/auth/profile', profileData);
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};