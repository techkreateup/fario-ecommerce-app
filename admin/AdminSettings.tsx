import React, { useState, useEffect } from 'react';
import { Save, Globe, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSettings: React.FC = () => {
    const [settings, setSettings] = useState({
        storeName: 'Fario India',
        supportEmail: 'support@fario.in',
        currency: 'INR',
        flatRateShipping: 150
    });
    const [settingsId, setSettingsId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    // Fetch initial settings
    useEffect(() => {
        const load = async () => {
            try {
                const { supabase } = await import('../lib/supabase');
                const { data, error } = await supabase.from('settings').select('*').limit(1).single();

                if (data && !error) {
                    setSettingsId(data.id);
                    setSettings({
                        storeName: data.store_name || 'Fario India',
                        supportEmail: data.support_email || 'support@fario.in',
                        currency: 'INR',
                        flatRateShipping: data.flat_rate_shipping || 150
                    });
                }
            } catch (err) {
                console.error('Settings load err:', err);
            }
        };
        load();
    }, []);

    const update = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { supabase } = await import('../lib/supabase');
            const payload = {
                store_name: settings.storeName,
                support_email: settings.supportEmail,
                flat_rate_shipping: settings.flatRateShipping
            };

            if (settingsId) {
                await supabase.from('settings').update(payload).eq('id', settingsId);
            } else {
                const { data } = await supabase.from('settings').insert(payload).select().single();
                if (data) setSettingsId(data.id);
            }

            setHasChanges(false);
            showNotification('Settings saved!');
        } catch (err) {
            showNotification('Failed to save settings.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Globe className="text-fario-purple" />
                            Store Settings
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Manage core Fario configuration</p>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-all ${hasChanges
                                ? 'bg-fario-purple hover:bg-purple-800 text-white shadow-fario-purple/20 shadow-lg translate-y-[-2px]'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {isSaving ? <Activity size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Store Name</label>
                            <input
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-fario-purple focus:ring-1 focus:ring-fario-purple outline-none transition-all"
                                value={settings.storeName}
                                onChange={(e) => update('storeName', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Support Email</label>
                            <input
                                type="email"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-fario-purple focus:ring-1 focus:ring-fario-purple outline-none transition-all"
                                value={settings.supportEmail}
                                onChange={(e) => update('supportEmail', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Standard Shipping Rate (Rs.)</label>
                            <input
                                type="number"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-fario-purple focus:ring-1 focus:ring-fario-purple outline-none transition-all"
                                value={settings.flatRateShipping}
                                onChange={(e) => update('flatRateShipping', Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Default Currency</label>
                            <input
                                disabled
                                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
                                value="INR (₹)"
                            />
                        </div>

                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 text-white font-bold text-sm ${notification.type === 'error' ? 'bg-rose-500' : 'bg-fario-purple'
                            }`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        {notification.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminSettings;
