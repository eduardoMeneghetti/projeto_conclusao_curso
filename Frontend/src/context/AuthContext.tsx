import React, { useState, createContext, useContext } from 'react';
import { UserDatabase } from '../database/useUserDatabase';

type AuthContextType = {
    user: UserDatabase | null;
    signIn: (user: UserDatabase) => void;
    signOut: () => void;
    isAuthenticated: boolean;  
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<UserDatabase | null>(null);

    const signIn = (user: UserDatabase) => {
        setUser(user);
    };

    const signOut = () => {
        setUser(null); 
    };

    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            signOut,
            isAuthenticated: !!user,  
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);