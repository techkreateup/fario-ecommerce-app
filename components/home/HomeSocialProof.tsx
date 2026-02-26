import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BG_LIGHT, BG_WHITE, PUR_BORDER, PURPLE, DARK_TXT, LIME, E, ACTIVITY } from './HomeConstants';

const LiveFeed = () => {
    const [visible, setVisible] = useState(0);
    const [show, setShow] = useState(true);

    useEffect(() => {
        const cycle = setInterval(() => {
            setShow(false);
            setTimeout(() => {
                setVisible(v => (v + 1) % ACTIVITY.length);
                setShow(true);
            }, 500);
        }, 3200);
        return () => clearInterval(cycle);
    }, []);

    const a = ACTIVITY[visible];

    return (
        <AnimatePresence mode="wait">
            {show && (
                <motion.div key={visible}
                    initial={{ x: -60, opacity: 0, scale: 0.92 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 60, opacity: 0, scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl max-w-xs"
                    style={{ background: BG_WHITE, border: `1.5px solid ${PUR_BORDER}`, boxShadow: '0 8px 32px rgba(122,81,160,0.12)' }}
                >
                    <span className="text-2xl flex-shrink-0">{a.avatar}</span>
                    <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-wide truncate" style={{ color: DARK_TXT }}>
                            {a.qty > 1 ? `${a.qty}×` : ''} {a.product}
                        </p>
                        <p className="text-[10px] opacity-50 truncate" style={{ color: DARK_TXT }}>{a.city} · {a.time}</p>
                    </div>
                    <motion.span className="flex-shrink-0 text-[9px] font-black uppercase px-2 py-1 rounded-full"
                        style={{ background: LIME, color: DARK_TXT }}
                        animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                    >LIVE</motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const HomeSocialProof = () => {
    const REVIEWS = [
        { name: 'Arjun S.', city: 'Mumbai', stars: 5, text: 'Absolute beast shoes. Wore them for a full marathon.', avatar: 'A' },
        { name: 'Priya M.', city: 'Delhi', stars: 5, text: 'The quality blew me away. Never going back to global brands.', avatar: 'P' },
        { name: 'Karan T.', city: 'Bangalore', stars: 5, text: 'My 3rd Fario purchase this year. Speaks for itself.', avatar: 'K' },
        { name: 'Sneha R.', city: 'Pune', stars: 5, text: 'Perfect fit, amazing design. Got compliments in Goa!', avatar: 'S' },
        { name: 'Ravi K.', city: 'Chennai', stars: 5, text: '14 prototype stages — you can feel every one of them.', avatar: 'R' },
        { name: 'Anika B.', city: 'Hyderabad', stars: 5, text: 'Finally Indian shoes that look premium AND feel premium.', avatar: 'N' },
    ];

    return (
        <section className="py-28 overflow-hidden" style={{ background: BG_LIGHT }}>
            <div className="container mx-auto px-8 md:px-20">
                <div className="flex flex-col md:flex-row gap-16 items-start">
                    {/* Left — live feed */}
                    <motion.div className="flex-shrink-0 flex flex-col gap-6"
                        initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.8 }}
                    >
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.4em] mb-3" style={{ color: PURPLE }}>Happening Now</p>
                            <h2 className="font-heading font-black uppercase tracking-tighter text-4xl md:text-5xl mb-2" style={{ color: DARK_TXT }}>Live Activity</h2>
                            <p className="text-sm opacity-50" style={{ color: DARK_TXT }}>Real orders happening right now</p>
                        </div>
                        {/* Live green dot */}
                        <div className="flex items-center gap-2">
                            <motion.div className="w-3 h-3 rounded-full" style={{ background: LIME }}
                                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                                transition={{ repeat: Infinity, duration: 1.4 }}
                            />
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: PURPLE }}>
                                {147 + Math.floor(Date.now() / 60000) % 30} people shopping now
                            </span>
                        </div>
                        <LiveFeed />
                        {/* Mini bar chart — orders over 7 days */}
                        <div className="flex items-end gap-2 h-16 mt-2">
                            {[40, 65, 55, 80, 92, 87, 100].map((h, i) => (
                                <motion.div key={i}
                                    className="flex-1 rounded-sm"
                                    style={{ background: i === 6 ? PURPLE : `${PURPLE}40` }}
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${h}%` }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08, duration: 0.5, ease: E }}
                                />
                            ))}
                        </div>
                        <p className="text-[10px] uppercase tracking-widest opacity-40" style={{ color: DARK_TXT }}>Orders · Last 7 days</p>
                    </motion.div>

                    {/* Right — review cards */}
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold uppercase tracking-[0.4em] mb-8" style={{ color: PURPLE }}>What People Say</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {REVIEWS.map((r, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ delay: i * 0.07, duration: 0.55, ease: E }}
                                    whileHover={{ y: -6, boxShadow: `0 20px 40px rgba(122,81,160,0.14)` }}
                                    className="p-6 rounded-2xl cursor-default"
                                    style={{ background: BG_WHITE, border: `1px solid ${PUR_BORDER}` }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm"
                                            style={{ background: PURPLE, color: LIME }}
                                        >{r.avatar}</div>
                                        <div>
                                            <p className="font-bold text-sm" style={{ color: DARK_TXT }}>{r.name}</p>
                                            <p className="text-[10px] opacity-50" style={{ color: DARK_TXT }}>{r.city}</p>
                                        </div>
                                        <div className="ml-auto flex gap-0.5">
                                            {[...Array(r.stars)].map((_, si) => (
                                                <motion.span key={si} style={{ color: LIME }}
                                                    initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                                                    transition={{ delay: i * 0.07 + si * 0.05 }}
                                                >★</motion.span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm leading-relaxed opacity-70 italic" style={{ color: DARK_TXT }}>"{r.text}"</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
