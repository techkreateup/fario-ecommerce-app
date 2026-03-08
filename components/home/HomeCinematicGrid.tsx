import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { BG_DARK2, LIME, MILKY, DARK_TXT, E, CINEMATIC_ITEMS } from './HomeConstants';

const CinematicCard = ({ item, i }: { item: any, i: number }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [15, -15]);
    const rotateY = useTransform(x, [-100, 100], [-15, 15]);

    function handleMouse(e: React.MouseEvent) {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
    }

    return (
        <motion.div
            onMouseMove={handleMouse}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ rotateX, rotateY, perspective: 1000 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: E }}
            /* Mobile: larger fixed height in horizontal scroll. Desktop: normal aspect ratio */
            className="relative flex-shrink-0 w-[280px] h-[360px] md:w-auto md:h-auto md:aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer"
        >
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000">
                <source src={item.vid} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

            <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end">
                <motion.p className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] mb-1 md:mb-2" style={{ color: LIME }}>Feature 0{i + 1}</motion.p>
                <h3 className="font-heading font-black uppercase text-base md:text-3xl leading-tight md:leading-none mb-1 md:mb-3" style={{ color: MILKY }}>{item.title}</h3>
                <p className="text-[10px] md:text-sm opacity-60 line-clamp-2 leading-relaxed" style={{ color: MILKY }}>{item.detail}</p>
            </div>

            <motion.div className="absolute top-3 right-3 md:top-6 md:right-6 w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: LIME, color: DARK_TXT }}
            >
                <ArrowUpRight size={14} />
            </motion.div>
        </motion.div>
    );
};

export const HomeCinematicGrid = () => (
    <section className="pt-8 pb-4 md:pt-24 md:pb-10" style={{ background: BG_DARK2 }}>
        <div className="container mx-auto px-4 md:px-12 lg:px-20">
            {/* Header — compact on mobile */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-5 md:mb-20 gap-2 md:gap-12">
                <div className="max-w-xl w-full">
                    <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="text-[9px] md:text-xs font-black uppercase tracking-[0.5em] mb-2 md:mb-4" style={{ color: LIME }}
                    >— Precision Engineering —</motion.p>
                    <div className="overflow-hidden">
                        <motion.h2 initial={{ y: '100%' }} whileInView={{ y: 0 }} viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: E }}
                            className="font-heading font-black uppercase tracking-tighter leading-none"
                            style={{ fontSize: 'clamp(24px, 7vw, 96px)', color: MILKY }}
                        >Cinematic<br />Showcase</motion.h2>
                    </div>
                </div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                    <p className="hidden md:block max-w-xs text-sm opacity-50 mb-6" style={{ color: MILKY }}>Deep exploration of the Fario performance architecture. Every frame, a breakthrough.</p>
                </motion.div>
            </div>

            {/* Mobile: horizontal scroll strip. Desktop: 4-col grid */}
            <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-3 md:pb-0 md:overflow-visible" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}>
                {CINEMATIC_ITEMS.map((item, i) => <CinematicCard key={item.id} item={item} i={i} />)}
            </div>
        </div>
    </section>
);
