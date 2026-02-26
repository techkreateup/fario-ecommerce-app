import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BG_DARK, LIME, MILKY, V_RUN, V_TYING, V_BEND } from './HomeConstants';

const PanelA = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const vidY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
    const sc = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15]);

    return (
        <div ref={ref} className="relative h-[110vh] overflow-hidden">
            <motion.div style={{ y: vidY, scale: sc }} className="absolute inset-0">
                <video autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }}
                >
                    <source src={V_RUN} type="video/mp4" />
                </video>
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, rgba(15,8,32,0.73) 0%, rgba(122,81,160,0.25) 50%, rgba(15,8,32,0.66) 100%)' }}
                />
            </motion.div>

            <div className="relative h-full flex items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="text-center"
                >
                    <span className="text-xs font-black uppercase tracking-[0.6em] mb-6 block" style={{ color: LIME }}>The Core</span>
                    <h2 className="font-heading font-black uppercase tracking-tighter leading-none"
                        style={{ fontSize: 'clamp(60px, 12vw, 160px)', color: MILKY }}
                    >Unbreakable<br />Identity</h2>
                </motion.div>
            </div>
        </div>
    );
};

const ChapterDivider = ({ num, title }: { num: string, title: string }) => (
    <div className="py-24 px-8 md:px-20 flex flex-col items-center justify-center text-center" style={{ background: '#0a0515' }}>
        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 0.4 }} className="text-[120px] font-heading font-black" style={{ color: LIME, lineHeight: 1 }}>{num}</motion.span>
        <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-xs font-black uppercase tracking-[0.8em] mt-[-40px]" style={{ color: MILKY }}>{title}</motion.h3>
    </div>
);

const PanelB = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const vidY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
    const sc = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.0, 1.08]);

    return (
        <div ref={ref} className="relative h-[110vh] overflow-hidden" style={{ background: BG_DARK }}>
            <motion.div style={{ y: vidY, scale: sc }} className="absolute inset-0 flex items-center justify-center">
                <video autoPlay muted loop playsInline
                    className="w-full h-full md:w-[60%] md:h-auto object-cover opacity-50"
                    onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }}
                >
                    <source src={V_TYING} type="video/mp4" />
                </video>
                <div className="absolute inset-0" style={{ background: 'rgba(122,81,160,0.30)' }} />
                <div className="absolute inset-x-0 top-0 h-32"
                    style={{ background: 'linear-gradient(to bottom, #0a0515, transparent)' }}
                />
                <div className="absolute inset-x-0 bottom-0 h-32"
                    style={{ background: 'linear-gradient(to top, #0a0515, transparent)' }}
                />
            </motion.div>

            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 pointer-events-none">
                <div className="max-w-3xl">
                    <motion.p initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} className="text-sm font-bold uppercase tracking-[0.4em] mb-8" style={{ color: LIME }}>— Performance Architecture</motion.p>
                    <h2 className="font-heading font-black uppercase tracking-tighter leading-none"
                        style={{ fontSize: 'clamp(48px, 8vw, 110px)', color: MILKY }}
                    >Engineered<br /><span style={{ color: LIME }}>To Outperform</span></h2>
                </div>
            </div>
        </div>
    );
};

const PanelC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const vidY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
    const sc = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

    return (
        <div ref={ref} className="relative h-[110vh] overflow-hidden">
            <motion.div style={{ y: vidY, scale: sc }} className="absolute inset-0">
                <video autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-55"
                    onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }}
                >
                    <source src={V_BEND} type="video/mp4" />
                </video>
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(15,8,32,0.80) 0%, rgba(26,13,46,0.50) 50%, rgba(15,8,32,0.93) 100%)' }}
                />
            </motion.div>

            <div className="relative h-full flex flex-col items-center justify-center p-8">
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className="text-center max-w-2xl bg-black/40 backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/5">
                    <h3 className="font-heading font-black uppercase text-4xl md:text-6xl mb-6" style={{ color: MILKY }}>Join the Elite</h3>
                    <p className="text-base opacity-60 leading-loose mb-10" style={{ color: MILKY }}>Fario isn't just a shoe. It's an investment in your motion. Experience the evolution of footwear technology today.</p>
                    <button className="px-14 py-5 font-black text-sm uppercase tracking-[0.3em]" style={{ background: LIME, color: '#0a0515' }}>Shop Collection</button>
                </motion.div>
            </div>
        </div>
    );
};

export const HomeParallaxVideoReel = () => (
    <section className="bg-black">
        <PanelC />
    </section>
);
