import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BG_LIGHT, LIME, PURPLE } from './HomeConstants';

const badges = [
    { icon: '👑', label: 'Premium Quality' },
    { icon: '🌱', label: 'Eco-Friendly' },
    { icon: '🚀', label: 'Innovative Design' },
    { icon: '💝', label: 'School Edition' },
];

const stats = [
    { value: '100+', label: 'Institutional Investors' },
    { value: '25000+', label: 'Students Using FARIO' },
    { value: '4.9⭐', label: 'Comfortable Rating' },
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
        // Simulate submission — replace with actual Supabase insert if needed
        await new Promise(r => setTimeout(r, 1200));
        setSubmitted(true);
        setLoading(false);
    };

    return (
        <section className="relative py-24 overflow-hidden" style={{ background: BG_LIGHT }}>
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px] opacity-10"
                    style={{ background: PURPLE }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
                        style={{ background: '#e8f5e0', color: '#2d7a00', border: '1px solid #6abf40' }}>
                        ✨ Early Access Available
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-tight text-fario-dark mb-4">
                        Join Our Customer List
                    </h2>
                    <p className="max-w-xl mx-auto text-base text-fario-dark/60 leading-relaxed">
                        Join our exclusive customer list and be the first to step into the future of premium footwear.{' '}
                        <span className="font-semibold text-fario-dark/80">Special discounts available.</span>
                    </p>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-8 mb-12"
                >
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-2xl md:text-3xl font-black font-heading text-fario-dark">{s.value}</div>
                            <div className="text-xs text-fario-dark/50 uppercase tracking-wider mt-1">{s.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-lg mx-auto rounded-3xl p-8 shadow-2xl border border-fario-dark/8"
                    style={{ background: '#fff' }}
                >
                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="text-5xl mb-4">🎉</div>
                            <h3 className="text-2xl font-black font-heading text-fario-dark mb-2">You're on the list!</h3>
                            <p className="text-fario-dark/60">We'll reach out with exclusive early access and special pricing.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Your full name"
                                    required
                                    className="w-full px-4 py-3.5 rounded-xl border border-fario-dark/15 text-fario-dark placeholder:text-fario-dark/35 text-sm focus:outline-none focus:ring-2 transition-all"
                                    style={{ focusRingColor: LIME } as any}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="w-full px-4 py-3.5 rounded-xl border border-fario-dark/15 text-fario-dark placeholder:text-fario-dark/35 text-sm focus:outline-none focus:ring-2 transition-all"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                    className="w-full px-4 py-3.5 rounded-xl border border-fario-dark/15 text-fario-dark placeholder:text-fario-dark/35 text-sm focus:outline-none focus:ring-2 transition-all"
                                />
                            </div>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all"
                                style={{ background: LIME, color: '#0e3039' }}
                            >
                                {loading ? 'Joining...' : 'Join Waitlist'}
                            </motion.button>
                        </form>
                    )}
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-4 mt-10"
                >
                    {badges.map((b) => (
                        <div key={b.label}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-fario-dark/70 border border-fario-dark/10"
                            style={{ background: '#fff' }}>
                            <span className="text-base">{b.icon}</span>
                            {b.label}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
