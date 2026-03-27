import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Menu, Search, Command, Zap, ChevronDown } from 'lucide-react';

const Header: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.name || "Administrator";
  const userInitials = userName.split(' ').map((n: any) => n[0]).join('').toUpperCase().slice(0, 2);

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-2xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
      <div className="absolute inset-0 bg-gradient-to-r from-fario-purple/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      <div className="flex items-center justify-between px-4 lg:px-8 h-20 relative max-w-[1600px] mx-auto">
        
        {/* Left Section: Menu Toggle & Breadcrumb/Title */}
        <div className="flex items-center gap-4 lg:gap-8 flex-1">
          {onMenuClick && (
            <button 
              onClick={onMenuClick} 
              className="lg:hidden p-2.5 text-gray-500 hover:text-fario-purple bg-white hover:bg-fario-purple/5 transition-all rounded-xl border border-gray-100 shadow-sm"
            >
              <Menu size={20} strokeWidth={2.5} />
            </button>
          )}
          
          <div className="hidden md:flex flex-col">
            <h2 className="text-xl font-black tracking-tight text-gray-900 leading-none">Command Center</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fario-purple mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              System Optimal
            </p>
          </div>
        </div>

        {/* Center Section: Global Search (Hidden on small mobile) */}
        <div className="hidden sm:flex items-center justify-center flex-1 max-w-xl px-4 z-10">
          <div className={`relative w-full flex items-center transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : 'scale-100'}`}>
            <Search className={`absolute left-4 z-10 transition-colors ${isSearchFocused ? 'text-fario-purple' : 'text-gray-400'}`} size={18} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search orders, customers, or products..." 
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full h-12 pl-12 pr-12 bg-gray-50/50 border border-gray-200/60 rounded-[1rem] text-sm font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-4 focus:ring-fario-purple/10 focus:border-fario-purple/30 transition-all shadow-inner placeholder-gray-400"
            />
            <div className="absolute right-3 flex items-center gap-1 bg-white border border-gray-200 shadow-sm px-2 py-1 rounded-lg text-[10px] font-bold text-gray-400 font-mono tracking-tighter pointer-events-none">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center justify-end gap-3 lg:gap-5 flex-1 z-10">
          
          {/* Quick Actions */}
          <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <Zap size={14} className="text-yellow-400" fill="currentColor" />
            Quick Action
          </button>

          <div className="h-8 w-px bg-gray-200 hidden lg:block mx-1"></div>

          {/* Notifications */}
          <button className="relative p-3 text-gray-500 hover:text-fario-purple bg-white hover:bg-fario-purple/5 transition-all rounded-xl border border-gray-100 shadow-sm group">
            <Bell size={20} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform duration-300 origin-top" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"></span>
          </button>
          
          {/* User Profile Dropdown */}
          <div className="flex items-center gap-3 pl-2 cursor-pointer group rounded-2xl hover:bg-white/60 p-1.5 transition-colors border border-transparent hover:border-white/80 hover:shadow-sm">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fario-purple to-[#4F46E5] text-white flex items-center justify-center font-black text-sm shadow-lg shadow-fario-purple/30 group-hover:scale-105 transition-all overflow-hidden border border-white/20">
                {userInitials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            <div className="hidden lg:flex flex-col items-start pr-1">
              <p className="text-xs font-black text-gray-900 uppercase tracking-widest leading-none">{userName}</p>
              <p className="text-[9px] text-fario-purple uppercase font-black tracking-[0.2em] mt-1">Super Admin</p>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden lg:block group-hover:text-fario-purple transition-colors ml-1" />
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;