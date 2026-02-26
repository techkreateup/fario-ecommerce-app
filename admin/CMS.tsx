import React, { useState, useEffect } from 'react';
import { Save, Loader2, Layout, Type } from 'lucide-react';

const AdminCMS: React.FC = () => {
   const [settings, setSettings] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);

   useEffect(() => {
      fetchSettings();
   }, []);

   const fetchSettings = async () => {
      try {
         const { supabase } = await import('../lib/supabase');
         const { data } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'cms_config')
            .single();

         if (data) {
            setSettings(data.value);
         } else {
            // Default structure
            setSettings({
               bannerText: "Free Delivery on all orders above Rs. 999",
               heroTitle: "Step into the Future",
               heroSubtitle: "Engineered for elite performance and everyday comfort."
            });
         }
      } catch (err) {
         console.error('Fetch settings error:', err);
      } finally {
         setLoading(false);
      }
   };

   const handleSave = async () => {
      setSaving(true);
      try {
         const { supabase } = await import('../lib/supabase');
         const { error } = await supabase
            .from('settings')
            .upsert({ key: 'cms_config', value: settings }, { onConflict: 'key' });

         if (error) throw error;
         alert('CMS Settings Updated Successfully!');
      } catch (err) {
         console.error('Save settings error:', err);
         alert('Failed to save settings');
      } finally {
         setSaving(false);
      }
   };

   if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-orchid" /></div>;

   return (
      <div className="space-y-10">
         <header className="flex justify-between items-end">
            <div>
               <h1 className="text-3xl font-black font-heading italic tracking-tighter text-deep-teal">Content Registry</h1>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orchid">Interface Overrides & Asset Management</p>
            </div>
            <div className="flex gap-4">
               <button onClick={handleSave} disabled={saving} className="grand-btn btn-orchid-gradient flex items-center gap-2">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
               </button>
            </div>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <div className="grand-panel space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                     <Layout className="text-orchid" size={20} />
                     <h3 className="font-black uppercase tracking-widest text-xs">Global Banner</h3>
                  </div>

                  <div>
                     <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Banner Message</label>
                     <input
                        type="text"
                        value={settings.bannerText}
                        onChange={(e) => setSettings({ ...settings, bannerText: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-orchid outline-none transition-all"
                     />
                  </div>
               </div>

               <div className="grand-panel space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                     <Type className="text-orchid" size={20} />
                     <h3 className="font-black uppercase tracking-widest text-xs">Hero Section</h3>
                  </div>

                  <div className="space-y-4">
                     <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Main Title</label>
                        <input
                           type="text"
                           value={settings.heroTitle}
                           onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-orchid outline-none transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Subtitle / Description</label>
                        <textarea
                           value={settings.heroSubtitle}
                           onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-orchid outline-none transition-all h-24 resize-none"
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="grand-panel">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Live Preview Info</h3>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                     <p className="text-[10px] font-bold text-emerald-800 mb-1 leading-tight">Changes made here will reflect globally across all user sessions in real-time.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminCMS;
