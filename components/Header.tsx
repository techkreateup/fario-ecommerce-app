import React, { useState, useEffect, useRef } from 'react';
import * as RouterDOM from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '../constants';
import Logo from './Logo';
import {
  ShoppingBag, User,
  LogOut,
  X,
  ChevronDown,
  Menu, ArrowRight, Edit3, Heart,
  Home as HomeIcon, Info, Mail
} from 'lucide-react';
import { useCart } from '../context/CartProvider';
import { useWishlist } from '../context/WishlistContext';
import { CartDrawer } from './CartDrawer';
import { useTheme } from '../context/ThemeContext';

const { NavLink, useLocation, useNavigate } = RouterDOM as any;

import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const { user, signOut } = useAuth();
  const isLoggedIn = !!user;
  const userProfile = user ? {
    name: user.user_metadata?.name || user.email,
    avatar: user.user_metadata?.avatar_url
  } : null;

  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { theme, toggleTheme } = useTheme();

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const MotionDiv = (motion as any).div;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    console.log('🎯 LOGOUT CLICKED');
    try {
      setIsProfileMenuOpen(false);
      await signOut();
      console.log('👋 LOGOUT SUCCESSFUL');
      if (isAdminPage) {
        navigate('/');
      }
    } catch (err) {
      console.error('🔥 LOGOUT ATTEMPT FAILED:', err);
      alert('Sign out encountered an error. Please refresh the page.');
    }
  };

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'home': return <HomeIcon size={20} />;
      case 'shopping-bag': return <ShoppingBag size={20} />;
      case 'info': return <Info size={20} />;
      case 'mail': return <Mail size={20} />;
      default: return <ArrowRight size={20} />;
    }
  };

  const isAdminPage = location.pathname.startsWith('/admin');
  if (isAdminPage) return null;

  // LIGHT PURPLE THEME
  const headerBg = 'bg-[#f3e8ff]/95 backdrop-blur-xl shadow-sm h-16 lg:h-24 border-b border-purple-200/50';
  const textColor = 'text-gray-950';


  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 border-b flex items-center ${headerBg}`}>
        <div className="container mx-auto px-4 md:px-6 lg:px-10 relative flex justify-between items-center">

          <NavLink to="/" className="flex items-center gap-3 lg:gap-4 relative z-[60] group">
            {/* Mobile logo */}
            <div className="block lg:hidden transition-transform duration-300 group-hover:scale-105">
              <Logo size={56} />
            </div>
            {/* Desktop logo */}
            <div className="hidden lg:block transition-transform duration-300 group-hover:scale-105">
              <Logo size={76} />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="font-black text-[1.7rem] lg:text-[2.6rem] tracking-tight font-heading text-gray-900 uppercase leading-[0.9]">
                FARIO
              </span>
              <span className="text-[7px] lg:text-[9.5px] font-extrabold uppercase tracking-[0.5em] lg:tracking-[0.7em] text-fario-purple mt-1">
                STEP IN, STAND OUT
              </span>
            </div>
          </NavLink>

          {/* CENTER NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2" onMouseLeave={() => setHoveredNav(null)}>
            <div className="flex items-center relative p-1.5 bg-gray-50/50 backdrop-blur-md rounded-full border border-gray-100">
              {NAV_ITEMS.map((item: any) => {
                const isActive = item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

                const isProducts = item.path === '/products';

                return (
                  <div key={item.path} className="relative group" onMouseEnter={() => setHoveredNav(item.path)}>
                    <NavLink
                      to={item.path}
                      className={`
                        relative px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 z-10 block
                        ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'}
                      `}
                    >
                      {isActive && (
                        <MotionDiv
                          layoutId="nav-pill-compact"
                          className="absolute inset-0 bg-fario-purple rounded-full z-[-1] shadow-[0_0_20px_rgba(122,81,160,0.3)]"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                      {hoveredNav === item.path && !isActive && (
                        <MotionDiv
                          layoutId="nav-hover-compact"
                          className="absolute inset-0 rounded-full z-[-1] bg-fario-purple/5"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                        />
                      )}
                      {item.label}
                    </NavLink>

                  </div>
                )
              })}
            </div>
          </nav>

          <div className="flex items-center gap-4 md:gap-5 relative z-[60]">

            {/* USER DROPDOWN */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center gap-3 p-1.5 rounded-full border transition-all duration-300 hover:shadow-lg ${isProfileMenuOpen ? 'bg-fario-purple text-white border-fario-purple' : 'bg-white/50 border-purple-200/50 hover:bg-white/80'}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-colors ${isLoggedIn ? 'bg-fario-purple shadow-inner text-white' : 'bg-white shadow-sm'}`}>
                  {isLoggedIn && userProfile?.avatar ? (
                    <img src={userProfile.avatar} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <User size={18} className={isProfileMenuOpen ? 'text-white' : 'text-purple-400'} />
                  )}
                </div>
                <ChevronDown size={14} strokeWidth={3} className={`mr-2 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180 text-white' : 'text-purple-300'}`} />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <MotionDiv
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-4 w-72 bg-fario-dark border border-white/10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden z-[100] origin-top-right backdrop-blur-3xl"
                  >
                    <div className="p-6 bg-gradient-to-br from-fario-dark to-gray-900 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-fario-purple/20 rounded-full blur-2xl -mr-10 -mt-10" />
                      <h4 className="text-xl font-black font-heading uppercase italic tracking-tighter relative z-10 leading-none">
                        {isLoggedIn ? `Hi, ${userProfile?.name?.split(' ')[0]}` : 'LOG REQUIRED'}
                      </h4>
                      <p className="text-[8px] text-fario-lime uppercase font-black tracking-[0.4em] relative z-10 mt-1.5">
                        {isLoggedIn ? 'Verified Member' : 'Public Node'}
                      </p>
                    </div>

                    <div className="p-3 space-y-1">
                      {!isLoggedIn ? (
                        <button onClick={() => navigate('/login')} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl hover:bg-white/5 group transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-fario-lime group-hover:text-fario-dark transition-all"><User size={16} /></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">Authorize</span>
                          </div>
                          <ArrowRight size={14} className="text-white/20 group-hover:text-fario-lime group-hover:translate-x-1 transition-all" />
                        </button>
                      ) : (
                        <>
                          <button onClick={() => navigate('/profile')} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl hover:bg-white/5 group transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-fario-purple group-hover:text-white transition-all"><Edit3 size={16} /></div>
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">Profile</span>
                            </div>
                            <ArrowRight size={14} className="text-white/20 group-hover:text-fario-purple group-hover:translate-x-1 transition-all" />
                          </button>
                          <div className="h-px bg-white/10 my-2 mx-4" />
                          <button onClick={handleSignOut} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-rose-500/10 group transition-all">
                            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center transition-all group-hover:bg-rose-500 group-hover:text-white"><LogOut size={16} /></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-500">End Session</span>
                          </button>
                        </>
                      )}
                    </div>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>

            {/* WISHLIST ICON */}
            <button
              onClick={() => navigate('/wishlist')}
              className={`relative group p-3 rounded-full transition-all duration-300 hover:scale-105 bg-white/50 border border-purple-200/50 text-purple-600 hover:border-fario-purple hover:text-white shadow-sm hover:shadow-lg hover:bg-fario-purple`}
            >
              <Heart size={22} className="transition-all duration-300 group-hover:fill-fario-purple" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-fario-purple text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(122,81,160,0.5)] border-2 border-[#132c33]">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* CART ICON */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className={`relative group p-3 rounded-full transition-all duration-300 hover:scale-105 bg-white/50 border border-purple-200/50 text-purple-600 hover:border-fario-purple hover:text-white shadow-sm hover:shadow-lg hover:bg-fario-purple`}
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-fario-purple text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(122,81,160,0.5)] border-2 border-[#132c33]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* MOBILE TOGGLE */}
            <button
              className={`lg:hidden p-3 rounded-full transition-all bg-white/50 border border-purple-200/50 text-purple-600 hover:text-white hover:border-fario-purple hover:bg-fario-purple shadow-sm`}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* PREMIUM MOBILE OVERLAY - COLORFUL LIGHT THEME */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0, x: '100%' }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white/70 backdrop-blur-2xl flex flex-col font-sans"
          >
            {/* Global Ambient Glow for Mobile Menu - INSANELY COLORFUL */}
            <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-fario-purple/30 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-fario-lime/40 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-[40%] right-[-20%] w-[300px] h-[300px] bg-pink-400/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Header Area */}
            <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-200/50 relative z-10 bg-white/40 shadow-sm">
              <div className="flex items-center gap-3">
                <Logo size={44} />
                <div className="flex flex-col leading-none">
                  <span className="font-black text-xl tracking-tight font-heading text-fario-dark uppercase leading-[0.9]">FARIO</span>
                  <span className="text-[7px] font-extrabold uppercase tracking-[0.5em] text-fario-purple mt-1">STEP IN, STAND OUT</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-white shadow-lg border border-gray-100 rounded-full hover:bg-gray-50 active:scale-95 transition-all text-fario-dark"
                aria-label="Close menu"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="flex-grow flex flex-col p-6 md:p-10 overflow-y-auto relative z-10">

              {/* Quick Actions Row (Profile, Wishlist, Cart) - HIGH FIDELITY LIME/PURPLE */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                <button onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }} className="flex flex-col items-center justify-center p-4 bg-white/80 rounded-3xl hover:bg-white transition-all border border-purple-100/50 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_50px_rgba(122,81,160,0.15)] group relative overflow-hidden backdrop-blur-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-fario-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-full bg-fario-purple/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-fario-purple transition-all border border-fario-purple/10">
                    <User size={20} className="text-fario-purple group-hover:text-white" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-fario-purple">Profile</span>
                </button>
                <button onClick={() => { navigate('/wishlist'); setIsMobileMenuOpen(false); }} className="flex flex-col items-center justify-center p-4 bg-white/80 rounded-3xl hover:bg-white transition-all border border-rose-100/50 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_50px_rgba(244,63,94,0.15)] group relative overflow-hidden backdrop-blur-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-rose-500 transition-all border border-rose-500/10">
                    <Heart size={20} className="text-rose-500 group-hover:text-white" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-rose-500">Wishlist</span>
                </button>
                <button onClick={() => { setIsCartDrawerOpen(true); setIsMobileMenuOpen(false); }} className="flex flex-col items-center justify-center p-4 bg-white/80 rounded-3xl hover:bg-white transition-all border border-lime-100/50 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_50px_rgba(217,249,157,0.3)] group relative overflow-hidden backdrop-blur-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-fario-lime/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-full bg-fario-lime/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-fario-lime transition-all border border-fario-lime/20 relative">
                    <ShoppingBag size={20} className="text-fario-dark" />
                    {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 text-[8px] flex items-center justify-center font-black bg-rose-500 text-white border-2 border-white rounded-full shadow-lg">{cartCount}</span>}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-fario-dark">Cart</span>
                </button>
              </div>

              {/* Navigation Links - MASSIVE TYPOGRAPHY WITH LUXURY HOVER */}
              <nav className="flex flex-col gap-4 relative">
                {/* Visual connecting line */}
                <div className="absolute left-[28px] md:left-[36px] top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent z-[-1]" />

                {NAV_ITEMS.map((item: any, idx: number) => {
                  const isActive = item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                  return (
                    <MotionDiv
                      key={item.path}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                    >
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          group flex items-center justify-between p-4 rounded-[2rem] border transition-all duration-300 relative overflow-hidden backdrop-blur-sm
                          ${isActive ? 'bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] border-gray-100 ring-4 ring-white/50' : 'bg-transparent border-transparent hover:bg-white/50'}
                        `}
                      >
                        {isActive && (
                          <div className="absolute top-0 right-0 w-32 h-32 bg-fario-lime/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                        )}
                        <div className="flex items-center gap-6 relative z-10">
                          <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${isActive ? 'bg-fario-dark text-white scale-110 shadow-[0_10px_30px_rgba(19,44,51,0.3)]' : 'bg-white text-gray-400 group-hover:text-fario-purple group-hover:scale-105 border border-gray-100/50'}`}>
                            {getIcon(item.icon)}
                          </div>
                          <span className={`text-4xl sm:text-5xl md:text-6xl font-black font-heading uppercase tracking-tighter transition-colors ${isActive ? 'text-fario-dark' : 'text-gray-400 group-hover:text-fario-purple'}`}>
                            {item.label}
                          </span>
                        </div>
                        {isActive && (
                          <MotionDiv layoutId="mobile-nav-indicator" className="relative z-10 bg-gray-50 rounded-full p-2 border border-gray-100">
                            <ArrowRight size={24} strokeWidth={3} className="text-fario-purple" />
                          </MotionDiv>
                        )}
                      </NavLink>
                    </MotionDiv>
                  );
                })}
              </nav>

              {/* Bottom Decoration */}
              <div className="mt-auto pt-16 pb-6 text-center">
                <div className="w-24 h-1.5 bg-gray-200 mx-auto rounded-full" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mt-6">Fario Exclusives</p>
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
      />
    </>
  );
};
export default Header;
