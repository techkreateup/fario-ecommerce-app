import React, { useState, useMemo } from 'react';
import { ShieldCheck, Lock, Check, CreditCard, Loader2, Plus, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Order } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Turnstile } from '@marsidev/react-turnstile';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { cartItems, placeOrder, cartTotal, discountAmount, coupon, userCoupons, applyCoupon, removeCoupon } = useCart();

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
        setCaptchaVerified(false);
        setCaptchaToken('');
        toast.error('Captcha verification failed. Please try again.');
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
    // Use global cartTotal which includes coupon discount
    const finalTotal = cartTotal + deliveryFee;

    const formatPrice = (price: number) => `Rs. ${price.toLocaleString('en-IN')}`;

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
        <div className="min-h-screen bg-white font-sans text-gray-800 relative isolate pt-24 pb-32 overflow-hidden">

            {/* AMBIENT BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-fario-purple/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full" />
            </div>

            {/* PAYMENT OVERLAY */}
            <AnimatePresence>
                {paymentStatus !== 'IDLE' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center p-6"
                    >
                        {paymentStatus === 'PROCESSING' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center"
                            >
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 rounded-full border-4 border-gray-100 animate-pulse"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-fario-purple border-t-transparent animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Lock size={32} className="text-fario-purple/50" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Securely Processing</h2>
                                <p className="text-gray-500 font-medium">Contacting your bank...</p>
                            </motion.div>
                        )}

                        {paymentStatus === 'SUCCESS' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="flex flex-col items-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/30"
                                >
                                    <Check size={56} className="text-white drop-shadow-md" strokeWidth={3} />
                                </motion.div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Payment Successful!</h2>
                                <p className="text-gray-500 font-medium text-lg">Redirecting to order confirmation...</p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-baseline gap-4 border-b border-gray-100 pb-4">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Checkout</h1>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
                    {/* LEFT COLUMN: STEPS */}
                    <div className="lg:col-span-8 space-y-4">

                        {/* STEP 1: ADDRESS */}
                        <div className={`bg-white border rounded-sm overflow-hidden transition-all duration-300 ${checkoutStep === 1 ? 'border-gray-200 shadow-md' : 'border-gray-100'}`}>
                            <div className={`px-6 py-4 flex justify-between items-center ${checkoutStep === 1 ? 'bg-fario-purple text-white' : 'bg-white'}`}>
                                <div className="flex items-center gap-4">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-sm text-xs font-bold ${checkoutStep === 1 ? 'bg-white text-fario-purple' : 'bg-gray-100 text-fario-purple'}`}>1</span>
                                    <h3 className={`font-bold uppercase tracking-wide text-sm ${checkoutStep === 1 ? 'text-white' : 'text-gray-500'}`}>Delivery Address</h3>
                                </div>
                                {checkoutStep > 1 && (
                                    <div className="text-xs flex items-center gap-4">
                                        <span className="font-semibold text-gray-800">{addresses.find(a => a.id === selectedAddressId)?.name}, {addresses.find(a => a.id === selectedAddressId)?.zip}</span>
                                        <button onClick={() => setCheckoutStep(1)} className="text-fario-purple hover:underline font-bold uppercase border border-gray-200 px-4 py-1.5 rounded-sm hover:shadow-sm">Change</button>
                                    </div>
                                )}
                            </div>

                            {checkoutStep === 1 && (
                                <div className="p-6">
                                    {/* ADD/EDIT FORM */}
                                    {(isAddingAddress || editingAddressId !== null) ? (
                                        <div className="bg-gray-50 p-6 rounded-sm border border-gray-200">
                                            <h4 className="text-fario-purple font-bold uppercase tracking-wide text-sm mb-4">
                                                {isAddingAddress ? 'Add a new address' : 'Edit Address'}
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
                                                <div className="col-span-1">
                                                    <input required name="name" defaultValue={editingAddressId ? addresses.find(a => a.id === editingAddressId)?.name : ''} type="text" placeholder="Name" className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:border-fario-purple outline-none" />
                                                </div>
                                                <div className="col-span-1">
                                                    <input required name="phone" defaultValue={editingAddressId ? addresses.find(a => a.id === editingAddressId)?.phone : ''} type="text" placeholder="10-digit mobile number" className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:border-fario-purple outline-none" />
                                                </div>
                                                <div className="col-span-1">
                                                    <input required name="pincode" defaultValue={editingAddressId ? addresses.find(a => a.id === editingAddressId)?.zip : ''} type="text" placeholder="Pincode" className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:border-fario-purple outline-none" />
                                                </div>
                                                <div className="col-span-1">
                                                    <input required name="city" defaultValue={editingAddressId ? addresses.find(a => a.id === editingAddressId)?.city : ''} type="text" placeholder="City" className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:border-fario-purple outline-none" />
                                                </div>
                                                <div className="col-span-2">
                                                    <textarea required name="address" defaultValue={editingAddressId ? addresses.find(a => a.id === editingAddressId)?.street : ''} placeholder="Address (Area and Street)" className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:border-fario-purple outline-none h-24 resize-none"></textarea>
                                                </div>
                                                <div className="col-span-1">
                                                    <input required name="state" defaultValue={editingAddressId ? addresses.find(a => a.id === editingAddressId)?.state : ''} type="text" placeholder="State" className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:border-fario-purple outline-none" />
                                                </div>
                                                <div className="col-span-1">
                                                    <input type="text" placeholder="Landmark (Optional)" className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:border-fario-purple outline-none" />
                                                </div>

                                                <div className="col-span-2 flex gap-4 mt-2">
                                                    <button type="submit" className="bg-fario-purple hover:bg-[#684389] text-white px-8 py-3 rounded-sm text-sm font-bold uppercase tracking-widest shadow-md transition-all">
                                                        Save and Deliver Here
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setIsAddingAddress(false); setEditingAddressId(null); }}
                                                        className="text-fario-purple font-bold uppercase tracking-wide text-xs hover:underline px-4"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-4 mb-6">
                                                {addresses.map(addr => (
                                                    <div
                                                        key={addr.id}
                                                        onClick={() => setSelectedAddressId(addr.id)}
                                                        className={`border-l-4 p-4 cursor-pointer relative transition-all duration-200 ${selectedAddressId === addr.id ? 'border-l-fario-purple bg-fario-purple/5' : 'border-l-transparent hover:bg-gray-50'}`}
                                                    >
                                                        <div className="flex gap-4">
                                                            <div className="mt-1">
                                                                <input
                                                                    type="radio"
                                                                    checked={selectedAddressId === addr.id}
                                                                    readOnly
                                                                    className="accent-fario-purple w-4 h-4 cursor-pointer"
                                                                />
                                                            </div>
                                                            <div className="text-sm w-full">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <p className="font-bold text-gray-900">{addr.name}</p>
                                                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{addr.isDefault ? 'Home' : 'Work'}</span>
                                                                        <span className="font-bold text-gray-900 ml-2">{addr.phone}</span>
                                                                    </div>
                                                                    {selectedAddressId === addr.id && (
                                                                        <button onClick={(e) => { e.stopPropagation(); setEditingAddressId(addr.id); }} className="text-fario-purple font-bold text-xs uppercase tracking-wide hover:underline px-2">Edit</button>
                                                                    )}
                                                                </div>

                                                                <p className="text-gray-600 leading-snug text-sm w-3/4 mb-1">
                                                                    {addr.street}, {addr.city}, {addr.state} - <span className="font-bold">{addr.zip}</span>
                                                                </p>
                                                                {selectedAddressId === addr.id && (
                                                                    <button className="bg-fario-purple text-white text-sm font-bold uppercase px-8 py-3 rounded-sm shadow-md hover:bg-[#684389] hover:shadow-lg transition-all mt-4" onClick={() => setCheckoutStep(2)}>
                                                                        Deliver Here
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div
                                                onClick={() => setIsAddingAddress(true)}
                                                className="bg-gray-50 p-4 rounded-sm border border-gray-100 flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-100 transition-colors text-fario-purple font-bold"
                                            >
                                                <Plus size={16} />
                                                <span>Add a new address</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* STEP 2: ORDER SUMMARY */}
                        <div className={`bg-white border rounded-sm overflow-hidden transition-all duration-300 ${checkoutStep === 2 ? 'border-gray-200 shadow-md' : 'border-gray-100'}`}>
                            <div className={`px-6 py-4 flex justify-between items-center ${checkoutStep === 2 ? 'bg-fario-purple text-white' : 'bg-white'}`}>
                                <div className="flex items-center gap-4">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-sm text-xs font-bold ${checkoutStep === 2 ? 'bg-white text-fario-purple' : 'bg-gray-100 text-fario-purple'}`}>2</span>
                                    <h3 className={`font-bold uppercase tracking-wide text-sm ${checkoutStep === 2 ? 'text-white' : 'text-gray-500'}`}>Order Summary</h3>
                                </div>
                                {checkoutStep > 2 && (
                                    <div className="text-xs flex items-center gap-4">
                                        <span className="font-semibold text-gray-800">{cartItems.length} Items</span>
                                        <button onClick={() => setCheckoutStep(2)} className="text-fario-purple hover:underline font-bold uppercase border border-gray-200 px-4 py-1.5 rounded-sm hover:shadow-sm">Change</button>
                                    </div>
                                )}
                            </div>

                            {checkoutStep === 2 && (
                                <div className="p-6">
                                    <div className="space-y-6 mb-8">
                                        {cartItems.map(item => (
                                            <div key={item.cartId} className="flex gap-6 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                                <div className="w-24 h-24 flex-shrink-0 relative bg-gray-50 rounded-lg p-2">
                                                    <img src={item.image} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                                                    <div className="absolute top-0 left-0 bg-gray-100 text-[10px] px-1 rounded text-gray-500 border border-gray-200">Qty: {item.quantity}</div>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 text-sm mb-1">{item.name}</h4>
                                                    <div className="text-xs text-gray-500 mb-2">{item.selectedSize}, {item.selectedColor}</div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-sm font-gray-500 line-through">Rs. {Math.round(item.price * 1.2).toLocaleString('en-IN')}</span>
                                                        <span className="font-bold text-lg text-gray-900">{formatPrice(item.price)}</span>
                                                        <span className="text-xs font-bold text-green-600">20% Off</span>
                                                    </div>
                                                    <div className="text-[10px] text-gray-500">
                                                        Seller: <span className="font-bold text-gray-700">Fario Retail</span>
                                                        <img src="/fario-logo-white.png" className="w-12 h-3 object-contain inline-block ml-2 opacity-0" alt="Fario Assured" onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.parentElement!.insertAdjacentHTML('beforeend', '<span class="bg-gray-100 text-gray-400 text-[9px] px-1 rounded ml-1 border border-gray-200">ASSURED</span>');
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="text-[12px] font-bold text-gray-900">
                                                    Delivery by <span className="text-green-600">Tomorrow, Sun</span> <span className="text-gray-400 mx-1">|</span> <span className="text-green-600">Free</span> <span className="line-through text-gray-400">Rs. 40</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="text-sm text-gray-900 font-medium">
                                            Order confirmation email will be sent to <span className="font-bold text-fario-purple">{user?.email || 'your email'}</span>
                                        </div>
                                        <button
                                            onClick={() => setCheckoutStep(3)}
                                            className="bg-fario-orange bg-[#fb641b] hover:bg-[#f4511e] text-white px-10 py-3.5 rounded-sm text-sm font-bold uppercase tracking-widest shadow-md transition-all"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* STEP 3: PAYMENT METHOD */}
                        <div className={`bg-white border rounded-sm overflow-hidden transition-all duration-300 ${checkoutStep === 3 ? 'border-gray-200 shadow-md' : 'border-gray-100'}`}>
                            <div className={`px-6 py-4 flex justify-between items-center ${checkoutStep === 3 ? 'bg-fario-purple text-white' : 'bg-white'}`}>
                                <div className="flex items-center gap-4">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-sm text-xs font-bold ${checkoutStep === 3 ? 'bg-white text-fario-purple' : 'bg-gray-100 text-fario-purple'}`}>3</span>
                                    <h3 className={`font-bold uppercase tracking-wide text-sm ${checkoutStep === 3 ? 'text-white' : 'text-gray-500'}`}>Payment Options</h3>
                                </div>
                            </div>

                            {checkoutStep === 3 && (
                                <div className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Payment Sidebar */}
                                        <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-100">
                                            {['UPI', 'Wallets', 'Credit / Debit / ATM Card', 'Net Banking', 'Cash on Delivery'].map((method) => (
                                                <div
                                                    key={method}
                                                    onClick={() => {
                                                        if (method.includes('Card')) setPaymentMethod('card');
                                                        else if (method.includes('UPI')) setPaymentMethod('upi');
                                                        else if (method.includes('Cash')) setPaymentMethod('cod');
                                                    }}
                                                    className={`px-4 py-4 text-sm font-medium cursor-pointer border-l-4 border-b border-gray-100 hover:bg-white transition-colors ${(method.includes('Card') && paymentMethod === 'card') ||
                                                        (method.includes('UPI') && paymentMethod === 'upi') ||
                                                        (method.includes('Cash') && paymentMethod === 'cod')
                                                        ? 'bg-white text-fario-purple border-l-fario-purple font-bold'
                                                        : 'text-gray-600 border-l-transparent'
                                                        }`}
                                                >
                                                    {method}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Payment Details */}
                                        <div className="w-full md:w-2/3 p-6 bg-white">
                                            {paymentMethod === 'upi' && (
                                                <div className="space-y-4">
                                                    <h4 className="font-bold text-gray-800 text-sm">Choose an option</h4>
                                                    <div className="flex items-center gap-3 border p-3 rounded-sm cursor-pointer hover:bg-gray-50">
                                                        <input type="radio" checked readOnly className="accent-fario-purple" />
                                                        <span className="text-sm font-medium">PhonePe / Google Pay / Paytm</span>
                                                    </div>
                                                    <div className="bg-fario-purple/5 p-3 rounded-sm text-xs text-gray-600 border border-fario-purple/10">
                                                        Wait for the prompt on your UPI app to complete payment.
                                                    </div>
                                                </div>
                                            )}

                                            {paymentMethod === 'card' && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-bold text-gray-800 text-sm">Enter Card Details</h4>
                                                        <div className="flex gap-1 opacity-70">
                                                            <CreditCard size={16} />
                                                        </div>
                                                    </div>
                                                    <input type="text" placeholder="Card Number" className="w-full border border-gray-300 p-3 rounded-sm text-sm outline-none focus:border-fario-purple" />
                                                    <div className="flex gap-3">
                                                        <input type="text" placeholder="Valid Thru (MM/YY)" className="w-1/2 border border-gray-300 p-3 rounded-sm text-sm outline-none focus:border-fario-purple" />
                                                        <input type="text" placeholder="CVV" className="w-1/2 border border-gray-300 p-3 rounded-sm text-sm outline-none focus:border-fario-purple" />
                                                    </div>
                                                </div>
                                            )}

                                            {paymentMethod === 'cod' && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-full text-sm text-gray-600 leading-relaxed">
                                                            <span className="font-bold text-gray-900 block mb-1">Cash on Delivery</span>
                                                            Pay cash at the time of delivery. You can also pay online at the time of delivery.
                                                        </div>
                                                    </div>
                                                    <div className="captcha-section" style={{
                                                        marginTop: '1.5rem',
                                                        padding: '1.5rem',
                                                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                                        borderRadius: '12px',
                                                        border: '2px solid #e1e8ed'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            marginBottom: '1rem'
                                                        }}>
                                                            <ShieldCheck size={20} className="text-gray-700" strokeWidth={2} />
                                                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                                                                Security Verification
                                                            </h3>
                                                        </div>
                                                        <p style={{
                                                            fontSize: '0.875rem',
                                                            color: '#64748b',
                                                            marginBottom: '1rem'
                                                        }}>
                                                            Please verify you're human to place COD order
                                                        </p>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            padding: '1rem',
                                                            background: 'white',
                                                            borderRadius: '8px'
                                                        }}>
                                                            <Turnstile
                                                                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                                                                onSuccess={handleCaptchaSuccess}
                                                                onError={handleCaptchaError}
                                                                onExpire={handleCaptchaExpire}
                                                                options={{ size: "normal", theme: "light" }}
                                                            />
                                                        </div>
                                                        {captchaVerified && (
                                                            <div style={{
                                                                marginTop: '1rem',
                                                                padding: '0.75rem',
                                                                background: '#d1fae5',
                                                                color: '#065f46',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                fontSize: '0.875rem'
                                                            }}>
                                                                <Check size={16} strokeWidth={2} />
                                                                Verification successful! You can proceed with your order.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={handlePlaceOrder}
                                                disabled={paymentStatus !== 'IDLE' || (paymentMethod === 'cod' && !captchaVerified)}
                                                className="w-full bg-[#fb641b] hover:bg-[#f4511e] text-white py-4 rounded-sm text-sm font-bold uppercase tracking-widest shadow-md transition-all mt-6 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {paymentStatus === 'PROCESSING' ? <><Loader2 className="animate-spin" size={16} /> Processing...</> : `PAY ${formatPrice(finalTotal)}`}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PRICE DETAILS & PREMIUM MEDIA */}
                    <div className="lg:col-span-4 pl-0 lg:pl-4 mt-6 lg:mt-0 space-y-6">
                        {/* Cinematic Media Card */}
                        <div className="bg-gray-900 rounded-3xl overflow-hidden aspect-[4/5] relative shadow-2xl hidden lg:block">
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                            >
                                <source src="https://videos.pexels.com/video-files/3209242/3209242-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-0.5 w-6 bg-fario-purple" />
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Premium Quality</span>
                                </div>
                                <h3 className="text-2xl font-black text-white font-heading uppercase italic tracking-tighter leading-none mb-2">Crafted for Excellence</h3>
                                <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest leading-relaxed">Every Fario product undergoes 14 stages of rigorous testing to ensure it meets our elite standards.</p>
                            </div>
                        </div>

                        {/* AVAILABLE COUPONS */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-6">
                            <div className="p-4 border-b border-gray-100 bg-fario-purple/5">
                                <h3 className="text-gray-900 font-bold uppercase tracking-wider text-sm flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Ticket size={16} className="text-fario-purple" /> My Rewards & Coupons</span>
                                    {userCoupons?.length > 0 && <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full">{userCoupons.length} Available</span>}
                                </h3>
                            </div>
                            <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
                                {userCoupons && userCoupons.length > 0 ? (
                                    userCoupons.map((c: any) => (
                                        <div key={c.id} className="border border-dashed border-emerald-300 bg-emerald-50 rounded-lg p-3 relative overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={() => applyCoupon(c.coupon_code)}>
                                            <div className="absolute -right-4 -top-4 w-12 h-12 bg-emerald-200 rounded-full opacity-50"></div>
                                            <div className="flex justify-between items-center relative z-10">
                                                <div>
                                                    <div className="font-bold text-emerald-800 text-sm uppercase tracking-wide">{c.coupon_code}</div>
                                                    <div className="text-xs text-emerald-600 mt-0.5 font-medium">
                                                        {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : c.discount_type === 'freebie' ? 'FREE GIFT' : `Rs. ${c.discount_value} OFF`}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); applyCoupon(c.coupon_code); }}
                                                    className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors shadow-sm"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 text-xs py-4 px-2">
                                        No rewards available yet. Spin the wheel on the homepage to win!
                                    </div>
                                )}

                                {/* Simple manual coupon input */}
                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <input type="text" id="manual_coupon" placeholder="Have a Code?" className="w-full text-xs font-medium border border-gray-300 rounded-sm px-3 py-2 uppercase outline-none focus:border-fario-purple" />
                                    <button onClick={() => {
                                        const input = document.getElementById('manual_coupon') as HTMLInputElement;
                                        if (input && input.value) applyCoupon(input.value);
                                    }} className="bg-gray-900 text-white text-xs font-bold uppercase px-6 py-2 rounded-sm hover:bg-black transition-colors">Apply</button>
                                </div>

                                <AnimatePresence>
                                    {coupon && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 bg-emerald-50 text-emerald-800 text-xs p-3 rounded-md flex justify-between items-center border border-emerald-100">
                                            <span className="font-bold flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Applied: {coupon.code}</span>
                                            <button onClick={() => removeCoupon()} className="text-red-500 font-bold hover:underline">Remove</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="sticky top-24 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm">Price Details</h3>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex justify-between text-sm text-gray-900">
                                    <span>Price ({cartItems.length} items)</span>
                                    <span>{formatPrice(selectedCartTotal)}</span>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-sm text-emerald-600 font-bold">
                                        <span>Coupon Discount</span>
                                        <span>- {formatPrice(discountAmount)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm text-gray-900">
                                    <span>Delivery Charges</span>
                                    <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                                </div>

                                <div className="border-t border-dashed border-gray-300 my-2 pt-4 flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total Amount</span>
                                    <span>{formatPrice(finalTotal)}</span>
                                </div>

                                {coupon && (
                                    <div className="border-t border-dashed border-gray-300 pt-3 text-emerald-700 font-bold text-xs">
                                        Coupon "{coupon.code}" applied. You saved {formatPrice(discountAmount)}!
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-gray-100 flex items-center justify-center bg-gray-50">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <ShieldCheck size={14} className="text-gray-400" />
                                    Safe and Secure Payments.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
