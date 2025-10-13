import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    role: 'admin' | 'user' | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<'admin' | 'user' | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                setIsAuthenticated(true);

                // Get user role from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setRole(userData.role || 'user');
                    } else {
                        setRole('user');
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setRole('user');
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            setLoading(false);
            return false;
        }
    };

    const logout = async () => {
        await signOut(auth);
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
    };

    const value: AuthContextType = {
        isAuthenticated,
        user,
        role,
        login,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};