
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
    RotateCcw, CheckCircle, XCircle, Clock,
    Search, Filter, ExternalLink, CreditCard,
    Wallet, RefreshCw, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logAction } from '../services/logService';

interface ReturnRequest {
    id: string;
    orderId: string;
    items: any[];
    reason: string;
    method: 'refund' | 'credit';
    status: string;
    requestedAt: string;
    refundAmount: number;
    auto_decision: boolean;
    decision_reason: string | null;
    decided_at: string | null;
    orders: {
        userEmail: string;
        total: number;
    };
}

const AdminReturns: React.FC = () => {
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchReturns = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('returns')
                .select('*, orders!inner(userEmail, total)')
                .order('requestedat', { ascending: false }); // Use lowercase DB col

            if (error) throw error;

            // Map raw DB columns (lowercase) to frontend interface (CamelCase)
            const mapped = (data as any[] || []).map(r => ({
                ...r,
                requestedAt: r.requestedat || r.requestedAt,
                refundAmount: r.refundamount || r.refundAmount || 0,
                orderId: r.orderid || r.orderId,
                status: r.status,
                method: r.method
            }));

            setReturns(mapped);
        } catch (err) {
            console.error('Error fetching returns:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    const handleDecision = async (id: string, status: 'approved' | 'rejected', reason: string) => {
        setProcessingId(id);
        try {
            const { error } = await supabase
                .from('returns')
                .update({
                    status,
                    decision_reason: reason,
                    decided_at: new Date().toISOString(),
                    auto_decision: false
                })
                .eq('id', id);

            if (error) throw error;

            await logAction(status === 'approved' ? 'return_approved' : 'return_rejected', {
                return_id: id,
                reason
            });

            // Refresh data
            await fetchReturns();
        } catch (err) {
            console.error('Decision error:', err);
        } finally {
            setProcessingId(null);
        }
    };

    const handleRefund = async (ret: ReturnRequest) => {
        setProcessingId(ret.id);
        try {
            // Call RPC to credit wallet and update status
            const { error } = await supabase.rpc('process_return_refund', { return_id: ret.id });

            if (error) throw error;

            await logAction('return_refunded', {
                return_id: ret.id,
                amount: ret.refundAmount,
                method: ret.method
            });

            await fetchReturns();
        } catch (err) {
            console.error('Refund error:', err);
            alert('Refund failed: ' + (err as any).message);
        } finally {
            setProcessingId(null);
        }
    };

    const filteredReturns = returns.filter(r => {
        const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.orders.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || r.status.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return <CheckCircle size={16} className="text-green-500" />;
            case 'rejected': return <XCircle size={16} className="text-red-500" />;
            case 'refunded': return <ShieldCheck size={16} className="text-blue-500" />;
            default: return <Clock size={16} className="text-amber-500" />;
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black font-heading italic tracking-tighter text-white leading-none">Returns & RMA</h1>
                    <p className="text-white/50 text-sm mt-2 font-medium">Manage product return requests and automated decisions.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input
                            type="text"
                            placeholder="Search Return/Order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-fario-purple transition-all w-64 shadow-inner"
                        />
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-fario-purple transition-all shadow-inner"
                    >
                        <option value="all" className="bg-slate-900">All Status</option>
                        <option value="pending" className="bg-slate-900">Pending</option>
                        <option value="approved" className="bg-slate-900">Approved</option>
                        <option value="refunded" className="bg-slate-900">Refunded</option>
                        <option value="rejected" className="bg-slate-900">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw className="text-fario-purple animate-spin" size={48} />
                    </div>
                ) : filteredReturns.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-20 text-center">
                        <RotateCcw size={64} className="mx-auto text-white/10 mb-6" />
                        <h3 className="text-2xl font-bold text-white uppercase italic">No Returns Logged</h3>
                        <p className="text-white/40 max-w-xs mx-auto mt-2">All product lifecycles are currently within healthy operational parameters.</p>
                    </div>
                ) : (
                    filteredReturns.map((ret) => (
                        <motion.div
                            key={ret.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6 hover:bg-white/[0.07] transition-all overflow-hidden"
                        >
                            {/* Decision Badge */}
                            {ret.auto_decision && (
                                <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-fario-purple text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                                    <ShieldCheck size={12} /> Auto-Decided
                                </div>
                            )}

                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left: Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-fario-purple/30 transition-colors">
                                                <RotateCcw size={24} className="text-white/40 group-hover:text-fario-purple transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Request ID: {ret.id}</p>
                                                <h3 className="text-xl font-black text-white italic tracking-tight">Order #{ret.orderId}</h3>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5`}>
                                            {getStatusIcon(ret.status)}
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{ret.status}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-white/5">
                                        <div>
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Customer</p>
                                            <p className="text-sm font-bold text-white/80 truncate">{ret.orders.userEmail}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Refund Method</p>
                                            <div className="flex items-center gap-2 text-white/80">
                                                {ret.method === 'credit' ? <Wallet size={14} className="text-fario-purple" /> : <CreditCard size={14} className="text-fario-purple" />}
                                                <span className="text-sm font-bold uppercase">{ret.method}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Requested Value</p>
                                            <p className="text-sm font-black text-white italic">Rs. {ret.refundAmount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Time Elapsed</p>
                                            <p className="text-sm font-bold text-white/60">{new Date(ret.requestedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Customer Insight</p>
                                        <div className="p-4 bg-black/20 rounded-xl border border-white/5 italic text-white/70 text-sm leading-relaxed">
                                            "{ret.reason}"
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Actions/Details */}
                                <div className="lg:w-80 flex flex-col gap-4">
                                    <div className="flex-grow p-5 bg-fario-purple/5 rounded-2xl border border-fario-purple/10">
                                        <h4 className="text-[10px] font-black text-fario-purple uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <AlertTriangle size={12} /> System Status
                                        </h4>
                                        <p className="text-xs text-white/60 font-medium leading-relaxed">
                                            {ret.decision_reason || "Awaiting manual triage by HQ staff."}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        {ret.status === 'pending_review' || ret.status === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleDecision(ret.id, 'approved', 'Approved by Admin')}
                                                    disabled={!!processingId}
                                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-green-500/10 disabled:opacity-50"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleDecision(ret.id, 'rejected', 'Rejected by Admin')}
                                                    disabled={!!processingId}
                                                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 font-black uppercase text-[10px] tracking-widest py-3 rounded-xl transition-all disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        ) : ret.status === 'approved' ? (
                                            <button
                                                onClick={() => handleRefund(ret)}
                                                disabled={!!processingId}
                                                className="w-full bg-fario-purple hover:bg-fario-purple-dark text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {processingId === ret.id ? <Loader2 className="animate-spin" size={14} /> : <CreditCard size={14} />}
                                                Execute Refund
                                            </button>
                                        ) : (
                                            <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Processing Complete</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

// Helper components
const Loader2 = ({ className, size }: { className?: string; size?: number }) => (
    <RefreshCw className={className} size={size} />
);

export default AdminReturns;
