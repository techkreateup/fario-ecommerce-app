import { useState, useEffect } from 'react';

// --- HELPER: GET AUTH TOKEN MANUALLY (Bypasses supabase-js hang) ---
const getAuthToken = () => {
    try {
        const storageKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
        if (storageKey) {
            const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
            return stored?.access_token || '';
        }
    } catch (err) {
        console.error('Error parsing auth token', err);
    }
    return '';
};

// --- CONFIG ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

    // --- FETCH COUPONS (REST API) ---
    const fetchCoupons = async () => {
        console.log('🔍 Fetching coupons via REST API...');
        setLoading(true);
        setError(null);

        const token = getAuthToken();
        if (!token) {
            setError("No Auth Token Found! Please Login Again.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/coupons?select=*&order=createdat.desc`, {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Fetch Failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Coupons loaded:', data.length);
            setCoupons(data);
        } catch (err: any) {
            console.error('❌ Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    // --- CREATE COUPON (REST API) ---
    const handleCreate = async (e: any) => {
        e.preventDefault();
        if (!formData.code.trim()) return alert('Code required');

        const token = getAuthToken();
        if (!token) return alert('Auth Error');

        try {
            const payload = {
                code: formData.code.toUpperCase().trim(),
                discounttype: formData.discounttype,
                discountvalue: parseFloat(formData.discountvalue) || 0,
                minordervalue: parseFloat(formData.minordervalue) || 0,
                maxdiscount: formData.maxdiscount ? parseFloat(formData.maxdiscount) : null,
                usagelimit: formData.usagelimit ? parseInt(formData.usagelimit) : null,
                isactive: true,
                usedcount: 0
            };

            const response = await fetch(`${SUPABASE_URL}/rest/v1/coupons`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Insert failed');
            }

            alert('✅ Coupon Created!');
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
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    // --- TOGGLE STATUS (REST API) ---
    const toggleActive = async (id: string, currentStatus: boolean) => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/coupons?id=eq.${id}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isactive: !currentStatus })
            });

            if (!response.ok) throw new Error('Update failed');
            fetchCoupons();
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    // --- DELETE (REST API) ---
    const deleteCoupon = async (id: string) => {
        if (!confirm('Delete this coupon?')) return;
        const token = getAuthToken();

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/coupons?id=eq.${id}`, {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Delete failed');
            fetchCoupons();
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    if (loading) return <div className="p-12 text-center">Loading via REST API...</div>;

    if (error) return (
        <div className="p-8">
            <div className="bg-red-100 p-4 rounded text-red-700">
                <strong>Error:</strong> {error}
                <button onClick={fetchCoupons} className="ml-4 underline">Retry</button>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">🎟️ Coupons Management (Direct API)</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? 'Cancel' : '+ Create Coupon'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow mb-6 border-2 border-blue-500">
                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            placeholder="Code (e.g. SAVE20)"
                            value={formData.code}
                            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            className="border p-2 rounded"
                            required
                        />
                        <select
                            value={formData.discounttype}
                            onChange={e => setFormData({ ...formData, discounttype: e.target.value })}
                            className="border p-2 rounded"
                        >
                            <option value="percentage">Percentage %</option>
                            <option value="fixed">Fixed Amount ₹</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Value (e.g. 20)"
                            value={formData.discountvalue}
                            onChange={e => setFormData({ ...formData, discountvalue: e.target.value })}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Min Order Value"
                            value={formData.minordervalue}
                            onChange={e => setFormData({ ...formData, minordervalue: e.target.value })}
                            className="border p-2 rounded"
                        />
                    </div>
                    <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-2 rounded">Save Coupon</button>
                </form>
            )}

            <div className="bg-white rounded-lg shadow">
                {coupons.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No coupons found. API Connection Verified.</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Code</th>
                                <th className="p-3 text-left">Discount</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map(c => (
                                <tr key={c.id} className="border-b">
                                    <td className="p-3 font-bold">{c.code}</td>
                                    <td className="p-3">{c.discountvalue} {c.discounttype === 'percentage' ? '%' : '₹'}</td>
                                    <td className="p-3">
                                        {c.isactive ? <span className="text-green-600">Active</span> : <span className="text-red-500">Inactive</span>}
                                    </td>
                                    <td className="p-3 space-x-2">
                                        <button onClick={() => toggleActive(c.id, c.isactive)} className="text-blue-500">Toggle</button>
                                        <button onClick={() => deleteCoupon(c.id)} className="text-red-500">Delete</button>
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
