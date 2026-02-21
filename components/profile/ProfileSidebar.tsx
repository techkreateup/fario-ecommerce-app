import React from 'react';
import {
    LayoutGrid, Package, Heart, MapPin,
    CreditCard, Settings, HelpCircle,
    ChevronRight, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
    isAuthenticated: boolean;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

// AMAZON/FLIPKART STYLE: Dense, Text-based, High Utility
const MENU_ITEMS = [
    { id: 'overview', label: 'Dashboard', icon: LayoutGrid },
    { id: 'orders', label: 'Your Orders', icon: Package },
    { id: 'vault', label: 'The Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payments', label: 'Wallet & Cards', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
];

export const ProfileSidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    isAuthenticated,
    isMobileMenuOpen,
    setIsMobileMenuOpen
}) => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    return (
        <aside className={`
            fixed md:sticky md:top-24 inset-y-0 left-0 z-30 
            w-[280px] bg-white border-r md:border border-gray-200 
            md:rounded-lg md:shadow-sm h-fit
            transition-transform duration-300 md:transform-none 
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* User Short Profile (Flipkart Style) */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 relative">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.user_metadata?.name || user?.email || 'User'}&background=6366f1&color=fff`}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium">Hello,</p>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                        {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                    </h3>
                </div>
            </div>

            {/* Navigation List - High Density, No Pills */}
            <div className="py-2 flex flex-col gap-0.5">
                {MENU_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                            className={`
                                w-full flex items-center gap-4 px-6 py-3.5 
                                text-sm font-medium relative group
                                ${isActive ? 'text-fario-purple font-bold' : 'text-gray-600 hover:text-gray-900'}
                            `}
                        >
                            {/* Sliding Background */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabBackground"
                                    className="absolute inset-0 bg-fario-purple/5 border-l-4 border-fario-purple"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            {/* Start Icon (Subtle) */}
                            <item.icon
                                size={18}
                                className={`relative z-10 transition-colors ${isActive ? 'text-fario-purple' : 'text-gray-400 group-hover:text-gray-600'}`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />

                            <span className="flex-1 text-left relative z-10">{item.label}</span>

                            {/* End Chevron (Amazon Style) */}
                            {isActive && (
                                <motion.div layoutId="activeChevron" className="relative z-10">
                                    <ChevronRight size={14} className="text-fario-purple" />
                                </motion.div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Wallet Balance - Clean, Trustworthy */}
            <div className="p-4 border-t border-gray-100 mt-2">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={() => setActiveTab('payments')}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-fario-purple/10 p-1.5 rounded-md">
                            <CreditCard size={14} className="text-fario-purple" />
                        </div>
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Fario Pay Balance</span>
                    </div>
                    <p className="text-xl font-black text-gray-900 tracking-tight">Rs. 0.00</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-1 group-hover:text-fario-purple transition-colors">Tap to manage wallet</p>
                </div>
            </div>

            {/* Logout Link */}
            <div className="p-2">
                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-4 px-6 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};
