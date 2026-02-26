import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, PackageOpen, Wallet, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

const ReturnOrder: React.FC = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders, addReturn } = useCart();

    // Find item
    const order = orders.find(o => o.id === orderId);

    const [step, setStep] = useState(1);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [reason, setReason] = useState('');
    const [refundMethod, setRefundMethod] = useState<'source' | 'wallet'>('source');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [returnId, setReturnId] = useState('');

    // If order not found, go back
    useEffect(() => {
        if (!order) {
            // navigate('/orders'); 
            // Commented out to prevent redirect during dev if context sync is slow
        }
    }, [order, navigate]);

    if (!order) return (
        <LoadingSpinner fullScreen size="xl" message="Loading order details..." color="#7A51A0" />
    );

    const handleToggleItem = (itemId: string) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(prev => prev.filter(id => id !== itemId));
        } else {
            setSelectedItems(prev => [...prev, itemId]);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const refundAmount = order.items.reduce((acc, item) =>
            selectedItems.includes(item.id) ? acc + (item.price * item.quantity) : acc, 0
        );

        const newReturnId = `RET-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        setReturnId(newReturnId);

        const request = {
            id: newReturnId,
            orderId: order.id,
            items: selectedItems,
            reason: reason,
            method: (refundMethod === 'source' ? 'refund' : 'credit') as 'refund' | 'credit',
            status: 'Initiated' as const,
            requestedAt: new Date().toISOString(),
            refundAmount: refundAmount
        };

        try {
            await addReturn(request);
            setStep(3); // Success step
        } catch (err) {
            console.error('Failed to submit return:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Confetti Effect on Success
    useEffect(() => {
        if (step !== 3) return;

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            window.confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#7A51A0', '#10B981', '#F59E0B']
            });
        };
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [step]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 md:pt-28 px-4 font-sans">
            <div className="max-w-3xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/orders')} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm bg-white/50 backdrop-blur-sm border border-gray-100">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Return Items</h1>
                        <p className="text-sm text-gray-500 font-medium">Order #{order.id}</p>
                    </div>
                </div>

                {/* PROGRESS STEPS */}
                <div className="relative mb-12 px-6">
                    <div className="flex items-center justify-between relative z-10">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex flex-col items-center gap-2">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        backgroundColor: step >= s ? '#7A51A0' : '#E5E7EB',
                                        scale: step === s ? 1.1 : 1
                                    }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-lg transition-colors duration-500`}
                                >
                                    {step > s ? <CheckCircle2 size={18} /> : s}
                                </motion.div>
                                <span className={`text-xs font-bold uppercase tracking-wider ${step >= s ? 'text-fario-purple' : 'text-gray-400'}`}>
                                    {s === 1 ? 'Select' : s === 2 ? 'Details' : 'Done'}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Background Line */}
                    <div className="absolute top-5 left-10 right-10 h-1 bg-gray-200 -z-0 rounded-full">
                        <motion.div
                            className="h-full bg-fario-purple rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden min-h-[500px] relative">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: SELECT ITEMS */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="p-8"
                            >
                                <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-4">
                                    <PackageOpen className="text-fario-purple" />
                                    Select items to return
                                </h2>
                                <div className="space-y-4">
                                    {order.items.map(item => (
                                        <motion.div
                                            key={item.id}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            className={`flex gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedItems.includes(item.id) ? 'border-fario-purple bg-fario-purple/5 shadow-md' : 'border-gray-100 hover:border-fario-purple/30 hover:bg-gray-50'}`}
                                            onClick={() => handleToggleItem(item.id)}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 transition-colors ${selectedItems.includes(item.id) ? 'bg-fario-purple border-fario-purple' : 'border-gray-300 bg-white'}`}>
                                                {selectedItems.includes(item.id) && <CheckCircle2 size={14} className="text-white" />}
                                            </div>
                                            <div className="w-20 h-20 bg-white rounded-xl p-2 border border-gray-100 flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 line-clamp-2 text-base mb-1 leadin-tight">{item.name}</p>
                                                <p className="text-sm text-gray-500 font-medium bg-gray-100 w-fit px-2 py-0.5 rounded text-xs uppercase tracking-wide">Qty: {item.quantity}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-10 flex justify-end">
                                    <button
                                        disabled={selectedItems.length === 0}
                                        onClick={() => setStep(2)}
                                        className="bg-gradient-to-r from-fario-purple to-fario-purple/90 hover:from-fario-teal hover:to-fario-teal/90 disabled:from-gray-300 disabled:to-gray-400 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-fario-purple/30 disabled:shadow-none active:scale-95 duration-300"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: REASON & REFUND */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="p-8"
                            >
                                <div className="mb-8">
                                    <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-4">
                                        <AlertCircle className="text-fario-purple" />
                                        Why are you returning?
                                    </h2>
                                    <div className="relative">
                                        <select
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            className="w-full p-5 rounded-2xl border-2 border-gray-200 focus:border-fario-purple focus:ring-4 focus:ring-fario-purple/10 outline-none bg-gray-50 font-medium appearance-none cursor-pointer transition-all hover:bg-white"
                                        >
                                            <option value="" disabled>Select a reason for return...</option>
                                            <option value="defective">Item is defective or damaged</option>
                                            <option value="wrong_item">Received wrong item</option>
                                            <option value="size_small">Size too small</option>
                                            <option value="size_large">Size too large</option>
                                            <option value="changed_mind">Changed my mind</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            ▼
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-4">
                                        <Wallet className="text-fario-purple" />
                                        Refund Method
                                    </h2>
                                    <div className="space-y-4">
                                        <label className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all ${refundMethod === 'source' ? 'border-fario-purple bg-fario-purple/5 shadow-md transform scale-[1.01]' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <input type="radio" name="refund" checked={refundMethod === 'source'} onChange={() => setRefundMethod('source')} className="w-5 h-5 accent-fario-purple" />
                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-100 text-gray-600 shadow-sm">
                                                <CreditCard size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-bold text-gray-900 text-lg">Original Payment Method</span>
                                                <p className="text-sm text-gray-500 mt-1 font-medium">Refunding to •••• 4242 (3-5 business days)</p>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all ${refundMethod === 'wallet' ? 'border-fario-purple bg-fario-purple/5 shadow-md transform scale-[1.01]' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <input type="radio" name="refund" checked={refundMethod === 'wallet'} onChange={() => setRefundMethod('wallet')} className="w-5 h-5 accent-fario-purple" />
                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-100 text-fario-purple shadow-sm">
                                                <Wallet size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                    Fario Wallet
                                                    <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">INSTANT</span>
                                                </span>
                                                <p className="text-sm text-gray-500 mt-1 font-medium">Instant refund. Use for future purchases.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-auto">
                                    <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-800 font-bold uppercase tracking-widest text-xs px-4 py-3">Back</button>
                                    <button
                                        disabled={!reason || isSubmitting}
                                        onClick={handleSubmit}
                                        className="bg-gradient-to-r from-fario-purple to-fario-purple/90 hover:from-fario-teal hover:to-fario-teal/90 disabled:from-gray-300 disabled:to-gray-400 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-fario-purple/30 disabled:shadow-none active:scale-95 duration-300 flex items-center gap-3"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>Confirm Return</>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: SUCCESS */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="p-12 flex flex-col items-center justify-center text-center min-h-[500px]"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-green-100 shadow-xl"
                                >
                                    <CheckCircle2 size={48} className="text-green-600" />
                                </motion.div>
                                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Return Requested!</h2>
                                <p className="text-gray-600 max-w-md mb-10 font-medium leading-relaxed">
                                    Your return request has been submitted successfully. A courier will be assigned to pick up your items within 24 hours.
                                </p>

                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 w-full max-w-sm mb-10 text-left shadow-sm">
                                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Return ID</span>
                                        <span className="text-sm font-bold text-gray-900">{returnId}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 uppercase font-extrabold tracking-wider mb-2">Estimated Refund</p>
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-500 font-medium text-sm">Amount</span>
                                        <span className="text-3xl font-black text-fario-purple tracking-tight">Rs. {order.items.reduce((acc, item) => selectedItems.includes(item.id) ? acc + (item.price * item.quantity) : acc, 0).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => navigate('/orders')}
                                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-gray-200 active:scale-95 uppercase tracking-widest text-xs"
                                    >
                                        Track Status
                                    </button>
                                    <button
                                        onClick={() => navigate('/products')}
                                        className="bg-white border-2 border-gray-200 text-gray-900 px-8 py-3 rounded-xl font-bold hover:border-gray-900 transition-all active:scale-95 uppercase tracking-widest text-xs"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ReturnOrder;
