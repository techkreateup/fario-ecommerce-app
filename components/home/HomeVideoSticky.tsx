import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BG_DARK, LIME, MILKY, DARK_TXT, E, V2, HL3 } from './HomeConstants';
import { VidEl } from './HomeCommon';

export const HomeVideoSticky = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const ty = useTransform(scrollYProgress, [0, 1], [-55, 55]);

    return (
        <section ref={ref} className="flex flex-col md:flex-row min-h-screen" style={{ background: BG_DARK }}>
            {/* Sticky vid */}
            <div className="w-full md:w-1/2 h-[55vh] md:h-screen md:sticky md:top-0 overflow-hidden relative">
                <VidEl src={V2} poster={HL3.e} cls="opacity-65" />
                <div className="absolute inset-0" style={{ background: 'rgba(26,13,46,0.2)' }} />
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to right, transparent 30%, rgba(26,13,46,0.4) 100%)' }}
                />
                {/* Lime scan line */}
                <motion.div className="absolute left-0 right-0 h-px pointer-events-none"
                    style={{ background: `linear-gradient(to right, transparent, ${LIME}50, transparent)` }}
                    animate={{ top: ['0%', '100%'] }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                />
                {/* Corner accents */}
                <div className="absolute top-6 left-6 w-8 h-8 pointer-events-none"
                    style={{ borderTop: `2px solid ${LIME}`, borderLeft: `2px solid ${LIME}` }}
                />
                <div className="absolute bottom-6 right-6 w-8 h-8 pointer-events-none"
                    style={{ borderBottom: `2px solid ${LIME}`, borderRight: `2px solid ${LIME}` }}
                />
            </div>

            {/* Scroll text */}
            <motion.div style={{ y: ty }} className="w-full md:w-1/2 flex flex-col justify-center p-10 md:p-24">
                <motion.span
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="text-xs font-bold uppercase tracking-[0.4em] mb-10 block" style={{ color: LIME }}
                >— Craftsmanship</motion.span>

                {['Engineered', 'for the', 'Bold'].map((w, i) => (
                    <div key={w} className="overflow-hidden">
                        <motion.div
                            initial={{ y: '100%' }} whileInView={{ y: '0%' }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.85, ease: E, delay: i * 0.12 }}
                            className="font-heading font-black uppercase tracking-tighter leading-none mb-1"
                            style={{
                                fontSize: 'clamp(42px, 7vw, 92px)',
                                color: i === 1 ? 'transparent' : LIME,
                                WebkitTextStroke: i === 1 ? `2px ${LIME}` : undefined,
                            }}
                        >{w}</motion.div>
                    </div>
                ))}

                <motion.p
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-base leading-loose mt-10 mb-12 max-w-md" style={{ color: LIME, opacity: 0.9 }}
                >Every stitch deliberate. Every sole tested. 14 stages before they reach you.</motion.p>

                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
                    <Link to="/story"
                        className="inline-flex items-center gap-3 px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] transition"
                        style={{ background: LIME, color: DARK_TXT }}
                    >Read Our Story <ArrowRight size={14} /></Link>
                </motion.div>
            </motion.div>
        </section>
    );
};
