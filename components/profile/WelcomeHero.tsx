import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeHeroProps {
    isAuthenticated: boolean;
    userName: string;
    activeOrdersCount: number;
    cartCount: number;
    setActiveTab: (tab: any) => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
    activeOrdersCount,
    cartCount,
    setActiveTab,
    userName = "Akash" // Default to Akash if not provided, avoiding "Guest"
}) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 relative z-10"
        >
            {/* Left: Text */}
            <div className="flex-1">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2 flex items-center gap-2">
                    Welcome back, {userName}! <span className="text-2xl animate-wave origin-bottom-right inline-block">👋</span>
                </h2>
                <p className="text-sm text-gray-600 font-medium">
                    You have <strong className="text-gray-900 cursor-pointer hover:underline decoration-fario-purple/30" onClick={() => setActiveTab('orders')}>{activeOrdersCount} active orders</strong> and <strong className="text-gray-900 cursor-pointer hover:underline decoration-fario-teal/30" onClick={() => navigate('/orders')}>{cartCount} items</strong> in your cart.
                </p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 w-full xl:w-auto">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setActiveTab('orders');
                        setTimeout(() => {
                            document.getElementById('orders-section')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    }}
                    className="flex-1 xl:flex-none h-10 px-5 bg-gray-900 text-white rounded-lg font-bold text-xs tracking-wide hover:bg-black transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                    Track Orders <ChevronRight size={14} className="text-gray-400" />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/products')}
                    className="flex-1 xl:flex-none h-10 px-5 bg-white border border-gray-300 text-gray-900 rounded-lg font-bold text-xs tracking-wide hover:bg-gray-50 transition-colors active:bg-gray-100"
                >
                    Continue Shopping
                </motion.button>
            </div>
        </motion.div>
    );
};
