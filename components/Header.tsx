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
      <header className={`fixed top-0 left-0 right-0 z-[1000] border-b flex items-center ${headerBg}`}>
        <div className="container mx-auto px-4 md:px-6 lg:px-10 relative flex justify-between items-center">

          <NavLink to="/" className="flex-1 flex items-center gap-3 lg:gap-4 relative z-[60] group">
            {/* Mobile logo */}
            <div className="block lg:hidden transition-transform duration-300 group-hover:scale-105">
              <Logo size={56} />
            </div>
            {/* Desktop logo */}
            <div className="hidden lg:block transition-transform duration-300 group-hover:scale-105">
              <Logo size={76} />
            </div>
            <div className="flex flex-col justify-center leading-none items-start">
              <span className="font-black text-[1.7rem] lg:text-[2.6rem] tracking-tight font-heading text-gray-900 uppercase leading-[0.9]">
                FARIO
              </span>
              <span className="text-[7px] lg:text-[9.5px] font-extrabold uppercase tracking-[0.5em] lg:tracking-[0.7em] text-fario-purple mt-1 w-full text-center lg:text-left">
                STEP IN, STAND OUT
              </span>
            </div>
          </NavLink>

          {/* CENTER NAVIGATION - Use flex-0 to keep it centered between two flex-1 containers */}
          <nav className="hidden lg:flex items-center justify-center" onMouseLeave={() => setHoveredNav(null)}>
            <div className="flex items-center relative p-1.5 bg-gray-50/50 backdrop-blur-md rounded-full border border-gray-100">
              {NAV_ITEMS.map((item: any) => {
                const isActive = item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

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

          <div className="flex-1 flex items-center justify-end gap-4 md:gap-5 relative z-[60]">

            {/* USER DROPDOWN (Hidden on smallest screens to reduce congestion) */}
            <div className="relative hidden sm:block" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center gap-3 p-1.5 rounded-full border transition-all duration-300 hover:shadow-lg ${isProfileMenuOpen ? 'bg-fario-purple text-white border-fario-purple' : 'bg-white/50 border-purple-200/50 hover:bg-white/80'}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-colors ${isLoggedIn ? 'bg-fario-purple shadow-inner text-white' : 'bg-white shadow-sm'}`}>
                  {isLoggedIn && userProfile?.avatar?.trim() ? (
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

            {/* WISHLIST ICON (Hidden on smallest screens) */}
            <button
              onClick={() => navigate('/wishlist')}
              className={`relative group p-3 rounded-full transition-all duration-300 hover:scale-105 bg-white/50 border border-purple-200/50 text-purple-600 hover:border-fario-purple hover:text-white shadow-sm hover:shadow-lg hover:bg-fario-purple hidden sm:block`}
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

      {/* MOBILE DRAWER - LEFT ALIGNED, WHITE & PURPLE THEME */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[90] bg-fario-dark/40 backdrop-blur-sm"
            />

            {/* Left Drawer */}
            <MotionDiv
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[75vw] max-w-[300px] z-[100] bg-white shadow-2xl flex flex-col font-sans border-r border-purple-100"
            >
              {/* Header Area */}
              <div className="flex justify-between items-center p-5 border-b border-purple-100 bg-white">
                <div className="flex items-center gap-3">
                  <Logo size={36} />
                  <div className="flex flex-col leading-none">
                    <span className="font-black text-lg tracking-tight font-heading text-fario-purple uppercase leading-[0.9]">FARIO</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-fario-purple hover:bg-purple-50 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto px-5 py-6">
                {/* Navigation Links */}
                <nav className="flex flex-col gap-2 mb-8">
                  {NAV_ITEMS.map((item: any, idx: number) => {
                    const isActive = item.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.path);

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-fario-purple text-white shadow-md' : 'text-gray-700 hover:bg-purple-50 hover:text-fario-purple'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20 text-white' : 'bg-purple-100 text-fario-purple'}`}>
                          {getIcon(item.icon)}
                        </div>
                        <span className="font-black uppercase tracking-wider text-sm">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>

                <hr className="border-purple-100 mb-6" />

                {/* Quick Actions */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-fario-purple mb-2 px-1">Account</span>

                  <button onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-fario-purple transition-colors">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-fario-purple flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <span className="font-bold uppercase text-xs tracking-wider">Profile</span>
                  </button>

                  <button onClick={() => { navigate('/wishlist'); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-fario-purple transition-colors">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-fario-purple flex items-center justify-center">
                      <Heart size={16} />
                    </div>
                    <span className="font-bold uppercase text-xs tracking-wider">Wishlist</span>
                  </button>

                  <button onClick={() => { setIsCartDrawerOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-fario-purple transition-colors">
                    <div className="relative w-8 h-8 rounded-full bg-purple-100 text-fario-purple flex items-center justify-center">
                      <ShoppingBag size={16} />
                      {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 text-[8px] flex items-center justify-center font-black bg-fario-purple text-white border border-white rounded-full">{cartCount}</span>}
                    </div>
                    <span className="font-bold uppercase text-xs tracking-wider">Cart</span>
                  </button>
                </div>
              </div>

              {/* Bottom Decoration */}
              <div className="p-5 border-t border-purple-100 text-center bg-purple-50">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-fario-purple">Fario Exclusives</p>
              </div>
            </MotionDiv>
          </>
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
