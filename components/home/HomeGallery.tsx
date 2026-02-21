import React from 'react';
import { motion } from 'framer-motion';
import { BG_MID, DARK_TXT, PURPLE, LIME, MILKY, GALLERY, E } from './HomeConstants';
import { stg12, fadeUp, maskUp } from './HomeCommon';
import { PImg } from './HomeCommon';

export const HomeGallery = () => (
    <section className="py-32" style={{ background: BG_MID }}>
        <div className="container mx-auto px-8 md:px-20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stg12}
                className="text-center mb-20"
            >
                <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: PURPLE }}>
                    The Full Range
                </motion.p>
                <div className="overflow-hidden">
                    <motion.h2 variants={maskUp}
                        className="font-heading font-black uppercase tracking-tighter"
                        style={{ fontSize: 'clamp(40px, 6vw, 80px)', color: DARK_TXT }}
                    >Our Gallery</motion.h2>
                </div>
            </motion.div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[200px]">
                {GALLERY.map((g, i) => (
                    <motion.div key={g.label}
                        className={`relative group cursor-pointer overflow-hidden rounded-xl ${g.cls}`}
                        initial={{ opacity: 0, scale: 0.93 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.05 }}
                        transition={{ delay: i * 0.07, duration: 0.65, ease: E }}
                    >
                        <PImg src={g.img} alt={g.label} px={28} cls="absolute inset-0" />
                        <motion.div
                            className="absolute inset-0 flex items-end p-5 rounded-xl"
                            initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }}
                            style={{ background: `linear-gradient(to top, ${DARK_TXT}CC, transparent)` }}
                        >
                            <span className="font-heading font-black uppercase text-base" style={{ color: MILKY }}>{g.label}</span>
                        </motion.div>
                        <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ boxShadow: `inset 0 0 0 2px ${LIME}` }}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);
