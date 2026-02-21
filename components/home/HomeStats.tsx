import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BG_LIGHT, PURPLE, DARK_TXT, E, HL3 } from './HomeConstants';
import { stg12, fadeUp, maskUp } from './HomeCommon';

const MEDIA_ITEMS = [
    { id: 1, vid: "https://videos.pexels.com/video-files/7203595/7203595-hd_1280_720_30fps.mp4", img: HL3.a },
    { id: 2, vid: "https://videos.pexels.com/video-files/8533495/8533495-hd_1280_720_30fps.mp4", img: HL3.b },
    { id: 3, vid: "https://videos.pexels.com/video-files/6116858/6116858-hd_1920_1080_30fps.mp4", img: HL3.c },
    { id: 4, vid: "https://videos.pexels.com/video-files/4434937/4434937-hd_1280_720_30fps.mp4", img: HL3.e },
    { id: 5, vid: "https://videos.pexels.com/video-files/4452587/4452587-hd_1280_720_30fps.mp4", img: HL3.f },
    { id: 6, vid: "https://videos.pexels.com/video-files/8083684/8083684-hd_1280_720_30fps.mp4", img: HL3.g },
    { id: 7, vid: "https://videos.pexels.com/video-files/5359145/5359145-hd_1280_720_30fps.mp4", img: HL3.h },
    { id: 8, vid: "https://videos.pexels.com/video-files/5700368/5700368-hd_1280_720_30fps.mp4", img: HL3.a },
];

const InteractiveCircle = ({ vid, img, index }: { vid: string; img: string; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <motion.div
            className="relative group cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: E }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
        >
            <motion.div
                className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden relative z-10 border-2 border-white/20 shadow-2xl"
                animate={{
                    scale: isHovered ? 1.1 : 1,
                    boxShadow: isHovered ? `0 0 40px ${PURPLE}44` : "0 10px 30px rgba(0,0,0,0.1)"
                }}
                transition={{ duration: 0.4, ease: E }}
            >
                {/* Thumbnail Image */}
                <motion.img
                    src={img}
                    alt="Luxury Shoe"
                    className="w-full h-full object-cover"
                    animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 1.2 : 1 }}
                />

                {/* Video reveal on hover */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.video
                            ref={videoRef}
                            src={vid}
                            autoPlay
                            muted
                            loop
                            playsInline
                            initial={{ opacity: 0, scale: 1.2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="absolute inset-0 w-full h-full object-cover z-20"
                        />
                    )}
                </AnimatePresence>

                {/* Glassy overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-30 pointer-events-none" />
            </motion.div>

            {/* Animated background glow */}
            <motion.div
                className="absolute inset-0 rounded-full blur-2xl z-0"
                style={{ background: PURPLE }}
                animate={{
                    opacity: isHovered ? 0.35 : 0,
                    scale: isHovered ? 1.4 : 1
                }}
            />
        </motion.div>
    );
};

export const HomeStats = () => (
    <section className="py-24 relative overflow-hidden" style={{ background: BG_LIGHT }}>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[120px] opacity-10" style={{ background: PURPLE, translate: '-50% -50%' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[140px] opacity-10" style={{ background: PURPLE, translate: '50% 50%' }} />

        <div className="container mx-auto px-8 md:px-20 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stg12} className="mb-20">
                <motion.p variants={fadeUp} className="text-xs font-black uppercase tracking-[0.5em] mb-4" style={{ color: PURPLE }}>Aura of Excellence</motion.p>
                <div className="overflow-hidden">
                    <motion.h2 variants={maskUp}
                        className="font-heading font-black uppercase tracking-tighter"
                        style={{ fontSize: 'clamp(32px, 4vw, 54px)', color: DARK_TXT }}
                    >Cinematic Craft</motion.h2>
                </div>
            </motion.div>

            {/* Interactive Circles Grid */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                {MEDIA_ITEMS.map((item, i) => (
                    <InteractiveCircle key={item.id} {...item} index={i} />
                ))}
            </div>
        </div>
    </section>
);
