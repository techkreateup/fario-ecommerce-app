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
  Home as HomeIcon, Info, Mail, Search,
  Package, HelpCircle
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    setIsSearchOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      setIsProfileMenuOpen(false);
      await signOut();
      if (isAdminPage) {
        navigate('/');
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'home': return <HomeIcon size={20} />;
      case 'shopping-bag': return <ShoppingBag size={20} />;
      case 'info': return <Info size={20} />;
      case 'mail': return <Mail size={20} />;
      case 'heart': return <Heart size={20} />;
      case 'package': return <Package size={20} />;
      case 'user': return <User size={20} />;
      case 'help-circle': return <HelpCircle size={20} />;
      default: return <ArrowRight size={20} />;
    }
  };

  const isAdminPage = location.pathname.startsWith('/admin');
  if (isAdminPage) return null;

  const headerBg = 'bg-[#f3e8ff]/95 backdrop-blur-xl shadow-sm h-16 lg:h-24 border-b border-purple-200/50 rounded-b-lg';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[1000] border-b flex items-center overflow-hidden ${headerBg}`}>
        <div className="container mx-auto px-4 md:px-6 lg:px-10 relative flex justify-between items-center w-full">

          <NavLink to="/" className="flex-1 flex items-center gap-3 lg:gap-4 relative z-[60] group">
            <div className="block lg:hidden transition-transform duration-300 group-hover:scale-105">
              <Logo size={48} />
            </div>
            <div className="hidden lg:block transition-transform duration-300 group-hover:scale-105">
              <Logo size={76} />
            </div>
            <div className="flex flex-col justify-center leading-none items-start">
              <span className="font-black text-[1.4rem] lg:text-[2.6rem] tracking-tight font-heading text-gray-900 uppercase leading-[0.9]">
                FARIO
              </span>
              <span className="text-[6px] lg:text-[9.5px] font-extrabold uppercase tracking-[0.5em] lg:tracking-[0.7em] text-fario-purple mt-1 w-full text-center lg:text-left">
                STEP IN, STAND OUT
              </span>
            </div>
          </NavLink>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center justify-center flex-0" onMouseLeave={() => setHoveredNav(null)}>
            <div className="flex items-center relative p-1.5 bg-gray-50/50 backdrop-blur-md rounded-full border border-gray-100">
              {NAV_ITEMS.map((item: any) => {
                const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                return (
                  <div key={item.path} className="relative group" onMouseEnter={() => setHoveredNav(item.path)}>
                    <NavLink to={item.path} className={`relative px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 z-10 block ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'}`}>
                      {isActive && <MotionDiv layoutId="nav-pill" className="absolute inset-0 bg-fario-purple rounded-full z-[-1]" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />}
                      {hoveredNav === item.path && !isActive && <MotionDiv layoutId="nav-hover" className="absolute inset-0 rounded-full z-[-1] bg-fario-purple/5" transition={{ type: "spring", bounce: 0.2, duration: 0.3 }} />}
                      {item.label}
                    </NavLink>
                  </div>
                );
              })}
            </div>
          </nav>

          <div className="flex-1 flex items-center justify-end gap-1 md:gap-5 relative z-[60]">
            {/* SEARCH TOGGLE (MOBILE) */}
            <button 
              className="lg:hidden p-3.5 text-fario-purple active:scale-90 transition-transform"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={22} />
            </button>

            {/* USER DROPDOWN (DESKTOP) */}
            <div className="relative hidden sm:block" ref={profileMenuRef}>
              <button
                onMouseDown={(e) => e.stopPropagation()}
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
                    className="absolute top-full right-0 mt-4 w-72 bg-fario-dark border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden z-[100] origin-top-right backdrop-blur-3xl"
                  >
                    <div className="p-6 bg-gradient-to-br from-fario-dark to-gray-900 text-white">
                      <h4 className="text-xl font-black font-heading uppercase italic tracking-tighter">
                        {isLoggedIn ? `Hi, ${userProfile?.name?.split(' ')[0]}` : 'ACCESS'}
                      </h4>
                      <p className="text-[8px] text-fario-lime uppercase font-black tracking-[0.4em] mt-1.5">
                        {isLoggedIn ? 'Verified Member' : 'Guest Node'}
                      </p>
                    </div>
                    <div className="p-3 space-y-1">
                      {!isLoggedIn ? (
                        <button onClick={() => navigate('/login')} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl hover:bg-white/5 group transition-all">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">Authorize</span>
                          <ArrowRight size={14} className="text-white/20 group-hover:text-fario-lime transition-all" />
                        </button>
                      ) : (
                        <>
                          <button onClick={() => navigate('/profile')} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl hover:bg-white/5 group transition-all">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">Profile</span>
                            <ArrowRight size={14} className="text-white/20 group-hover:text-fario-purple transition-all" />
                          </button>
                          <button onClick={handleSignOut} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-rose-500/10 group transition-all">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-500">End Session</span>
                          </button>
                        </>
                      )}
                    </div>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>

            {/* WISHLIST (DESKTOP) */}
            <button onClick={() => navigate('/wishlist')} className="relative group p-3 rounded-full text-purple-600 hover:text-white hover:bg-fario-purple transition-all hidden sm:block">
              <Heart size={22} className="transition-all active:scale-95" />
              {wishlistItems.length > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-fario-purple text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">{wishlistItems.length}</span>}
            </button>

            {/* CART ICON */}
            <button onClick={() => setIsCartDrawerOpen(true)} className="relative p-3.5 text-purple-600 active:scale-90 transition-transform" aria-label="Cart">
              <ShoppingBag size={22} />
              {cartCount > 0 && <span className="absolute top-2 right-2 w-4.5 h-4.5 bg-fario-purple text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">{cartCount}</span>}
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3.5 text-purple-600 active:scale-90 transition-transform" aria-label="Menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY (MOBILE) */}
      <AnimatePresence>
        {isSearchOpen && (
          <MotionDiv 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[2000] bg-white flex flex-col pt-safe"
          >
            <div className="p-4 flex items-center gap-4 border-b border-purple-100">
              <button onClick={() => setIsSearchOpen(false)} className="p-2 text-fario-purple active:scale-90"><ArrowRight size={24} className="rotate-180" /></button>
              <div className="flex-1 relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-fario-purple/40" size={20} />
                <input 
                  autoFocus type="text" placeholder="SEARCH FARIO..." 
                  onKeyDown={(e) => { if (e.key === 'Enter') { setIsSearchOpen(false); navigate('/products'); } }}
                  className="w-full pl-8 py-3 bg-transparent text-sm font-black uppercase tracking-widest text-fario-purple outline-none"
                />
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 z-[90] bg-fario-dark/40 backdrop-blur-sm" />
            <MotionDiv 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
              className="fixed top-0 left-0 bottom-0 w-[80vw] max-w-[300px] z-[100] bg-white flex flex-col border-r border-purple-100 shadow-2xl"
            >
              <div className="flex justify-between items-center p-5 border-b border-purple-100">
                <div className="flex items-center gap-3"><Logo size={32} /><span className="font-black text-lg text-fario-purple uppercase">FARIO</span></div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-fario-purple active:scale-90"><X size={20} strokeWidth={3} /></button>
              </div>
              <div className="flex-grow overflow-y-auto px-5 py-6">
                <nav className="flex flex-col gap-2 mb-8">
                  {[
                    ...NAV_ITEMS,
                    { label: 'Saved Items', path: '/wishlist', icon: 'heart' },
                    { label: 'My Orders', path: '/profile', icon: 'package' },
                    { label: 'Support & FAQs', path: '/contact', icon: 'help-circle' },
                    { label: 'My Profile', path: '/profile', icon: 'user' }
                  ].map((item: any, index: number) => {
                    const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                    return (
                      <NavLink key={item.path + index} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${isActive ? 'bg-fario-purple text-white shadow-lg scale-[1.02]' : 'text-gray-700 hover:bg-purple-50'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-purple-100 text-fario-purple'}`}>{getIcon(item.icon)}</div>
                        <span className="font-black uppercase tracking-wider text-sm">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            </MotionDiv>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} />
    </>
  );
};

export default Header;
