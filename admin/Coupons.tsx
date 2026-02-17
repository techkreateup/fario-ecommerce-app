import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discounttype: 'percentage',
        discountvalue: '',
        minordervalue: '',
        maxdiscount: '',
        usagelimit: ''
    });

    // Fetch coupons
    const fetchCoupons = async () => {
        console.log('🔍 Fetching coupons from Supabase...');
        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('coupons')
                .select('*')
                .order('createdat', { ascending: false });

            if (fetchError) {
                console.error('❌ Supabase error:', fetchError);
                setError(fetchError.message);
                setCoupons([]);
            } else {
                console.log('✅ Coupons loaded:', data?.length);
                setCoupons(data || []);
            }
        } catch (err: any) {
            console.error('❌ Catch error:', err);
            setError(err.message);
            setCoupons([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchCoupons();
    }, []);

    // Create coupon
    const handleCreate = async (e: any) => {
        e.preventDefault();

        if (!formData.code.trim()) {
            alert('Coupon code is required!');
            return;
        }

        try {
            const { error: insertError } = await supabase
                .from('coupons')
                .insert([{
                    code: formData.code.toUpperCase().trim(),
                    discounttype: formData.discounttype,
                    discountvalue: parseFloat(formData.discountvalue) || 0,
                    minordervalue: parseFloat(formData.minordervalue) || 0,
                    maxdiscount: formData.maxdiscount ? parseFloat(formData.maxdiscount) : null,
                    usagelimit: formData.usagelimit ? parseInt(formData.usagelimit) : null,
                    isactive: true,
                    usedcount: 0
                }]);

            if (insertError) {
                console.error('Insert error:', insertError);
                alert('Error: ' + insertError.message);
            } else {
                alert('✅ Coupon created successfully!');
                setShowForm(false);
                setFormData({
                    code: '',
                    discounttype: 'percentage',
                    discountvalue: '',
                    minordervalue: '',
                    maxdiscount: '',
                    usagelimit: ''
                });
                fetchCoupons();
            }
        } catch (err: any) {
            console.error('Catch error:', err);
            alert('Error: ' + err.message);
        }
    };

    // Toggle active status
    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const { error: updateError } = await supabase
                .from('coupons')
                .update({ isactive: !currentStatus })
                .eq('id', id);

            if (updateError) {
                alert('Error: ' + updateError.message);
            } else {
                fetchCoupons();
            }
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    // Delete coupon
    const deleteCoupon = async (id: string) => {
        if (!confirm('Delete this coupon?')) return;

        try {
            const { error: deleteError } = await supabase
                .from('coupons')
                .delete()
                .eq('id', id);

            if (deleteError) {
                alert('Error: ' + deleteError.message);
            } else {
                alert('Coupon deleted!');
                fetchCoupons();
            }
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading coupons...</p>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <h3 className="font-bold">Error Loading Coupons</h3>
                    <p>{error}</p>
                    <button
                        onClick={fetchCoupons}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Main render
    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">🎟️ Coupons Management</h1>
                    <p className="text-gray-600 mt-1">
                        Total: {coupons.length} | Active: {coupons.filter(c => c.isactive).length}
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? '✕ Cancel' : '+ Create Coupon'}
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow mb-6 border-2 border-blue-500">
                    <h2 className="text-xl font-bold mb-4">Create New Coupon</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-semibold">Coupon Code *</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full border rounded px-3 py-2"
                                placeholder="SAVE20"
                                required
                            />
                        </div>

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

                        <div>
                            <label className="block mb-2 font-semibold">Discount Value *</label>
                            <input
                                type="number"
                                value={formData.discountvalue}
                                onChange={(e) => setFormData({ ...formData, discountvalue: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                placeholder="20"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Min Order Value (₹)</label>
                            <input
                                type="number"
                                value={formData.minordervalue}
                                onChange={(e) => setFormData({ ...formData, minordervalue: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                placeholder="1000"
                            />
                        </div>

                        {formData.discounttype === 'percentage' && (
                            <div>
                                <label className="block mb-2 font-semibold">Max Discount (₹)</label>
                                <input
                                    type="number"
                                    value={formData.maxdiscount}
                                    onChange={(e) => setFormData({ ...formData, maxdiscount: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="500"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block mb-2 font-semibold">Usage Limit</label>
                            <input
                                type="number"
                                value={formData.usagelimit}
                                onChange={(e) => setFormData({ ...formData, usagelimit: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                placeholder="100"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700"
                    >
                        Create Coupon
                    </button>
                </form>
            )}

            {/* Coupons Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {coupons.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No coupons created yet.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Create Your First Coupon
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left">Code</th>
                                <th className="px-4 py-3 text-left">Discount</th>
                                <th className="px-4 py-3 text-left">Min Order</th>
                                <th className="px-4 py-3 text-left">Usage</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map(coupon => (
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
                                        <span className={`px-2 py-1 rounded text-xs ${coupon.isactive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {coupon.isactive ? '🟢 Active' : '🔴 Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 space-x-2">
                                        <button
                                            onClick={() => toggleActive(coupon.id, coupon.isactive)}
                                            className="text-blue-600 hover:underline"
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
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
