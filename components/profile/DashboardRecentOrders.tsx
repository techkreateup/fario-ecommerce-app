import React, { useState } from 'react';
import { Truck, ChevronRight, PackageCheck, Star, RefreshCw, X, FileText, MessageSquare, Box } from 'lucide-react';
import { PRODUCTS } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartProvider';

interface RecentOrdersProps {
    setActiveTab: (tab: string) => void;
}

export const DashboardRecentOrders: React.FC<RecentOrdersProps> = ({ setActiveTab }) => {
    const navigate = useNavigate();
    const { addToCart, orders, products } = useCart();

    // Get the most recent order and its first item
    const recentOrder = orders && orders.length > 0 ? orders[0] : null;
    const recentOrderItem = recentOrder && recentOrder.items && recentOrder.items.length > 0 ? recentOrder.items[0] : null;

    // Try to find the full product details for 'Buy it again' functionality
    // We check both the context products (Supabase) and the constants (fallback/local)
    const fullProduct = recentOrderItem
        ? (products.find(p => p.id === recentOrderItem.id) || PRODUCTS.find(p => p.id === recentOrderItem.id))
        : null;

    // --- STATE ---
    const [trackingOpen, setTrackingOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState<'product' | 'seller' | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleInvoice = () => {
        setIsDownloading(true);
        // Simulate PDF download
        setTimeout(() => {
            setIsDownloading(false);
            alert("Invoice downloaded successfully!");
        }, 1500);
    };

    if (!recentOrder || !recentOrderItem) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-full flex flex-col items-center justify-center text-center hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Truck className="text-gray-400" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">No recent orders</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">Start shopping to see your orders here!</p>
                <button onClick={() => navigate('/products')} className="px-6 py-2.5 bg-fario-purple text-white rounded-lg font-bold text-sm shadow-sm hover:bg-fario-teal transition-colors">
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <>
            <div id="orders-section" className="bg-white rounded-2xl border border-gray-200 p-0 shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-full flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden">

                {/* --- HEADER: ORDER INFO & LINKS --- */}
                <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex gap-6 text-gray-500 font-medium">
                        <div>
                            <p className="uppercase tracking-wider font-bold text-gray-400">Order Placed</p>
                            <p className="font-bold text-gray-900 mt-0.5">{recentOrder.date}</p>
                        </div>
                        <div>
                            <p className="uppercase tracking-wider font-bold text-gray-400">Total</p>
                            <p className="font-bold text-gray-900 mt-0.5">Rs. {recentOrder.total.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1">
                        <p className="text-gray-500">Order # {recentOrder.id}</p>
                        <div className="flex gap-3 text-fario-purple font-bold">
                            <button onClick={() => navigate(`/orders/${recentOrder.id}`)} className="hover:underline flex items-center gap-1 group/link">
                                Order Details <ChevronRight size={10} className="group-hover/link:translate-x-0.5 transition-transform" />
                            </button>
                            <span className="text-gray-300">|</span>
                            <button onClick={handleInvoice} className="hover:underline flex items-center gap-1" disabled={isDownloading}>
                                {isDownloading ? 'Downloading...' : 'View Invoice'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- MAIN CONTENT --- */}
                <div className="p-6">
                    <h3 className="font-black text-xl text-gray-900 mb-2">{recentOrder.status}</h3>
                    {/* Mock delivery time for demo */}
                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm mb-6">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        {recentOrder.status === 'Delivered' ? 'Delivered' : 'In Transit'}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Image */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-xl border border-gray-100 p-2 shrink-0 flex items-center justify-center relative cursor-pointer"
                            onClick={() => navigate(`/product/${recentOrderItem.id}`)}
                        >
                            <img src={recentOrderItem.image} alt={recentOrderItem.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        </motion.div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-lg hover:text-fario-purple cursor-pointer truncate" onClick={() => navigate(`/product/${recentOrderItem.id}`)}>
                                {recentOrderItem.name}
                            </h4>
                            <p className="text-xs text-gray-500 font-medium mt-1 mb-4">Sold by: <span className="text-blue-600 hover:underline cursor-pointer">Fario Retail Pvt Ltd</span></p>
                            {recentOrder.items.length > 1 && (
                                <p className="text-xs text-gray-400 font-medium mb-3">
                                    + {recentOrder.items.length - 1} more items
                                </p>
                            )}

                            <div className="flex flex-wrap gap-3">
                                {fullProduct && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => addToCart(fullProduct, "Default")}
                                        className="px-4 py-2 bg-fario-purple text-white rounded-lg text-xs font-bold hover:bg-fario-teal transition-colors flex items-center gap-2 shadow-lg shadow-fario-purple/20 active:scale-95"
                                    >
                                        <RefreshCw size={12} /> Buy it again
                                    </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/product/${recentOrderItem.id}`)}
                                    className="px-4 py-2 border border-gray-200 text-gray-900 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors"
                                >
                                    View your item
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* --- ACTION STACK (The "Amazon 7" Links) --- */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-gray-100">
                        <motion.button
                            whileHover={{ x: 5 }}
                            onClick={() => setTrackingOpen(true)}
                            className="w-full py-2.5 bg-gray-50 text-gray-900 rounded-lg font-bold text-xs hover:bg-gray-100 text-left px-4 flex items-center justify-between group/action"
                        >
                            <span>Track Package</span>
                            <Box size={14} className="text-gray-400 group-hover/action:text-gray-900 transition-colors" />
                        </motion.button>
                        <motion.button
                            whileHover={{ x: 5 }}
                            onClick={() => setFeedbackType('seller')}
                            className="w-full py-2.5 bg-gray-50 text-gray-900 rounded-lg font-bold text-xs hover:bg-gray-100 text-left px-4 flex items-center justify-between group/action"
                        >
                            <span>Leave Seller Feedback</span>
                            <MessageSquare size={14} className="text-gray-400 group-hover/action:text-gray-900 transition-colors" />
                        </motion.button>
                        <motion.button
                            whileHover={{ x: 5 }}
                            onClick={() => setFeedbackType('product')}
                            className="w-full py-2.5 bg-gray-50 text-gray-900 rounded-lg font-bold text-xs hover:bg-gray-100 text-left px-4 flex items-center justify-between group/action"
                        >
                            <span>Write a Product Review</span>
                            <Star size={14} className="text-gray-400 group-hover/action:text-gray-900 transition-colors" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* --- TRACKING MODAL --- */}
            <AnimatePresence>
                {trackingOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setTrackingOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden">
                            <div className="bg-gray-900 p-6 text-white flex justify-between items-start">
                                <div>
                                    <h3 className="font-black text-xl mb-1">Tracking Details</h3>
                                    <p className="text-gray-400 text-sm font-medium">Order #{recentOrder?.id}</p>
                                </div>
                                <button onClick={() => setTrackingOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><X size={18} /></button>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="flex gap-4 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center z-10"><PackageCheck size={16} strokeWidth={3} /></div>
                                        <div className="w-0.5 h-full bg-green-200 absolute top-8 bottom-0 left-[15px]"></div>
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900">Order Placed</p>
                                        <p className="text-xs text-gray-500 font-bold">{recentOrder?.date}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center z-10"><Truck size={16} strokeWidth={3} /></div>
                                        <div className="w-0.5 h-full bg-green-200 absolute top-8 bottom-0 left-[15px]"></div>
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900">Processed</p>
                                        <p className="text-xs text-gray-500 font-bold">Items packed & ready</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 bg-fario-purple text-white rounded-full flex items-center justify-center z-10 animate-pulse"><Truck size={16} strokeWidth={3} /></div>
                                    </div>
                                    <div>
                                        <p className="font-black text-fario-purple text-lg">{recentOrder?.status}</p>
                                        <p className="text-sm text-gray-600 font-bold">Updates coming soon</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
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
                                {feedbackType === 'seller' ? 'How was your experience with Fario Retail Pvt Ltd?' : `How do you like "${recentOrderItem?.name}"?`}
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
        </>
    );
};
