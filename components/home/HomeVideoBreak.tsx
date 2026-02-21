import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BG_DARK, LIME, MILKY, V1, HL3 } from './HomeConstants';
import { VidEl, SplitText } from './HomeCommon';

export const HomeVideoBreak = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const sc = useTransform(scrollYProgress, [0, 1], [1.2, 1.0]);

    return (
        <section ref={ref} className="relative h-[65vh] overflow-hidden flex items-center justify-center"
            style={{ background: BG_DARK }}
        >
            <motion.div style={{ scale: sc }} className="absolute inset-0">
                <VidEl src={V1} poster={HL3.b} cls="opacity-55" />
                <div className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, ${BG_DARK} 0%, rgba(26,13,46,0.65) 40%, ${BG_DARK} 100%)` }}
                />
                <div className="absolute inset-0" style={{ background: 'rgba(122,81,160,0.15)' }} />
            </motion.div>

            <div className="relative z-10 text-center px-6">
                <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.35em] mb-8"
                    style={{ background: `${LIME}18`, color: LIME, border: `1px solid ${LIME}40` }}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >★ The Fario Standard</motion.div>

                <h2 className="font-heading font-black uppercase tracking-tighter leading-none"
                    style={{ fontSize: 'clamp(48px, 9vw, 120px)', color: MILKY }}
                >
                    <div className="overflow-hidden"><SplitText text="Every" cls="block" /></div>
                    <div className="overflow-hidden"><SplitText text="Step" cls="block" delay={0.18} stroke={LIME} /></div>
                    <div className="overflow-hidden"><SplitText text="Counts" cls="block" delay={0.36} /></div>
                </h2>
            </div>
        </section>
    );
};
