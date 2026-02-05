import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token and load user
        const token = localStorage.getItem("token");
        if (token) {
            // Validate token or fetch user profile
            // setUser({ name: "Demo User" }); // Placeholder
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/login", { username: email, password });
            localStorage.setItem("token", res.data.access_token);
            setUser(res.data.user); // Assuming API returns user
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
