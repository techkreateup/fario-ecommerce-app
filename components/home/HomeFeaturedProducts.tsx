import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BG_LIGHT, DARK_TXT, PURPLE, E, PRODUCTS } from './HomeConstants';
import { stg12, fadeUp, maskUp } from './HomeCommon';

const PCard = ({ p, i }: { p: typeof PRODUCTS[0]; i: number }) => {
    const [hov, setHov] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: E }}
            className="group cursor-pointer flex flex-col"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
        >
            {/* Image Container with exactly 12px border radius -> MyDesignation style */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[12px] bg-[#F3F3F3] mb-4">
                <motion.img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    animate={{ scale: hov ? 1.05 : 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />

                {/* Badge top-left */}
                {p.tag && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] sm:text-xs font-bold tracking-wider text-white z-10 whitespace-nowrap"
                         style={{ backgroundColor: DARK_TXT }}>
                        {p.tag}
                    </div>
                )}
                
                {/* Sale percentage badge on the right if needed */}
                {p.orig && (
                    <div className="absolute top-3 right-3 z-20 text-[9px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: `${PURPLE}22`, color: PURPLE }}>
                        -{Math.round((1 - p.price / p.orig) * 100)}%
                    </div>
                )}

                {/* Add to Cart Overlay on Desktop Hover - MyDesignation Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: hov ? 1 : 0, y: hov ? 0 : 20 }}
                    className="absolute bottom-4 left-0 right-0 justify-center hidden lg:flex z-10"
                >
                    <button className="w-[85%] py-3 bg-white text-black font-bold text-xs tracking-widest uppercase shadow-xl hover:bg-[#1a0d2e] hover:text-white transition-colors duration-300 border border-gray-200">
                        Quick Add
                    </button>
                </motion.div>
            </div>

            {/* Typography details aligned CENTER below image exactly like MyDesignation */}
            <div className="text-center flex flex-col gap-1.5 px-1">
                <h3 className="text-sm sm:text-[15px] font-semibold tracking-wide uppercase leading-tight"
                    style={{ color: DARK_TXT }}>
                    {p.name}
                </h3>
                {p.sub && (
                    <span className="text-xs font-medium uppercase tracking-widest" style={{ color: PURPLE }}>{p.sub}</span>
                )}
                <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-sm font-bold" style={{ color: DARK_TXT }}>
                        Rs. {p.price.toLocaleString('en-IN')}
                    </span>
                    {p.orig && (
                        <span className="text-xs line-through opacity-50 font-medium text-gray-500">
                            Rs. {p.orig.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export const HomeFeaturedProducts = () => {
    return (
        <section className="py-12 md:py-20" style={{ background: BG_LIGHT }}>
            <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-[1400px]">
                {/* Header matching MyDesignation Layout Structure */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stg12}
                    className="flex flex-col items-center justify-center mb-10 md:mb-14 text-center"
                >
                    <motion.h2 variants={maskUp}
                        className="text-3xl lg:text-4xl font-serif tracking-tight uppercase"
                        style={{ color: DARK_TXT }}
                    >Fresh Drops</motion.h2>
                    <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-[0.2em] mt-2" style={{ color: PURPLE }}>
                        New Arrivals
                    </motion.p>
                </motion.div>

                {/* MyDesignation exactly defined responsive grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 mb-10">
                    {PRODUCTS.map((p, i) => <PCard key={p.id} p={p} i={i} />)}
                </div>
                
                <div className="flex justify-center mt-6">
                    <Link to="/products" className="px-8 py-3 bg-white border border-[#1a0d2e] text-[#1a0d2e] font-bold text-xs tracking-widest uppercase hover:bg-[#1a0d2e] hover:text-white transition-colors duration-300">
                        View All
                    </Link>
                </div>
            </div>
        </section>
    );
};
