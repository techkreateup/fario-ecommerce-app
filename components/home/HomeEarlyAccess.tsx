import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PURPLE, LIME, BG_DARK, MILKY, E } from './HomeConstants';
import { ArrowRight, CheckCircle2, Users, Globe, Award } from 'lucide-react';

const badges = [
    { icon: <Award size={16} />, label: 'Premium Quality' },
    { icon: <Globe size={16} />, label: 'Eco-Friendly' },
    { icon: <CheckCircle2 size={16} />, label: 'Master Design' },
];

const stats = [
    { value: '100+', label: 'Investors', sub: 'Global backing' },
    { value: '25k+', label: 'Elite Members', sub: 'Growing community' },
    { value: '4.9', label: 'Rating', sub: 'Master craftsmanship' },
];

export const HomeEarlyAccess: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setSubmitted(true);
        setLoading(false);
    };

    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-[#0A0514]">
            {/* Background Narrative Layers */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-lime-400/5 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 md:px-12 lg:px-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    
                    {/* LEFT COLUMN: Narrative & Trust */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: E }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-lime-400/20 bg-lime-400/5 text-lime-400">
                                ✦ Limited Opportunity
                            </span>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading uppercase tracking-tighter text-white leading-[0.85] mb-8">
                                Step Into <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400 italic">The Future</span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed mb-12">
                                We're building more than footwear—we're creating a new standard of human motion. Join the inner circle for exclusive early releases and lifetime member benefits.
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-6 md:gap-10">
                                {stats.map((s, i) => (
                                    <motion.div 
                                        key={s.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                                    >
                                        <div className="text-3xl md:text-4xl font-black text-white mb-1 font-heading italic">{s.value}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-lime-400/80">{s.label}</div>
                                        <div className="text-[9px] text-gray-500 uppercase font-bold mt-1">{s.sub}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-4 mt-16 pt-10 border-t border-white/5">
                                {badges.map((b, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <span className="p-1.5 rounded-lg bg-white/5 text-lime-400">{b.icon}</span>
                                        {b.label}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: The Vault Form */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: E }}
                            className="relative group"
                        >
                            {/* Card Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-lime-400/20 to-purple-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                            
                            <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                                <AnimatePresence mode="wait">
                                    {submitted ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center py-12"
                                        >
                                            <div className="w-20 h-20 bg-lime-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <CheckCircle2 size={40} className="text-lime-400" />
                                            </div>
                                            <h3 className="text-3xl font-black text-white font-heading uppercase mb-4">You're In</h3>
                                            <p className="text-gray-400 text-sm">Welcome to the Fario Elite. Access credentials have been sent to your terminal.</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="form">
                                            <div className="mb-8">
                                                <h3 className="text-2xl font-black text-white font-heading uppercase tracking-tight mb-2">Join the Vault</h3>
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Priority Access & Member Pricing</p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-5">
                                                <div className="space-y-4">
                                                    <div className="relative">
                                                        <input
                                                            type="text" required value={name} onChange={e => setName(e.target.value)}
                                                            placeholder="Full Name"
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-lime-400/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                                            placeholder="Email Address"
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-lime-400/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                                                            placeholder="Mobile (Optional)"
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-lime-400/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                                                        />
                                                    </div>
                                                </div>

                                                <motion.button
                                                    type="submit"
                                                    disabled={loading}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full relative group mt-4 overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-lime-400 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                                                    <div className="relative py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-colors group-hover:text-black">
                                                        {loading ? 'Processing...' : (
                                                            <>Request Access <ArrowRight size={14} /></>
                                                        )}
                                                    </div>
                                                </motion.button>

                                                <p className="text-[9px] text-center text-gray-600 uppercase font-black tracking-widest mt-4">
                                                    No spam • Secure encryption • 25k+ Members
                                                </p>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};
