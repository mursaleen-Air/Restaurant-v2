import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await api.get("/users/me");
            setUser(res.data);
        } catch (error) {
            console.error("Failed to load user", error);
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.access_token);
            await loadUser();
            return true;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
