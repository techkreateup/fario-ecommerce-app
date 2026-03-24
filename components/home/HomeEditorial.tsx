import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { BG_MID, DARK_TXT, PURPLE, MILKY, LIME, HL3 } from './HomeConstants';
import { maskUp, fadeUp, stg12 } from './HomeCommon';
import { Tilt, PImg } from './HomeCommon';

// ─────────────────────────────────────────────────────────────────────────────
// HomeEditorial — Mobile-first fix
// Mobile (<md): single column — 1 image on top, text below. No stacking chaos.
// Desktop (md+): Original 3-column parallax layout perfectly preserved.
// ─────────────────────────────────────────────────────────────────────────────

export const HomeEditorial = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y1 = useTransform(scrollYProgress, [0, 1], [70, -70]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

    return (
        <section ref={ref} className="py-10 md:py-24 overflow-hidden" style={{ background: BG_MID }}>
            <div className="container mx-auto px-4 md:px-12 lg:px-20">

                {/* ── MOBILE: single column ────────────────────────────── */}
                <div className="md:hidden flex flex-col gap-6">
                    {/* Single hero image — crisp, no stacking */}
                    <div className="w-full h-[52vw] max-h-[300px] min-h-[200px] relative rounded-2xl overflow-hidden">
                        <PImg src={HL3.a} alt="AeroStride Pro" px={50} cls="h-full w-full rounded-2xl overflow-hidden" />
                        <div
                            className="absolute bottom-0 left-0 right-0 p-4 rounded-b-2xl"
                            style={{ background: `linear-gradient(to top, ${DARK_TXT}EE, transparent)` }}
                        >
                            <span className="text-xs uppercase tracking-widest" style={{ color: LIME }}>AeroStride Pro</span>
                            <p className="font-heading font-black uppercase text-base" style={{ color: MILKY }}>Rs. 12,999</p>
                        </div>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-4">
                        <p className="text-xs font-bold uppercase tracking-[0.4em]" style={{ color: PURPLE }}>New Collection 2026</p>
                        <h2
                            className="font-heading font-black uppercase tracking-tighter leading-[0.9]"
                            style={{ fontSize: 'clamp(32px, 10vw, 56px)', color: DARK_TXT }}
                        >
                            The Art<br />of Motion
                        </h2>
                        <p className="text-sm leading-relaxed opacity-70" style={{ color: DARK_TXT }}>
                            14 prototype stages. Advanced memory foam. Anti-skid grip. Freshness control. Everything in one shoe.
                        </p>
                        <Link
                            to="/products"
                            className="self-start flex items-center gap-2 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2em] transition hover:opacity-90"
                            style={{ background: PURPLE, color: MILKY }}
                        >
                            Explore <ArrowUpRight size={15} />
                        </Link>
                    </div>
                </div>

                {/* ── DESKTOP: original 3-column parallax ──────────────── */}
                <div className="hidden md:flex md:grid md:grid-cols-12 gap-10 items-start md:items-end">
                    {/* Tall left image */}
                    <motion.div style={{ y: y1 }} className="col-span-4 h-[40vh] lg:h-[68vh] relative">
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
                    <div className="col-span-4 flex flex-col justify-end gap-6 pb-8">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stg12}>
                            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.4em] mb-5" style={{ color: PURPLE }}>
                                New Collection 2026
                            </motion.p>
                            <div className="overflow-hidden mb-6 w-full">
                                <motion.h2 variants={maskUp}
                                    className="font-heading font-black uppercase tracking-tighter leading-tight break-words"
                                    style={{ fontSize: 'clamp(28px, 11vw, 66px)', color: DARK_TXT }}
                                >The Art<br />of Motion</motion.h2>
                            </div>
                            <motion.p variants={fadeUp} className="text-base leading-loose opacity-70 mb-8" style={{ color: DARK_TXT }}>
                                14 prototype stages. Advanced memory foam. Anti-skid grip. Freshness control. Everything in one shoe.
                            </motion.p>
                            <motion.div variants={fadeUp} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}>
                                <Link to="/products"
                                    className="flex justify-center items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] rounded-none transition hover:opacity-90 w-full md:w-auto"
                                    style={{ background: PURPLE, color: MILKY }}
                                >Explore <ArrowUpRight size={15} /></Link>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right stacked images */}
                    <motion.div style={{ y: y2 }} className="col-span-4 flex flex-col gap-4">
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
