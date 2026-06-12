import React, { createContext, useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

type AuthData = {
  token: string;
};

type AuthContextType = {
  auth: AuthData | null;
  loginAuth: (token: string) => void;
  logoutAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "auth";

const readStoredAuth = (): AuthData | null => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    const token = parsed?.token;
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return { token };
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return true;

    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(
      atob(
        normalized.padEnd(normalized.length + (4 - (normalized.length % 4)) % 4, "=")
      )
    );
    if (!decoded?.exp) return true;

    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthData | null>(() => {
        const stored = readStoredAuth();
        // Si el token guardado ya expiró, no lo cargues
        if (stored && isTokenExpired(stored.token)) {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            return null;
        }
        return stored;
    });

   const logoutAuth = useCallback((): void => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuth(null);
    }, []);

    const loginAuth = useCallback((token: string): void => {
        if (!token || isTokenExpired(token)) {
            logoutAuth();
            return;
        }
        const session: AuthData = { token };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        setAuth(session);
    }, [logoutAuth]);

    useEffect(() => {
        const handleAuthLogout = () => logoutAuth();
        window.addEventListener('auth:logout', handleAuthLogout);
        return () => window.removeEventListener('auth:logout', handleAuthLogout);
    }, [logoutAuth]);

  const data = { auth, loginAuth, logoutAuth };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
export {AuthProvider};
export default AuthContext;

export const useAuth = (): AuthContextType => {
    const ctx = React.useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
