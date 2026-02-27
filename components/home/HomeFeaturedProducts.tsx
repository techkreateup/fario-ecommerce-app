import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { BG_LIGHT, BG_WHITE, DARK_TXT, PURPLE, MILKY, LIME, PUR_BORDER, E, PRODUCTS, HL3 } from './HomeConstants';
import { stg12, fadeUp, maskUp } from './HomeCommon';
import { Tilt } from './HomeCommon';

const PCard = ({ p, i }: { p: typeof PRODUCTS[0]; i: number }) => {
    const [hov, setHov] = useState(false);
    const [wish, setWish] = useState(false);
    const disc = Math.round((1 - p.price / p.orig) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: i * 0.07, duration: 0.6, ease: E }}
        >
            <Tilt cls="flex-shrink-0 w-[270px] md:w-[300px] snap-start">
                <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: BG_WHITE, border: `1px solid ${PUR_BORDER}`, boxShadow: hov ? '0 20px 50px rgba(122,81,160,0.15)' : '0 4px 20px rgba(122,81,160,0.06)', transition: 'box-shadow 0.3s' }}
                >
                    <div className="relative aspect-[3/4] overflow-hidden">
                        {p.tag && (
                            <motion.span className="absolute top-3 left-3 z-20 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                                style={{ background: LIME, color: DARK_TXT }}
                                animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                            >{p.tag}</motion.span>
                        )}
                        <span className="absolute top-3 right-10 z-20 text-[9px] font-black px-2 py-0.5 rounded-full"
                            style={{ background: `${PURPLE}22`, color: PURPLE }}
                        >-{disc}%</span>

                        <motion.img src={p.img} alt={p.name}
                            animate={{ opacity: hov ? 0 : 1, scale: hov ? 1.1 : 1 }} transition={{ duration: 0.4 }}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).src = HL3.a; }}
                        />
                        <motion.img src={p.alt} alt={p.name}
                            animate={{ opacity: hov ? 1 : 0, scale: hov ? 1 : 0.95 }} transition={{ duration: 0.4 }}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).src = HL3.b; }}
                        />
                        <motion.div animate={{ opacity: hov ? 1 : 0 }} className="absolute inset-0 pointer-events-none rounded-none"
                            style={{ boxShadow: `inset 0 0 0 2px ${PURPLE}` }}
                        />
                        <motion.button onClick={() => setWish(w => !w)}
                            whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.7 }}
                            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full"
                            style={{ background: `${BG_WHITE}DD`, backdropFilter: 'blur(12px)' }}
                        >
                            <Heart size={13} className={wish ? 'fill-red-400 text-red-400' : ''} style={{ color: wish ? undefined : PURPLE }} />
                        </motion.button>
                        <motion.div initial={{ y: '100%' }} animate={{ y: hov ? '0%' : '100%' }}
                            transition={{ duration: 0.28, ease: E }}
                            className="absolute bottom-0 inset-x-0 z-20"
                        >
                            <button className="w-full py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                style={{ background: PURPLE, color: MILKY }}
                            ><ShoppingBag size={13} /> Add to Cart</button>
                        </motion.div>
                    </div>
                    <div className="p-5">
                        <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: PURPLE }}>{p.sub}</p>
                        <h3 className="font-heading font-black uppercase text-sm tracking-wide mb-2" style={{ color: DARK_TXT }}>{p.name}</h3>
                        <div className="flex items-center gap-2">
                            <span className="font-bold" style={{ color: DARK_TXT }}>Rs. {p.price.toLocaleString('en-IN')}</span>
                            <span className="line-through text-xs opacity-40" style={{ color: DARK_TXT }}>Rs. {p.orig.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </Tilt>
        </motion.div>
    );
};

export const HomeFeaturedProducts = () => {
    const track = useRef<HTMLDivElement>(null);
    const [L, setL] = useState(false);
    const [R, setR] = useState(true);
    const sync = () => {
        if (!track.current) return;
        const { scrollLeft: sl, scrollWidth: sw, clientWidth: cw } = track.current;
        setL(sl > 4); setR(sl + cw < sw - 5);
    };

    return (
        <section className="py-12 md:py-24" style={{ background: BG_LIGHT }}>
            <div className="container mx-auto px-4 md:px-12 lg:px-20">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stg12}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 md:mb-14"
                >
                    <div>
                        <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.35em] mb-3" style={{ color: PURPLE }}>
                            Fresh Drops
                        </motion.p>
                        <div className="overflow-hidden">
                            <motion.h2 variants={maskUp}
                                className="font-heading font-black uppercase tracking-tighter"
                                style={{ fontSize: 'clamp(38px, 6vw, 80px)', color: DARK_TXT, lineHeight: 0.9 }}
                            >New<br />Arrivals</motion.h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end md:justify-start">
                        <Link to="/products"
                            className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mr-4"
                            style={{ color: PURPLE }}
                        >View All <ArrowUpRight size={13} /></Link>
                        {(['l', 'r'] as const).map(dir => (
                            <motion.button key={dir}
                                onClick={() => track.current?.scrollBy({ left: dir === 'l' ? -320 : 320, behavior: 'smooth' })}
                                whileHover={{ scale: 1.15, background: PURPLE, color: MILKY }}
                                whileTap={{ scale: 0.85 }}
                                disabled={dir === 'l' ? !L : !R}
                                className="w-10 h-10 flex items-center justify-center rounded-full disabled:opacity-20 transition-all"
                                style={{ border: `1.5px solid ${PUR_BORDER}`, color: PURPLE }}
                            >{dir === 'l' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}</motion.button>
                        ))}
                    </div>
                </motion.div>

                <div ref={track} onScroll={sync}
                    className="flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x"
                    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' } as React.CSSProperties}
                >
                    {PRODUCTS.map((p, i) => <PCard key={p.id} p={p} i={i} />)}
                </div>
            </div>
        </section>
    );
};
