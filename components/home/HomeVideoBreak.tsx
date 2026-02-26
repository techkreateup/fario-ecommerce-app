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
                <VidEl src={V1} poster={HL3.b} cls="opacity-100" />
            </motion.div>

            <div className="relative z-10 text-center px-6">
                {/* Text removed for full video visibility */}
            </div>
        </section>
    );
};
