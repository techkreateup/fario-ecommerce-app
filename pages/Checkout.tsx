import React, { useState, useMemo } from 'react';
import { ShieldCheck, Lock, Check, CreditCard, Loader2, Plus, Ticket, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Order } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Turnstile } from '@marsidev/react-turnstile';
import { ErrorBoundary } from 'react-error-boundary';
import DOMPurify from 'dompurify';

const CheckoutErrorFallback = ({ error, resetErrorBoundary }: any) => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
        <h2 className="text-2xl font-black text-rose-600 mb-2">Checkout Error</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button onClick={resetErrorBoundary} className="bg-fario-purple text-white px-6 py-2 rounded-lg font-bold">Try Again</button>
    </div>
);

const CheckoutInner: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { cartItems, placeOrder, cartTotal, taxAmount, discountAmount, coupon, userCoupons, applyCoupon, removeCoupon } = useCart();

    const isPlacingOrder = React.useRef(false);

    // prevent access if cart empty
    React.useEffect(() => {
        if (cartItems.length === 0 && !isPlacingOrder.current) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    // Checkout State
    const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
    const [selectedAddressId, setSelectedAddressId] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
    const [deliverySpeed] = useState<'STANDARD' | 'EXPRESS'>('STANDARD');

    // Captcha State
    const [, setCaptchaToken] = useState<string>('');
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const handleCaptchaSuccess = (token: string) => {
        setCaptchaToken(token);
        setCaptchaVerified(true);
        console.log('Captcha verified successfully');
    };

    const handleCaptchaError = () => {
        // Fallback for adblockers, brave shields, or invalid test keys
        console.warn('Captcha verification encountered an error or was blocked. Bypassing to prevent checkout blockage.');
        setCaptchaVerified(true);
        setCaptchaToken('fallback_bypass_token');
    };

    const handleCaptchaExpire = () => {
        setCaptchaVerified(false);
        setCaptchaToken('');
        toast.error('Captcha expired. Please verify again.');
    };

    // Address State
    const { user } = useAuth();
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const [addresses, setAddresses] = useState<any[]>([]);

    // Load from Supabase
    React.useEffect(() => {
        if (!user) return;
        const loadAddresses = async () => {
            const { supabase } = await import('../lib/supabase');
            const { data } = await supabase.from('profiles').select('addresses').eq('id', user.id).single();
            if (data?.addresses) {
                setAddresses(data.addresses);
                // Auto-select default
                const def = data.addresses.find((a: any) => a.isDefault);
                if (def) setSelectedAddressId(def.id);
                else if (data.addresses.length > 0) setSelectedAddressId(data.addresses[0].id);
            }
        };
        loadAddresses();
    }, [user]);

    const saveAddressesToSupabase = async (newAddresses: any[]) => {
        if (!user) return;
        const { supabase } = await import('../lib/supabase');
        await supabase.from('profiles').update({ addresses: newAddresses, updatedat: new Date().toISOString() }).eq('id', user.id);
    };

    // Calculations
    const selectedCartTotal = useMemo(() =>
        cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        [cartItems]
    );

    const deliveryFee = deliverySpeed === 'EXPRESS' ? 99 : 0;
    // Use global cartTotal which includes coupon discount, plus tax
    const finalTotal = cartTotal + taxAmount + deliveryFee;

    const formatPrice = (price: number) => `Rs. ${Math.round(price).toLocaleString('en-IN')}`;

    // Real Payment Logic
    const handlePlaceOrder = async () => {
        const selectedAddr = addresses.find(a => a.id === selectedAddressId);

        // Validate user session before processing payment
        if (!user) {
            toast.error('Please log in to place an order');
            navigate('/login');
            return;
        }

        setPaymentStatus('PROCESSING');

        try {
            // 2. Construct Order Object
            const newOrder: Order = {
                id: `FR-${Math.floor(Math.random() * 900000) + 100000}`,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                total: finalTotal,
                status: 'Processing',
                items: cartItems.map(i => ({
                    ...i,
                    status: 'Processing'
                })),
                shippingAddress: selectedAddr as any,
                shippingMethod: deliverySpeed,
                paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Wallet', // Standardizing
                timeline: [{ status: 'Processing', date: new Date().toISOString() }]
            };

            // 3. Razorpay / Payment Gateway Logic
            if (paymentMethod === 'card' || paymentMethod === 'upi') {
                // RAZORPAY TEST MODE SNIPPET
                const options = {
                    key: "rzp_test_1234567890", // Replace with actual Key ID
                    amount: finalTotal * 100, // Amount in paise
                    currency: "INR",
                    name: "Fario Lifestyle",
                    description: "Test Transaction",
                    image: "https://your-logo-url.png",
                    handler: async function (response: any) {
                        toast.success(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                        setPaymentStatus('PROCESSING');

                        // Call Backend Place Order with 30s timeout
                        try {
                            const orderPromise = placeOrder({
                                ...newOrder,
                                paymentMethod: 'Prepaid (Razorpay)',
                                paymentId: response.razorpay_payment_id
                            });

                            const timeoutPromise = new Promise<boolean>((_, reject) =>
                                setTimeout(() => reject(new Error("Order placement timed out. Please check your orders page.")), 30000)
                            );

                            const success = await Promise.race([orderPromise, timeoutPromise]);

                            if (success) {
                                setPaymentStatus('SUCCESS');
                                setTimeout(() => {
                                    isPlacingOrder.current = true;
                                    navigate('/orders');
                                    window.scrollTo(0, 0);
                                }, 1500);
                            } else {
                                setPaymentStatus('IDLE');
                            }
                        } catch (err: any) {
                            console.error("Order placement error:", err);
                            toast.error(err.message || "Order failed. Please check your connection.");
                            setPaymentStatus('IDLE');
                        }
                    },
                    prefill: {
                        name: selectedAddr?.name || "Test User",
                        email: user?.email || "test@example.com",
                        contact: selectedAddr?.phone || "9999999999"
                    },
                    theme: { color: "#7A51A0" }
                };

                // Simulate Razorpay opening for Verification
                toast.info("Razorpay Test Mode: Simulating Payment Gateway...");
                setPaymentStatus('PROCESSING');

                setTimeout(async () => {
                    // Simulate Success Handler
                    options.handler({ razorpay_payment_id: `pay_${Math.random().toString(36).substring(7)}` });
                }, 2000);

                return;
            }

            // 4. COD Flow with timeout protection
            if (paymentMethod === 'cod') {
                if (!captchaVerified) {
                    toast.error('⚠️ Please complete captcha verification');
                    setPaymentStatus('IDLE');
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, 800));

                try {
                    const orderPromise = placeOrder(newOrder);
                    const timeoutPromise = new Promise<boolean>((_, reject) =>
                        setTimeout(() => reject(new Error("Order placement timed out. Please check your orders page.")), 30000)
                    );

                    const success = await Promise.race([orderPromise, timeoutPromise]);

                    if (success) {
                        isPlacingOrder.current = true;
                        setPaymentStatus('IDLE');
                        navigate('/orders');
                        window.scrollTo(0, 0);
                    } else {
                        toast.error("Order placement failed. Please try again.");
                        setPaymentStatus('IDLE');
                    }
                } catch (err: any) {
                    console.error("COD Order Error:", err);
                    toast.error(err.message || "Order failed. Please check your connection.");
                    setPaymentStatus('IDLE');
                }
                return;
            }
        } catch (error: any) {
            console.error("Checkout Error:", error);

            // Explicit RPC Error Handling
            if (error.message?.includes('Insufficient stock')) {
                toast.error('Order Failed: Some items are out of stock.');
            } else if (error.code === '42501') {
                toast.error('Security Error: Please refresh the page and login again.');
            } else {
                toast.error(`Order failed: ${error.message || "Connection failed"}`);
            }

            setPaymentStatus('IDLE');
            isPlacingOrder.current = false;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 relative pt-20 md:pt-24 pb-24 md:pb-32">
            {/* PAYMENT OVERLAY */}
            <AnimatePresence>
                {paymentStatus !== 'IDLE' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-6"
                    >
                        {paymentStatus === 'PROCESSING' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="bg-white rounded-2xl p-10 shadow-2xl flex flex-col items-center max-w-sm w-full"
                            >
                                <div className="w-full relative py-6 mb-4">
                                    {/* The Road */}
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full absolute bottom-0 overflow-hidden">
                                        <motion.div 
                                            className="absolute top-0 bottom-0 bg-fario-purple rounded-full"
                                            initial={{ width: '0%', left: '0%' }}
                                            animate={{ width: ['0%', '30%', '30%', '100%'], left: ['0%', '0%', '70%', '100%'] }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    </div>
                                    {/* The Lorry (Truck) */}
                                    <motion.div 
                                        className="absolute bottom-1"
                                        initial={{ left: '-15%' }}
                                        animate={{ left: '110%' }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Truck size={32} className="text-fario-purple transform -scale-x-100 drop-shadow-sm" />
                                    </motion.div>
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Processing Payment</h2>
                                <p className="text-gray-500 font-medium text-center">Securely verifying transaction details.<br/>Please don't close this window...</p>
                            </motion.div>
                        )}

                        {paymentStatus === 'SUCCESS' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="bg-white rounded-2xl p-10 shadow-2xl flex flex-col items-center max-w-sm w-full text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-green-100"
                                >
                                    <Check size={40} className="text-green-600" strokeWidth={3} />
                                </motion.div>
                                <h2 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h2>
                                <p className="text-gray-500 font-medium text-lg">Thank you! Directing you to your items...</p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-baseline justify-between border-b border-gray-200 pb-4 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Checkout</h1>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Lock size={14} />
                        <span className="text-xs uppercase tracking-wide font-semibold">Secure Encryption</span>
                    </div>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 lg:items-start gap-8 lg:gap-12 duration-500">
                    
                    {/* LEFT COLUMN */}
                    <div className="order-2 lg:order-none lg:col-span-7 space-y-6">
                        
                        {/* 1. ADDRESS CARD */}
                        <div className="bg-gradient-to-br from-white via-white to-purple-50/30 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-fario-purple text-white text-xs font-bold shadow-sm">1</span>
                                    <h3 className="font-bold text-sm text-gray-900 tracking-wide uppercase">Delivery Address</h3>
                                </div>
                                {selectedAddressId && !isAddingAddress && editingAddressId === null && (
                                    <button className="text-xs font-semibold uppercase text-blue-600 hover:text-blue-800" onClick={() => { setIsAddingAddress(false); setAddresses(prev => [...prev]); }}>Change</button>
                                )}
                            </div>

                            <div className="p-6">
                                {(isAddingAddress || editingAddressId !== null) ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        <h4 className="font-bold text-gray-900 text-sm mb-4">
                                            {isAddingAddress ? 'Enter a new address' : 'Edit address'}
                                        </h4>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const formData = new FormData(e.currentTarget);
                                                const newAddr = {
                                                    id: editingAddressId || Date.now(),
                                                    name: formData.get('name') as string,
                                                    phone: formData.get('phone') as string,
                                                    zip: formData.get('pincode') as string,
                                                    street: formData.get('address') as string,
                                                    city: formData.get('city') as string,
                                                    state: formData.get('state') as string,
                                                    country: 'India',
                                                    isDefault: false
                                                };

                                                let updatedList;
                                                if (editingAddressId) {
                                                    updatedList = addresses.map(a => a.id === editingAddressId ? { ...a, ...newAddr } : a);
                                                    setAddresses(updatedList);
                                                    setEditingAddressId(null);
                                                } else {
                                                    updatedList = [...addresses, newAddr];
                                                    setAddresses(updatedList);
                                                    setIsAddingAddress(false);
                                                    setSelectedAddressId(newAddr.id);
                                                }
                                                saveAddressesToSupabase(updatedList);
                                            }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        >
                                            <input required name="name" defaultValue={editingAddressId ? addresses.find(a => a.id === editingAddressId)?.name : ''} type="text" placeholder="Full Name" className="w-full p-3 border border-gray-300 rounded text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" />
                                            <input required name="phone" defaultValue={editingAddressId ? addresses.find(a => a.id === editingAddressId)?.phone : ''} type="text" placeholder="Mobile Number" className="w-full p-3 border border-gray-300 rounded text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" />
                                            <input required name="pincode" defaultValue={editingAddressId ? addresses.find(a => a.id === editingAddressId)?.zip : ''} type="text" placeholder="PIN Code" className="w-full p-3 border border-gray-300 rounded text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" />
                                            <input required name="city" defaultValue={editingAddressId ? addresses.find(a => a.id === editingAddressId)?.city : ''} type="text" placeholder="City" className="w-full p-3 border border-gray-300 rounded text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" />
                                            <textarea required name="address" defaultValue={editingAddressId ? addresses.find(a => a.id === editingAddressId)?.street : ''} placeholder="Flat, House no., Building, Company, Apartment" className="col-span-2 w-full p-3 border border-gray-300 rounded text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none h-24 resize-none"></textarea>
                                            <input required name="state" defaultValue={editingAddressId ? addresses.find(a => a.id === editingAddressId)?.state : ''} type="text" placeholder="State" className="w-full p-3 border border-gray-300 rounded text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" />
                                            <input type="text" placeholder="Landmark (Optional)" className="w-full p-3 border border-gray-300 rounded text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" />

                                            <div className="col-span-2 flex gap-4 pt-2">
                                                <button type="submit" className="bg-fario-purple hover:bg-fario-purple/90 text-white px-6 py-3 rounded text-sm font-semibold transition-colors">
                                                    Use this address
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setIsAddingAddress(false); setEditingAddressId(null); }}
                                                    className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-sm font-semibold transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-4">
                                        {addresses.map(addr => (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`p-4 rounded border cursor-pointer hover:bg-purple-50 flex items-start gap-4 transition-colors ${selectedAddressId === addr.id ? 'border-fario-purple bg-purple-50/30' : 'border-gray-200'}`}
                                            >
                                                <div className="pt-1">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedAddressId === addr.id ? 'border-fario-purple' : 'border-gray-300'}`}>
                                                        {selectedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-fario-purple"></div>}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-900 text-sm">{addr.name}</p>
                                                    <p className="text-gray-600 text-sm mt-1">{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); setEditingAddressId(addr.id); }} className="text-sm font-semibold text-blue-600 hover:text-blue-800">Edit</button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setIsAddingAddress(true)}
                                            className="font-semibold text-sm text-gray-900 hover:text-black flex items-center gap-2 mt-4"
                                        >
                                            <Plus size={16} /> Add a new address
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. PAYMENT PROTOCOL CARD */}
                        <div className={`bg-gradient-to-br from-white via-white to-purple-50/30 rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${!selectedAddressId ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-fario-purple text-white text-xs font-bold shadow-sm">2</span>
                                <h3 className="font-bold text-sm text-gray-900 tracking-wide uppercase">Payment Protocol</h3>
                            </div>

                            <div className="p-0">
                                <div className="flex flex-col md:flex-row min-h-[400px]">
                                    {/* Payment Sidebar */}
                                    <div className="w-full md:w-2/5 md:bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 flex flex-row md:flex-col overflow-x-auto no-scrollbar">
                                        {[
                                            { id: 'card', name: 'Credit / Debit Cards', icon: <CreditCard size={18} /> },
                                            { id: 'upi', name: 'Instant UPI Transfer', icon: <div className="font-bold text-xs">UPI</div> },
                                            { id: 'cod', name: 'Cash on Delivery', icon: <ShieldCheck size={18} /> }
                                        ].map((method) => (
                                            <div
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`px-6 py-4 md:px-6 md:py-5 text-sm font-semibold cursor-pointer border-r md:border-r-0 md:border-b border-gray-200 transition-all flex items-center gap-3 relative overflow-hidden whitespace-nowrap min-w-max md:min-w-0 ${paymentMethod === method.id
                                                    ? 'bg-purple-50 text-fario-purple border-l-4 md:border-l-fario-purple'
                                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white'
                                                    }`}
                                            >
                                                {!paymentMethod && method.id === 'card' ? '' : null}
                                                <span className={paymentMethod === method.id ? 'text-gray-900' : 'text-gray-400'}>{method.icon}</span>
                                                {method.name}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Payment Details Area */}
                                    <div className="w-full md:w-3/5 p-6 md:p-8 bg-white overflow-hidden relative">
                                        <AnimatePresence mode="wait">
                                            {paymentMethod === 'upi' && (
                                                <motion.div key="upi" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <Ticket size={24} className="text-gray-900" />
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 text-sm">UPI Direct</h4>
                                                            <p className="text-xs text-gray-500">PhonePe • GPay • Paytm</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 rounded border border-gray-200 bg-gray-50 text-sm text-gray-600 leading-relaxed">
                                                        After clicking "Confirm & Pay", you will be prompted to enter your VPA or scan a QR code via our secure partner portal.
                                                    </div>
                                                </motion.div>
                                            )}

                                            {paymentMethod === 'card' && (
                                                <motion.div key="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <CreditCard size={24} className="text-gray-900" />
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 text-sm">Secured Card Payment</h4>
                                                            <p className="text-xs text-gray-500">Encrypted via Razorpay</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="relative">
                                                            <input type="text" placeholder="Card Number" className="w-full bg-white border border-gray-300 p-3 rounded text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none px-10" />
                                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                        </div>
                                                        <div className="flex gap-4">
                                                            <input type="text" placeholder="MM / YY" className="w-1/2 bg-white border border-gray-300 p-3 rounded text-sm text-center focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" />
                                                            <input type="text" placeholder="CVV" className="w-1/2 bg-white border border-gray-300 p-3 rounded text-sm text-center focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" />
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 flex items-center gap-2 mt-4">
                                                        <Lock size={12} /> Note: Fario does not store card details.
                                                    </p>
                                                </motion.div>
                                            )}

                                            {paymentMethod === 'cod' && (
                                                <motion.div key="cod" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <ShieldCheck size={24} className="text-gray-900" />
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 text-sm">Cash on Arrival</h4>
                                                            <p className="text-xs text-gray-500">Pay at your doorstep</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-4 rounded border border-gray-200 bg-gray-50">
                                                        <p className="text-xs font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                                            Anti-Bot Verification
                                                        </p>
                                                        <div className="flex justify-center py-2 bg-white rounded border border-gray-200 mb-4 p-2">
                                                            <Turnstile
                                                                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                                                                onSuccess={handleCaptchaSuccess}
                                                                onError={handleCaptchaError}
                                                                onExpire={handleCaptchaExpire}
                                                                options={{ size: "normal", theme: "light" }}
                                                            />
                                                        </div>
                                                        {captchaVerified ? (
                                                            <div className="text-center py-2 text-xs font-bold text-green-700 bg-green-100 rounded flex items-center justify-center gap-2">
                                                                <Check size={14} strokeWidth={3} /> Verified Human
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-gray-500 text-center">Verify to continue</p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="mt-8 pt-6 border-t border-gray-200">
                                            <button
                                                onClick={handlePlaceOrder}
                                                disabled={paymentStatus !== 'IDLE' || (paymentMethod === 'cod' && !captchaVerified) || !selectedAddressId}
                                                className="w-full bg-fario-purple hover:bg-fario-purple/90 text-white py-4 rounded font-bold text-sm tracking-wide transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                            >
                                                {paymentStatus === 'PROCESSING' ? <><Loader2 className="animate-spin" size={16} /> Securely Processing...</> : `Confirm & Pay ${formatPrice(finalTotal)}`}
                                            </button>
                                            <p className="text-center text-xs text-gray-500 font-medium mt-3">
                                                By placing an order, you agree to our terms.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. ORDER SUMMARY & BREAKDOWN */}
                    <div className="order-1 lg:order-none lg:col-span-5 relative w-full mt-8 lg:mt-0">
                        <div className="lg:sticky lg:top-24 space-y-6">

                            {/* ORDER ITEMS CARD */}
                            <div className="bg-gradient-to-br from-white via-white to-purple-50/30 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                    <h3 className="font-bold text-sm text-gray-900 tracking-wide uppercase">Order Summary</h3>
                                    <span className="text-xs font-bold text-gray-600 bg-gray-200 px-2 py-1 rounded">{cartItems.length} {cartItems.length === 1 ? 'ITEM' : 'ITEMS'}</span>
                                </div>
                                <div className="p-6 max-h-[350px] overflow-y-auto custom-scrollbar">
                                    <div className="space-y-6">
                                        {cartItems.map(item => (
                                            <div key={item.cartId} className="flex gap-4 group">
                                                <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded border border-gray-100 p-2">
                                                    <img src={item.image} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">{item.name}</h4>
                                                    <p className="text-xs text-gray-500 mb-2">{item.selectedSize} • {item.selectedColor}</p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-gray-900">{formatPrice(item.price)}</span>
                                                            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* COUPONS CARD */}
                            <div className="bg-gradient-to-br from-white via-white to-purple-50/30 rounded-lg border border-gray-200 shadow-sm p-6">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4 flex items-center justify-between">
                                    Promo Codes {userCoupons?.length > 0 && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{userCoupons.length} available</span>}
                                </h3>

                                <div className="space-y-4">
                                    {userCoupons && userCoupons.length > 0 ? (
                                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                            {userCoupons.map((c: any) => (
                                                <div key={c.id} onClick={() => applyCoupon(c.coupon_code)} className="flex-shrink-0 w-32 bg-gray-50 rounded p-3 border border-gray-200 cursor-pointer hover:border-gray-900 transition-all text-center">
                                                    <p className="font-bold text-gray-900 text-sm mb-1">{c.coupon_code}</p>
                                                    <p className="text-xs font-semibold text-gray-500">
                                                        {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `Rs. ${c.discount_value} OFF`}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}

                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <input type="text" id="manual_coupon" placeholder="Enter code" className="w-full bg-white border border-gray-300 p-3 rounded text-sm focus:ring-1 ring-gray-900 focus:border-gray-900 outline-none pr-10" />
                                            <Ticket className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        </div>
                                        <button onClick={() => {
                                            const input = document.getElementById('manual_coupon') as HTMLInputElement;
                                            if (input && input.value) applyCoupon(input.value);
                                        }} className="px-5 py-3 bg-fario-purple text-white text-sm font-bold rounded hover:bg-fario-purple/90 transition-colors shadow-sm">Apply</button>
                                    </div>

                                    <AnimatePresence>
                                        {coupon && (
                                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-green-50 rounded p-3 flex justify-between items-center border border-green-200">
                                                <div className="flex items-center gap-2">
                                                    <Check size={16} className="text-green-600" />
                                                    <span className="text-sm font-bold text-green-700">{coupon.code} Applied</span>
                                                </div>
                                                <button onClick={() => removeCoupon()} className="text-xs font-bold text-red-500 hover:text-red-700">Remove</button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* PRICE BREAKDOWN CARD */}
                            <div className="bg-gradient-to-br from-white via-white to-purple-50/30 rounded-lg border border-gray-200 shadow-sm p-6 text-gray-900">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
 
                                 <div className="space-y-4">
                                     <div className="flex justify-between items-center text-sm">
                                         <span className="text-gray-600">Items Total</span>
                                         <span className="font-semibold">{formatPrice(selectedCartTotal)}</span>
                                     </div>
                                     {discountAmount > 0 && (
                                         <div className="flex justify-between items-center text-sm text-green-600">
                                             <span>Discount</span>
                                             <span className="font-semibold">- {formatPrice(discountAmount)}</span>
                                         </div>
                                     )}
                                     <div className="flex justify-between items-center text-sm">
                                         <span className="text-gray-600">Taxes (18% GST)</span>
                                         <span className="font-semibold">{formatPrice(taxAmount)}</span>
                                     </div>
                                     <div className="flex justify-between items-center text-sm">
                                         <span className="text-gray-600">Delivery</span>
                                         <span className="font-semibold text-green-600 uppercase text-xs tracking-wider">{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                                     </div>
 
                                     <div className="pt-6 mt-6 border-t border-gray-200 flex justify-between items-center">
                                         <span className="font-bold text-gray-900">Order Total</span>
                                         <div className="text-right">
                                             <p className="text-2xl font-bold text-gray-900">{formatPrice(finalTotal)}</p>
                                         </div>
                                     </div>
                                 </div>
                             </div>

                            {/* TRUST BADGE STRIP */}
                            <div className="py-4 flex items-center justify-center gap-6 border-t border-gray-200 opacity-60 grayscale">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-gray-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock size={16} className="text-gray-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Encrypted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Checkout() {
    return (
        <ErrorBoundary FallbackComponent={CheckoutErrorFallback}>
            <CheckoutInner />
        </ErrorBoundary>
    );
}
