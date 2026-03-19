import React from 'react';
import { Settings, ShieldAlert } from 'lucide-react';

const MaintenanceScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center mb-8 relative">
                <Settings size={40} className="text-slate-300 animate-[spin_4s_linear_infinite]" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-500 rounded-full border-4 border-[#f8fafc] flex items-center justify-center">
                    <ShieldAlert size={14} className="text-white" />
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                404 Server Under Maintenance
            </h1>

            <p className="text-slate-500 max-w-md mx-auto font-medium mb-12">
                Fario HQ is currently upgrading our enterprise systems to serve you better. We'll be back online shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <a
                    href="mailto:reachkreateup@gmail.com"
                    className="px-6 py-3 bg-fario-purple text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-purple-800 transition-colors shadow-lg shadow-fario-purple/20"
                >
                    Contact Support
                </a>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-white text-slate-600 rounded-xl font-bold uppercase tracking-widest text-xs border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                    Retry Connection
                </button>
            </div>
        </div>
    );
};

export default MaintenanceScreen;
