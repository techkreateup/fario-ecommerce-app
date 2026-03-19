import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Smartphone, Mail, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfileSettings: React.FC = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: user?.user_metadata?.name || '',
        email: user?.email || '',
        phone: user?.user_metadata?.phone || '+91 00000 00000',
        notifyEmail: true,
        notifySMS: true
    });

    // Load from LS
    useEffect(() => {
        const savedProfile = localStorage.getItem('fario_profile_settings');
        if (savedProfile) {
            setFormData(JSON.parse(savedProfile));
        }
    }, []);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setStatus('idle');
    };

    const handleSave = () => {
        setIsLoading(true);
        setStatus('saving');

        // Simulate Network Request
        setTimeout(() => {
            localStorage.setItem('fario_profile_settings', JSON.stringify(formData));
            localStorage.setItem('fario_user_name', formData.name); // Sync with other components
            setIsLoading(false);
            setStatus('success');

            // Auto-hide success message
            setTimeout(() => setStatus('idle'), 4000);
        }, 1200);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-32">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Account Settings</h2>
                    <p className="text-sm text-gray-700 font-bold mt-1">Update your personal information and preferences.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden divide-y divide-gray-100 shadow-sm">
                {/* Personal Info */}
                <div className="p-8">
                    <h3 className="font-black text-gray-900 text-lg mb-6 flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-lg"><User size={20} /></div> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-gray-900 uppercase tracking-wide mb-2">Full Name</label>
                            <input type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-0 transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-900 uppercase tracking-wide mb-2">Email Address</label>
                            <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-0 transition-all opacity-70 cursor-not-allowed" readOnly title="Contact support to change email" />
                            <p className="text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1"><Lock size={10} /> Verified & Locked</p>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-900 uppercase tracking-wide mb-2">Phone Number</label>
                            <input type="tel" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-0 transition-all" />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="p-8">
                    <h3 className="font-black text-gray-900 text-lg mb-6 flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-lg"><Bell size={20} /></div> Notifications
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform"><Mail size={20} /></div>
                                <div>
                                    <p className="text-base font-bold text-gray-900">Email Notifications</p>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">Receive order updates, invoices, and exclusive offers.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={formData.notifyEmail} onChange={e => handleChange('notifyEmail', e.target.checked)} />
                                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-fario-purple hover:bg-gray-300"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:scale-110 transition-transform"><Smartphone size={20} /></div>
                                <div>
                                    <p className="text-base font-bold text-gray-900">SMS Alerts</p>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">Get instant delivery status updates on your phone.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={formData.notifySMS} onChange={e => handleChange('notifySMS', e.target.checked)} />
                                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-fario-purple hover:bg-gray-300"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="fixed bottom-[80px] left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-40 flex items-center justify-between shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                <p className="text-xs font-bold text-gray-500">Unsaved changes</p>
                <button onClick={handleSave} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold text-sm">Save</button>
            </div>

            <div className="hidden lg:flex justify-end pt-4 gap-4 items-center">
                {status === 'success' && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg animate-in fade-in slide-in-from-right-4 border border-green-100">
                        <Check size={18} strokeWidth={3} />
                        <span className="font-bold text-sm">Profile updated successfully</span>
                    </div>
                )}

                <button
                    onClick={() => setFormData({ name: 'Akash Sundar', email: 'akash.sundar@fario.com', phone: '+91 98765 43210', notifyEmail: true, notifySMS: true })}
                    className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                    Reset Defaults
                </button>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-10 py-4 bg-gray-900 text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-black shadow-xl shadow-gray-900/10 min-w-[200px] flex items-center justify-center transition-all active:scale-95"
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin text-white/80" /> : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};
