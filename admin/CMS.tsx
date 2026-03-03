import React, { useState, useEffect } from 'react';
import { Save, Loader2, Layout, Type, UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminCMS: React.FC = () => {
   const [settings, setSettings] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [uploading, setUploading] = useState(false);

   useEffect(() => {
      fetchSettings();
   }, []);

   const fetchSettings = async () => {
      try {
         const { data } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'cms_config')
            .single();

         if (data) {
            setSettings(data.value);
         } else {
            setSettings({
               bannerText: "Free Delivery on all orders above Rs. 999",
               heroTitle: "Step into the Future",
               heroSubtitle: "Engineered for elite performance and everyday comfort.",
               cms_images: []
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

   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement> | any) => {
      const files = e.target.files || e.dataTransfer.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      try {
         const newImages = [];
         for (const file of Array.from(files) as File[]) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const { data, error } = await supabase.storage.from('assets').upload(`cms/${fileName}`, file);

            if (error) {
               console.error('Upload Error:', error);
               continue;
            }
            if (data) {
               const { data: publicUrlData } = supabase.storage.from('assets').getPublicUrl(data.path);
               newImages.push(publicUrlData.publicUrl);
            }
         }

         setSettings((prev: any) => ({
            ...prev,
            cms_images: [...(prev.cms_images || []), ...newImages]
         }));
      } catch (err) {
         console.error('Upload failed', err);
         alert('Failed to upload image(s)');
      } finally {
         setUploading(false);
      }
   };

   const removeImage = (index: number) => {
      const newImages = [...(settings.cms_images || [])];
      newImages.splice(index, 1);
      setSettings({ ...settings, cms_images: newImages });
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

               <div className="grand-panel space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                     <ImageIcon className="text-orchid" size={20} />
                     <h3 className="font-black uppercase tracking-widest text-xs">Media Gallery</h3>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                     className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer relative"
                     onDragOver={(e) => e.preventDefault()}
                     onDrop={(e) => { e.preventDefault(); handleImageUpload(e); }}
                  >
                     <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                        disabled={uploading}
                     />
                     {uploading ? (
                        <div className="flex flex-col items-center">
                           <Loader2 className="animate-spin text-orchid mb-2" size={32} />
                           <span className="text-xs font-bold text-slate-500 uppercase">Uploading...</span>
                        </div>
                     ) : (
                        <div className="flex flex-col items-center pointer-events-none">
                           <UploadCloud className="text-slate-400 mb-3" size={40} />
                           <p className="text-sm font-bold text-slate-700">Drag & Drop images here</p>
                           <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Or click to browse</p>
                        </div>
                     )}
                  </div>

                  {/* Image Grid */}
                  {settings.cms_images && settings.cms_images.length > 0 && (
                     <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-6">
                        {settings.cms_images.map((url: string, idx: number) => (
                           <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                              <img src={url} alt={`cms-${idx}`} className="w-full h-full object-cover" />
                              <button
                                 onClick={() => removeImage(idx)}
                                 className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-rose-50"
                              >
                                 <X size={14} />
                              </button>
                           </div>
                        ))}
                     </div>
                  )}
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
