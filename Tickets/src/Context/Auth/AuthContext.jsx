import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'auth';

const readStoredAuth = () => {
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

const isTokenExpired = (token) => {
    try {
        const payloadPart = token.split('.')[1];
        if (!payloadPart) return true;

        const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=')));
        if (!decoded?.exp) return true;

        return Date.now() >= decoded.exp * 1000;
    } catch {
        return true;
    }
};

const AuthProvider = ({children}) => {
    
    const [auth, setAuth] = useState(() => {
        return readStoredAuth();
    });

    useEffect(() => {
        if (!readStoredAuth()) {
            localStorage.removeItem('auth');
            setAuth(null);
        }
    },[])

    useEffect(() => {
        const handleAuthLogout = () => {
            logoutAuth();
        };

        window.addEventListener('auth:logout', handleAuthLogout);
        return () => window.removeEventListener('auth:logout', handleAuthLogout);
    }, []);

    const loginAuth = (token) => {
        if (!token || isTokenExpired(token)) {
            logoutAuth();
            return;
        }

        const session = { token };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        setAuth(session);
    }

    const logoutAuth = () => {
        localStorage.removeItem('auth');
        setAuth(null);
    }

    const data = { auth, setAuth, loginAuth, logoutAuth };

    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}

export {AuthProvider};
export default AuthContext;