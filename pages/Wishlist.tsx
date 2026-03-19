import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartProvider';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Lock, Heart, Star, Bell, BellRing, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist = () => {
    const { addToCart } = useCart();
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();
    const isAuth = !!user;

    // Price Alert State (local UI feature)
    const [priceAlerts, setPriceAlerts] = useState<Record<string, boolean>>({});

    const togglePriceAlert = (productId: string) => {
        setPriceAlerts(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    if (!isAuth) {
        return (
            <div className="min-h-screen bg-white pt-24 pb-12 px-4 flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="text-gray-300" size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">The Wishlist is Locked</h1>
                    <p className="text-gray-500 text-lg">Sign in to access your saved premium collection across all your devices.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-4 bg-fario-purple text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-purple-200 hover:shadow-purple-300 transition-all active:scale-95"
                    >
                        Access The Wishlist
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
                <header className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2 flex items-center gap-4">
                            The Wishlist <Heart className="text-fario-purple fill-fario-purple" size={40} />
                        </h1>
                        <p className="text-gray-500 font-medium tracking-wide uppercase">Your curated collection of premium essentials</p>
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="font-bold text-gray-900 text-lg">{wishlistItems.length} ITEM{wishlistItems.length !== 1 && 'S'} SAVED</p>
                    </div>
                </header>

                {wishlistItems.length > 0 ? (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {wishlistItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    className="bg-white rounded-3xl border border-gray-200 p-0 sm:p-8 flex flex-col sm:flex-row gap-8 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                                >
                                    {/* --- LEFT: IMAGE --- */}
                                    <div className="relative w-full sm:w-72 aspect-square sm:aspect-auto bg-gray-50 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center p-6">
                                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                            {item.inStock && (
                                                <span className="bg-white/95 backdrop-blur text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 text-green-700 tracking-wide">
                                                    In Stock
                                                </span>
                                            )}
                                            {/* Fario Choice Badge - Show for featured products */}
                                            {item.category === 'School Shoes' && (
                                                <span className="bg-fario-purple text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-lg shadow-fario-purple/20 flex items-center gap-1.5">
                                                    <Award size={12} strokeWidth={3} /> Fario Choice
                                                </span>
                                            )}
                                        </div>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {/* Create "View Options" Overlay on Image Hover */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold text-xs shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                View Options
                                            </button>
                                        </div>
                                    </div>

                                    {/* --- RIGHT: DETAILS --- */}
                                    <div className="flex-1 flex flex-col min-w-0 px-6 sm:px-0 pb-8 sm:pb-0">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-2xl leading-snug hover:text-fario-purple cursor-pointer transition-colors max-w-xl">
                                                    {item.name}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={16} fill={i < Math.floor(item.rating || 0) ? "currentColor" : "none"} className={i < Math.floor(item.rating || 0) ? "" : "text-gray-300"} />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">{item.reviewsCount || 0} reviews</span>
                                                    <span className="text-gray-300">|</span>
                                                    <span className="text-xs font-medium text-gray-500">5K+ bought in past month</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 -mr-2">
                                                {/* Price Drop Alert Toggle */}
                                                <button
                                                    onClick={() => togglePriceAlert(item.id)}
                                                    className={`p-3 rounded-full transition-all ${priceAlerts[item.id] ? 'bg-fario-purple/10 text-fario-purple' : 'text-gray-300 hover:bg-gray-50'}`}
                                                    title={priceAlerts[item.id] ? "Price Alerts ON" : "Notify me of Price Drops"}
                                                >
                                                    {priceAlerts[item.id] ? <BellRing size={22} className="animate-pulse" /> : <Bell size={22} />}
                                                </button>

                                                <button
                                                    onClick={() => removeFromWishlist(item.id)}
                                                    className="text-gray-300 hover:text-red-500 p-3 transition-colors"
                                                    title="Remove from Wishlist"
                                                >
                                                    <Trash2 size={22} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price & Prime */}
                                        <div className="mt-4">
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-3xl font-black text-gray-900">Rs. {item.price}</span>
                                                {item.originalPrice && (
                                                    <>
                                                        <span className="text-lg text-gray-500 line-through">Rs. {item.originalPrice}</span>
                                                        <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">-{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%</span>
                                                    </>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5 bg-fario-purple/5 w-fit px-3 py-1.5 rounded-full border border-fario-purple/10">
                                                <span className="w-1.5 h-1.5 rounded-full bg-fario-purple"></span>
                                                Up to 5% back with <span className="font-black text-fario-purple">Fario Elite Prime Card</span>
                                            </p>
                                        </div>

                                        {/* Delivery */}
                                        <div className="mt-6 text-sm text-gray-900 flex flex-col gap-1">
                                            <p className="flex items-center gap-2">
                                                <span className="font-bold text-gray-500 text-xs uppercase tracking-wide">Delivery</span>
                                                <span className="font-bold">Tomorrow, 28 Jan</span>
                                            </p>
                                            <p className="text-xs flex items-center gap-2">
                                                <span className="font-bold text-gray-500 text-xs uppercase tracking-wide">Fastest</span>
                                                <span className="font-bold text-green-700">Tomorrow, 28 Jan</span>
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-8 flex flex-wrap gap-4">
                                            <button
                                                onClick={() => addToCart(item, item.sizes?.[0] || 'OS', item.colors?.[0] || 'Default')}
                                                className="flex-1 sm:flex-none px-10 py-4 bg-fario-purple text-white rounded-full font-bold text-sm hover:bg-fario-teal transition-all shadow-xl shadow-fario-purple/20 active:scale-95 flex items-center justify-center gap-3"
                                            >
                                                <ShoppingBag size={18} /> Add to Cart
                                            </button>
                                            <button
                                                onClick={() => navigate(`/product/${item.id}`)}
                                                className="flex-1 sm:flex-none px-8 py-4 border border-gray-200 text-gray-900 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[2.5rem] border border-gray-100 flex flex-col items-center shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
                            <Heart className="text-gray-300" size={48} />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Your Wishlist is empty</h3>
                        <p className="text-gray-500 font-medium mt-4 max-w-md mx-auto text-lg">Items you love and save will appear here. Start curating your premium collection.</p>
                        <button onClick={() => navigate('/products')} className="mt-10 px-10 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-all shadow-xl hover:-translate-y-1">
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
