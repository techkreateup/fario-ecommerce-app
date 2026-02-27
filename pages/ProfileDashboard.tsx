import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';

// --- COMPONENT IMPORTS ---
import { ProfileSidebar } from '../components/profile/ProfileSidebar';
import { WelcomeHero } from '../components/profile/WelcomeHero';
import { ProfileRecommendations } from '../components/profile/ProfileRecommendations';
import { ProfileOrders } from '../components/profile/ProfileOrders';
import { ProfileAddresses } from '../components/profile/ProfileAddresses';
import { ProfileVault } from '../components/profile/ProfileVault';
import { ProfileWalletCards } from '../components/profile/ProfileWalletCards';
import { ProfileSettings } from '../components/profile/ProfileSettings';
import { ProfileHelp } from '../components/profile/ProfileHelp';
import { DashboardRecentOrders } from '../components/profile/DashboardRecentOrders';
import { DashboardBuyAgain } from '../components/profile/DashboardBuyAgain';


import { useAuth } from '../context/AuthContext';


const ProfileDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { cartCount } = useCart();
    const { user, isLoading, signOut, refreshProfile } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'vault' | 'addresses' | 'payments' | 'settings' | 'help'>('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Strict RLS & Session Check
    useEffect(() => {
        const checkSession = async () => {
            if (isLoading) return;
            if (!user) {
                navigate('/login');
                return;
            }

            // Verify session validity with Supabase
            const { supabase } = await import('../lib/supabase');
            const { data: { user: currentUser }, error } = await supabase.auth.getUser();

            if (error || !currentUser || currentUser.id !== user.id) {
                console.warn("Session invalid or mismatch, redirecting...");
                await signOut();
                navigate('/login');
            }
        };

        checkSession();

        // Real-time Profile Sync (Interval)
        const syncInterval = setInterval(async () => {
            if (!user) return;
            const { supabase } = await import('../lib/supabase');
            const { data } = await supabase
                .from('profiles')
                .select('addresses, wallet_balance, phone, email')
                .eq('id', user.id)
                .single();

            if (data) {
                // 🔄 SYNC: Profile updated in background
                // Force AuthContext refresh or local update if needed
                // For now we just log, but in a real app we'd dispatch to context
                // But the user asked specifically for "sync addresses".
                // We'll rely on ProfileAddresses component refetching or context refresh
                // Let's trigger context refresh if it exists
                // The context ref is handled via useAuth() hook
                // We can call refreshProfile() from useAuth if exposed
                // useAuth DOES expose refreshProfile!
                await refreshProfile();
                // But refreshProfile is not destructured in the component yet.
            }
        }, 3000);

        return () => clearInterval(syncInterval);
    }, [user, isLoading, navigate, signOut]);

    if (isLoading) return null;

    const renderOverview = () => (
        <div className="space-y-6 animate-in fade-in duration-500 ease-out">
            <WelcomeHero
                isAuthenticated={!!user}
                userName={user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                activeOrdersCount={0}
                cartCount={cartCount}
                setActiveTab={(tab: any) => setActiveTab(tab)}
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <DashboardRecentOrders setActiveTab={(tab: any) => setActiveTab(tab)} />
                <DashboardBuyAgain />
            </div>

            <ProfileRecommendations />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F7F9FC] font-sans flex flex-col selection:bg-gray-900 selection:text-white">

            {/* --- LAYOUT --- */}
            <div className="max-w-[1400px] mx-auto w-full p-4 md:p-6 pt-24 lg:pt-28 flex flex-col lg:flex-row gap-6 lg:gap-8 relative flex-1">

                {/* Mobile Sidebar Trigger & Header (Visible only on mobile) */}
                <div className="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-lg font-black text-gray-900 tracking-tight">My Account</h1>
                    </div>
                </div>

                {/* Sidebar */}
                <ProfileSidebar
                    activeTab={activeTab}
                    setActiveTab={(tab: any) => setActiveTab(tab)}
                    isAuthenticated={!!user}
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />

                {/* Main Content */}
                <main className="flex-1 min-h-[800px] w-full max-w-[1250px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {user && activeTab === 'overview' && renderOverview()}
                            {user && activeTab === 'orders' && <ProfileOrders />}
                            {user && activeTab === 'addresses' && <ProfileAddresses />}
                            {user && activeTab === 'vault' && <ProfileVault />}
                            {user && activeTab === 'payments' && <ProfileWalletCards />}
                            {user && activeTab === 'settings' && <ProfileSettings />}
                            {user && activeTab === 'help' && <ProfileHelp />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>


        </div>
    );
};

export default ProfileDashboard;
