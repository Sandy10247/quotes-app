import React, { createContext, useState, useContext, useEffect } from 'react';
import * as util from './util';

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);


    const login = (newToken: string) => {
        // set Auth Context variable
        setToken(newToken);

        // set local storage
        util.setAuthToken(newToken);
    };

    const logout = () => {
        // remove Context variable
        setToken(null);

        // set local storage
        util.setAuthToken(null);
    }

    // check local storage for token on initial load
    React.useEffect(() => {

        // use util function to get token from local storage
        const storeToken = util.getAuthToken()
        if (storeToken) {
            setToken(storeToken);
            // navigate to "Add-Quote" since the user is logged in
        } else {
            setToken("EMPTY");
        }

        console.log("Auth Context load :- ", token)
    }, []);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};