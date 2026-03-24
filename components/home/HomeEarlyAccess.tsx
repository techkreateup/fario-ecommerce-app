import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { E } from './HomeConstants';
import { ArrowRight, CheckCircle2, Globe, Award } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE-FIRST REWRITE — HomeEarlyAccess
// Issue fixed: Card overflow on mobile, inputs too small, stats grid broken,
//              no proper single-column collapse on small screens.
// ─────────────────────────────────────────────────────────────────────────────

const badges = [
    { icon: <Award size={14} />, label: 'Premium Quality' },
    { icon: <Globe size={14} />, label: 'Eco-Friendly' },
    { icon: <CheckCircle2 size={14} />, label: 'Master Design' },
];

const stats = [
    { value: '100+', label: 'Investors', sub: 'Global backing' },
    { value: '25k+', label: 'Members', sub: 'Growing community' },
    { value: '4.9★', label: 'Rating', sub: 'Craftsmanship' },
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
        <section className="relative py-16 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-br from-[#3D364A] via-[#1A1625] to-[#0A0514]">

            {/* Background glow — pointer-events-none so it never blocks touch */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-lime-400/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full px-5 sm:px-8 md:px-12 lg:px-20 max-w-[1400px] mx-auto">

                {/* ── MOBILE: Single column stack  ─────────────────────────────
                    ── DESKTOP (lg+): Two-column grid                         */}
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16 lg:items-center">

                    {/* ── LEFT: Narrative + Stats ─────────────────────────── */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: E }}
                        >
                            {/* Eyebrow */}
                            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-5 border border-white/10 bg-white/5 text-lime-400">
                                ✦ Limited Opportunity
                            </span>

                            {/* Headline */}
                            <h2 className="text-[clamp(38px,8vw,88px)] font-black uppercase tracking-tighter text-white leading-[0.85] mb-5">
                                Step Into{' '}
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400 italic">
                                    The Future
                                </span>
                            </h2>

                            {/* Body */}
                            <p className="text-[15px] md:text-lg text-gray-400 leading-relaxed mb-8 md:mb-12 max-w-xl">
                                We're building more than footwear — we're creating a new standard of human motion.
                                Join the inner circle for exclusive early releases and lifetime member benefits.
                            </p>

                            {/* Stats — 3 equal columns, no wrapping or cutoff */}
                            <div className="grid grid-cols-3 gap-4 md:gap-8">
                                {stats.map((s, i) => (
                                    <motion.div
                                        key={s.label}
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                                    >
                                        <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-0.5 italic">{s.value}</div>
                                        <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-lime-400/80">{s.label}</div>
                                        <div className="text-[9px] text-gray-500 uppercase font-bold mt-0.5 hidden sm:block">{s.sub}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-3 mt-8 md:mt-14 pt-8 border-t border-white/5">
                                {badges.map((b, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <span className="p-1.5 rounded-lg bg-white/5 text-lime-400">{b.icon}</span>
                                        {b.label}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* ── RIGHT: Vault Form Card ───────────────────────────── */}
                    <div className="lg:col-span-5 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: E }}
                            className="relative group w-full"
                        >
                            {/* Glow ring */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-lime-400/20 to-purple-500/20 rounded-2xl md:rounded-3xl blur-sm opacity-20 group-hover:opacity-50 transition duration-700 pointer-events-none" />

                            {/* Card */}
                            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-6 sm:p-8 shadow-2xl w-full">
                                <AnimatePresence mode="wait">
                                    {submitted ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center py-10"
                                        >
                                            <div className="w-16 h-16 bg-lime-400/20 rounded-full flex items-center justify-center mx-auto mb-5">
                                                <CheckCircle2 size={32} className="text-lime-400" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white uppercase mb-3">You're In!</h3>
                                            <p className="text-gray-400 text-sm">Welcome to the Fario Elite. Check your inbox for access credentials.</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="form">
                                            {/* Form Header */}
                                            <div className="mb-6">
                                                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-1">Join the Vault</h3>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Priority Access & Member Pricing</p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                                {/* Full Name */}
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    placeholder="Full Name"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm outline-none focus:border-lime-400/50 focus:bg-white/10 transition-all placeholder:text-gray-600 min-h-[52px]"
                                                />

                                                {/* Email */}
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    placeholder="Email Address"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm outline-none focus:border-lime-400/50 focus:bg-white/10 transition-all placeholder:text-gray-600 min-h-[52px]"
                                                />

                                                {/* Phone */}
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={e => setPhone(e.target.value)}
                                                    placeholder="Mobile (Optional)"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm outline-none focus:border-lime-400/50 focus:bg-white/10 transition-all placeholder:text-gray-600 min-h-[52px]"
                                                />

                                                {/* Submit */}
                                                <motion.button
                                                    type="submit"
                                                    disabled={loading}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="w-full mt-2 bg-white hover:bg-lime-400 text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 rounded-xl py-4 min-h-[52px] transition-colors duration-300 shadow-lg"
                                                >
                                                    {loading ? (
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                            Processing...
                                                        </span>
                                                    ) : (
                                                        <>Request Access <ArrowRight size={14} /></>
                                                    )}
                                                </motion.button>

                                                <p className="text-[9px] text-center text-gray-600 uppercase font-black tracking-widest pt-1">
                                                    No spam · Secure · 25k+ Members
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
