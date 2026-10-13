import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import API, { getCurrentUser, login as loginRequest, logout as logoutRequest, register as registerRequest } from '../services/api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'hireiq_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
    getCurrentUser()
      .then((data) => setUser(data.user))
      .catch(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        delete API.defaults.headers.common.Authorization;
      })
      .finally(() => setLoading(false));
  }, []);

  const establishSession = (data) => {
    sessionStorage.setItem(TOKEN_KEY, data.token);
    API.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    setUser(data.user);
  };

  const login = useCallback(async (credentials) => establishSession(await loginRequest(credentials)), []);
  const register = useCallback(async (credentials) => establishSession(await registerRequest(credentials)), []);
  const logout = useCallback(async () => {
    try { if (user) await logoutRequest(); } finally {
      sessionStorage.removeItem(TOKEN_KEY);
      delete API.defaults.headers.common.Authorization;
      setUser(null);
    }
  }, [user]);

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
