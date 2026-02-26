import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { E, HL3, PURPLE, LIME, MILKY, DARK_TXT, PUR_BORDER } from './HomeConstants';

/** 3D tilt on mouse move */
export const Tilt = ({ children, cls = '' }: { children: React.ReactNode; cls?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const rX = useTransform(my, [-0.5, 0.5], [10, -10]);
    const rY = useTransform(mx, [-0.5, 0.5], [-10, 10]);
    const move = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
    }, [mx, my]);
    return (
        <motion.div ref={ref}
            style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d', perspective: 900 }}
            onMouseMove={move}
            onMouseLeave={() => { mx.set(0); my.set(0); }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
            className={cls}
        >{children}</motion.div>
    );
};

/** Scroll parallax image */
export const PImg = ({ src, alt, px = 36, cls = '' }: { src: string; alt: string; px?: number; cls?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], [-px, px]);
    return (
        <div ref={ref} className={`overflow-hidden ${cls}`}>
            <motion.img src={src} alt={alt}
                style={{ y, scale: 1.12 }}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.18, filter: 'brightness(1.06)' }}
                whileTap={{ scale: 1.06 }}
                transition={{ duration: 0.5 }}
                onError={e => { (e.target as HTMLImageElement).src = HL3.a; }}
            />
        </div>
    );
};

/** Char-by-char text animation */
export const SplitText = ({
    text, cls, delay = 0, stroke,
}: { text: string; cls?: string; delay?: number; stroke?: string }) => (
    <span className={`inline-flex flex-wrap ${cls ?? ''}`} aria-label={text}>
        {text.split('').map((ch, i) => (
            <motion.span key={i}
                initial={{ opacity: 0, y: '70%', rotateX: -45 }}
                whileInView={{ opacity: 1, y: '0%', rotateX: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: E, delay: delay + i * 0.032 }}
                style={{
                    display: ch === ' ' ? 'inline' : 'inline-block',
                    ...(stroke ? { WebkitTextStroke: `2px ${stroke}`, color: 'transparent' } : {}),
                }}
            >{ch === ' ' ? '\u00a0' : ch}</motion.span>
        ))}
    </span>
);

/** Video element */
export const VidEl = ({ src, poster, cls }: { src: string; poster: string; cls?: string }) => (
    <video autoPlay muted loop playsInline poster={poster}
        className={`absolute inset-0 w-full h-full object-cover ${cls ?? ''}`}
        onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }}
    >
        <source src={src} type="video/mp4" />
    </video>
);

export const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: E } } };
export const maskUp = {
    hidden: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
    visible: { clipPath: 'inset(0% 0 0 0)', opacity: 1, transition: { duration: 1.1, ease: E } },
};
export const stg12 = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
