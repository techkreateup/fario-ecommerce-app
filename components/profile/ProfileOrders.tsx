import React, { useState } from 'react';
import { Search, Package, ChevronRight, Truck, PackageCheck, Star, RefreshCw, X, Box, MessageSquare } from 'lucide-react';
import { useCart } from '../../context/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProfileOrders: React.FC = () => {
    const { user } = useAuth();
    const { orders, addToCart, products } = useCart();
    const navigate = useNavigate();

    const [activeFilter, setActiveFilter] = useState('all');
    const filters = [
        { id: 'all', label: 'Orders' },
        { id: 'open', label: 'Not Yet Shipped' },
        { id: 'cancelled', label: 'Cancelled' }
    ];

    // --- INTERACTIVE STATE ---
    const [trackingOpen, setTrackingOpen] = useState<string | null>(null);
    const [feedbackType, setFeedbackType] = useState<'product' | 'seller' | null>(null);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);

    const handleInvoice = (orderId: string) => {
        setIsDownloading(orderId);
        setTimeout(() => {
            setIsDownloading(null);
            alert(`Invoice for Order #${orderId} downloaded successfully!`);
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-200 pb-4">
                <div className="flex items-center gap-8">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Orders</h2>
                    <div className="flex gap-1">
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`
                                    px-4 py-2 text-sm font-bold rounded-full transition-colors
                                    ${activeFilter === filter.id
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                    }
                                `}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search all orders"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-fario-purple focus:ring-1 focus:ring-fario-purple transition-all"
                    />
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
                {orders.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package size={24} className="text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">No orders found</h3>
                        <p className="text-gray-500 text-sm mb-6">You haven't placed any orders yet.</p>
                        <button onClick={() => navigate('/products')} className="px-6 py-2.5 bg-fario-purple text-white rounded-lg font-bold text-sm shadow-sm hover:bg-fario-teal transition-colors">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-gray-300 transition-colors group">
                            {/* Order Header */}
                            <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex flex-wrap gap-y-4 gap-x-12 text-sm text-gray-500">
                                <div>
                                    <span className="block text-xs uppercase font-bold tracking-wider mb-0.5">Order Placed</span>
                                    <span className="font-bold text-gray-900">{order.date}</span>
                                </div>
                                <div>
                                    <span className="block text-xs uppercase font-bold tracking-wider mb-0.5">Total</span>
                                    <span className="font-bold text-gray-900">Rs. {order.total.toLocaleString()}</span>
                                </div>
                                <div>
                                    <span className="block text-xs uppercase font-bold tracking-wider mb-0.5">Ship To</span>
                                    <span className="font-bold text-fario-purple cursor-pointer hover:underline relative group/tooltip">
                                        {user?.user_metadata?.name || 'Verified User'}
                                        <div className="absolute top-full left-0 mt-2 w-48 bg-white p-3 rounded-lg shadow-xl border border-gray-100 hidden group-hover/tooltip:block z-10 text-xs text-gray-600 font-medium">
                                            Shipping address on file.
                                        </div>
                                    </span>
                                </div>
                                <div className="ml-auto flex flex-col items-end gap-1">
                                    <span className="text-xs font-bold text-gray-900">Order # {order.id}</span>
                                    <div className="flex gap-4 text-xs font-bold text-fario-purple">
                                        <button onClick={() => handleInvoice(order.id)} disabled={isDownloading === order.id} className="hover:underline flex items-center gap-1">
                                            {isDownloading === order.id ? 'Downloading...' : 'View Invoice'}
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button onClick={() => navigate(`/orders/${order.id}`)} className="hover:underline flex items-center gap-1 group/link">
                                            Order Details <ChevronRight size={10} className="group-hover/link:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Order Body */}
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left: Items */}
                                    <div className="flex-1 space-y-6">
                                        <h3 className="font-black text-lg text-gray-900 mb-2 flex items-center gap-2">
                                            {order.status === 'Delivered' ? (
                                                <span className="text-green-700">Delivered</span>
                                            ) : (
                                                <span className="text-fario-purple">{order.status}</span>
                                            )}
                                            {order.status === 'Delivered' && <span className="text-sm font-medium text-gray-500">on Feb 14</span>}
                                        </h3>

                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg p-2 shrink-0 flex items-center justify-center cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                                    <img src={item.image} className="max-w-full max-h-full object-contain mix-blend-multiply" alt="" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p onClick={() => navigate(`/product/${item.id}`)} className="font-bold text-fario-purple hover:underline cursor-pointer line-clamp-2 mb-1 text-sm md:text-base">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mb-4 font-medium">Sold by: Fario Retail Pvt Ltd</p>

                                                    <div className="flex gap-3">
                                                        <button onClick={() => {
                                                            const fullProduct = products.find(p => p.id === item.id);
                                                            if (fullProduct) addToCart(fullProduct, "Default");
                                                        }} className="px-4 py-2 bg-fario-purple text-white text-xs font-bold rounded-lg hover:bg-fario-teal transition-colors flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95">
                                                            <RefreshCw size={12} /> Buy it again
                                                        </button>
                                                        <button onClick={() => navigate(`/product/${item.id}`)} className="px-4 py-2 bg-white border border-gray-200 text-gray-900 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">
                                                            View your item
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right: Actions Stack */}
                                    <div className="w-full md:w-64 shrink-0 flex flex-col gap-3 pt-2">
                                        <button
                                            onClick={() => setTrackingOpen(order.id)}
                                            className="w-full py-2.5 bg-gray-50 text-gray-900 rounded-lg font-bold text-xs hover:bg-gray-100 text-left px-4 flex items-center justify-between group/action transition-colors"
                                        >
                                            <span>Track Package</span>
                                            <Box size={14} className="text-gray-400 group-hover/action:text-gray-900 transition-colors" />
                                        </button>
                                        <button
                                            onClick={() => navigate('/orders')}
                                            className="w-full py-2.5 bg-gray-50 text-gray-900 rounded-lg font-bold text-xs hover:bg-gray-100 text-left px-4 flex items-center justify-between group/action transition-colors border border-gray-200"
                                        >
                                            <span className="text-fario-purple">Return / Replace Items</span>
                                            <RefreshCw size={14} className="text-fario-purple group-hover/action:rotate-180 transition-transform duration-500" />
                                        </button>
                                        <button
                                            onClick={() => navigate('/orders')}
                                            className="w-full py-2.5 bg-gray-50 text-gray-900 rounded-lg font-bold text-xs hover:bg-gray-100 text-left px-4 flex items-center justify-between group/action transition-colors"
                                        >
                                            <span>Manage Reviews & Feedback</span>
                                            <Star size={14} className="text-gray-400 group-hover/action:text-yellow-500 transition-colors" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Archive Footer */}
                            <div className="bg-white border-t border-gray-100 px-6 py-3 text-xs font-bold text-fario-purple hover:underline cursor-pointer flex justify-between">
                                <span>Archive Order</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- TRACKING MODAL --- */}
            <AnimatePresence>
                {trackingOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setTrackingOpen(null)} />
                        {(() => {
                            const order = orders.find(o => o.id === trackingOpen);
                            if (!order) return null;
                            return (
                                <motion.div initial={{ opacity: 0, scale: 1, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden">
                                    <div className="bg-gray-900 p-6 text-white flex justify-between items-start">
                                        <div>
                                            <h3 className="font-black text-xl mb-1">Tracking Details</h3>
                                            <p className="text-gray-400 text-sm font-medium">Order #{trackingOpen}</p>
                                        </div>
                                        <button onClick={() => setTrackingOpen(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><X size={18} /></button>
                                    </div>
                                    <div className="p-8 space-y-8">
                                        {order.timeline && order.timeline.length > 0 ? (
                                            order.timeline.map((event: any, i: number) => {
                                                const isLast = i === (order.timeline?.length || 0) - 1;
                                                return (
                                                    <div key={i} className="flex gap-4 relative">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`w-8 h-8 ${isLast ? 'bg-fario-purple text-white animate-pulse' : 'bg-green-100 text-green-600'} rounded-full flex items-center justify-center z-10`}>
                                                                {event.status === 'Delivered' ? <PackageCheck size={16} strokeWidth={3} /> : <Truck size={16} strokeWidth={3} />}
                                                            </div>
                                                            {!isLast && (
                                                                <div className="w-0.5 h-full bg-green-200 absolute top-8 bottom-0 left-[15px]"></div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className={`font-black ${isLast ? 'text-fario-purple text-lg' : 'text-gray-900'}`}>{event.status}</p>
                                                            <p className="text-sm text-gray-600 font-bold">{event.message}</p>
                                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                                                                {new Date(event.time).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-400 font-bold">No tracking data available yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })()}
                    </div>
                )}
            </AnimatePresence>

            {/* --- FEEDBACK MODAL --- */}
            <AnimatePresence>
                {feedbackType && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setFeedbackType(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl p-6 text-center">
                            <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star size={32} fill="currentColor" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">
                                {feedbackType === 'seller' ? 'Rate Seller' : 'Rate Product'}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium mb-6">
                                {feedbackType === 'seller' ? 'How was your experience with Fario Retail Pvt Ltd?' : `How do you like this item?`}
                            </p>

                            <div className="flex justify-center gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button key={s} className="p-2 hover:scale-110 transition-transform text-gray-300 hover:text-yellow-400">
                                        <Star size={32} fill="currentColor" strokeWidth={0} />
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setFeedbackType(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">Cancel</button>
                                <button onClick={() => { setFeedbackType(null); alert('Thanks for your feedback!'); }} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold">Submit</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
