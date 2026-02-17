import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminCouponsDebug() {
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    };

    const checkAuth = async () => {
        addLog('🕵️ Checking Auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) addLog(`❌ Auth Error: ${error.message}`);
        else if (session) {
            addLog(`✅ Logged in as: ${session.user.email}`);
            addLog(`🆔 User ID: ${session.user.id}`);
            // Check profile role
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
            addLog(`bust: Profile Role: ${profile?.role || 'null'}`);
        } else {
            addLog('⚠️ No active session');
        }
    };

    const fetchCoupons = async () => {
        setLoading(true);
        addLog('🚀 Fetching coupons (with 5s timeout)...');

        try {
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('TIMEOUT after 5 seconds')), 5000)
            );

            // Create the fetch promise
            const fetchPromise = supabase.from('coupons').select('*');

            // Race them
            const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

            if (error) {
                addLog(`❌ Supabase Error: ${error.message}`);
                console.error(error);
            } else {
                addLog(`✅ Success! Found ${data?.length} coupons.`);
                addLog(`📄 Data: ${JSON.stringify(data).slice(0, 100)}...`);
            }
        } catch (err: any) {
            addLog(`🔥 CRITICAL FAILURE: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 font-sans max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">🛠️ Advanced Coupons Diagnostics</h1>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={checkAuth}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                    1. Check Auth & Role
                </button>
                <button
                    onClick={fetchCoupons}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Fetching...' : '2. Test Fetch (5s Timeout)'}
                </button>
            </div>

            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[300px] overflow-auto border border-gray-700 shadow-inner">
                {logs.length === 0 ? (
                    <div className="text-gray-500 italic">Ready for diagnostics... Click buttons above.</div>
                ) : (
                    logs.map((log, i) => <div key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0">{log}</div>)
                )}
            </div>
        </div>
    );
}
