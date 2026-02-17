
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck, CheckCircle, Package, Clock,
    MapPin, ChevronRight, Activity, Zap,
    ShieldCheck, AlertCircle, RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';

interface OrderTrackingProps {
    order: Order;
    onClose?: () => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order: initialOrder, onClose }) => {
    const [order, setOrder] = useState<Order>(initialOrder); // Use prop as initial state
    const [loading, setLoading] = useState(false); // No fetch needed initially
    const { isAdmin } = useAuth();
    const toast = useToast();

    // Admin State
    const [newStatus, setNewStatus] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrderDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', order.id)
                .single();

            if (data) setOrder(data);
        } catch (err) {
            console.error('Tracking fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTimeline = async () => {
        if (!newStatus || !newMessage) {
            toast.error('Please fill in status and message');
            return;
        }

        setIsUpdating(true);
        try {
            const result = await orderService.updateTimeline(order.id, newStatus, newMessage);
            if (result.success) {
                toast.success('Timeline updated successfully');
                setNewStatus('');
                setNewMessage('');
                // fetchOrderDetails(); // Optional: Rely on Realtime or parent update
            } else {
                toast.error('Failed to update timeline');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update timeline');
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        // Realtime subscription for this specific order
        const subscription = supabase
            .channel(`order-tracking-${order.id}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${order.id}` },
                (payload) => {
                    console.log('Order Update Received:', payload.new);
                    setOrder(payload.new as Order);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [order.id]);

    const getProgressWidth = (status: string) => {
        switch (status.toLowerCase()) {
            case 'processing': return '25%';
            case 'confirmed': return '25%';
            case 'shipped': return '50%';
            case 'out for delivery': return '75%';
            case 'delivered': return '100%';
            case 'cancelled': return '0%';
            default: return '10%';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 border-4 border-fario-purple border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(122,81,160,0.3)]" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 animate-pulse">Syncing Satellite Data...</p>
            </div>
        );
    }

    if (!order) return <div className="text-white/50 text-center py-20">Transmission Lost: Order data not found.</div>;

    return (
        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/10 p-10 overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-fario-purple/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />

            <div className="relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Live Transmission</p>
                        </div>
                        <h2 className="text-4xl font-black font-heading italic tracking-tighter text-white leading-none">
                            {order.status === 'Delivered' ? 'MISSION ACCOMPLISHED' : 'IN TRANSIT'}
                        </h2>
                        <div className="flex items-center gap-4 mt-3 text-white/40 text-[10px] font-black uppercase tracking-widest">
                            <span>Carrier: Fario Logistics</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            <span>Vector: {order.id}</span>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-right">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Expected Delivery</p>
                        <p className="text-xl font-black text-white italic tracking-tight">
                            {order.status === 'Delivered' ? 'Delivered' : 'Within 24-48 Hours'}
                        </p>
                    </div>
                </div>

                {/* Dynamic Progress Engine */}
                <div className="mb-20 relative">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: getProgressWidth(order.status) }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-fario-purple to-fario-purple shadow-[0_0_20px_rgba(122,81,160,0.5)] relative"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                        </motion.div>
                    </div>

                    <div className="flex justify-between mt-6">
                        {[
                            { label: 'Logged', icon: Activity, active: true },
                            { label: 'Shipped', icon: Package, active: ['shipped', 'out for delivery', 'delivered'].includes(order.status.toLowerCase()) },
                            { label: 'Transit', icon: Truck, active: ['out for delivery', 'delivered'].includes(order.status.toLowerCase()) },
                            { label: 'Arrival', icon: CheckCircle, active: order.status.toLowerCase() === 'delivered' }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${step.active ? 'bg-fario-purple border-fario-purple text-white shadow-[0_0_15px_rgba(122,81,160,0.4)] scale-110' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                    <step.icon size={18} />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-500 ${step.active ? 'text-white' : 'text-white/20'}`}>{step.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Logistics HUD Line */}
                    <div className="absolute -top-12 left-0 w-full flex justify-between px-2 opacity-10">
                        {Array(20).fill(0).map((_, i) => <div key={i} className="w-[1px] h-2 bg-white" />)}
                    </div>
                </div>

                {/* Detailed Logs Terminal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4 border-b border-white/5 pb-4">Timeline Feed</h3>
                        <div className="space-y-8 pl-6 border-l border-white/10 ml-2">
                            <AnimatePresence>
                                {(order.timeline || []).slice().reverse().map((event: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="relative"
                                    >
                                        <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-fario-purple shadow-[0_0_8px_#7a51a0] border-2 border-[#111]" />
                                        <div className="grid grid-cols-[100px_1fr] gap-6">
                                            <div className="text-[10px] font-mono text-white/40 pt-1">
                                                <p>{new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                <p className="mt-1">{new Date(event.time).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white italic tracking-tight">{event.status}</p>
                                                <p className="text-xs text-white/50 font-medium leading-relaxed mt-1">{event.message}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Initial Entry if timeline empty */}
                            {(!order.timeline || order.timeline.length === 0) && (
                                <div className="relative">
                                    <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-white/10 border-2 border-[#111]" />
                                    <div className="grid grid-cols-[100px_1fr] gap-6 text-white/20 italic">
                                        <p className="text-[10px] font-mono">--:--</p>
                                        <p className="text-xs">Awaiting primary scan...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                            <h4 className="text-[10px] font-black text-fario-purple uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ShieldCheck size={12} /> Dispatch Status
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-white/40 font-medium">Order Rating</span>
                                    <span className="text-white italic tracking-tighter">PHASE_STABLE</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-white/40 font-medium">Auth Scan</span>
                                    <span className="text-cyan-400 text-[10px] uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded">Verified</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-fario-purple/10 rounded-3xl p-6 border border-fario-purple/20">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle size={20} className="text-fario-purple" />
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">Support Core</h4>
                            </div>
                            <p className="text-[11px] text-white/60 font-medium leading-relaxed mb-4">
                                Our neural support nexus is available 24/7 if your shipment experiences any spatial displacement.
                            </p>
                            <button className="w-full py-3 bg-fario-purple text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-fario-purple/80 transition-all">
                                Open Comms
                            </button>
                        </div>
                    </div>
                </div>

                {/* Admin Controls */}
                {isAdmin && (
                    <div className="mt-10 bg-white/10 rounded-3xl p-6 border border-white/20">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap size={14} className="text-yellow-400" /> Admin Command
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="bg-black/40 text-white text-xs font-bold uppercase tracking-wide border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/30"
                            >
                                <option value="">Select Status Event...</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Custom">Custom Alert</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Log Message (e.g. Cleared customs)"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="bg-black/40 text-white text-xs font-medium border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/30"
                            />

                            <button
                                onClick={handleUpdateTimeline}
                                disabled={isUpdating}
                                className="bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
                            >
                                {isUpdating ? 'Transmitting...' : 'Update Timeline'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
