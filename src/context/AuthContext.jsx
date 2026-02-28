import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('cognipath_auth') === 'true';
    });

    const login = () => {
        setIsAuthenticated(true);
        localStorage.setItem('cognipath_auth', 'true');
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('cognipath_auth');
    };

    const value = {
        isAuthenticated,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
