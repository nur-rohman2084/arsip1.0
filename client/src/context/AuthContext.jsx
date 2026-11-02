import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('aa_token') || null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [avatar, setAvatar] = useState({ c: 0, h: null, a: 0, skin: 'sawo' });
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    async function initAuth() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
          setRole(res.user.role);

          if (res.user.role === 'siswa' && res.profile) {
            setStudentProfile(res.profile);
            if (res.profile.avatar) {
              setAvatar(res.profile.avatar);
            }
          } else if (res.user.role === 'guru' && res.profile) {
            setTeacherProfile(res.profile);
          }
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    if (res.success && res.token) {
      localStorage.setItem('aa_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setRole(res.user.role);

      if (res.user.role === 'siswa') {
        setStudentProfile(res.student);
        if (res.student && res.student.avatar) {
          setAvatar(res.student.avatar);
        }
      } else if (res.user.role === 'guru') {
        setTeacherProfile(res.teacher);
      }
      return res;
    }
    throw new Error(res.message || 'Login gagal.');
  };

  const logout = () => {
    localStorage.removeItem('aa_token');
    setToken(null);
    setUser(null);
    setRole(null);
    setStudentProfile(null);
    setTeacherProfile(null);
  };

  const updateAvatarState = async (newAvatar) => {
    setAvatar(newAvatar);
    if (token && role === 'siswa') {
      try {
        await api.saveAvatar(newAvatar);
      } catch (err) {
        console.error('Failed to sync avatar to backend:', err);
      }
    }
  };

  const refreshStudentProfile = async () => {
    if (token && role === 'siswa') {
      try {
        const res = await api.getStudentDashboard();
        if (res.success && res.data) {
          setStudentProfile(res.data);
          if (res.data.avatar) {
            setAvatar(res.data.avatar);
          }
        }
      } catch (err) {
        console.error('Failed to refresh student profile:', err);
      }
    }
  };

  const value = {
    user,
    role,
    token,
    studentProfile,
    teacherProfile,
    avatar,
    loading,
    login,
    logout,
    updateAvatar: updateAvatarState,
    refreshStudentProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
