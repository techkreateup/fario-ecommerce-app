import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface Address {
    id: number;
    type: string;
    name: string;
    street: string;
    city: string;
    zip: string;
    phone: string;
    isDefault: boolean;
}

const DEFAULT_ADDRESSES: Address[] = []; // Empty by default to force Supabase usage

export const ProfileAddresses: React.FC = () => {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load from Supabase on Mount
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // Load from Supabase profiles table
                const { data, error } = await supabase
                    .from('profiles')
                    .select('addresses')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error("Supabase error fetching addresses:", error);
                }

                if (data?.addresses) {
                    setAddresses(data.addresses);
                } else {
                    setAddresses([]);
                }
            } catch (err) {
                console.error("Failed to load addresses from Supabase", err);
                setAddresses([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddresses();
    }, [user]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<Address>>({});
    const [isSaving, setIsSaving] = useState(false);

    // --- HANDLERS ---
    const handleAddNew = () => {
        setEditingId(null);
        setFormData({ type: 'Home', isDefault: false, name: user?.user_metadata?.name || '' });
        setIsModalOpen(true);
    };

    const handleEdit = (addr: Address) => {
        setEditingId(addr.id);
        setFormData({ ...addr });
        setIsModalOpen(true);
    };

    const saveToBackend = async (newAddresses: Address[]) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    addresses: newAddresses,
                    updatedat: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;
            console.log('✅ Addresses synced to Supabase');
        } catch (err) {
            console.error('Failed to sync addresses to Supabase:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to remove this address permanently?')) {
            const updated = addresses.filter(a => a.id !== id);
            setAddresses(updated);
            await saveToBackend(updated);
        }
    };

    const handleSetDefault = async (id: number) => {
        setAddresses(prev => {
            const updated = prev.map(a => ({
                ...a,
                isDefault: a.id === id
            }));
            saveToBackend(updated); // Side effect inside setter is safe enough here for now
            return updated;
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let updatedAddresses: Address[];

            if (editingId) {
                updatedAddresses = addresses.map(a => a.id === editingId ? { ...a, ...formData } as Address : a);
            } else {
                const newId = Date.now();
                const newAddr = { ...formData, id: newId } as Address;
                if (addresses.length === 0) newAddr.isDefault = true;
                updatedAddresses = [...addresses, newAddr];
            }

            setAddresses(updatedAddresses);
            await saveToBackend(updatedAddresses);

            setIsModalOpen(false);
        } catch (error) {
            alert("Failed to save address. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (field: keyof Address, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) return null;

    return (
        <div className="space-y-6 relative pb-24">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        Your Addresses <MapPin className="text-fario-purple" size={24} strokeWidth={2.5} />
                    </h2>
                    <p className="text-sm text-gray-700 font-bold mt-1">Manage delivery locations used at checkout.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg hover:shadow-gray-900/20 active:scale-95 transform"
                >
                    <Plus size={18} strokeWidth={3} /> Add New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                    {addresses.map((addr) => (
                        <motion.div
                            key={addr.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className={`bg-white rounded-2xl border-2 p-6 relative group transition-all duration-300 hover:shadow-xl ${addr.isDefault ? 'border-fario-purple shadow-fario-purple/5' : 'border-gray-100 hover:border-gray-300'}`}
                        >
                            {addr.isDefault && (
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[11px] font-black uppercase text-white bg-fario-purple px-3 py-1.5 rounded-full shadow-lg shadow-fario-purple/20">
                                    <CheckCircle2 size={14} strokeWidth={3} /> Default
                                </div>
                            )}

                            <div className="mb-5">
                                <span className={`inline-block px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider mb-2 ${addr.type === 'Home' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>{addr.type}</span>
                                <h3 className="font-black text-gray-900 text-xl tracking-tight">{addr.name}</h3>
                            </div>

                            <div className="space-y-1.5 text-sm text-gray-700 font-semibold mb-6 leading-relaxed">
                                <p>{addr.street}</p>
                                <p>{addr.city} {addr.zip}</p>
                                <p className="pt-2 text-gray-900 font-black">Mobile: {addr.phone}</p>
                            </div>

                            <div className="flex items-center gap-3 pt-5 border-t-2 border-gray-50 opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(addr)}
                                    className="text-xs font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Trash2 size={14} /> Remove
                                </button>
                                {!addr.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(addr.id)}
                                        className="text-xs font-bold text-gray-600 hover:text-fario-purple ml-auto hover:underline"
                                    >
                                        Set Default
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* --- MODAL --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-white rounded-3xl w-full max-w-lg overflow-hidden relative z-10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h3 className="text-xl font-black text-gray-900">{editingId ? 'Edit Delivery Address' : 'Add New Address'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-900" /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-black text-gray-900 uppercase tracking-wide mb-1.5">Full Name</label>
                                        <input required type="text" value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-0 transition-all placeholder:text-gray-300" placeholder="e.g. Akash Sundar" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-black text-gray-900 uppercase tracking-wide mb-1.5">Street Address</label>
                                        <input required type="text" value={formData.street || ''} onChange={(e) => handleChange('street', e.target.value)} className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-0 transition-all placeholder:text-gray-300" placeholder="Flat / House No / Street" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-900 uppercase tracking-wide mb-1.5">City</label>
                                        <input required type="text" value={formData.city || ''} onChange={(e) => handleChange('city', e.target.value)} className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-0 transition-all placeholder:text-gray-300" placeholder="Chennai" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-900 uppercase tracking-wide mb-1.5">ZIP Code</label>
                                        <input required type="text" value={formData.zip || ''} onChange={(e) => handleChange('zip', e.target.value)} className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-0 transition-all placeholder:text-gray-300" placeholder="600000" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-black text-gray-900 uppercase tracking-wide mb-1.5">Phone Number</label>
                                        <input required type="tel" value={formData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-0 transition-all placeholder:text-gray-300" placeholder="+91 999 999 9999" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-black text-gray-900 uppercase tracking-wide mb-2">Address Type</label>
                                        <div className="flex gap-3">
                                            {['Home', 'Work', 'Other'].map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => handleChange('type', type)}
                                                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wide border-2 transition-all ${formData.type === type ? 'bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-900/10 scale-[1.02]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={isSaving} className="w-full py-4 bg-fario-purple text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-fario-teal transition-all shadow-lg shadow-fario-purple/20 mt-6 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" /> Saving to Account...
                                        </>
                                    ) : (
                                        'Save Complete Address'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
