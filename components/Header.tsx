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

  // PREMIUM NEUTRAL HEADER (Glassmorphic)
  const headerBg = 'bg-white/95 backdrop-blur-xl shadow-sm h-16 lg:h-20 border-gray-100';
  const textColor = 'text-gray-950';


  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 border-b flex items-center ${headerBg}`}>
        <div className="container mx-auto px-4 md:px-6 lg:px-10 relative flex justify-between items-center">

          <NavLink to="/" className="flex items-center gap-3 md:gap-4 relative z-[60] group">
            <div className="transition-transform duration-500 group-hover:scale-105 shadow-xl rounded-full">
              {/* Standard Brand Logo */}
              <div className="block lg:hidden">
                <Logo size={40} />
              </div>
              <div className="hidden lg:block">
                <Logo size={52} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`font-black text-xl md:text-3xl tracking-tighter font-heading italic ${textColor} leading-none transition-colors`}>FARIO</span>
              <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-fario-purple mt-0.5 md:mt-1 ml-0.5 opacity-40">Official Registry</span>
            </div>
          </NavLink>

          {/* CENTER NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center relative p-1.5 bg-gray-50/50 backdrop-blur-md rounded-full border border-gray-100">
              {NAV_ITEMS.map((item: any) => {
                const isActive = item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onMouseEnter={() => setHoveredNav(item.path)}
                    onMouseLeave={() => setHoveredNav(null)}
                    className={`
                       relative px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 z-10
                       ${isActive ? 'text-white' : 'text-gray-500 hover:text-fario-purple'}
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
                )
              })}
            </div>
          </nav>

          <div className="flex items-center gap-4 md:gap-5 relative z-[60]">

            {/* USER DROPDOWN */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center gap-3 p-1.5 rounded-full border transition-all duration-300 hover:shadow-lg ${isProfileMenuOpen ? 'bg-fario-purple text-white border-fario-purple' : 'bg-gray-50 border-gray-100'}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-colors ${isLoggedIn ? 'bg-fario-purple shadow-inner text-white' : 'bg-white shadow-sm'}`}>
                  {isLoggedIn && userProfile?.avatar ? (
                    <img src={userProfile.avatar} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <User size={18} className={isProfileMenuOpen ? 'text-white' : 'text-gray-400'} />
                  )}
                </div>
                <ChevronDown size={14} strokeWidth={3} className={`mr-2 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180 text-white' : 'text-gray-300'}`} />
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
              className={`relative group p-3 rounded-full transition-all duration-300 hover:scale-105 bg-white border border-gray-100 text-gray-500 hover:border-fario-purple hover:text-fario-purple shadow-sm hover:shadow-lg`}
            >
              <Heart size={22} className="transition-all duration-300 group-hover:fill-fario-purple" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-fario-purple text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-fario-purple">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* CART ICON */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className={`relative p-3 rounded-full transition-all duration-300 hover:scale-105 bg-white border border-gray-100 text-gray-500 hover:border-fario-purple hover:text-fario-purple shadow-sm hover:shadow-lg`}
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-fario-purple text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-fario-purple">
                  {cartCount}
                </span>
              )}
            </button>

            {/* MOBILE TOGGLE */}
            <button
              className={`lg:hidden p-3 rounded-full transition-all bg-white border border-gray-100 text-gray-500 hover:text-fario-purple hover:border-fario-purple shadow-sm`}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0, x: '100%' }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gray-950 flex flex-col"
          >
            <div className="flex justify-between items-center p-6 md:p-8 border-b border-white/10">
              <div className="flex items-center gap-4">
                <Logo size={40} />
                <span className="font-black text-2xl tracking-tighter font-heading italic text-white">FARIO</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="flex-grow flex flex-col p-6 md:p-10 overflow-y-auto">

              {/* Quick Actions Row */}
              <div className="grid grid-cols-3 gap-3 mb-10">
                <button onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }} className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                  <User size={20} className="text-fario-lime mb-2" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Profile</span>
                </button>
                <button onClick={() => { navigate('/wishlist'); setIsMobileMenuOpen(false); }} className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                  <Heart size={20} className="text-rose-400 mb-2" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Wishlist</span>
                </button>
                <button onClick={() => { setIsCartDrawerOpen(true); setIsMobileMenuOpen(false); }} className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                  <div className="relative">
                    <ShoppingBag size={20} className="text-fario-purple mb-2" />
                    {cartCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-fario-lime rounded-full" />}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Cart</span>
                </button>
              </div>

              <nav className="flex flex-col gap-6 md:gap-8">
                {NAV_ITEMS.map((item: any, idx: number) => (
                  <MotionDiv
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }: any) => `
                           text-3xl md:text-5xl font-black font-heading uppercase tracking-tighter flex items-center justify-between group
                           ${isActive ? 'text-fario-lime' : 'text-white/40'}
                         `}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`p-2 rounded-lg ${location.pathname === item.path ? 'bg-fario-lime/10 text-fario-lime' : 'bg-white/5 text-white/20 group-hover:text-white/40'}`}>
                          {getIcon(item.icon)}
                        </span>
                        {item.label}
                      </div>
                      {location.pathname === item.path && <ArrowRight size={24} className="text-fario-lime md:w-8 md:h-8" />}
                    </NavLink>
                  </MotionDiv>
                ))}
              </nav>
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
