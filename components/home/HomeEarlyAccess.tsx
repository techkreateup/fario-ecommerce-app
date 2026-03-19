import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PURPLE, MILKY, BG_DARK } from './HomeConstants';

// Custom light green
const LIGHT_GREEN = '#bbf7d0'; // Tailwind green-200

const badges = [
    { icon: '👑', label: 'Premium Quality' },
    { icon: '🌱', label: 'Eco-Friendly' },
    { icon: '🚀', label: 'Innovative Design' },
    { icon: '👠', label: "Womens Footware" },
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
        <section className="relative py-12 md:py-24 overflow-hidden" style={{ background: '#FFFFFF' }}>
            {/* Background pure and flat - NO glowing orbs or shadows */}

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-8 md:mb-12"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
                        style={{ background: 'rgba(0,0,0,0.15)', color: BG_DARK, border: `1px solid rgba(0,0,0,0.2)` }}>
                        ✨ Early Access Available
                    </span>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-black font-heading uppercase tracking-tight mb-3 md:mb-4"
                        style={{ color: BG_DARK }}>
                        Join Our Customer List
                    </h2>
                    <p className="max-w-xl mx-auto text-sm md:text-base leading-relaxed" style={{ color: 'rgba(0,0,0,0.8)' }}>
                        Join our exclusive customer list and be the first to step into the future of premium footwear.{' '}
                        <span className="font-bold" style={{ color: BG_DARK }}>Special discounts available.</span>
                    </p>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 md:mb-12"
                >
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-xl md:text-3xl font-black font-heading" style={{ color: BG_DARK }}>{s.value}</div>
                            <div className="text-[10px] md:text-xs uppercase font-bold tracking-wider mt-1" style={{ color: 'rgba(0,0,0,0.6)' }}>{s.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Form Card - FLAT DESIGN */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-lg mx-auto rounded-3xl p-5 md:p-8"
                    style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.05)' }}
                >
                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="text-5xl mb-4">🎉</div>
                            <h3 className="text-2xl font-black font-heading mb-2" style={{ color: BG_DARK }}>You're on the list!</h3>
                            <p style={{ color: 'rgba(0,0,0,0.6)' }}>We'll reach out with exclusive early access and special pricing.</p>
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
                                    className="w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none transition-all"
                                    style={{ background: 'white', borderColor: 'rgba(0,0,0,0.1)', color: BG_DARK } as any}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none transition-all"
                                    style={{ background: 'white', borderColor: 'rgba(0,0,0,0.1)', color: BG_DARK }}
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
                                    className="w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none transition-all"
                                    style={{ background: 'white', borderColor: 'rgba(0,0,0,0.1)', color: BG_DARK }}
                                />
                            </div>

                            {/* Submit - FLAT DESIGN */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all"
                                style={{ background: PURPLE, color: MILKY }}
                            >
                                {loading ? 'Joining...' : 'Join Waitlist'}
                            </motion.button>
                        </form>
                    )}
                </motion.div>

                {/* Trust Badges - FLAT DESIGN */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-4 mt-10"
                >
                    {badges.map((b) => (
                        <div key={b.label}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border"
                            style={{ background: 'rgba(255,255,255,0.6)', borderColor: 'rgba(0,0,0,0.05)', color: BG_DARK }}>
                            <span className="text-base">{b.icon}</span>
                            {b.label}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
