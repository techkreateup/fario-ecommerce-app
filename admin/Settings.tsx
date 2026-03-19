import React, { useState, useEffect } from 'react';
import * as RouterDOM from 'react-router-dom';
import {
   Shield, Palette, Users, Bell, Lock, Smartphone,
   Save, CheckCircle2, X, Video, Download,
   Trash2, RefreshCw, Terminal, Activity, AlertTriangle,
   History, Globe, Layout, Sliders, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartProvider';
import { driveVideo } from '../constants';

const Settings: React.FC = () => {
   const navigate = RouterDOM.useNavigate();

   // State
   const [accentColor, setAccentColor] = useState(localStorage.getItem('fario_theme_accent') || '#7a51a0');
   const [mfaEnabled, setMfaEnabled] = useState(true);
   const [videoUrl, setVideoUrl] = useState(localStorage.getItem('fario_hero_video') || '');
   const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);
   const [isBackup, setIsBackup] = useState(false);
   const [activeTab, setActiveTab] = useState<'branding' | 'security' | 'system'>('branding');

   // Sync Accent (Live Preview)
   useEffect(() => {
      document.documentElement.style.setProperty('--accent', accentColor);
   }, [accentColor]);

   const handleSave = () => {
      if (videoUrl) {
         const processedUrl = driveVideo(videoUrl);
         localStorage.setItem('fario_hero_video', processedUrl);
      }
      localStorage.setItem('fario_theme_accent', accentColor);

      setNotification({ msg: "Settings updated successfully", type: 'success' });
      setTimeout(() => setNotification(null), 3000);
   };

   const handleBackup = () => {
      setIsBackup(true);
      setTimeout(() => {
         const data = JSON.stringify(localStorage);
         const blob = new Blob([data], { type: 'application/json' });
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = `fario_config_${new Date().toISOString().split('T')[0]}.json`;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         setIsBackup(false);
         setNotification({ msg: "Configuration backup generated", type: 'success' });
      }, 1500);
   };

   const tabs = [
      { id: 'branding', label: 'Branding & UI', icon: Palette },
      { id: 'security', label: 'Security', icon: Shield },
      { id: 'system', label: 'Infrastructure', icon: Sliders },
   ];

   return (
      <div className="space-y-8 pb-24 animate-slide-up">
         {/* Toast */}
         <AnimatePresence>
            {notification && (
               <motion.div
                  initial={{ opacity: 0, y: -20, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0 }}
                  className={`fixed top-10 left-1/2 z-[3000] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${notification.type === 'success' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-rose-600 border-rose-500 text-white'}`}
               >
                  {notification.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertTriangle size={18} />}
                  <span className="text-[10px] font-black uppercase tracking-widest">{notification.msg}</span>
                  <button onClick={() => setNotification(null)}><X size={14} /></button>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Header */}
         <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <h1 className="admin-h1">Platform Configuration</h1>
               <p className="admin-subtitle">Manage branding, security protocols, and system maintenance.</p>
            </div>
            <button
               onClick={handleSave}
               className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-fario-purple transition-all shadow-lg active:scale-95"
            >
               <Save size={18} /> Save Changes
            </button>
         </header>

         {/* Tabs */}
         <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-max">
            {tabs.map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                     }`}
               >
                  <tab.icon size={16} />
                  {tab.label}
               </button>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
               <AnimatePresence mode="wait">
                  {activeTab === 'branding' && (
                     <motion.div
                        key="branding"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                     >
                        {/* HERO AREA */}
                        <div className="admin-card">
                           <div className="flex items-center gap-3 mb-8">
                              <Video className="text-fario-purple" size={20} />
                              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Landing Experience</h3>
                           </div>

                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Hero Video Source (MP4 / Google Drive ID)
                                 </label>
                                 <input
                                    type="text"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="Enter video URL or ID..."
                                    className="admin-input"
                                 />
                              </div>

                              {videoUrl && (
                                 <div className="w-full h-48 bg-slate-900 rounded-2xl overflow-hidden relative group border border-slate-200 shadow-inner">
                                    <video src={driveVideo(videoUrl)} className="w-full h-full object-cover opacity-60" muted loop autoPlay />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40">
                                       <Layout className="text-white/40 mb-2" size={32} />
                                       <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10"> Live Preview </span>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* THEME AREA */}
                        <div className="admin-card">
                           <div className="flex items-center gap-3 mb-8">
                              <Palette className="text-fario-purple" size={20} />
                              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Brand Identity</h3>
                           </div>

                           <div className="flex items-center gap-8">
                              <div className="relative group cursor-pointer w-20 h-20">
                                 <input
                                    type="color"
                                    value={accentColor}
                                    onChange={(e) => setAccentColor(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                 />
                                 <div className="w-full h-full rounded-[2rem] border-4 border-white shadow-xl flex items-center justify-center transition-transform group-hover:scale-105" style={{ backgroundColor: accentColor }}>
                                    <div className="w-8 h-8 bg-white/30 rounded-full backdrop-blur-sm" />
                                 </div>
                              </div>
                              <div className="flex-1">
                                 <p className="text-sm font-black text-slate-900 tracking-tight mb-1">System Accent Color</p>
                                 <p className="text-xs text-slate-400 mb-4">This color will be used for buttons, links, and highlights across the entire marketplace.</p>
                                 <div className="flex items-center gap-2">
                                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-mono font-bold text-slate-600 border border-slate-200">{accentColor}</span>
                                    <span className="text-[10px] font-black text-slate-300 uppercase italic">Hex Format</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}

                  {activeTab === 'security' && (
                     <motion.div
                        key="security"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                     >
                        <div className="admin-card">
                           <div className="flex items-center gap-3 mb-8">
                              <Shield className="text-emerald-500" size={20} />
                              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Security Protocols</h3>
                           </div>

                           <div className="space-y-4">
                              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                 <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-600"><Smartphone size={20} /></div>
                                    <div>
                                       <p className="text-sm font-black text-slate-900">Multi-Factor Authentication</p>
                                       <p className="text-xs text-slate-400">Add an extra layer of security to your account.</p>
                                    </div>
                                 </div>
                                 <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={mfaEnabled} onChange={() => setMfaEnabled(!mfaEnabled)} className="sr-only peer" />
                                    <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fario-purple"></div>
                                 </label>
                              </div>

                              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                 <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-600"><Lock size={20} /></div>
                                    <div>
                                       <p className="text-sm font-black text-slate-900">Session Lifecycle</p>
                                       <p className="text-xs text-slate-400">Automatic sign-out after 24 hours of inactivity.</p>
                                    </div>
                                 </div>
                                 <span className="text-[10px] font-black text-fario-purple uppercase bg-fario-purple/5 px-3 py-1.5 rounded-lg border border-fario-purple/10">Active Protection</span>
                              </div>
                           </div>
                        </div>

                        <div className="admin-card">
                           <div className="flex items-center gap-3 mb-8">
                              <History className="text-slate-400" size={20} />
                              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Activity Governance</h3>
                           </div>
                           <button
                              onClick={() => navigate('/admin/logs')}
                              className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group shadow-sm"
                           >
                              <div className="flex items-center gap-4 text-slate-600 group-hover:text-slate-900">
                                 <Terminal size={18} />
                                 <span className="text-xs font-bold uppercase tracking-widest">Review Audit Logs</span>
                              </div>
                              <ChevronRight size={18} className="text-slate-300 group-hover:text-fario-purple group-hover:translate-x-1 transition-all" />
                           </button>
                        </div>
                     </motion.div>
                  )}

                  {activeTab === 'system' && (
                     <motion.div
                        key="system"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                     >
                        <div className="admin-card">
                           <div className="flex items-center gap-3 mb-8">
                              <Activity className="text-fario-purple" size={20} />
                              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">System Maintenance</h3>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <button
                                 onClick={handleBackup}
                                 disabled={isBackup}
                                 className="flex flex-col items-center justify-center gap-4 p-8 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all shadow-sm group"
                              >
                                 <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    {isBackup ? <RefreshCw size={24} className="animate-spin" /> : <Download size={24} />}
                                 </div>
                                 <div className="text-center">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Backup Configuration</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Download local state archive</p>
                                 </div>
                              </button>

                              <button
                                 onClick={() => { if (window.confirm("Purge platform cache?")) { localStorage.clear(); window.location.reload(); } }}
                                 className="flex flex-col items-center justify-center gap-4 p-8 bg-white border border-slate-100 rounded-3xl hover:bg-rose-50 transition-all shadow-sm group"
                              >
                                 <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Trash2 size={24} />
                                 </div>
                                 <div className="text-center">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Purge Platform Cache</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Reset all non-essential data</p>
                                 </div>
                              </button>
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* INFO SIDEBAR */}
            <div className="lg:col-span-4 space-y-6">
               <div className="admin-card bg-slate-900 text-white border-none shadow-2xl p-8 relative overflow-hidden group">
                  <div className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-150 transition-transform duration-[2s]">
                     <Globe size={200} />
                  </div>
                  <div className="relative z-10">
                     <div className="flex items-center gap-2 mb-8">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Live Environment</span>
                     </div>
                     <h4 className="text-2xl font-black font-heading italic uppercase tracking-tighter mb-4 leading-none">System <span className="text-fario-purple">Operational</span></h4>
                     <div className="space-y-4 pt-4 border-t border-white/10 mt-6">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Build Version</span>
                           <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-0.5 rounded">v5.0.2-LST</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Database Node</span>
                           <span className="text-[10px] font-bold text-white uppercase italic">Active @ Mumbai</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Uptime</span>
                           <span className="text-[10px] font-bold text-emerald-400">99.98% Healthy</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                     <Bell className="text-slate-400" size={20} />
                     <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Support Access</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6 italic border-l-2 border-slate-200 pl-4">"Administrator access provides global override capabilities. Use with caution for inventory and financial reconciliation."</p>
                  <button
                     onClick={() => navigate('/admin/help')}
                     className="w-full py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-fario-purple transition-all text-slate-600 hover:text-fario-purple shadow-sm"
                  >
                     Contact Enterprise Support
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Settings;
