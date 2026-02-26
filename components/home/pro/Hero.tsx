import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Parallax: Video moves slower than scroll
    const y = useTransform(scrollY, [0, 1000], [0, 400]);

    // Mask Expansion: Text reveals video behind it on load
    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black text-white">
            {/* Background Video Layer */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1920&q=80"
                    className="h-full w-full object-cover opacity-60"
                >
                    {/* High Quality Walking Shot */}
                    <source src="https://cdn.pixabay.com/video/2019/05/29/24036-339232938_large.mp4" type="video/mp4" />
                </video>
            </motion.div>

            {/* Hero Content - Kinetic Typography */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center">
                <motion.div
                    initial={{ clipPath: 'inset(100% 0% 0% 0%)', y: 100 }}
                    animate={{ clipPath: 'inset(0% 0% 0% 0%)', y: 0 }}
                    transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1], delay: 0.5 }}
                >
                    <h1 className="text-[15vw] leading-[0.8] font-black tracking-tighter mix-blend-difference">
                        FARIO
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 1.5 }}
                    className="mt-8 flex gap-8 text-sm tracking-[0.2em] font-medium uppercase"
                >
                    <span>Est. 2026</span>
                    <span>•</span>
                    <span>Luxury Footwear</span>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="text-[10px] tracking-widest uppercase">Scroll</div>
                <div className="w-[1px] h-12 bg-white/50 overflow-hidden">
                    <motion.div
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-full h-full bg-white"
                    />
                </div>
            </motion.div>
        </div>
    );
}
