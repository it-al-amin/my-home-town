import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { Me } from '../types/cms';

interface AuthContextType {
  me: Me | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  can: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Session state for the CMS. Identity is owned by the shared identity database; this only mirrors
 *  the logged-in user's name, roles and Netrokona permissions returned by the API (UI hints only:
 *  the server re-checks every permission on every request). */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api<Me>('/api/auth/me')
      .then((m) => { if (alive) setMe(m); })
      .catch((e) => { if (!(e instanceof ApiError) || e.status !== 401) console.warn('auth check failed', e); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setMe(await api<Me>('/api/auth/login', { json: { email, password } }));
  }, []);

  const logout = useCallback(async () => {
    try { await api('/api/auth/logout', { method: 'POST' }); } finally { setMe(null); }
  }, []);

  const can = useCallback((p: string) => !!me?.permissions.includes(p), [me]);

  return <AuthContext.Provider value={{ me, loading, login, logout, can }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
