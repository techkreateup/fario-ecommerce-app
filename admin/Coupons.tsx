import React, { useState, useEffect } from 'react';
import {
    Search, Plus, Filter, Tag, Calendar,
    MoreVertical, Trash2, CheckCircle2, XCircle,
    Percent, DollarSign, Loader2, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

interface Coupon {
    code: string;
    discount_type: 'percentage' | 'fixed';
    value: number;
    min_order_value: number;
    expires_at: string | null;
    usage_limit: number;
    used_count: number;
    is_active: boolean;
    created_at?: string;
}

const AdminCoupons: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Coupon>>({
        discount_type: 'percentage',
        is_active: true,
        value: 0,
        min_order_value: 0,
        usage_limit: 0
    });

    const toast = useToast();

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const { supabase } = await import('../lib/supabase');
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCoupons(data || []);
        } catch (err) {
            console.error('Error fetching coupons:', err);
            // Fallback for demo if table doesn't exist yet
            setCoupons([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.code || !formData.value) return;

        try {
            const { supabase } = await import('../lib/supabase');

            const newCoupon = {
                code: formData.code.toUpperCase(),
                discount_type: formData.discount_type,
                value: Number(formData.value),
                min_order_value: Number(formData.min_order_value || 0),
                usage_limit: Number(formData.usage_limit || 0),
                expires_at: formData.expires_at || null,
                is_active: formData.is_active,
                used_count: 0
            };

            const { error } = await supabase.from('coupons').upsert(newCoupon);

            if (error) throw error;

            toast.success('Coupon created successfully');
            setIsModalOpen(false);
            fetchCoupons();
            setFormData({ discount_type: 'percentage', is_active: true, value: 0 });
        } catch (err: any) {
            console.error(err);
            toast.error('Failed to create coupon: ' + err.message);
        }
    };

    const handleDelete = async (code: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const { supabase } = await import('../lib/supabase');
            const { error } = await supabase.from('coupons').delete().eq('code', code);
            if (error) throw error;
            toast.success('Coupon deleted');
            fetchCoupons();
        } catch (err) {
            toast.error('Failed to delete coupon');
        }
    };

    const toggleStatus = async (code: string, currentStatus: boolean) => {
        try {
            const { supabase } = await import('../lib/supabase');
            await supabase.from('coupons').update({ is_active: !currentStatus }).eq('code', code);
            fetchCoupons();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="admin-h1">Coupon Management</h1>
                    <p className="admin-subtitle">Create and track discount codes.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-fario-purple text-white rounded-xl font-bold shadow-lg hover:bg-fario-purple/90 transition-all active:scale-95"
                >
                    <Plus size={20} /> New Coupon
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <Loader2 className="w-8 h-8 animate-spin text-fario-purple" />
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                        <Tag size={48} className="mb-4 opacity-20" />
                        <p className="font-bold">No coupons found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                                    <th className="px-8 py-6">Code</th>
                                    <th className="px-6 py-6">Discount</th>
                                    <th className="px-6 py-6">Usage</th>
                                    <th className="px-6 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {coupons.map((coupon) => (
                                    <tr key={coupon.code} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-fario-purple/10 text-fario-purple rounded-xl">
                                                    <Tag size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900">{coupon.code}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                        Min: ₹{coupon.min_order_value}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-700">
                                                    {coupon.discount_type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-600">
                                                <span className="font-bold text-slate-900">{coupon.used_count}</span>
                                                <span className="text-gray-400 mx-1">/</span>
                                                <span className="text-gray-400">{coupon.usage_limit === 0 ? '∞' : coupon.usage_limit}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(coupon.code, coupon.is_active)}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 transition-all ${coupon.is_active
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        : 'bg-gray-100 text-gray-400 border-gray-200'
                                                    }`}
                                            >
                                                {coupon.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {coupon.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(coupon.code)}
                                                className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] p-8 w-full max-w-md relative z-10 shadow-2xl"
                        >
                            <h3 className="text-xl font-black text-slate-900 mb-6">Create New Coupon</h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Code</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.code || ''}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-fario-purple rounded-xl px-4 py-3 font-bold text-slate-900 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="SUMMER2026"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Type</label>
                                        <select
                                            value={formData.discount_type}
                                            onChange={e => setFormData({ ...formData, discount_type: e.target.value as any })}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-slate-700 outline-none"
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Value</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.value || ''}
                                            onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-slate-900 outline-none"
                                            placeholder="20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Min Order (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.min_order_value || ''}
                                            onChange={e => setFormData({ ...formData, min_order_value: Number(e.target.value) })}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-slate-900 outline-none"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Limit</label>
                                        <input
                                            type="number"
                                            value={formData.usage_limit || ''}
                                            onChange={e => setFormData({ ...formData, usage_limit: Number(e.target.value) })}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-slate-900 outline-none"
                                            placeholder="0 (Unlimited)"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-fario-purple text-white rounded-xl font-black uppercase tracking-widest text-xs mt-4 shadow-lg shadow-fario-purple/20 hover:bg-fario-purple/90 transition-all active:scale-[0.98]"
                                >
                                    Create Coupon
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCoupons;
