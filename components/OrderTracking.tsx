import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    Truck, CheckCircle, Package, CircleDot,
    Activity, Clock, RotateCcw, Box, MapPin, Search
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';

interface OrderTrackingProps {
    order: Order;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order: initialOrder }) => {
    const [order, setOrder] = useState<Order>(initialOrder);
    const { isAdmin } = useAuth();
    const toast = useToast();

    // Admin State
    const [newStatus, setNewStatus] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Note: This now purely relies on DB trigger to update the timeline.
    const handleUpdateTimeline = async () => {
        if (!newStatus || !newMessage) {
            toast.error('Please fill in status and message');
            return;
        }

        setIsUpdating(true);
        try {
            // We just update status. The Postgres Trigger TRG_SYNC_ORDER_TIMELINE will auto-append the timeline log.
            // For admin overrides, we can pass both if the API supports it, but the DB handles sync.
            const result = await orderService.updateTimeline(order.id, newStatus, newMessage);
            if (result.success) {
                toast.success('Status updated. Engine syncing timeline...');
                setNewStatus('');
                setNewMessage('');
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        const subscription = supabase
            .channel(`order-tracking-premium-${order.id}`)
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

    if (!order) return <div className="text-slate-500 text-center py-20 font-medium">Order data unavailable.</div>;

    const isReturnMode = order.status.toLowerCase().includes('return');
    const statusNormalized = order.status.toLowerCase();

    // Hero Heading Logic
    let heroHeading = 'PREPARING';
    if (statusNormalized === 'shipped') heroHeading = 'SHIPPED';
    if (statusNormalized === 'out for delivery' || statusNormalized === 'delivery on the way') heroHeading = 'ON THE WAY';
    if (statusNormalized === 'delivered') heroHeading = 'DELIVERED';
    if (statusNormalized === 'returned') heroHeading = 'REFUND PROCESSED';
    if (statusNormalized === 'return requested') heroHeading = 'RETURN PROCESSING';

    // Timeline Configuration
    const getTimeline = () => {
        if (isReturnMode) {
            return [
                { id: 'req', label: 'Return Initiated', icon: RotateCcw, active: true },
                { id: 'app', label: 'Return Approved', icon: CheckCircle, active: ['return approved', 'return picked up', 'returned'].includes(statusNormalized) },
                { id: 'pick', label: 'Package Picked Up', icon: Package, active: ['return picked up', 'returned'].includes(statusNormalized) },
                { id: 'ref', label: 'Refund Processed', icon: CheckCircle, active: statusNormalized === 'returned' }
            ];
        }
        return [
            { id: 'proc', label: 'Order Confirmed', icon: Clock, active: true },
            { id: 'ship', label: 'Shipped', icon: Box, active: ['shipped', 'out for delivery', 'delivery on the way', 'delivered'].includes(statusNormalized) },
            { id: 'transit', label: 'Out for Delivery', icon: Truck, active: ['out for delivery', 'delivery on the way', 'delivered'].includes(statusNormalized) },
            { id: 'del', label: 'Delivered', icon: MapPin, active: statusNormalized === 'delivered' }
        ];
    };

    const timelineSteps = getTimeline();
    const activeStepIndex = timelineSteps.reduce((acc, step, index) => step.active ? index : acc, 0);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-14 overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 lg:gap-24">

                {/* Left Column: Huge Typography & Tracking Logs */}
                <div className="flex flex-col">
                    <div className="mb-14">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 mb-6 bg-slate-50 px-3 py-1.5 rounded-full border border-gray-100"
                        >
                            <div className={`w-2 h-2 rounded-full ${isReturnMode ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                                {isReturnMode ? 'Return Status' : 'Live Tracking'}
                            </p>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="text-5xl md:text-6xl lg:text-[5rem] font-black font-heading tracking-tighter text-slate-900 leading-[0.9] mb-8 uppercase"
                        >
                            {heroHeading}
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center gap-x-10 gap-y-4"
                        >
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tracking No.</p>
                                <p className="text-sm font-black text-slate-900 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Carrier</p>
                                <p className="text-sm font-black text-slate-900">FARIO EXCLUSIVE</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Est. Arrival</p>
                                <p className="text-sm font-black text-emerald-600">Within 48 Hrs</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Minimalist Log Feed */}
                    <div className="flex-1 mt-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Detailed History</h3>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="space-y-8 pl-[11px] border-l-2 border-gray-100 relative"
                        >
                            <AnimatePresence>
                                {(order.timeline || []).slice().reverse().map((event: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        variants={itemVariants}
                                        className="relative group pr-4"
                                    >
                                        <div className="absolute -left-[18px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-gray-300 group-first:border-slate-900 group-first:bg-slate-900 transition-colors" />
                                        <div className="pl-8">
                                            <div className="flex items-baseline gap-3 mb-1.5">
                                                <span className="text-sm font-black text-slate-900">{event.status}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                    {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(event.time).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{event.message}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {(!order.timeline || order.timeline.length === 0) && (
                                <div className="relative pl-8">
                                    <div className="absolute -left-[18px] top-1.5 w-3 h-3 rounded-full bg-gray-100 border-2 border-gray-200" />
                                    <p className="text-sm font-bold text-gray-400 italic">Awaiting manifest updates...</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Support Block */}
                    <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-sm font-black text-slate-900">Need assistance?</p>
                            <p className="text-xs text-gray-500 font-medium mt-1">Our concierge team is available 24/7.</p>
                        </div>
                        <button className="px-8 py-3.5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg w-full sm:w-auto text-center shrink-0 active:scale-95">
                            Contact Concierge
                        </button>
                    </div>
                </div>

                {/* Right Column: Sleek Progress Track */}
                <div className="lg:border-l border-gray-100 lg:pl-16 pt-8 lg:pt-0">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-12">Journey Map</h3>

                    <div className="relative">
                        {/* Background Empty Track */}
                        <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gray-100 rounded-full" />

                        {/* Animated Active Track */}
                        <motion.div
                            className="absolute left-[23px] top-6 w-0.5 bg-slate-900 rounded-full origin-top"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: activeStepIndex / (timelineSteps.length - 1) }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                            style={{ height: 'calc(100% - 48px)' }}
                        />

                        {/* Nodes */}
                        <div className="space-y-16 relative z-10">
                            {timelineSteps.map((step, i) => {
                                const isActive = step.active;
                                const isCurrent = i === activeStepIndex;

                                return (
                                    <div key={i} className="flex items-start gap-8 group">
                                        <div className="relative shrink-0">
                                            {/* Node Container */}
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ease-out z-10 relative
                                                ${isActive ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-gray-300 border-2 border-gray-100'}
                                                ${isCurrent ? 'scale-110' : 'scale-100'}
                                            `}>
                                                <step.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                            </div>

                                            {/* Breathing Ring for Current Step */}
                                            {isCurrent && (
                                                <div className="absolute inset-0 rounded-full bg-slate-900 opacity-20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                                            )}
                                        </div>

                                        <div className="pt-2.5">
                                            <p className={`text-sm font-black uppercase tracking-widest transition-colors duration-500 ${isActive ? 'text-slate-900' : 'text-gray-400'}`}>
                                                {step.label}
                                            </p>
                                            {isActive && i === 0 && <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-widest">{order.date}</p>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Override Array (Hidden from normal users) */}
            {isAdmin && (
                <div className="mt-20 pt-8 border-t border-rose-100">
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Activity size={14} /> Database Sync Override
                    </h4>
                    <div className="flex flex-wrap gap-4">
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="bg-white border-2 border-gray-100 text-slate-900 text-xs font-bold px-5 py-3.5 rounded-xl focus:outline-none focus:border-rose-300 transition-colors cursor-pointer"
                        >
                            <option value="">Select Target Status...</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivery on the way">Delivery on the way</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Return Requested">Return Requested</option>
                            <option value="Returned">Returned</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Optional override message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 min-w-[200px] bg-white border-2 border-gray-100 text-slate-900 text-xs font-bold px-5 py-3.5 rounded-xl focus:outline-none focus:border-rose-300 transition-colors placeholder:text-gray-300"
                        />
                        <button
                            onClick={handleUpdateTimeline}
                            disabled={isUpdating}
                            className="bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-rose-600 transition-all disabled:opacity-50 shadow-sm active:scale-95"
                        >
                            {isUpdating ? 'Syncing...' : 'Force DB Update'}
                        </button>
                        <p className="w-full text-[9px] text-gray-400 font-bold tracking-widest mt-2 uppercase">
                            * Updates here or in Supabase Studio will automatically trigger the Postgres TRG_SYNC_ORDER_TIMELINE hook.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
