
import React, { useState, useEffect } from 'react';
import * as RouterDOM from 'react-router-dom';
import {
    ChevronRight, Plus, AlertCircle, Check,
    MapPin, Phone, Trash2, Edit3, Home,
    Briefcase, Globe, Loader2, Save, X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Address } from '../../types';
import { logAction } from '../../services/logService';

const { Link } = RouterDOM as any;

const ProfileAddresses: React.FC = () => {
    const toast = useToast();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Address, 'id'>>({
        fullName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        isDefault: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const userEmail = localStorage.getItem('fario_user_email');
            if (!userEmail) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('addresses')
                .eq('email', userEmail)
                .single();

            if (data?.addresses) {
                setAddresses(data.addresses as Address[]);
            }
        } catch (err) {
            console.error('Error fetching addresses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const saveToSupabase = async (updatedAddresses: Address[]) => {
        const userEmail = localStorage.getItem('fario_user_email');
        if (!userEmail) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                addresses: updatedAddresses,
                updated_at: new Date().toISOString()
            })
            .eq('email', userEmail);

        if (error) throw error;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let updated: Address[];
            if (editingId) {
                updated = addresses.map(a => a.id === editingId ? { ...formData, id: editingId } : a);
                if (formData.isDefault) {
                    updated = updated.map(a => ({ ...a, isDefault: a.id === editingId }));
                }
            } else {
                const newId = `ADDR-${Math.floor(Math.random() * 1000000)}`;
                const newAddr = { ...formData, id: newId };
                updated = formData.isDefault
                    ? [{ ...newAddr }, ...addresses.map(a => ({ ...a, isDefault: false }))]
                    : [...addresses, newAddr];
            }

            await saveToSupabase(updated);
            setAddresses(updated);
            toast.success(editingId ? 'Address updated' : 'Address added');
            await logAction(editingId ? 'profile_updated' : 'address_added', { type: 'address' });

            setIsAdding(false);
            setEditingId(null);
            setFormData({ fullName: '', street: '', city: '', state: '', zipCode: '', phone: '', isDefault: false });
        } catch (err) {
            console.error('Save error:', err);
            toast.error('Failed to save address');
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeAddress = async (id: string) => {
        if (!window.confirm('Remove this address?')) return;
        try {
            const updated = addresses.filter(a => a.id !== id);
            await saveToSupabase(updated);
            setAddresses(updated);
            toast.success('Address removed');
            await logAction('address_deleted', { id });
        } catch (err) {
            toast.error('Failed to remove address');
        }
    };

    const setDefault = async (id: string) => {
        try {
            const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
            await saveToSupabase(updated);
            setAddresses(updated);
            toast.success('Default address updated');
        } catch (err) {
            toast.error('Failed to update default address');
        }
    };

    const startEdit = (addr: Address) => {
        setFormData({
            fullName: addr.fullName,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipCode,
            phone: addr.phone,
            isDefault: addr.isDefault
        });
        setEditingId(addr.id);
        setIsAdding(true);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4 md:px-8 selection:bg-fario-purple selection:text-white">
            <div className="max-w-6xl mx-auto">
                {/* Breadcrumb & Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                            <Link to="/profile" className="hover:text-fario-purple transition-colors">Account</Link>
                            <ChevronRight size={10} />
                            <span className="text-fario-purple">Shipping Protocols</span>
                        </div>
                        <h1 className="text-5xl font-black font-heading italic tracking-tighter text-white leading-none">Your Addresses</h1>
                        <p className="text-white/40 text-sm font-medium">Manage your global delivery vectors and dispatch coordinates.</p>
                    </div>

                    <button
                        onClick={() => {
                            setFormData({ fullName: '', street: '', city: '', state: '', zipCode: '', phone: '', isDefault: false });
                            setEditingId(null);
                            setIsAdding(true);
                        }}
                        className="bg-white text-black px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-fario-purple hover:text-white transition-all shadow-xl shadow-white/5"
                    >
                        <Plus size={16} /> New Address
                    </button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-white/5 border border-white/10 rounded-[2.5rem] animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {addresses.map((addr) => (
                                <motion.div
                                    key={addr.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`relative p-8 rounded-[2.5rem] border ${addr.isDefault ? 'border-fario-purple bg-fario-purple/5 shadow-[0_0_40px_rgba(122,81,160,0.1)]' : 'border-white/10 bg-white/5'} transition-all group hover:border-white/20`}
                                >
                                    {addr.isDefault && (
                                        <div className="absolute top-6 right-8 flex items-center gap-1.5 text-fario-purple text-[10px] font-black uppercase tracking-widest">
                                            <ShieldCheck size={14} /> Default
                                        </div>
                                    )}

                                    <div className="h-full flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${addr.isDefault ? 'border-fario-purple/20 bg-fario-purple/10' : 'border-white/10 bg-white/5'}`}>
                                                    {addr.street.toLowerCase().includes('office') ? <Briefcase size={18} className="text-white/40" /> : <Home size={18} className="text-white/40" />}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-white italic tracking-tight">{addr.fullName}</h3>
                                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                                        <MapPin size={10} /> {addr.city}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1 mt-6">
                                                <p className="text-sm text-white/60 font-medium leading-relaxed">{addr.street}</p>
                                                <p className="text-sm text-white/60 font-medium">{addr.city}, {addr.state} {addr.zipCode}</p>
                                                <div className="flex items-center gap-2 mt-2 text-white/30">
                                                    <Phone size={12} />
                                                    <span className="text-xs font-mono">{addr.phone}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEdit(addr)}
                                                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => removeAddress(addr.id)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            {!addr.isDefault && (
                                                <button
                                                    onClick={() => setDefault(addr.id)}
                                                    className="p-2 bg-fario-purple/10 hover:bg-fario-purple/20 text-fario-purple rounded-xl transition-all"
                                                    title="Set Default"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Empty State / Add Card */}
                        <button
                            onClick={() => {
                                setFormData({ fullName: '', street: '', city: '', state: '', zipCode: '', phone: '', isDefault: false });
                                setEditingId(null);
                                setIsAdding(true);
                            }}
                            className="p-8 rounded-[2.5rem] border-2 border-dashed border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-4 group hover:bg-white/[0.04] hover:border-white/10 transition-all min-h-[260px]"
                        >
                            <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:border-fario-purple/30 transition-all">
                                <Plus size={32} className="text-white/10 group-hover:text-fario-purple" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">Add Dimension</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAdding(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#111] border border-white/10 rounded-[3rem] p-10 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <button onClick={() => setIsAdding(false)} className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"><X size={24} /></button>

                            <h2 className="text-3xl font-black font-heading italic tracking-tighter mb-8">{editingId ? 'Recalibrate Dispatch' : 'Initialize Vector'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Recipient Identity</label>
                                    <input
                                        required
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-fario-purple transition-all"
                                        placeholder="Full Name"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Spatial Address Line</label>
                                    <input
                                        required
                                        value={formData.street}
                                        onChange={e => setFormData({ ...formData, street: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-fario-purple transition-all"
                                        placeholder="House / Street / Area"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Sector (City)</label>
                                        <input
                                            required
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-fario-purple transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Zone (Zip)</label>
                                        <input
                                            required
                                            value={formData.zipCode}
                                            onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-fario-purple transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">State</label>
                                        <input
                                            required
                                            value={formData.state}
                                            onChange={e => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-fario-purple transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Comm-Link (Phone)</label>
                                        <input
                                            required
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-fario-purple transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        checked={formData.isDefault}
                                        onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                                        className="w-5 h-5 accent-fario-purple"
                                    />
                                    <label htmlFor="isDefault" className="text-xs font-bold uppercase tracking-widest text-white/60">Set as primary dispatch vector</label>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-fario-purple hover:bg-fario-purple-dark text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-fario-purple/20 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : (editingId ? <Save size={18} /> : <Check size={18} />)}
                                        {editingId ? 'Update Vector' : 'Stabilize Dimension'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ShieldCheck = ({ size }: { size?: number }) => <Check size={size} />;
const RefreshCw = ({ className, size }: { className?: string; size?: number }) => (
    <Plus className={`${className} animate-spin`} size={size} />
);

export default ProfileAddresses;
