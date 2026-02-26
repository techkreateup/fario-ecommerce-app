import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const chapters = [
    {
        tag: 'Origin',
        emoji: '🇮🇳',
        heading: 'Born in India.',
        preview: "We didn't copy the West. We studied it — then outbuilt it.",
        full: "We didn't copy the West. We studied it — then outbuilt it. Fario is proof that Indian design can lead the world. What started in a garage became a movement.",
        bg: 'linear-gradient(135deg, #f0ebff 0%, #e8e0ff 100%)',
        dark: false,
        accent: '#7C3AED',
        tagBg: 'rgba(124,58,237,0.1)',
        tagColor: '#7C3AED',
        shineColor: 'rgba(124,58,237,0.12)',
    },
    {
        tag: 'Craft',
        emoji: '🔧',
        heading: 'Every stitch is a decision.',
        preview: '14 prototype stages. Hundreds of rejected soles.',
        full: '14 prototype stages. Hundreds of rejected soles. One obsession: not good enough — Perfect. Every material was sourced, tested, rejected, and sourced again until we got it right.',
        bg: 'linear-gradient(135deg, #1a0d2e 0%, #2d1459 100%)',
        dark: true,
        accent: '#d9f99d',
        tagBg: 'rgba(217,249,157,0.1)',
        tagColor: '#d9f99d',
        shineColor: 'rgba(217,249,157,0.08)',
    },
    {
        tag: 'Material',
        emoji: '⚗️',
        heading: 'Science in every sole.',
        preview: 'Memory foam. Anti-skid tread. Antimicrobial lining.',
        full: 'Memory foam that remembers the contour of your foot. Anti-skid tread engineered for wet marble. Antimicrobial lining tested for 72-hour wear. We didn\'t find these materials. We demanded them.',
        bg: 'linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)',
        dark: true,
        accent: '#d9f99d',
        tagBg: 'rgba(255,255,255,0.1)',
        tagColor: '#d9f99d',
        shineColor: 'rgba(255,255,255,0.07)',
    },
    {
        tag: 'Purpose',
        emoji: '🚀',
        heading: 'Built for those who move.',
        preview: 'Students. Athletes. Founders. If your day demands everything—',
        full: 'Students. Athletes. Founders. Dreamers. Hustlers. If your day demands everything — Fario gives it back with interest. Designed for the ones who refuse to slow down.',
        bg: 'linear-gradient(135deg, #0f0820 0%, #1a0d2e 100%)',
        dark: true,
        accent: '#a78bfa',
        tagBg: 'rgba(167,139,250,0.1)',
        tagColor: '#a78bfa',
        shineColor: 'rgba(167,139,250,0.07)',
    },
    {
        tag: 'Legacy',
        emoji: '👑',
        heading: 'Just the beginning.',
        preview: "We're building a generation's first premium Indian footwear brand.",
        full: "We're building a generation's first premium Indian footwear brand. History is being written one pair at a time. The world will know the name. Step in now — before everyone does.",
        bg: 'linear-gradient(135deg, #d9f99d 0%, #a3e635 100%)',
        dark: false,
        accent: '#1a0d2e',
        tagBg: 'rgba(26,13,46,0.08)',
        tagColor: '#1a0d2e',
        shineColor: 'rgba(26,13,46,0.06)',
    },
];

/* Shine overlay on hover */
const ShineCard: React.FC<{ dark: boolean; shineColor: string; children: React.ReactNode; style: React.CSSProperties }> = ({
    _dark, shineColor, children, style
}) => {
    const [pos, setPos] = useState({ x: 50, y: 50 });
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative overflow-hidden rounded-[28px] select-none"
            style={style}
            onMouseMove={(e) => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered && (
                <div
                    className="absolute inset-0 pointer-events-none rounded-[28px] transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${shineColor} 0%, transparent 65%)`,
                        zIndex: 1,
                    }}
                />
            )}
            {children}
        </div>
    );
};

export const HomeMonologue: React.FC = () => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState<number | null>(null);
    let pressing = false, startX = 0, scrollSnap = 0;

    const onDown = (e: React.MouseEvent) => {
        if (!trackRef.current) return;
        pressing = true;
        startX = e.pageX - trackRef.current.offsetLeft;
        scrollSnap = trackRef.current.scrollLeft;
        trackRef.current.style.cursor = 'grabbing';
    };
    const onMove = (e: React.MouseEvent) => {
        if (!pressing || !trackRef.current) return;
        e.preventDefault();
        trackRef.current.scrollLeft = scrollSnap - (e.pageX - trackRef.current.offsetLeft - startX);
    };
    const onUp = () => {
        pressing = false;
        if (trackRef.current) trackRef.current.style.cursor = 'grab';
    };

    return (
        <section className="relative py-20 overflow-hidden" style={{ background: '#F5F0FF' }}>
            {/* Header */}
            <div className="px-6 md:px-16 mb-10">
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 rounded-full bg-purple-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-purple-500">The Fario Story</span>
                    </div>
                    <h2 className="font-heading font-black uppercase tracking-tighter text-[#1a0d2e] leading-none mb-2"
                        style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
                        Our Monologue.
                    </h2>
                    <p className="text-xs text-[#1a0d2e]/40 font-semibold tracking-widest flex items-center gap-2">
                        <span>👆 Drag to explore →</span>
                    </p>
                </motion.div>
            </div>

            {/* Track */}
            <div
                ref={trackRef}
                className="flex gap-4 px-6 md:px-16 pb-6 overflow-x-auto"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab', WebkitOverflowScrolling: 'touch' }}
                onMouseDown={onDown}
                onMouseMove={onMove}
                onMouseUp={onUp}
                onMouseLeave={onUp}
            >
                {chapters.map((ch, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40, scale: 0.93 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.07 }}
                        className="flex-shrink-0"
                        style={{ width: 'min(300px, 78vw)' }}
                    >
                        <ShineCard
                            dark={ch.dark}
                            shineColor={ch.shineColor}
                            style={{
                                background: ch.bg,
                                minHeight: expanded === i ? 'auto' : '360px',
                                padding: '30px 26px',
                                boxShadow: ch.dark ? '0 28px 70px rgba(0,0,0,0.5)' : '0 14px 45px rgba(122,81,160,0.18)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            {/* Top */}
                            <div className="relative z-10">
                                <div className="text-4xl mb-4 leading-none">{ch.emoji}</div>
                                <span
                                    className="inline-block text-[9px] font-black uppercase tracking-[0.55em] mb-5 px-3 py-1.5 rounded-full"
                                    style={{ background: ch.tagBg, color: ch.tagColor }}
                                >
                                    {ch.tag}
                                </span>
                                <h3
                                    className="font-heading font-black uppercase leading-tight mb-3"
                                    style={{
                                        fontSize: 'clamp(20px, 2.6vw, 27px)',
                                        color: ch.dark ? '#fff' : '#1a0d2e',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    {ch.heading}
                                </h3>
                                <AnimatePresence mode="wait">
                                    {expanded === i ? (
                                        <motion.p key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="text-sm leading-relaxed" style={{ color: ch.dark ? 'rgba(255,255,255,0.55)' : 'rgba(26,13,46,0.62)' }}>
                                            {ch.full}
                                        </motion.p>
                                    ) : (
                                        <motion.p key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="text-sm leading-relaxed" style={{ color: ch.dark ? 'rgba(255,255,255,0.5)' : 'rgba(26,13,46,0.55)' }}>
                                            {ch.preview}
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                {/* Read More */}
                                <button
                                    className="mt-4 text-[10px] font-black uppercase tracking-widest underline underline-offset-4 transition-opacity hover:opacity-80"
                                    style={{ color: ch.accent }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); setExpanded(expanded === i ? null : i); }}
                                >
                                    {expanded === i ? 'Read Less ↑' : 'Read More ↓'}
                                </button>
                            </div>

                            {/* Bottom */}
                            <div className="relative z-10 mt-8 flex items-center justify-between">
                                <div className="h-[3px] w-10 rounded-full" style={{ background: ch.accent }} />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30"
                                    style={{ color: ch.dark ? '#fff' : '#1a0d2e' }}>FARIO</span>
                            </div>
                        </ShineCard>
                    </motion.div>
                ))}

                {/* CTA end card */}
                <motion.div
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="flex-shrink-0 rounded-[28px] flex flex-col items-center justify-center text-center gap-4 select-none"
                    style={{
                        width: '190px', minHeight: '360px',
                        background: 'linear-gradient(160deg, #7C3AED 0%, #3b0764 100%)',
                        padding: '28px 20px',
                        boxShadow: '0 24px 60px rgba(124,58,237,0.45)',
                    }}
                >
                    <div className="text-5xl">👟</div>
                    <div>
                        <div className="text-white font-black text-sm uppercase tracking-widest leading-tight mb-1">Shop</div>
                        <div className="text-white/60 text-xs">the Story</div>
                    </div>
                    <a href="/products"
                        className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider hover:scale-105 transition-transform"
                        style={{ background: '#d9f99d', color: '#1a0d2e' }}
                        onClick={(e) => e.stopPropagation()}>
                        Browse →
                    </a>
                </motion.div>
            </div>
            <style>{`div::-webkit-scrollbar{display:none}`}</style>
        </section>
    );
};
