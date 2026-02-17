import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discounttype: 'percentage',
        discountvalue: '',
        minordervalue: 0,
        maxdiscount: '',
        usagelimit: '',
        validuntil: ''
    });

    // Fetch coupons from Supabase
    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .order('createdat', { ascending: false });

            if (error) throw error;
            setCoupons(data || []);
            console.log('✅ Coupons loaded:', data?.length);
        } catch (error: any) {
            console.error('❌ Error fetching coupons:', error);
            alert('Failed to load coupons: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Real-time subscription
    useEffect(() => {
        fetchCoupons();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('coupons-channel')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'coupons' },
                (payload) => {
                    console.log('🔔 Real-time update:', payload);
                    fetchCoupons(); // Refresh coupons on any change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    // Create new coupon
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.code.trim()) {
            alert('Coupon code is required');
            return;
        }

        try {
            const { error } = await supabase
                .from('coupons')
                .insert({
                    code: formData.code.toUpperCase(),
                    discounttype: formData.discounttype,
                    discountvalue: parseFloat(formData.discountvalue),
                    minordervalue: parseFloat(formData.minordervalue.toString()) || 0,
                    maxdiscount: formData.maxdiscount ? parseFloat(formData.maxdiscount) : null,
                    usagelimit: formData.usagelimit ? parseInt(formData.usagelimit) : null,
                    validuntil: formData.validuntil || null,
                    isactive: true,
                    usedcount: 0
                });

            if (error) throw error;

            alert('✅ Coupon created successfully!');
            setShowForm(false);
            setFormData({
                code: '',
                discounttype: 'percentage',
                discountvalue: '',
                minordervalue: 0,
                maxdiscount: '',
                usagelimit: '',
                validuntil: ''
            });
            fetchCoupons();
        } catch (error: any) {
            console.error('❌ Error creating coupon:', error);
            if (error.code === '23505') {
                alert('Coupon code already exists!');
            } else {
                alert('Failed to create coupon: ' + error.message);
            }
        }
    };

    // Toggle coupon active status
    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('coupons')
                .update({
                    isactive: !currentStatus,
                    updatedat: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            console.log('✅ Coupon status toggled');
            fetchCoupons();
        } catch (error) {
            console.error('❌ Error toggling status:', error);
            alert('Failed to update status');
        }
    };

    // Delete coupon
    const deleteCoupon = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const { error } = await supabase
                .from('coupons')
                .delete()
                .eq('id', id);

            if (error) throw error;
            console.log('✅ Coupon deleted');
            fetchCoupons();
        } catch (error) {
            console.error('❌ Error deleting coupon:', error);
            alert('Failed to delete coupon');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl">Loading coupons...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">🎟️ Coupons Management</h1>
                    <p className="text-gray-600 mt-1">
                        Total Coupons: {coupons.length} | Active: {coupons.filter(c => c.isactive).length}
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? '✕ Cancel' : '+ Create Coupon'}
                </button>
            </div>

            {/* Create Coupon Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6 border-2 border-blue-500">
                    <h2 className="text-xl font-bold mb-4">Create New Coupon</h2>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Coupon Code */}
                        <div>
                            <label className="block mb-2 font-semibold">Coupon Code *</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full border rounded px-3 py-2 uppercase"
                                placeholder="SAVE20"
                                required
                            />
                        </div>

                        {/* Discount Type */}
                        <div>
                            <label className="block mb-2 font-semibold">Discount Type *</label>
                            <select
                                value={formData.discounttype}
                                onChange={(e) => setFormData({ ...formData, discounttype: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>

                        {/* Discount Value */}
                        <div>
                            <label className="block mb-2 font-semibold">
                                Discount Value * {formData.discounttype === 'percentage' ? '(%)' : '(₹)'}
                            </label>
                            <input
                                type="number"
                                value={formData.discountvalue}
                                onChange={(e) => setFormData({ ...formData, discountvalue: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        {/* Min Order Value */}
                        <div>
                            <label className="block mb-2 font-semibold">Minimum Order Value (₹)</label>
                            <input
                                type="number"
                                value={formData.minordervalue}
                                onChange={(e) => setFormData({ ...formData, minordervalue: Number(e.target.value) })}
                                className="w-full border rounded px-3 py-2"
                                min="0"
                            />
                        </div>

                        {/* Max Discount */}
                        {formData.discounttype === 'percentage' && (
                            <div>
                                <label className="block mb-2 font-semibold">Max Discount (₹)</label>
                                <input
                                    type="number"
                                    value={formData.maxdiscount}
                                    onChange={(e) => setFormData({ ...formData, maxdiscount: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                    min="0"
                                />
                            </div>
                        )}

                        {/* Usage Limit */}
                        <div>
                            <label className="block mb-2 font-semibold">Usage Limit</label>
                            <input
                                type="number"
                                value={formData.usagelimit}
                                onChange={(e) => setFormData({ ...formData, usagelimit: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                min="1"
                                placeholder="Leave empty for unlimited"
                            />
                        </div>

                        {/* Valid Until */}
                        <div>
                            <label className="block mb-2 font-semibold">Valid Until</label>
                            <input
                                type="datetime-local"
                                value={formData.validuntil}
                                onChange={(e) => setFormData({ ...formData, validuntil: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        ✅ Create Coupon
                    </button>
                </form>
            )}

            {/* Coupons List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">Code</th>
                            <th className="px-4 py-3 text-left">Discount</th>
                            <th className="px-4 py-3 text-left">Min Order</th>
                            <th className="px-4 py-3 text-left">Usage</th>
                            <th className="px-4 py-3 text-left">Valid Until</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-500">
                                    No coupons created yet. Click "+ Create Coupon" to add one.
                                </td>
                            </tr>
                        ) : (
                            coupons.map(coupon => (
                                <tr key={coupon.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-bold">{coupon.code}</td>
                                    <td className="px-4 py-3">
                                        {coupon.discounttype === 'percentage'
                                            ? `${coupon.discountvalue}%`
                                            : `₹${coupon.discountvalue}`}
                                    </td>
                                    <td className="px-4 py-3">₹{coupon.minordervalue}</td>
                                    <td className="px-4 py-3">
                                        {coupon.usedcount} / {coupon.usagelimit || '∞'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {coupon.validuntil
                                            ? new Date(coupon.validuntil).toLocaleDateString()
                                            : 'No expiry'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${coupon.isactive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {coupon.isactive ? '🟢 Active' : '🔴 Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => toggleActive(coupon.id, coupon.isactive)}
                                            className="text-blue-600 hover:underline mr-3"
                                        >
                                            {coupon.isactive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => deleteCoupon(coupon.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Real-time indicator */}
            <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Real-time updates enabled
            </div>
        </div>
    );
}
