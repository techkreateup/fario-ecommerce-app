import React, { useState, useMemo } from 'react';
import {
    Search, RefreshCw, ChevronRight, ChevronLeft, Package, Check, Star, Minus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartProvider';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

import { Order } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import OrderTracking from '../components/OrderTracking';
import { useToast } from '../context/ToastContext';

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const { addToCart, orders, products } = useCart();
    const { user } = useAuth();
    const toast = useToast();

    // State
    const location = useLocation();

    // Determine initial state based on URL
    const getInitialState = () => {
        const path = location.pathname;
        if (path.includes('/return')) return 'RETURNS';
        if (path.includes('/track')) return 'TRACKING';
        return 'ORDERS';
    };

    const [viewState, setViewState] = useState<'ORDERS' | 'RETURNS' | 'TRACKING'>(getInitialState);

    // Sync state if URL changes
    React.useEffect(() => {
        setViewState(getInitialState());
    }, [location.pathname]);


    // Returns State
    const [returnReason, setReturnReason] = useState('');
    const [otherReasonText, setOtherReasonText] = useState('');
    const [refundMethod, setRefundMethod] = useState('wallet');

    // Order History State
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'Orders' | 'Buy Again' | 'Not Yet Shipped' | 'Cancelled'>('Orders');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [activeModal, setActiveModal] = useState<'TRACK' | 'RETURN' | 'REVIEW' | null>(null);

    // Review state
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState('');

    // ============================================================================
    // ORDER ACTION HANDLERS
    // ============================================================================

    /**
     * Archive Order Handler
     */
    const handleArchiveOrder = async (orderId: string) => {
        if (!user || !user.id) {
            toast.error('Please log in to archive orders');
            return;
        }

        try {
            const result = await orderService.archiveOrder(orderId);
            if (result.success) {
                toast.success('Order archived successfully');
                // Supabase realtime channel in CartProvider refreshes orders automatically
            } else {
                toast.error('Failed to archive order');
            }
        } catch (error) {
            console.error('Archive error:', error);
            toast.error('Failed to archive order');
        }
    };

    /**
     * Submit Review Handler
     */
    const handleSubmitReview = async () => {
        if (!selectedOrder || !user || !user.id) {
            toast.error('Please log in to submit reviews');
            return;
        }

        try {
            const result = await orderService.addReview(
                selectedOrder.id,
                reviewRating,
                reviewText
            );

            if (result.success) {
                toast.success('Review submitted successfully! Thank you 🌟');
                setActiveModal(null);
                setReviewText('');
                setReviewRating(5);
                // Supabase realtime handles the refresh
            } else {
                toast.error('Failed to submit review');
            }
        } catch (error) {
            console.error('Review error:', error);
            toast.error('Failed to submit review');
        }
    };

    /**
     * Submit Return Request Handler
     */
    const handleSubmitReturn = async () => {
        if (!selectedOrder || !user || !user.id) {
            toast.error('Please log in to submit returns');
            return;
        }

        const reason = returnReason === 'other' ? otherReasonText : returnReason;
        if (!reason) {
            toast.error('Please provide a return reason');
            return;
        }

        try {
            const result = await orderService.createReturn(
                selectedOrder.id,
                user.id,
                selectedOrder.items,
                reason
            );

            if (result.success) {
                toast.success(`Return request created: ${result.return_id}`);
                setViewState('ORDERS');
                setReturnReason('');
                setOtherReasonText('');
                // Supabase realtime handles the refresh
            } else {
                toast.error('Failed to create return request');
            }
        } catch (error) {
            console.error('Return error:', error);
            toast.error('Failed to create return request');
        }
    };


    // Filter Logic
    const filteredOrders = useMemo(() => {
        let result = orders;

        // Tab Filter
        if (activeTab === 'Buy Again') result = orders.filter(o => o.status === 'Delivered');
        else if (activeTab === 'Not Yet Shipped') result = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
        else if (activeTab === 'Cancelled') result = orders.filter(o => o.status === 'Cancelled');

        // Search Filter
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            result = result.filter(o =>
                o.id.toLowerCase().includes(lowerQ) ||
                o.items.some(i => i.name.toLowerCase().includes(lowerQ))
            );
        }
        return result;
    }, [orders, activeTab, searchQuery]);

    const formatPrice = (price: number) => `Rs. ${price.toLocaleString('en-IN')}`;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 relative isolate pt-24 pb-32">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ORDERS HISTORY VIEW */}
                {viewState === 'ORDERS' && (
                    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Orders</h1>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search orders..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-fario-purple outline-none w-64"
                                    />
                                </div>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-black transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>

                        {/* TABS */}
                        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
                            {(['Orders', 'Buy Again', 'Not Yet Shipped', 'Cancelled'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-fario-purple text-fario-purple' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <p className="font-bold text-gray-700">{filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found</p>

                            {filteredOrders.map((order) => (
                                <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:border-gray-300 transition-all">
                                    {/* Order Header */}
                                    <div className="bg-gray-50/80 border-b border-gray-200 p-4 flex flex-wrap gap-y-4 justify-between items-center text-xs md:text-sm">
                                        <div className="flex gap-8">
                                            <div>
                                                <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">Order Placed</p>
                                                <p className="font-bold text-gray-700">{order.date}</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">Total</p>
                                                <div className="flex flex-col">
                                                    <p className="font-bold text-gray-700">{formatPrice(order.total)}</p>
                                                    {(() => {
                                                        const subTotal = order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
                                                        const savings = subTotal - order.total;
                                                        return savings > 0 ? (
                                                            <p className="text-[10px] font-bold text-emerald-600">Saved {formatPrice(savings)}</p>
                                                        ) : null;
                                                    })()}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">Ship To</p>
                                                <div className="group relative cursor-pointer">
                                                    <p className="font-bold text-[#007185] group-hover:text-fario-purple group-hover:underline flex items-center gap-1">
                                                        {typeof order.shippingAddress === 'string' ? "Akash" : order.shippingAddress?.fullName || 'Akash'} <ChevronRight size={12} />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">Order # {order.id}</p>
                                            <div className="flex gap-2 text-[#007185] font-medium text-xs">
                                                <span className="hover:underline hover:text-fario-purple cursor-pointer">View Order Details</span>
                                                <span className="text-gray-300">|</span>
                                                <span className="hover:underline hover:text-fario-purple cursor-pointer">Invoice</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Body */}
                                    <div className="p-4 md:p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">{order.status === 'Delivered' ? 'Delivered' : order.status}</h3>
                                                <p className="text-sm text-gray-500 mb-4">{order.status === 'Delivered' ? `Delivered` : `Arriving Tomorrow by 9 PM`}</p>

                                                <div className="space-y-4">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex gap-4">
                                                            <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-gray-200 cursor-pointer" onClick={() => navigate(`/products/${item.id}`)}>
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-black text-base text-gray-900 uppercase tracking-tight mb-1 hover:text-fario-purple hover:underline cursor-pointer" onClick={() => navigate(`/products/${item.id}`)}>{item.name}</h4>
                                                                <p className="text-xs text-gray-500 mb-1">Qty: <span className="font-bold text-gray-900">{item.quantity}</span></p>
                                                                <p className="text-xs text-gray-500">Sold by: <span className="font-bold text-gray-900">Fario Retail</span></p>
                                                                <p className="text-lg font-black text-fario-purple mt-2">{formatPrice(item.price)}</p>

                                                                {/* Mobile Actions */}
                                                                <div className="md:hidden mt-3 flex flex-col gap-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            const product = products.find(p => p.id === item.id);
                                                                            if (product) {
                                                                                addToCart(product, "M");
                                                                                toast.success('Item added to cart');
                                                                            } else {
                                                                                toast.error('Product not available');
                                                                            }
                                                                        }}
                                                                        className="w-full py-2 bg-fario-purple/10 text-fario-purple rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-fario-purple hover:text-white transition-colors flex items-center justify-center gap-2"
                                                                    >
                                                                        <RefreshCw size={14} /> Buy it again
                                                                    </button>
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <button
                                                                            onClick={() => { setSelectedOrder(order); setViewState('TRACKING'); }}
                                                                            className="w-full py-2 bg-white border border-gray-300 text-gray-800 rounded-lg text-xs font-bold shadow-sm"
                                                                        >
                                                                            Track
                                                                        </button>
                                                                        <button
                                                                            onClick={() => { setSelectedOrder(order); setViewState('RETURNS'); }}
                                                                            className="w-full py-2 bg-white border border-gray-300 text-gray-800 rounded-lg text-xs font-bold shadow-sm"
                                                                        >
                                                                            Return
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => { setSelectedOrder(order); setActiveModal('REVIEW'); }}
                                                                        className="w-full py-2 bg-white border border-gray-300 text-gray-800 rounded-lg text-xs font-bold shadow-sm"
                                                                    >
                                                                        Write Review
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action Buttons (Desktop Sidebar) */}
                                            <div className="hidden md:flex flex-col gap-3 w-64 shrink-0">
                                                <button
                                                    onClick={() => { setSelectedOrder(order); setViewState('TRACKING'); }}
                                                    className="w-full py-2 bg-white border border-gray-300 text-gray-800 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors"
                                                >
                                                    Track Package
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedOrder(order); setViewState('RETURNS'); }}
                                                    className="w-full py-2 bg-white border border-gray-300 text-gray-800 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors"
                                                >
                                                    Return Items
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        let addedCount = 0;
                                                        order.items.forEach(i => {
                                                            const product = products.find(p => p.id === i.id);
                                                            if (product) {
                                                                addToCart(product, "M");
                                                                addedCount++;
                                                            }
                                                        });
                                                        if (addedCount > 0) {
                                                            toast.success('Items added to cart');
                                                        } else {
                                                            toast.error('Products not available');
                                                        }
                                                    }}
                                                    className="w-full py-2 bg-fario-purple text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-fario-teal shadow-md transition-all flex items-center justify-center gap-2"
                                                >
                                                    <RefreshCw size={14} /> Buy it again
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedOrder(order); setActiveModal('REVIEW'); }}
                                                    className="w-full py-2 bg-white border border-gray-300 text-gray-800 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors mt-2"
                                                >
                                                    Write a product review
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="bg-gray-50/50 p-3 border-t border-gray-200 text-xs font-medium text-purple-700 flex items-center gap-2">
                                        <span
                                            onClick={() => handleArchiveOrder(order.id)}
                                            className="font-bold cursor-pointer hover:underline"
                                        >
                                            Archive Order
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {filteredOrders.length === 0 && (
                                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
                                    <h3 className="font-bold text-gray-400 text-lg">No orders found</h3>
                                    <button onClick={() => { setSearchQuery(''); setActiveTab('Orders'); }} className="mt-4 text-fario-purple font-bold hover:underline">Clear Filters</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* TRACKING VIEW */}
            {
                viewState === 'TRACKING' && selectedOrder && (
                    <div className="max-w-5xl mx-auto animate-in fade-in duration-300 pb-20">
                        <div className="mb-8 px-4 md:px-0">
                            <button
                                onClick={() => setViewState('ORDERS')}
                                className="text-gray-500 hover:text-black hover:underline text-sm font-bold uppercase tracking-widest flex items-center gap-1 group"
                            >
                                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Vector List
                            </button>
                        </div>
                        <OrderTracking order={selectedOrder} />
                    </div>
                )
            }

            {/* RETURNS VIEW */}
            {
                viewState === 'RETURNS' && selectedOrder && (
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={() => setViewState('ORDERS')}
                            className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-fario-purple transition-colors uppercase tracking-wide group"
                        >
                            <div className="p-1 rounded-full bg-gray-100 group-hover:bg-fario-purple/10 transition-colors">
                                <ChevronLeft size={16} />
                            </div>
                            Back to Orders
                        </button>

                        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5">
                            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Return Items</h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Package size={16} />
                                        <span>Order #<span className="font-mono font-bold text-gray-700">{selectedOrder.id}</span></span>
                                    </div>
                                </div>
                                <div className="hidden md:block text-right">
                                    <p className="text-xs font-bold text-fario-purple uppercase tracking-widest mb-1">Refund Estimate</p>
                                    <p className="text-2xl font-black text-gray-900">{formatPrice(selectedOrder.total)}</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-12">
                                {/* Step 1: Reason */}
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="w-10 h-10 rounded-xl bg-fario-purple text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-fario-purple/30">1</span>
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Why are you returning this?</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-14">
                                        {[
                                            'Performance or quality not adequate',
                                            'Product damaged, but shipping box OK',
                                            'Missing parts or accessories',
                                            'Wrong item was sent',
                                            'Other'
                                        ].map((r) => (
                                            <div key={r} className={r === 'Other' ? 'md:col-span-2' : ''}>
                                                <label
                                                    className={`relative flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 group
                                                ${returnReason === r
                                                            ? 'border-fario-purple bg-fario-purple/5 shadow-md scale-[1.01]'
                                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                                                    onClick={() => setReturnReason(r)}
                                                >
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${returnReason === r ? 'border-fario-purple bg-fario-purple' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                                        {returnReason === r && <Check size={14} className="text-white" />}
                                                    </div>
                                                    <span className={`text-sm font-bold ${returnReason === r ? 'text-gray-900' : 'text-gray-600'}`}>{r}</span>
                                                </label>

                                                {/* "Other" Text Area Micro-interaction */}
                                                <AnimatePresence>
                                                    {r === 'Other' && returnReason === 'Other' && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                                                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <textarea
                                                                value={otherReasonText}
                                                                onChange={(e) => setOtherReasonText(e.target.value)}
                                                                placeholder="Please tell us more about the issue..."
                                                                className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-fario-purple focus:ring-4 focus:ring-fario-purple/5 resize-none h-32 bg-gray-50 focus:bg-white transition-all"
                                                            ></textarea>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Step 2: Refund Method */}
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="w-10 h-10 rounded-xl bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-lg">2</span>
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Select Refund Method</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-0 md:ml-14">
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setRefundMethod('wallet')}
                                            className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all overflow-hidden ${refundMethod === 'wallet' ? 'border-fario-purple bg-white shadow-xl shadow-fario-purple/10' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                        >
                                            {refundMethod === 'wallet' && (
                                                <div className="absolute top-0 right-0 bg-fario-purple text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                                                    Recommended
                                                </div>
                                            )}
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`p-3 rounded-xl ${refundMethod === 'wallet' ? 'bg-fario-purple text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Fario Wallet</p>
                                                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide">Instant Refund</p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                Get your refund instantly after the item is picked up. Use it for your next purchase.
                                            </p>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setRefundMethod('source')}
                                            className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${refundMethod === 'source' ? 'border-fario-purple bg-white shadow-xl shadow-fario-purple/10' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`p-3 rounded-xl ${refundMethod === 'source' ? 'bg-fario-purple text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Original Payment</p>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">3-5 Business Days</p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                Refund will be credited back to your original payment method (Bank/Card).
                                            </p>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="ml-0 md:ml-14 pt-6 border-t border-gray-100 flex items-center gap-6">
                                    <button
                                        onClick={handleSubmitReturn}
                                        disabled={!returnReason || (returnReason === 'Other' && !otherReasonText)}
                                        className="bg-fario-purple hover:bg-[#684389] text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex-1 md:flex-none"
                                    >
                                        Confirm Return
                                    </button>
                                    <button
                                        onClick={() => setViewState('ORDERS')}
                                        className="text-gray-500 hover:text-fario-purple font-bold text-sm uppercase tracking-wide px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <AnimatePresence>
                {activeModal && selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setActiveModal(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg">
                                    {activeModal === 'REVIEW' && 'Write a Review'}
                                </h3>
                                <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                    <Minus className="rotate-45 text-gray-500" size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {activeModal === 'REVIEW' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-lg p-2 border border-gray-200">
                                                <img src={selectedOrder.items[0].image} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm max-w-[200px]">{selectedOrder.items[0].name}</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Overall Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        size={32}
                                                        className={`cursor-pointer transition-colors ${star <= reviewRating
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-300 fill-transparent hover:text-yellow-400'
                                                            }`}
                                                        onClick={() => setReviewRating(star)}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Add a headline</label>
                                            <input type="text" placeholder="What's most important to know?" className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-fario-purple" />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Add a written review</label>
                                            <textarea
                                                placeholder="What did you like or dislike?"
                                                rows={4}
                                                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-fario-purple resize-none"
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                            ></textarea>
                                        </div>

                                        <button
                                            onClick={handleSubmitReview}
                                            disabled={!reviewText}
                                            className="w-full py-3 bg-gray-900 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div >
    );
};

export default Orders;
