
import React from 'react';
import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';

export default function Newsletter() {
    return (
        <section className="py-24 bg-black text-white overflow-hidden">
            <div className="container mx-auto px-4 relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-fario-purple/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 mb-8 bg-white/5 backdrop-blur-sm"
                    >
                        <Mail size={16} className="text-yellow-400" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Join the Fario Club</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic"
                    >
                        Stay Ahead <br /> Of the Game
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto"
                    >
                        Subscribe to get early access to drops, exclusive discounts, and fashion insights. No spam, just pure heat.
                    </motion.p>

                    <motion.form
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="relative flex-grow">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full bg-white/10 border border-white/20 rounded-full px-8 py-5 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-white/30"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-yellow-400 text-black px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 whitespace-nowrap"
                        >
                            Sign Me Up
                            <Send size={18} />
                        </button>
                    </motion.form>

                    <p className="mt-8 text-white/30 text-xs">
                        By subscribing, you agree to our <a href="/terms" className="underline hover:text-white">Terms of Service</a> and <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </section>
    );
}
