import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const USERS_KEY = 'officeriq_users';
const SESSION_KEY = 'officeriq_session';
const PROFILE_KEY = 'officeriq_profile_';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const sessionRaw = await AsyncStorage.getItem(SESSION_KEY);
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        setUser(session);
        const profileRaw = await AsyncStorage.getItem(PROFILE_KEY + session.email);
        if (profileRaw) setProfile(JSON.parse(profileRaw));
      }
    } catch (e) {
      console.warn('session restore failed', e);
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  };

  const signup = async ({ name, email, password }) => {
    const users = await getUsers();
    const key = email.trim().toLowerCase();
    if (users[key]) {
      throw new Error('An account with this email already exists. Please login instead.');
    }
    users[key] = { name, email: key, password };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    const session = { name, email: key };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    setProfile(null);
    return session;
  };

  const login = async ({ email, password }) => {
    const users = await getUsers();
    const key = email.trim().toLowerCase();
    const found = users[key];
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password.');
    }
    const session = { name: found.name, email: key };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    const profileRaw = await AsyncStorage.getItem(PROFILE_KEY + key);
    setProfile(profileRaw ? JSON.parse(profileRaw) : null);
    return session;
  };

  const saveProfile = async (data) => {
    if (!user) return;
    const merged = { ...(profile || {}), ...data };
    await AsyncStorage.setItem(PROFILE_KEY + user.email, JSON.stringify(merged));
    setProfile(merged);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, signup, logout, saveProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
