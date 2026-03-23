
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, ShoppingBag, Heart, User, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartProvider';
import { useWishlist } from '../context/WishlistContext';

const MobileBottomNav: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartCount } = useCart();
    const { wishlistItems } = useWishlist();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const isAdmin = location.pathname.startsWith('/admin');
    const isCheckout = location.pathname === '/checkout';
    const isLogin = location.pathname === '/login';

    // Auto-hide on scroll — ALL hooks MUST be above any conditional return
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Hide on certain pages — conditional return AFTER all hooks
    if (isAdmin || isCheckout || isLogin) return null;

    const navItems = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Search', path: '/products', icon: Search },
        { label: 'Cart', path: '/cart', icon: ShoppingBag, badge: cartCount },
        { label: 'Wishlist', path: '/wishlist', icon: Heart, badge: wishlistItems.length },
        { label: 'Profile', path: '/profile', icon: User },
    ];

    const MotionNav = (motion as any).nav;

    return (
        <AnimatePresence>
            {isVisible && (
                <MotionNav
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] md:hidden px-4 pb-6 pt-2"
                >
                    <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.1)] rounded-[2rem] flex items-center justify-around p-2 py-3 relative overflow-hidden">
                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                        {/* WhatsApp-style Back Button — left side, only when not on home */}
                        {location.pathname !== '/' ? (
                            <button
                                onClick={() => navigate(-1)}
                                className="relative group p-3 flex flex-col items-center gap-1 transition-all text-gray-400 hover:text-fario-purple active:scale-90"
                                aria-label="Go back"
                            >
                                <ChevronLeft size={26} strokeWidth={2.5} className="transition-all duration-200 group-active:scale-90" />
                            </button>
                        ) : (
                            <div className="p-3 w-[52px]" />
                        )}

                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="relative group p-3 flex flex-col items-center gap-1 transition-all"
                                >
                                    <div className={`relative ${isActive ? 'text-fario-purple' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                        <Icon
                                            size={24}
                                            strokeWidth={isActive ? 2.5 : 2}
                                            className={`transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(124,58,237,0.3)]' : 'scale-100'}`}
                                        />

                                        {/* Badge */}
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm animate-in zoom-in duration-300">
                                                {item.badge}
                                            </span>
                                        )}

                                        {/* Active Glow Indicator */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-glow"
                                                className="absolute inset-0 bg-fario-purple/20 blur-xl rounded-full"
                                                initial={false}
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </div>

                                    {/* Dot Indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-dot"
                                            className="w-1.5 h-1.5 bg-fario-purple rounded-full"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </MotionNav>
            )}
        </AnimatePresence>
    );
};

export default MobileBottomNav;
