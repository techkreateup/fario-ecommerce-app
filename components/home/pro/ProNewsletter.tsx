import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, X, ArrowRight } from 'lucide-react';

export default function ProNewsletter() {
    const [step, setStep] = useState(0); // 0: Email, 1: Preferences, 2: Success
    const [email, setEmail] = useState('');
    const [preferences, setPreferences] = useState<string[]>([]);

    // Complex State Logic
    const togglePref = (pref: string) => {
        if (preferences.includes(pref)) {
            setPreferences(prev => prev.filter(p => p !== pref));
        } else {
            setPreferences(prev => [...prev, pref]);
        }
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.includes('@')) {
            setStep(1);
        }
    };

    const handleFinalSubmit = () => {
        // Simulate API call
        setTimeout(() => setStep(2), 1000);
    };

    return (
        <section className="py-32 bg-black text-white overflow-hidden relative">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-[400px]">
                <AnimatePresence mode="wait">

                    {/* Step 0: Email Input */}
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-xl w-full text-center"
                        >
                            <h2 className="text-[4vw] font-black uppercase tracking-tighter mb-4 leading-none">
                                Join the Inner Circle
                            </h2>
                            <p className="text-gray-400 mb-8 tracking-wide">
                                Early access to limited drops and exclusive collaborations.
                            </p>

                            <form onSubmit={handleEmailSubmit} className="relative">
                                <input
                                    type="email"
                                    placeholder="ENTER YOUR EMAIL"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border-b-2 border-white/20 py-4 text-2xl font-bold uppercase tracking-widest focus:outline-none focus:border-white transition-colors text-center placeholder:text-white/20"
                                />
                                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white hover:text-black rounded-full transition-colors">
                                    <ArrowRight size={24} />
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* Step 1: Preferences */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="max-w-2xl w-full text-center"
                        >
                            <h3 className="text-2xl font-bold uppercase tracking-widest mb-12">Customize Your Feed</h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                {['Running', 'Lifestyle', 'Limited', 'Apparel'].map((pref) => (
                                    <button
                                        key={pref}
                                        onClick={() => togglePref(pref)}
                                        className={`py-4 border border-white/20 uppercase font-bold text-xs tracking-widest transition-all ${preferences.includes(pref) ? 'bg-white text-black' : 'hover:border-white'}`}
                                    >
                                        {pref}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleFinalSubmit}
                                className="bg-fario-purple text-white px-12 py-4 text-lg font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                            >
                                Complete Signup
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Success */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-black"
                            >
                                <Check size={48} />
                            </motion.div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Welcome Aboard</h2>
                            <p className="text-gray-400">Your first exclusive invite is on its way.</p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </section>
    );
}
