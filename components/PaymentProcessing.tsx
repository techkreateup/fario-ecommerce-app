import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Smartphone, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentProcessingProps {
    onComplete: () => void;
    method: string; // 'upi' | 'card' | 'cod'
}

const PaymentProcessing: React.FC<PaymentProcessingProps> = ({ onComplete, method }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Step 1: Initiating (0-1.5s)
        const t1 = setTimeout(() => setStep(1), 1500);
        // Step 2: Processing (1.5-3.5s)
        const t2 = setTimeout(() => setStep(2), 3500);
        // Step 3: Success (3.5-4.5s)
        const t3 = setTimeout(() => {
            setStep(3);
            setTimeout(onComplete, 1200); // Wait 1.2s after success to close
        }, 4500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 font-sans"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-fario-purple via-fario-teal to-fario-purple" />

                <div className="flex flex-col items-center text-center space-y-8">

                    {/* ICON ANIMATION AREA */}
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {step < 3 ? (
                                <motion.div
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="relative flex items-center justify-center w-full h-full"
                                >
                                    {/* Pulse Rings */}
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute inset-0 bg-fario-purple/10 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                        className="absolute inset-4 bg-fario-purple/5 rounded-full"
                                    />

                                    {/* Central Icon */}
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative z-10 bg-white p-5 rounded-full shadow-xl border border-gray-100"
                                    >
                                        {method === 'upi' ? (
                                            <Smartphone className="w-12 h-12 text-fario-purple" />
                                        ) : (
                                            <CreditCard className="w-12 h-12 text-fario-purple" />
                                        )}
                                    </motion.div>

                                    {/* Orbiting Shield */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0"
                                    >
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white p-1.5 rounded-full shadow-md border border-gray-50">
                                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="bg-emerald-100 p-6 rounded-full"
                                >
                                    <CheckCircle2 className="w-16 h-16 text-emerald-600" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* TEXT STATUS */}
                    <div className="space-y-2">
                        <motion.h3
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-black text-gray-900 tracking-tight"
                        >
                            {step === 0 && "Connecting securely..."}
                            {step === 1 && "Verifying credentials..."}
                            {step === 2 && "Processing payment..."}
                            {step === 3 && "Payment Successful!"}
                        </motion.h3>
                        <p className="text-sm text-gray-500 font-medium">
                            Please do not close this window or press back.
                        </p>
                    </div>

                    {/* PROGRESS BAR */}
                    {step < 3 && (
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                className="h-full bg-gradient-to-r from-fario-purple to-fario-purple/80"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(step + 1) * 33}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    )}

                    {/* SECURITY BADGE */}
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <Lock size={12} />
                        <span>256-bit SSL Encrypted Connection</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PaymentProcessing;
