import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function VideoShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Unmasking effect: Clips the video from center out
    const clipPath = useTransform(
        scrollYProgress,
        [0.2, 0.8],
        ["inset(20% 20% 20% 20%)", "inset(0% 0% 0% 0%)"]
    );

    const scale = useTransform(scrollYProgress, [0.2, 0.8], [0.9, 1]);

    return (
        <section ref={containerRef} className="h-[120vh] w-full relative bg-black flex items-center justify-center overflow-hidden">
            <motion.div
                style={{ clipPath, scale }}
                className="w-full h-full relative"
            >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="https://videos.pexels.com/video-files/5309381/5309381-hd_1920_1080_25fps.mp4" type="video/mp4" />
                </video>
                {/* Pure visual tint - no text */}
                <div className="absolute inset-0 bg-black/10" />
            </motion.div>
        </section>
    );
}
