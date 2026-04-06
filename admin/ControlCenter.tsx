
import React, { useState, useEffect } from 'react';
import {
    Save, Layout, Globe, Truck, Users, Bell,
    Package, Server, ShieldCheck, ChevronRight,
    CheckCircle2, AlertCircle, CreditCard,
    RefreshCw, Download, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { driveVideo } from '../constants';

// --- TYPES & INTERFACES ---

interface UserRole {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
    permissions: {
        inventory: 'None' | 'View' | 'Edit' | 'Admin';
        orders: 'None' | 'View' | 'Edit' | 'Admin';
        pricing: 'None' | 'View' | 'Edit' | 'Admin';
    }
}

interface ShippingTemplate {
    id: string;
    name: string;
    isDefault: boolean;
    transitTime: string;
    priceModel: 'Per Item/Weight' | 'Price Banded';
}

interface SettingsState {
    // General
    storeName: string;
    legalName: string;
    merchantToken: string;
    taxId: string;
    taxCalculation: boolean;

    // Branding
    accentColor: string;
    heroVideo: string;

    // Inventory & FBA
    stockThreshold: number;
    ghostMode: boolean;
    unfulfillableAction: 'Return' | 'Dispose';
    disposalSchedule: 'Weekly' | 'Monthly';

    // Shipping
    handlingTime: string;
    operatingDays: string[];
    cutoffTime: string;

    // Security
    masterKey: string;
    panicMode: boolean;
    twoFactor: boolean;

    // Notification Prefs (Granular)
    notifySold: boolean;
    notifyShipped: boolean;
    notifyReturns: boolean;
    notifyClaims: boolean;
    notifyHealth: boolean;
}

const INITIAL_SETTINGS: SettingsState = {
    storeName: 'Fario India',
    legalName: 'Fario Retail Pvt Ltd',
    merchantToken: 'M-8842-X92-Q',
    taxId: '',
    taxCalculation: true,
    accentColor: localStorage.getItem('fario_theme_accent') || '#7a51a0',
    heroVideo: localStorage.getItem('fario_hero_video') || '',
    stockThreshold: 10,
    ghostMode: localStorage.getItem('fario_autohide_stock') === 'true',
    unfulfillableAction: 'Return',
    disposalSchedule: 'Weekly',
    handlingTime: '1 Day',
    operatingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    cutoffTime: '14:00',
    masterKey: 'sk_live_••••••••••••••••x92',
    panicMode: localStorage.getItem('fario_panic_mode') === 'true',
    twoFactor: true,
    notifySold: true,
    notifyShipped: false,
    notifyReturns: true,
    notifyClaims: true,
    notifyHealth: true,
};

const MOCK_USERS: UserRole[] = [];

const MOCK_TEMPLATES: ShippingTemplate[] = [];

// --- MAIN COMPONENT ---

const ControlCenter: React.FC = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    // Sync Global Styles
    useEffect(() => {
        document.documentElement.style.setProperty('--accent', settings.accentColor);
    }, [settings.accentColor]);

    // Handler: Update specific setting
    const update = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    // Handler: Save All
    const handleSave = () => {
        setIsSaving(true);
        // Simulate API delay
        setTimeout(() => {
            localStorage.setItem('fario_theme_accent', settings.accentColor);
            localStorage.setItem('fario_hero_video', driveVideo(settings.heroVideo));
            localStorage.setItem('fario_autohide_stock', String(settings.ghostMode));
            localStorage.setItem('fario_panic_mode', String(settings.panicMode));

            setIsSaving(false);
            setHasChanges(false);
            showNotification('Settings successfully synchronized.');
        }, 1200);
    };

    const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-900 pb-24">

            {/* --- HEADER --- */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                        <div className="w-8 h-8 md:w-9 md:h-9 bg-[#232f3e] rounded flex items-center justify-center text-white flex-shrink-0">
                            <Layout size={18} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-sm md:text-lg font-bold text-[#232f3e] leading-tight truncate">Settings</h1>
                            <p className="text-[10px] md:text-xs text-slate-500 font-medium truncate">Admin Console</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
                            <Activity size={12} /> System Operational
                        </div>
                        {hasChanges && (
                            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                <span className="text-xs font-bold text-amber-600 mr-2">Unsaved Changes</span>
                            </motion.div>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !hasChanges}
                            className={`px-4 md:px-6 py-2 rounded-md text-[11px] md:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 md:gap-2 ${hasChanges
                                ? 'bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 border border-[#FCD200]' // Amazon Yellow
                                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                }`}
                        >
                            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                            <span className="hidden sm:inline">Save</span>
                            <span className="sm:hidden">Save</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col md:flex-row items-start gap-4 md:gap-8">

                {/* SIDEBAR NAVIGATION (Pillars) */}
                <nav className="w-full md:w-64 flex-shrink-0 sticky top-16 md:top-24 z-20 md:z-10 bg-[#f1f5f9] md:bg-transparent -mx-4 md:mx-0 px-4 md:px-0 py-3 md:py-0 overflow-x-auto no-scrollbar md:overflow-visible flex flex-row md:flex-col gap-1 md:gap-1.5 border-b md:border-b-0 border-slate-200 md:border-transparent">
                    {[
                        { id: 'account', label: 'Account Info', icon: Globe },
                        { id: 'shipping', label: 'Shipping', icon: Truck },
                        { id: 'permissions', label: 'Users', icon: Users },
                        { id: 'notifications', label: 'Alerts', icon: Bell },
                        { id: 'fba', label: 'Inventory', icon: Package },
                        { id: 'security', label: 'Security', icon: ShieldCheck },
                        { id: 'system', label: 'System', icon: Server },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 text-xs md:text-sm font-medium rounded-full md:rounded-md transition-all whitespace-nowrap flex-shrink-0 ${activeTab === item.id
                                ? 'bg-white text-[#232f3e] shadow-sm ring-1 ring-slate-200 border-l-0 md:border-l-4 md:border-l-[#7a51a0] text-[#7a51a0] md:text-[#232f3e]'
                                : 'text-slate-600 hover:bg-white/50 hover:text-[#232f3e]'
                                }`}
                        >
                            <item.icon size={16} className={activeTab === item.id ? 'text-[#7a51a0]' : 'text-slate-400'} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="space-y-6"
                        >

                            {/* === 1. ACCOUNT INFO === */}
                            {activeTab === 'account' && (
                                <>
                                    <Card title="Identity Information">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <Field label="Display Name (Storefront)">
                                                <Input value={settings.storeName} onChange={(v: string) => update('storeName', v)} />
                                            </Field>
                                            <Field label="Legal Business Name">
                                                <Input value={settings.legalName} onChange={(v: string) => update('legalName', v)} />
                                            </Field>
                                            <Field label="Merchant Token">
                                                <div className="font-mono text-[11px] md:text-sm bg-slate-50 p-2 border border-slate-200 rounded text-slate-600 break-all">
                                                    {settings.merchantToken}
                                                </div>
                                            </Field>
                                            <Field label="Primary Region">
                                                <div className="flex items-center gap-2 text-xs md:text-sm text-slate-700">
                                                    <Globe size={14} className="text-blue-500" />
                                                    ap-south-1 (Mumbai)
                                                </div>
                                            </Field>
                                        </div>
                                    </Card>

                                    <Card title="Tax Information">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">Tax Calculation Service</p>
                                                <p className="text-xs text-slate-500">Automatically calculate GST/VAT on orders.</p>
                                            </div>
                                            <Switch checked={settings.taxCalculation} onChange={(v: boolean) => update('taxCalculation', v)} />
                                        </div>
                                        <Field label="GST Registration Number">
                                            <Input placeholder="22AAAAA0000A1Z5" value={settings.taxId} onChange={(v: string) => update('taxId', v)} />
                                        </Field>
                                    </Card>

                                    <Card title="Deposit Methods">
                                        <div className="border border-slate-200 rounded-lg p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 gap-3">
                                            <div className="flex items-center gap-3">
                                                <CreditCard size={24} className="text-slate-400 flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 truncate">HDFC Bank •••• 8842</p>
                                                    <p className="text-[11px] md:text-xs text-slate-500 truncate">Default for Amazon.in</p>
                                                </div>
                                            </div>
                                            <button className="text-xs md:text-sm font-bold text-[#007185] hover:underline self-start sm:self-auto">Manage Deposit Information</button>
                                        </div>
                                    </Card>
                                </>
                            )}

                            {/* === 2. SHIPPING SETTINGS === */}
                            {activeTab === 'shipping' && (
                                <>
                                    <Card title="General Shipping Settings">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                            <Field label="Default Handling Time" helper="Days needed to pack and ship.">
                                                <select
                                                    value={settings.handlingTime}
                                                    onChange={(e: any) => update('handlingTime', e.target.value)}
                                                    className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-[#7a51a0] focus:ring-[#7a51a0] border p-2"
                                                >
                                                    <option>Same Day</option>
                                                    <option>1 Day</option>
                                                    <option>2 Days</option>
                                                </select>
                                            </Field>
                                            <Field label="Order Cutoff Time" helper="For same-day processing.">
                                                <Input type="time" value={settings.cutoffTime} onChange={(v: string) => update('cutoffTime', v)} />
                                            </Field>
                                        </div>
                                        <div className="mt-6">
                                            <label className="block text-sm font-bold text-slate-900 mb-2">Operating Days</label>
                                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                                    <label key={day} className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.operatingDays.includes(day)}
                                                            onChange={() => {/* Dummy Logic */ }}
                                                            className="rounded border-slate-300 text-[#7a51a0] focus:ring-[#7a51a0]"
                                                        />
                                                        <span className="text-sm text-slate-600">{day}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>

                                    <Card title="Shipping Templates">
                                        <div className="overflow-hidden border border-slate-200 rounded-lg">
                                            <table className="min-w-full divide-y divide-slate-200">
                                                <thead className="bg-slate-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Template Name</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Transit Time</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Model</th>
                                                        <th className="px-6 py-3 text-right"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-slate-200">
                                                    {MOCK_TEMPLATES.map(t => (
                                                        <tr key={t.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center gap-2">
                                                                {t.name} {t.isDefault && <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-200">Default</span>}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{t.transitTime}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{t.priceModel}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                                <button className="text-[#007185] hover:underline font-medium">Edit</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <button className="text-sm font-bold text-[#232f3e] border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-50">
                                                Create New Template
                                            </button>
                                        </div>
                                    </Card>
                                </>
                            )}

                            {/* === 3. USER PERMISSIONS === */}
                            {activeTab === 'permissions' && (
                                <Card title="User Permissions">
                                    <p className="text-sm text-slate-500 mb-6">Manage access to specific functionality for secondary users.</p>

                                    <div className="space-y-8">
                                        {MOCK_USERS.map(user => (
                                            <div key={user.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                                                <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900">{user.name} <span className="text-xs font-normal text-slate-500">({user.email})</span></h4>
                                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded textxs font-medium ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'}`}>
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                    <button className="text-[#007185] text-sm hover:underline">Manage</button>
                                                </div>

                                                {/* Permissions Matrix */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {Object.entries(user.permissions).map(([module, level]) => (
                                                        <div key={module}>
                                                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">{module}</p>
                                                            <div className="flex flex-col gap-1">
                                                                {['None', 'View', 'Edit', 'Admin'].map(option => (
                                                                    <div key={option} className={`flex items-center gap-2 text-sm ${level === option ? 'text-[#7a51a0] font-bold' : 'text-slate-400'}`}>
                                                                        <div className={`w-3 h-3 rounded-full border ${level === option ? 'bg-[#7a51a0] border-[#7a51a0]' : 'border-slate-300'}`} />
                                                                        {option}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="mt-8 w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-bold hover:border-[#7a51a0] hover:text-[#7a51a0] transition-colors">
                                        + Invite a new user
                                    </button>
                                </Card>
                            )}

                            {/* === 4. NOTIFICATIONS === */}
                            {activeTab === 'notifications' && (
                                <Card title="Notification Preferences">
                                    <div className="space-y-6">
                                        <NotificationGroup title="Order Notifications">
                                            <SwitchRow
                                                label="Merchant Order Notifications (Sold, Ship Now)"
                                                checked={settings.notifySold}
                                                onChange={(v: boolean) => update('notifySold', v)}
                                            />
                                            <SwitchRow
                                                label="Fulfillment Shipment Notifications"
                                                checked={settings.notifyShipped}
                                                onChange={(v: boolean) => update('notifyShipped', v)}
                                            />
                                        </NotificationGroup>

                                        <NotificationGroup title="Returns & Claims">
                                            <SwitchRow
                                                label="Pending Returns"
                                                checked={settings.notifyReturns}
                                                onChange={(v: boolean) => update('notifyReturns', v)}
                                            />
                                            <SwitchRow
                                                label="Claims & Chargebacks"
                                                checked={settings.notifyClaims}
                                                onChange={(v: boolean) => update('notifyClaims', v)}
                                            />
                                        </NotificationGroup>

                                        <NotificationGroup title="Account Health">
                                            <SwitchRow
                                                label="Policy Warnings & Performance Alerts"
                                                checked={settings.notifyHealth}
                                                onChange={(v: boolean) => update('notifyHealth', v)}
                                                urgent
                                            />
                                        </NotificationGroup>
                                    </div>
                                </Card>
                            )}

                            {/* === 5. FBA & INVENTORY === */}
                            {activeTab === 'fba' && (
                                <>
                                    <Card title="FBA General Settings">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                            <Field label="Unfulfillable Inventory">
                                                <select
                                                    value={settings.unfulfillableAction}
                                                    onChange={(e: any) => update('unfulfillableAction', e.target.value as any)}
                                                    className="w-full text-sm border-slate-300 rounded-md shadow-sm border p-2"
                                                >
                                                    <option value="Return">Return to Merchant</option>
                                                    <option value="Dispose">Dispose (Liquidate)</option>
                                                </select>
                                            </Field>
                                            <Field label="Schedule">
                                                <select
                                                    value={settings.disposalSchedule}
                                                    onChange={(e: any) => update('disposalSchedule', e.target.value as any)}
                                                    className="w-full text-sm border-slate-300 rounded-md shadow-sm border p-2"
                                                >
                                                    <option value="Weekly">Weekly (Every Friday)</option>
                                                    <option value="Monthly">Monthly (1st)</option>
                                                </select>
                                            </Field>
                                        </div>
                                    </Card>

                                    <Card title="Stock Logistics">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Ghost Mode (Hide Out-of-Stock)</p>
                                                <p className="text-xs text-slate-500">Automatically hide products with 0 qty.</p>
                                            </div>
                                            <Switch checked={settings.ghostMode} onChange={(v: boolean) => update('ghostMode', v)} />
                                        </div>
                                        <Field label="Low Stock Warning Threshold">
                                            <Input
                                                type="number"
                                                value={settings.stockThreshold}
                                                onChange={(v: string) => update('stockThreshold', parseInt(v))}
                                                width="active"
                                            />
                                        </Field>
                                    </Card>
                                </>
                            )}

                            {/* === 6. LOGIN & SECURITY === */}
                            {activeTab === 'security' && (
                                <>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex gap-3 text-sm text-yellow-800">
                                        <AlertCircle className="flex-shrink-0" size={20} />
                                        <div>
                                            <p className="font-bold">Sensitive Configuration Area</p>
                                            <p>Changes made here affect site-wide access and customer purchasing capability.</p>
                                        </div>
                                    </div>

                                    <Card title="Credentials">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Two-Step Verification (2SV)</p>
                                                <p className="text-xs text-slate-500">Require OTP for Admin Login.</p>
                                            </div>
                                            <Switch checked={settings.twoFactor} onChange={(v: boolean) => update('twoFactor', v)} />
                                        </div>

                                        <Field label="Master API Key">
                                            <div className="flex gap-2">
                                                <Input value={settings.masterKey} disabled />
                                                <button className="px-3 border border-slate-300 rounded-md bg-slate-50 text-sm font-medium">Rotate</button>
                                            </div>
                                        </Field>
                                    </Card>

                                    <Card title="Emergency Checkout Control">
                                        <div className={`p-6 rounded-lg border-2 ${settings.panicMode ? 'border-red-500 bg-red-50' : 'border-green-200 bg-white'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Activity size={20} className={settings.panicMode ? 'text-red-600' : 'text-green-600'} />
                                                    <span className={`font-bold text-lg ${settings.panicMode ? 'text-red-700' : 'text-green-700'}`}>
                                                        {settings.panicMode ? 'SYSTEM LOCKDOWN' : 'SYSTEM ACTIVE'}
                                                    </span>
                                                </div>
                                                <Switch checked={settings.panicMode} onChange={(v: boolean) => update('panicMode', v)} />
                                            </div>
                                            <p className="text-sm text-slate-700">
                                                {settings.panicMode
                                                    ? "Checkout is currently SUSPENDED. Customers cannot add items to cart."
                                                    : "Storefront is fully operational. Checkout flow is active."}
                                            </p>
                                        </div>
                                    </Card>
                                </>
                            )}

                            {/* === 7. SYSTEM === */}
                            {activeTab === 'system' && (
                                <Card title="Maintenance">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <RefreshCw className="text-blue-500" />
                                                <span className="font-bold text-sm text-slate-700">Purge Local Cache</span>
                                            </div>
                                            <ChevronRight size={16} className="text-slate-400" />
                                        </div>
                                        <div className="flex justify-between items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <Download className="text-green-500" />
                                                <span className="font-bold text-sm text-slate-700">Download Data Backup (JSON)</span>
                                            </div>
                                            <ChevronRight size={16} className="text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="mt-8 text-center text-xs text-slate-400">
                                        Fario Admin Services • v4.2.1 • Build 2026-01
                                    </div>
                                </Card>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* --- NOTIFICATION TOAST --- */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={`fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 z-50 ${notification.type === 'error' ? 'bg-white border-l-4 border-red-500 text-slate-900' : 'bg-[#232f3e] text-white'
                            }`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 size={20} className="text-green-400" /> : <AlertCircle size={20} className="text-red-500" />}
                        <span className="font-bold text-sm">{notification.msg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

// --- HELPER COMPONENTS ---

const Card = ({ title, children }: any) => (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="bg-slate-50/80 border-b border-slate-100 px-4 md:px-6 py-3 md:py-4">
            <h3 className="text-[11px] md:text-sm font-bold text-slate-800 uppercase tracking-wide">{title}</h3>
        </div>
        <div className="p-4 md:p-6">
            {children}
        </div>
    </div>
);

const Field = ({ label, helper, children }: any) => (
    <div className="mb-4 last:mb-0">
        <label className="block text-sm font-bold text-slate-900 mb-1">{label}</label>
        {helper && <p className="text-xs text-slate-500 mb-2">{helper}</p>}
        {children}
    </div>
);

const Input = ({ ...props }: any) => (
    <input
        {...props}
        className="w-full rounded-md border-slate-300 shadow-sm focus:border-[#7a51a0] focus:ring-[#7a51a0] sm:text-sm py-2 px-3 border"
    />
);

const Switch = ({ checked, onChange }: any) => (
    <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-[#7a51a0]' : 'bg-slate-200'}`}
    >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const NotificationGroup = ({ title, children }: any) => (
    <div className="mb-6 last:mb-0">
        <h4 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">{title}</h4>
        <div className="space-y-4">{children}</div>
    </div>
);

const SwitchRow = ({ label, checked, onChange, urgent }: any) => (
    <div className="flex items-center justify-between gap-4">
        <span className={`text-[11px] md:text-sm leading-tight ${urgent ? 'text-red-700 font-bold' : 'text-slate-600'}`}>{label}</span>
        <div className="flex-shrink-0">
            <Switch checked={checked} onChange={onChange} />
        </div>
    </div>
);

export default ControlCenter;
