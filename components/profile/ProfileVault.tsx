import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star, Bell, BellRing, Award } from 'lucide-react';
import { useCart } from '../../context/CartProvider';
import { PRODUCTS } from '../../constants';

export const ProfileVault: React.FC = () => {
    const { addToCart } = useCart();

    // Mock Data simulating Amazon-style detailed response
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 'ws1',
            name: 'Edustep Core Black (Unisex) | Resilient. Refined. Essential.',
            description: 'The definitive foundation for the modern student.',
            price: 999,
            rating: 4.8,
            reviews: 0,
            boughtCount: '5K+',
            image: PRODUCTS.find(p => p.id === 'p1')?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
            inStock: true,
            isPrime: true,
            isFarioChoice: true,
            priceAlert: false,
            delivery: 'Tomorrow, 28 Jan',
            specs: ['Black', 'Unisex', 'School Standard'],
            originalPrice: 1599,
            discount: 37
        }
    ]);

    const removeItem = (id: string) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    const togglePriceAlert = (id: string) => {
        setWishlistItems(prev => prev.map(item =>
            item.id === id ? { ...item, priceAlert: !item.priceAlert } : item
        ));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        The Wishlist <Heart className="text-fario-purple fill-fario-purple" size={28} />
                    </h2>
                    <p className="text-sm text-gray-500 font-medium tracking-wide uppercase mt-1">Your curated collection of premium essentials</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-gray-900">{wishlistItems.length} ITEM{wishlistItems.length !== 1 && 'S'} SAVED</p>
                </div>
            </div>

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
                                className="bg-white rounded-none sm:rounded-2xl border-b sm:border border-gray-200 p-0 sm:p-6 flex flex-col sm:flex-row gap-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                            >
                                {/* --- LEFT: IMAGE --- */}
                                <div className="relative w-full sm:w-64 aspect-square sm:aspect-auto bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-4">
                                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                        {item.inStock && (
                                            <span className="bg-white/95 backdrop-blur text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm border border-gray-100 text-green-700 tracking-wide">
                                                In Stock
                                            </span>
                                        )}
                                        {/* Fario Choice Badge */}
                                        {item.isFarioChoice && (
                                            <span className="bg-fario-purple text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-lg shadow-fario-purple/20 flex items-center gap-1">
                                                <Award size={10} strokeWidth={3} /> Fario Choice
                                            </span>
                                        )}
                                    </div>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Create "View Options" Overlay on Image Hover */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold text-xs shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            View Options
                                        </button>
                                    </div>
                                </div>

                                {/* --- RIGHT: DETAILS --- */}
                                <div className="flex-1 flex flex-col min-w-0 px-4 sm:px-0 pb-6 sm:pb-0">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg sm:text-xl leading-snug hover:text-fario-purple cursor-pointer transition-colors">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} fill={i < Math.floor(item.rating) ? "currentColor" : "none"} className={i < Math.floor(item.rating) ? "" : "text-gray-300"} />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">{item.reviews} reviews</span>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-xs font-medium text-gray-500">{item.boughtCount} bought in past month</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 -mr-2">
                                            {/* Price Drop Alert Toggle */}
                                            <button
                                                onClick={() => togglePriceAlert(item.id)}
                                                className={`p-2 rounded-full transition-all ${item.priceAlert ? 'bg-fario-purple/10 text-fario-purple' : 'text-gray-300 hover:bg-gray-50'}`}
                                                title={item.priceAlert ? "Price Alerts ON" : "Notify me of Price Drops"}
                                            >
                                                {item.priceAlert ? <BellRing size={20} className="animate-pulse" /> : <Bell size={20} />}
                                            </button>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                                                title="Remove from Wishlist"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price & Prime */}
                                    <div className="mt-3">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black text-gray-900">Rs. {item.price}</span>
                                            <span className="text-sm text-gray-500 line-through">Rs. {item.originalPrice}</span>
                                            <span className="text-xs font-bold text-red-600">({item.discount}% off)</span>
                                        </div>
                                        {item.isPrime && (
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                Up to 5% back with <span className="font-black text-fario-purple">Fario Elite Prime Card</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Delivery */}
                                    <div className="mt-4 text-sm text-gray-900">
                                        <p><span className="font-bold text-gray-500 text-xs">FREE delivery</span> <span className="font-bold">{item.delivery.split(', ')[1]}</span></p>
                                        <p className="text-xs mt-1">Or fastest delivery <span className="font-bold text-green-700">Tomorrow, 28 Jan</span></p>
                                    </div>

                                    <div className="mt-auto pt-6 flex flex-wrap gap-3">
                                        <button
                                            onClick={() => addToCart({
                                                id: item.id,
                                                name: item.name,
                                                price: item.price,
                                                image: item.image,
                                                description: item.description,
                                                category: 'Shoes', // Assuming Shoes for mock
                                                features: [],
                                                gender: 'Unisex',
                                                originalPrice: item.originalPrice,
                                                sizes: item.specs,
                                            } as any, item.specs?.[0] || 'Default')}
                                            className="flex-1 sm:flex-none px-8 py-3 bg-fario-purple text-white rounded-full font-bold text-sm hover:bg-fario-teal transition-all shadow-lg shadow-fario-purple/20 active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            className="flex-1 sm:flex-none px-6 py-3 border border-gray-200 text-gray-900 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Heart className="text-gray-300" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Your Wishlist is empty</h3>
                    <p className="text-gray-500 font-medium mt-2 max-w-sm">Items you love and save will appear here.</p>
                    <button className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-xl">
                        Start Shopping
                    </button>
                </div>
            )}
        </div>
    );
};
