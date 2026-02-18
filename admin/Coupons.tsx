import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discounttype: 'percentage',
        discountvalue: '',
        minordervalue: '',
    });

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .order('createdat', { ascending: false });

            if (error) {
                console.error('Error:', error);
                alert('Error loading coupons: ' + error.message);
            } else {
                setCoupons(data || []);
            }
        } catch (err) {
            console.error('Catch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleCreate = async (e: any) => {
        e.preventDefault();

        try {
            const { error } = await supabase
                .from('coupons')
                .insert([{
                    code: formData.code.toUpperCase(),
                    discounttype: formData.discounttype,
                    discountvalue: parseFloat(formData.discountvalue),
                    minordervalue: parseFloat(formData.minordervalue) || 0,
                    isactive: true,
                    usedcount: 0
                }]);

            if (error) throw error;

            alert('✅ Coupon created!');
            setShowForm(false);
            setFormData({ code: '', discounttype: 'percentage', discountvalue: '', minordervalue: '' });
            fetchCoupons();
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    const toggleActive = async (id: string, current: boolean) => {
        try {
            await supabase.from('coupons').update({ isactive: !current }).eq('id', id);
            fetchCoupons();
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    const deleteCoupon = async (id: string) => {
        if (!confirm('Delete?')) return;
        try {
            await supabase.from('coupons').delete().eq('id', id);
            fetchCoupons();
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="text-xl">Loading coupons...</div>
        </div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">🎟️ Coupons</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    {showForm ? 'Cancel' : '+ Create Coupon'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="bg-white p-6 rounded shadow mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Code *</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Type</label>
                            <select
                                value={formData.discounttype}
                                onChange={(e) => setFormData({ ...formData, discounttype: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">Value *</label>
                            <input
                                type="number"
                                value={formData.discountvalue}
                                onChange={(e) => setFormData({ ...formData, discountvalue: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Min Order</label>
                            <input
                                type="number"
                                value={formData.minordervalue}
                                onChange={(e) => setFormData({ ...formData, minordervalue: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                    <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-2 rounded">
                        Create
                    </button>
                </form>
            )}

            <div className="bg-white rounded shadow overflow-hidden">
                {coupons.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No coupons yet</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left">Code</th>
                                <th className="px-4 py-3 text-left">Discount</th>
                                <th className="px-4 py-3 text-left">Min Order</th>
                                <th className="px-4 py-3 text-left">Used</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map(c => (
                                <tr key={c.id} className="border-b">
                                    <td className="px-4 py-3 font-bold">{c.code}</td>
                                    <td className="px-4 py-3">
                                        {c.discounttype === 'percentage' ? `${c.discountvalue}%` : `₹${c.discountvalue}`}
                                    </td>
                                    <td className="px-4 py-3">₹{c.minordervalue}</td>
                                    <td className="px-4 py-3">{c.usedcount}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${c.isactive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {c.isactive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => toggleActive(c.id, c.isactive)} className="text-blue-600 mr-3">
                                            {c.isactive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button onClick={() => deleteCoupon(c.id)} className="text-red-600">
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
