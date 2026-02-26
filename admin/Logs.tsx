import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Filter, User, Activity, ChevronLeft, ChevronRight, Eye, RefreshCw } from 'lucide-react';

interface Log {
    id: string;
    user_id: string | null;
    action: string;
    details: any;
    created_at: string;
    profiles: {
        name: string | null;
        email: string;
    } | null;
}

const AdminLogs: React.FC = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('all');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 15;

    const fetchLogs = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('logs')
                .select(`
          *,
          profiles:user_id (name, email)
        `, { count: 'exact' });

            if (filterAction !== 'all') {
                query = query.eq('action', filterAction);
            }

            if (searchTerm) {
                query = query.or(`action.ilike.%${searchTerm}%, details->>email.ilike.%${searchTerm}%`);
            }

            const { data, count, error } = await query
                .order('created_at', { ascending: false })
                .range((page - 1) * pageSize, page * pageSize - 1);

            if (error) throw error;
            setLogs(data as any[] || []);
            setTotalCount(count || 0);
        } catch (err) {
            console.error('Error fetching logs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, filterAction, searchTerm]);

    const getActionBadge = (action: string) => {
        const baseClass = "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border";
        if (action.includes('error') || action.includes('delete') || action.includes('rejected'))
            return `${baseClass} text-rose-600 bg-rose-50 border-rose-100`;
        if (action.includes('add') || action.includes('create') || action.includes('place') || action.includes('approved') || action.includes('login'))
            return `${baseClass} text-emerald-600 bg-emerald-50 border-emerald-100`;
        if (action.includes('update') || action.includes('change'))
            return `${baseClass} text-sky-600 bg-sky-50 border-sky-100`;
        return `${baseClass} text-slate-500 bg-slate-50 border-slate-100`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="admin-h1">Audit Logs</h1>
                    <p className="admin-subtitle">Comprehensive system activity and transaction ledger.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search log entries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-input pl-10 w-64 shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm">
                        <Filter size={14} className="text-slate-400 ml-2" />
                        <select
                            value={filterAction}
                            onChange={(e) => setFilterAction(e.target.value)}
                            className="bg-transparent border-none py-1.5 pl-1 pr-8 text-xs font-bold text-slate-600 focus:ring-0 outline-none cursor-pointer"
                        >
                            <option value="all">All Events</option>
                            <option value="user_login">Logins</option>
                            <option value="order_placed">Orders</option>
                            <option value="wallet_credit">Wallet Credits</option>
                            <option value="wallet_debit">Wallet Debits</option>
                            <option value="return_requested">Returns</option>
                        </select>
                    </div>

                    <button
                        onClick={() => fetchLogs()}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-fario-purple hover:bg-slate-50 transition-all shadow-sm"
                        title="Refresh Logs"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="admin-table-container">
                <div className="overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="w-48">Event Timestamp</th>
                                <th className="w-40">Classification</th>
                                <th className="w-64">Origin / User</th>
                                <th>Transaction Context</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-50 rounded w-32" /></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-slate-50 rounded-lg w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-50 rounded w-40" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-50 rounded w-3/4" /></td>
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <Activity size={48} className="mx-auto text-slate-100 mb-4" />
                                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No matching activities record found</p>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{formatDate(log.created_at)}</span>
                                                <span className="text-[10px] text-slate-300 font-mono mt-0.5">#{log.id.slice(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={getActionBadge(log.action)}>
                                                {log.action.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] font-black text-white uppercase shadow-sm">
                                                    {log.profiles?.name?.charAt(0) || log.profiles?.email.charAt(0) || <User size={12} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">{log.profiles?.name || 'Authorized Guest'}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{log.profiles?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex flex-wrap gap-1.5 max-w-md">
                                                    {Object.entries(log.details || {}).slice(0, 3).map(([key, val]: any) => (
                                                        <div key={key} className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded border border-slate-100">
                                                            <span className="text-[9px] font-black text-slate-400 uppercase">{key}:</span>
                                                            <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{typeof val === 'object' ? 'DATA' : String(val)}</span>
                                                        </div>
                                                    ))}
                                                    {Object.keys(log.details || {}).length > 3 && (
                                                        <span className="text-[10px] text-slate-300 font-bold italic">+{Object.keys(log.details).length - 3} insights</span>
                                                    )}
                                                </div>
                                                <button className="text-slate-300 hover:text-fario-purple transition-all p-1.5 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 shadow-sm border border-transparent hover:border-slate-100">
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="px-6 py-4 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Displaying <span className="text-slate-900">{(page - 1) * pageSize + 1} — {Math.min(page * pageSize, totalCount)}</span> of <span className="text-slate-900">{totalCount}</span> entries
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-30 hover:bg-slate-50 hover:text-fario-purple transition-all shadow-sm"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="bg-white border border-slate-200 rounded-lg px-4 py-1.5 shadow-sm">
                            <span className="text-xs font-black text-slate-900">Page {page}</span>
                        </div>
                        <button
                            onClick={() => setPage(prev => (prev * pageSize < totalCount ? prev + 1 : prev))}
                            disabled={page * pageSize >= totalCount}
                            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-30 hover:bg-slate-50 hover:text-fario-purple transition-all shadow-sm"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogs;
