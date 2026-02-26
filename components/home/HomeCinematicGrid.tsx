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
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
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
            className="relative aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer"
        >
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000">
                <source src={item.vid} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

            <div className="absolute inset-0 p-8 flex flex-col justify-end translate-z-20">
                <motion.p className="text-xs font-black uppercase tracking-[0.3em] mb-2" style={{ color: LIME }}>Feature 0{i + 1}</motion.p>
                <h3 className="font-heading font-black uppercase text-3xl leading-none mb-3" style={{ color: MILKY }}>{item.title}</h3>
                <p className="text-sm opacity-60 line-clamp-2 leading-relaxed" style={{ color: MILKY }}>{item.detail}</p>
            </div>

            <motion.div className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: LIME, color: DARK_TXT }}
            >
                <ArrowUpRight size={20} />
            </motion.div>
        </motion.div>
    );
};

export const HomeCinematicGrid = () => (
    <section className="py-12 md:py-24" style={{ background: BG_DARK2 }}>
        <div className="container mx-auto px-4 md:px-12 lg:px-20">
            <div className="flex flex-col md:flex-row items-end justify-between mb-10 md:mb-20 gap-6">
                <div className="max-w-xl">
                    <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="text-xs font-black uppercase tracking-[0.5em] mb-4" style={{ color: LIME }}
                    >— Precision Engineering —</motion.p>
                    <div className="overflow-hidden">
                        <motion.h2 initial={{ y: '100%' }} whileInView={{ y: 0 }} viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: E }}
                            className="font-heading font-black uppercase tracking-tighter leading-none"
                            style={{ fontSize: 'clamp(36px, 7vw, 96px)', color: MILKY }}
                        >Cinematic<br />Showcase</motion.h2>
                    </div>
                </div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                    <p className="max-w-xs text-sm opacity-50 mb-6" style={{ color: MILKY }}>Deep exploration of the Fario performance architecture. Every frame, a breakthrough.</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {CINEMATIC_ITEMS.map((item, i) => <CinematicCard key={item.id} item={item} i={i} />)}
            </div>
        </div>
    </section>
);
