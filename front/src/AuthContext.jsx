import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import crmApi from '../api/crmApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        crmApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        crmApi.get('/auth/me')
            .then(res => {
                if (res.data.ok) setUser(res.data.data);
            })
            .catch(() => {
                localStorage.removeItem('token');
                delete crmApi.defaults.headers.common['Authorization'];
            })
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (email, password) => {
        const res = await crmApi.post('/auth/login', { email, password });
        if (res.data.ok) {
            const { token } = res.data;
            localStorage.setItem('token', token);
            crmApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(res.data.userData);
            return { ok: true };
        }
        return { ok: false, message: res.data.message };
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        delete crmApi.defaults.headers.common['Authorization'];
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de un AuthProvider');
    return ctx;
}
