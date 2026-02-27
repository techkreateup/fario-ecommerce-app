import React, { useState, useEffect } from 'react';
import {
   Plus, Target, Users, BarChart3, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
interface Campaign {
   id: string;
   title: string;
   type: string;
   emailsCount: number;
   duration: string;
   status: 'Running' | 'Paused' | 'Draft' | 'Completed';
   stats: {
      delivered: number;
      opened: number;
      clicked: number;
      converted: number;
   }
}

const CAMPAIGNS: Campaign[] = [
   {
      id: '1',
      title: 'Monsoon Sale Launch',
      type: 'Promotional',
      emailsCount: 2450,
      duration: '4 Days',
      status: 'Running',
      stats: { delivered: 2400, opened: 1200, clicked: 450, converted: 85 }
   },
   {
      id: '2',
      title: 'Back to College Onboarding',
      type: 'Transactional',
      emailsCount: 120,
      duration: 'Ongoing',
      status: 'Running',
      stats: { delivered: 118, opened: 95, clicked: 40, converted: 12 }
   },
];

const AdminMarketing = () => {
   const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [newCampaign, setNewCampaign] = useState({ title: '', type: 'Promotional' });

   useEffect(() => {
      fetchCampaigns();
   }, []);

   const fetchCampaigns = async () => {
      try {
         const { supabase } = await import('../lib/supabase');
         // Attempt to fetch from settings first
         const { data } = await supabase.from('settings').select('value').eq('key', 'marketing_campaigns').single();
         if (data?.value) {
            setCampaigns(data.value);
         }
      } catch (err) {
         console.log('No campaigns found in settings, using default');
      }
   };

   const handleAddCampaign = async (e: React.FormEvent) => {
      e.preventDefault();
      const campaign: Campaign = {
         id: Date.now().toString(),
         title: newCampaign.title,
         type: newCampaign.type,
         emailsCount: 0,
         duration: 'Just Started',
         status: 'Draft',
         stats: { delivered: 0, opened: 0, clicked: 0, converted: 0 }
      };

      const updatedCampaigns = [campaign, ...campaigns];
      setCampaigns(updatedCampaigns);
      setIsModalOpen(false);
      setNewCampaign({ title: '', type: 'Promotional' });

      // Save to Supabase
      try {
         const { supabase } = await import('../lib/supabase');
         await supabase.from('settings').upsert({
            key: 'marketing_campaigns',
            value: updatedCampaigns
         });
      } catch (error) {
         console.error("Failed to save campaign", error);
      }
   };

   return (
      <div className="min-h-screen bg-[#f8fafc] p-6 font-sans text-slate-800">
         {/* --- HEADER --- */}
         <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
               <h1 className="text-2xl font-bold text-[#1f2937]">Marketing Hub</h1>
               <p className="text-sm text-slate-500 mt-1">Deploy campaigns and monitor customer engagement</p>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-violet-200">
                  <Plus size={18} /> Create Campaign
               </button>
            </div>
         </header>

         {/* --- STATS OVERVIEW --- */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
               <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600"><Target size={24} /></div>
               <div><p className="text-[10px] font-black text-slate-400 uppercase">Active Reach</p><h3 className="text-xl font-black">45,200</h3></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
               <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><Users size={24} /></div>
               <div><p className="text-[10px] font-black text-slate-400 uppercase">New Subs</p><h3 className="text-xl font-black">+1.2k</h3></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
               <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600"><BarChart3 size={24} /></div>
               <div><p className="text-[10px] font-black text-slate-400 uppercase">Avg Conv</p><h3 className="text-xl font-black">3.4%</h3></div>
            </div>
         </div>

         {/* --- CAMPAIGN LIST --- */}
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <h3 className="font-black text-xs uppercase tracking-widest text-slate-600">Active Regimen</h3>
            </div>

            <div className="divide-y divide-slate-100">
               {campaigns.map(campaign => (
                  <div key={campaign.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="min-w-[280px]">
                           <h4 className="font-bold text-slate-900 text-base mb-2">{campaign.title}</h4>
                           <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-black uppercase text-slate-500 rounded">{campaign.type}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase">{campaign.duration}</span>
                           </div>
                        </div>

                        <div className="flex-1 grid grid-cols-4 gap-4">
                           <StatItem label="Sent" value={campaign.stats.delivered} />
                           <StatItem label="Open" value={campaign.stats.opened} />
                           <StatItem label="Click" value={campaign.stats.clicked} />
                           <StatItem label="Conv" value={campaign.stats.converted} />
                        </div>

                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${campaign.status === 'Running' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                           {campaign.status}
                        </div>
                        <button
                           onClick={async () => {
                              if (!confirm('Delete this campaign?')) return;
                              const updated = campaigns.filter(c => c.id !== campaign.id);
                              setCampaigns(updated);
                              const { supabase } = await import('../lib/supabase');
                              await supabase.from('settings').update({ value: updated }).eq('key', 'marketing_campaigns');
                           }}
                           className="p-2 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* --- CREATE MODAL --- */}
         <AnimatePresence>
            {isModalOpen && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl w-full max-w-md p-8 relative z-10 shadow-2xl">
                     <h3 className="text-xl font-black mb-6 italic uppercase tracking-tighter">Initiate Campaign</h3>
                     <form onSubmit={handleAddCampaign} className="space-y-4">
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Campaign Title</label>
                           <input required type="text" value={newCampaign.title} onChange={e => setNewCampaign({ ...newCampaign, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-violet-500" placeholder="e.g. Summer Blast 2026" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Engage Type</label>
                           <select value={newCampaign.type} onChange={e => setNewCampaign({ ...newCampaign, type: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                              <option>Promotional</option>
                              <option>Transactional</option>
                              <option>Educational</option>
                           </select>
                        </div>
                        <button type="submit" className="w-full py-4 bg-violet-600 text-white rounded-xl font-black uppercase tracking-widest text-xs mt-4 shadow-lg shadow-violet-200">Deploy Assets</button>
                     </form>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
};

const StatItem = ({ label, value }: { label: string, value: number }) => (
   <div>
      <p className="text-sm font-black mb-0.5">{value}</p>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
   </div>
);

export default AdminMarketing;
