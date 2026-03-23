
import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
import { PackageSearch, LogOut, LayoutDashboard, Store, Grip, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const { Outlet, NavLink, useNavigate } = RouterDOM as any;

const StockLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);

  // Cast motion components
  const MotionDiv = (motion as any).div;

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Customers', path: '/admin/customers' },
    { name: 'Settings', path: '/admin/settings' },
    { name: 'Help', path: '/admin/help' },
  ];

  return (
    <div className="admin-mode min-h-screen bg-[#f1f5f9] font-sans text-slate-800">
      {/* Standalone Application Header */}
      <nav className="h-20 bg-white border-b border-gray-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        
        {/* Brand / App Identity */}
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <PackageSearch size={20} />
           </div>
           <div className="hidden sm:block">
              <h1 className="font-black text-lg tracking-tight leading-none text-slate-900 font-heading">STOCK<span className="text-emerald-600">.OS</span></h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Inventory Terminal Active</p>
              </div>
           </div>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 mx-4">
           {adminLinks.map(link => (
             <NavLink 
               key={link.path}
               to={link.path}
               className={({ isActive }: any) => `
                  px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                  ${isActive 
                    ? 'bg-white text-emerald-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-700 hover:bg-white/50'
                  }
               `}
             >
               {link.name}
             </NavLink>
           ))}
        </div>
        
        {/* Utilities & App Switcher */}
        <div className="flex items-center gap-4">
           <NavLink 
             to="/" 
             className="hidden xl:flex items-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-gray-50 hover:text-slate-900 transition-all border border-transparent hover:border-gray-100"
           >
              <Store size={14} /> Storefront
           </NavLink>
           
           <div className="h-8 w-px bg-gray-100 mx-2 hidden md:block"></div>

           {/* App Switcher Dropdown */}
           <div className="relative">
             <button 
                onClick={() => setIsAppMenuOpen(!isAppMenuOpen)}
                className={`p-3 rounded-xl transition-all ${isAppMenuOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:bg-gray-50 hover:text-slate-600'}`}
                title="Switch Application"
             >
                <Grip size={20} />
             </button>

             <AnimatePresence>
               {isAppMenuOpen && (
                 <>
                   <div className="fixed inset-0 z-[40]" onClick={() => setIsAppMenuOpen(false)} />
                   <MotionDiv
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-[50] overflow-hidden"
                   >
                      <div className="px-4 py-3 border-b border-gray-50">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">FARIO Workspace</p>
                      </div>
                      
                      <div className="p-2 grid gap-1">
                        <button 
                          onClick={() => navigate('/admin/dashboard')}
                          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-50 text-left group transition-colors"
                        >
                           <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <LayoutDashboard size={16} />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-slate-900">HQ Operations</p>
                              <p className="text-[9px] text-slate-400 font-medium">Main Dashboard</p>
                           </div>
                        </button>

                        <button 
                          className="flex items-center gap-4 px-4 py-3 rounded-xl bg-emerald-50/50 text-left group cursor-default"
                        >
                           <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                              <PackageSearch size={16} />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-slate-900">Stock.OS</p>
                              <p className="text-[9px] text-emerald-600 font-bold">Current Session</p>
                           </div>
                        </button>
                      </div>

                      {/* Mobile Links Fallback (Optional, but good UX) */}
                      <div className="lg:hidden border-t border-gray-50 p-2 grid gap-1">
                         {adminLinks.map(link => (
                           <button
                             key={link.path}
                             onClick={() => navigate(link.path)}
                             className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                           >
                             {link.name}
                           </button>
                         ))}
                      </div>

                      <div className="border-t border-gray-50 p-2 mt-1">
                         <button 
                           onClick={() => navigate('/')} 
                           className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors"
                         >
                            <LogOut size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Log Out</span>
                         </button>
                      </div>
                   </MotionDiv>
                 </>
               )}
             </AnimatePresence>
           </div>
           
           <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs cursor-default">
              <User size={16} />
           </div>
        </div>
      </nav>

      <main className="p-6 md:p-10 max-w-[1920px] mx-auto animate-in fade-in duration-500">
         <Outlet />
      </main>
    </div>
  );
};

export default StockLayout;
