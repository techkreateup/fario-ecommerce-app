import { useAuth } from '../context/AuthContext';
import { Bell, Menu } from 'lucide-react';

const Header: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.name || "Administrator";
  const userInitials = userName.split(' ').map((n: any) => n[0]).join('').toUpperCase();

  return (
    <header className="admin-header">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-fario-purple hover:bg-slate-50 rounded-xl transition-colors">
            <Menu size={24} />
          </button>
        )}
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hidden sm:block">Command Center</h3>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2.5 text-slate-400 hover:text-fario-purple hover:bg-slate-50 rounded-xl transition-all relative" title="System Alerts">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-100"></div>

        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{userName}</p>
            <p className="text-[9px] text-fario-purple uppercase font-black tracking-widest mt-0.5">Primary Architect</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
              {userInitials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;