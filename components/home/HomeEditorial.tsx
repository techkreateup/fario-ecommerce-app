import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { BG_MID, DARK_TXT, PURPLE, MILKY, LIME, HL3 } from './HomeConstants';
import { maskUp, fadeUp, stg12 } from './HomeCommon';
import { Tilt, PImg } from './HomeCommon';

export const HomeEditorial = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y1 = useTransform(scrollYProgress, [0, 1], [70, -70]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

    return (
        <section ref={ref} className="py-12 md:py-24 overflow-hidden" style={{ background: BG_MID }}>
            <div className="container mx-auto px-4 md:px-12 lg:px-20">
                <div className="grid grid-cols-12 gap-4 md:gap-8 items-end">
                    {/* Tall left image */}
                    <motion.div style={{ y: y1 }} className="col-span-5 md:col-span-4 h-[40vh] md:h-[68vh] relative">
                        <Tilt cls="h-full">
                            <PImg src={HL3.a} alt="AeroStride Pro" px={50} cls="h-full w-full rounded-2xl overflow-hidden" />
                        </Tilt>
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 p-6 rounded-b-2xl"
                            style={{ background: `linear-gradient(to top, ${DARK_TXT}EE, transparent)` }}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        >
                            <span className="text-xs uppercase tracking-widest" style={{ color: LIME }}>AeroStride Pro</span>
                            <p className="font-heading font-black uppercase text-xl" style={{ color: MILKY }}>Rs. 12,999</p>
                        </motion.div>
                    </motion.div>

                    {/* Center text */}
                    <div className="col-span-7 md:col-span-8 lg:col-span-4 flex flex-col justify-end gap-6 pb-8">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stg12}>
                            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.4em] mb-5"
                                style={{ color: PURPLE }}
                            >New Collection 2026</motion.p>
                            <div className="overflow-hidden mb-6">
                                <motion.h2 variants={maskUp}
                                    className="font-heading font-black uppercase tracking-tighter leading-tight"
                                    style={{ fontSize: 'clamp(38px, 5vw, 66px)', color: DARK_TXT }}
                                >The Art<br />of Motion</motion.h2>
                            </div>
                            <motion.p variants={fadeUp} className="text-base leading-loose opacity-70 mb-8" style={{ color: DARK_TXT }}>
                                14 prototype stages. Advanced memory foam. Anti-skid grip. Freshness control. Everything in one shoe.
                            </motion.p>
                            <motion.div variants={fadeUp} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}>
                                <Link to="/products"
                                    className="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] rounded-none transition"
                                    style={{ background: PURPLE, color: MILKY }}
                                >Explore <ArrowUpRight size={15} /></Link>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right stacked images */}
                    <motion.div style={{ y: y2 }} className="hidden md:flex md:col-span-4 flex-col gap-4">
                        <Tilt cls="h-[42vh] rounded-2xl overflow-hidden">
                            <PImg src={HL3.b} alt="Urban Glide" px={32} cls="h-full w-full" />
                        </Tilt>
                        <Tilt cls="h-[23vh] rounded-2xl overflow-hidden">
                            <PImg src={HL3.c} alt="Midnight Force" px={22} cls="h-full w-full" />
                        </Tilt>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
