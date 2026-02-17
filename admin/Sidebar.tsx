import React from 'react';
import * as RouterDOM from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  HelpCircle,
  BarChart3,
  History,
  RotateCcw,
  Tag,
  Star
} from 'lucide-react';
import Logo from '../components/Logo';

// Fix missing NavLink in react-router-dom
const { NavLink } = RouterDOM as any;

import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC<any> = () => {
  const { signOut } = useAuth();
  const navigate = RouterDOM.useNavigate();

  const handleSignOut = async () => {
    await signOut();
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Insights', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Inventory', path: '/admin/products', icon: Package },
    { label: 'Stock Ops', path: '/admin/stock', icon: RotateCcw },
    { label: 'Coupons', path: '/admin/coupons', icon: Tag },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Reviews', path: '/admin/reviews', icon: Star },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Audit Log', path: '/admin/logs', icon: History },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
    { label: 'Support', path: '/admin/help', icon: HelpCircle },
  ];

  return (
    <aside className="admin-sidebar shadow-2xl">
      <div className="p-8 flex items-center gap-4">
        <div className="bg-white/10 p-2 rounded-xl">
          <Logo size={28} className="invert" />
        </div>
        <div>
          <h2 className="font-heading font-black text-xl tracking-tighter leading-none italic">FARIO</h2>
          <p className="text-[9px] text-white/40 uppercase font-black tracking-[0.3em] mt-1.5">Enterprise HQ</p>
        </div>
      </div>

      <nav className="flex-grow px-4 mt-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }: any) => `
              flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive ? 'bg-fario-purple text-white font-bold shadow-lg shadow-fario-purple/20 translate-x-1' : 'text-white/50 hover:bg-white/5 hover:text-white'}
            `}
          >
            {({ isActive }: any) => (
              <>
                <div className="flex items-center gap-4">
                  <item.icon size={18} className={isActive ? 'text-white' : 'text-white/30 group-hover:text-white transition-colors'} />
                  <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="sidebar-dot" className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl bg-white/5 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 group shadow-lg"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
