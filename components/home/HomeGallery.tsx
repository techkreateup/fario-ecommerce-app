
import { motion } from 'framer-motion';
import { DARK_TXT, PURPLE, LIME, GALLERY, E } from './HomeConstants';
import { PImg } from './HomeCommon';
import { useNavigate } from 'react-router-dom';

export const HomeGallery = () => {
    const navigate = useNavigate();

    return (
        <section className="py-12 md:py-24" style={{ background: '#F5F0FF' }}>
            <div className="container mx-auto px-4 md:px-16">
                {/* Header */}
                <div className="text-center mb-14">
                    <motion.p
                        initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
                        className="text-xs uppercase tracking-[0.4em] mb-3"
                        style={{ color: PURPLE }}
                    >
                        The Full Range
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="font-heading font-black uppercase tracking-tighter"
                        style={{ fontSize: 'clamp(34px, 5vw, 68px)', color: DARK_TXT }}
                    >
                        Our Gallery
                    </motion.h2>
                </div>

                {/* 4-col grid — 4 per row, wraps to next row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10">
                    {GALLERY.map((g, i) => (
                        <motion.div
                            key={g.label}
                            onClick={() => navigate('/products')}
                            className="flex flex-col items-center cursor-pointer group"
                            initial={{ opacity: 0, y: 30, scale: 0.88 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ delay: i * 0.06, duration: 0.5, ease: E }}
                            whileHover={{ y: -8 }}
                        >
                            {/* Circle */}
                            <div className="relative mb-4 w-full flex justify-center">
                                {/* Glow ring */}
                                <motion.div
                                    className="absolute rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                                    style={{
                                        inset: '-6px',
                                        boxShadow: `0 0 0 3px ${LIME}, 0 0 28px ${LIME}55`,
                                        borderRadius: '50%',
                                    }}
                                />

                                {/* Image circle */}
                                <div
                                    className="w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 transition-all duration-400 group-hover:border-[#d9f99d] relative flex-shrink-0"
                                    style={{
                                        borderColor: 'rgba(122,81,160,0.22)',
                                        background: 'linear-gradient(145deg, #EDE7F6 0%, #fff 100%)',
                                        boxShadow: '0 10px 36px rgba(122,81,160,0.18), 0 2px 8px rgba(0,0,0,0.06)',
                                    }}
                                >
                                    <PImg
                                        src={g.img}
                                        alt={g.label}
                                        px={0}
                                        cls="absolute inset-0 group-hover:scale-110 transition-transform duration-600"
                                    />
                                </div>

                                {/* F badge */}
                                <div
                                    className="absolute bottom-0 right-[calc(50%-56px)] sm:right-[calc(50%-62px)] md:right-[calc(50%-80px)] w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black z-10 translate-x-1/2 translate-y-1/2"
                                    style={{ background: PURPLE, color: LIME, boxShadow: '0 4px 12px rgba(122,81,160,0.5)' }}
                                >
                                    F
                                </div>
                            </div>

                            {/* Name */}
                            <span
                                className="text-xs sm:text-sm font-black uppercase tracking-wider text-center mt-1 group-hover:text-purple-600 transition-colors duration-300"
                                style={{ color: DARK_TXT }}
                            >
                                {g.label}
                            </span>

                            {/* Lime underline */}
                            <div className="mt-1.5 h-0.5 rounded-full w-0 group-hover:w-10 transition-all duration-400"
                                style={{ background: LIME }} />
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-14"
                >
                    <button
                        onClick={() => navigate('/products')}
                        className="px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                        style={{ background: PURPLE, color: '#fff', boxShadow: '0 8px 32px rgba(122,81,160,0.35)' }}
                    >
                        View All Products →
                    </button>
                </motion.div>
            </div>
        </section>
    );
};
