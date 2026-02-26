
import React, { useState, useEffect } from 'react';
import {
    Save, Globe, Truck, Users, Bell,
    CreditCard, ShieldCheck, ChevronRight, Search,
    CheckCircle2, AlertCircle, Upload,
    LogOut, Activity, DollarSign, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
interface SettingsState {
    // General
    storeName: string;
    supportEmail: string;
    storeAddress: string;
    timeZone: string;
    logoUrl: string;

    // Payment
    stripeEnabled: boolean;
    stripeKey: string;
    paypalEnabled: boolean;
    paypalClientId: string;
    testMode: boolean;

    // Shipping & Tax
    flatRateShipping: number;
    freeShippingThreshold: number;
    taxRate: number;
    taxIncluded: boolean;

    // Notifications
    notifyOrderEmail: boolean;
    notifyLowStockEmail: boolean;
    notifyOrderSMS: boolean;

    // Security (Retained)
    masterKey: string;
}

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Viewer';
    status: 'Active' | 'Invited';
}

const INITIAL_SETTINGS: SettingsState = {
    storeName: 'Fario India',
    supportEmail: 'support@fario.in',
    storeAddress: '123 Commerce St, Mumbai, MH',
    timeZone: 'Asia/Kolkata',
    logoUrl: '',
    stripeEnabled: true,
    stripeKey: 'pk_live_...x92',
    paypalEnabled: false,
    paypalClientId: '',
    testMode: false,
    flatRateShipping: 150,
    freeShippingThreshold: 2000,
    taxRate: 18,
    taxIncluded: true,
    notifyOrderEmail: true,
    notifyLowStockEmail: true,
    notifyOrderSMS: false,
    masterKey: 'sk_live_...x92',
};

const MOCK_TEAM: TeamMember[] = [];

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);
    const [settingsId, setSettingsId] = useState<string | null>(null);
    const [team] = useState<TeamMember[]>(MOCK_TEAM);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [, setIsLoadingSettings] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    // --- FETCH SETTINGS FROM SUPABASE ---
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const { supabase } = await import('../lib/supabase');
                const { data, error } = await supabase
                    .from('settings')
                    .select('*')
                    .limit(1)
                    .single();

                if (error) throw error;
                if (data) {
                    setSettingsId(data.id);
                    setSettings({
                        storeName: data.store_name ?? INITIAL_SETTINGS.storeName,
                        supportEmail: data.support_email ?? INITIAL_SETTINGS.supportEmail,
                        storeAddress: data.store_address ?? INITIAL_SETTINGS.storeAddress,
                        timeZone: data.time_zone ?? INITIAL_SETTINGS.timeZone,
                        logoUrl: data.logo_url ?? '',
                        stripeEnabled: data.stripe_enabled ?? true,
                        stripeKey: data.stripe_key ?? '',
                        paypalEnabled: data.paypal_enabled ?? false,
                        paypalClientId: data.paypal_client_id ?? '',
                        testMode: data.test_mode ?? false,
                        flatRateShipping: data.flat_rate_shipping ?? 150,
                        freeShippingThreshold: data.free_shipping_threshold ?? 2000,
                        taxRate: data.tax_rate ?? 18,
                        taxIncluded: data.tax_included ?? true,
                        notifyOrderEmail: data.notify_order_email ?? true,
                        notifyLowStockEmail: data.notify_low_stock_email ?? true,
                        notifyOrderSMS: data.notify_order_sms ?? false,
                        masterKey: data.master_key ?? '',
                    });
                }
            } catch (err) {
                console.error('Failed to load settings:', err);
                showNotification('Failed to load settings from server.', 'error');
            } finally {
                setIsLoadingSettings(false);
            }
        };

        loadSettings();

        // --- REAL-TIME SUBSCRIPTION ---
        let channel: any;
        let supabaseInstance: any;

        const subscribeToSettings = async () => {
            const { supabase } = await import('../lib/supabase');
            supabaseInstance = supabase;
            channel = supabase
                .channel('settings_changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'settings'
                    },
                    (payload) => {
                        const newData = payload.new;
                        if (newData) {
                            setSettings(prev => ({
                                ...prev,
                                storeName: newData.store_name,
                                supportEmail: newData.support_email,
                                storeAddress: newData.store_address,
                                timeZone: newData.time_zone,
                                logoUrl: newData.logo_url || '',
                                stripeEnabled: newData.stripe_enabled,
                                stripeKey: newData.stripe_key || '',
                                paypalEnabled: newData.paypal_enabled,
                                paypalClientId: newData.paypal_client_id || '',
                                testMode: newData.test_mode,
                                flatRateShipping: newData.flat_rate_shipping,
                                freeShippingThreshold: newData.free_shipping_threshold,
                                taxRate: newData.tax_rate,
                                taxIncluded: newData.tax_included,
                                notifyOrderEmail: newData.notify_order_email,
                                notifyLowStockEmail: newData.notify_low_stock_email,
                                notifyOrderSMS: newData.notify_order_sms,
                                masterKey: newData.master_key || ''
                            }));
                            showNotification('Settings updated from another session.', 'success');
                        }
                    }
                )
                .subscribe();
        };

        subscribeToSettings();

        return () => {
            if (channel && supabaseInstance) supabaseInstance.removeChannel(channel);
        };
    }, []);

    // --- HANDLERS ---
    const update = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
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
                store_address: settings.storeAddress,
                time_zone: settings.timeZone,
                logo_url: settings.logoUrl,
                stripe_enabled: settings.stripeEnabled,
                stripe_key: settings.stripeKey,
                paypal_enabled: settings.paypalEnabled,
                paypal_client_id: settings.paypalClientId,
                test_mode: settings.testMode,
                flat_rate_shipping: settings.flatRateShipping,
                free_shipping_threshold: settings.freeShippingThreshold,
                tax_rate: settings.taxRate,
                tax_included: settings.taxIncluded,
                notify_order_email: settings.notifyOrderEmail,
                notify_low_stock_email: settings.notifyLowStockEmail,
                notify_order_sms: settings.notifyOrderSMS,
                master_key: settings.masterKey,
            };

            if (settingsId) {
                const { error } = await supabase
                    .from('settings')
                    .update(payload)
                    .eq('id', settingsId);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('settings')
                    .insert(payload)
                    .select()
                    .single();
                if (error) throw error;
                if (data) setSettingsId(data.id);
            }

            setHasChanges(false);
            showNotification('Settings saved successfully.');
        } catch (err) {
            console.error('Failed to save settings:', err);
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
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex">

            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col fixed top-0 bottom-0 z-50">
                {/* Universal Search */}
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                        <input
                            placeholder="Universal search..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-9 text-xs font-medium focus:outline-none focus:border-[#7a51a0] transition-colors"
                        />
                    </div>
                </div>

                {/* Profile Card */}
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7a51a0] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        AS
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Akash Sundar</p>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Master Admin</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                    {[
                        { id: 'general', label: 'General', icon: Globe },
                        { id: 'payment', label: 'Payments', icon: CreditCard },
                        { id: 'team', label: 'Team & Roles', icon: Users },
                        { id: 'shipping', label: 'Shipping & Tax', icon: Truck },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Security', icon: ShieldCheck },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === item.id
                                ? 'bg-slate-50 text-[#7a51a0] ring-1 ring-slate-200'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon size={16} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* System Footer */}
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-red-600 cursor-pointer transition-colors">
                        <LogOut size={14} /> Sign Out
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 ml-64 min-w-0 bg-[#f8fafc]">

                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-8 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                placeholder="Search settings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-1.5 bg-slate-100 border-transparent rounded-md text-sm focus:bg-white focus:border-[#7a51a0] focus:ring-0 transition-all w-64"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Widgets */}
                        <div className="flex items-center gap-6 border-right border-slate-200 pr-6">
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Active Users</p>
                                <p className="text-lg font-bold text-slate-900 leading-tight">24</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Today's Orders</p>
                                <p className="text-lg font-bold text-slate-900 leading-tight">12</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !hasChanges}
                                className={`px-5 py-2 rounded-md text-sm font-bold shadow-sm flex items-center gap-2 transition-all ${hasChanges
                                    ? 'bg-[#7a51a0] hover:bg-[#694389] text-white'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                {isSaving ? <Activity size={16} className="animate-spin" /> : <Save size={16} />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="p-8 max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >

                            {/* === GENERAL === */}
                            {activeTab === 'general' && (
                                <Card title="Store Information" desc="Configure your basic store details.">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Field label="Store Name">
                                            <Input value={settings.storeName} onChange={(v: string) => update('storeName', v)} />
                                        </Field>
                                        <Field label="Support Email">
                                            <Input value={settings.supportEmail} onChange={(v: string) => update('supportEmail', v)} type="email" />
                                        </Field>
                                        <div className="md:col-span-2">
                                            <Field label="Store Address">
                                                <Input value={settings.storeAddress} onChange={(v: string) => update('storeAddress', v)} />
                                            </Field>
                                        </div>
                                        <Field label="Time Zone">
                                            <Select value={settings.timeZone} onChange={(v: string) => update('timeZone', v)}>
                                                <option>Asia/Kolkata</option>
                                                <option>America/New_York</option>
                                                <option>Europe/London</option>
                                            </Select>
                                        </Field>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-slate-900 mb-2">Store Logo</label>
                                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                                                <Upload size={24} className="mb-2" />
                                                <span className="text-sm font-medium">Click to upload or drag and drop</span>
                                                <span className="text-xs">SVG, PNG, JPG (max 2MB)</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* === PAYMENT === */}
                            {activeTab === 'payment' && (
                                <>
                                    <Card title="Payment Gateways" desc="Manage active payment providers.">
                                        <div className="space-y-6">
                                            <div className="flex items-start justify-between p-4 border border-slate-200 rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-[#635BFF] text-white rounded flex items-center justify-center font-bold text-xs">Stripe</div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">Stripe</p>
                                                        <p className="text-xs text-slate-500">Credit Card, Apple Pay, Google Pay</p>
                                                    </div>
                                                </div>
                                                <Switch checked={settings.stripeEnabled} onChange={(v: boolean) => update('stripeEnabled', v)} />
                                            </div>
                                            {settings.stripeEnabled && (
                                                <div className="ml-14 space-y-3">
                                                    <Field label="Publishable Key">
                                                        <Input value={settings.stripeKey} onChange={(v: string) => update('stripeKey', v)} className="font-mono text-xs" />
                                                    </Field>
                                                </div>
                                            )}

                                            <div className="flex items-start justify-between p-4 border border-slate-200 rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-[#003087] text-white rounded flex items-center justify-center font-bold text-xs">PayPal</div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">PayPal</p>
                                                        <p className="text-xs text-slate-500">PayPal Wallet, Venmo</p>
                                                    </div>
                                                </div>
                                                <Switch checked={settings.paypalEnabled} onChange={(v: boolean) => update('paypalEnabled', v)} />
                                            </div>
                                        </div>
                                    </Card>
                                </>
                            )}

                            {/* === TEAM === */}
                            {activeTab === 'team' && (
                                <Card title="Team Members" desc="Manage access and permissions.">
                                    <div className="overflow-hidden border border-slate-200 rounded-lg">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">User</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Role</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                                    <th className="px-6 py-3 text-right"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 bg-white">
                                                {team.map(member => (
                                                    <tr key={member.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                                    {member.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-900">{member.name}</p>
                                                                    <p className="text-xs text-slate-500">{member.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{member.role}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                {member.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                            <button className="text-[#7a51a0] font-bold hover:underline">Edit</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button className="mt-4 text-sm font-bold text-[#7a51a0] flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
                                        + Add Team Member
                                    </button>
                                </Card>
                            )}

                            {/* === SHIPPING & TAX === */}
                            {activeTab === 'shipping' && (
                                <Card title="Shipping & Tax Rules" desc="Configure regional rates.">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Truck size={16} /> Shipping</h4>
                                            <div className="space-y-4">
                                                <Field label="Flat Rate Shipping Cost">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold">Rs.</span>
                                                        <Input
                                                            type="number"
                                                            className="pl-8"
                                                            value={settings.flatRateShipping}
                                                            onChange={(v: any) => update('flatRateShipping', parseFloat(v))}
                                                        />
                                                    </div>
                                                </Field>
                                                <Field label="Free Shipping Threshold">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold">Rs.</span>
                                                        <Input
                                                            type="number"
                                                            className="pl-8"
                                                            value={settings.freeShippingThreshold}
                                                            onChange={(v: any) => update('freeShippingThreshold', parseFloat(v))}
                                                        />
                                                    </div>
                                                </Field>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><DollarSign size={16} /> Taxes</h4>
                                            <div className="space-y-4">
                                                <Field label="Standard Tax Rate (%)">
                                                    <Input
                                                        type="number"
                                                        value={settings.taxRate}
                                                        onChange={(v: any) => update('taxRate', parseFloat(v))}
                                                    />
                                                </Field>
                                                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                                                    <span className="text-sm font-medium text-slate-700">All prices include tax</span>
                                                    <Switch checked={settings.taxIncluded} onChange={(v: boolean) => update('taxIncluded', v)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* === NOTIFICATIONS === */}
                            {activeTab === 'notifications' && (
                                <Card title="Notification Preferences" desc="Select how you want to be alerted.">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-12 gap-4 border-b border-slate-100 pb-2 text-xs font-bold text-slate-400 uppercase">
                                            <div className="col-span-8">Event</div>
                                            <div className="col-span-2 text-center">Email</div>
                                            <div className="col-span-2 text-center">SMS</div>
                                        </div>

                                        <NotificationRow label="New Order Received"
                                            email={settings.notifyOrderEmail}
                                            sms={settings.notifyOrderSMS}
                                            onEmail={(v: boolean) => update('notifyOrderEmail', v)}
                                            onSMS={(v: boolean) => update('notifyOrderSMS', v)}
                                        />
                                        <NotificationRow label="Low Stock Warning"
                                            email={settings.notifyLowStockEmail}
                                            sms={false}
                                            onEmail={(v: boolean) => update('notifyLowStockEmail', v)}
                                            onSMS={() => { }}
                                        />
                                    </div>
                                </Card>
                            )}

                            {/* === SECURITY === */}
                            {activeTab === 'security' && (
                                <Card title="API Access" desc="Manage developer keys.">
                                    <Field label="Master API Key">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Input value={settings.masterKey} disabled className="bg-slate-50 text-slate-500 font-mono pr-10" />
                                                <Lock className="absolute right-3 top-2.5 text-slate-400" size={14} />
                                            </div>
                                            <button className="px-4 border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">Reveal</button>
                                        </div>
                                    </Field>
                                </Card>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* TOAST */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 text-white font-medium ${notification.type === 'error' ? 'bg-red-500' : 'bg-[#7a51a0]'
                            }`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {notification.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- COMPONENTS ---

const Card = ({ title, desc, children }: any) => (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {desc && <p className="text-sm text-slate-500 mt-1">{desc}</p>}
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const Field = ({ label, children }: any) => (
    <div className="mb-1">
        <label className="block text-sm font-bold text-slate-900 mb-2">{label}</label>
        {children}
    </div>
);

const Input = ({ className, ...props }: any) => (
    <input
        {...props}
        className={`w-full rounded-lg border-slate-300 shadow-sm focus:border-[#7a51a0] focus:ring-[#7a51a0] text-sm py-2.5 px-3 border transition-all ${className}`}
    />
);

const Select = ({ children, onChange, value }: any) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none w-full rounded-lg border-slate-300 shadow-sm focus:border-[#7a51a0] focus:ring-[#7a51a0] text-sm py-2.5 px-3 border bg-white"
        >
            {children}
        </select>
        <ChevronRight className="absolute right-3 top-3 text-slate-400 rotate-90" size={16} />
    </div>
);

const Switch = ({ checked, onChange }: any) => (
    <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7a51a0] ${checked ? 'bg-[#7a51a0]' : 'bg-slate-300'}`}
    >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const NotificationRow = ({ label, email, sms, onEmail, onSMS }: any) => (
    <div className="grid grid-cols-12 gap-4 items-center py-2">
        <div className="col-span-8 text-sm font-medium text-slate-900">{label}</div>
        <div className="col-span-2 flex justify-center"><Switch checked={email} onChange={onEmail} /></div>
        <div className="col-span-2 flex justify-center"><Switch checked={sms} onChange={onSMS} /></div>
    </div>
);

export default AdminSettings;
