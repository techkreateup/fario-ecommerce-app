import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type UserRole = 'user' | 'admin';

interface AuthContextType {
    user: User | null;
    session: any | null;
    role: UserRole;
    isAdmin: boolean;
    isLoading: boolean;
    refreshProfile: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [sessionState, setSessionState] = useState<any | null>(null);
    const [role, setRole] = useState<UserRole>('user');
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = async (currentUser: User) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', currentUser.id)
                .single();

            if (data) {
                setRole(data.role as UserRole);
            } else if (error && error.code === 'PGRST116') {
                // Profile doesn't exist yet, standard user
                setRole('user');
            }
        } catch (err) {
            console.error('Error fetching profile role:', err);
        }
    };

    useEffect(() => {
        let isAuthMounted = true;
        console.log('📡 AUTH SYNC STARTING...');

        const initializeAuth = async () => {
            try {
                // 🛡️ Extract session from localStorage directly (getSession() hangs indefinitely)
                let session: any = null;
                try {
                    const storageKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
                    if (storageKey) {
                        const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
                        if (stored?.access_token && stored?.user) {
                            session = stored;
                        }
                    }
                } catch { /* no persisted session */ }

                if (isAuthMounted) {
                    console.log('📥 AUTH SESSION RECEIVED:', session ? 'User Found' : 'No Session');

                    const currentUser = session?.user ?? null;
                    setUser(currentUser);
                    setSessionState(session);

                    if (currentUser) {
                        // OPTIMIZATION: Unblock UI immediately
                        if (isAuthMounted) setIsLoading(false);

                        // Fetch profile in background
                        fetchProfile(currentUser).catch(err => console.error('Profile fetch error:', err));
                    } else {
                        setRole('user');
                        setIsLoading(false);
                    }
                }
            } catch (err) {
                console.error('❌ Auth Init Exception:', err);
                if (isAuthMounted) setIsLoading(false);
            }
        };

        initializeAuth();

        // Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('⚡ AUTH CHANGE EVENT:', event);

            // Handle specific events if needed
            if (event === 'TOKEN_REFRESHED') {
                console.log('🔄 TOKEN REFRESHED');
            }

            if (isAuthMounted) {
                const currentUser = session?.user ?? null;
                setUser(currentUser);
                setSessionState(session);

                if (currentUser) {
                    await fetchProfile(currentUser);
                } else {
                    setUser(null);
                    setSessionState(null);
                    setRole('user');
                }
                setIsLoading(false);
            }
        });

        return () => {
            isAuthMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        session: sessionState,
        role,
        isAdmin: role === 'admin' || user?.email === 'reachkreateup@gmail.com' || user?.email === 'kreateuptech@gmail.com',
        isLoading,
        refreshProfile: async () => {
            if (user) await fetchProfile(user);
        },
        signOut: async () => {
            console.log('🚪 SIGNING OUT...');
            try {
                // 1. Clear state immediately
                setUser(null);
                setRole('user');

                // 2. 🛡️ Force Clear Supabase LocalStorage Tokens
                // This fixes the "Auto Login on Refresh" bug where the SDK fails to clear the token.
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
                        console.log(`🧹 Removing stuck token: ${key}`);
                        localStorage.removeItem(key);
                    }
                });

                // 3. Call SDK SignOut (Best Effort)
                const { error } = await supabase.auth.signOut();
                if (error) throw error;

                console.log('✅ SUPABASE SIGNED OUT');
            } catch (err) {
                console.error('⚠️ SignOut Warning:', err);
                // Even if network fails, we cleared local storage, so user is effectively logged out.
            }
        }
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
