import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminCouponsDebug() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        console.log('🔍 Fetching coupons...');
        try {
            const { data, error } = await supabase
                .from('coupons')
                .select('*');

            console.log('📊 Data:', data);
            console.log('❌ Error:', error);

            if (error) {
                setError(error.message);
                console.error('Supabase error:', error);
            } else {
                setCoupons(data || []);
                console.log('✅ Coupons loaded:', data?.length);
            }
        } catch (err: any) {
            console.error('Catch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createTestCoupon = async () => {
        console.log('Creating test coupon...');
        try {
            const { data, error } = await supabase
                .from('coupons')
                .insert({
                    code: 'TEST' + Date.now(),
                    discounttype: 'percentage',
                    discountvalue: 10,
                    minordervalue: 500,
                    isactive: true,
                    usedcount: 0
                })
                .select();

            console.log('Insert result:', { data, error });

            if (error) {
                alert('Error: ' + error.message);
            } else {
                alert('✅ Coupon created!');
                fetchCoupons();
            }
        } catch (err: any) {
            console.error('Error:', err);
            alert('Error: ' + err.message);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 font-sans">
            <h1 className="text-2xl font-bold mb-4">Coupons Debug Page</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <button
                onClick={createTestCoupon}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
            >
                Create Test Coupon
            </button>

            <div className="bg-gray-100 p-4 rounded mb-4">
                <strong>Coupons Count:</strong> {coupons.length}
            </div>

            {coupons.length === 0 ? (
                <p>No coupons found. Try creating one!</p>
            ) : (
                <table className="w-full border collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="border p-2">Code</th>
                            <th className="border p-2">Type</th>
                            <th className="border p-2">Value</th>
                            <th className="border p-2">Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(c => (
                            <tr key={c.id}>
                                <td className="border p-2">{c.code}</td>
                                <td className="border p-2">{c.discounttype}</td>
                                <td className="border p-2">{c.discountvalue}</td>
                                <td className="border p-2">{c.isactive ? '✅' : '❌'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="mt-4 text-sm text-gray-600">
                Check browser console (F12) for detailed logs
            </div>
        </div>
    );
}
