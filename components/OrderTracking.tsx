import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck, CheckCircle, Package,
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
    const [order, setOrder] = useState<Order>(initialOrder); // Use prop as initial state
    const { isAdmin } = useAuth();
    const toast = useToast();

    // Admin State
    const [newStatus, setNewStatus] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

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

    if (!order) return <div className="text-white/50 text-center py-20">Order data unavailable.</div>;

    const isReturnMode = order.status.toLowerCase().includes('return');
    const statusNormalized = order.status.toLowerCase();

    // Determine the text for the big heading
    let heroHeading = 'PREPARING DISPATCH';
    if (statusNormalized === 'shipped') heroHeading = 'SHIPPED';
    if (statusNormalized === 'out for delivery' || statusNormalized === 'delivery on the way') heroHeading = 'ON THE WAY';
    if (statusNormalized === 'delivered') heroHeading = 'DELIVERED';
    if (statusNormalized === 'returned') heroHeading = 'REFUND PROCESSED';
    if (statusNormalized === 'return requested') heroHeading = 'RETURN REQUESTED';

    // Timeline Configuration (Vertical)
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

    return (
        <div className="bg-[#132c33] rounded-[2.5rem] border border-white/10 p-8 md:p-12 overflow-hidden relative shadow-2xl">
            {/* Subtle Premium Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 lg:gap-20">

                {/* Left Column: Heading & Detailed Logs */}
                <div className="flex flex-col">
                    {/* Header Block */}
                    <div className="mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className={`w-2 h-2 rounded-full ${isReturnMode ? 'bg-rose-500' : 'bg-emerald-400'} animate-pulse`} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                                {isReturnMode ? 'Returns Processing' : 'Order Status'}
                            </p>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tighter text-white leading-none mb-6 uppercase"
                        >
                            {heroHeading}
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center gap-x-6 gap-y-3 p-5 rounded-2xl bg-white/5 border border-white/10 w-max"
                        >
                            <div>
                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Tracking ID</p>
                                <p className="text-sm font-bold text-white tracking-wider">#{order.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />
                            <div>
                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Carrier</p>
                                <p className="text-sm font-bold text-white">FARIO Logistics</p>
                            </div>
                            <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />
                            <div>
                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Est. Delivery</p>
                                <p className="text-sm font-bold text-white">Within 48 Hrs</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Timeline Feed Log */}
                    <div className="flex-1 mt-6">
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <Activity size={14} /> Update History
                        </h3>

                        <div className="space-y-8 pl-4 border-l-2 border-white/10 relative">
                            <AnimatePresence>
                                {(order.timeline || []).slice().reverse().map((event: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative group"
                                    >
                                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white ring-4 ring-[#132c33]" />
                                        <div className="pl-6">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-sm font-black text-white">{event.status}</span>
                                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full">
                                                    {new Date(event.time).toLocaleDateString()} {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-white/60 font-medium leading-relaxed">{event.message}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {(!order.timeline || order.timeline.length === 0) && (
                                <div className="relative pl-6">
                                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white/20 ring-4 ring-[#132c33]" />
                                    <p className="text-sm font-bold text-white/40 italic">Awaiting carrier updates...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Support Block */}
                    <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-sm font-bold text-white">Need help with this order?</p>
                            <p className="text-xs text-white/50 font-medium mt-1">Our customer experience team is ready to assist you.</p>
                        </div>
                        <button className="px-6 py-3 bg-white text-[#132c33] font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors w-full sm:w-auto text-center shrink-0">
                            Contact Support
                        </button>
                    </div>
                </div>


                {/* Right Column: Vertical Journey Map */}
                <div className="lg:border-l border-white/10 lg:pl-12 pt-8 lg:pt-0">
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-8">Journey Progress</h3>

                    <div className="relative">
                        {/* Background Track Line */}
                        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-white/10 rounded-full" />

                        {/* Animated Active Line */}
                        <motion.div
                            className="absolute left-[19px] top-4 w-0.5 bg-white rounded-full origin-top"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: activeStepIndex / (timelineSteps.length - 1) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{ height: 'calc(100% - 32px)' }}
                        />

                        {/* Journey Nodes */}
                        <div className="space-y-12 relative z-10">
                            {timelineSteps.map((step, i) => {
                                const isActive = step.active;
                                const isCurrent = i === activeStepIndex;

                                return (
                                    <div key={i} className="flex items-start gap-6 group">
                                        <div className="relative mt-0.5 shrink-0">
                                            {/* Node Circle */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-out z-10 relative
                                                ${isActive ? 'bg-white text-[#132c33] shadow-lg' : 'bg-[#132c33] text-white/30 border-2 border-white/10'}
                                                ${isCurrent ? 'scale-110 ring-4 ring-white/20' : 'scale-100'}
                                            `}>
                                                <step.icon size={16} strokeWidth={isActive ? 3 : 2} />
                                            </div>

                                            {/* Pulsing ring for current step */}
                                            {isCurrent && (
                                                <div className="absolute inset-0 rounded-full bg-white opacity-40 animate-ping" />
                                            )}
                                        </div>

                                        <div className="pt-2">
                                            <p className={`text-sm font-black uppercase tracking-wider transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/30'}`}>
                                                {step.label}
                                            </p>
                                            {isActive && i === 0 && <p className="text-[10px] text-white/50 font-bold mt-1.5 uppercase tracking-widest">{order.date}</p>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </div>

            {/* Admin Controls (Hidden from users) */}
            {isAdmin && (
                <div className="mt-16 pt-8 border-t border-rose-500/30">
                    <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Search size={14} /> Admin Override Controls
                    </h4>
                    <div className="flex flex-wrap gap-4">
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="bg-white/5 border border-white/10 text-white text-xs font-bold px-4 py-3 rounded-xl focus:outline-none focus:border-rose-500 transition-colors"
                        >
                            <option value="" className="text-gray-900">Select Status...</option>
                            <option value="Processing" className="text-gray-900">Processing</option>
                            <option value="Shipped" className="text-gray-900">Shipped</option>
                            <option value="Out for Delivery" className="text-gray-900">Out for Delivery</option>
                            <option value="Delivered" className="text-gray-900">Delivered</option>
                            <option value="Return Requested" className="text-gray-900">Return Requested</option>
                            <option value="Returned" className="text-gray-900">Returned</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Status Message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 min-w-[200px] bg-white/5 border border-white/10 text-white text-xs font-bold px-4 py-3 rounded-xl focus:outline-none focus:border-rose-500 transition-colors placeholder-white/30"
                        />
                        <button
                            onClick={handleUpdateTimeline}
                            disabled={isUpdating}
                            className="bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50"
                        >
                            {isUpdating ? 'Executing...' : 'Force Update Status'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
