
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BG_DARK2, LIME, MILKY, PURPLE, DARK_TXT, E, V1, HL3 } from './HomeConstants';
import { VidEl, SplitText } from './HomeCommon';

export const HomeHero = () => {
    const { scrollY } = useScroll();
    const vY = useTransform(scrollY, [0, 800], ['0%', '25%']);
    const op = useTransform(scrollY, [0, 500], [1, 0]);
    const tY = useTransform(scrollY, [0, 500], ['0%', '35%']);

    return (
        <section className="relative flex flex-col justify-center"
            style={{ background: BG_DARK2, minHeight: '100vh' }}
        >
            {/* VIDEO */}
            <motion.div style={{ y: vY }} className="absolute inset-0 scale-110">
                <VidEl src={V1} poster={HL3.a} cls="opacity-80" />
                <div className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, ${BG_DARK2} 0%, rgba(26,13,46,0.35) 45%, rgba(122,81,160,0.10) 100%)` }}
                />
                <div className="absolute inset-0"
                    style={{ background: `linear-gradient(to right, rgba(26,13,46,0.50) 0%, transparent 55%)` }}
                />
            </motion.div>

            {/* Animated lime accent line */}
            <motion.div className="absolute top-0 left-0 right-0 h-1 z-20"
                style={{ background: `linear-gradient(to right, ${PURPLE}, ${LIME}, ${PURPLE})` }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            />

            {/* Floating lime dots */}
            {[10, 22, 38, 55, 70, 85].map((left, i) => (
                <motion.div key={i}
                    className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                    style={{ left: `${left}%`, top: `${18 + (i % 4) * 14}%`, background: LIME }}
                    animate={{ y: [-10, 10, -10], opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.3, 0.8] }}
                    transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                />
            ))}

            {/* Grain */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }}
            />

            {/* Content */}
            <motion.div
                style={{ y: tY, opacity: op, paddingTop: 'clamp(3.5rem, 8vh, 6rem)', paddingBottom: 'clamp(2rem, 5vh, 4rem)' }}
                className="relative z-10 px-6 md:px-20"
            >
                <motion.div
                    initial={{ opacity: 0, letterSpacing: '0.6em' }}
                    animate={{ opacity: 1, letterSpacing: '0.3em' }}
                    transition={{ duration: 1.5, ease: E }}
                    className="text-xs font-bold uppercase mb-10 inline-flex items-center gap-3 px-4 py-2 rounded-full"
                    style={{ background: `${LIME}22`, color: LIME, border: `1px solid ${LIME}44` }}
                >✧ New Delhi · Est. 2024 · Collection 2026</motion.div>

                <h1 className="font-heading font-black uppercase tracking-tighter leading-[0.85] mb-8"
                    style={{ fontSize: 'clamp(48px, 10vw, 130px)', color: MILKY }}
                >
                    <div><SplitText text="Born" cls="block" /></div>
                    <div><SplitText text="for" cls="block" delay={0.14} stroke={LIME} /></div>
                    <div><SplitText text="Luxury" cls="block" delay={0.28} /></div>
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.9 }}
                    className="text-base md:text-xl max-w-lg leading-relaxed mb-12 opacity-70"
                    style={{ color: MILKY }}
                >Handcrafted in India. Premium quality. Unbeatable comfort.</motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-none"
                >
                    <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.07, boxShadow: `0 0 40px ${LIME}55` }} whileTap={{ scale: 0.93 }}>
                        <Link to="/products"
                            className="flex justify-center items-center gap-3 px-6 sm:px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] w-full"
                            style={{ background: LIME, color: DARK_TXT }}
                        >Shop Now <ArrowRight size={16} /></Link>
                    </motion.div>
                    <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}>
                        <Link to="/story"
                            className="flex justify-center items-center gap-3 px-6 sm:px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] transition w-full"
                            style={{ border: `1.5px solid ${LIME}55`, color: MILKY }}
                        >Our Story</Link>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Animated scroll bar */}
            <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            >
                <div className="w-px h-14 relative overflow-hidden" style={{ background: `${LIME}30` }}>
                    <motion.div className="w-full absolute left-0"
                        style={{ height: '40%', background: LIME }}
                        animate={{ top: ['-40%', '140%'] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                    />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: LIME, opacity: 0.6 }}>Scroll</span>
            </motion.div>
        </section>
    );
};
