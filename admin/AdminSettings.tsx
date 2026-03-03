import React, { useState, useEffect } from 'react';
import {
    Save, Globe, Truck, Users, Bell,
    CreditCard, ShieldCheck, ChevronRight, Search,
    CheckCircle2, AlertCircle, Upload,
    LogOut, Activity, DollarSign, Lock,
    Check, Settings, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Using the precise data model from the Supabase 'settings' table that we just verified
interface SettingsState {
    storeName: string;
    supportEmail: string;
    flatRateShipping: number;
    // UI Only states for visual richness (not saved to DB unless user wants to expand DB later)
    currency: string;
    taxIncluded: boolean;
    stripeEnabled: boolean;
    notifyOrder: boolean;
    isMaintenanceMode: boolean;
}

const INITIAL_SETTINGS: SettingsState = {
    storeName: 'Fario India',
    supportEmail: 'support@fario.in',
    flatRateShipping: 150,
    currency: 'INR',
    taxIncluded: true,
    stripeEnabled: true,
    notifyOrder: true,
    isMaintenanceMode: false
};

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);
    const [settingsId, setSettingsId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    // Fetch initial settings from our clean database
    useEffect(() => {
        let mounted = true;

        const loadSettings = async () => {
            try {
                const { supabase } = await import('../lib/supabase');
                const { data, error } = await supabase
                    .from('settings')
                    .select('*')
                    .limit(1)
                    .single();

                if (!mounted) return;

                if (data && !error) {
                    setSettingsId(data.id);
                    setSettings(prev => ({
                        ...prev,
                        storeName: data.store_name || prev.storeName,
                        supportEmail: data.support_email || prev.supportEmail,
                        flatRateShipping: data.flat_rate_shipping !== undefined && data.flat_rate_shipping !== null ? Number(data.flat_rate_shipping) : prev.flatRateShipping,
                        isMaintenanceMode: data.is_maintenance_mode ?? prev.isMaintenanceMode
                    }));
                }
            } catch (err) {
                console.error('Failed to load settings:', err);
            } finally {
                if (mounted) setIsLoadingSettings(false);
            }
        };

        loadSettings();

        // Realtime Subscription
        let channel: any;
        const setupRealtime = async () => {
            const { supabase } = await import('../lib/supabase');
            channel = supabase.channel('settings_changes')
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings' }, (payload) => {
                    if (mounted && payload.new) {
                        setSettings(prev => ({
                            ...prev,
                            storeName: payload.new.store_name || prev.storeName,
                            supportEmail: payload.new.support_email || prev.supportEmail,
                            flatRateShipping: payload.new.flat_rate_shipping !== null ? Number(payload.new.flat_rate_shipping) : prev.flatRateShipping,
                            isMaintenanceMode: payload.new.is_maintenance_mode ?? prev.isMaintenanceMode
                        }));
                        showNotification('Settings updated live from database.', 'success');
                    }
                }).subscribe();
        };

        setupRealtime();

        return () => {
            mounted = false;
            if (channel) channel.unsubscribe();
        };
    }, []);

    const update = (key: keyof SettingsState, value: any) => {
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
                flat_rate_shipping: settings.flatRateShipping,
                is_maintenance_mode: settings.isMaintenanceMode
            };

            if (settingsId) {
                const { error } = await supabase.from('settings').update(payload).eq('id', settingsId);
                if (error) throw error;
            } else {
                const { data, error } = await supabase.from('settings').insert(payload).select().single();
                if (error) throw error;
                if (data) setSettingsId(data.id);
            }

            setHasChanges(false);
            showNotification('Settings saved perfectly!');
        } catch (err) {
            console.error('Save error:', err);
            showNotification('Failed to save settings.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    if (isLoadingSettings) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <Activity className="animate-spin text-fario-purple" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] font-sans text-slate-900 pb-20">
            {/* --- TOP HEADER --- */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 md:px-10 py-5 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Settings className="text-fario-purple" size={24} /> Headquarters Config
                    </h1>
                    <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Global Master Layout</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all ${hasChanges
                            ? 'bg-fario-purple hover:bg-[#694389] text-white shadow-fario-purple/20 shadow-lg translate-y-[-2px]'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {isSaving ? <Activity size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Engine
                    </button>
                </div>
            </header>

            <div className="flex flex-col md:flex-row mt-8 max-w-7xl mx-auto px-6 md:px-10 gap-8">

                {/* --- SIDE NAVIGATION --- */}
                <aside className="w-full md:w-64 flex-shrink-0 relative">
                    <div className="md:sticky md:top-32 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-2 space-y-1">
                        {[
                            { id: 'general', label: 'General', icon: Globe },
                            { id: 'payment', label: 'Payments', icon: CreditCard },
                            { id: 'shipping', label: 'Shipping & Tax', icon: Truck },
                            { id: 'team', label: 'Team', icon: Users },
                            { id: 'notifications', label: 'Notifications', icon: Bell },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === item.id
                                    ? 'bg-fario-purple/10 text-fario-purple shadow-inner'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                                {activeTab === item.id && <ChevronRight size={16} className="ml-auto" />}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* --- MAIN CONTENT PANELS --- */}
                <main className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden relative"
                        >
                            {/* Decorative Top Accent */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-fario-purple via-indigo-500 to-fario-purple"></div>

                            {/* === GENERAL SETTINGS === */}
                            {activeTab === 'general' && (
                                <div className="p-8 md:p-10">
                                    <div className="mb-8">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Core Infrastructure</h3>
                                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Base global properties</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Display Name</label>
                                            <input
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-fario-purple focus:ring-4 focus:ring-fario-purple/10 outline-none transition-all"
                                                value={settings.storeName}
                                                onChange={(e) => update('storeName', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Support Email Node</label>
                                            <input
                                                type="email"
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-fario-purple focus:ring-4 focus:ring-fario-purple/10 outline-none transition-all"
                                                value={settings.supportEmail}
                                                onChange={(e) => update('supportEmail', e.target.value)}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <div className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${settings.isMaintenanceMode ? 'border-rose-500 bg-rose-50' : 'border-slate-100 bg-white hover:border-slate-200'}`} onClick={() => update('isMaintenanceMode', !settings.isMaintenanceMode)}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${settings.isMaintenanceMode ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                        <ShieldAlert size={24} />
                                                    </div>
                                                    <div>
                                                        <p className={`font-black tracking-tight ${settings.isMaintenanceMode ? 'text-rose-600' : 'text-slate-900'}`}>Store Maintenance Mode</p>
                                                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                                                            {settings.isMaintenanceMode ? 'All regular users are locked out' : 'Store is fully accessible to public'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.isMaintenanceMode ? 'bg-rose-500' : 'bg-slate-300'}`}>
                                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${settings.isMaintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Master Currency Base</label>
                                            <input
                                                disabled
                                                className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-400 cursor-not-allowed uppercase tracking-widest"
                                                value="INR (₹)"
                                            />
                                            <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1"><ShieldCheck size={12} /> Locked at database level</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* === SHIPPING SETTINGS === */}
                            {activeTab === 'shipping' && (
                                <div className="p-8 md:p-10">
                                    <div className="mb-8">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2"><Truck className="text-emerald-500" /> Logistics Engine</h3>
                                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Delivery and taxation logic</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Standard Delivery Tariff</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-3.5 text-slate-400 font-bold">Rs.</span>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-4 py-3.5 text-sm font-black focus:border-emerald-500 outline-none transition-all"
                                                        value={settings.flatRateShipping}
                                                        onChange={(e) => update('flatRateShipping', Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-xl border-2 border-emerald-100 bg-emerald-50/50 flex items-center justify-between cursor-pointer" onClick={() => update('taxIncluded', !settings.taxIncluded)}>
                                                <div>
                                                    <p className="text-sm font-black text-emerald-900">Tax Included in Prices</p>
                                                    <p className="text-[10px] uppercase tracking-wide text-emerald-600 font-bold mt-1">Global application</p>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.taxIncluded ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${settings.taxIncluded ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 flex flex-col justify-center text-center">
                                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-200">
                                                <DollarSign className="text-emerald-500" />
                                            </div>
                                            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Tax System Online</p>
                                            <p className="text-xs text-slate-500 mt-2 font-medium">Your platform is calculating tax logic internally.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* === PAYMENT SETTINGS (MOCK) === */}
                            {activeTab === 'payment' && (
                                <div className="p-8 md:p-10">
                                    <div className="mb-8">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2"><CreditCard className="text-blue-500" /> Payment Gateways</h3>
                                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Connected financial nodes</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className={`border-2 rounded-2xl p-5 flex items-center justify-between transition-colors ${settings.stripeEnabled ? 'border-fario-purple/50 bg-fario-purple/5' : 'border-slate-100'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#635BFF] rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-[#635BFF]/30">S</div>
                                                <div>
                                                    <p className="font-black text-slate-900">Stripe Global Processing</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Cards • Wallets • UPI</p>
                                                </div>
                                            </div>
                                            <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${settings.stripeEnabled ? 'bg-fario-purple' : 'bg-slate-300'}`} onClick={() => update('stripeEnabled', !settings.stripeEnabled)}>
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${settings.stripeEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </div>
                                        </div>
                                        {!settings.stripeEnabled && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-2"><AlertCircle size={10} className="inline mr-1 mb-0.5" /> Manual mode activated</p>}
                                    </div>
                                </div>
                            )}

                            {/* === PLACEHOLDER TABS === */}
                            {(activeTab === 'team' || activeTab === 'notifications') && (
                                <div className="p-8 md:p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                                    <div className="w-20 h-20 bg-slate-50 border-2 border-slate-100 rounded-full flex items-center justify-center mb-6">
                                        <Lock className="text-slate-300" size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Enterprise Access Restricted</h3>
                                    <p className="text-sm font-bold text-slate-400 mt-2 max-w-sm leading-relaxed">This node requires advanced infrastructure setup. Team structures and Email/SMS hooks are managed via Cloudflare workers.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`fixed bottom-10 right-10 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 text-white border ${notification.type === 'error'
                            ? 'bg-rose-600 shadow-rose-600/20 border-rose-500'
                            : 'bg-slate-900 shadow-slate-900/30 border-slate-800'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'error' ? 'bg-rose-500' : 'bg-[#7a51a0]'}`}>
                            {notification.type === 'success' ? <Check size={16} strokeWidth={4} /> : <AlertCircle size={16} />}
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">{notification.msg}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminSettings;
