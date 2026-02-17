import React from 'react';
import { INITIAL_IPA_LOGS } from './dummyData';
import { MessageSquare, Cpu, User, Clock, BarChart3, CheckCircle2, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const IPALogs: React.FC = () => {
  // Cast motion components to any to bypass prop errors
  const MotionDiv = (motion as any).div;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h1 className="text-4xl font-bold font-heading italic tracking-tighter text-deep-teal leading-none mb-3">Neural Stream</h1>
           <p className="text-[11px] font-black uppercase tracking-[0.4em] text-orchid">IPA Interaction Protocol v4.2</p>
        </div>
        <div className="flex gap-4">
           <div className="px-8 py-4 bg-white border border-glass-border rounded-2xl flex items-center gap-5 shadow-luxury">
              <BarChart3 size={20} className="text-sage-green" />
              <div className="text-left border-l border-slate-100 pl-5">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Synthesis Confidence</p>
                 <p className="text-lg font-black text-deep-teal italic">99.4%</p>
              </div>
           </div>
           <button className="grand-btn btn-orchid-gradient">
              <RefreshCcw size={18} /> Sync Archive
           </button>
        </div>
      </header>

      <div className="space-y-8">
        {INITIAL_IPA_LOGS.map((log, idx) => (
          <MotionDiv 
            key={log.id} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="grand-panel relative group"
          >
            {/* Ambient Background Element */}
            <div className="absolute -top-10 -right-10 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
               <Cpu size={240} />
            </div>
            
            <div className="flex flex-col lg:flex-row gap-16 relative z-10">
               {/* Technical Metadata */}
               <div className="lg:w-64 border-r border-slate-50 space-y-6 shrink-0">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Temporal Node</p>
                    <div className="flex items-center gap-3 text-deep-teal font-heading text-lg font-black italic">
                       <Clock size={16} className="text-orchid" />
                       {log.timestamp.split(' ')[1]}
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{log.timestamp.split(' ')[0]}</p>
                  </div>
                  
                  <div className="space-y-3 pt-6 border-t border-slate-50">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <span>Logic Strength</span>
                       <span className="text-sage-green">Elite</span>
                    </div>
                    <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                       <div className="h-full bg-orchid w-[94%] shadow-[0_0_10px_#EE82EE]" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-2 bg-sky-blue/10 rounded-xl w-max border border-sky-blue/20">
                     <CheckCircle2 size={14} className="text-sky-blue" />
                     <span className="text-[9px] font-black text-sky-blue uppercase tracking-widest">Intent Logged</span>
                  </div>
               </div>

               {/* Interaction Path */}
               <div className="flex-grow space-y-10">
                  {/* User Intent */}
                  <div className="flex gap-6">
                     <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                        <User size={20} className="text-slate-300" />
                     </div>
                     <div className="space-y-1 pt-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Origin Node: Client_Query</p>
                        <p className="text-xl font-bold text-deep-teal leading-tight font-heading italic tracking-tight">{log.query}</p>
                     </div>
                  </div>

                  {/* Neural Response */}
                  <div className="flex gap-6">
                     <div className="w-12 h-12 rounded-xl bg-orchid text-white shadow-btn-orchid flex items-center justify-center shrink-0">
                        <MessageSquare size={20} />
                     </div>
                     <div className="flex-grow space-y-2 p-8 bg-surface-subtle rounded-3xl border border-glass-border relative shadow-inner group-hover:bg-white transition-colors">
                        <div className="absolute top-6 right-8 flex items-center gap-3">
                           <span className="w-1.5 h-1.5 rounded-full bg-orchid animate-pulse shadow-[0_0_8px_#EE82EE]" />
                           <span className="text-[9px] font-black text-orchid uppercase tracking-[0.3em]">Synthesis Active</span>
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Synaptic Fulfillment</p>
                        <p className="text-lg text-slate-600 font-medium italic leading-relaxed">"{log.response}"</p>
                     </div>
                  </div>
               </div>
            </div>
          </MotionDiv>
        ))}
      </div>

      <div className="mt-20 text-center">
         <button className="grand-btn btn-white-glass !px-16 !h-16 shadow-luxury">
            Synchronize More Archive Manifests
         </button>
      </div>
    </div>
  );
};

export default IPALogs;