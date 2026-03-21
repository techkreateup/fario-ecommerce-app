import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
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
    const lastTokenRef = useRef<string | null>(null);

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
                    // 🛡️ 1. First check if a MOCK testing session exists
                    const mockTokenStr = localStorage.getItem('sb-mock-auth-token');
                    if (mockTokenStr) {
                        const mockStored = JSON.parse(mockTokenStr);
                        if (mockStored?.access_token && mockStored?.user) {
                            console.log('🧪 MOCK SESSION DETECTED. Proceeding with testing bypass.');
                            session = mockStored;
                        }
                    }

                    // 🛡️ 2. If no mock session, extract real session from localStorage directly
                    if (!session) {
                        const storageKey = Object.keys(localStorage).find(k =>
                            k.startsWith('sb-') &&
                            k.endsWith('-auth-token') &&
                            k !== 'sb-mock-auth-token'
                        );
                        if (storageKey) {
                            const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
                            if (stored?.access_token && stored?.user && stored.access_token.includes('.')) {
                                // 🛡️ Check if token is actually valid/expired
                                const expiresAt = stored.expires_at;
                                const now = Math.floor(Date.now() / 1000);

                                if (expiresAt && expiresAt > now + 60) { // Relax to 60s buffer
                                    session = stored;
                                } else {
                                    console.log(`⏳ Token near expiry or stale (expires in ${expiresAt ? expiresAt - now : 'unknown'}s), waiting for SDK refresh...`);
                                }
                            }
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
            if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                const newToken = session?.access_token || null;
                if (newToken === lastTokenRef.current && event === 'TOKEN_REFRESHED') {
                    // Skip redundant state update if token is identical
                    return;
                }
                lastTokenRef.current = newToken;
            }

            console.log('⚡ AUTH CHANGE EVENT:', event);

            if (isAuthMounted) {
                const currentUser = session?.user ?? null;
                setUser(currentUser);
                setSessionState(session);

                if (currentUser) {
                    fetchProfile(currentUser).catch(err => console.error('Profile fetch error:', err));
                } else {
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

    const value = useMemo(() => ({
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
                setUser(null);
                setSessionState(null);
                setRole('user');
                lastTokenRef.current = null;

                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
                        localStorage.removeItem(key);
                    }
                });

                await supabase.auth.signOut();
            } catch (err) {
                console.error('⚠️ SignOut Warning:', err);
            }
        }
    }), [user, sessionState, role, isLoading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
