import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BG_LIGHT, BG_WHITE, PURPLE, DARK_TXT, PUR_BORDER, E, STATS } from './HomeConstants';
import { stg12, fadeUp, maskUp } from './HomeCommon';

function useCounter(target: number, active: boolean) {
    const [v, setV] = useState(0);
    useEffect(() => {
        if (!active) return;
        let n = 0;
        const step = Math.ceil(target / 55);
        const t = setInterval(() => { n = Math.min(n + step, target); setV(n); if (n >= target) clearInterval(t); }, 20);
        return () => clearInterval(t);
    }, [active, target]);
    return v;
}

const StatCard = ({ val, suf, label, icon }: { val: number; suf: string; label: string; icon: React.ReactNode }) => {
    const [active, setActive] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const count = useCounter(val, active);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.4 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -6, boxShadow: `0 20px 60px rgba(122,81,160,0.18)` }}
            transition={{ duration: 0.7, ease: E }}
            className="flex flex-col items-center text-center p-8 rounded-2xl gap-3"
            style={{ background: BG_WHITE, border: `1px solid ${PUR_BORDER}` }}
        >
            <motion.div className="text-purple-500"
                whileHover={{ rotate: [0, -12, 12, 0], scale: 1.2 }}
                transition={{ duration: 0.4 }}
                style={{ color: PURPLE }}
            >{icon}</motion.div>
            <span className="font-heading font-black text-4xl md:text-5xl"
                style={{ color: DARK_TXT }}
            >{count}{suf}</span>
            <span className="text-xs uppercase tracking-[0.25em] opacity-60" style={{ color: DARK_TXT }}>{label}</span>
        </motion.div>
    );
};

export const HomeStats = () => (
    <section className="py-28" style={{ background: BG_LIGHT }}>
        <div className="container mx-auto px-8 md:px-20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stg12}
                className="text-center mb-16"
            >
                <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.4em] mb-3" style={{ color: PURPLE }}>By the numbers</motion.p>
                <div className="overflow-hidden">
                    <motion.h2 variants={maskUp}
                        className="font-heading font-black uppercase tracking-tighter"
                        style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: DARK_TXT }}
                    >Proven Quality</motion.h2>
                </div>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {STATS.map((s, i) => (
                    <motion.div key={s.label}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ delay: i * 0.1, duration: 0.6, ease: E }}
                    >
                        <StatCard {...s} />
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);
