import React, { useMemo, useState } from 'react';
import { ShoppingBag, ChevronRight, CheckCircle2, Gift, Star, TicketPercent, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { validateCoupon } from '../utils/couponUtils';

// Pagination component helper
const Pagination = ({ total, perPage, current, onChange }: { total: number, perPage: number, current: number, onChange: (page: number) => void }) => {
    const totalPages = Math.ceil(total / perPage);
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center gap-2 mt-4 text-xs font-bold uppercase tracking-widest text-gray-500">
            <button
                onClick={() => onChange(Math.max(1, current - 1))}
                disabled={current === 1}
                className="p-1 hover:text-fario-purple disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
            >
                <ChevronRight className="rotate-180" size={16} />
            </button>
            <span>Page {current} of {totalPages}</span>
            <button
                onClick={() => onChange(Math.min(totalPages, current + 1))}
                disabled={current === totalPages}
                className="p-1 hover:text-fario-purple disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        savedItems,
        saveForLater,
        moveToCart,
        products,
    } = useCart();

    // Coupon popup state
    const [showCouponPopup, setShowCouponPopup] = useState(false);
    const [couponSavedAmount, setCouponSavedAmount] = useState(0);

    // Coupon State
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponMessage, setCouponMessage] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    const [recPage, setRecPage] = useState(1);
    const { user } = useAuth();
    const isAuth = !!user;

    // Calculations
    const subtotal = useMemo(() =>
        cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        [cartItems]
    );

    const [deliverySpeed] = useState<'STANDARD' | 'EXPRESS'>('STANDARD');
    const deliveryFee = deliverySpeed === 'EXPRESS' ? 99 : 0;

    // Recalculate discount whenever subtotal changes if we have a percentage coupon
    React.useEffect(() => {
        if (appliedCoupon && appliedCoupon.discounttype === 'percentage') {
            let d = (subtotal * appliedCoupon.discountvalue) / 100;
            if (appliedCoupon.maxdiscount && d > appliedCoupon.maxdiscount) {
                d = appliedCoupon.maxdiscount;
            }
            setDiscountAmount(d);
        } else if (appliedCoupon && appliedCoupon.discounttype === 'fixed') {
            setDiscountAmount(Math.min(appliedCoupon.discountvalue, subtotal));
        } else {
            // If subtotal drops below min order value? validateCoupon covers this on apply, 
            // but dynamic updates might need re-validation. 
            // For now, we'll keep the simple logic or re-validate if needed.
            // Ideally we re-check validity here but let's keep it simple for now.
            if (appliedCoupon && subtotal < appliedCoupon.minordervalue) {
                setAppliedCoupon(null);
                setDiscountAmount(0);
                setCouponMessage(`Coupon removed: Order value less than Rs. ${appliedCoupon.minordervalue}`);
            }
        }
    }, [subtotal, appliedCoupon]);

    const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
    const formatPrice = (price: number) => `Rs. ${price.toLocaleString('en-IN')}`;

    // Coupon Handlers
    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setIsValidating(true);
        setCouponMessage('');

        const result = await validateCoupon(couponInput, subtotal);
        setIsValidating(false);

        if (result.valid) {
            setAppliedCoupon(result.coupon);
            setDiscountAmount(result.discount || 0);
            setCouponMessage(result.message);
            // Show animated popup
            setCouponSavedAmount(result.discount || 0);
            setShowCouponPopup(true);
            setTimeout(() => setShowCouponPopup(false), 3500);
        } else {
            setCouponMessage(result.message);
            setAppliedCoupon(null);
            setDiscountAmount(0);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponInput('');
        setCouponMessage('');
    };

    // Recommendation logic — use real Supabase products
    const recommendedProducts = products.filter(p => !cartItems.some(ci => ci.id === p.id));
    const recPerPage = 4;
    const currentRecs = recommendedProducts.slice((recPage - 1) * recPerPage, recPage * recPerPage);

    return (
        <>
            {/* Coupon Success Popup */}
            <AnimatePresence>
                {showCouponPopup && (
                    <motion.div
                        initial={{ opacity: 0, y: -80, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -60, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 18, stiffness: 260 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/40 flex items-center gap-3 min-w-[280px] max-w-sm"
                    >
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-wider">Coupon Applied! 🎉</p>
                            <p className="text-emerald-100 text-xs font-medium mt-0.5">You saved Rs. {couponSavedAmount.toLocaleString('en-IN')}!</p>
                        </div>
                        <button onClick={() => setShowCouponPopup(false)} className="ml-auto p-1 hover:bg-white/20 rounded-full transition-colors">
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="min-h-screen bg-white font-sans text-gray-800 pt-24 pb-32">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Page Title */}
                    <div className="mb-8 flex items-end justify-between border-b border-gray-100 pb-4">
                        <div className="flex items-baseline gap-4">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Shopping Bag</h1>
                            <p className="text-fario-purple font-bold tracking-widest text-xs uppercase self-center translate-y-[-2px]">
                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                            </p>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Price</p>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="text-center py-24 bg-white/50 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl">
                            <div className="w-24 h-24 bg-fario-purple/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                <ShoppingBag size={48} className="text-fario-purple" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your bag is empty</h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't discovered our latest drops yet.</p>
                            <button
                                onClick={() => navigate('/products')}
                                className="bg-gray-900 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-fario-purple transition-all shadow-lg hover:shadow-fario-purple/30 active:scale-95"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                            {/* Cart Items - Main Area */}
                            <div className="lg:col-span-3 space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.cartId} className="group relative flex gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-fario-purple/20 transition-all duration-300">

                                        {/* Product Image */}
                                        <div
                                            className="w-40 h-40 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden cursor-pointer"
                                            onClick={() => navigate(`/products/${item.id}`)}
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3
                                                        className="text-lg font-bold text-gray-900 leading-tight group-hover:text-fario-purple transition-colors cursor-pointer"
                                                        onClick={() => navigate(`/products/${item.id}`)}
                                                    >
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-xs font-medium text-gray-500 mt-1">{item.category}</p>
                                                </div>
                                                <p className="text-xl font-black text-gray-900 tracking-tight">{formatPrice(item.price)}</p>
                                            </div>

                                            <div className="flex flex-col gap-1 mb-3">
                                                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">{item.selectedSize} • {item.selectedColor}</p>

                                                {/* Stock Availability — uses real stockQuantity from Supabase */}
                                                {(() => {
                                                    const realProduct = products.find(p => p.id === item.id);
                                                    const stock = realProduct?.inStock === false ? 0 : (realProduct?.stockQuantity ?? 50);

                                                    if (stock === 0) {
                                                        return (
                                                            <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                                                                Out of Stock — please remove to checkout
                                                            </p>
                                                        );
                                                    } else if (stock < 5) {
                                                        return (
                                                            <p className="text-xs font-bold text-amber-600 mt-1 flex items-center gap-1 animate-pulse">
                                                                Only {stock} left — order soon!
                                                            </p>
                                                        );
                                                    } else {
                                                        return (
                                                            <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                                                                <CheckCircle2 size={12} fill="currentColor" className="text-emerald-100" /> In Stock
                                                            </p>
                                                        );
                                                    }
                                                })()}

                                                <p className="text-[10px] text-gray-500">Eligible for <span className="font-bold text-fario-purple">FREE Shipping</span></p>

                                                {/* Fario Fulfilled Badge */}
                                                <div className="flex items-center gap-1 mt-1 w-fit bg-fario-purple/10 px-1.5 py-0.5 rounded-[2px]">
                                                    <span className="text-[10px] font-black italic text-fario-purple uppercase tracking-tighter">Fario</span>
                                                    <span className="text-[10px] font-bold text-gray-400 tracking-tight">Fulfilled</span>
                                                </div>

                                                {/* Gift Option */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <input type="checkbox" id={`gift-${item.cartId}`} className="accent-fario-purple w-3.5 h-3.5 rounded cursor-pointer" />
                                                    <label htmlFor={`gift-${item.cartId}`} className="text-xs text-gray-600 flex items-center gap-1 cursor-pointer select-none">
                                                        <Gift size={12} className="text-fario-purple" />
                                                        This will be a gift
                                                        <span className="text-fario-purple hover:underline ml-1 font-bold text-[10px] uppercase tracking-wide">Learn more</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Actions Row */}
                                            <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-50">
                                                {/* Quantity */}
                                                <div className="flex items-center bg-gray-50 rounded-lg p-1 text-xs font-bold border border-gray-200">
                                                    <span className="px-2 text-gray-400">Qty:</span>
                                                    <select
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.cartId, Number(e.target.value))}
                                                        className="bg-transparent text-gray-900 outline-none pr-2 cursor-pointer"
                                                    >
                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                            <option key={num} value={num}>{num}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                                                    <button
                                                        onClick={() => removeFromCart(item.cartId)}
                                                        className="hover:text-fario-purple transition-colors flex items-center gap-1"
                                                    >
                                                        Delete
                                                    </button>
                                                    <span className="w-px h-3 bg-gray-200" />
                                                    <button
                                                        onClick={() => saveForLater(item.cartId)}
                                                        className="hover:text-fario-purple transition-colors"
                                                    >
                                                        Save for later
                                                    </button>
                                                    <span className="w-px h-3 bg-gray-200" />
                                                    <button className="hover:text-fario-purple transition-colors">
                                                        See more like this
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Subtotal Bar */}
                                <div className="flex justify-end pt-2">
                                    <p className="text-lg">Subtotal ({cartItems.length} items): <span className="text-xl font-bold text-gray-900 font-heading">{formatPrice(subtotal)}</span></p>
                                </div>

                                {/* Saved Items */}
                                {savedItems.length > 0 ? (
                                    <div className="mt-12 pt-8 border-t border-gray-100">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            Your Items <span className="text-gray-400 font-normal text-base">(Saved for later)</span>
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {savedItems.map(item => (
                                                <div key={item.cartId} className="group bg-white rounded-2xl border border-gray-100 p-4 transition-all hover:border-fario-purple/30 hover:shadow-lg">
                                                    <div className="w-full h-40 bg-gray-50 rounded-xl overflow-hidden mb-4 p-4 relative">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest text-gray-500">
                                                            Saved
                                                        </div>
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 truncate text-sm mb-1">{item.name}</h4>
                                                    <p className="text-xs text-emerald-600 font-bold mb-2">In Stock</p>
                                                    <p className="text-base font-black text-gray-900 mb-3">{formatPrice(item.price)}</p>
                                                    <button
                                                        onClick={() => moveToCart(item.cartId)}
                                                        className="w-full py-2 rounded-lg bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-fario-purple transition-all"
                                                    >
                                                        Move to Bag
                                                    </button>
                                                    <div className="flex gap-2 mt-3 justify-center">
                                                        <button onClick={() => removeFromCart(item.cartId)} className="text-[10px] text-gray-400 hover:text-red-500 font-bold uppercase tracking-wide">Delete</button>
                                                        <button className="text-[10px] text-gray-400 hover:text-fario-purple font-bold uppercase tracking-wide">Compare</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-12 pt-8 border-t border-gray-100 pb-12">
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your Items <span className="text-gray-400 font-normal text-base">(Saved for later)</span></h2>
                                        <p className="text-sm text-gray-500 italic">No items saved for later.</p>
                                    </div>
                                )}

                                {/* Recommendations Section */}
                                <div className="mt-8 border-t border-gray-200 pt-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Recommended based on your shopping trends</h3>
                                        </div>
                                        <Pagination total={recommendedProducts.length} perPage={recPerPage} current={recPage} onChange={setRecPage} />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {currentRecs.map((product) => (
                                            <div key={product.id} className="group cursor-pointer">
                                                <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-3 relative border border-gray-100 group-hover:border-fario-purple/30 group-hover:shadow-lg transition-all p-4">
                                                    <img src={product.image} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" alt={product.name} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-xs font-bold text-gray-700 group-hover:text-fario-purple line-clamp-1 transition-colors">{product.name} - {product.tagline}</h4>
                                                    <div className="flex text-yellow-500 text-[10px] space-x-0.5">
                                                        {[...Array(4)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                                                        <Star size={10} />
                                                        <span className="text-xs text-gray-400 ml-1">12,430</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-sm font-black text-gray-900">{formatPrice(product.price)}</span>
                                                        <span className="text-xs text-gray-400 line-through decoration-1">{formatPrice(Math.round(product.price * 1.3))}</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500">Get it by <span className="font-bold text-gray-700">Tomorrow, Feb 1</span></p>
                                                    <p className="text-[10px] text-gray-500">FREE Delivery by Fario</p>
                                                    <button
                                                        className="mt-3 w-full py-2 text-[10px] font-black uppercase tracking-[0.2em] bg-fario-purple text-white rounded-xl hover:bg-[#684389] transition-all shadow-lg shadow-fario-purple/20 active:scale-95"
                                                        onClick={() => navigate(`/products/${product.id}`)}
                                                    >
                                                        View Product
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 space-y-4">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">

                                        {/* Coupon Section */}
                                        <div className="mb-6 border-b border-gray-100 pb-6">
                                            {!appliedCoupon ? (
                                                <div className="space-y-3">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Promotional Code</p>
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <input
                                                            type="text"
                                                            value={couponInput}
                                                            onChange={(e) => setCouponInput(e.target.value)}
                                                            placeholder="Enter Code"
                                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-fario-purple uppercase placeholder:normal-case min-w-0"
                                                        />
                                                        <button
                                                            onClick={handleApplyCoupon}
                                                            disabled={isValidating || !couponInput}
                                                            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-fario-purple transition-all disabled:opacity-50 whitespace-nowrap shadow-sm"
                                                        >
                                                            {isValidating ? '...' : 'Apply'}
                                                        </button>
                                                    </div>
                                                    {couponMessage && (
                                                        <p className={`text-[10px] font-bold px-2 py-1 rounded-lg ${couponMessage.includes('applied') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                                                            {couponMessage}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                                                <TicketPercent size={14} className="text-emerald-600" />
                                                            </div>
                                                            <div className="truncate">
                                                                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wide truncate">
                                                                    {appliedCoupon.code}
                                                                </p>
                                                                <p className="text-[9px] font-bold text-emerald-600">
                                                                    {appliedCoupon.discounttype === 'percentage'
                                                                        ? `${appliedCoupon.discountvalue}% OFF`
                                                                        : `Rs. ${appliedCoupon.discountvalue} OFF`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={handleRemoveCoupon}
                                                            className="p-1.5 hover:bg-rose-50 hover:text-rose-500 rounded-full text-emerald-600 transition-all flex-shrink-0"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                    {couponMessage && (
                                                        <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 ml-1 uppercase tracking-tight">
                                                            <CheckCircle2 size={12} /> {couponMessage}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="space-y-2 mb-4 text-sm">
                                            <div className="flex justify-between text-gray-500">
                                                <span>Subtotal</span>
                                                <span>{formatPrice(subtotal)}</span>
                                            </div>
                                            {discountAmount > 0 && (
                                                <div className="flex justify-between text-emerald-600 font-bold">
                                                    <span>Discount</span>
                                                    <span>-{formatPrice(discountAmount)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-gray-500">
                                                <span>Delivery</span>
                                                <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
                                            </div>
                                        </div>

                                        <div className="text-lg font-medium text-gray-900 mb-6 pt-4 border-t border-gray-100 leading-tight">
                                            Total: <span className="font-bold block text-3xl mt-1 text-fario-purple">{formatPrice(finalTotal)}</span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-6 text-sm text-gray-700 select-none">
                                            <input type="checkbox" id="gift-order" className="rounded accent-fario-purple w-4 h-4 cursor-pointer" />
                                            <label htmlFor="gift-order" className="cursor-pointer">This order contains a gift</label>
                                        </div>

                                        <button
                                            onClick={() => {
                                                // Pass coupon state if needed in checkout
                                                navigate(isAuth ? '/checkout' : '/login', {
                                                    state: {
                                                        discountAmount,
                                                        appliedCoupon,
                                                        finalTotal
                                                    }
                                                });
                                            }}
                                            className="w-full bg-fario-purple hover:bg-[#684389] text-white py-3 rounded-xl font-bold uppercase tracking-widest shadow-md hover:shadow-xl active:scale-95 transition-all text-sm mb-4"
                                        >
                                            Proceed to Buy
                                        </button>

                                        <div className="border rounded-lg p-3 bg-gray-50 border-gray-200">
                                            <div className="flex items-center justify-between cursor-pointer group">
                                                <span className="text-xs font-bold text-gray-900 group-hover:text-fario-purple transition-colors">EMI Available</span>
                                                <ChevronRight size={14} className="text-gray-400 group-hover:text-fario-purple" />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Your order qualifies for EMI with valid credit cards.</p>
                                        </div>
                                    </div>

                                    {/* Customers Also Bought Section (Mini Sidebar) */}
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                        <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">Customers who bought items in your Recent History also bought</h4>
                                        <div className="space-y-4">
                                            {products
                                                .filter(p => !cartItems.some(ci => ci.id === p.id))
                                                .slice(0, 3)
                                                .map(item => (
                                                    <div key={item.id} className="flex gap-3 group cursor-pointer border-b border-gray-50 pb-4 last:border-0 last:pb-0" onClick={() => navigate(`/products/${item.id}`)}>
                                                        <div className="w-16 h-16 bg-gray-50 rounded-xl p-2 border border-gray-100 flex-shrink-0 group-hover:bg-fario-purple/5 transition-colors">
                                                            <img src={item.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[11px] font-black text-gray-900 group-hover:text-fario-purple line-clamp-1 leading-tight mb-1 transition-colors uppercase italic tracking-tighter">{item.name}</p>
                                                            <div className="flex items-center text-yellow-400 gap-0.5 mb-1">
                                                                {[...Array(5)].map((_, i) => <Star key={i} fill={i < Math.round(item.rating || 4) ? "currentColor" : "none"} size={8} />)}
                                                            </div>
                                                            <p className="text-xs font-black text-fario-purple">{formatPrice(item.price)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MOBILE STICKY CHECKOUT BAR */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-5 pb-28 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:hidden z-[90] flex flex-col gap-3">
                    <div className="flex justify-between items-end px-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subtotal</span>
                        <span className="text-2xl font-black text-fario-purple tracking-tight leading-none">{formatPrice(finalTotal)}</span>
                    </div>
                    <button
                        onClick={() => navigate(isAuth ? '/checkout' : '/login', { state: { discountAmount, appliedCoupon, finalTotal } })}
                        className="w-full bg-gray-900 hover:bg-fario-purple text-white py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                    >
                        Checkout <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </>
    );
};

export default Cart;
